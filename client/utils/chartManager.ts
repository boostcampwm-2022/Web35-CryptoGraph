import {
  CANDLE_COLOR_RED,
  CANDLE_COLOR_BLUE,
  CANDLE_CHART_POINTER_LINE_COLOR,
  CHART_FONT_SIZE,
  CHART_Y_AXIS_MARGIN,
  DEFAULT_CANDLE_COUNT,
  DEFAULT_RENDER_START_INDEX,
  CHART_X_AXIS_MARGIN,
  CHART_AXIS_RECT_WIDTH,
  CHART_AXIS_RECT_HEIGHT
} from '@/constants/ChartConstants'
import { DatePeriod } from '@/types/ChartTypes'
import { WindowSize } from 'hooks/useWindowSize'
import {
  CandleChartRenderOption,
  CandleData,
  PointerData,
  ChartPeriod
} from '@/types/ChartTypes'
import * as d3 from 'd3'
import { makeDate } from './dateManager'
import { blueColorScale, redColorScale } from '@/styles/colorScale'

export function getVolumeHeightScale(
  data: CandleData[],
  CHART_AREA_Y_SIZE: number
) {
  const [min, max] = [
    d3.min(data, d => d.candle_acc_trade_price),
    d3.max(data, d => d.candle_acc_trade_price)
  ]
  if (!min || !max) {
    console.error(data, data.length)
    console.error('데이터에 문제가 있다. 서버에서 잘못 쏨')
    return undefined
  }
  return d3.scaleLinear().domain([min, max]).range([CHART_AREA_Y_SIZE, 30])
}

export function getYAxisScale(data: CandleData[], CHART_AREA_Y_SIZE: number) {
  const [min, max] = [
    d3.min(data, d => d.low_price),
    d3.max(data, d => d.high_price)
  ]
  if (!min || !max) {
    console.error(data, data.length)
    console.error('데이터에 문제가 있다. 서버에서 잘못 쏨')
    return undefined
  }
  return d3.scaleLinear().domain([min, max]).range([CHART_AREA_Y_SIZE, 0])
}

// scale함수 updateChart에서만 호출
export function getXAxisScale(
  option: CandleChartRenderOption,
  data: CandleData[],
  chartAreaXsize: number,
  candlePeriod: ChartPeriod
) {
  return d3
    .scaleTime()
    .domain([
      makeDate(
        data[option.renderStartDataIndex].timestamp -
          DatePeriod[candlePeriod] * (option.renderCandleCount + 1) * 1000,
        DatePeriod[candlePeriod]
      ),
      makeDate(
        data[option.renderStartDataIndex].timestamp,
        DatePeriod[candlePeriod]
      )
    ])
    .range([
      chartAreaXsize - (option.renderCandleCount + 1) * option.candleWidth,
      chartAreaXsize
    ])
}

export function updateCurrentPrice(
  yAxisScale: d3.ScaleLinear<number, number, never>,
  data: CandleData[],
  renderOpt: CandleChartRenderOption,
  chartAreaXsize: number,
  chartAreaYSize: number
) {
  const $currentPrice = d3.select('svg#current-price')
  const yCoord = yAxisScale(data[0].trade_price)
  const strokeColor =
    data[0].opening_price < data[0].trade_price
      ? CANDLE_COLOR_RED
      : CANDLE_COLOR_BLUE
  $currentPrice
    .select('line')
    .attr('x1', chartAreaXsize)
    .attr('x2', 0)
    .attr('y1', yCoord)
    .attr('y2', yCoord)
    .attr('stroke', strokeColor)
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '10,10')
  $currentPrice
    .select('rect')
    .attr('fill', strokeColor)
    .attr('width', CHART_AXIS_RECT_WIDTH)
    .attr('height', CHART_AXIS_RECT_HEIGHT)
    .attr('x', chartAreaXsize)
    .attr(
      'y',
      Math.min(
        Math.max(0, yCoord - CHART_AXIS_RECT_HEIGHT / 2),
        chartAreaYSize - CHART_AXIS_RECT_HEIGHT
      )
    )
  $currentPrice
    .select('text')
    .attr('fill', 'white')
    .attr('font-size', CHART_FONT_SIZE)
    .attr(
      'transform',
      getTextTransform(yCoord, 1, chartAreaXsize, chartAreaYSize)
    )
    .attr('font-weight', '600')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text(data[0].trade_price.toLocaleString())
}

