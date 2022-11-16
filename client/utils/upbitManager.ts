import { CandleData } from '@/types/ChartTypes'

export async function getCandleDataArray(
  market = 'BTC',
  count = 200
): Promise<CandleData[]> {
  const res = await fetch(
    `https://api.upbit.com/v1/candles/minutes/1?market=KRW-${market}&count=${count}`,
    {
      method: 'GET',
      headers: { accept: 'application/json' }
    }
  )
  const data: CandleData[] = await res.json()
  return data
}
