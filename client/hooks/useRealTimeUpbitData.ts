// 여기서 소켓을 연결하는 로직을 작성

import { CandleData } from '@/types/ChartTypes'
import { SetStateAction, Dispatch, useEffect, useState, useRef } from 'react'

let socket: WebSocket | undefined
export const useRealTimeUpbitData = (
  market: string,
  initData: CandleData[]
): CandleData[] => {
  const [realtimeCandleData, setRealtimeCandleData] =
    useState<CandleData[]>(initData)
  const candleData = useRef<CandleData[]>(realtimeCandleData)
  useEffect(() => {
    candleData.current = realtimeCandleData
  }, [realtimeCandleData])
  // 1 time 상태를 만들고 boolean
  //setinterval로요,, 30초에 한번씩 time t f t f
  //useeffect가요. time을 의존해요
  //그안에서 manageTradeException 로직을 실행함.
  useEffect(() => {
    connectWS(setRealtimeCandleData, market)
    return () => {
      closeWS()
    }
  }, [])
  return realtimeCandleData //socket을 state해서 같이 뺀다. 변화감지 (끊길때) -> ui표시..
}

export function connectWS(
  setData: Dispatch<SetStateAction<CandleData[]>>,
  market: string
) {
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
    console.log('끊기는지?')
    socket = undefined
  }
  socket.onmessage = function (e) {
    const enc = new TextDecoder('utf-8')
    const arr = new Uint8Array(e.data)
    const str_d = enc.decode(arr)
    const d = JSON.parse(str_d)
    if (d.type == 'ticker') {
      setData(prevData => updateData(prevData, d))
    }
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
    alert('no connect exists')
    return
  }
  socket.send(filter)
}

function updateData(
  prevData: CandleData[],
  newTickData: CandleData
): CandleData[] {
  newTickData.candle_date_time_kst = transDate(newTickData.trade_timestamp)
  // newTickData 무조건 ticker로 들어온 데이터
  // ticker로 들어온 데이터가 클라이언트의 데이터보다 최신아닌 경우 갱신
  // 최신데이터도 30초룰로 생성됬다
  // 첫번째 얘를 갱신이아니라 교체를 해줘야되는거아닌가
  // ticker로 들어온 데이터가 클라이언트의 데이터보다 최신인 경우 추가
  if (prevData[0].candle_date_time_kst === newTickData.candle_date_time_kst) {
    console.log('틱 -> 틱')
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

function transDate(timestamp: number, period = 60): string {
  const date = new Date(timestamp - (timestamp % (period * 1000)))
  date.setHours(date.getHours() + 9)
  return date.toISOString().substring(0, 19)
}
