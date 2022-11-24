import * as d3 from 'd3'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { CandleData, ChartPeriod, ChartRenderOption } from '@/types/ChartTypes'
import { CandleChart } from 'components/CandleChart'
import {
  DEFAULT_CANDLER_CHART_RENDER_OPTION,
  DEFAULT_CANDLE_PERIOD
} from '@/constants/ChartConstants'
import { getCandleDataArray } from '@/utils/upbitManager'
import { useRealTimeUpbitData } from 'hooks/useRealTimeUpbitData'
import { useState, useEffect, useRef, useReducer } from 'react'
import useInterval from 'hooks/useInterval'
import { dataReducer } from 'reducers/dataReducer'

// set the dimensions and margins of the graph
const margin = { top: 10, right: 10, bottom: 10, left: 300 }
const width = 2400
const height = 1000

const updateChart = (svgRef: React.RefObject<SVGSVGElement>, data) => {
  const chartArea = d3.select('svg#chart-area')
  const root = d3
    .stratify()
    .id(function (d) {
      return d.name
    }) // Name of the entity (column name is name in csv)
    .parentId(function (d) {
      return d.parent
    })(
    // Name of the parent (column name is parent in csv)
    data
  )
  root.sum(function (d) {
    return Math.abs(+d.value)
  })
  d3.treemap().size([width, height]).padding(4)(root)
  const [min, max] = [
    d3.min(data, d => Math.abs(d.value)),
    d3.max(data, d => d.value)
  ]
  let myScale = d3.scaleLinear().domain([min, max]).range([0.5, 1.5])
  chartArea
    .selectAll('rect')
    .data(root.leaves())
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
      return myScale(Math.abs(d.data.value))
    })
    .style('stroke', 'black')
  chartArea
    .selectAll('text')
    .data(root.leaves())
    .join('text')
    .attr('x', function (d) {
      return d.x0 + Math.abs(d.x1 - d.x0) / 2 - 120 //d.x0 + 30
    })
    .attr('y', function (d) {
      return d.y0 + Math.abs(d.y1 - d.y0) / 2
    })
    .text(function (d) {
      return d.data.name + '\n' + String(Number(d.data.value).toFixed(2)) + '%'
    })
    .attr('font-size', '40px')
    .attr('fill', 'white')
}

const initChart = (svgRef: React.RefObject<SVGSVGElement>) => {
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', width)
  chartContainer.attr('height', height)
}

export default function TreeChartPage({}: any) {
  const [changeRate, setChangeRate] = useState([
    { name: 'Origin', parent: '', value: 0 }
  ])
  const [coinRate, setcoinRate] = useState({})
  const [data, dispatch] = useReducer(dataReducer, {})

  const chartSvg = useRef<SVGSVGElement>(null)
  useEffect(() => {
    initChart(chartSvg)
    dispatch({ type: 'init', coinRate })
  }, [])

  useEffect(() => {
    updateChart(chartSvg, changeRate.slice(0, 20))
  }, [changeRate])

  useEffect(() => {
    console.log('coin update')
    setcoinRate(data)
  }, [Object.keys(data)])

  useEffect(() => {
    console.log('data binding')
    const parent = [{ name: 'Origin', parent: '', value: 0 }]
    setChangeRate([...parent, ...Object.values(data)])
  }, [coinRate])

  useInterval(() => {
    console.log('coin update2')
    dispatch({ type: 'update', coinRate })
    setcoinRate([...Object.values(data)])
  }, 500)

  //30개 임의로 정하는 것보다 전체 다 갖다놓고 30개까지만 선택할 수 있게 하는게 나을듯
  return (
    <>
      <svg id="tree-chart" ref={chartSvg}>
        <svg id="chart-area"></svg>
      </svg>
    </>
  )
}
