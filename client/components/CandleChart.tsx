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
  DEFAULT_CANDLE_PERIOD,
  DEFAULT_POINTER_POSITION,
  MIN_CANDLE_COUNT
} from '@/constants/ChartConstants'
import { makeDate } from '@/utils/dateManager'
import { getCandleDataArray } from '@/utils/upbitManager'
import { useWindowSize, WindowSize } from 'hooks/useWindowSize'

function updateChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[],
  option: ChartRenderOption,
  pointerInfo: PointerPosition,
  windowSize: WindowSize
) {
  const CHART_CONTAINER_X_SIZE = windowSize.width
  const CHART_CONTAINER_Y_SIZE = windowSize.height
  const CHART_AREA_X_SIZE = CHART_CONTAINER_X_SIZE - 100
  const CHART_AREA_Y_SIZE = CHART_CONTAINER_Y_SIZE - 100
  const candleWidth = calculateCandlewidth(option, CHART_AREA_X_SIZE)
  const chartContainer = d3.select(svgRef.current)
  const chartArea = chartContainer.select('svg#chart-area')
  const yAxisScale = getYAxisScale(
    data.slice(
      option.renderStartDataIndex,
      option.renderStartDataIndex + option.renderCandleCount
    ),
    CHART_AREA_Y_SIZE
  )
  if (!yAxisScale) {
    return undefined
  }
  const xAxisScale = getXAxisScale(option, data, CHART_AREA_X_SIZE)
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
  updateCurrentPrice(yAxisScale, data, option, CHART_AREA_X_SIZE)
  updatePointerUI(
    pointerInfo,
    yAxisScale,
    option,
    data,
    CHART_AREA_X_SIZE,
    CHART_AREA_Y_SIZE
  )
  chartArea
    .selectAll<SVGSVGElement, CandleData>('g')
    .data(data)
    .join(
      enter => {
        const $g = enter.append('g')
        $g.attr('transform', `translate(${option.translateX})`) //263번 줄에서 수정, 차트 움직임을 zoom이벤트 ->updateChart에서 관리
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
          .attr('transform', `translate(${option.translateX})`) //263번 줄에서 수정, 차트 움직임을 zoom이벤트 ->updateChart에서 관리
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
  pointerPositionSetter: React.Dispatch<React.SetStateAction<PointerPosition>>,
  windowSize: WindowSize
) {
  const CHART_CONTAINER_X_SIZE = windowSize.width
  const CHART_CONTAINER_Y_SIZE = windowSize.height
  const CHART_AREA_X_SIZE = CHART_CONTAINER_X_SIZE - 100
  const CHART_AREA_Y_SIZE = CHART_CONTAINER_Y_SIZE - 100
  //margin값도 크기에 맞춰 변수화 시켜야함.
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
    ),
    CHART_AREA_Y_SIZE
  )
  if (!yAxisScale) {
    console.error('받아온 API 데이터 에러')
    return undefined
  }
  const xAxisScale = getXAxisScale(option, data, CHART_AREA_X_SIZE)
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
        return {
          ...prev,
          renderStartDataIndex: movedCandle,
          translateX: event.transform.x
        }
      })
      handleMouseEvent(
        event.sourceEvent,
        pointerPositionSetter,
        CHART_AREA_X_SIZE,
        CHART_AREA_Y_SIZE
      )
    })
  d3.select<SVGSVGElement, CandleData>('#chart-container')
    .call(zoom)
    .on('wheel', (e: WheelEvent) => {
      // 휠이벤트에 따라 확대 축소가 이루어진다.
      // candleCount가 변함에따라 candleWidth도 변경되고 기존의 translateX와 연산하여 그래프의 시작인덱스를 재조정
      optionSetter(prev => {
        const newRenderCandleCount = Math.max(
          prev.renderCandleCount + (e.deltaY > 0 ? 1 : -1), //휠이벤트 e.deltaY가 확대면 -1 축소면 +1
          MIN_CANDLE_COUNT
        )
        const newRenderStartDataIndex = Math.floor(
          prev.translateX /
            calculateCandlewidth(
              { ...prev, renderCandleCount: newRenderCandleCount },
              CHART_AREA_X_SIZE
            )
        )
        return {
          ...prev,
          renderCandleCount: newRenderCandleCount,
          renderStartDataIndex: newRenderStartDataIndex
        }
      })
    })
  d3.select<SVGSVGElement, CandleData>('svg#chart-container').on(
    'mousemove',
    (event: MouseEvent) => {
      handleMouseEvent(
        event,
        pointerPositionSetter,
        CHART_AREA_X_SIZE,
        CHART_AREA_Y_SIZE
      )
    }
  )
}

function checkNeedFetch(candleData: CandleData[], option: ChartRenderOption) {
  return (
    candleData.length <
    option.renderStartDataIndex + option.renderCandleCount + 100
  )
}

export const CandleChart: React.FunctionComponent<CandleChartProps> = props => {
  const chartSvg = React.useRef<SVGSVGElement>(null)
  const chartContainerRef = React.useRef<HTMLDivElement>(null)
  const windowSize = useWindowSize(chartContainerRef)
  const [pointerInfo, setPointerInfo] = React.useState<PointerPosition>(
    DEFAULT_POINTER_POSITION
  )
  const isFetching = React.useRef(false)
  React.useEffect(() => {
    initChart(
      chartSvg,
      props.candleData,
      props.candleDataSetter,
      props.option,
      props.optionSetter,
      setPointerInfo,
      windowSize
    )
  }, [props, windowSize])

  React.useEffect(() => {
    //디바운싱 구문
    if (checkNeedFetch(props.candleData, props.option)) {
      // 남은 candleData가 일정개수 이하로 내려가면 Fetch
      if (!isFetching.current) {
        //fetching중인데 한번더 요청이 일어나면 추가fetch 작동하지않음
        isFetching.current = true
        //추가적인 candleData Fetch
        getCandleDataArray(
          DEFAULT_CANDLE_PERIOD,
          props.option.marketType,
          200,
          makeDate(
            //endTime설정
            props.candleData[props.candleData.length - 1].timestamp,
            60
          )
            .toJSON()
            .slice(0, -5)
            .concat('Z')
            .replaceAll(':', '%3A') //업비트 쿼리문 규칙
        ).then(res => {
          //fetch완료된 newData를 기존 data와 병합
          isFetching.current = false
          props.candleDataSetter(prev => {
            return [...prev, ...res]
          })
        })
      }
      return
    }
    updateChart(
      chartSvg,
      props.candleData,
      props.option,
      pointerInfo,
      windowSize
    )
  }, [props, pointerInfo, windowSize])

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
