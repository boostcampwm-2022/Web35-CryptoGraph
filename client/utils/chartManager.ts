import {
  CANDLE_COLOR_RED,
  CANDLE_COLOR_BLUE,
  CANDLE_CHART_POINTER_LINE_COLOR,
  CHART_FONT_SIZE,
  DEFAULT_MAX_CANDLE_DOM_ELEMENT_COUNT,
  DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT,
  CHART_Y_AXIS_MARGIN
} from '@/constants/ChartConstants'
import { WindowSize } from 'hooks/useWindowSize'
import {
  ChartRenderOption,
  CandleData,
  PointerPosition
} from '@/types/ChartTypes'
import * as d3 from 'd3'
import { makeDate } from './dateManager'
import { CandleChartProps } from '@/components/Candlechart'
import { blueColorScale, redColorScale } from '@/styles/colorScale'

export function calculateCandlewidth(
  option: ChartRenderOption,
  chartXSize: number
): number {
  return chartXSize / option.renderCandleCount
}
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
export function getOffSetX(
  renderOpt: ChartRenderOption,
  chartAreaXsize: number
) {
  // CHART_AREA_X_SIZE 외부 변수사용
  // renderOpt에 CHART관련 속성 추가 어떨지???
  const candleWidth = calculateCandlewidth(renderOpt, chartAreaXsize)
  return renderOpt.translateX % candleWidth
}
// renderOpt period으로 60 대체
export function getXAxisScale(
  option: ChartRenderOption,
  data: CandleData[],
  chartAreaXsize: number
) {
  const offSetX = getOffSetX(option, chartAreaXsize)
  const candleWidth = calculateCandlewidth(option, chartAreaXsize)
  const index = option.renderStartDataIndex + option.renderCandleCount
  return d3
    .scaleTime()
    .domain([
      //데이터는 End가 최신 데이터이기 때문에, 순서를 반대로 해야 시간순서대로 들어온다?
      makeDate(data[index].timestamp - 60 * 1000, 60),
      makeDate(data[option.renderStartDataIndex].timestamp, 60)
    ])
    .range([-(candleWidth - offSetX), chartAreaXsize + offSetX])
}

export function updateCurrentPrice(
  yAxisScale: d3.ScaleLinear<number, number, never>,
  data: CandleData[],
  renderOpt: ChartRenderOption,
  chartAreaXsize: number
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
    .select('text')
    .attr('fill', strokeColor)
    .attr('font-size', CHART_FONT_SIZE)
    .attr('transform', `translate(${chartAreaXsize + 3}, ${yCoord})`)
    .attr('dominant-baseline', 'middle')
    .text(data[0].trade_price.toLocaleString())
}