// svg#mouse-pointer-UI자식요소에 격자구선 선 join
export function updatePointerUI(
  pointerInfo: PointerData,
  renderOpt: CandleChartRenderOption,
  data: CandleData[],
  windowSize: WindowSize,
  chartPeriod: ChartPeriod
) {
  const [chartAreaXsize, chartAreaYsize] = [
    windowSize.width - CHART_Y_AXIS_MARGIN,
    windowSize.height - CHART_X_AXIS_MARGIN
  ]
  const { priceText, color } = getPriceInfo(pointerInfo)
  const yAxisScale = getYAxisScale(
    data.slice(
      renderOpt.renderStartDataIndex,
      renderOpt.renderStartDataIndex + renderOpt.renderCandleCount
    ),
    chartAreaYsize
  )
  if (!yAxisScale) {
    return
  }
  d3.select('text#price-info')
    .attr('fill', color ? color : 'black')
    .attr('font-size', CHART_FONT_SIZE)
    .text(priceText)
  d3.select('svg#mouse-pointer-UI')
    .selectAll('g')
    .data(transPointerInfoToArray(pointerInfo))
    .join(
      function (enter) {
        const $g = enter.append('g')
        $g.append('path')
          .attr('d', (d, i) =>
            getPathDAttr(d, i, chartAreaXsize, chartAreaYsize)
          )
          .attr('stroke', CANDLE_CHART_POINTER_LINE_COLOR)
        $g.append('rect')
          .attr('width', CHART_AXIS_RECT_WIDTH)
          .attr('height', CHART_AXIS_RECT_HEIGHT)
          .attr('fill', CANDLE_CHART_POINTER_LINE_COLOR)
          .attr('transform', (d, i) =>
            getRectTransform(d, i, chartAreaXsize, chartAreaYsize)
          )

        $g.append('text')
          .attr('fill', 'black')
          .attr('font-size', CHART_FONT_SIZE)
          .attr('transform', (d, i) =>
            getTextTransform(d, i, chartAreaXsize, chartAreaYsize)
          )
          .attr('font-weight', '600')
          .text((d, i) => {
            if (i === 0) {
              return getTimeText(pointerInfo.data)
            }
            return Math.round(yAxisScale.invert(d)).toLocaleString()
          })
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', (d, i) => (i === 0 ? 'hanging' : 'middle'))
        return $g
      },
      function (update) {
        update
          .select('path')
          .attr('d', (d, i) =>
            getPathDAttr(d, i, chartAreaXsize, chartAreaYsize)
          )
        update
          .select('rect')
          .attr('width', CHART_AXIS_RECT_WIDTH)
          .attr('height', CHART_AXIS_RECT_HEIGHT)
          .attr('transform', (d, i) =>
            getRectTransform(d, i, chartAreaXsize, chartAreaYsize)
          )
        update
          .select('text')
          .attr('transform', (d, i) =>
            getTextTransform(d, i, chartAreaXsize, chartAreaYsize)
          )
          .text((d, i) => {
            if (i === 0) {
              return getTimeText(pointerInfo.data)
            }
            return Math.round(yAxisScale.invert(d)).toLocaleString()
          })
        return update
      },
      function (exit) {
        return exit.remove()
      }
    )
}

// text위치 정보 반환
function getTextTransform(
  pointerXY: number,
  i: number,
  chartAreaXSize: number,
  chartAreaYSize: number
) {
  if (i === 0) {
    let textX = pointerXY - CHART_AXIS_RECT_WIDTH / 2
    textX = Math.max(Math.min(textX, chartAreaXSize - CHART_AXIS_RECT_WIDTH), 0)
    return `translate(${textX + CHART_AXIS_RECT_WIDTH / 2},${
      chartAreaYSize + 3
    })`
  }
  let textY = pointerXY - CHART_AXIS_RECT_HEIGHT / 2
  textY = Math.max(Math.min(chartAreaYSize - CHART_AXIS_RECT_HEIGHT, textY), 0)
  return `translate(${chartAreaXSize + CHART_AXIS_RECT_WIDTH / 2},${
    textY + CHART_AXIS_RECT_HEIGHT / 2
  })`
}

// rect위치정보 반환
function getRectTransform(
  pointerXY: number,
  i: number,
  chartAreaXSize: number,
  chartAreaYSize: number
) {
  if (i === 0) {
    let rectX = pointerXY - CHART_AXIS_RECT_WIDTH / 2
    rectX = Math.max(Math.min(rectX, chartAreaXSize - CHART_AXIS_RECT_WIDTH), 0)
    return `translate(${rectX},${chartAreaYSize})`
  }
  let rectY = pointerXY - CHART_AXIS_RECT_HEIGHT / 2
  rectY = Math.max(Math.min(chartAreaYSize - CHART_AXIS_RECT_HEIGHT, rectY), 0)
  return `translate(${chartAreaXSize},${rectY})`
}

