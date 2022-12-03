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

export interface SocketTickerData {
  type: string
  code: string
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  prev_closing_price: number
  signed_change_price: number
  signed_change_rate: number
  trade_volume: number
  acc_trade_volume: number
  acc_trade_volume_24h: number
  acc_trade_price: number
  acc_trade_price_24h: number
  trade_timestamp: number
  acc_ask_volume: number
  acc_bid_volume: number
  highest_52_week_price: number
  highest_52_week_date: string
  lowest_52_week_price: number
  lowest_52_week_date: string
  timestamp: number
}
