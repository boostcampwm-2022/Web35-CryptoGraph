import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { CandleData, ChartPeriod, ChartRenderOption } from '@/types/ChartTypes'
import { CandleChart } from 'components/CandleChart'
import {
  DEFAULT_CANDLER_CHART_RENDER_OPTION,
  DEFAULT_CANDLE_PERIOD
} from '@/constants/ChartConstants'
import { getCandleDataArray } from '@/utils/upbitManager'
import { useRealTimeUpbitData } from 'hooks/useRealTimeUpbitData'
import { useState } from 'react'
export default function CandleChartPage({
  candleData
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [candlePeriod, setCandlePeriod] = useState<ChartPeriod>(
    DEFAULT_CANDLE_PERIOD
  )
  const [chartRenderOption, setRenderOption] = useState<ChartRenderOption>(
    DEFAULT_CANDLER_CHART_RENDER_OPTION
  )
  const [setRealtimeCandleData, realtimeCandleData] = useRealTimeUpbitData(
    candlePeriod,
    chartRenderOption.marketType, //파싱
    candleData
  ) //얘가 가공해서 준다.
  return (
    <div>
      <CandleChart
        candleData={realtimeCandleData}
        candleDataSetter={setRealtimeCandleData}
        option={chartRenderOption}
        optionSetter={setRenderOption}
      ></CandleChart>
      <div
        onClick={() => {
          setCandlePeriod(prev => {
            return prev == 'minutes/1' ? 'minutes/60' : 'minutes/1'
          })
        }}
        style={{ fontSize: '2rem' }}
      >
        {candlePeriod}분봉
      </div>
    </div>
  )
}

interface CandleChartPageProps {
  candleData: CandleData[]
} //페이지 자체의 props interface
export const getServerSideProps: GetServerSideProps<
  CandleChartPageProps
> = async context => {
  const fetched: CandleData[] = await getCandleDataArray(
    DEFAULT_CANDLE_PERIOD,
    DEFAULT_CANDLER_CHART_RENDER_OPTION.marketType,
    200
  )
  const toret: CandleChartPageProps = {
    candleData: fetched
  } //이것도 함수로 뽑아내는게 나을듯?
  return {
    props: toret // will be passed to the page component as props
  }
}
