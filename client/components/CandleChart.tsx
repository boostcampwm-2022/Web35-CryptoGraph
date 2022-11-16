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
  const ratio = (max - min) / Y_MAX
  d3.select(svgRef.current)
    .selectAll<SVGSVGElement, CandleData>('g')
    .data(data)
    .join(
      enter => {
        const g = enter.append('g')
        g.append('rect')
          .attr('width', STEP)
          .attr('height', d =>
            Math.abs(
              getStartHeight(d, min, ratio) - getEndHeight(d, min, ratio)
            )
          )
          .attr('x', (d, i) => X_MAX - STEP * i)
          .attr(
            'y',
            d =>
              Y_MAX -
              Math.max(
                getStartHeight(d, min, ratio) - getEndHeight(d, min, ratio)
              )
          )
          .attr('fill', d => (d.opening_price < d.trade_price ? 'red' : 'blue'))
        g.append('line')
          .attr('x1', (d, i) => X_MAX + 7 - STEP * i)
          .attr('x2', (d, i) => X_MAX + 7 - STEP * i)
          .attr('y1', d => Y_MAX - getHighHeight(d, min, ratio))
          .attr('y2', d => Y_MAX - getLowHeight(d, min, ratio))
          .attr('stroke', d =>
            d.opening_price < d.trade_price ? 'red' : 'blue'
          )
        return g
      },
      update => {
        update
          .select('rect')
          .attr('width', STEP)
          .attr('height', d =>
            Math.abs(
              getStartHeight(d, min, ratio) - getEndHeight(d, min, ratio)
            )
          )
          .attr('x', (d, i) => X_MAX - STEP * i)
          .attr(
            'y',
            d =>
              Y_MAX -
              Math.max(
                getStartHeight(d, min, ratio),
                getEndHeight(d, min, ratio)
              )
          )
          .attr('fill', d => (d.opening_price < d.trade_price ? 'red' : 'blue'))
        update
          .select('line')
          .attr('x1', (d, i) => X_MAX + 7 - STEP * i)
          .attr('x2', (d, i) => X_MAX + 7 - STEP * i)
          .attr('y1', d => Y_MAX - getHighHeight(d, min, ratio))
          .attr('y2', d => Y_MAX - getLowHeight(d, min, ratio))
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

// D3.scale로 refactoring 해야한다. (ㅇ얘는 무조건 할 수 있음)
function getStartHeight(data: CandleData, min: number, ratio: number) {
  return transHeight(data.opening_price, min, ratio)
}
function getEndHeight(data: CandleData, min: number, ratio: number) {
  return transHeight(data.trade_price, min, ratio)
}
function getHighHeight(data: CandleData, min: number, ratio: number) {
  return transHeight(data.high_price, min, ratio)
}
function getLowHeight(data: CandleData, min: number, ratio: number) {
  return transHeight(data.low_price, min, ratio)
}

function transHeight(value: number, min: number, ratio: number) {
  return Math.round((value - min) / ratio)
}
