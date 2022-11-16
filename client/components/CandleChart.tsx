import * as React from 'react'
import { CandleData, ChartOption } from '../types/ChartTypes'
import * as d3 from 'd3'
import { DEFAULT_CANDLE_CHART_OPTION } from '@/constants/ChartConstants'

function updateChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[],
  options: ChartOption
) {
  const X_MAX = 900 //
  const Y_MAX = 700 // <-크기조절 안되지 않나여?
  const STEP = 15
  const [min, max] = getMinMax(data)
  const myScale = d3.scaleLinear().domain([min, max]).range([Y_MAX, 0])
  d3.select(svgRef.current)
    .selectAll<SVGSVGElement, CandleData>('g')
    .data(data)
    .join(
      enter => {
        const $g = enter.append('g')
        $g.append('rect')
          .attr('width', STEP)
          .attr('height', d =>
            Math.abs(myScale(d.trade_price) - myScale(d.opening_price))
          )
          .attr('x', (d, i) => X_MAX - STEP * i)
          .attr('y', d =>
            Math.min(myScale(d.trade_price), myScale(d.opening_price))
          )
          .attr('fill', d => (d.opening_price < d.trade_price ? 'red' : 'blue'))
        $g.append('line')
          .attr('x1', (d, i) => X_MAX + 7 - STEP * i)
          .attr('x2', (d, i) => X_MAX + 7 - STEP * i)
          .attr('y1', d => myScale(d.low_price))
          .attr('y2', d => myScale(d.high_price))
          .attr('stroke', d =>
            d.opening_price < d.trade_price ? 'red' : 'blue'
          )
        return $g
      },
      update => {
        update
          .select('rect')
          .attr('width', STEP)
          .attr('height', d =>
            Math.abs(myScale(d.trade_price) - myScale(d.opening_price)) <= 0
              ? 1
              : Math.abs(myScale(d.trade_price) - myScale(d.opening_price))
          )
          .attr('x', (d, i) => X_MAX - STEP * i)
          .attr('y', d =>
            Math.min(myScale(d.trade_price), myScale(d.opening_price))
          )
          .attr('fill', d => (d.opening_price < d.trade_price ? 'red' : 'blue'))
        update
          .select('line')
          .attr('x1', (d, i) => X_MAX + 7 - STEP * i)
          .attr('x2', (d, i) => X_MAX + 7 - STEP * i)
          .attr('y1', d => myScale(d.low_price))
          .attr('y2', d => myScale(d.high_price))
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
export const CandleChart: React.FunctionComponent<CandleChartProps> = props => {
  const chartSvg = React.useRef<SVGSVGElement>(null)
  React.useEffect(() => {
    updateChart(chartSvg, props.candleData, DEFAULT_CANDLE_CHART_OPTION)
  }, [props.candleData])

  return (
    <div id="chart">
      <svg ref={chartSvg} width="1000" height="800" />
    </div>
  )
}

//D3 함수로 refactoring 필요
function getMinMax(data: CandleData[]): number[] {
  let min = Number.MAX_SAFE_INTEGER
  let max = -1
  data.forEach(candleData => {
    if (candleData.low_price < min) min = candleData.low_price
    if (candleData.high_price > max) max = candleData.high_price
  })
  return [min, max]
}
