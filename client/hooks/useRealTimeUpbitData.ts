import { CandleData } from '@/types/ChartTypes'
import { useEffect, useState, useRef } from 'react'
import { ChartPeriod } from '@/types/ChartTypes'
import { getCandleDataArray } from '@/utils/upbitManager'
import { transDate } from '@/utils/dateManager'
let socket: WebSocket | undefined

export const useRealTimeUpbitData = (
  period: ChartPeriod,
  market: string,
  initData: CandleData[]
): CandleData[] => {
  const [realtimeCandleData, setRealtimeCandleData] =
    useState<CandleData[]>(initData)
  const isInitialMount = useRef(true)
  const fetchData = async () => {
    const fetched: CandleData[] = await getCandleDataArray(period, market, 200)
    setRealtimeCandleData(fetched)
  }

  useEffect(() => {
    connectWS(market)
    return () => {
      closeWS()
    }
  }, [])

  useEffect(() => {
    if (!isInitialMount.current) fetchData() //첫 마운트면
    else isInitialMount.current = false
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
        setRealtimeCandleData(prevData => updateData(prevData, d, period))
      }
    }
  }, [market, period])

  return realtimeCandleData //socket을 state해서 같이 뺀다. 변화감지 (끊길때) -> ui표시..
}

export function connectWS(market: string) {
  if (socket != undefined) {
    socket.close()
  }
  socket = new WebSocket('wss://api.upbit.com/websocket/v1')
  socket.binaryType = 'arraybuffer'

  socket.onopen = function () {
    filterRequest(
      `[{"ticket":"test"},{"type":"ticker","codes":["KRW-${market}"]}]`
    )
  }
  socket.onclose = function () {
    socket = undefined
  }
}

// 웹소켓 연결 해제
function closeWS() {
  if (socket != undefined) {
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
