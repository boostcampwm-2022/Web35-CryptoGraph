import { styled } from '@mui/material/styles'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import TabContainer from '@/components/TabContainer'
import InfoSidebarContainer from '@/components/InfoSidebarContainer'
import ChartHeader from '@/components/ChartHeader'
import {
  DEFAULT_CANDLE_PERIOD,
  DEFAULT_CANDLER_CHART_RENDER_OPTION
} from '@/constants/ChartConstants'
import { CandleData, ChartPeriod, ChartRenderOption } from '@/types/ChartTypes'
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
import { useURL } from '@/hooks/useURL'
export default function Detail({
  market,
  candleData,
  priceInfo
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const theme = useTheme()
  const marketParsedInURL = useURL(market)
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))

  const [chartRenderOption, setRenderOption] = useState<ChartRenderOption>({
    ...DEFAULT_CANDLER_CHART_RENDER_OPTION,
    marketType: market
  })
  useEffect(() => {
    setRenderOption(prev => {
      return { ...prev, marketType: marketParsedInURL }
    })
  }, [marketParsedInURL])
  const [candlePeriod, setCandlePeriod] = useState<ChartPeriod>(
    DEFAULT_CANDLE_PERIOD
  )
  const [realtimeCandleData, setRealtimeCandleData, realtimePriceInfo] =
    useRealTimeUpbitData(
      candlePeriod,
      chartRenderOption.marketType,
      candleData,
      priceInfo
    )
  return (
    <HomeContainer>
      <ChartAreaContainer>
        <ChartHeader
          selected={candlePeriod}
          selectedSetter={setCandlePeriod}
          coinPriceInfo={realtimePriceInfo[market]}
        />
        <Box sx={{ height: '90%', paddingTop: '8px' }}>
          <CandleChart
            candlePeriod={candlePeriod}
            candleData={realtimeCandleData}
            candleDataSetter={setRealtimeCandleData}
            option={chartRenderOption}
            optionSetter={setRenderOption}
          ></CandleChart>
        </Box>
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
            <TabContainer>
              <CoinDetailedInfo market={market} tabLabelInfo={'코인 디테일'} />
              <RealTimeCoinPrice
                tabLabelInfo={'실시간 코인 정보'}
                priceInfo={realtimePriceInfo}
              />
            </TabContainer>
            <LinkButton goto="/" content="Go to Main" />
          </Box>
        ) : (
          <InfoSidebarContainer>
            <CoinDetailedInfo market={market} />
            <RealTimeCoinPrice priceInfo={realtimePriceInfo} />
          </InfoSidebarContainer>
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
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  const market = Array.isArray(context.params.market)
    ? context.params.market[0].toUpperCase()
    : context.params.market?.toUpperCase()

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

  const priceInfo: CoinPriceObj = await getPriceInfo()
  if (priceInfo === null) {
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
`
//왼쪽 메인차트
const ChartAreaContainer = styled('div')`
  display: flex;
  box-sizing: content-box;
  width: 100%;
  height: 100%;
  min-width: 350px;
  flex-direction: column;
  ${props => props.theme.breakpoints.up('tablet')} {
    max-height: 1080px;
  }
`

//오른쪽 정보 표시 사이드바
const InfoContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  min-width: 400px;
  height: 100%;
  ${props => props.theme.breakpoints.down('tablet')} {
    height: auto;
    margin: 0;
    width: 100%; //매직넘버 제거 및 반응형 관련 작업 필요(모바일에서는 100%)
  }
`
