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

export interface PointerPosition {
  positionX: number
  positionY: number
}
