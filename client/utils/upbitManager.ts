import { CandleData, ChartPeriod } from '@/types/ChartTypes'
import { DEFAULT_CANDLE_COUNT } from '@/constants/ChartConstants'
import { TreeMapData } from '@/types/ChartTypes'
export async function getCandleDataArray(
  period: ChartPeriod,
  market: string,
  count = DEFAULT_CANDLE_COUNT
): Promise<CandleData[]> {
  const res = await fetch(
    `https://api.upbit.com/v1/candles/${period}?market=KRW-${market}&count=${count}`,
    {
      method: 'GET',
      headers: { accept: 'application/json' },
    }
  )
  const data: CandleData[] = await res.json()
  return data
}

export async function getTreeMapDataArray(
  market: string,
): Promise<TreeMapData[]> {
  const res = await fetch(
    //market -> markets
    `https://api.upbit.com/v1/ticker?markets=${market}&count=1`,
    {
      method: 'GET',
      headers: { accept: 'application/json' },
    }
  )
  const data: TreeMapData[] = await res.json()
  return data
}

export async function getCoinTicker() {
  const res = await fetch('https://api.upbit.com/v1/market/all')
  const data = await res.json()
  return data
}

