import { MarketCapInfo } from '@/types/CoinDataTypes'

interface dict<T> {
  [key: string]: T
}

export default function MakeCoinDict(data: MarketCapInfo[]) {
  const dict: dict<Array<string>> = {}
  data.map(data => {
    let str_ticker = ''
    let str_kr = ''
    let str_es = ''
    for (const alpha of data.name) {
      str_ticker += alpha
      if (dict[str_ticker]) {
        dict[str_ticker].push(data.name)
      } else {
        dict[str_ticker] = [data.name]
      }
    }

    for (const alpha of data.name_kr) {
      str_kr += alpha
      if (!str_ticker.includes(str_kr)) {
        if (dict[str_kr]) {
          dict[str_kr].push(data.name)
        } else {
          dict[str_kr] = [data.name]
        }
      }
    }

    for (const alpha of data.name_es) {
      str_es += alpha.toUpperCase()
      if (!str_ticker.includes(str_es)) {
        if (dict[str_es]) {
          dict[str_es].push(data.name)
        } else {
          dict[str_es] = [data.name]
        }
      }
    }
  })
  return dict
}
