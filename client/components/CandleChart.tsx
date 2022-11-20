import * as React from 'react'
import { CandleData, ChartOption, ChartRenderOption } from '@/types/ChartTypes'
import * as d3 from 'd3'
import {
  DEFAULT_CANDLER_CHART_RENDER_OPTION,
  DEFAULT_CANDLE_CHART_OPTION
} from '@/constants/ChartConstants'
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
  return (
    chartXSize /
    (renderOptions.renderEndDataIndex - renderOptions.renderStartDataIndex)
  )
}
function getYAxisScale(data: CandleData[]) {
  const [min, max] = [
    d3.min(data, d => d.low_price),
    d3.max(data, d => d.high_price)
  ]
  if (!min || !max) {
    console.error('데이터에 문제가 있다. 서버에서 잘못 쏨')
    return undefined
  }
  return d3.scaleLinear().domain([min, max]).range([CHART_AREA_Y_SIZE, 0])
}
function getXAxisScale(renderOpt: ChartRenderOption, data: CandleData[]) {
  return d3
    .scaleTime()
    .domain([
      //데이터는 End가 최신 데이터이기 때문에, 순서를 반대로 해야 시간순서대로 들어온다?
      makeDate(data[renderOpt.renderEndDataIndex].timestamp, 60),
      makeDate(data[renderOpt.renderStartDataIndex].timestamp, 60)
    ]) //옵션화 필요함
    .range([0, CHART_AREA_X_SIZE])
    .nice()
}
function updateChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[],
  renderOpt: ChartRenderOption,
  options: ChartOption
) {
  const candleWidth = calculateCandlewidth(renderOpt, CHART_AREA_X_SIZE)
  const chartContainer = d3.select(svgRef.current)
  const chartArea = chartContainer.select('svg#chart-area')
  const yAxisScale = getYAxisScale(
    data.slice(renderOpt.renderStartDataIndex, renderOpt.renderEndDataIndex)
  )
  if (!yAxisScale) {
    console.error('받아온 API 데이터 에러')
    return undefined
  }
  const xAxisScale = getXAxisScale(renderOpt, data)
  chartContainer
    .select<SVGSVGElement>('g#y-axis')
    .attr('transform', `translate(${CHART_AREA_X_SIZE},0)`)
    .call(d3.axisRight(yAxisScale))
  chartContainer
    .select<SVGSVGElement>('g#x-axis')
    .attr('transform', `translate(0,${CHART_AREA_Y_SIZE})`)
    .call(d3.axisBottom(xAxisScale))
  chartArea
    .selectAll<SVGSVGElement, CandleData>('g')
    .data(data)
    .join(
      enter => {
        const $g = enter.append('g')
        $g.append('rect')
          .attr('width', candleWidth)
          .attr('height', d =>
            Math.abs(yAxisScale(d.trade_price) - yAxisScale(d.opening_price))
          )
          .attr('x', (d, i) => CHART_AREA_X_SIZE - candleWidth * (i + 1))
          .attr('y', d =>
            Math.min(yAxisScale(d.trade_price), yAxisScale(d.opening_price))
          )
          .attr('fill', d =>
            d.opening_price <= d.trade_price ? 'red' : 'blue'
          )
        $g.append('line')
          .attr('x1', (d, i) => CHART_AREA_X_SIZE + 7 - candleWidth * (i + 1))
          .attr('x2', (d, i) => CHART_AREA_X_SIZE + 7 - candleWidth * (i + 1))
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
          .attr('width', candleWidth)
          .attr('height', d =>
            Math.abs(yAxisScale(d.trade_price) - yAxisScale(d.opening_price)) <=
            0
              ? 1
              : Math.abs(
                  yAxisScale(d.trade_price) - yAxisScale(d.opening_price)
                )
          )
          .attr('x', (d, i) => CHART_AREA_X_SIZE - candleWidth * (i + 1))
          .attr('y', d =>
            Math.min(yAxisScale(d.trade_price), yAxisScale(d.opening_price))
          )
          .attr('fill', d => (d.opening_price < d.trade_price ? 'red' : 'blue'))
        update
          .select('line')
          .attr('x1', (d, i) => CHART_AREA_X_SIZE + 7 - candleWidth * (i + 1))
          .attr('x2', (d, i) => CHART_AREA_X_SIZE + 7 - candleWidth * (i + 1))
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

function initChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[],
  renderOpt: ChartRenderOption,
  CandleMetaDataSetter: React.Dispatch<React.SetStateAction<ChartRenderOption>>
) {
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', CHART_CONTAINER_X_SIZE)
  chartContainer.attr('height', CHART_CONTAINER_Y_SIZE)
  const chartArea = chartContainer.select('svg#chart-area')
  chartArea.attr('width', CHART_AREA_X_SIZE)
  chartArea.attr('height', CHART_AREA_Y_SIZE)
  chartArea.attr('view')
  const yAxisScale = getYAxisScale(
    data.slice(renderOpt.renderStartDataIndex, renderOpt.renderEndDataIndex)
  )
  if (!yAxisScale) {
    console.error('받아온 API 데이터 에러')
    return undefined
  }
  const xAxisScale = getXAxisScale(renderOpt, data)
  const yAxis = chartContainer
    .select<SVGSVGElement>('g#y-axis')
    .attr('transform', `translate(${CHART_AREA_X_SIZE},0)`)
    .call(d3.axisRight(yAxisScale))
  const xAxis = chartContainer
    .select<SVGSVGElement>('g#x-axis')
    .attr('transform', `translate(0,${CHART_AREA_Y_SIZE})`)
    .call(d3.axisBottom(xAxisScale))
  const zoom = d3
    .zoom<SVGSVGElement, CandleData>()
    .scaleExtent([1, 1])
    .translateExtent([
      [-Infinity, 0],
      [CHART_CONTAINER_X_SIZE, CHART_CONTAINER_Y_SIZE]
    ])
    .on('zoom', function (event) {
      const newX = event.transform.rescaleX(xAxisScale)
      const newY = event.transform.rescaleY(yAxisScale)
      xAxis.call(d3.axisBottom(newX))
      yAxis.call(d3.axisLeft(newY))
      d3.select('#chart-area').selectAll('g').attr('transform', event.transform)
    })
  d3.select<SVGSVGElement, CandleData>('#chart-container')
    //.call(zoom)
    .on('wheel', (e: WheelEvent) => {
      CandleMetaDataSetter(prev => {
        return {
          ...prev,
          renderEndDataIndex: prev.renderEndDataIndex + (e.deltaY > 0 ? 1 : -1)
        }
      })
    })
}

export const CandleChart: React.FunctionComponent<CandleChartProps> = props => {
  const chartSvg = React.useRef<SVGSVGElement>(null)
  const [chartRenderOption, setRenderOption] =
    React.useState<ChartRenderOption>(DEFAULT_CANDLER_CHART_RENDER_OPTION)
  React.useEffect(() => {
    initChart(chartSvg, props.candleData, chartRenderOption, setRenderOption)
  }, [])

  React.useEffect(() => {
    updateChart(
      chartSvg,
      props.candleData,
      chartRenderOption,
      DEFAULT_CANDLE_CHART_OPTION
    )
  }, [props.candleData, chartRenderOption])

  return (
    <div id="chart">
      <svg id="chart-container" ref={chartSvg}>
        <svg id="chart-area" />
        <g id="y-axis" />
        <g id="x-axis" />
      </svg>
    </div>
  )
}
