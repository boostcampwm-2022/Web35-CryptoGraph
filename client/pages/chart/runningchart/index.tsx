import * as d3 from 'd3'
import { useState, useEffect, useRef, useReducer, SetStateAction } from 'react'
import useInterval from 'hooks/useInterval'
import { dataReducer } from 'hooks/reducers/dataReducer'
import {
  ActionType,
  EmptyObject,
  CoinRateType,
  CoinRateContentType
} from '@/types/ChartTypes'

const WIDTH = 1024
const HEIGHT = 768
const COIN_INTERVAL_RATE = 1000

// const updateChart = (
//   svgRef: React.RefObject<SVGSVGElement>,
//   data: CoinRateContentType[]
// ) => {
//   const chartArea = d3.select('svg#chart-area')
//   const [min, max]: number[] = [
//     d3.min(data, d => Math.abs(d.value as number)) as number,
//     d3.max(data, d => d.value as number) as number
//   ]
//   const treeMapvalueScale = d3
//     .scaleLinear()
//     .domain([min, max])
//     .range([0.5, 1.5])
//   const root: d3.HierarchyNode<CoinRateContentType> = d3
//     .stratify<CoinRateContentType>()
//     .id(function (d): string {
//       return d.name
//     })
//     .parentId(function (d): string {
//       return d.parent
//     })(data)
//     console.log('root : ',root)
//   root.sum(function (d): number {
//     return Math.abs(+d.value)
//   })
//   d3.treemap<CoinRateContentType>().size([WIDTH, HEIGHT]).padding(4)(root)

//   chartArea
//     .selectAll<SVGSVGElement, CoinRateContentType>('rect')
//     .data<d3.HierarchyRectangularNode<CoinRateContentType>>(
//       root.leaves() as Array<d3.HierarchyRectangularNode<CoinRateContentType>>
//     )
//     .join('rect')
//     .attr('x', function (d) {
//       return d.x0
//     })
//     .attr('y', function (d) {
//       return d.y0
//     })
//     .attr('width', function (d) {
//       return d.x1 - d.x0
//     })
//     .attr('height', function (d) {
//       return d.y1 - d.y0
//     })
//     .attr('fill', function (d) {
//       return d.data.value > 0 ? 'red' : 'blue'
//     })
//     .transition()
//     .attr('opacity', function (d) {
//       return treeMapvalueScale(Math.abs(d.data.value as number))
//     })
//     .style('stroke', 'black')
//   chartArea
//     .selectAll('text')
//     .data(
//       root.leaves() as Array<d3.HierarchyRectangularNode<CoinRateContentType>>
//     )
//     .join('text')
//     .attr('x', function (d) {
//       return d.x0 + Math.abs(d.x1 - d.x0) / 2 - 30
//     })
//     .attr('y', function (d) {
//       return d.y0 + Math.abs(d.y1 - d.y0) / 2
//     })
//     .text(function (d) {
//       return d.data.name + '\n' + String(Number(d.data.value).toFixed(2)) + '%'
//     })
//     .attr('font-size', '10px')
//     .attr('fill', 'white')
// }

const initChart = (svgRef: React.RefObject<SVGSVGElement>) => {
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', WIDTH)
  chartContainer.attr('height', HEIGHT)
}

export default function TreeChartPage() {
  const [coinRate, setCoinRate] = useState<CoinRateType[]>([]) //coin의 등락률 값
  const [data, dispatch] = useReducer<
    (
      data: CoinRateType | EmptyObject,
      action: ActionType
    ) => CoinRateType | undefined
  >(dataReducer, {} as never) //coin의 등락률 변화값을 받아서 coinRate에 넣어줌
  const chartSvg = useRef<SVGSVGElement>(null)
  useEffect(() => {
    // 1. 러닝맵 초기화(width,height 설정) 및  티커 추가
    initChart(chartSvg)
    dispatch({ type: 'init', coinRate: coinRate[0] })
  }, [])

  useInterval(() => {
    // 2. 주기적으로 코인 등락률을 업데이트
    dispatch({ type: 'update', coinRate: coinRate[0] })
    if (data) {
      setCoinRate([data])
    }
  }, COIN_INTERVAL_RATE)

  useEffect(() => {
    // 5. 데이터 바인딩
    //   updateChart(chartSvg, changeRate)
  }, [coinRate])

  return (
    <>
      <svg id="tree-chart" ref={chartSvg}>
        <svg id="chart-area"></svg>
      </svg>
    </>
  )
}
