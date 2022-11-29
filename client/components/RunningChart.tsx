import * as d3 from 'd3'
import * as React from 'react'
import { CoinRateContentType, CoinRateType } from '@/types/ChartTypes'
//------------------------------interface------------------------------
interface RunningChartProps {
  coinRate: CoinRateType
}
const WIDTH = 1024
const HEIGHT = 768
//------------------------------initChart------------------------------
const initChart = (svgRef: React.RefObject<SVGSVGElement>) => {
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', WIDTH)
  chartContainer.attr('height', HEIGHT)
}

//------------------------------updateChart------------------------------
const updateChart = (
  svgRef: React.RefObject<SVGSVGElement>,
  data: CoinRateType
) => {
  if (!data || !svgRef) {
    return
  }
  //ArrayDataValue : 기존 Object<object>이던 data를 value만 추출해서 Array<object>로 변경
  const ArrayDataValue: CoinRateContentType[] = [
    ...(Object.values(data) as CoinRateContentType[])
  ]
  const chartContainer = d3.select(svgRef.current)
  const chartArea = d3.select('svg#running-chart')

  const [min, max] = [
    d3.min(ArrayDataValue, d => Math.abs(d.value)),
    d3.max(ArrayDataValue, d => d.value)
  ]
  if (!min || !max) {
    return
  }
  const xScale = d3.scaleLinear().domain([min, max]).range([0, 800])
  const y = d3
    .scaleBand()
    .range([0, 400])
    .domain(
      ArrayDataValue.map(function (d) {
        return d.value
      })
    )
    .padding(0.1)
  chartArea
    .append('g')
    .attr('transform', `translate(0,400)`)
    .call(d3.axisBottom(xScale))
}
//------------------------------Component------------------------------
export const RunningChart: React.FunctionComponent<
  RunningChartProps
> = props => {
  const chartSvg = React.useRef(null)

  React.useEffect(() => {
    initChart(chartSvg)
  }, [])

  React.useEffect(() => {
    updateChart(chartSvg, props.coinRate)
  }, [props.coinRate])

  return (
    <svg id="chart-container" ref={chartSvg}>
      <g id="y-axis" />
      <g id="x-axis" />
      <svg id="running-chart" />
    </svg>
  )
}
