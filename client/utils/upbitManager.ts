import {
  CandleData,
  ChartPeriod,
  TreeMapData,
  tickerData
} from '@/types/ChartTypes'
import { DEFAULT_CANDLE_COUNT } from '@/constants/ChartConstants'
export async function getCandleDataArray(
  period: ChartPeriod,
  market: string,
  count = DEFAULT_CANDLE_COUNT,
  endTime: string | void
): Promise<CandleData[] | null> {
  let res
  if (!endTime) {
    res = await fetch(
      `https://api.upbit.com/v1/candles/${period}?market=KRW-${market}&count=${count}`,
      {
        method: 'GET',
        headers: { accept: 'application/json' }
      }
    )
  } else {
    res = await fetch(
      `https://api.upbit.com/v1/candles/${period}?market=KRW-${market}&to=${endTime}&count=${count}`,
      {
        method: 'GET',
        headers: { accept: 'application/json' }
      }
    )
  }
  if (res.status === 404) {
    return null
  }
  const data: CandleData[] = await res.json()
  return data
}

export async function getTreeMapDataArray(
  market: string
): Promise<TreeMapData[]> {
  const res = await fetch(
    //market -> markets
    `https://api.upbit.com/v1/ticker?markets=${market}&count=1`,
    {
      method: 'GET',
      headers: { accept: 'application/json' }
    }
  )
  const data: TreeMapData[] = await res.json()
  return data
}

export async function getCoinTicker(): Promise<tickerData[]> {
  const res = await fetch('https://api.upbit.com/v1/market/all')
  const data: tickerData[] = await res.json()
  return data
}
