import { styled } from '@mui/material/styles'
import { Box, Button, useMediaQuery, useTheme } from '@mui/material'
import MobileInfo from '@/components/Tab'
import Link from 'next/link'
import Chartbutton from '@/components/ChartButton'
import { useRouter } from 'next/router'
import {
  DEFAULT_CANDLE_PERIOD,
  DEFAULT_CANDLER_CHART_RENDER_OPTION
} from '@/constants/ChartConstants'
import { CandleData, ChartPeriod, ChartRenderOption } from '@/types/ChartTypes'
import { getCandleDataArray } from '@/utils/upbitManager'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { CandleChart } from '@/components/CandleChart'
import { useRealTimeUpbitData } from 'hooks/useRealTimeUpbitData'
import { useState } from 'react'

export default function Detail({
  candleData
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))
  const router = useRouter()
  const { id } = router.query
  const [candlePeriod, setCandlePeriod] = useState<ChartPeriod>(
    DEFAULT_CANDLE_PERIOD
  )
  const [chartRenderOption, setRenderOption] = useState<ChartRenderOption>(
    DEFAULT_CANDLER_CHART_RENDER_OPTION
  )
  const [realtimeCandleData, setRealtimeCandleData] = useRealTimeUpbitData(
    candlePeriod,
    chartRenderOption.marketType, //파싱
    candleData
  )
  return (
    <HomeContainer>
      <ChartContainer>
        차트공간
        <ChartPeriodSelectorContainer>
          <Chartbutton />
        </ChartPeriodSelectorContainer>
        <StyledChart>
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
        </StyledChart>
      </ChartContainer>
      <InfoContainer>
        {isMobile ? <MobileInfo /> : renderDesktopInfo()}
      </InfoContainer>
    </HomeContainer>
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
  console.log(context.query)
  //여기서 커팅
  const toret: CandleChartPageProps = {
    candleData: fetched
  } //이것도 함수로 뽑아내는게 나을듯?
  return {
    props: toret // will be passed to the page component as props
  }
}

function renderDesktopInfo() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <StyledRTV>실시간 코인시세</StyledRTV>
      <StyledRTV>코인 상세정보</StyledRTV>
      <Link href="/">
        <Button
          style={{ minWidth: '100px', width: '100%' }}
          size="large"
          variant="contained"
        >
          Go To Main
        </Button>
      </Link>
    </div>
  )
}

const HomeContainer = styled(Box)`
  width: 100%;
  max-width: 1920px;
  height: 100%;
  display: flex;
  align-items: center;
  ${props => props.theme.breakpoints.down('tablet')} {
    flex-direction: column;
  }
`
//왼쪽 메인차트
const ChartContainer = styled('div')`
  display: flex;
  box-sizing: content-box;
  width: 100%;
  height: calc(100% - 48px);
  margin: 24px;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid black;
  border-radius: 32px;
  ${props => props.theme.breakpoints.down('tablet')} {
    margin: 0;
  }
`

//오른쪽 정보 표시 사이드바
const InfoContainer = styled(Box)`
  margin: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  border-radius: 32px;
  width: 390px;
  height: calc(100% - 48px);
  ${props => props.theme.breakpoints.down('tablet')} {
    transition: height 0.6s ease-in-out;
    margin: 0;
    width: 100%; //매직넘버 제거 및 반응형 관련 작업 필요(모바일에서는 100%)
    height: calc(70%);
  }
`

const ChartPeriodSelectorContainer = styled('div')`
  width: 100%;
  height: 10%;
  min-height: 55px;
  background-color: #ffffff;
  border: 1px solid #cac4d0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const StyledChart = styled('div')`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border: 1px solid #cac4d0;
  border-radius: 20px;
`

const StyledRTV = styled('div')`
  width: 100%;
  height: 43%;
  background-color: #ffffff;
  border: 1px solid #cac4d0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding-bottom: 24px;
`
