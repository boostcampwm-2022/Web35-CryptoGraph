import { useRef, useState, useEffect } from 'react'
import {
  CandleChartOption,
  CandleChartRenderOption,
  CandleData,
  PointerData
} from '@/types/ChartTypes'
import {
  // calculateCandlewidth,
  checkNeedFetch,
  getRenderOption,
  updatePointerUI
} from '@/utils/chartManager'
import {
  DEFAULT_POINTER_DATA,
  DEFAULT_CANDLE_COUNT,
  MAX_FETCH_CANDLE_COUNT
} from '@/constants/ChartConstants'
import { getCandleDataArray } from '@/utils/upbitManager'
import { useWindowSize } from 'hooks/useWindowSize'
import { styled } from '@mui/material'
import {
  initCandleChart,
  translateCandleChart,
  updateCandleChart
} from './chartController'
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
  // 렌더링에 관여하는 모든 속성들
  const [option, setOption] = useState<CandleChartRenderOption>(
    getRenderOption(windowSize.width)
  )
  // 캔들유닛들이 얼마나 translate되어있는지 분리
  const [translateX, setTranslateX] = useState<number>(0)
  const [pointerInfo, setPointerInfo] =
    useState<PointerData>(DEFAULT_POINTER_DATA)
  const isFetching = useRef(false)

  // useEffect(() => {
  //   optionSetter({
  //     ...DEFAULT_CANDLE_CHART_RENDER_OPTION,
  //     marketType: props.marketType
  //   })
  // }, [props.marketType])

  // 차트 초기화 차트 구성요소 크기지정 및 렌더링 옵션 지정(창의 크기에 맞추어 변경)
  useEffect(() => {
    initCandleChart(
      chartSvg,
      setTranslateX,
      setOption,
      setPointerInfo,
      windowSize
    )
    setOption(getRenderOption(windowSize.width))
  }, [windowSize])

  // translateX의 변경에 따라 기존의 문서요소들을 이동만 시킨다.
  useEffect(() => {
    // const candleWidth = Math.ceil(windowSize.width / option.renderCandleCount)
    if (translateX < 0) {
      if (option.renderStartDataIndex === 0) {
        setTranslateX(0)
        return
      }
      setTranslateX(prev => option.candleWidth + (prev % option.candleWidth))
      setOption(prev => {
        const newOption = { ...prev }
        newOption.renderStartDataIndex = Math.max(
          newOption.renderStartDataIndex +
            Math.floor(translateX / option.candleWidth),
          0
        )
        return newOption
      })
      return
    }
    if (translateX >= option.candleWidth) {
      setTranslateX(prev => prev % option.candleWidth)
      setOption(prev => {
        const newOption = { ...prev }
        newOption.renderStartDataIndex += Math.floor(
          translateX / option.candleWidth
        )
        return newOption
      })
      return
    }
    translateCandleChart(chartSvg, translateX)
  }, [translateX, windowSize, option])

  // 문서요소들을 다시 join해야할때
  // 더 최적화하려면 소켓을 통해 들어오는 0번 데이터 처리하기
  useEffect(() => {
    const needFetch = checkNeedFetch(props.candleData, option)
    if (needFetch) {
      console.log('fetching at ', props.candleData.length, isFetching.current)
      if (!isFetching.current) {
        isFetching.current = true
        getCandleDataArray(
          props.chartOption.candlePeriod,
          props.chartOption.marketType,
          MAX_FETCH_CANDLE_COUNT,
          props.candleData[props.candleData.length - 1].timestamp
        ).then(res => {
          //fetch완료된 newData를 기존 data와 병합
          if (res === null) {
            console.error('코인 쿼리 실패, 404에러')
            return
          }
          console.log(
            props.candleData[props.candleData.length - 1].candle_date_time_kst
          )
          console.log(res[0].candle_date_time_kst)
          isFetching.current = false
          props.candleDataSetter(prev => {
            const lastDate = new Date(
              prev[prev.length - 1].candle_date_time_kst
            )
            const newDate = new Date(res[0].candle_date_time_kst)
            console.log(lastDate, newDate)
            if (newDate <= lastDate) {
              return [...prev, ...res]
            }
            return [...prev, ...res]
          })
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
      props.chartOption.candlePeriod,
      translateX
    )
    // }, [props, option, pointerInfo, windowSize])
  }, [props, option, windowSize])

  useEffect(() => {
    updatePointerUI(
      pointerInfo,
      option,
      props.candleData,
      windowSize,
      props.chartOption.candlePeriod
    )
  }, [pointerInfo, windowSize, option, props])

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
