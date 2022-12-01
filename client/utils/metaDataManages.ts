import { CoinMetaData } from '@/types/CoinDataTypes'

export async function getCoinMetaData(
  coinCode: string
): Promise<CoinMetaData | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/coin-info/${coinCode}`,
    {
      method: 'GET'
    }
  )
  if (response.status !== 200) {
    return null
  }
  const data: CoinMetaData = await response.json()
  return data
}
