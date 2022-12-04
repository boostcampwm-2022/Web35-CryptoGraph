import { useState, useEffect, useReducer } from 'react'
import { CoinRateType } from '@/types/ChartTypes'
import { RunningChart } from '@/components/RunningChart'
import { getCoinTicker } from '@/utils/upbitManager'

export default function RunningChartPage() {
  const [coinRate, setCoinRate] = useState<CoinRateType>({}) //coin의 등락률 값

  useEffect(() => {
    const initCoinRate: CoinRateType = {}
    getCoinTicker().then(data => {
      for (const key of data) {
        if (key.market.split('-')[0] === 'KRW') {
          initCoinRate[key.market] = {
            name: key.market.split('-')[1],
            ticker: key.market,
            parent: 'Origin',
            value: 0
          }
        }
      }
      setCoinRate(initCoinRate)
    })
  }, [])
  if (!Object.keys(coinRate).length) return
  return (
    <>
      <RunningChart coinRate={coinRate} candleCount={20}></RunningChart>
    </>
  )
}
