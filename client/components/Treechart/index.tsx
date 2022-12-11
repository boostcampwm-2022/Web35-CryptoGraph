import * as d3 from 'd3'
import { useState, useEffect, useRef } from 'react'
import { useWindowSize } from '@/hooks/useWindowSize'
import {
  CoinRateType,
  CoinRateContentType,
  MainChartPointerData
} from '@/types/ChartTypes'
import { colorQuantizeScale } from '@/utils/chartManager'
import { throttle } from 'lodash'
import { convertUnit, MainChartHandleMouseEvent } from '@/utils/chartManager'
import ChartTagController from '../ChartTagController'
import { DEFAULT_RUNNING_POINTER_DATA } from '@/constants/ChartConstants'

const updateChart = (
  svgRef: React.RefObject<SVGSVGElement>,
  data: CoinRateContentType[],
  width: number,
  height: number,
  selectedSort: string,
  nodeOnclickHandler: (market: string) => void,
  setPointerHandler: React.Dispatch<React.SetStateAction<MainChartPointerData>>
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
  ) => {
    if (selectedSort === 'change rate') {
      return d3.descending(a.data.value, b.data.value)
    }
    if (selectedSort === 'change rate(absolute)') {
      return d3.descending(Math.abs(a.data.value), Math.abs(b.data.value))
    }
    if (selectedSort === 'trade price') {
      return d3.descending(
        a.data.acc_trade_price_24h,
        b.data.acc_trade_price_24h
      )
    }
    return d3.ascending(a.data.cmc_rank, b.data.cmc_rank)
  }

  root
    .sum(function (d): number {
      if (d.name === 'Origin') {
        return 0
      }
      if (
        selectedSort === 'change rate' ||
        selectedSort === 'change rate(absolute)'
      ) {
        return Math.max(0.1, Math.abs(d.value))
      }
      if (selectedSort === 'trade price') {
        return Math.max(0.1, Math.abs(d.acc_trade_price_24h))
      }
      return Math.max(0.1, Math.abs(d.market_cap))
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
          .on('mouseover', function (d, i) {
            d3.select(this).style('opacity', '.70')
          })
          .on('mousemove', function (d, i) {
            MainChartHandleMouseEvent(d, setPointerHandler, i.data, height)
          })
          .on('mouseout', function (d, i) {
            MainChartHandleMouseEvent(d, setPointerHandler, i.data, height)
            d3.select(this).style('opacity', '1')
          })
          .on('click', function (this, e, d) {
            nodeOnclickHandler(d.data.ticker.split('-')[1])
          })
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
            return d.data.value >= 0
              ? d.data.value > 0
                ? colorQuantizeScale(max, d.data.value)
                : 'gray'
              : colorQuantizeScale(min, d.data.value)
          })
          .style('stroke', 'gray')

        $g.append('text')
          .attr('x', function (d) {
            return d.x0 + Math.abs(d.x1 - d.x0) / 2
          })
          .attr('y', function (d) {
            return d.y0 + Math.abs(d.y1 - d.y0) / 2
          })
          .attr('text-anchor', 'middle')
          .text(function (d) {
            // 초기값 changerate 아니라면 수정해줘야함
            return (
              d.data.ticker?.split('-')[1] +
              '\n' +
              String(Number(d.data.value).toFixed(2)) +
              '%'
            )
          })
          .style('font-size', function (d) {
            return `${(d.x1 - d.x0) / 9}px`
          })
          .attr('fill', 'white')
        $g.append('text').attr('class', 'tag')
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
            return d.data.value >= 0
              ? d.data.value > 0
                ? colorQuantizeScale(max, d.data.value)
                : 'gray'
              : colorQuantizeScale(min, d.data.value)
          })
          .transition()
          .duration(500)
          .style('stroke', 'gray')

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
            const text =
              selectedSort !== 'trade price'
                ? selectedSort === 'market capitalization'
                  ? convertUnit(Number(d.data.market_cap))
                  : String(Number(d.data.value).toFixed(2)) + '%'
                : convertUnit(Number(d.data.acc_trade_price_24h))
            return d.data.ticker?.split('-')[1] + '\n' + text
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
    .on('zoom', throttle(handleZoom, 50))
    .scaleExtent([1, 30]) //scale 제한
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

export interface TreeChartProps {
  data: CoinRateType
  Market?: string[] //선택된 코인 리스트
  selectedSort: string
  modalOpenHandler: (market: string) => void
}
export default function TreeChart({
  data,
  Market, //= ['CELO', 'ETH', 'MFT', 'WEMIX']
  selectedSort,
  modalOpenHandler
}: TreeChartProps) {
  const [changeRate, setChangeRate] = useState<CoinRateContentType[]>([
    {
      name: 'Origin',
      ticker: '',
      acc_trade_price_24h: 0,
      parent: '',
      value: 0,
      market_cap: 0
    }
  ]) //coin의 등락률 값에 parentNode가 추가된 값
  const chartSvg = useRef<SVGSVGElement>(null)
  const chartContainerSvg = useRef<HTMLDivElement>(null)
  const { width, height } = useWindowSize(chartContainerSvg)
  const [pointerInfo, setPointerInfo] = useState<MainChartPointerData>(
    DEFAULT_RUNNING_POINTER_DATA
  )

  useEffect(() => {
    initChart(chartSvg, width, height)
  }, [width, height])

  useEffect(() => {
    // CoinRate에 코인 등락률이 업데이트되면 ChangeRate에 전달
    if (!data || !Market) return
    const newCoinData: CoinRateContentType[] = [
      {
        name: 'Origin',
        ticker: '',
        acc_trade_price_24h: 0,
        parent: '',
        value: 0,
        market_cap: 0
      }
    ]
    for (const tick of Market) {
      newCoinData.push(data['KRW-' + tick])
    }
    setChangeRate(newCoinData)
  }, [data, Market])
  useEffect(() => {
    updateChart(
      chartSvg,
      changeRate,
      width,
      height,
      selectedSort,
      modalOpenHandler,
      setPointerInfo
    )
    setPointerInfo(DEFAULT_RUNNING_POINTER_DATA)
  }, [changeRate, width, height, selectedSort, modalOpenHandler])
  return (
    <div
      style={{ display: 'flex', width: '100%', height: '100%' }}
      ref={chartContainerSvg}
    >
      <svg id="tree-chart" ref={chartSvg}>
        <svg id="chart-area"></svg>
      </svg>
      <ChartTagController pointerInfo={pointerInfo} />
    </div>
  )
}
