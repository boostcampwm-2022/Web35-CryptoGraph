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
import { useState, useEffect, useRef } from 'react'
import useInterval from 'hooks/useInterval'
import { remove } from 'lodash'

const getChangeRate = () =>
  getCandleDataArray('days', DEFAULT_CANDLER_CHART_RENDER_OPTION.marketType, 1)

// set the dimensions and margins of the graph
const margin = { top: 10, right: 10, bottom: 10, left: 300 },
  width = 2400 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom

const updateChart = (svgRef, data) => {
  const chartArea = d3.select('svg#chart-area')
  const test = data => {
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
    let myScale = d3.scaleLinear().domain([min, max]).range([0.5, 1])
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
        return d.x0 + 30
      }) // +10 to adjust position (more right)
      .attr('y', function (d) {
        return d.y0 + 200
      }) // +20 to adjust position (lower)
      .text(function (d) {
        return d.data.name + String(Number(d.data.value).toFixed(2)) + '%'
      })
      .attr('font-size', '40px')
      .attr('fill', 'white')
  }
  test(data)
}

const initChart = svgRef => {
  const chartContainer = d3.select(svgRef.current)
  chartContainer.attr('width', width)
  chartContainer.attr('height', height)
}

export default function TreeChartPage({}: any) {
  const [changeRate, setChangeRate] = useState(0)
  useInterval(() => {
    getChangeRate().then(data => setChangeRate(data[0].change_rate * 100))
  }, 5000)

  const coinRate = [
    { name: 'Origin', parent: '', value: '' },
    {
      name: 'BTC',
      parent: 'Origin',
      value: Number(changeRate) * 1
    },
    {
      name: 'ETH',
      parent: 'Origin',
      value: Number(changeRate) * -2
    },
    {
      name: 'DOG',
      parent: 'Origin',
      value: Number(changeRate) * 3
    }
  ]

  const chartSvg = useRef<SVGSVGElement>(null)
  useEffect(() => {
    initChart(chartSvg)
  }, [])

  useEffect(() => {
    updateChart(chartSvg, coinRate)
  }, [changeRate])

  return (
    <>
      <svg id="tree-chart" ref={chartSvg}>
        <svg id="chart-area"></svg>
      </svg>
    </>
  )
}
