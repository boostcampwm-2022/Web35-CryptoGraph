import { useRef, useState, useEffect } from 'react'
import {
  CandleChartOption,
  CandleChartRenderOption,
  CandleData,
  PointerPosition
} from '@/types/ChartTypes'
import { checkNeedFetch } from '@/utils/chartManager'
import {
  DEFAULT_POINTER_POSITION,
  DEFAULT_CANDLE_COUNT,
  DEFAULT_CANDLE_CHART_RENDER_OPTION
} from '@/constants/ChartConstants'
import { getCandleDataArray } from '@/utils/upbitManager'
import { useWindowSize } from 'hooks/useWindowSize'
import { styled } from '@mui/material'
import { initCandleChart, updateCandleChart } from './chartController'
export interface CandleChartProps {
  // candlePeriod: ChartPeriod
  chartOption: CandleChartOption
  candleData: CandleData[]
  candleDataSetter: React.Dispatch<React.SetStateAction<CandleData[]>>
  // marketType: string
}

export const CandleChart: React.FunctionComponent<CandleChartProps> = props => {
  const chartSvg = useRef<SVGSVGElement>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const windowSize = useWindowSize(chartContainerRef)
  const [option, optionSetter] = useState<CandleChartRenderOption>({
    ...DEFAULT_CANDLE_CHART_RENDER_OPTION
  })
  const [translateX, setTranslateX] = useState<number>(0)
  const [pointerInfo, setPointerInfo] = useState<PointerPosition>(
    DEFAULT_POINTER_POSITION
  )
  const isFetching = useRef(false)

  // useEffect(() => {
  //   optionSetter({
  //     ...DEFAULT_CANDLE_CHART_RENDER_OPTION,
  //     marketType: props.marketType
  //   })
  // }, [props.marketType])

  useEffect(() => {
    initCandleChart(chartSvg, optionSetter, setPointerInfo, windowSize)
  }, [windowSize, optionSetter])

  useEffect(() => {
    const needFetch = checkNeedFetch(props.candleData, option)
    if (needFetch) {
      if (!isFetching.current) {
        isFetching.current = true
        getCandleDataArray(
          props.chartOption.candlePeriod,
          props.chartOption.marketType,
          DEFAULT_CANDLE_COUNT,
          props.candleData[props.candleData.length - 1].timestamp
        ).then(res => {
          //fetch완료된 newData를 기존 data와 병합
          if (res === null) {
            console.error('코인 쿼리 실패, 404에러')
            return
          }
          isFetching.current = false
          props.candleDataSetter(prev => [...prev, ...res])
        })
      }
      return
    }
    updateCandleChart(
      chartSvg,
      props.candleData,
      option,
      pointerInfo,
      windowSize,
      props.chartOption.candlePeriod
    )
  }, [props, option, pointerInfo, windowSize])

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
          <svg id="volume-UI"></svg>
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
