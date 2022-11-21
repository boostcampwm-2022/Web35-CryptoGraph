import * as React from 'react'
import { CandleData, ChartRenderOption } from '@/types/ChartTypes'
import * as d3 from 'd3'
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
  option: ChartRenderOption,
  chartXSize: number
): number {
  return chartXSize / option.renderCandleCount
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
function getXAxisScale(option: ChartRenderOption, data: CandleData[]) {
  return d3
    .scaleTime()
    .domain([
      //데이터는 End가 최신 데이터이기 때문에, 순서를 반대로 해야 시간순서대로 들어온다?
      makeDate(
        data[option.renderStartDataIndex + option.renderCandleCount].timestamp,
        60
      ),
      makeDate(data[option.renderStartDataIndex].timestamp, 60)
    ]) //옵션화 필요함
    .range([0, CHART_AREA_X_SIZE])
    .nice()
}
function updateChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[],
  option: ChartRenderOption
) {
  const candleWidth = calculateCandlewidth(option, CHART_AREA_X_SIZE)
  const chartContainer = d3.select(svgRef.current)
  const chartArea = chartContainer.select('svg#chart-area')
  console.log(
    '범위',
    option.renderStartDataIndex,
    option.renderStartDataIndex + option.renderCandleCount
  )
  const yAxisScale = getYAxisScale(
    data.slice(
      option.renderStartDataIndex,
      option.renderStartDataIndex + option.renderCandleCount
    )
  )
  if (!yAxisScale) {
    console.error('받아온 API 데이터 에러')
    return undefined
  }
  const xAxisScale = getXAxisScale(option, data)
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
  option: ChartRenderOption
  optionSetter: React.Dispatch<React.SetStateAction<ChartRenderOption>>
}

function initChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[],
  option: ChartRenderOption,
  optionSetter: React.Dispatch<React.SetStateAction<ChartRenderOption>>
) {
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', CHART_CONTAINER_X_SIZE)
  chartContainer.attr('height', CHART_CONTAINER_Y_SIZE)
  const chartArea = chartContainer.select('svg#chart-area')
  chartArea.attr('width', CHART_AREA_X_SIZE)
  chartArea.attr('height', CHART_AREA_Y_SIZE)
  chartArea.attr('view')
  console.error(option.renderStartDataIndex, option.renderCandleCount)
  const yAxisScale = getYAxisScale(
    data.slice(
      option.renderStartDataIndex,
      option.renderStartDataIndex + option.renderCandleCount
    )
  )
  if (!yAxisScale) {
    console.error('받아온 API 데이터 에러')
    return undefined
  }
  const xAxisScale = getXAxisScale(option, data)
  chartContainer
    .select<SVGSVGElement>('g#y-axis')
    .attr('transform', `translate(${CHART_AREA_X_SIZE},0)`)
    .call(d3.axisRight(yAxisScale))
  chartContainer
    .select<SVGSVGElement>('g#x-axis')
    .attr('transform', `translate(0,${CHART_AREA_Y_SIZE})`)
    .call(d3.axisBottom(xAxisScale))
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
      optionSetter((prev: ChartRenderOption) => {
        movedCandle = Math.floor(
          transalateX / calculateCandlewidth(prev, CHART_AREA_X_SIZE)
        )
        return {
          ...prev,
          renderStartDataIndex: movedCandle
        }
      })
      d3.select('#chart-area')
        .selectAll<SVGSVGElement, CandleData>('g')
        .attr('transform', `translate(${event.transform.x})`)
    })
  d3.select<SVGSVGElement, CandleData>('#chart-container')
    .call(zoom)
    .on('wheel', (e: WheelEvent) => {
      optionSetter(prev => {
        return {
          ...prev,
          renderCandleCount: prev.renderCandleCount + (e.deltaY > 0 ? 1 : -1)
        }
      })
    })
}

export const CandleChart: React.FunctionComponent<CandleChartProps> = props => {
  const chartSvg = React.useRef<SVGSVGElement>(null)
  React.useEffect(() => {
    initChart(chartSvg, props.candleData, props.option, props.optionSetter)
  }, [])

  React.useEffect(() => {
    updateChart(chartSvg, props.candleData, props.option)
  }, [props.candleData, props.option])

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
