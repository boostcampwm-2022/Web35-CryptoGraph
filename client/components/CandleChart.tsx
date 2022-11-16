import * as React from 'react'
import { CandleData, ChartOption } from '../types/ChartTypes'

function updateChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[]
) {
  // 그리는 코드
  return
}
interface CandleChartProps {
  candleData: CandleData[]
  option: ChartOption
}
export const CandleChart: React.FunctionComponent<CandleChartProps> = props => {
  const chartSvg = React.useRef<SVGSVGElement>(null)
  React.useEffect(() => {
    updateChart(chartSvg, props.candleData)
  }, [props.candleData])

  return (
    <div id="chart">
      <svg ref={chartSvg} />
    </div>
  )
}
