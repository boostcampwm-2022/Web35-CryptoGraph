import * as d3 from 'd3'
import * as React from 'react'
import { CoinRateContentType, CoinRateType } from '@/types/ChartTypes'
interface RunningChartProps {
  // candleData: CandleData[]
  // candleDataSetter: React.Dispatch<React.SetStateAction<CandleData[]>>
  // option: ChartRenderOption
  // optionSetter: React.Dispatch<React.SetStateAction<ChartRenderOption>>
  coinRate: CoinRateType
}
const WIDTH = 1024
const HEIGHT = 768

const initChart = (svgRef: React.RefObject<SVGSVGElement>) => {
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', WIDTH)
  chartContainer.attr('height', HEIGHT)
}
const updateChart = (
  svgRef: React.RefObject<SVGSVGElement>,
  data: CoinRateType
) => {
  if (!data) {
    return
  }
  //ArrayDataValue : 기존 Object<object>이던 data를 value만 추출해서 Array<object>로 변경
  const ArrayDataValue: CoinRateContentType[] = [
    ...(Object.values(data) as CoinRateContentType[])
  ]

  const chartArea = d3.select('svg#chart-area')
  const [min, max]: number[] = [
    d3.min(ArrayDataValue, d => Math.abs(d.value as number)) as number,
    d3.max(ArrayDataValue, d => d.value as number) as number
  ]
  const xScale = d3.scaleLinear().domain([min, max]).range([0, 800])

  chartArea
    .append('g')
    .attr('transform', `translate(0,400)`)
    .call(d3.axisBottom(xScale))
}

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
