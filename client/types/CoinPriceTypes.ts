export interface CoinPrice {
  logo: string
  name_kr: string
  name: string
  price: number
  signed_change_price: number
  signed_change_rate: number
  acc_trade_price_24h: number
}

export interface CoinPriceObj {
  [key: string]: CoinPrice
}
