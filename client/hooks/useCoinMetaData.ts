import { CoinMetaData } from '@/types/CoinDataTypes'
import { getCoinMetaData } from '@/utils/metaDataManages'
import { useEffect, useState } from 'react'

export const useCoinMetaData = (coinCode: string): CoinMetaData | null => {
  const [coinData, setCoinData] = useState<CoinMetaData | null>(null)
  useEffect(() => {
    getCoinMetaData(coinCode.toUpperCase()).then(result => {
      setCoinData(result)
    })
  }, [coinCode])
  return coinData
}
