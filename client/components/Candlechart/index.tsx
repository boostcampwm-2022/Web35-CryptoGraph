import * as React from 'react'
import {
  CandleData,
  ChartRenderOption,
  PointerPosition
} from '@/types/ChartTypes'
import * as d3 from 'd3'
import { D3DragEvent } from 'd3'
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
  MIN_CANDLE_COUNT,
  CANDLE_COLOR_RED,
  CANDLE_COLOR_BLUE,
  CANDLE_CHART_GRID_COLOR,
  CHART_FONT_SIZE,
  CHART_Y_AXIS_MARGIN,
  CHART_X_AXIS_MARGIN,
  DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT,
  DEFAULT_CANDLE_COUNT,
  DEFAULT_MAX_CANDLE_DOM_ELEMENT_COUNT
} from '@/constants/ChartConstants'
import { makeDate } from '@/utils/dateManager'
import { getCandleDataArray } from '@/utils/upbitManager'
import { useWindowSize, WindowSize } from 'hooks/useWindowSize'
import { ChartPeriod } from '@/types/ChartTypes'
import { styled } from '@mui/material'

function updateChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[],
  option: ChartRenderOption,
  pointerInfo: PointerPosition,
  windowSize: WindowSize
) {
  //candleData를 fetchStartDataIndex에 맞게 잘라주는작업
  data = data.slice(
    option.fetchStartDataIndex,
    option.fetchStartDataIndex + DEFAULT_MAX_CANDLE_DOM_ELEMENT_COUNT
  )
  const chartContainerXsize = windowSize.width
  const chartContainerYsize = windowSize.height
  const chartAreaXsize = chartContainerXsize - CHART_Y_AXIS_MARGIN
  const chartAreaYsize = chartContainerYsize - CHART_X_AXIS_MARGIN
  const candleWidth = calculateCandlewidth(option, chartAreaXsize)
  const chartContainer = d3.select(svgRef.current)
  const chartArea = chartContainer.select('svg#chart-area')
  const yAxisScale = getYAxisScale(
    data.slice(
      option.renderStartDataIndex,
      option.renderStartDataIndex + option.renderCandleCount
    ),
    chartAreaYsize
  )
  if (!yAxisScale) {
    return undefined
  }
  const xAxisScale = getXAxisScale(option, data, chartAreaXsize)
  chartContainer
    .select<SVGSVGElement>('g#y-axis')
    .attr('transform', `translate(${chartAreaXsize},0)`)
    .call(d3.axisRight(yAxisScale).tickSizeInner(-1 * chartAreaXsize))
    .call(g => {
      g.selectAll('.tick line').attr('stroke', CANDLE_CHART_GRID_COLOR)
      g.selectAll('.tick text')
        .attr('stroke', 'black')
        .attr('font-size', CHART_FONT_SIZE)
    })
  chartContainer
    .select<SVGSVGElement>('g#x-axis')
    .attr('transform', `translate(0,${chartAreaYsize})`)
    .call(
      d3
        .axisBottom(xAxisScale)
        .tickSizeInner(-1 * chartAreaYsize)
        .tickSizeOuter(0)
        .ticks(5)
    )
    .call(g => {
      g.selectAll('.tick line').attr('stroke', CANDLE_CHART_GRID_COLOR)
      g.selectAll('.tick text')
        .attr('stroke', 'black')
        .attr('font-size', CHART_FONT_SIZE)
    })
  updateCurrentPrice(yAxisScale, data, option, chartAreaXsize)
  updatePointerUI(
    pointerInfo,
    yAxisScale,
    option,
    data,
    chartAreaXsize,
    chartAreaYsize
  )
  chartArea
    .selectAll<SVGSVGElement, CandleData>('g')
    .data(data)
    .join(
      enter => {
        const $g = enter.append('g')
        $g.attr('transform', `translate(${option.translateX})`) //263번 줄에서 수정, 차트 움직임을 zoom이벤트 ->updateChart에서 관리
        $g.append('line')
          .attr(
            'x1',
            (d, i) => chartAreaXsize + candleWidth / 2 - candleWidth * (i + 1)
          )
          .attr(
            'x2',
            (d, i) => chartAreaXsize + candleWidth / 2 - candleWidth * (i + 1)
          )
          .attr('y1', d => yAxisScale(d.low_price))
          .attr('y2', d => yAxisScale(d.high_price))
          .attr('stroke', 'black')
        $g.append('rect')
          .attr('width', candleWidth * 0.6)
          .attr('height', d =>
            Math.abs(yAxisScale(d.trade_price) - yAxisScale(d.opening_price))
          )
          .attr('x', (d, i) => chartAreaXsize - candleWidth * (i + 0.8))
          .attr('y', d =>
            Math.min(yAxisScale(d.trade_price), yAxisScale(d.opening_price))
          )
          .attr('fill', d =>
            d.opening_price <= d.trade_price
              ? CANDLE_COLOR_RED
              : CANDLE_COLOR_BLUE
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
          .attr('x', (d, i) => chartAreaXsize - candleWidth * (i + 0.8))
          .attr('y', d =>
            Math.min(yAxisScale(d.trade_price), yAxisScale(d.opening_price))
          )
          .attr('fill', d =>
            d.opening_price < d.trade_price
              ? CANDLE_COLOR_RED
              : CANDLE_COLOR_BLUE
          )
        update
          .select('line')
          .attr(
            'x1',
            (d, i) => chartAreaXsize + candleWidth / 2 - candleWidth * (i + 1)
          )
          .attr(
            'x2',
            (d, i) => chartAreaXsize + candleWidth / 2 - candleWidth * (i + 1)
          )
          .attr('y1', d => yAxisScale(d.low_price))
          .attr('y2', d => yAxisScale(d.high_price))
        return update
      },
      exit => {
        exit.remove()
      }
    )
}
interface CandleChartProps {
  candlePeriod: ChartPeriod
  candleData: CandleData[]
  candleDataSetter: React.Dispatch<React.SetStateAction<CandleData[]>>
  option: ChartRenderOption
  optionSetter: React.Dispatch<React.SetStateAction<ChartRenderOption>>
}

function initChart(
  svgRef: React.RefObject<SVGSVGElement>,
  optionSetter: React.Dispatch<React.SetStateAction<ChartRenderOption>>,
  pointerPositionSetter: React.Dispatch<React.SetStateAction<PointerPosition>>,
  windowSize: WindowSize
) {
  const chartContainerXsize = windowSize.width
  const chartContainerYsize = windowSize.height
  const chartAreaXsize = chartContainerXsize - CHART_Y_AXIS_MARGIN
  const chartAreaYsize = chartContainerYsize - CHART_X_AXIS_MARGIN
  //margin값도 크기에 맞춰 변수화 시켜야함.
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', chartContainerXsize)
  chartContainer.attr('height', chartContainerYsize)
  const chartArea = chartContainer.select('svg#chart-area')
  chartArea.attr('width', chartAreaXsize)
  chartArea.attr('height', chartAreaYsize)
  chartArea.attr('view')
  // xAxis초기값 설정
  chartContainer
    .select('svg#x-axis-container')
    .attr('width', chartAreaXsize)
    .attr('height', chartAreaYsize + 20)
  // currentPrice초기값 설정
  chartContainer.select('svg#current-price').attr('height', chartAreaYsize)
  // text 위치설정 매직넘버? 반응형 고려하면 변수화도 고려되어야할듯
  chartContainer.select('text#price-info').attr('x', 20).attr('y', 20)
  d3.select<SVGSVGElement, CandleData>('#chart-container')
    .call(
      d3
        .drag<SVGSVGElement, CandleData>()
        .on(
          'drag',
          (event: D3DragEvent<SVGSVGElement, CandleData, unknown>) => {
            optionSetter((prev: ChartRenderOption) => {
              const movedCandle = Math.max(
                Math.floor(
                  (prev.translateX + event.dx) /
                    calculateCandlewidth(prev, chartAreaXsize)
                ),
                0
              )

              return {
                ...prev,
                renderStartDataIndex: movedCandle,
                translateX: Math.max(prev.translateX + event.dx, 0)
              }
            })
            handleMouseEvent(
              event.sourceEvent,
              pointerPositionSetter,
              chartAreaXsize,
              chartAreaYsize
            )
          }
        )
    )
    .on('wheel', (e: WheelEvent) => {
      e.preventDefault()
      optionSetter((prev: ChartRenderOption) => {
        const newRenderCandleCount = Math.min(
          Math.max(
            prev.renderCandleCount + (e.deltaY > 0 ? 1 : -1), //휠이벤트 e.deltaY가 확대면 -1 축소면 +1
            MIN_CANDLE_COUNT
          ),
          DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT //최소 5~200개로 제한
        )
        const newTranslateX =
          calculateCandlewidth(
            { ...prev, renderCandleCount: newRenderCandleCount },
            chartAreaXsize
          ) * prev.renderStartDataIndex
        return {
          ...prev,
          renderCandleCount: newRenderCandleCount,
          translateX: newTranslateX
        }
      })
    })
  d3.select<SVGSVGElement, CandleData>('svg#chart-container').on(
    'mousemove',
    (event: MouseEvent) => {
      handleMouseEvent(
        event,
        pointerPositionSetter,
        chartAreaXsize,
        chartAreaYsize
      )
    }
  )
}

function checkNeedPastFetch(
  candleData: CandleData[],
  option: ChartRenderOption
) {
  return {
    result:
      Math.min(
        candleData.length - option.fetchStartDataIndex,
        DEFAULT_MAX_CANDLE_DOM_ELEMENT_COUNT
      ) <
      option.renderStartDataIndex + option.renderCandleCount + 100,
    //1000개의 data인데 현재 200~800인 경우 fetch할 필요가 없이 optionSetter만 넘겨주면 됩니다.
    willFetch:
      Math.ceil((candleData.length - option.fetchStartDataIndex) / 100) * 100 <=
      DEFAULT_MAX_CANDLE_DOM_ELEMENT_COUNT
  }
}
function checkNeedFutureFetch(
  candleData: CandleData[],
  option: ChartRenderOption
) {
  return (
    candleData.length >= DEFAULT_MAX_CANDLE_DOM_ELEMENT_COUNT &&
    option.renderStartDataIndex < 100 &&
    option.fetchStartDataIndex > 0
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
    initChart(chartSvg, props.optionSetter, setPointerInfo, windowSize)
  }, [windowSize, props.optionSetter])

  function goToPast(props: CandleChartProps) {
    return {
      ...props.option,
      fetchStartDataIndex:
        props.option.fetchStartDataIndex +
        DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT,
      renderStartDataIndex:
        props.option.renderStartDataIndex -
        DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT,
      translateX:
        props.option.translateX -
        DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT *
          calculateCandlewidth(
            props.option,
            windowSize.width - CHART_Y_AXIS_MARGIN
          )
    }
  }
  function goToFuture(props: CandleChartProps) {
    return {
      ...props.option,
      fetchStartDataIndex:
        props.option.fetchStartDataIndex -
        DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT,
      renderStartDataIndex:
        props.option.renderStartDataIndex +
        DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT,
      translateX:
        props.option.translateX +
        DEFAULT_RENDER_CANDLE_DOM_ELEMENT_COUNT *
          calculateCandlewidth(
            props.option,
            windowSize.width - CHART_Y_AXIS_MARGIN
          )
    }
  }
  React.useEffect(() => {
    //디바운싱 구문
    const { result, willFetch } = checkNeedPastFetch(
      props.candleData,
      props.option
    )
    //-----------------------좌측(과거)으로 이동-----------------------
    if (result) {
      //디바운싱
      if (!isFetching.current) {
        // 279번째 줄 참고 과거로 이동하되 fetch하지 않는경우 optionSetter만 발동
        if (
          !willFetch &&
          props.candleData.length - props.option.fetchStartDataIndex > 500
        ) {
          props.optionSetter(goToPast(props))

          return
        }

        //fetching중인데 한번더 요청이 일어나면 추가fetch 작동하지않음
        isFetching.current = true
        //추가적인 candleData Fetch
        getCandleDataArray(
          DEFAULT_CANDLE_PERIOD,
          props.option.marketType,
          DEFAULT_CANDLE_COUNT,
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
          if (res === null) {
            console.error('코인 쿼리 실패, 404에러')
            return
          }
          isFetching.current = false
          props.candleDataSetter(prev => [...prev, ...res])
          if (
            props.candleData.length - props.option.fetchStartDataIndex >
            500
          ) {
            props.optionSetter(goToPast(props))
          }
        })
      }
      return
    }
    //-----------------------우측(미래)으로 이동-----------------------
    if (checkNeedFutureFetch(props.candleData, props.option)) {
      props.optionSetter(goToFuture(props))
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
    <ChartContainer>
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
          <text id="price-info"></text>
        </svg>
      </div>
    </ChartContainer>
  )
}

const ChartContainer = styled('div')`
  display: flex;
  height: 100%;
  ${props => props.theme.breakpoints.down('tablet')} {
    height: 400px;
  }
`
