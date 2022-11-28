import {
  CHART_AREA_Y_SIZE,
  CHART_AREA_X_SIZE
} from '@/constants/ChartConstants'
import {
  ChartRenderOption,
  CandleData,
  PointerPosition
} from '@/types/ChartTypes'
import * as d3 from 'd3'
import { makeDate } from './dateManager'

export function calculateCandlewidth(
  option: ChartRenderOption,
  chartXSize: number
): number {
  return chartXSize / option.renderCandleCount
}
export function getYAxisScale(data: CandleData[]) {
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
export function getOffSetX(renderOpt: ChartRenderOption) {
  // CHART_AREA_X_SIZE 외부 변수사용
  // renderOpt에 CHART관련 속성 추가 어떨지???
  const candleWidth = calculateCandlewidth(renderOpt, CHART_AREA_X_SIZE)
  return renderOpt.translateX % candleWidth
}
// renderOpt period으로 60 대체
export function getXAxisScale(option: ChartRenderOption, data: CandleData[]) {
  const offSetX = getOffSetX(option)
  const candleWidth = calculateCandlewidth(option, CHART_AREA_X_SIZE)
  const index = option.renderStartDataIndex + option.renderCandleCount
  return d3
    .scaleTime()
    .domain([
      //데이터는 End가 최신 데이터이기 때문에, 순서를 반대로 해야 시간순서대로 들어온다?
      makeDate(data[index].timestamp - 60 * 1000, 60),
      makeDate(data[option.renderStartDataIndex].timestamp, 60)
    ])
    .range([-(candleWidth - offSetX), CHART_AREA_X_SIZE + offSetX])
}

export function updateCurrentPrice(
  yAxisScale: d3.ScaleLinear<number, number, never>,
  data: CandleData[],
  renderOpt: ChartRenderOption
) {
  const $currentPrice = d3.select('svg#current-price')
  const yCoord = yAxisScale(data[0].trade_price)
  const strokeColor =
    data[0].opening_price < data[0].trade_price ? 'red' : 'blue'
  $currentPrice
    .select('line')
    .attr('x1', CHART_AREA_X_SIZE)
    .attr('x2', 0)
    .attr('y1', yCoord)
    .attr('y2', yCoord)
    .attr('stroke', strokeColor)
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '10,10')
  $currentPrice
    .select('text')
    .attr('fill', strokeColor)
    .attr('font-size', 15)
    .attr('transform', `translate(${CHART_AREA_X_SIZE + 3}, ${yCoord})`)
    .attr('dominant-baseline', 'middle')
    .text(data[0].trade_price.toLocaleString())
}

// svg#mouse-pointer-UI자식요소에 격자구선 선 join
export function updatePointerUI(
  pointerInfo: PointerPosition,
  yAxisScale: d3.ScaleLinear<number, number, never>,
  renderOpt: ChartRenderOption,
  data: CandleData[]
) {
  const { priceText, color } = getPriceInfo(
    pointerInfo.positionX,
    renderOpt,
    data
  )
  d3.select('text#price-info')
    .attr('fill', color ? color : 'black')
    .attr('font-size', 15)
    .text(priceText)
  d3.select('svg#mouse-pointer-UI')
    .selectAll('g')
    .data(transPointerInfoToArray(pointerInfo))
    .join(
      function (enter) {
        const $g = enter.append('g')
        $g.append('path')
          .attr('d', (d, i) => getPathDAttr(d, i))
          .attr('stroke', 'black')
        $g.append('text')
          .attr('fill', 'black')
          .attr('font-size', 12)
          .attr('transform', (d, i) => getTextTransform(d, i))
          .text((d, i) => {
            if (i === 0) {
              return getTimeText(d, renderOpt, data)
            }
            return yAxisScale.invert(d)
          })
          .attr('text-anchor', (d, i) => (i === 0 ? 'middle' : 'start'))
          .attr('dominant-baseline', (d, i) => (i === 0 ? 'hanging' : 'middle'))
        return $g
      },
      function (update) {
        update.select('path').attr('d', (d, i) => getPathDAttr(d, i))
        update
          .select('text')
          .attr('transform', (d, i) => getTextTransform(d, i))
          .text((d, i) => {
            if (i === 0) {
              return getTimeText(d, renderOpt, data)
            }
            return Math.round(yAxisScale.invert(d))
          })
          .attr('text-anchor', (d, i) => (i === 0 ? 'middle' : 'start'))
          .attr('dominant-baseline', (d, i) => (i === 0 ? 'hanging' : 'middle'))
        return update
      },
      function (exit) {
        return exit.remove()
      }
    )
}

