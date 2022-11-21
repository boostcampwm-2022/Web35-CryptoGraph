import { ChartRenderOption } from '@/types/ChartTypes'

export const DEFAULT_CANDLE_COUNT = 2000
export const DEFAULT_CANDLER_CHART_RENDER_OPTION: ChartRenderOption = {
  marketType: 'BTC',
  candlePeriod: 'minutes/1',
  isMovingAverageVisible: false,
  isVolumeVislble: false,
  fetchStartDataIndex: 0,
  fetchCandleCount: DEFAULT_CANDLE_COUNT,
  renderStartDataIndex: 0,
  renderCandleCount: 20
}
