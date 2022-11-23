import * as React from 'react'
import {
  CandleData,
  ChartOption,
  ChartRenderOption,
  PointerPosition
} from '@/types/ChartTypes'
import * as d3 from 'd3'
import {
  DEFAULT_CANDLER_CHART_RENDER_OPTION,
  DEFAULT_CANDLE_CHART_OPTION,
  MIN_CANDLE_COUNT,
  DEFAULT_POINTER_POSITION
} from '@/constants/ChartConstants'
import { D3ZoomEvent } from 'd3'
const CHART_CONTAINER_X_SIZE = 1000
const CHART_CONTAINER_Y_SIZE = 800
const X_RIGHT_MARGIN = 100
const Y_RIGHT_MARGIN = 100
const CHART_AREA_X_SIZE = CHART_CONTAINER_X_SIZE - X_RIGHT_MARGIN
const CHART_AREA_Y_SIZE = CHART_CONTAINER_Y_SIZE - Y_RIGHT_MARGIN
function makeDate(timestamp: number, period: number): Date {
  return new Date(timestamp - (timestamp % (period * 1000)))
}
function calculateCandlewidth(
  renderOptions: ChartRenderOption,
  chartXSize: number
): number {
  return chartXSize / renderOptions.renderCandleCount
}
function getYAxisScale(data: CandleData[]) {
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
function getOffSetX(renderOpt: ChartRenderOption) {
  // CHART_AREA_X_SIZE 외부 변수사용
  // renderOpt에 CHART관련 속성 추가 어떨지???
  const candleWidth = calculateCandlewidth(renderOpt, CHART_AREA_X_SIZE)
  return renderOpt.translateX % candleWidth
}
// renderOpt period으로 60 대체
function getXAxisScale(renderOpt: ChartRenderOption, data: CandleData[]) {
  const offSetX = getOffSetX(renderOpt)
  const candleWidth = calculateCandlewidth(renderOpt, CHART_AREA_X_SIZE)
  return d3
    .scaleTime()
    .domain([
      //데이터는 End가 최신 데이터이기 때문에, 순서를 반대로 해야 시간순서대로 들어온다?
      makeDate(
        data[renderOpt.renderStartDataIndex + renderOpt.renderCandleCount]
          .timestamp -
          60 * 1000,
        60
      ),
      makeDate(data[renderOpt.renderStartDataIndex].timestamp, 60)
    ])
    .range([-(candleWidth - offSetX), CHART_AREA_X_SIZE + offSetX])
}
function updateChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[],
  renderOpt: ChartRenderOption,
  options: ChartOption,
  pointerInfo: PointerPosition
) {
  const candleWidth = calculateCandlewidth(renderOpt, CHART_AREA_X_SIZE)
  const chartContainer = d3.select(svgRef.current)
  const chartArea = chartContainer.select('svg#chart-area')
  const yAxisScale = getYAxisScale(
    data.slice(
      renderOpt.renderStartDataIndex,
      renderOpt.renderStartDataIndex + renderOpt.renderCandleCount
    )
  )
  if (!yAxisScale) {
    return undefined
  }
  const xAxisScale = getXAxisScale(renderOpt, data)
  chartContainer
    .select<SVGSVGElement>('g#y-axis')
    .attr('transform', `translate(${CHART_AREA_X_SIZE},0)`)
    .call(d3.axisRight(yAxisScale).tickSizeInner(-1 * CHART_AREA_X_SIZE))
  chartContainer
    .select<SVGSVGElement>('g#x-axis')
    .attr('transform', `translate(0,${CHART_AREA_Y_SIZE})`)
    .call(
      d3
        .axisBottom(xAxisScale)
        .tickSizeInner(-1 * CHART_AREA_Y_SIZE)
        .tickSizeOuter(0)
        .ticks(5)
    )
  updateCurrentPrice(yAxisScale, data, renderOpt)
  updatePointerUI(pointerInfo, yAxisScale, renderOpt)
  chartArea
    .selectAll<SVGSVGElement, CandleData>('g')
    .data(data)
    .join(
      enter => {
        const $g = enter.append('g')
        $g.append('rect')
          .attr('width', candleWidth * 0.6)
          .attr('height', d =>
            Math.abs(yAxisScale(d.trade_price) - yAxisScale(d.opening_price))
          )
          .attr('x', (d, i) => CHART_AREA_X_SIZE - candleWidth * (i + 0.8))
          .attr('y', d =>
            Math.min(yAxisScale(d.trade_price), yAxisScale(d.opening_price))
          )
          .attr('fill', d =>
            d.opening_price <= d.trade_price ? 'red' : 'blue'
          )
        $g.append('line')
          .attr(
            'x1',
            (d, i) =>
              CHART_AREA_X_SIZE + candleWidth / 2 - candleWidth * (i + 1)
          )
          .attr(
            'x2',
            (d, i) =>
              CHART_AREA_X_SIZE + candleWidth / 2 - candleWidth * (i + 1)
          )
          .attr('y1', d => yAxisScale(d.low_price))
          .attr('y2', d => yAxisScale(d.high_price))
          .attr('stroke', d =>
            d.opening_price <= d.trade_price ? 'red' : 'blue'
          )
        return $g
      },
      update => {
        update
          .select('rect')
          .attr('width', candleWidth * 0.6)
          .attr('height', d =>
            Math.abs(yAxisScale(d.trade_price) - yAxisScale(d.opening_price)) <=
            0
              ? 1
              : Math.abs(
                  yAxisScale(d.trade_price) - yAxisScale(d.opening_price)
                )
          )
          .attr('x', (d, i) => CHART_AREA_X_SIZE - candleWidth * (i + 0.8))
          .attr('y', d =>
            Math.min(yAxisScale(d.trade_price), yAxisScale(d.opening_price))
          )
          .attr('fill', d => (d.opening_price < d.trade_price ? 'red' : 'blue'))
        update
          .select('line')
          .attr(
            'x1',
            (d, i) =>
              CHART_AREA_X_SIZE + candleWidth / 2 - candleWidth * (i + 1)
          )
          .attr(
            'x2',
            (d, i) =>
              CHART_AREA_X_SIZE + candleWidth / 2 - candleWidth * (i + 1)
          )
          .attr('y1', d => yAxisScale(d.low_price))
          .attr('y2', d => yAxisScale(d.high_price))
          .attr('stroke', d =>
            d.opening_price < d.trade_price ? 'red' : 'blue'
          )
        return update
      },
      exit => {
        exit.remove()
      }
    )
}
interface CandleChartProps {
  candleData: CandleData[]
  option: ChartOption
}

