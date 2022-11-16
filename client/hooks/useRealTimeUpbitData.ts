// 여기서 소켓을 연결하는 로직을 작성

import { CandleData } from '@/types/ChartTypes'
import { SetStateAction, Dispatch, useEffect, useState, useRef } from 'react'

let socket: WebSocket | undefined //const [data] = usesocket('BTC','1m')
export const useRealTimeUpbitData = (
  market: string,
  initData: CandleData[]
): CandleData[] => {
  const [realtimeCandleData, setRealtimeCandleData] =
    useState<CandleData[]>(initData)
  const [isTicker, setIsTicker] = useState<boolean>(true) //처음에는 티커가
  const candleData = useRef<CandleData[]>(realtimeCandleData)
  const isTickerRef = useRef<boolean>(isTicker)
  useEffect(() => {
    candleData.current = realtimeCandleData
    isTickerRef.current = isTicker
  }, [realtimeCandleData, isTicker])
  // 1 time 상태를 만들고 boolean
  //setinterval로요,, 30초에 한번씩 time t f t f
  //useeffect가요. time을 의존해요
  //그안에서 manageTradeException 로직을 실행함.
  useEffect(() => {
    const manageTradeException = setInterval(() => {
      // 너무 거래가 없어서 틱이 안들어옴 -> 단위시간 누락되는 걸 막기위한 과정
      // 현재 시간이랑, 현재 최신 데이터의 시간이랑 비교한다.
      // 갱신만해주는 역할
      const toInsertTimeStamp = Date.now()
      const timenow = transDate(toInsertTimeStamp)
      if (timenow !== transDate(candleData.current[0].trade_timestamp)) {
        //여기서 추가
        console.log('너 실행되니?')
        const toInsert = { ...candleData.current[0] }
        toInsert.candle_date_time_kst = timenow
        toInsert.timestamp = toInsertTimeStamp
        toInsert.opening_price = toInsert.trade_price
        toInsert.low_price = toInsert.trade_price
        toInsert.high_price = toInsert.trade_price
        setIsTicker(false)
        setRealtimeCandleData(prev => [toInsert, ...prev])
      }
    }, 30000)
    connectWS(setRealtimeCandleData, market, isTickerRef.current, setIsTicker)
    return () => {
      clearInterval(manageTradeException)
      closeWS()
    }
  }, [])
  return realtimeCandleData
}

export function connectWS(
  setData: Dispatch<SetStateAction<CandleData[]>>,
  market: string,
  isTicker: boolean,
  setIsTicker: Dispatch<SetStateAction<boolean>>
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
    socket = undefined
  }
  socket.onmessage = function (e) {
    const enc = new TextDecoder('utf-8')
    const arr = new Uint8Array(e.data)
    const str_d = enc.decode(arr)
    const d = JSON.parse(str_d)
    if (d.type == 'ticker') {
      setData(prevData => updateData(prevData, d, isTicker, setIsTicker))
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
  newTickData: CandleData,
  isTicker: boolean,
  setIsTicker: Dispatch<SetStateAction<boolean>>
): CandleData[] {
  newTickData.candle_date_time_kst = transDate(newTickData.trade_timestamp)
  // newTickData 무조건 ticker로 들어온 데이터
  // ticker로 들어온 데이터가 클라이언트의 데이터보다 최신아닌 경우 갱신
  // 최신데이터도 30초룰로 생성됬다
  // 첫번째 얘를 갱신이아니라 교체를 해줘야되는거아닌가
  // ticker로 들어온 데이터가 클라이언트의 데이터보다 최신인 경우 추가
  if (prevData[0].candle_date_time_kst === newTickData.candle_date_time_kst) {
    if (!isTicker) {
      console.log('추가 -> 틱') //짬푸
      const toReplace = newTickData
      toReplace.opening_price = toReplace.trade_price
      toReplace.low_price = toReplace.trade_price
      toReplace.high_price = toReplace.trade_price
      setIsTicker(true)
      return [toReplace, ...prevData.slice(1)]
    } else {
      console.log('틱 -> 틱', newTickData)
      prevData[0].low_price = Math.min(
        prevData[0].low_price,
        newTickData.trade_price
      )
      prevData[0].high_price = Math.max(
        prevData[0].high_price,
        newTickData.trade_price
      )
      prevData[0].trade_price = newTickData.trade_price
      console.log(
        prevData[0].trade_price,
        transDate2(newTickData.trade_timestamp)
      )
      return [...prevData]
    }
  }
  //잃어버린 30초
  console.log('틱으로 생성')
  const toInsert = newTickData
  console.log(toInsert, transDate2(newTickData.trade_timestamp))
  toInsert.opening_price = toInsert.trade_price
  toInsert.low_price = toInsert.trade_price
  toInsert.high_price = toInsert.trade_price

  return [toInsert, ...prevData] //한화면에 보여주는 캔들 * 2
}

function transDate(timestamp: number, step = 60000): string {
  console.log(timestamp)
  const date = new Date(timestamp - (timestamp % step))
  date.setHours(date.getHours() + 9)
  return date.toISOString().substring(0, 19)
}

function transDate2(timestamp: number, step = 1000): string {
  const date = new Date(timestamp - (timestamp % step))
  date.setHours(date.getHours() + 9)
  return date.toISOString().substring(0, 19)
}