// svg#mouse-pointer-UI자식요소에 격자구선 선 join
export function updatePointerUI(
  pointerInfo: PointerPosition,
  yAxisScale: d3.ScaleLinear<number, number, never>,
  renderOpt: ChartRenderOption,
  data: CandleData[],
  chartAreaXsize: number,
  chartAreaYsize: number
) {
  const { priceText, color } = getPriceInfo(
    pointerInfo.positionX,
    renderOpt,
    data,
    chartAreaXsize
  )
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
        $g.append('text')
          .attr('fill', 'black')
          .attr('font-size', CHART_FONT_SIZE)
          .attr('transform', (d, i) =>
            getTextTransform(d, i, chartAreaXsize, chartAreaYsize)
          )
          .text((d, i) => {
            if (i === 0) {
              return getTimeText(d, renderOpt, data, chartAreaXsize)
            }
            return Math.round(yAxisScale.invert(d)).toLocaleString()
          })
          .attr('text-anchor', (d, i) => (i === 0 ? 'middle' : 'start'))
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
          .select('text')
          .attr('transform', (d, i) =>
            getTextTransform(d, i, chartAreaXsize, chartAreaYsize)
          )
          .text((d, i) => {
            if (i === 0) {
              return getTimeText(d, renderOpt, data, chartAreaXsize)
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
  d: number,
  i: number,
  chartAreaXsize: number,
  chartAreaYsize: number
) {
  return i === 0
    ? `translate(${d},${chartAreaYsize + 3})`
    : `translate(${chartAreaXsize + 3}, ${d})`
}

// 시간정보 텍스트 반환
// 가격은 yAxisSclae로 변환하면 되는데 xAxisScale은 적용할 수 없음
function getTimeText(
  positionX: number,
  renderOpt: ChartRenderOption,
  data: CandleData[],
  chartAreaXsize: number
) {
  const timeString =
    data[getDataIndexFromPosX(positionX, renderOpt, chartAreaXsize)]
      .candle_date_time_kst
  return `${timeString.substring(5, 10)} ${timeString.substring(11, 16)}`
}

// 마우스 포인터 x좌표와 renderOpt를 이용해 몇번째 데이터인지 인덱스 반환
function getDataIndexFromPosX(
  positionX: number,
  renderOpt: ChartRenderOption,
  chartAreaXsize: number
) {
  const offSetX = renderOpt.translateX + (chartAreaXsize - positionX)
  const candleWidth = calculateCandlewidth(renderOpt, chartAreaXsize)
  return Math.floor(offSetX / candleWidth) < 0
    ? 0
    : Math.floor(offSetX / candleWidth)
  //이거 가끔 음수를 return하는데?
}

// 마우스 포인터가 가리키는 위치의 분봉데이터를 찾아 렌더링될 가격정보를 반환
function getPriceInfo(
  positionX: number,
  renderOpt: ChartRenderOption,
  data: CandleData[],
  chartAreaXsize: number
) {
  if (positionX < 0) {
    return { priceText: '' }
  }

  const index = getDataIndexFromPosX(positionX, renderOpt, chartAreaXsize)
  if (index < 0) {
    console.error('예외상황')
    return { priceText: '' }
  }
  const candleUnitData = data[index]
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

function transPointerInfoToArray(pointerInfo: PointerPosition) {
  return [pointerInfo.positionX, pointerInfo.positionY].filter(el => el !== -1)
}

// 마우스 이벤트 핸들러 포인터의 위치를 파악하고 pointerPosition을 갱신한다.
export function handleMouseEvent(
  event: MouseEvent,
  pointerPositionSetter: React.Dispatch<React.SetStateAction<PointerPosition>>,
  chartAreaXsize: number,
  chartAreaYsize: number
) {
  if (
    event.offsetX >= 0 &&
    event.offsetY >= 0 &&
    event.offsetX <= chartAreaXsize &&
    event.offsetY <= chartAreaYsize
  ) {
    pointerPositionSetter({
      positionX: event.offsetX,
      positionY: event.offsetY
    })
    return
  }
  pointerPositionSetter({ positionX: -1, positionY: -1 })
}
export function checkNeedPastFetch(
  candleData: CandleData[],
  option: ChartRenderOption
) {
  return {
    result:
      Math.min(
        candleData.length - option.DomElementStartIndex,
        DEFAULT_MAX_CANDLE_DOM_ELEMENT_COUNT
      ) <
      option.renderStartDataIndex + option.renderCandleCount + 100,
    //1000개의 data인데 현재 200~800인 경우 fetch할 필요가 없이 optionSetter만 넘겨주면 됩니다.
    willFetch:
      Math.ceil((candleData.length - option.DomElementStartIndex) / 100) *
        100 <=
      DEFAULT_MAX_CANDLE_DOM_ELEMENT_COUNT
  }
}
export function checkNeedFutureFetch(
  candleData: CandleData[],
  option: ChartRenderOption
) {
  return (
    candleData.length >= DEFAULT_MAX_CANDLE_DOM_ELEMENT_COUNT &&
    option.renderStartDataIndex < 100 &&
    option.DomElementStartIndex > 0
  )
}
export function goToPast(props: CandleChartProps, windowSize: WindowSize) {
  return {
    ...props.option,
    DomElementStartIndex:
      props.option.DomElementStartIndex +
      DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT,
    renderStartDataIndex:
      props.option.renderStartDataIndex -
      DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT,
    translateX:
      props.option.translateX -
      DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT *
        calculateCandlewidth(
          props.option,
          windowSize.width - CHART_Y_AXIS_MARGIN
        )
  }
}
export function goToFuture(props: CandleChartProps, windowSize: WindowSize) {
  return {
    ...props.option,
    DomElementStartIndex:
      props.option.DomElementStartIndex -
      DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT,
    renderStartDataIndex:
      props.option.renderStartDataIndex +
      DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT,
    translateX:
      props.option.translateX +
      DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT *
        calculateCandlewidth(
          props.option,
          windowSize.width - CHART_Y_AXIS_MARGIN
        )
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
