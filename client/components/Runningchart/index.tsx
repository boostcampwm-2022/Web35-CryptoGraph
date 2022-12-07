import * as d3 from 'd3'
import * as React from 'react'
import { CoinRateContentType, CoinRateType } from '@/types/ChartTypes'
import { useWindowSize } from 'hooks/useWindowSize'

//------------------------------interface------------------------------
interface RunningChartProps {
  candleCount: number
  data: CoinRateType //선택된 코인 리스트
  Market: string[]
  selectedSort: string
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
  candleCount: number,
  selectedSort: string
) => {
  if (!data || !svgRef) {
    return
  }
  //ArrayDataValue : 기존 Object<object>이던 data를 data.value, 즉 실시간변동 퍼센테이지 값만 추출해서 Array<object>로 변경
  const ArrayDataValue: CoinRateContentType[] = [
    ...Object.values<CoinRateContentType>(data)
  ]
    .sort((a, b) => {
      if (selectedSort === 'descending') {
        return d3.descending(a.value, b.value) // 내림차순
      }
      if (selectedSort === 'ascending') {
        return d3.ascending(a.value, b.value) // 오름차순
      }
      if (selectedSort === 'absolute') {
        return d3.descending(Math.abs(a.value), Math.abs(b.value)) // 절댓값
      }
      return d3.ascending(a.cmc_rank, b.cmc_rank) //시가총액
    })
    .slice(0, candleCount)
  const min =
    selectedSort !== 'descending'
      ? selectedSort === 'market capitalization'
        ? (d3.min(ArrayDataValue, d => d.market_cap) as number)
        : (d3.min(ArrayDataValue, d => Math.abs(d.value)) as number)
      : (d3.min(ArrayDataValue, d => d.value) as number)
  const max =
    selectedSort !== 'descending'
      ? selectedSort === 'market capitalization'
        ? (d3.max(ArrayDataValue, d => d.market_cap) as number)
        : (d3.max(ArrayDataValue, d => Math.abs(d.value)) as number)
      : (d3.max(ArrayDataValue, d => d.value) as number)
  // if (!min || !max) {
  //   return
  // }

  const BARMARGIN = height / candleCount / 10 //바 사이사이 마진값
  const barHeight = height / candleCount - BARMARGIN //각각의 수평 바 y 높이

  const scale = d3
    .scaleLinear()
    .domain(
      selectedSort !== 'descending' ? [0, Math.max(min, max)] : [min, max]
    )
    .range([100, width - 100])

  const svgChart = d3
    .select('#running-chart')
    .attr('width', width)
    .attr('height', height)

  const durationPeriod = 500

  svgChart
    .selectAll<SVGSVGElement, CoinRateContentType>('g')
    .data(ArrayDataValue, d => d.name)
    .join(
      enter => {
        const $g = enter.append('g')
        $g.attr('transform', function (d, i) {
          return 'translate(0,' + i * barHeight + ')'
        })
          .attr('transform', (d, i) => 'translate(0,' + i * barHeight + ')')
          .style('opacity', 1)

        $g.append('rect')
          .attr('width', function (d) {
            return scale(
              selectedSort !== 'descending'
                ? selectedSort !== 'market capitalization'
                  ? Math.abs(d.value)
                  : d.market_cap
                : d.value
            )
          })
          .attr('height', barHeight - BARMARGIN)
          .style('fill', (d, i) => {
            const personelColor = Math.floor(Math.random() * 16 ** 6).toString(
              16
            )
            return `#${personelColor}`
          })

        $g.append('text')
          .attr('x', d => {
            return (
              scale(
                selectedSort !== 'descending'
                  ? selectedSort !== 'market capitalization'
                    ? Math.abs(d.value)
                    : Number(d.market_cap)
                  : d.value
              ) / 2
            )
          })
          .attr('y', barHeight / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('font-size', `${barHeight * 0.6}px`)
          .text(d =>
            selectedSort !== 'descending' && selectedSort !== 'ascending'
              ? selectedSort !== 'market capitalization'
                ? String(Number(d.value).toFixed(2)) + '%'
                : String(Number(d.market_cap / 1000000000000).toFixed(2)) +
                  '조원'
              : String(Number(d.value).toFixed(2)) + '%'
          )

        $g.append('text')
          .attr('id', 'CoinName')
          .attr('x', d => {
            return scale(
              selectedSort !== 'descending'
                ? selectedSort !== 'market capitalization'
                  ? Math.abs(d.value)
                  : d.market_cap
                : d.value
            )
          })
          .attr('y', barHeight / 2)
          .attr('text-anchor', 'start')
          .attr('dominant-baseline', 'middle')
          .style('font-size', `${barHeight * 0.6}px`)
          .text(d => d.ticker.split('-')[1])
        return $g
      },
      update => {
        update // 차트들
          .transition()
          .duration(durationPeriod)
          .attr('transform', (d, i) => `translate(0,  ${i * barHeight} )`)
        update
          .select('rect')
          .transition()
          .duration(durationPeriod)
          .attr('width', d => {
            return scale(
              selectedSort !== 'descending'
                ? selectedSort !== 'market capitalization'
                  ? Math.abs(d.value)
                  : d.market_cap
                : d.value
            )
          })
          .attr('height', barHeight - BARMARGIN)

        update
          .select('text')
          .attr('x', d => {
            return (
              scale(
                selectedSort !== 'descending'
                  ? selectedSort !== 'market capitalization'
                    ? Math.abs(d.value)
                    : Number(d.market_cap)
                  : d.value
              ) / 2
            )
          })
          .attr('y', barHeight / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('font-size', `${barHeight * 0.6}px`)
          .text(d =>
            selectedSort !== 'descending' && selectedSort !== 'ascending'
              ? selectedSort !== 'market capitalization'
                ? String(Number(Math.abs(d.value)).toFixed(2)) + '%'
                : String(Number(d.market_cap / 1000000000000).toFixed(2)) +
                  '조원'
              : String(Number(d.value).toFixed(2)) + '%'
          )

        update
          .select('#CoinName')
          .transition()
          .duration(durationPeriod)
          .attr('x', d => {
            return scale(
              selectedSort !== 'descending'
                ? selectedSort !== 'market capitalization'
                  ? Math.abs(d.value)
                  : d.market_cap
                : d.value
            )
          })
          .attr('y', barHeight / 2)
          .attr('text-anchor', 'start')
          .attr('dominant-baseline', 'middle')
          .style('font-size', `${barHeight * 0.6}px`)
          .text(d => d.ticker.split('-')[1])
        return update
      },
      exit => {
        exit.remove()
      }
    )
}
//------------------------------Component------------------------------
export const RunningChart: React.FunctionComponent<RunningChartProps> = ({
  candleCount,
  data,
  Market,
  selectedSort
}) => {
  const chartContainerRef = React.useRef<HTMLDivElement>(null)
  const chartSvg = React.useRef(null)
  const { width, height } = useWindowSize(chartContainerRef)
  const [coinRate, setCoinRate] = React.useState<CoinRateType>(data) //coin의 등락률 값, 모든 코인 값 보유
  const [changeRate, setchangeRate] = React.useState<CoinRateType>(data) //선택된 코인 값만 보유

  React.useEffect(() => {
    initChart(chartSvg, width, height)
  }, [width, height]) // 창크기에 따른 차트크기 조절
  React.useEffect(() => {
    updateChart(chartSvg, changeRate, width, height, candleCount, selectedSort)
  }, [width, height, changeRate, candleCount, selectedSort]) // 창크기에 따른 차트크기 조절

  React.useEffect(() => {
    if (!coinRate || !Market[0]) return
    const newCoinData: CoinRateType = {}
    for (const tick of Market) {
      newCoinData['KRW-' + tick] = coinRate['KRW-' + tick]
    }
    setchangeRate(newCoinData)
  }, [data, Market])

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
