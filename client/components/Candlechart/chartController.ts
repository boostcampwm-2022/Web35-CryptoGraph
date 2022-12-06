import {
  DEFAULT_MAX_CANDLE_DOM_ELEMENT_COUNT,
  CHART_Y_AXIS_MARGIN,
  CHART_X_AXIS_MARGIN,
  CANDLE_CHART_GRID_COLOR,
  CHART_FONT_SIZE,
  CANDLE_COLOR_RED,
  CANDLE_COLOR_BLUE,
  DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT,
  MIN_CANDLE_COUNT
} from '@/constants/ChartConstants'
import { WindowSize } from '@/hooks/useWindowSize'
import {
  CandleData,
  ChartRenderOption,
  PointerPosition
} from '@/types/ChartTypes'
import {
  calculateCandlewidth,
  getYAxisScale,
  getXAxisScale,
  updateCurrentPrice,
  updatePointerUI,
  handleMouseEvent
} from '@/utils/chartManager'
import * as d3 from 'd3'
import { D3DragEvent } from 'd3'

export function initCandleChart(
  svgRef: React.RefObject<SVGSVGElement>,
  optionSetter: React.Dispatch<React.SetStateAction<ChartRenderOption>>,
  pointerPositionSetter: React.Dispatch<React.SetStateAction<PointerPosition>>,
  windowSize: WindowSize
) {
  initCandleChartSVG(svgRef, windowSize)
  addEventsToChart(svgRef, optionSetter, pointerPositionSetter, windowSize)
}
export function updateCandleChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[],
  option: ChartRenderOption,
  pointerInfo: PointerPosition,
  windowSize: WindowSize
) {
  //candleData를 DomElementStartIndex에 맞게 잘라주는작업
  data = data.slice(
    option.DomElementStartIndex,
    option.DomElementStartIndex + DEFAULT_MAX_CANDLE_DOM_ELEMENT_COUNT
  )
  const chartContainerXsize = windowSize.width
  const chartContainerYsize = windowSize.height
  const chartAreaXsize = chartContainerXsize - CHART_Y_AXIS_MARGIN
  const chartAreaYsize = chartContainerYsize - CHART_X_AXIS_MARGIN
  const candleWidth = calculateCandlewidth(option, chartAreaXsize)
  const chartContainer = d3.select(svgRef.current)
  const chartArea = chartContainer.select('svg#chart-area')
  const yAxisScale = getYAxisScale(
    data.slice(
      option.renderStartDataIndex,
      option.renderStartDataIndex + option.renderCandleCount
    ),
    chartAreaYsize
  )
  if (!yAxisScale) {
    return undefined
  }
  const xAxisScale = getXAxisScale(option, data, chartAreaXsize)
  UpdateAxis(
    chartContainer,
    xAxisScale,
    yAxisScale,
    chartAreaXsize,
    chartAreaYsize
  ) // axis를 업데이트한다.
  updateCurrentPrice(yAxisScale, data, option, chartAreaXsize)
  updatePointerUI(
    pointerInfo,
    yAxisScale,
    option,
    data,
    chartAreaXsize,
    chartAreaYsize
  )
  chartArea
    .selectAll<SVGSVGElement, CandleData>('g')
    .data(data)
    .join(
      enter => {
        let $g = enter.append('g')
        $g.attr('transform', `translate(${option.translateX})`)
        $g.append('line')
        $g = placeCandleLine($g, chartAreaXsize, candleWidth, yAxisScale)
        $g.append('rect')
        $g = placeCandleRect($g, chartAreaXsize, candleWidth, yAxisScale)
        return $g
      },
      update => {
        // placeCandleLine, Rect
        update
          .attr('transform', `translate(${option.translateX})`) //263번 줄에서 수정, 차트 움직임을 zoom이벤트 ->updateChart에서 관리
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
          .attr('x', (d, i) => chartAreaXsize - candleWidth * (i + 0.8))
          .attr('y', d =>
            Math.min(yAxisScale(d.trade_price), yAxisScale(d.opening_price))
          )
          .attr('fill', d =>
            d.opening_price < d.trade_price
              ? CANDLE_COLOR_RED
              : CANDLE_COLOR_BLUE
          )
        update
          .select('line')
          .attr(
            'x1',
            (d, i) => chartAreaXsize + candleWidth / 2 - candleWidth * (i + 1)
          )
          .attr(
            'x2',
            (d, i) => chartAreaXsize + candleWidth / 2 - candleWidth * (i + 1)
          )
          .attr('y1', d => yAxisScale(d.low_price))
          .attr('y2', d => yAxisScale(d.high_price))
        return update
      },
      exit => {
        exit.remove()
      }
    )
}

export function initCandleChartSVG(
  svgRef: React.RefObject<SVGSVGElement>,
  windowSize: WindowSize
) {
  const chartContainerXsize = windowSize.width
  const chartContainerYsize = windowSize.height
  const chartAreaXsize = chartContainerXsize - CHART_Y_AXIS_MARGIN
  const chartAreaYsize = chartContainerYsize - CHART_X_AXIS_MARGIN
  //margin값도 크기에 맞춰 변수화 시켜야함.
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', chartContainerXsize)
  chartContainer.attr('height', chartContainerYsize)
  const chartArea = chartContainer.select('svg#chart-area')
  chartArea.attr('width', chartAreaXsize)
  chartArea.attr('height', chartAreaYsize)
  chartArea.attr('view')
  // xAxis초기값 설정
  chartContainer
    .select('svg#x-axis-container')
    .attr('width', chartAreaXsize)
    .attr('height', chartAreaYsize + 20)
  // currentPrice초기값 설정
  chartContainer.select('svg#current-price').attr('height', chartAreaYsize)
  // text 위치설정 매직넘버? 반응형 고려하면 변수화도 고려되어야할듯
  chartContainer.select('text#price-info').attr('x', 20).attr('y', 20)
}

