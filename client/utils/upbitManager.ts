import { CandleData, ChartPeriod } from '@/types/ChartTypes'
import { DEFAULT_CANDLE_COUNT } from '@/constants/ChartConstants'
export async function getCandleDataArray(
  period: ChartPeriod,
  market: string,
  count = DEFAULT_CANDLE_COUNT,
  endTime: string | void
): Promise<CandleData[]> {
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

  const data: CandleData[] = await res.json()
  return data
}
