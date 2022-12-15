import { CoinRateContentType, CoinRateType } from '@/types/ChartTypes'
import { MarketCapInfo } from '@/types/CoinDataTypes'
import { SocketTickerData } from '@/types/CoinPriceTypes'
import { useRef, useState, useEffect } from 'react'
import useInterval from './useInterval'

const COIN_INTERVAL_RATE = 1000
let socket: WebSocket | undefined
const getInitData = (data: MarketCapInfo[]): CoinRateType => {
  //initData
  const initData: CoinRateType = {}
  data.forEach(coinData => {
    const coinContent: CoinRateContentType = {
      name: '',
      ticker: '',
      parent: '',
      acc_trade_price_24h: 0,
      market_cap: 0,
      cmc_rank: 0,
      value: 0
    }
    coinContent.name = coinData.name_kr
    coinContent.ticker = 'KRW-' + coinData.name
    coinContent.parent = 'Origin'
    coinContent.acc_trade_price_24h = coinData.acc_trade_price_24h
    coinContent.market_cap = Number(coinData.market_cap)
    coinContent.cmc_rank = Number(coinData.cmc_rank)
    coinContent.value = Number((coinData.signed_change_rate * 100).toFixed(2))
    initData[coinContent.ticker] = coinContent
  })

  return initData
}
export function useRealTimeCoinListData(data: MarketCapInfo[]) {
  const [coinData, setCoinData] = useState<CoinRateType>(getInitData(data))
  const coinDataStoreRef = useRef(coinDataStoreGenerator())
  const isWindowForeGround = useRef<boolean>(true)
  useEffect(() => {
    const setVisibilityCallback = () => {
      if (socket === undefined) location.reload()
      isWindowForeGround.current = !document.hidden
      //안보이면 false, 보이면 true
    }
    document.addEventListener('visibilitychange', setVisibilityCallback)
    connectWS(data, coinDataStoreRef.current.setCoinData)
    return () => {
      document.removeEventListener('visibilitychange', setVisibilityCallback)
      closeWS()
    }
  }, [])

  useInterval(() => {
    if (!isWindowForeGround.current) {
      //창이 background 상태면 바로 return
      return
    }
    const storedCoinData = coinDataStoreRef.current.getCoinData()
    setCoinData(prev => getNewCoinData(prev, storedCoinData))
  }, COIN_INTERVAL_RATE)
  return coinData
}

function connectWS(
  data: MarketCapInfo[],
  setCoinData: (tickData: SocketTickerData) => void
) {
  if (socket !== undefined) {
    socket.close()
  }

  socket = new WebSocket('wss://api.upbit.com/websocket/v1')
  socket.binaryType = 'arraybuffer'

  socket.onopen = function () {
    const markets = data.map(coinData => 'KRW-' + coinData.name).join(',')
    filterRequest(`[{"ticket":"test"},{"type":"ticker","codes":[${markets}]}]`)
  }
  socket.onclose = function () {
    socket = undefined
  }
  socket.onmessage = function (e) {
    const enc = new TextDecoder('utf-8')
    const arr = new Uint8Array(e.data)
    const str_d = enc.decode(arr)
    const d = JSON.parse(str_d)
    setCoinData(d)
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

interface CoinDataStore {
  [key: string]: Partial<CoinRateContentType>
}

function coinDataStoreGenerator() {
  let coinDataStore: CoinDataStore = {}
  return {
    setCoinData: (newTickerData: SocketTickerData) => {
      coinDataStore[newTickerData.code] = transToCoinData(newTickerData)
      return
    },
    getCoinData: () => {
      const storedCoinData: CoinDataStore = { ...coinDataStore }
      coinDataStore = {}
      return storedCoinData
    }
  }
}

function transToCoinData(
  newTickerData: SocketTickerData
): Partial<CoinRateContentType> {
  return {
    acc_trade_price_24h: newTickerData.acc_trade_price_24h,
    value: Number((newTickerData.signed_change_rate * 100).toFixed(2))
  }
}

function getNewCoinData(
  prevData: CoinRateType,
  storedPrice: CoinDataStore
): CoinRateType {
  const newCoinData = { ...prevData }
  Object.keys(storedPrice).forEach(code => {
    newCoinData[code] = { ...newCoinData[code], ...storedPrice[code] }
  })
  return newCoinData
}
