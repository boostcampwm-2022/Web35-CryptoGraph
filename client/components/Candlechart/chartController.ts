import {
  CHART_Y_AXIS_MARGIN,
  CHART_X_AXIS_MARGIN,
  CANDLE_CHART_GRID_COLOR,
  CANDLE_COLOR_RED,
  CANDLE_COLOR_BLUE,
  DEFAULT_POINTER_DATA
} from '@/constants/ChartConstants'
import { RefElementSize } from '@/hooks/useRefElementSize'
import {
  CandleData,
  ChartPeriod,
  CandleChartRenderOption,
  PointerData
} from '@/types/ChartTypes'
import {
  getYAxisScale,
  getXAxisScale,
  updateCurrentPrice,
  handleMouseEvent,
  getVolumeHeightScale
} from '@/utils/chartManager'
import * as d3 from 'd3'
import { D3DragEvent } from 'd3'
import React from 'react'
import { throttle } from 'lodash'

export function initCandleChart(
  svgRef: React.RefObject<SVGSVGElement>,
  translateXSetter: React.Dispatch<React.SetStateAction<number>>,
  optionSetter: React.Dispatch<React.SetStateAction<CandleChartRenderOption>>,
  pointerPositionSetter: React.Dispatch<React.SetStateAction<PointerData>>,
  refElementSize: RefElementSize
) {
  initCandleChartSVG(svgRef, refElementSize)
  addEventsToChart(
    svgRef,
    optionSetter,
    translateXSetter,
    pointerPositionSetter,
    refElementSize
  )
}

function initCandleChartSVG(
  svgRef: React.RefObject<SVGSVGElement>,
  refElementSize: RefElementSize
) {
  const chartContainerXsize = refElementSize.width
  const chartContainerYsize = refElementSize.height
  const chartAreaXsize = chartContainerXsize - CHART_Y_AXIS_MARGIN
  const chartAreaYsize = chartContainerYsize - CHART_X_AXIS_MARGIN
  //margin값도 크기에 맞춰 변수화 시켜야함.
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', chartContainerXsize)
  chartContainer.attr('height', chartContainerYsize)
  const chartArea = chartContainer.select('svg#chart-area')
  chartArea.attr('width', chartAreaXsize)
  chartArea.attr('height', chartAreaYsize)
  // xAxis초기값 설정
  chartContainer
    .select('svg#x-axis-container')
    .attr('width', chartAreaXsize)
    .attr('height', chartAreaYsize + 20)
  // currentPrice초기값 설정
  chartContainer.select('svg#current-price').attr('height', chartAreaYsize)
  // text 위치설정 매직넘버? 반응형 고려하면 변수화도 고려되어야할듯
  chartContainer.select('text#price-info').attr('x', 20).attr('y', 20)
  chartContainer.select('svg#mouse-pointer-UI').attr('pointer-events', 'none')
}

