import { ChartOption, ChartRenderOption } from '@/types/ChartTypes'

export const DEFAULT_CANDLE_COUNT = 60
export const DEFAULT_CANDLE_CHART_OPTION: ChartOption = {
  candlePeriod: '1m',
  defaultCandleCount: 60,
  isMovingAverageVisible: false,
  isVolumeVislble: false
}
export const DEFAULT_CANDLER_CHART_RENDER_OPTION: ChartRenderOption = {
  fetchStartDataIndex: 0,
  fetchEndDataIndex: 200,
  renderStartDataIndex: 0,
  renderEndDataIndex: 60,
  candleWidth: 30,
  howMany: 30
}
