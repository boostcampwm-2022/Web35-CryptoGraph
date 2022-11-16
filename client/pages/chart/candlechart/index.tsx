import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { CandleData } from '@/types/ChartTypes'
import { CandleChart } from 'components/CandleChart'
import { DEFAULT_CANDLE_CHART_OPTION } from '../../../constants/ChartConstants'
import { getCandleDataArray } from '@/utils/upbitManager'
export default function CandleChartPage({
  candleData
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <CandleChart
        candleData={candleData}
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