function updateCurrentPrice(
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
    .text(data[0].trade_price.toLocaleString())
}

// svg#mouse-pointer-UI자식요소에 격자구선 선 join
function updatePointerUI(
  pointerInfo: PointerPosition,
  yAxisScale: d3.ScaleLinear<number, number, never>,
  renderOpt: ChartRenderOption
) {
  d3.select('svg#mouse-pointer-UI')
    .selectAll('path')
    .data(transPointerInfoToArray(pointerInfo))
    .join(
      function (enter) {
        return enter
          .append('path')
          .attr('d', (d, i) => pathDAttr(d, i))
          .attr('stroke', 'black')
      },
      function (update) {
        return update.attr('d', (d, i) => pathDAttr(d, i))
      },
      function (exit) {
        return exit.remove()
      }
    )
}

// 격자를 생성할 path요소의 내용 index가 0이라면 세로선 1이라면 가로선
function pathDAttr(d: number, i: number) {
  return i === 0
    ? `M${d} 0 L${d} ${CHART_AREA_Y_SIZE}`
    : `M0 ${d} L${CHART_AREA_X_SIZE} ${d}`
}

function transPointerInfoToArray(pointerInfo: PointerPosition) {
  return [pointerInfo.positionX, pointerInfo.positionY].filter(el => el !== -1)
}

