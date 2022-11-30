import * as d3 from 'd3'
import * as React from 'react'
import { CoinRateContentType, CoinRateType } from '@/types/ChartTypes'
//------------------------------interface------------------------------
interface RunningChartProps {
  coinRate: CoinRateType[]
  WIDTH: number
  HEIGHT: number
  CANDLECOUNT: number
}

//------------------------------initChart------------------------------
const initChart = (
  svgRef: React.RefObject<SVGSVGElement>,
  WIDTH: number,
  HEIGHT: number
) => {
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', WIDTH)
  chartContainer.attr('height', HEIGHT)
}

//------------------------------updateChart------------------------------
const updateChart = (
  svgRef: React.RefObject<SVGSVGElement>,
  data: CoinRateType,
  WIDTH: number,
  HEIGHT: number,
  CANDLECOUNT: number
) => {
  if (!data || !svgRef) {
    return
  }
  // console.log('data : ', data)
  //ArrayDataValue : 기존 Object<object>이던 data를 data.value, 즉 실시간변동 퍼센테이지 값만 추출해서 Array<object>로 변경
  const ArrayDataValue: CoinRateContentType[] = [
    ...(Object.values(data) as CoinRateContentType[])
  ]
    .sort((a, b) => b.value - a.value) // 변동 퍼센트 오름차순 정렬
    .slice(0, CANDLECOUNT)
  console.log('ArrayDATAVALUE : ', ArrayDataValue)
  const chartContainer = d3.select(svgRef.current)
  const chartArea = d3.select('svg#running-chart')

  const [min, max] = [
    d3.min(ArrayDataValue, d => d.value),
    d3.max(ArrayDataValue, d => d.value)
  ]
  if (!min || !max) {
    return
  }

  const BARMARGIN = 3 //바 사이사이 마진값
  const barHeight = HEIGHT / CANDLECOUNT - BARMARGIN //각각의 수평 바 y 높이

  const scale = d3
    .scaleLinear()
    .domain([min, max])
    .range([100, WIDTH - 100])

  const svgChart = d3
    .select('#running-chart')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)

  svgChart
    .selectAll<SVGSVGElement, CoinRateContentType>('g')
    .data(ArrayDataValue, d => d.name)
    .join(
      enter => {
        const $g = enter.append('g')
        $g.attr('transform', function (d, i) {
          return 'translate(0,' + i * barHeight + ')'
        })
          .transition()
          .duration(1000)
          .attr('transform', (d, i) => 'translate(0,' + i * barHeight + ')')
          .style('opacity', 1)

        $g.append('rect')
          .attr('width', function (d) {
            return scale(d.value)
          })
          .attr('height', barHeight - BARMARGIN)
          .style('fill', (d, i) => {
            const personelColor = Math.floor(Math.random() * 16 ** 6).toString(
              16
            )
            return `#${personelColor}`
          })

        $g.append('text')
          .attr('x', function (d) {
            return scale(d.value) / 2
          })
          .attr('y', barHeight / 2)
          .attr('dy', '0.35em')
          .attr('font-size', '20px')
          .text('0.00%')
        $g.append('text')
          .attr('id', 'CoinName')
          .attr('x', function (d) {
            return scale(d.value)
          })
          .attr('y', barHeight / 2)
          .attr('dy', '0.35em')
          .attr('font-size', '20px')
          .text('loading...')
        return $g
      },
      update => {
        update // 차트들
          .transition()
          .duration(1000)
          .attr('transform', (d, i) => `translate(0,  ${i * barHeight} )`)
        update
          .select('rect')
          .transition()
          .duration(1000)
          .attr('width', d => scale(d.value))

        update
          .select('text')
          .transition()
          .duration(1000)
          .attr('x', function (d) {
            return scale(d.value) / 2 - 20
          })
          .text(d => `${d.value}%`)
        update
          .select('#CoinName')
          .transition()
          .duration(1000)
          .attr('x', d => scale(d.value) + 20)
          .text(d => d.name)
        return update
      },
      exit => {
        exit.remove()
      }
    )
}
//------------------------------Component------------------------------
export const RunningChart: React.FunctionComponent<
  RunningChartProps
> = props => {
  const chartSvg = React.useRef(null)
  React.useEffect(() => {
    initChart(chartSvg, props.WIDTH, props.HEIGHT)
  }, [])

  React.useEffect(() => {
    updateChart(
      chartSvg,
      props.coinRate[0],
      props.WIDTH,
      props.HEIGHT,
      props.CANDLECOUNT
    )
  }, [props])

  return (
    <svg id="chart-container" ref={chartSvg}>
      <g id="y-axis" />
      <g id="x-axis" />
      <svg id="running-chart" />
    </svg>
  )
}
