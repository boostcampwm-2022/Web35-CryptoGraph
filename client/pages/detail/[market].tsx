import { styled } from '@mui/material/styles'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import TabContainer from '@/components/TabContainer'
import ChartHeader from '@/components/ChartHeader'
import {
  DEFAULT_CANDLE_CHART_OPTION,
  DEFAULT_CANDLE_PERIOD
} from '@/constants/ChartConstants'
import { CandleChartOption, CandleData } from '@/types/ChartTypes'
import { getCandleDataArray } from '@/utils/upbitManager'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { CandleChart } from '@/components/Candlechart'
import { useRealTimeUpbitData } from 'hooks/useRealTimeUpbitData'
import { useEffect, useState } from 'react'
import CoinDetailedInfo from '@/components/CoinDetailedInfo'
import RealTimeCoinPrice from '@/components/RealTimeCoinPrice'
import LinkButton from '@/components/LinkButton'
import { getPriceInfo } from '@/utils/apiManager'
import { CoinPriceObj } from '@/types/CoinPriceTypes'
import SwipeableTemporaryDrawer from '@/components/SwiperableDrawer'
import TabBox from '@/components/TabBox'
export default function Detail({
  market,
  candleData,
  priceInfo
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const theme = useTheme()
  const [candleChartOption, setCandleChartOption] = useState<CandleChartOption>(
    {
      ...DEFAULT_CANDLE_CHART_OPTION,
      marketType: market
    }
  )
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))
  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false)
  const [selectedTab, setSelectedTab] = useState<number>(0)
  useEffect(() => {
    setCandleChartOption(prev => {
      return { ...prev, marketType: market }
    })
  }, [market])

  const [realtimeCandleData, setRealtimeCandleData, realtimePriceInfo] =
    useRealTimeUpbitData(candleChartOption, candleData, priceInfo)
  return (
    <HomeContainer>
      <ChartAreaContainer>
        <ChartHeader
          chartOption={candleChartOption}
          chartOptionSetter={setCandleChartOption}
          coinPriceInfo={realtimePriceInfo[market]}
        />
        <Box
          sx={{
            mt: '8px',
            height: isMobile ? 'calc(100% - 150px)' : '90%',
            backgroundColor: '#ffffff'
          }}
        >
          <CandleChart
            chartOption={candleChartOption}
            candleData={realtimeCandleData}
            candleDataSetter={setRealtimeCandleData}
          />
        </Box>
      </ChartAreaContainer>
      <InfoContainer>
        {isMobile ? (
          <SwipeableTemporaryDrawer
            buttonLabel="코인 상세 정보"
            isDrawerOpened={isDrawerOpened}
            setIsDrawerOpened={setIsDrawerOpened}
          >
            <TabContainer
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            >
              <TabBox tabLabelInfo={'코인 디테일'}>
                <CoinDetailedInfo market={market} />
                <LinkButton goto="/" content="Go to Main" />
              </TabBox>
              <RealTimeCoinPrice
                tabLabelInfo={'실시간 코인 정보'}
                priceInfo={realtimePriceInfo}
              />
            </TabContainer>
          </SwipeableTemporaryDrawer>
        ) : (
          <>
            <CoinDetailedInfo market={market} />
            <RealTimeCoinPrice priceInfo={realtimePriceInfo} />
            <LinkButton goto="/" content="Go to Main" />
          </>
        )}
      </InfoContainer>
    </HomeContainer>
  )
}

interface CandleChartPageProps {
  market: string
  candleData: CandleData[]
  priceInfo: CoinPriceObj
} //페이지 자체의 props interface
export const getServerSideProps: GetServerSideProps<
  CandleChartPageProps
> = async context => {
  if (context.params === undefined) {
    return {
      notFound: true
    }
  }

  const market = Array.isArray(context.params.market)
    ? context.params.market[0].toUpperCase()
    : context.params.market?.toUpperCase()

  if (!market) {
    return {
      notFound: true
    }
  }

  const fetchedCandleData: CandleData[] | null = await getCandleDataArray(
    DEFAULT_CANDLE_PERIOD,
    market,
    200
  )
  if (fetchedCandleData === null) {
    return {
      notFound: true
    }
  }

  const priceInfo: CoinPriceObj = await getPriceInfo()
  if (priceInfo === null) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      market: market,
      candleData: fetchedCandleData,
      priceInfo: priceInfo
    } // will be passed to the page component as props
  }
}

const HomeContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
  max-width: 1920px;
  ${props => props.theme.breakpoints.down('tablet')} {
    align-items: center;
    flex-direction: column;
  }
  ${props => props.theme.breakpoints.up('tablet')} {
    max-height: 1080px;
    min-height: 500px;
  }
`
//왼쪽 메인차트
const ChartAreaContainer = styled('div')`
  display: flex;
  box-sizing: content-box;
  width: 100%;
  height: 100%;
  min-width: 350px;
  flex-direction: column;
`

//오른쪽 정보 표시 사이드바
const InfoContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  min-width: 400px;
  height: 100%;
  margin-left: 8px;
  ${props => props.theme.breakpoints.down('tablet')} {
    height: auto;
    margin: 0;
    width: 100%; //매직넘버 제거 및 반응형 관련 작업 필요(모바일에서는 100%)
  }
`
