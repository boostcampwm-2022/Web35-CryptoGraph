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

const width = 1920
const height = 800
const coinIntervalRate = 300

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
  const sort = (
    a: d3.HierarchyNode<CoinRateContentType>,
    b: d3.HierarchyNode<CoinRateContentType>
  ) => d3.descending(a.value, b.value)
  //const sort = (a, b) => d3.ascending(a.id, b.id)

  root
    .sum(function (d): number {
      return Math.abs(+d.value)
    })
    .sort(sort)

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
  // const treeChartArea = d3
  //   .select('svg#tree-chart')
  //   .style('border-style', 'solid')
  //   .style('border-width', '10px')
  //   .style('border-radius', '10%')
}

const initChart = (svgRef: React.RefObject<SVGSVGElement>) => {
  const zoom = d3
    .zoom<SVGSVGElement, CoinRateContentType>()
    .on('zoom', handleZoom)
    .scaleExtent([1, 5]) //scale 제한
    .translateExtent([
      [0, 0], // top-left-corner 좌표
      [width, height] //bottom-right-corner 좌표
    ])
  function handleZoom(e: d3.D3ZoomEvent<SVGSVGElement, CoinRateContentType>) {
    d3.selectAll('rect').attr(
      'transform',
      `translate(${e.transform.x}, ${e.transform.y}) scale(${e.transform.k}, ${e.transform.k})`
    )
    d3.selectAll('text').attr(
      'transform',
      `translate(${e.transform.x}, ${e.transform.y}) scale(${e.transform.k}, ${e.transform.k})`
    )
  }
  if (!svgRef.current) return
  const chartContainer = d3
    .select<SVGSVGElement, CoinRateContentType>(svgRef.current)
    .call(zoom)
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
  }, [data])
  //}, [Object.keys(data)])
  useInterval(() => {
    // 3. 주기적으로 코인 등락률을 업데이트
    dispatch({ type: 'update', coinRate: coinRate[0] })
    setCoinRate([data])
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
    if (changeRate.length > 1 && changeRate[1].value !== 1) {
      updateChart(chartSvg, changeRate)
    }
  }, [changeRate])

  return (
    <>
      <svg id="tree-chart" ref={chartSvg}>
        <svg id="chart-area"></svg>
      </svg>
    </>
  )
}