let prevDistance = -1
//불가피하게 지역변수 사용.. ㅠㅠ IIFE를 활용한 클로저 사용해보고 싶었으나, 세개의 콜백에 대해서 묶을 수 없어 지역변수 사용함
export function addEventsToChart(
  svgRef: React.RefObject<SVGSVGElement>,
  optionSetter: React.Dispatch<React.SetStateAction<CandleChartRenderOption>>,
  translateXSetter: React.Dispatch<React.SetStateAction<number>>,
  pointerPositionSetter: React.Dispatch<React.SetStateAction<PointerData>>,
  refElementSize: RefElementSize
) {
  const chartContainerXsize = refElementSize.width
  const chartContainerYsize = refElementSize.height
  const chartAreaXsize = chartContainerXsize - CHART_Y_AXIS_MARGIN
  const chartAreaYsize = chartContainerYsize - CHART_X_AXIS_MARGIN
  if (svgRef.current !== null) {
    const getEuclideanDistance = (touches: Touch[]): number => {
      return Math.sqrt(
        Math.pow(touches[0].clientX - touches[1].clientX, 2) +
          Math.pow(touches[0].clientY - touches[1].clientY, 2)
      )
    }
    d3.select<SVGSVGElement, CandleData>(svgRef.current)
      .call(
        d3
          .drag<SVGSVGElement, CandleData>()
          .on(
            'start',
            (event: D3DragEvent<SVGSVGElement, CandleData, unknown>) => {
              if (
                event.identifier === 'mouse' ||
                event.sourceEvent.touches.length !== 2
              )
                //마우스거나 (==데스크탑이거나), 2개의 멀티터치가 아니면 아무것도 하지 않음
                return
              prevDistance = getEuclideanDistance(event.sourceEvent.touches)
            }
          )
          .on(
            'drag',
            (event: D3DragEvent<SVGSVGElement, CandleData, unknown>) => {
              if (
                event.identifier !== 'mouse' &&
                event.sourceEvent.touches.length == 2
              ) {
                //여기는 줌 코드
                const nowDistance = getEuclideanDistance(
                  event.sourceEvent.touches
                )
                if (nowDistance === prevDistance) return
                const isZoomIn = prevDistance < nowDistance ? 0.5 : -0.5
                prevDistance = getEuclideanDistance(event.sourceEvent.touches)
                optionSetter((prev: CandleChartRenderOption) => {
                  const newCandleWidth = Math.min(
                    Math.max(prev.candleWidth + isZoomIn, prev.minCandleWidth),
                    prev.maxCandleWidth
                  )
                  const newRenderCandleCount = Math.ceil(
                    chartAreaXsize / newCandleWidth
                  )
                  return {
                    ...prev,
                    renderCandleCount: newRenderCandleCount,
                    candleWidth: newCandleWidth
                  }
                })
                return
              }
              //여기는 패닝 코드
              translateXSetter(prev => prev + event.dx)
              handleMouseEvent(
                event.sourceEvent,
                pointerPositionSetter,
                chartAreaXsize,
                chartAreaYsize
              )
            }
          )
          .on('end', () => {
            prevDistance = -1
          })
      )
      .on('wheel', (e: WheelEvent) => {
        e.preventDefault()
        optionSetter((prev: CandleChartRenderOption) => {
          const newCandleWidth = Math.min(
            Math.max(
              prev.candleWidth + (e.deltaY > 0 ? -1 : 1),
              prev.minCandleWidth
            ),
            prev.maxCandleWidth
          )
          const newRenderCandleCount = Math.ceil(
            chartAreaXsize / newCandleWidth
          )
          if (prev.maxDataLength !== Infinity) {
            const newMaxRenderStartDataIndex =
              prev.maxDataLength - newRenderCandleCount + 1
            return {
              ...prev,
              renderCandleCount: newRenderCandleCount,
              candleWidth: newCandleWidth,
              maxRenderStartDataIndex: newMaxRenderStartDataIndex,
              renderStartDataIndex: Math.min(
                prev.renderStartDataIndex,
                newMaxRenderStartDataIndex
              )
            }
          }
          return {
            ...prev,
            renderCandleCount: newRenderCandleCount,
            candleWidth: newCandleWidth
          }
        })
      })
    d3.select<SVGSVGElement, CandleData>(svgRef.current).on(
      'mousemove',
      throttle((event: MouseEvent) => {
        handleMouseEvent(
          event,
          pointerPositionSetter,
          chartAreaXsize,
          chartAreaYsize
        )
      }, 50)
    )
    d3.select<SVGSVGElement, null>(svgRef.current)
      .select('svg#chart-area')
      .on('mouseleave', () => {
        pointerPositionSetter(DEFAULT_POINTER_DATA)
      })
  }
}

