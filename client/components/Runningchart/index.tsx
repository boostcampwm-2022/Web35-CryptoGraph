import * as d3 from 'd3'
import * as React from 'react'
import { CoinRateContentType, CoinRateType } from '@/types/ChartTypes'
import { useWindowSize } from 'hooks/useWindowSize'
import { colorQuantizeScale } from '@/utils/chartManager'

//------------------------------interface------------------------------
interface RunningChartProps {
  durationPeriod: number
  candleCount: number
  data: CoinRateType //선택된 코인 리스트
  Market: string[]
  selectedSort: string
}

//------------------------------setChartContainerSize------------------------------
const setChartContainerSize = (
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
  durationPeriod: number,
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
  ].sort((a, b) => {
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
  const max =
    selectedSort !== 'descending'
      ? selectedSort === 'market capitalization'
        ? d3.max(ArrayDataValue, d => d.market_cap)
        : d3.max(ArrayDataValue, d => Math.abs(d.value))
      : d3.max(ArrayDataValue, d => Math.abs(d.value))
  if (!max) {
    console.error('정상적인 등락률 데이터가 아닙니다.')
    return
  }
  const threshold = max <= 66 ? (max <= 33 ? 33 : 66) : Math.max(max, 100) // 66보다 큰 경우는 시가총액 or 66% 이상
  const domainRange = [0, threshold]

  const barMargin = height / 10 / 5 //바 사이사이 마진값
  const barHeight = Math.max(
    Math.min(height / candleCount, height / 15),
    height / 20
  ) //각각의 수평 바 y 높이
  setChartContainerSize(svgRef, width, (barHeight + barMargin) * candleCount)

  const scale = d3
    .scaleLinear()
    .domain(domainRange)
    .range([100, width - 100])

  const svgChart = d3
    .select('#running-chart')
    .attr('width', width)
    .attr('height', (barHeight + barMargin) * candleCount)

  svgChart
    .selectAll<SVGSVGElement, CoinRateContentType>('g')
    .data(ArrayDataValue, d => d.name)
    .join(
      enter => {
        const $g = enter.append('g')
        $g.attr(
          'transform',
          (d, i) => 'translate(0,' + i * (barHeight + barMargin) + ')'
        )
          .transition()
          .duration(1000)
          .style('opacity', 1)

        $g.append('rect')
          .attr('width', function (d) {
            return scale(
              selectedSort !== 'descending'
                ? selectedSort !== 'market capitalization'
                  ? Math.abs(d.value)
                  : d.market_cap
                : Math.abs(d.value)
            )
          })
          .attr('height', barHeight)
          .style('fill', (d, i) => {
            if (d.value > 0) return colorQuantizeScale(max, d.value)
            else if (d.value === 0) return 'gray'
            else {
              return colorQuantizeScale(max, d.value)
            }
          })

        $g.append('text')
          .attr('x', d => {
            return (
              scale(
                selectedSort !== 'descending'
                  ? selectedSort !== 'market capitalization'
                    ? Math.abs(d.value)
                    : Number(d.market_cap)
                  : Math.abs(d.value)
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
                : String(Number(d.market_cap / 1000000000000).toFixed(2)) + '조'
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
                : Math.abs(d.value)
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
          .attr(
            'transform',
            (d, i) => `translate(0,  ${i * (barHeight + barMargin)} )`
          )
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
                : Math.abs(d.value)
            )
          })
          .attr('height', barHeight)
          .style('fill', (d, i) => {
            if (d.value > 0) return colorQuantizeScale(max, d.value)
            else if (d.value === 0) return 'gray'
            else return colorQuantizeScale(max, d.value)
          })
        update
          .select('text')
          .attr('x', d => {
            return (
              scale(
                selectedSort !== 'descending'
                  ? selectedSort !== 'market capitalization'
                    ? Math.abs(d.value)
                    : Number(d.market_cap)
                  : Math.abs(d.value)
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
                : String(Number(d.market_cap / 1000000000000).toFixed(2)) + '조'
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
                : Math.abs(d.value)
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
  durationPeriod,
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
    updateChart(
      durationPeriod,
      chartSvg,
      changeRate,
      width,
      height,
      candleCount,
      selectedSort
    )
  }, [width, height, changeRate, candleCount, selectedSort]) // 창크기에 따른 차트크기 조절

  React.useEffect(() => {
    if (!coinRate || !Market[0]) return
    const newCoinData: CoinRateType = {}
    for (const tick of Market) {
      newCoinData['KRW-' + tick] = coinRate['KRW-' + tick]
    }
    setchangeRate(newCoinData)
  }, [data, Market, coinRate])

  return (
    <div
      id="chart"
      ref={chartContainerRef}
      style={{
        display: 'flex',
        width: '100%',
        height: '90%',
        overflow: 'auto'
      }}
    >
      <svg id="chart-container" ref={chartSvg}>
        <svg id="running-chart" />
      </svg>
    </div>
  )
}
