import { ChartOption } from '@/types/ChartTypes'

export const DEFAULT_CANDLE_COUNT = 60
export const DEFAULT_CANDLE_CHART_OPTION: ChartOption = {
  candlePeriod: '1m',
  defaultCandleCount: 60,
  isMovingAverageVisible: false,
  isVolumeVislble: false
}
