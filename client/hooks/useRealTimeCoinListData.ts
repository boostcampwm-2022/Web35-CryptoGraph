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
      value: 0
    }
    coinContent.name = coinData.name_kr
    coinContent.ticker = 'KRW-' + coinData.name
    coinContent.parent = 'Origin'
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
