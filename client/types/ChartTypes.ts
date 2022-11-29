export interface CandleData {
  code: string
  market: string
  trade_date: string
  trade_time: string
  trade_date_kst: string
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  prev_closing_price: number
  change: string
  change_rate: number
  change_price: number
  trade_volume: number
  candle_date_time_kst: string
  timestamp: number
  trade_timestamp: number
}

type ChartPeriodItered<T> = {
  [K in ChartPeriod]: T
}
export type ChartPeriod =
  | 'minutes/1'
  | 'minutes/3'
  | 'minutes/5'
  | 'minutes/60'
  | 'minutes/240'
  | 'days'
  | 'weeks'

export const DatePeriod: ChartPeriodItered<number> = {
  'minutes/1': 60,
  'minutes/3': 180,
  'minutes/5': 300,
  'minutes/60': 3600,
  'minutes/240': 14400,
  days: 86400,
  weeks: 604800
}

export interface ChartRenderOption {
  marketType: string
  fetchStartDataIndex: number
  fetchCandleCount: number
  renderStartDataIndex: number
  renderCandleCount: number
  translateX: number
  isVolumeVislble: boolean
  isMovingAverageVisible: boolean
}

//treeChart
export interface TreeMapData {
  acc_trade_price: number
  acc_trade_price_24h: number
  acc_trade_volume: number
  acc_trade_volume_24h: number
  change: string
  change_price: number
  change_rate: number
  high_price: number
  highest_52_week_date: string
  highest_52_week_price: number
  low_price: number
  lowest_52_week_date: string
  lowest_52_week_price: number
  market: string
  opening_price: number
  prev_closing_price: number
  signed_change_price: number
  signed_change_rate: number
  timestamp: number
  trade_date: string
  trade_date_kst: string
  trade_price: number
  trade_time: string
  trade_time_kst: string
  trade_timestamp: number
  trade_volume: number
}

export interface ActionType {
  type: string
  coinRate: CoinRateType
}

export type EmptyObject = Record<string, never>

export interface CoinRateType {
  [key: string]: EmptyObject | CoinRateContentType
}

export interface CoinRateContentType {
  name: string
  ticker?: string
  parent: string
  value: number
}

export interface PointerPosition {
  positionX: number
  positionY: number
}
