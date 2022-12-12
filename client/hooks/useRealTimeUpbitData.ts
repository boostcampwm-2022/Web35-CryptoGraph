import { CandleChartOption, CandleData } from '@/types/ChartTypes'
import { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react'
import { ChartPeriod } from '@/types/ChartTypes'
import { getCandleDataArray } from '@/utils/upbitManager'
import { transDate } from '@/utils/dateManager'
import {
  CoinPrice,
  CoinPriceObj,
  SocketTickerData
} from '@/types/CoinPriceTypes'
import useInterval from '@/hooks/useInterval'
let socket: WebSocket | undefined

export const useRealTimeUpbitData = (
  candleChartOption: CandleChartOption,
  initData: CandleData[],
  priceInfo: CoinPriceObj
): [CandleData[], Dispatch<SetStateAction<CandleData[]>>, CoinPriceObj] => {
  const [period, market] = [
    candleChartOption.candlePeriod,
    candleChartOption.marketType
  ]
  const [realtimeCandleData, setRealtimeCandleData] =
    useState<CandleData[]>(initData)
  const [realtimePriceInfo, setRealtimePriceInfo] =
    useState<CoinPriceObj>(priceInfo)
  const isInitialMount = useRef(true)
  const priceStoreRef = useRef(priceStoreGenerator())

  // 1초 간격으로 store에 저장된 가격정보 변동을 realtimePriceInfo상태에 반영 -> 실시간 가격정보 컴포넌트 리렌더링
  useInterval(() => {
    setRealtimePriceInfo(prev =>
      getNewRealTimePrice(prev, priceStoreRef.current.getPrice())
    )
  }, 1000)

  useEffect(() => {
    connectWS(priceInfo)
    return () => {
      closeWS()
    }
  }, [])

  useEffect(() => {
    if (!socket) {
      console.error('분봉 설정 관련 error')
      location.reload()
      return
    }
    socket.onmessage = function (e) {
      const enc = new TextDecoder('utf-8')
      const arr = new Uint8Array(e.data)
      const str_d = enc.decode(arr)
      const d = JSON.parse(str_d)
      if (d.type == 'ticker') {
        const code = d.code.split('-')[1]
        if (code === market) {
          setRealtimeCandleData(prevData => updateData(prevData, d, period))
        }
        // 소켓으로 정보가 전달되면 store에 저장
        priceStoreRef.current.setPrice(d, code)
      }
    }
    const fetchData = async () => {
      const fetched: CandleData[] | null = await getCandleDataArray(
        period,
        market,
        200
      )
      if (fetched === null) {
        console.error('코인 쿼리 실패, 404에러')
        return
      }
      setRealtimeCandleData(fetched)
    }
    if (!isInitialMount.current) fetchData() //첫 마운트면
    else isInitialMount.current = false
  }, [market, period, priceInfo])

  return [realtimeCandleData, setRealtimeCandleData, realtimePriceInfo] //socket을 state해서 같이 뺀다. 변화감지 (끊길때) -> ui표시..
}

export function connectWS(priceInfo: CoinPriceObj) {
  if (socket !== undefined) {
    socket.close()
  }

  socket = new WebSocket('wss://api.upbit.com/websocket/v1')
  socket.binaryType = 'arraybuffer'

  socket.onopen = function () {
    const markets = Object.keys(priceInfo)
      .map(code => `"KRW-${code}"`)
      .join(',')
    filterRequest(`[{"ticket":"test"},{"type":"ticker","codes":[${markets}]}]`)
  }
  socket.onclose = function () {
    socket = undefined
  }
}

// 웹소켓 연결 해제
function closeWS() {
  if (socket !== undefined) {
    socket.close()
    socket = undefined
  }
}

// 웹소켓 요청
function filterRequest(filter: string) {
  if (socket == undefined) {
    return
  }
  socket.send(filter)
}

function updateData(
  prevData: CandleData[],
  newTickData: CandleData,
  candlePeriod: ChartPeriod
): CandleData[] {
  newTickData.candle_date_time_kst = transDate(
    newTickData.trade_timestamp,
    candlePeriod
  )
  if (prevData[0].candle_date_time_kst === newTickData.candle_date_time_kst) {
    prevData[0].low_price = Math.min(
      prevData[0].low_price,
      newTickData.trade_price
    )
    prevData[0].high_price = Math.max(
      prevData[0].high_price,
      newTickData.trade_price
    )
    prevData[0].trade_price = newTickData.trade_price
    prevData[0].timestamp = newTickData.trade_timestamp
    return [...prevData]
  }

  const toInsert = newTickData
  toInsert.opening_price = toInsert.trade_price
  toInsert.low_price = toInsert.trade_price
  toInsert.high_price = toInsert.trade_price
  toInsert.timestamp = toInsert.trade_timestamp
  return [toInsert, ...prevData]
}

// 새로운 RealTimePrice상태를 반환
function getNewRealTimePrice(
  prevData: CoinPriceObj,
  storedPrice: PriceStore
): CoinPriceObj {
  const newRealTimePrice = { ...prevData }
  Object.keys(storedPrice).forEach(code => {
    const newCoinPrice = { ...newRealTimePrice[code], ...storedPrice[code] }
    newRealTimePrice[code] = newCoinPrice
  })
  return newRealTimePrice
}

interface PriceStore {
  [key: string]: Partial<CoinPrice>
}

// 소켓으로 전달받는 가격정보를 임시로 저장할 store
function priceStoreGenerator() {
  let priceStore: PriceStore = {}
  return {
    setPrice: (newTickerData: SocketTickerData, code: string) => {
      priceStore[code] = transToCoinPrice(newTickerData)
      return
    },
    // 저장했던 가격정보를 반환하며 저장소를 비운다.
    getPrice: () => {
      const storedPrice: PriceStore = { ...priceStore }
      priceStore = {}
      return storedPrice
    }
  }
}

// 소켓으로 전달받은 데이터를 필요한 가격정보만 추출하여 store에 저장
function transToCoinPrice(newTickerData: SocketTickerData): Partial<CoinPrice> {
  return {
    price: newTickerData.trade_price,
    signed_change_price: newTickerData.signed_change_price,
    signed_change_rate: newTickerData.signed_change_rate,
    acc_trade_price_24h: newTickerData.acc_trade_price_24h
  }
}
