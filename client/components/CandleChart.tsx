import * as React from 'react'
import {
  CandleData,
  ChartRenderOption,
  PointerPosition
} from '@/types/ChartTypes'
import * as d3 from 'd3'
import { D3ZoomEvent } from 'd3'
import {
  calculateCandlewidth,
  getYAxisScale,
  getXAxisScale,
  handleMouseEvent,
  updateCurrentPrice,
  updatePointerUI
} from '@/utils/chartManager'
import {
  CHART_AREA_X_SIZE,
  CHART_AREA_Y_SIZE,
  CHART_CONTAINER_X_SIZE,
  CHART_CONTAINER_Y_SIZE,
  DEFAULT_CANDLER_CHART_RENDER_OPTION,
  DEFAULT_CANDLE_PERIOD,
  DEFAULT_POINTER_POSITION,
  MIN_CANDLE_COUNT
} from '@/constants/ChartConstants'
import { makeDate } from '@/utils/dateManager'
import { getCandleDataArray } from '@/utils/upbitManager'

function updateChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[],
  option: ChartRenderOption,
  pointerInfo: PointerPosition
) {
  const candleWidth = calculateCandlewidth(option, CHART_AREA_X_SIZE)
  const chartContainer = d3.select(svgRef.current)
  const chartArea = chartContainer.select('svg#chart-area')
  const yAxisScale = getYAxisScale(
    data.slice(
      option.renderStartDataIndex,
      option.renderStartDataIndex + option.renderCandleCount
    )
  )
  if (!yAxisScale) {
    return undefined
  }
  const xAxisScale = getXAxisScale(option, data)
  chartContainer
    .select<SVGSVGElement>('g#y-axis')
    .attr('transform', `translate(${CHART_AREA_X_SIZE},0)`)
    .call(d3.axisRight(yAxisScale).tickSizeInner(-1 * CHART_AREA_X_SIZE))
  chartContainer
    .select<SVGSVGElement>('g#x-axis')
    .attr('transform', `translate(0,${CHART_AREA_Y_SIZE})`)
    .call(
      d3
        .axisBottom(xAxisScale)
        .tickSizeInner(-1 * CHART_AREA_Y_SIZE)
        .tickSizeOuter(0)
        .ticks(5)
    )
  updateCurrentPrice(yAxisScale, data, option)
  updatePointerUI(pointerInfo, yAxisScale, option, data)
  chartArea
    .selectAll<SVGSVGElement, CandleData>('g')
    .data(data)
    .join(
      enter => {
        const $g = enter.append('g')
        $g.append('rect')
          .attr('width', candleWidth * 0.6)
          .attr('height', d =>
            Math.abs(yAxisScale(d.trade_price) - yAxisScale(d.opening_price))
          )
          .attr('x', (d, i) => CHART_AREA_X_SIZE - candleWidth * (i + 0.8))
          .attr('y', d =>
            Math.min(yAxisScale(d.trade_price), yAxisScale(d.opening_price))
          )
          .attr('fill', d =>
            d.opening_price <= d.trade_price ? 'red' : 'blue'
          )
        $g.append('line')
          .attr(
            'x1',
            (d, i) =>
              CHART_AREA_X_SIZE + candleWidth / 2 - candleWidth * (i + 1)
          )
          .attr(
            'x2',
            (d, i) =>
              CHART_AREA_X_SIZE + candleWidth / 2 - candleWidth * (i + 1)
          )
          .attr('y1', d => yAxisScale(d.low_price))
          .attr('y2', d => yAxisScale(d.high_price))
          .attr('stroke', d =>
            d.opening_price <= d.trade_price ? 'red' : 'blue'
          )
        return $g
      },
      update => {
        update
          .select('rect')
          .attr('width', candleWidth * 0.6)
          .attr('height', d =>
            Math.abs(yAxisScale(d.trade_price) - yAxisScale(d.opening_price)) <=
            0
              ? 1
              : Math.abs(
                  yAxisScale(d.trade_price) - yAxisScale(d.opening_price)
                )
          )
          .attr('x', (d, i) => CHART_AREA_X_SIZE - candleWidth * (i + 0.8))
          .attr('y', d =>
            Math.min(yAxisScale(d.trade_price), yAxisScale(d.opening_price))
          )
          .attr('fill', d => (d.opening_price < d.trade_price ? 'red' : 'blue'))
        update
          .select('line')
          .attr(
            'x1',
            (d, i) =>
              CHART_AREA_X_SIZE + candleWidth / 2 - candleWidth * (i + 1)
          )
          .attr(
            'x2',
            (d, i) =>
              CHART_AREA_X_SIZE + candleWidth / 2 - candleWidth * (i + 1)
          )
          .attr('y1', d => yAxisScale(d.low_price))
          .attr('y2', d => yAxisScale(d.high_price))
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
  candleDataSetter: React.Dispatch<React.SetStateAction<CandleData[]>>
  option: ChartRenderOption
  optionSetter: React.Dispatch<React.SetStateAction<ChartRenderOption>>
}

function initChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[],
  candleDataSetter: React.Dispatch<React.SetStateAction<CandleData[]>>,
  option: ChartRenderOption,
  optionSetter: React.Dispatch<React.SetStateAction<ChartRenderOption>>,
  pointerPositionSetter: React.Dispatch<React.SetStateAction<PointerPosition>>
) {
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', CHART_CONTAINER_X_SIZE)
  chartContainer.attr('height', CHART_CONTAINER_Y_SIZE)
  const chartArea = chartContainer.select('svg#chart-area')
  chartArea.attr('width', CHART_AREA_X_SIZE)
  chartArea.attr('height', CHART_AREA_Y_SIZE)
  chartArea.attr('view')
  // xAxis초기값 설정
  chartContainer
    .select('svg#x-axis-container')
    .attr('width', CHART_AREA_X_SIZE)
    .attr('height', CHART_AREA_Y_SIZE + 20)
  // currentPrice초기값 설정
  chartContainer.select('svg#current-price').attr('height', CHART_AREA_Y_SIZE)
  // text 위치설정 매직넘버? 반응형 고려하면 변수화도 고려되어야할듯
  chartContainer.select('text#price-info').attr('x', 20).attr('y', 20)
  const yAxisScale = getYAxisScale(
    data.slice(
      option.renderStartDataIndex,
      option.renderStartDataIndex + option.renderCandleCount
    )
  )
  if (!yAxisScale) {
    console.error('받아온 API 데이터 에러')
    return undefined
  }
  const xAxisScale = getXAxisScale(option, data)
  chartContainer
    .select<SVGSVGElement>('g#y-axis')
    .attr('transform', `translate(${CHART_AREA_X_SIZE},0)`)
    .call(d3.axisRight(yAxisScale).tickSizeInner(-1 * CHART_AREA_X_SIZE))
  chartContainer
    .select<SVGSVGElement>('g#x-axis')
    .attr('transform', `translate(0,${CHART_AREA_Y_SIZE})`)
    .attr('width', CHART_AREA_X_SIZE)
    .call(
      d3
        .axisBottom(xAxisScale)
        .tickSizeInner(-1 * CHART_AREA_Y_SIZE)
        .ticks(5)
    )
  let transalateX = 0
  let movedCandle = 0
  let debounce = false
  let newData: CandleData[] = data
  let newRenderCandleCount = 0
  const zoom = d3
    .zoom<SVGSVGElement, CandleData>()
    .scaleExtent([1, 1])
    .translateExtent([
      [-Infinity, 0],
      [CHART_CONTAINER_X_SIZE, CHART_CONTAINER_Y_SIZE]
    ])
    .on('zoom', function (event: D3ZoomEvent<SVGSVGElement, CandleData>) {
      transalateX = event.transform.x
      optionSetter((prev: ChartRenderOption) => {
        movedCandle = Math.floor(
          transalateX / calculateCandlewidth(prev, CHART_AREA_X_SIZE)
        )
        newRenderCandleCount = prev.renderCandleCount
        return {
          ...prev,
          renderStartDataIndex: movedCandle,
          translateX: event.transform.x
        }
      })
      handleMouseEvent(event.sourceEvent, pointerPositionSetter)
      //1. 전체개수 200개 - movedCandle < 100개가 되는지 확인한다.
      //2. 100개 미만으로 떨어지면 데이터를 200개만큼 추가로 가져온다. data = [...newData, ...data]
      //3. 이때 getCandleDataArray 비동기작업이 진행되므로 디바운싱 처리를 통해 기다린다.
      //    -> 비동기작업이 진행중일때는 fetch 추가요청 하지않게 막아줌
      async function setNewCandleData() {
        debounce = true // 디바운싱 시작
        const newFetchedData: CandleData[] = await getCandleDataArray(
          DEFAULT_CANDLE_PERIOD,
          DEFAULT_CANDLER_CHART_RENDER_OPTION.marketType,
          200,
          makeDate(
            //endTime설정
            newData[newData.length - 1].timestamp,
            60
          )
            .toJSON()
            .slice(0, -5)
            .concat('Z')
            .replaceAll(':', '%3A') //업비트 쿼리문 규칙
        )
        optionSetter(prev => {
          return { ...prev, fetchCandleCount: prev.fetchCandleCount + 200 }
        })
        candleDataSetter((prevCandleData: CandleData[]) => {
          newData = [...prevCandleData, ...newFetchedData]
          return newData
        })
        debounce = false // 데이터 fetching 완료 및 디바운싱 해제
      }

      //디바운싱이 작동되지 않을때만 fetch시작
      if (
        newData.length - (movedCandle + newRenderCandleCount) < 100 &&
        !debounce
      ) {
        setNewCandleData()
      }
      d3.select('#chart-area')
        .selectAll<SVGSVGElement, CandleData>('g')
        .attr('transform', `translate(${event.transform.x})`)
    })
  d3.select<SVGSVGElement, CandleData>('#chart-container')
    .call(zoom)
    .on('wheel', (e: WheelEvent) => {
      optionSetter(prev => {
        return {
          ...prev,
          renderCandleCount: Math.max(
            prev.renderCandleCount + (e.deltaY > 0 ? 1 : -1),
            MIN_CANDLE_COUNT
          )
        }
      })
    })
  d3.select<SVGSVGElement, CandleData>('svg#chart-container').on(
    'mousemove',
    (event: MouseEvent) => {
      handleMouseEvent(event, pointerPositionSetter)
    }
  )
}

export const CandleChart: React.FunctionComponent<CandleChartProps> = props => {
  const chartSvg = React.useRef<SVGSVGElement>(null)
  const [pointerInfo, setPointerInfo] = React.useState<PointerPosition>(
    DEFAULT_POINTER_POSITION
  )
  React.useEffect(() => {
    initChart(
      chartSvg,
      props.candleData,
      props.candleDataSetter,
      props.option,
      props.optionSetter,
      setPointerInfo
    )
  }, [])

  React.useEffect(() => {
    updateChart(chartSvg, props.candleData, props.option, pointerInfo)
  }, [props.candleData, props.option, pointerInfo])

  return (
    <div id="chart">
      <svg id="chart-container" ref={chartSvg}>
        <g id="y-axis" />
        <svg id="x-axis-container">
          <g id="x-axis" />
        </svg>
        <svg id="chart-area" />
        <svg id="current-price">
          <line />
          <text />
        </svg>
        <svg id="mouse-pointer-UI"></svg>
        <text id="price-info">sdfsdf</text>
      </svg>
    </div>
  )
}
