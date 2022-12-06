import * as React from 'react'
import {
  CandleData,
  ChartRenderOption,
  PointerPosition
} from '@/types/ChartTypes'
import {
  checkNeedPastFetch,
  goToPast,
  checkNeedFutureFetch,
  goToFuture
} from '@/utils/chartManager'
import {
  DEFAULT_CANDLE_PERIOD,
  DEFAULT_POINTER_POSITION,
  DEFAULT_CANDLE_COUNT,
  DEFAULT_MAX_CANDLE_DOM_ELEMENT_COUNT
} from '@/constants/ChartConstants'
import { makeDate } from '@/utils/dateManager'
import { getCandleDataArray } from '@/utils/upbitManager'
import { useWindowSize } from 'hooks/useWindowSize'
import { ChartPeriod } from '@/types/ChartTypes'
import { styled } from '@mui/material'
import { initCandleChart, updateCandleChart } from './chartController'
export interface CandleChartProps {
  candlePeriod: ChartPeriod
  candleData: CandleData[]
  candleDataSetter: React.Dispatch<React.SetStateAction<CandleData[]>>
  option: ChartRenderOption
  optionSetter: React.Dispatch<React.SetStateAction<ChartRenderOption>>
}

export const CandleChart: React.FunctionComponent<CandleChartProps> = props => {
  const chartSvg = React.useRef<SVGSVGElement>(null)
  const chartContainerRef = React.useRef<HTMLDivElement>(null)
  const windowSize = useWindowSize(chartContainerRef)
  const [pointerInfo, setPointerInfo] = React.useState<PointerPosition>(
    DEFAULT_POINTER_POSITION
  )
  const isFetching = React.useRef(false)

  React.useEffect(() => {
    initCandleChart(chartSvg, props.optionSetter, setPointerInfo, windowSize)
  }, [windowSize, props.optionSetter])

  React.useEffect(() => {
    //디바운싱 구문
    const { result, willFetch } = checkNeedPastFetch(
      props.candleData,
      props.option
    )
    //-----------------------좌측(과거)으로 이동-----------------------
    if (result) {
      //디바운싱
      if (!isFetching.current) {
        if (
          !willFetch &&
          props.candleData.length - props.option.DomElementStartIndex >
            DEFAULT_MAX_CANDLE_DOM_ELEMENT_COUNT
        ) {
          props.optionSetter(goToPast(props, windowSize))
          return
        }
        //fetching중인데 한번더 요청이 일어나면 추가fetch 작동하지않음
        isFetching.current = true
        //추가적인 candleData Fetch
        getCandleDataArray(
          DEFAULT_CANDLE_PERIOD,
          props.option.marketType,
          DEFAULT_CANDLE_COUNT,
          makeDate(
            //endTime설정
            props.candleData[props.candleData.length - 1].timestamp,
            60
          )
            .toJSON()
            .slice(0, -5)
            .concat('Z')
            .replaceAll(':', '%3A') //업비트 쿼리문 규칙
        ).then(res => {
          //fetch완료된 newData를 기존 data와 병합
          if (res === null) {
            console.error('코인 쿼리 실패, 404에러')
            return
          }
          isFetching.current = false
          props.candleDataSetter(prev => [...prev, ...res])
          if (
            props.candleData.length - props.option.DomElementStartIndex >
            DEFAULT_MAX_CANDLE_DOM_ELEMENT_COUNT
          ) {
            props.optionSetter(goToPast(props, windowSize))
          }
        })
      }
      return
    }
    //-----------------------우측(미래)으로 이동-----------------------
    if (checkNeedFutureFetch(props.candleData, props.option)) {
      props.optionSetter(goToFuture(props, windowSize))
      return
    }

    updateCandleChart(
      chartSvg,
      props.candleData,
      props.option,
      pointerInfo,
      windowSize
    )
  }, [props, pointerInfo, windowSize])

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
