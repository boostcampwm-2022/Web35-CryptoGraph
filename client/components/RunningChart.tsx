import * as d3 from 'd3'
import * as React from 'react'
import {
  CoinRateContentType,
  CoinRateType,
  EmptyObject
} from '@/types/ChartTypes'
import { useWindowSize } from 'hooks/useWindowSize'
import useInterval from '@/hooks/useInterval'
import { getTreeMapDataArray } from '@/utils/upbitManager'
//------------------------------interface------------------------------
interface RunningChartProps {
  coinRate: CoinRateType
  candleCount: number
}

//------------------------------initChart------------------------------
const initChart = (
  svgRef: React.RefObject<SVGSVGElement>,
  width: number,
  height: number
) => {
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', width)
  chartContainer.attr('height', height)
}

//------------------------------updateChart------------------------------
const updateChart = (
  svgRef: React.RefObject<SVGSVGElement>,
  data: CoinRateType,
  width: number,
  height: number,
  candleCount: number
) => {
  if (!data || !svgRef) {
    return
  }
  //ArrayDataValue : 기존 Object<object>이던 data를 data.value, 즉 실시간변동 퍼센테이지 값만 추출해서 Array<object>로 변경
  const ArrayDataValue: (EmptyObject | CoinRateContentType)[] = [
    ...Object.values<EmptyObject | CoinRateContentType>(data)
  ]
    .sort((a, b) => b.value - a.value) // 변동 퍼센트 오름차순 정렬
    .slice(0, candleCount)
  const [min, max] = [
    d3.min(ArrayDataValue, d => d.value),
    d3.max(ArrayDataValue, d => d.value)
  ]
  if (!min || !max) {
    return
  }

  const BARMARGIN = height / candleCount / 10 //바 사이사이 마진값
  const barHeight = height / candleCount - BARMARGIN //각각의 수평 바 y 높이

  const scale = d3
    .scaleLinear()
    .domain([min, max])
    .range([100, width - 100])

  const svgChart = d3
    .select('#running-chart')
    .attr('width', width)
    .attr('height', height)

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
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('font-size', `${barHeight * 0.6}px`)
          .text('0.00%')

        $g.append('text')
          .attr('id', 'CoinName')
          .attr('x', function (d) {
            return scale(d.value)
          })
          .attr('y', barHeight / 2)
          .style('font-size', `${barHeight * 0.6}px`)
          .attr('text-anchor', 'start')
          .attr('dominant-baseline', 'middle')
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
          .attr('height', barHeight - BARMARGIN)

        update
          .select('text')
          .transition()
          .duration(1000)
          .attr('x', function (d) {
            return scale(d.value) / 2
          })
          .attr('y', barHeight / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('font-size', `${barHeight * 0.6}px`)
          .text(d => `${d.value}%`)

        update
          .select('#CoinName')
          .transition()
          .duration(1000)
          .attr('x', d => scale(d.value))
          .attr('y', barHeight / 2)
          .attr('text-anchor', 'start')
          .attr('dominant-baseline', 'middle')
          .style('font-size', `${barHeight * 0.6}px`)
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
  const COIN_INTERVAL_RATE = 1000
  const chartContainerRef = React.useRef<HTMLDivElement>(null)
  const chartSvg = React.useRef(null)
  const { width, height } = useWindowSize(chartContainerRef)

  React.useEffect(() => {
    initChart(chartSvg, width, height)
  }, [width, height]) // 창크기에 따른 차트크기 조절

  useInterval(() => {
    // 주기적으로 코인 등락률을 업데이트
    const tick = Object.keys(props.coinRate).join(',')
    getTreeMapDataArray(tick) //트리맵에서 사용하는 메서드 그대로 사용
      .then(data => {
        //data는 코인별 실시간 정보
        // 업비트에 선택된 티커에 대한 코인등락률을 받아와서 기존 데이터 업데이트
        for (const coin of data) {
          if (props.coinRate[coin.market]) {
            props.coinRate[coin.market].value = Number(
              (coin.signed_change_rate * 100) //실시간 등락rate를 퍼센테이지로 변경
                .toFixed(2)
            ) //소수점 두자리로 fix
          }
        }
        return props.coinRate
      })
      .then(coinRate => {
        updateChart(chartSvg, coinRate, width, height, props.candleCount)
      })
  }, COIN_INTERVAL_RATE)

  return (
    <div
      id="chart"
      ref={chartContainerRef}
      style={{
        display: 'flex',
        width: '100%',
        height: '100%'
      }}
    >
      <svg id="chart-container" ref={chartSvg}>
        <svg id="running-chart" />
      </svg>
    </div>
  )
}
