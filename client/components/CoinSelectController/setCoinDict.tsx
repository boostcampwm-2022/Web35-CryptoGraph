import { MarketCapInfo } from '@/types/CoinDataTypes'

interface dict<T> {
  [key: string]: T
}

export default function MakeCoinDict(data: MarketCapInfo[]) {
  const dict: dict<Array<string>> = {}
  data.map(data => {
    let str = ''
    let str_kr = ''
    for (const alpha of data.name) {
      str += alpha
      if (dict[str]) {
        dict[str].push(data.name)
      } else {
        dict[str] = [data.name]
      }
    }
    if (str !== str_kr) {
      for (const alpha of data.name_kr) {
        str_kr += alpha
        if (dict[str_kr]) {
          dict[str_kr].push(data.name)
        } else {
          dict[str_kr] = [data.name]
        }
      }
    }
  })
  return dict
}