// 마우스 이벤트 핸들러 포인터의 위치를 파악하고 pointerPosition을 갱신한다.
function handleMouseEvent(
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

function initChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[],
  renderOpt: ChartRenderOption,
  CandleMetaDataSetter: React.Dispatch<React.SetStateAction<ChartRenderOption>>,
  pointerPositionSetter: React.Dispatch<React.SetStateAction<PointerPosition>>
) {
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', CHART_CONTAINER_X_SIZE)
  chartContainer.attr('height', CHART_CONTAINER_Y_SIZE)
  const chartArea = chartContainer.select('svg#chart-area')
  chartArea.attr('width', CHART_AREA_X_SIZE)
  chartArea.attr('height', CHART_AREA_Y_SIZE)
  chartArea.attr('view')
  // xAxis초기값 설정
  chartContainer
    .select('svg#x-axis-container')
    .attr('width', CHART_AREA_X_SIZE)
    .attr('height', CHART_AREA_Y_SIZE + 20)
  // currentPrice초기값 설정
  chartContainer.select('svg#current-price').attr('height', CHART_AREA_Y_SIZE)
  const yAxisScale = getYAxisScale(
    data.slice(
      renderOpt.renderStartDataIndex,
      renderOpt.renderStartDataIndex + renderOpt.renderCandleCount
    )
  )
  if (!yAxisScale) {
    console.error('받아온 API 데이터 에러')
    return undefined
  }
  const xAxisScale = getXAxisScale(renderOpt, data)
  chartContainer
    .select<SVGSVGElement>('g#y-axis')
    .attr('transform', `translate(${CHART_AREA_X_SIZE},0)`)
    .call(d3.axisRight(yAxisScale).tickSizeInner(-1 * CHART_AREA_X_SIZE))
  chartContainer
    .select<SVGSVGElement>('g#x-axis')
    .attr('transform', `translate(0,${CHART_AREA_Y_SIZE})`)
    .attr('width', CHART_AREA_X_SIZE)
    .call(
      d3
        .axisBottom(xAxisScale)
        .tickSizeInner(-1 * CHART_AREA_Y_SIZE)
        .ticks(5)
    )
  let transalateX = 0
  let movedCandle = 0
  const zoom = d3
    .zoom<SVGSVGElement, CandleData>()
    .scaleExtent([1, 1])
    .translateExtent([
      [-Infinity, 0],
      [CHART_CONTAINER_X_SIZE, CHART_CONTAINER_Y_SIZE]
    ])
    .on('zoom', function (event: D3ZoomEvent<SVGSVGElement, CandleData>) {
      transalateX = event.transform.x
      CandleMetaDataSetter((prev: ChartRenderOption) => {
        movedCandle = Math.floor(
          transalateX / calculateCandlewidth(prev, CHART_AREA_X_SIZE)
        )
        return {
          ...prev,
          renderStartDataIndex: movedCandle,
          translateX: event.transform.x
        }
      })
      handleMouseEvent(event.sourceEvent, pointerPositionSetter)
      d3.select('#chart-area')
        .selectAll<SVGSVGElement, CandleData>('g')
        .attr('transform', `translate(${event.transform.x})`)
    })
  d3.select<SVGSVGElement, CandleData>('#chart-container')
    .call(zoom)
    .on('wheel', (e: WheelEvent) => {
      CandleMetaDataSetter(prev => {
        return {
          ...prev,
          renderCandleCount: Math.max(
            prev.renderCandleCount + (e.deltaY > 0 ? 1 : -1),
            MIN_CANDLE_COUNT
          )
        }
      })
    })
  d3.select<SVGSVGElement, CandleData>('svg#chart-container').on(
    'mousemove',
    (event: MouseEvent) => {
      handleMouseEvent(event, pointerPositionSetter)
    }
  )
}

export const CandleChart: React.FunctionComponent<CandleChartProps> = props => {
  const chartSvg = React.useRef<SVGSVGElement>(null)
  const [chartRenderOption, setRenderOption] =
    React.useState<ChartRenderOption>(DEFAULT_CANDLER_CHART_RENDER_OPTION)
  const [pointerInfo, setPointerInfo] = React.useState<PointerPosition>(
    DEFAULT_POINTER_POSITION
  )
  React.useEffect(() => {
    initChart(
      chartSvg,
      props.candleData,
      chartRenderOption,
      setRenderOption,
      setPointerInfo
    )
  }, [])

  React.useEffect(() => {
    updateChart(
      chartSvg,
      props.candleData,
      chartRenderOption,
      DEFAULT_CANDLE_CHART_OPTION,
      pointerInfo
    )
  }, [props.candleData, chartRenderOption, pointerInfo])

  return (
    <div id="chart">
      <svg id="chart-container" ref={chartSvg}>
        <g id="y-axis" />
        <svg id="x-axis-container">
          <g id="x-axis" />
        </svg>
        <svg id="chart-area" />
        <svg id="current-price">
          <line />
          <text />
        </svg>
        <svg id="mouse-pointer-UI"></svg>
      </svg>
    </div>
  )
}
