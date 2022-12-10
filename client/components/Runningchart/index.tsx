import * as d3 from 'd3'
import * as React from 'react'
import { CoinRateContentType, CoinRateType } from '@/types/ChartTypes'
import { useWindowSize } from 'hooks/useWindowSize'
import { colorQuantizeScale } from '@/utils/chartManager'
import { convertUnit } from '@/utils/chartManager'

//------------------------------interface------------------------------
interface RunningChartProps {
  data: CoinRateType //선택된 코인 리스트
  Market: string[]
  selectedSort: string
  modalOpenHandler: (market: string) => void
  durationPeriod?: number
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
  selectedSort: string,
  nodeOnclickHandler: (market: string) => void
) => {
  if (!data || !svgRef) {
    return
  }

  //ArrayDataValue : 기존 Object<object>이던 data를 data.value, 즉 실시간변동 퍼센테이지 값만 추출해서 Array<object>로 변경
  const ArrayDataValue: CoinRateContentType[] = [
    ...Object.values<CoinRateContentType>(data)
  ].sort((a, b) => {
    switch (selectedSort) {
      case 'descending':
        return d3.descending(a.value, b.value) // 내림차순
      case 'ascending':
        return d3.ascending(a.value, b.value) // 오름차순
      case 'absolute':
        return d3.descending(Math.abs(a.value), Math.abs(b.value)) // 절댓값
      case 'trade price':
        return d3.descending(a.acc_trade_price_24h, b.acc_trade_price_24h) // 거래량
      default:
        return d3.descending(a.market_cap, b.market_cap) //시가총액
    }
  })
  const max = (() => {
    switch (selectedSort) {
      case 'descending':
        return d3.max(ArrayDataValue, d => Math.abs(d.value)) // 내림차순
      case 'ascending':
        return d3.max(ArrayDataValue, d => Math.abs(d.value)) // 오름차순
      case 'absolute':
        return d3.max(ArrayDataValue, d => Math.abs(d.value)) // 절댓값
      case 'trade price':
        return d3.max(ArrayDataValue, d => d.acc_trade_price_24h) // 거래량
      default:
        return d3.max(ArrayDataValue, d => d.market_cap) //시가총액
    }
  })()

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
          .duration(durationPeriod)
          .style('opacity', 1)

        $g.append('rect')
          .attr('width', function (d) {
            // console.log(d.acc_trade_price_24h)
            return scale(
              selectedSort !== 'trade price'
                ? selectedSort !== 'market capitalization'
                  ? Math.abs(d.value)
                  : d.market_cap
                : d.acc_trade_price_24h
            )
          })
          .attr('height', barHeight)
          .on('click', function (this, e, d) {
            nodeOnclickHandler(d.ticker.split('-')[1])
          })
          .style('fill', d => {
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
                selectedSort !== 'trade price'
                  ? selectedSort !== 'market capitalization'
                    ? Math.abs(d.value)
                    : d.market_cap
                  : d.acc_trade_price_24h
              ) / 2
            )
          })
          .attr('y', barHeight / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('font-size', `${barHeight * 0.6}px`)
          .text(d =>
            selectedSort !== 'trade price'
              ? selectedSort === 'market capitalization'
                ? convertUnit(Number(d.market_cap))
                : String(Number(d.value).toFixed(2)) + '%'
              : convertUnit(Number(d.acc_trade_price_24h))
          )

        $g.append('text')
          .attr('id', 'CoinName')
          .attr('x', d => {
            return scale(
              selectedSort !== 'trade price'
                ? selectedSort !== 'market capitalization'
                  ? Math.abs(d.value)
                  : d.market_cap
                : d.acc_trade_price_24h
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
              selectedSort !== 'trade price'
                ? selectedSort !== 'market capitalization'
                  ? Math.abs(d.value)
                  : d.market_cap
                : d.acc_trade_price_24h
            )
          })
          .attr('height', barHeight)
          .style('fill', d => {
            if (d.value > 0) return colorQuantizeScale(max, d.value)
            else if (d.value === 0) return 'gray'
            else return colorQuantizeScale(max, d.value)
          })
        update
          .select('text')
          .attr('x', d => {
            return (
              scale(
                selectedSort !== 'trade price'
                  ? selectedSort !== 'market capitalization'
                    ? Math.abs(d.value)
                    : d.market_cap
                  : d.acc_trade_price_24h
              ) / 2
            )
          })
          .attr('y', barHeight / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('font-size', `${barHeight * 0.3}px`)
          .text(d =>
            selectedSort !== 'trade price'
              ? selectedSort === 'market capitalization'
                ? convertUnit(Number(d.market_cap))
                : String(Number(d.value).toFixed(2)) + '%'
              : convertUnit(Number(d.acc_trade_price_24h))
          )

        update
          .select('#CoinName')
          .transition()
          .duration(durationPeriod)
          .attr('x', d => {
            return scale(
              selectedSort !== 'trade price'
                ? selectedSort !== 'market capitalization'
                  ? Math.abs(d.value)
                  : d.market_cap
                : d.acc_trade_price_24h
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
  durationPeriod = 500,
  data,
  Market,
  selectedSort,
  modalOpenHandler
}) => {
  const chartContainerRef = React.useRef<HTMLDivElement>(null)
  const chartSvg = React.useRef(null)
  const { width, height } = useWindowSize(chartContainerRef)
  const [changeRate, setchangeRate] = React.useState<CoinRateType>(data) //선택된 코인 값만 보유

  React.useEffect(() => {
    updateChart(
      durationPeriod,
      chartSvg,
      changeRate,
      width,
      height,
      Market.length,
      selectedSort,
      modalOpenHandler
    )
  }, [
    width,
    height,
    changeRate,
    selectedSort,
    durationPeriod,
    Market.length,
    modalOpenHandler
  ]) // 창크기에 따른 차트크기 조절

  React.useEffect(() => {
    if (!data || !Market[0]) return
    const newCoinData: CoinRateType = {}
    for (const tick of Market) {
      newCoinData['KRW-' + tick] = data['KRW-' + tick]
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
        height: '98%',
        overflow: 'auto'
      }}
    >
      <svg id="chart-container" ref={chartSvg}>
        <svg id="running-chart" />
      </svg>
    </div>
  )
}
