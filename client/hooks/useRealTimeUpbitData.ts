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
let socket: WebSocket | undefined

export const useRealTimeUpbitData = (
  // period: ChartPeriod,
  // market: string,
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
  const marketRef = useRef(market)
  const periodRef = useRef(period)

  useEffect(() => {
    connectWS(priceInfo)
    if (!socket) {
      console.error('분봉 설정 관련 error')
      return
    }
    socket.onmessage = function (e) {
      const enc = new TextDecoder('utf-8')
      const arr = new Uint8Array(e.data)
      const str_d = enc.decode(arr)
      const d = JSON.parse(str_d)
      if (d.type == 'ticker') {
        const code = d.code.split('-')[1]
        // console.log(marketRef.current, periodRef.current)
        if (code === marketRef.current) {
          setRealtimeCandleData(prevData =>
            updateData(prevData, d, periodRef.current)
          )
        }
        setRealtimePriceInfo(prev => updateRealTimePrice(prev, d, code))
      }
    }
    return () => {
      closeWS()
    }
  }, [])

  useEffect(() => {
    marketRef.current = market
    periodRef.current = period
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
  }, [market, period])

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
  //잃어버린 30초
  const toInsert = newTickData
  toInsert.opening_price = toInsert.trade_price
  toInsert.low_price = toInsert.trade_price
  toInsert.high_price = toInsert.trade_price
  toInsert.timestamp = toInsert.trade_timestamp

  return [toInsert, ...prevData] //한화면에 보여주는 캔들 * 2
}

function updateRealTimePrice(
  prevData: CoinPriceObj,
  newTickerData: SocketTickerData,
  code: string
): CoinPriceObj {
  const newCoinPrice: CoinPrice = { ...prevData[code] }
  newCoinPrice.acc_trade_price_24h = newTickerData.acc_trade_price_24h
  newCoinPrice.signed_change_price = newTickerData.signed_change_price
  newCoinPrice.signed_change_rate = newTickerData.signed_change_rate
  newCoinPrice.price = newTickerData.trade_price
  return { ...prevData, [code]: newCoinPrice }
}