// 시간정보 텍스트 반환
function getTimeText(unitData: CandleData | null) {
  if (!unitData || !unitData.candle_date_time_kst) {
    return ''
  }
  const timeString = unitData.candle_date_time_kst
  return `${timeString.substring(5, 10)} ${timeString.substring(11, 16)}`
}

// 마우스 포인터가 가리키는 위치의 분봉데이터를 찾아 렌더링될 가격정보를 반환
function getPriceInfo(pointerInfo: PointerData) {
  if (pointerInfo.positionX < 0) {
    return { priceText: '' }
  }
  if (!pointerInfo.data) {
    console.error(pointerInfo)
    console.error('예외상황')
    return { priceText: '' }
  }
  const candleUnitData = pointerInfo.data
  return {
    priceText: [
      `고가: ${candleUnitData.high_price}`,
      `저가: ${candleUnitData.low_price}`,
      `시가: ${candleUnitData.opening_price}`,
      `종가: ${candleUnitData.trade_price}`
    ].join('  '),
    color:
      candleUnitData.opening_price < candleUnitData.trade_price
        ? CANDLE_COLOR_RED
        : CANDLE_COLOR_BLUE
  }
}

// 격자를 생성할 path요소의 내용 index가 0이라면 세로선 1이라면 가로선
function getPathDAttr(
  d: number,
  i: number,
  chartAreaXsize: number,
  chartAreaYsize: number
) {
  return i === 0
    ? `M${d} 0 L${d} ${chartAreaYsize}`
    : `M0 ${d} L${chartAreaXsize} ${d}`
}

function transPointerInfoToArray(pointerInfo: PointerData) {
  return [pointerInfo.positionX, pointerInfo.positionY].filter(el => el !== -1)
}

// 마우스 이벤트 핸들러 포인터의 위치를 파악하고 pointerPosition을 갱신한다.
export function handleMouseEvent(
  event: MouseEvent,
  pointerPositionSetter: React.Dispatch<React.SetStateAction<PointerData>>,
  chartAreaXsize: number,
  chartAreaYsize: number
) {
  const $rect = d3.select(event.target as SVGRectElement)
  const data = $rect.data().length > 0 ? $rect.data()[0] : null
  if (
    event.offsetX > 1 &&
    event.offsetY > 1 &&
    event.offsetX < chartAreaXsize - 1 &&
    event.offsetY < chartAreaYsize - 1
  ) {
    pointerPositionSetter({
      positionX: event.offsetX,
      positionY: event.offsetY,
      data: data as CandleData
    })
    return
  }
  pointerPositionSetter({ positionX: -1, positionY: -1, data: null })
}

export function checkNeedFetch(
  candleData: CandleData[],
  option: CandleChartRenderOption
) {
  return (
    candleData.length <
    option.renderStartDataIndex + option.renderCandleCount * 2
  )
}

export function getInitRenderOption(width: number) {
  const candleWidth = Math.ceil(width / DEFAULT_CANDLE_COUNT)
  return {
    candleWidth,
    minCandleWidth: Math.max(5, Math.ceil(width / 200)),
    maxCandleWidth: Math.max(5, Math.ceil(width / 10)),
    renderStartDataIndex: DEFAULT_RENDER_START_INDEX,
    renderCandleCount: DEFAULT_CANDLE_COUNT
  }
}

export function getRenderOptionByWindow(
  width: number,
  prev: CandleChartRenderOption
): CandleChartRenderOption {
  const renderCandleCount = Math.ceil(width / prev.candleWidth)
  const minCandleWidth = Math.max(5, Math.ceil(width / 200))
  const maxCandleWidth = Math.max(5, Math.ceil(width / 10))
  return {
    ...prev,
    renderCandleCount,
    minCandleWidth,
    maxCandleWidth
  }
}

export const colorQuantizeScale = (min: number, max: number, value: number) => {
  return value > 0
    ? d3.scaleQuantize<string>().domain([min, max]).range(redColorScale)(
        Math.abs(value)
      )
    : d3.scaleQuantize<string>().domain([min, max]).range(blueColorScale)(
        Math.abs(value)
      )
}
