import { updateTreeData } from '@/components/Treechart/getCoinData'
import { CoinRateContentType, CoinRateType } from '@/types/ChartTypes'
import { MarketCapInfo } from '@/types/CoinDataTypes'
import { useState } from 'react'
import useInterval from './useInterval'

const COIN_INTERVAL_RATE = 5000
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

  useInterval(() => {
    async function update() {
      const updatedCoinRate = await updateTreeData(coinData)
      setCoinData(updatedCoinRate)
    }
    update()
  }, COIN_INTERVAL_RATE)
  return coinData
}
