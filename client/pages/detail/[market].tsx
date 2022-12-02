import { styled } from '@mui/material/styles'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import InfoContainerMobile from '@/components/InfoContainerMobile'
import InfoContainerDesktop from '@/components/InfoContainerDesktop'
import ChartPeriodSelector from '@/components/ChartPeriodSelector'
import {
  DEFAULT_CANDLE_PERIOD,
  DEFAULT_CANDLER_CHART_RENDER_OPTION
} from '@/constants/ChartConstants'
import { CandleData, ChartPeriod, ChartRenderOption } from '@/types/ChartTypes'
import { getCandleDataArray } from '@/utils/upbitManager'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { CandleChart } from '@/components/Candlechart'
import { useRealTimeUpbitData } from 'hooks/useRealTimeUpbitData'
import { useState } from 'react'
import CoinDetailedInfo from '@/components/CoinDetailedInfo'
import RealTimeCoinPrice from '@/components/RealTimeCoinPrice'
import LinkButton from '@/components/LinkButton'
export default function Detail({
  market,
  candleData
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))
  const [chartRenderOption, setRenderOption] = useState<ChartRenderOption>({
    ...DEFAULT_CANDLER_CHART_RENDER_OPTION,
    marketType: market
  })
  const [candlePeriod, setCandlePeriod] = useState<ChartPeriod>(
    DEFAULT_CANDLE_PERIOD
  )
  const [realtimeCandleData, setRealtimeCandleData] = useRealTimeUpbitData(
    candlePeriod,
    chartRenderOption.marketType,
    candleData
  )
  return (
    <HomeContainer>
      <ChartAreaContainer>
        <ChartPeriodSelector
          selected={candlePeriod}
          selectedSetter={setCandlePeriod}
        />
        <CandleChart
          candlePeriod={candlePeriod}
          candleData={realtimeCandleData}
          candleDataSetter={setRealtimeCandleData}
          option={chartRenderOption}
          optionSetter={setRenderOption}
        ></CandleChart>
      </ChartAreaContainer>
      <InfoContainer>
        {isMobile ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%'
            }}
          >
            <InfoContainerMobile>
              <CoinDetailedInfo market={market} tabLabelInfo={'코인 디테일'} />
              <RealTimeCoinPrice tabLabelInfo={'실시간 코인 정보'} />
            </InfoContainerMobile>
            <LinkButton goto="/" content="Go to Main" />
          </Box>
        ) : (
          <InfoContainerDesktop>
            <CoinDetailedInfo market={market} />
            <RealTimeCoinPrice />
          </InfoContainerDesktop>
        )}
      </InfoContainer>
    </HomeContainer>
  )
}

interface CandleChartPageProps {
  market: string
  candleData: CandleData[]
} //페이지 자체의 props interface
export const getServerSideProps: GetServerSideProps<
  CandleChartPageProps
> = async context => {
  if (context.params === undefined) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  const market = Array.isArray(context.params.market)
    ? context.params.market[0]
    : context.params.market

  if (!market) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  const fetchedCandleData: CandleData[] | null = await getCandleDataArray(
    DEFAULT_CANDLE_PERIOD,
    market,
    200
  )
  if (fetchedCandleData === null) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }
  return {
    props: {
      market: market,
      candleData: fetchedCandleData
    } // will be passed to the page component as props
  }
}

const HomeContainer = styled(Box)`
  display: flex;
  width: 100%;
  max-width: 1920px;
  ${props => props.theme.breakpoints.down('tablet')} {
    align-items: center;
    flex-direction: column;
  }
`
//왼쪽 메인차트
const ChartAreaContainer = styled('div')`
  display: flex;
  box-sizing: content-box;
  min-width: 300px;
  width: 100%;
  flex-direction: column;
  ${props => props.theme.breakpoints.up('tablet')} {
    height: 90%; //분봉선택바가 10%이다.
    max-height: 1080px;
  }
`

//오른쪽 정보 표시 사이드바
const InfoContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 390px;
  height: calc(100% - 48px);
  ${props => props.theme.breakpoints.down('tablet')} {
    height: auto;
    margin: 0;
    width: 100%; //매직넘버 제거 및 반응형 관련 작업 필요(모바일에서는 100%)
  }
`
