import { MarketCapInfo } from '@/types/CoinDataTypes'

export function validateInputName(
  coinNames: MarketCapInfo[],
  inputName: string
): boolean {
  const autoCompleteNamesArray = [
    ...coinNames.map(coin => coin.name),
    ...coinNames.map(coin => coin.name_kr)
  ]
  if (autoCompleteNamesArray.includes(inputName)) return true
  return false
}

export function matchNameKRwithENG( //영어이니셜과 한글이름 아무거나 들어와도 모두 영어 이니셜로 필터링
  coinNames: MarketCapInfo[],
  inputName: string
): string {
  const coinNameObject: MarketCapInfo = coinNames.filter(
    coin => coin.name === inputName || coin.name_kr === inputName
  )[0]
  return coinNameObject.name
}