// xAxis와 캔들유닛들 translate시키는 함수
export function translateCandleChart(
  svgRef: React.RefObject<SVGSVGElement>,
  translateX: number
) {
  const chartArea = d3.select(svgRef.current).select('svg#chart-area')
  const $xAxis = d3.select(svgRef.current).select('g#x-axis')
  chartArea.selectAll('g').attr('transform', `translate(${translateX})`)
  if (!$xAxis.attr('transform')) {
    return
  }
  $xAxis.attr(
    'transform',
    $xAxis.attr('transform').replace(/\(([0-9.\-]*),/, `(${translateX},`)
  )
  return
}

// 차트에 표시되는 데이터가 변경됨으로써 다시 data join이 일어나는 함수
export function updateCandleChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: CandleData[],
  option: CandleChartRenderOption,
  refElementSize: RefElementSize,
  candlePeriod: ChartPeriod,
  translateX: number
) {
  const chartContainerXsize = refElementSize.width
  const chartContainerYsize = refElementSize.height
  const chartAreaXsize = chartContainerXsize - CHART_Y_AXIS_MARGIN
  const chartAreaYsize = chartContainerYsize - CHART_X_AXIS_MARGIN
  const candleWidth = option.candleWidth
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
    return
  }

  const xAxisScale = getXAxisScale(option, data, chartAreaXsize, candlePeriod)
  UpdateAxis(
    chartContainer,
    xAxisScale,
    yAxisScale,
    chartAreaXsize,
    chartAreaYsize,
    candleWidth,
    translateX
  ) // axis를 업데이트한다.

  // 볼륨 스케일 함수, 추후 볼륨 추가시 해금예정
  // const volumeHeightScale = getVolumeHeightScale(
  //   data.slice(
  //     option.renderStartDataIndex,
  //     option.renderStartDataIndex + option.renderCandleCount
  //   ),
  //   chartAreaYsize
  // )

  // 현재 가격을 업데이트한다.
  updateCurrentPrice(yAxisScale, data, option, chartAreaXsize, chartAreaYsize)

  chartArea
    .selectAll<SVGSVGElement, CandleData>('g')
    .data(
      data.slice(
        option.renderStartDataIndex,
        option.renderStartDataIndex + option.renderCandleCount
      )
    )
    .join(
      enter => {
        const $g = enter.append('g')
        /*  $g.append('rect').classed('volumeRect', true)
        $g = placeVolumeRect($g, chartAreaXsize, candleWidth, yAxisScale) */
        // 거래량, 개발예정, 성능 문제로 보류
        // $g.append('line')
        // $g.append('rect').classed('candleRect', true)
        placeCandleLine($g, chartAreaXsize, candleWidth, yAxisScale, xAxisScale)
        placeCandleRect($g, chartAreaXsize, candleWidth, yAxisScale, xAxisScale)
        placeFullRect($g, candleWidth, xAxisScale, chartAreaYsize)
        return $g
      },
      update => {
        update
          .select('rect.candleRect')
          .attr('width', candleWidth * 0.6)
          .attr('height', d =>
            Math.abs(yAxisScale(d.trade_price) - yAxisScale(d.opening_price)) <=
            0
              ? 1
              : Math.abs(
                  yAxisScale(d.trade_price) - yAxisScale(d.opening_price)
                )
          )
          .attr(
            'x',
            d =>
              xAxisScale(new Date(d.candle_date_time_kst)) - candleWidth * 0.8
          )
          .attr('y', d =>
            Math.min(yAxisScale(d.trade_price), yAxisScale(d.opening_price))
          )
          .attr('fill', d =>
            d.opening_price < d.trade_price
              ? CANDLE_COLOR_RED
              : CANDLE_COLOR_BLUE
          )
        update
          .select('rect.fullRect')
          .attr('width', candleWidth)
          .attr('height', chartAreaYsize)
          .attr(
            'x',
            d => xAxisScale(new Date(d.candle_date_time_kst)) - candleWidth
          )
          .attr('y', 0)
        update
          .select('line')
          .attr(
            'x1',
            d => xAxisScale(new Date(d.candle_date_time_kst)) - candleWidth / 2
          )
          .attr(
            'x2',
            d => xAxisScale(new Date(d.candle_date_time_kst)) - candleWidth / 2
          )
          .attr('y1', d => yAxisScale(d.low_price))
          .attr('y2', d => yAxisScale(d.high_price))
        // update
        //   .select('rect.volumeRect')
        //   .attr('width', candleWidth * 0.6)
        //   .attr('height', 10)
        //   .attr('height', d => d.candle_acc_trade_price)
        //   .attr('x', (d, i) => chartAreaXsize - candleWidth * (i + 0.8))
        //   .attr('y', 300)
        //   .attr('fill', 'yellow')
        //   .attr('opacity', 0.5)
        // 거래량
        return update
      },
      exit => {
        exit.remove()
      }
    )
}

