import {
  ChartPeriod,
  ChartRenderOption,
  PointerPosition
} from '@/types/ChartTypes'

export const CHART_CONTAINER_X_SIZE = 1000
export const CHART_CONTAINER_Y_SIZE = 800
export const X_RIGHT_MARGIN = 100
export const Y_RIGHT_MARGIN = 100
export const CHART_AREA_X_SIZE = CHART_CONTAINER_X_SIZE - X_RIGHT_MARGIN
export const CHART_AREA_Y_SIZE = CHART_CONTAINER_Y_SIZE - Y_RIGHT_MARGIN

export const DEFAULT_CANDLE_COUNT = 200
export const DEFAULT_CANDLE_RENDER_COUNT = 30
export const DEFAULT_CANDLE_PERIOD: ChartPeriod = 'minutes/1'
export const DEFAULT_CANDLER_CHART_RENDER_OPTION: ChartRenderOption = {
  marketType: 'BTC',
  isMovingAverageVisible: false,
  isVolumeVislble: false,
  fetchStartDataIndex: 0,
  fetchCandleCount: DEFAULT_CANDLE_COUNT,
  renderStartDataIndex: 0,
  renderCandleCount: DEFAULT_CANDLE_RENDER_COUNT,
  translateX: 0
}

export const MIN_CANDLE_COUNT = 5

export const DEFAULT_POINTER_POSITION: PointerPosition = {
  positionX: -1,
  positionY: -1
}
