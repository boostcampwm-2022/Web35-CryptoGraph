import * as d3 from 'd3'
import { useState, useEffect, useRef, useReducer } from 'react'
import useInterval from '@/hooks/useInterval'
import { dataReducer } from '@/hooks/reducers/dataReducer'
import { useWindowSize } from '@/hooks/useWindowSize'
import {
  ActionType,
  EmptyObject,
  CoinRateType,
  CoinRateContentType
} from '@/types/ChartTypes'
import { getTreeData, updateTreeData } from './getCoinData'

const coinIntervalRate = 5000

const updateChart = (
  svgRef: React.RefObject<SVGSVGElement>,
  data: CoinRateContentType[],
  width: number,
  height: number
) => {
  if (!svgRef.current) return
  const chartContainer = d3.select<SVGSVGElement, CoinRateContentType>(
    svgRef.current
  )
  chartContainer.attr('width', width)
  chartContainer.attr('height', height)
  const chartArea = d3.select('svg#chart-area')
  const [min, max]: number[] = [
    d3.min(data, d => Math.abs(d.value)) as number,
    d3.max(data, d => d.value) as number
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
    .selectAll<SVGSVGElement, CoinRateContentType>('g')
    .data<d3.HierarchyRectangularNode<CoinRateContentType>>(
      root.leaves() as Array<d3.HierarchyRectangularNode<CoinRateContentType>>
    )
    .join(
      enter => {
        const $g = enter.append('g')
        $g.append('rect')
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
        $g.append('text')
          .attr('x', function (d) {
            return d.x0 + Math.abs(d.x1 - d.x0) / 2
          })
          .attr('y', function (d) {
            return d.y0 + Math.abs(d.y1 - d.y0) / 2
          })
          .attr('text-anchor', 'middle')
          .text(function (d) {
            return (
              d.data.name + '\n' + String(Number(d.data.value).toFixed(2)) + '%'
            )
          })
          .style('font-size', function (d) {
            return `${(d.x1 - d.x0) / 9}px`
          })
          .attr('fill', 'white')
        return $g
      },
      update => {
        update
          .select('rect')
          .transition()
          .duration(500)
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
          .transition()
          .duration(500)
          .style('stroke', 'black')
        update
          .select('text')
          .transition()
          .duration(500)
          .attr('x', function (d) {
            return d.x0 + Math.abs(d.x1 - d.x0) / 2
          })
          .attr('y', function (d) {
            return d.y0 + Math.abs(d.y1 - d.y0) / 2
          })
          .attr('text-anchor', 'middle')
          .text(function (d) {
            return (
              d.data.name + '\n' + String(Number(d.data.value).toFixed(2)) + '%'
            )
          })
          .style('font-size', function (d) {
            return `${(d.x1 - d.x0) / 9}px`
          })
          .attr('fill', 'white')
        return update
      },
      exit => {
        exit.remove()
      }
    )
}

const initChart = (
  svgRef: React.RefObject<SVGSVGElement>,
  width: number,
  height: number
) => {
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

export default function TreeChart({ data }) {
  const [changeRate, setChangeRate] = useState<CoinRateContentType[]>([
    { name: 'Origin', parent: '', value: 0 }
  ]) //coin의 등락률 값에 parentNode가 추가된 값
  const [coinRate, setCoinRate] = useState<CoinRateType[]>() //coin의 등락률 값
  const chartSvg = useRef<SVGSVGElement>(null)
  const chartContainerSvg = useRef<HTMLDivElement>(null)
  const { width, height } = useWindowSize(chartContainerSvg)

  useEffect(() => {
    console.log('init chart')
    initChart(chartSvg, width, height)
  }, [width, height])

  useEffect(() => {
    getTreeData().then(data => {
      console.log('here')
      setCoinRate(data)
    })
  }, [])

  useInterval(() => {
    setCoinRate(updateTreeData({ ...coinRate }))
  }, coinIntervalRate)

  useEffect(() => {
    // 4. CoinRate에 코인 등락률이 업데이트되면 ChangeRate에 전달
    const parentNode: CoinRateContentType[] = [
      { name: 'Origin', parent: '', value: 0 }
    ]
    if (!coinRate) return
    setChangeRate([
      ...parentNode,
      ...Object.values(coinRate)
    ] as CoinRateContentType[])
  }, [coinRate])

  useEffect(() => {
    // 5. 트리맵에 데이터 바인딩

    if (changeRate.length === undefined || changeRate[1] === undefined) {
      return
    }

    if (changeRate.length > 1 && changeRate[2].value !== 1) {
      updateChart(chartSvg, changeRate, width, height)
    }
  }, [changeRate, width, height])

  return (
    <div
      style={{ display: 'flex', width: '100%', height: '100%' }}
      ref={chartContainerSvg}
    >
      <svg id="tree-chart" ref={chartSvg}>
        <svg id="chart-area"></svg>
      </svg>
    </div>
  )
}