// text위치 정보 반환
function getTextTransform(d: number, i: number) {
  return i === 0
    ? `translate(${d},${CHART_AREA_Y_SIZE + 3})`
    : `translate(${CHART_AREA_X_SIZE + 3}, ${d})`
}

// 시간정보 텍스트 반환
// 가격은 yAxisSclae로 변환하면 되는데 xAxisScale은 적용할 수 없음
function getTimeText(
  positionX: number,
  renderOpt: ChartRenderOption,
  data: CandleData[]
) {
  const timeString =
    data[getDataIndexFromPosX(positionX, renderOpt)].candle_date_time_kst
  return `${timeString.substring(5, 10)} ${timeString.substring(11, 16)}`
}

// 마우스 포인터 x좌표와 renderOpt를 이용해 몇번째 데이터인지 인덱스 반환
function getDataIndexFromPosX(positionX: number, renderOpt: ChartRenderOption) {
  const offSetX = renderOpt.translateX + (CHART_AREA_X_SIZE - positionX)
  const candleWidth = calculateCandlewidth(renderOpt, CHART_AREA_X_SIZE)
  return Math.floor(offSetX / candleWidth)
}

// 마우스 포인터가 가르키는 위치의 분봉데이터를 찾아 렌더링될 가격정보를 반환
function getPriceInfo(
  positionX: number,
  renderOpt: ChartRenderOption,
  data: CandleData[]
) {
  if (positionX < 0) {
    return { priceText: '' }
  }
  const index = getDataIndexFromPosX(positionX, renderOpt)
  const candleUnitData = data[index]
  return {
    priceText: [
      `고가: ${candleUnitData.high_price}`,
      `저가: ${candleUnitData.low_price}`,
      `시가: ${candleUnitData.opening_price}`,
      `종가: ${candleUnitData.trade_price}`
    ].join('  '),
    color:
      candleUnitData.opening_price < candleUnitData.trade_price ? 'red' : 'blue'
  }
}

// 격자를 생성할 path요소의 내용 index가 0이라면 세로선 1이라면 가로선
function getPathDAttr(d: number, i: number) {
  return i === 0
    ? `M${d} 0 L${d} ${CHART_AREA_Y_SIZE}`
    : `M0 ${d} L${CHART_AREA_X_SIZE} ${d}`
}

function transPointerInfoToArray(pointerInfo: PointerPosition) {
  return [pointerInfo.positionX, pointerInfo.positionY].filter(el => el !== -1)
}

// 마우스 이벤트 핸들러 포인터의 위치를 파악하고 pointerPosition을 갱신한다.
export function handleMouseEvent(
  event: MouseEvent,
  pointerPositionSetter: React.Dispatch<React.SetStateAction<PointerPosition>>
) {
  if (
    event.offsetX >= 0 &&
    event.offsetY >= 0 &&
    event.offsetX <= CHART_AREA_X_SIZE &&
    event.offsetY <= CHART_AREA_Y_SIZE
  ) {
    pointerPositionSetter({
      positionX: event.offsetX,
      positionY: event.offsetY
    })
    return
  }
  pointerPositionSetter({ positionX: -1, positionY: -1 })
}
