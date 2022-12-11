import { ChartPeriod, CandleChartOption, PointerData } from '@/types/ChartTypes'

export const CHART_Y_AXIS_MARGIN = 70
export const CHART_X_AXIS_MARGIN = 20

export const MAX_FETCH_CANDLE_COUNT = 200
export const DEFAULT_CANDLE_PERIOD: ChartPeriod = 'minutes/1'
export const DEFAULT_CANDLE_COUNT = 30
export const DEFAULT_RENDER_START_INDEX = 0
export const DEFAULT_MAX_RENDER_START_INDEX = Infinity
export const DEFAULT_MAX_CANDLE_COUNT = Infinity
export const DEFAULT_CANDLE_CHART_OPTION: CandleChartOption = {
  marketType: 'BTC',
  isMovingAverageVisible: false,
  isVolumeVisible: false,
  candlePeriod: DEFAULT_CANDLE_PERIOD
}

export const DEFAULT_POINTER_DATA: PointerData = {
  positionX: -1,
  positionY: -1,
  data: null
}

export const CANDLE_COLOR_RED = '#D24F45'
export const CANDLE_COLOR_BLUE = '#1D61C4'
export const CANDLE_CHART_GRID_COLOR = '#EEEFEE'
export const CANDLE_CHART_POINTER_LINE_COLOR = '#999999'
export const CHART_FONT_SIZE = `12px`
export const CHART_AXIS_RECT_WIDTH = 70
export const CHART_AXIS_RECT_HEIGHT = 16
