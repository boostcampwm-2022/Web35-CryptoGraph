import { CandleData } from '@/types/ChartTypes'
import { DEFAULT_CANDLE_COUNT } from '@/constants/ChartConstants'
export async function getCandleDataArray(
  period = 1,
  market = 'BTC',
  count = DEFAULT_CANDLE_COUNT
): Promise<CandleData[]> {
  const res = await fetch(
    `https://api.upbit.com/v1/candles/minutes/${period}?market=KRW-${market}&count=${count}`,
    {
      method: 'GET',
      headers: { accept: 'application/json' }
    }
  )
  const data: CandleData[] = await res.json()
  return data
}
