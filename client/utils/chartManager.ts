import {
  CHART_AREA_Y_SIZE,
  CHART_AREA_X_SIZE
} from '@/constants/ChartConstants'
import { ChartRenderOption, CandleData } from '@/types/ChartTypes'
import * as d3 from 'd3'
import { makeDate } from './dateManager'

export function calculateCandlewidth(
  option: ChartRenderOption,
  chartXSize: number
): number {
  return chartXSize / option.renderCandleCount
}
export function getYAxisScale(data: CandleData[]) {
  const [min, max] = [
    d3.min(data, d => d.low_price),
    d3.max(data, d => d.high_price)
  ]
  if (!min || !max) {
    console.error(data, data.length)
    console.error('데이터에 문제가 있다. 서버에서 잘못 쏨')
    return undefined
  }
  return d3.scaleLinear().domain([min, max]).range([CHART_AREA_Y_SIZE, 0])
}
export function getXAxisScale(option: ChartRenderOption, data: CandleData[]) {
  let index = option.renderStartDataIndex + option.renderCandleCount
  if (
    option.renderStartDataIndex + option.renderCandleCount >
    option.fetchCandleCount + option.fetchStartDataIndex - 1
  ) {
    index = option.fetchCandleCount + option.fetchStartDataIndex - 1
  }
  return d3
    .scaleTime()
    .domain([
      //데이터는 End가 최신 데이터이기 때문에, 순서를 반대로 해야 시간순서대로 들어온다?
      makeDate(data[index].timestamp, 60),
      makeDate(data[option.renderStartDataIndex].timestamp, 60)
    ]) //옵션화 필요함
    .range([0, CHART_AREA_X_SIZE])
    .nice()
}
