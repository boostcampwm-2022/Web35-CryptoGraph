import { ChartPeriod, ChartRenderOption } from '@/types/ChartTypes'

export const DEFAULT_CANDLE_COUNT = 2000
export const DEFAULT_CANDLE_RENDER_COUNT = 30
export const DEFAULT_CANDLE_PERIOD: ChartPeriod = 'minutes/1'
export const DEFAULT_CANDLER_CHART_RENDER_OPTION: ChartRenderOption = {
  marketType: 'BTC',
  isMovingAverageVisible: false,
  isVolumeVislble: false,
  fetchStartDataIndex: 0,
  fetchCandleCount: DEFAULT_CANDLE_COUNT,
  renderStartDataIndex: 0,
  renderCandleCount: DEFAULT_CANDLE_RENDER_COUNT
}