export function addEventsToChart(
  svgRef: React.RefObject<SVGSVGElement>,
  optionSetter: React.Dispatch<React.SetStateAction<ChartRenderOption>>,
  pointerPositionSetter: React.Dispatch<React.SetStateAction<PointerPosition>>,
  windowSize: WindowSize
) {
  const chartContainerXsize = windowSize.width
  const chartContainerYsize = windowSize.height
  const chartAreaXsize = chartContainerXsize - CHART_Y_AXIS_MARGIN
  const chartAreaYsize = chartContainerYsize - CHART_X_AXIS_MARGIN
  //margin값도 크기에 맞춰 변수화 시켜야함.
  // xAxis초기값 설정
  // currentPrice초기값 설정
  d3.select<SVGSVGElement, CandleData>('#chart-container')
    .call(
      d3
        .drag<SVGSVGElement, CandleData>()
        .on(
          'drag',
          (event: D3DragEvent<SVGSVGElement, CandleData, unknown>) => {
            optionSetter((prev: ChartRenderOption) => {
              const movedCandle = Math.max(
                Math.floor(
                  (prev.translateX + event.dx) /
                    calculateCandlewidth(prev, chartAreaXsize)
                ),
                0
              )

              return {
                ...prev,
                renderStartDataIndex: movedCandle,
                translateX: Math.max(prev.translateX + event.dx, 0)
              }
            })
            handleMouseEvent(
              event.sourceEvent,
              pointerPositionSetter,
              chartAreaXsize,
              chartAreaYsize
            )
          }
        )
    )
    .on('wheel', (e: WheelEvent) => {
      e.preventDefault()
      optionSetter((prev: ChartRenderOption) => {
        const newRenderCandleCount = Math.min(
          Math.max(
            prev.renderCandleCount + (e.deltaY > 0 ? 1 : -1), //휠이벤트 e.deltaY가 확대면 -1 축소면 +1
            MIN_CANDLE_COUNT
          ),
          DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT //최소 5~200개로 제한
        )
        const newTranslateX =
          calculateCandlewidth(
            { ...prev, renderCandleCount: newRenderCandleCount },
            chartAreaXsize
          ) * prev.renderStartDataIndex
        return {
          ...prev,
          renderCandleCount: newRenderCandleCount,
          translateX: newTranslateX
        }
      })
    })
  d3.select<SVGSVGElement, CandleData>('svg#chart-container').on(
    'mousemove',
    (event: MouseEvent) => {
      handleMouseEvent(
        event,
        pointerPositionSetter,
        chartAreaXsize,
        chartAreaYsize
      )
    }
  )
}

function UpdateAxis(
  chartContainer: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  xAxisScale: d3.ScaleTime<number, number, never>,
  yAxisScale: d3.ScaleLinear<number, number, never>,
  chartAreaXsize: number,
  chartAreaYsize: number
) {
  chartContainer
    .select<SVGSVGElement>('g#y-axis')
    .attr('transform', `translate(${chartAreaXsize},0)`)
    .call(d3.axisRight(yAxisScale).tickSizeInner(-1 * chartAreaXsize))
    .call(g => {
      g.selectAll('.tick line').attr('stroke', CANDLE_CHART_GRID_COLOR)
      g.selectAll('.tick text')
        .attr('stroke', 'black')
        .attr('font-size', CHART_FONT_SIZE)
    })
  chartContainer
    .select<SVGSVGElement>('g#x-axis')
    .attr('transform', `translate(0,${chartAreaYsize})`)
    .call(
      d3
        .axisBottom(xAxisScale)
        .tickSizeInner(-1 * chartAreaYsize)
        .tickSizeOuter(0)
        .ticks(5)
    )
    .call(g => {
      g.selectAll('.tick line').attr('stroke', CANDLE_CHART_GRID_COLOR)
      g.selectAll('.tick text')
        .attr('stroke', 'black')
        .attr('font-size', CHART_FONT_SIZE)
    })
}

function placeCandleLine(
  $g: d3.Selection<SVGGElement, CandleData, d3.BaseType, unknown>,
  chartAreaXsize: number,
  candleWidth: number,
  yAxisScale: d3.ScaleLinear<number, number, never>
) {
  $g.attr(
    'x1',
    (d, i) => chartAreaXsize + candleWidth / 2 - candleWidth * (i + 1)
  )
    .attr(
      'x2',
      (d, i) => chartAreaXsize + candleWidth / 2 - candleWidth * (i + 1)
    )
    .attr('y1', d => yAxisScale(d.low_price))
    .attr('y2', d => yAxisScale(d.high_price))
    .attr('stroke', 'black')
  return $g
}

function placeCandleRect(
  $g: d3.Selection<SVGGElement, CandleData, d3.BaseType, unknown>,
  chartAreaXsize: number,
  candleWidth: number,
  yAxisScale: d3.ScaleLinear<number, number, never>
) {
  $g.attr('width', candleWidth * 0.6)
    .attr('height', d =>
      Math.abs(yAxisScale(d.trade_price) - yAxisScale(d.opening_price))
    )
    .attr('x', (d, i) => chartAreaXsize - candleWidth * (i + 0.8))
    .attr('y', d =>
      Math.min(yAxisScale(d.trade_price), yAxisScale(d.opening_price))
    )
    .attr('fill', d =>
      d.opening_price <= d.trade_price ? CANDLE_COLOR_RED : CANDLE_COLOR_BLUE
    )
  return $g
}
