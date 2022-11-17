import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { CandleData } from '@/types/ChartTypes'
import { CandleChart } from 'components/CandleChart'
import { DEFAULT_CANDLE_CHART_OPTION } from '../../../constants/ChartConstants'
import { getCandleDataArray } from '@/utils/upbitManager'
import { useRealTimeUpbitData } from 'hooks/useRealTimeUpbitData'
export default function CandleChartPage({
  candleData
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const realtimeCandleData = useRealTimeUpbitData('BTC', candleData) //얘가 가공해서 준다.
  return (
    <div>
      <CandleChart
        candleData={realtimeCandleData}
        option={DEFAULT_CANDLE_CHART_OPTION}
      ></CandleChart>
    </div>
  )
}

interface CandleChartPageProps {
  candleData: CandleData[]
} //페이지 자체의 props interface
export const getServerSideProps: GetServerSideProps<
  CandleChartPageProps
> = async context => {
  const fetched: CandleData[] = await getCandleDataArray()
  const toret: CandleChartPageProps = {
    candleData: fetched
  } //이것도 함수로 뽑아내는게 나을듯?
  return {
    props: toret // will be passed to the page component as props
  }
}
