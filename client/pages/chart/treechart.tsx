import * as d3 from 'd3'
import { useState, useEffect, useRef, useReducer } from 'react'
import useInterval from 'hooks/useInterval'
import { dataReducer } from 'hooks/reducers/dataReducer'
import {
  ActionType,
  EmptyObject,
  CoinRateType,
  CoinRateContentType
} from '@/types/ChartTypes'

const width = 2400
const height = 1000
const coinIntervalRate = 1000

const updateChart = (
  svgRef: React.RefObject<SVGSVGElement>,
  data: CoinRateContentType[]
) => {
  const chartArea = d3.select('svg#chart-area')
  const [min, max]: number[] = [
    d3.min(data, d => Math.abs(d.value as number)) as number,
    d3.max(data, d => d.value as number) as number
  ]
  const treeMapvalueScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([0.5, 1.5])
  const root: d3.HierarchyNode<CoinRateContentType> = d3
    .stratify<CoinRateContentType>()
    .id(function (d): string {
      return d.name
    })
    .parentId(function (d): string {
      return d.parent
    })(data)
  root.sum(function (d): number {
    return Math.abs(+d.value)
  })
  d3.treemap<CoinRateContentType>().size([width, height]).padding(4)(root)

  chartArea
    .selectAll<SVGSVGElement, CoinRateContentType>('rect')
    .data<d3.HierarchyRectangularNode<CoinRateContentType>>(
      root.leaves() as Array<d3.HierarchyRectangularNode<CoinRateContentType>>
    )
    .join('rect')
    .attr('x', function (d) {
      return d.x0
    })
    .attr('y', function (d) {
      return d.y0
    })
    .attr('width', function (d) {
      return d.x1 - d.x0
    })
    .attr('height', function (d) {
      return d.y1 - d.y0
    })
    .attr('fill', function (d) {
      return d.data.value > 0 ? 'red' : 'blue'
    })
    .transition()
    .attr('opacity', function (d) {
      return treeMapvalueScale(Math.abs(d.data.value as number))
    })
    .style('stroke', 'black')
  chartArea
    .selectAll('text')
    .data(
      root.leaves() as Array<d3.HierarchyRectangularNode<CoinRateContentType>>
    )
    .join('text')
    .attr('x', function (d) {
      return d.x0 + Math.abs(d.x1 - d.x0) / 2 - 30
    })
    .attr('y', function (d) {
      return d.y0 + Math.abs(d.y1 - d.y0) / 2
    })
    .text(function (d) {
      return d.data.name + '\n' + String(Number(d.data.value).toFixed(2)) + '%'
    })
    .attr('font-size', '10px')
    .attr('fill', 'white')
}

const initChart = (svgRef: React.RefObject<SVGSVGElement>) => {
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', width)
  chartContainer.attr('height', height)
}

export default function TreeChartPage() {
  const [changeRate, setChangeRate] = useState<CoinRateContentType[]>([
    { name: 'Origin', parent: '', value: 0 }
  ]) //coin의 등락률 값에 서 parentNode가 추가된 값
  const [coinRate, setCoinRate] = useState<CoinRateType[]>([]) //coin의 등락률 값
  const [data, dispatch] = useReducer<
    (
      data: CoinRateType | EmptyObject,
      action: ActionType
    ) => CoinRateType | undefined
  >(dataReducer, {} as never) //coin의 등락률 변화값을 받아서 coinRate에 넣어줌
  const chartSvg = useRef<SVGSVGElement>(null)
  useEffect(() => {
    // 1. 트리맵 초기화 (트리맵에 티커 추가)
    initChart(chartSvg)
    dispatch({ type: 'init', coinRate: coinRate[0] })
  }, [])
  useEffect(() => {
    // 2. 티커를 받아오면 data init
    setCoinRate([data])
  }, [Object.keys(data)])

  useInterval(() => {
    // 3. 주기적으로 코인 등락률을 업데이트
    dispatch({ type: 'update', coinRate: coinRate[0] })
    setCoinRate([...Object.values<CoinRateType>(data)])
  }, coinIntervalRate)

  useEffect(() => {
    // 4. CoinRate에 코인 등락률이 업데이트되면 ChangeRate에 전달
    const parentNode: CoinRateContentType[] = [
      { name: 'Origin', parent: '', value: 0 }
    ]
    setChangeRate([
      ...parentNode,
      ...Object.values(data)
    ] as CoinRateContentType[])
  }, [coinRate])

  useEffect(() => {
    // 5. 트리맵에 데이터 바인딩
    updateChart(chartSvg, changeRate)
  }, [changeRate])

  return (
    <>
      <svg id="tree-chart" ref={chartSvg}>
        <svg id="chart-area"></svg>
      </svg>
    </>
  )
}
