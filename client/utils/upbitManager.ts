import { CandleData } from '@/types/ChartTypes'

export async function getCandleDataArray(
  period = 1,
  market = 'BTC',
  count = 200
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
