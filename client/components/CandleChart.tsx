import * as React from 'react'
import { CandleData, ChartOption } from '@/types/ChartTypes'
import * as d3 from 'd3'
import { DEFAULT_CANDLE_CHART_OPTION } from '@/constants/ChartConstants'

function updateChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[],
  options: ChartOption
) {
  const CHART_CONTAINER_X_SIZE = 1000 // 나중에 옵션으로 반응형 크기 조절
  const CHART_CONTAINER_Y_SIZE = 800 // <-크기조절 안되지 않나여?
  const X_RIGHT_MARGIN = 100
  const Y_RIGHT_MARGIN = 100
  const STEP = 15
  const CHART_AREA_X_SIZE = CHART_CONTAINER_X_SIZE - X_RIGHT_MARGIN
  const CHART_AREA_Y_SIZE = CHART_CONTAINER_Y_SIZE - Y_RIGHT_MARGIN
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', CHART_CONTAINER_X_SIZE)
  chartContainer.attr('height', CHART_CONTAINER_Y_SIZE)
  const chartArea = chartContainer.select('svg#chart-area')
  chartArea.attr('width', CHART_AREA_X_SIZE)
  chartArea.attr('height', CHART_AREA_Y_SIZE)
  chartArea.attr('view')
  const [min, max] = [
    d3.min(data.slice(0, CHART_AREA_X_SIZE / STEP), d => d.low_price),
    d3.max(data.slice(0, CHART_AREA_X_SIZE / STEP), d => d.high_price)
  ]
  if (!min || !max) {
    console.error('데이터에 문제가 있다. 서버에서 잘못 쏨')
    return
  }
  const makeDate = (timestamp: number, period: number): Date => {
    return new Date(timestamp - (timestamp % (period * 1000)))
  }
  const yAxisScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([CHART_AREA_Y_SIZE, 0])

  const xAxisScale = d3
    .scaleTime()
    .domain([makeDate(data[59].timestamp, 60), makeDate(data[0].timestamp, 60)]) //옵션화 필요함
    .range([0, CHART_AREA_X_SIZE])
  const yAxis = chartContainer
    .select<SVGSVGElement>('g#y-axis')
    .attr('transform', `translate(${CHART_AREA_X_SIZE},0)`)
    .call(d3.axisRight(yAxisScale))
  const xAxis = chartContainer
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
          .attr('width', STEP)
          .attr('height', d =>
            Math.abs(yAxisScale(d.trade_price) - yAxisScale(d.opening_price))
          )
          .attr('x', (d, i) => CHART_AREA_X_SIZE - STEP * (i + 1))
          .attr('y', d =>
            Math.min(yAxisScale(d.trade_price), yAxisScale(d.opening_price))
          )
          .attr('fill', d =>
            d.opening_price <= d.trade_price ? 'red' : 'blue'
          )
        $g.append('line')
          .attr('x1', (d, i) => CHART_AREA_X_SIZE + 7 - STEP * (i + 1))
          .attr('x2', (d, i) => CHART_AREA_X_SIZE + 7 - STEP * (i + 1))
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
          .attr('width', STEP)
          .attr('height', d =>
            Math.abs(yAxisScale(d.trade_price) - yAxisScale(d.opening_price)) <=
            0
              ? 1
              : Math.abs(
                  yAxisScale(d.trade_price) - yAxisScale(d.opening_price)
                )
          )
          .attr('x', (d, i) => CHART_AREA_X_SIZE - STEP * (i + 1))
          .attr('y', d =>
            Math.min(yAxisScale(d.trade_price), yAxisScale(d.opening_price))
          )
          .attr('fill', d => (d.opening_price < d.trade_price ? 'red' : 'blue'))
        update
          .select('line')
          .attr('x1', (d, i) => CHART_AREA_X_SIZE + 7 - STEP * (i + 1))
          .attr('x2', (d, i) => CHART_AREA_X_SIZE + 7 - STEP * (i + 1))
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
  // 200 -> 400 -> 600 ->
  // 제화면에서 20개를 보여주고 있어요. 40개가 렌더링되고, 10개 움직이면 마우스가 떼질따마다 10~30번까지보여주잖아요 모자란 10개만 페치..
  // 데이터 셋이.. 아 맞네요.. 유아 라이트.. 뭘 페치 아.. 그렇네요.. 맨 끝에 두개로 하면 되네요.
  // 현재시점에서 내가 보여주고있는 데이터 개수만큼 정확히 예비데이타 있게끔 유지..
  // 아니면 나중에.. 네트워크우선모드 / 성능우선모드 <- 이런식으로
  candleData: CandleData[]
  option: ChartOption
}
export const CandleChart: React.FunctionComponent<CandleChartProps> = props => {
  const chartSvg = React.useRef<SVGSVGElement>(null)
  React.useEffect(() => {
    updateChart(chartSvg, props.candleData, DEFAULT_CANDLE_CHART_OPTION)
  }, [props.candleData])

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
