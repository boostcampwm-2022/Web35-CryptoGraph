import { CandleData, ChartPeriod } from '@/types/ChartTypes'
import { DEFAULT_CANDLE_COUNT } from '@/constants/ChartConstants'
export async function getCandleDataArray(
  period: ChartPeriod,
  market: string,
  count = DEFAULT_CANDLE_COUNT
): Promise<CandleData[]> {
  const res = await fetch(
    `https://api.upbit.com/v1/candles/${period}?market=KRW-${market}&count=${count}`,
    {
      method: 'GET',
      headers: { accept: 'application/json' }
    }
  )
  const data: CandleData[] = await res.json()
  return data
}
