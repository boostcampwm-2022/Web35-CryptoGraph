import { ChartOption, ChartRenderOption } from '@/types/ChartTypes'

export const DEFAULT_CANDLE_COUNT = 2000
export const DEFAULT_CANDLE_CHART_OPTION: ChartOption = {
  candlePeriod: '1m',
  defaultCandleCount: 60,
  isMovingAverageVisible: false,
  isVolumeVislble: false
}
export const DEFAULT_CANDLER_CHART_RENDER_OPTION: ChartRenderOption = {
  fetchStartDataIndex: 0,
  fetchCandleCount: DEFAULT_CANDLE_COUNT,
  renderStartDataIndex: 0,
  renderCandleCount: 20,
  translateX: 0
}

export const MIN_CANDLE_COUNT = 5
