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

export interface ChartOption {
  candlePeriod: '1m' | '3m' | '5m' | '1h' | '4h' | '1d' | '1w' | '1d' | '1w'
  defaultCandleCount: number
  isVolumeVislble: boolean
  isMovingAverageVisible: boolean
}
export interface ChartRenderOption {
  fetchStartDataIndex: number
  fetchCandleCount: number
  renderStartDataIndex: number
  renderCandleCount: number
  translateX: number
}