function UpdateAxis(
  chartContainer: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  xAxisScale: d3.ScaleTime<number, number, never>,
  yAxisScale: d3.ScaleLinear<number, number, never>,
  chartAreaXsize: number,
  chartAreaYsize: number,
  candleWidth: number,
  translateX: number
) {
  chartContainer
    .select<SVGSVGElement>('g#y-axis')
    .attr('transform', `translate(${chartAreaXsize},0)`)
    .call(d3.axisRight(yAxisScale).tickSizeInner(-1 * chartAreaXsize))
    .call(g => {
      g.selectAll('.tick line').attr('stroke', CANDLE_CHART_GRID_COLOR)
      g.selectAll('.tick text')
        .attr('stroke', 'black')
        .attr('font-size', '12px')
    })
  chartContainer
    .select<SVGSVGElement>('g#x-axis')
    .attr('transform', `translate(${translateX},${chartAreaYsize})`)
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
        .attr('font-size', '12px')
    })
}

function placeCandleLine(
  $g: d3.Selection<SVGGElement, CandleData, d3.BaseType, unknown>,
  chartAreaXsize: number,
  candleWidth: number,
  yAxisScale: d3.ScaleLinear<number, number, never>,
  xAxisScale: d3.ScaleTime<number, number, never>
) {
  $g.append('line')
    .attr(
      'x1',
      d => xAxisScale(new Date(d.candle_date_time_kst)) - candleWidth / 2
    )
    .attr(
      'x2',
      d => xAxisScale(new Date(d.candle_date_time_kst)) - candleWidth / 2
    )
    .attr('y1', d => yAxisScale(d.low_price))
    .attr('y2', d => yAxisScale(d.high_price))
    .attr('stroke', 'black')
  return $g
}

function placeCandleRect(
  $g: d3.Selection<SVGGElement, CandleData, d3.BaseType, unknown>,
  chartAreaXsize: number,
  candleWidth: number,
  yAxisScale: d3.ScaleLinear<number, number, never>,
  xAxisScale: d3.ScaleTime<number, number, never>
) {
  $g.append('rect')
    .classed('candleRect', true)
    .attr('width', candleWidth * 0.6)
    .attr('height', d =>
      Math.abs(yAxisScale(d.trade_price) - yAxisScale(d.opening_price))
    )
    .attr(
      'x',
      d => xAxisScale(new Date(d.candle_date_time_kst)) - candleWidth * 0.8
    )
    .attr('y', d =>
      Math.min(yAxisScale(d.trade_price), yAxisScale(d.opening_price))
    )
    .attr('fill', d =>
      d.opening_price <= d.trade_price ? CANDLE_COLOR_RED : CANDLE_COLOR_BLUE
    )
    .attr('stroke', 'black')
  return
}

function placeFullRect(
  $g: d3.Selection<SVGGElement, CandleData, d3.BaseType, unknown>,
  candleWidth: number,
  xAxisScale: d3.ScaleTime<number, number, never>,
  chartAreaYsize: number
) {
  $g.append('rect')
    .classed('fullRect', true)
    .attr('x', d => xAxisScale(new Date(d.candle_date_time_kst)) - candleWidth)
    .attr('y', 0)
    .attr('width', candleWidth)
    .attr('height', chartAreaYsize)
    .attr('fill', 'transparent')
}

function placeVolumeRect(
  $g: d3.Selection<SVGGElement, CandleData, d3.BaseType, unknown>,
  chartAreaXsize: number,
  candleWidth: number,
  yAxisScale: d3.ScaleLinear<number, number, never>
) {
  $g.attr('width', candleWidth * 0.6)
    .attr('height', d => yAxisScale(d.trade_volume))
    .attr('x', (d, i) => chartAreaXsize - candleWidth * (i + 0.8))
    .attr('y', 30)
    .attr('fill', d =>
      d.opening_price <= d.trade_price ? CANDLE_COLOR_RED : CANDLE_COLOR_BLUE
    )
  return
}
