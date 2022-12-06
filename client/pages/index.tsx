import { useState } from 'react'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import CoinSelectController from '@/components/CoinSelectController'
import TreeChart from '@/components/Treechart'
import { RunningChart } from '@/components/Runningchart'
import { ChartType } from '@/types/ChartTypes'
import ChartSelectController from '@/components/ChartSelectController'
import { MarketCapInfo } from '@/types/CoinDataTypes'
import { getMarketCapInfo } from '@/utils/metaDataManages'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useMediaQuery } from '@mui/material'
import SwipeableTemporaryDrawer from '@/components/SwiperableDrawer'
import InfoContainerMobile from '@/components/InfoContainerMobile'
import CoinDetailedInfo from '@/components/CoinDetailedInfo'
import { CoinRateType, CoinRateContentType } from '@/types/ChartTypes'
import useInterval from '@/hooks/useInterval'
import { updateTreeData } from '@/components/Treechart/getCoinData'

const coinIntervalRate = 5000

const getInitData = (data: MarketCapInfo[]): CoinRateType => {
  //initData
  const initData: CoinRateType = {}
  data.forEach(coinData => {
    const coinContent: CoinRateContentType = {
      name: '',
      ticker: '',
      parent: '',
      value: 0
    }
    coinContent.name = coinData.name_kr
    coinContent.ticker = 'KRW-' + coinData.name
    coinContent.parent = 'Origin'
    coinContent.value = Number((coinData.signed_change_rate * 100).toFixed(2))
    initData[coinContent.ticker] = coinContent
  })

  return initData
}

interface getDataProps {
  data: MarketCapInfo[]
  Market?: string[] //선택된 코인 리스트
}

const dataMarket = (data: MarketCapInfo[]): string[] => {
  // initMarket
  return data.map(coin => coin.name)
}

export default function Home({
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [selectedChart, setSelectedChart] = useState<ChartType>('RunningChart')
  const [selectedMarket, setSelectedMarket] = useState<string[]>(
    dataMarket(data)
  ) //선택된 market 컨트롤
  const [coinData, setCoinData] = useState<CoinRateType>(getInitData(data))
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))
  useInterval(() => {
    async function update() {
      const updatedCoinRate = await updateTreeData(coinData)
      setCoinData(updatedCoinRate)
    }
    update()
  }, coinIntervalRate)

  return (
    <HomeContainer>
      {isMobile ? (
        <Box sx={{ position: 'absolute' }}>
          <SwipeableTemporaryDrawer>
            <InfoContainerMobile>
              <ChartSelectController
                selected={selectedChart}
                selectedSetter={setSelectedChart}
                tabLabelInfo={'차트 선택'}
              />
              <CoinSelectController
                selectedCoinList={selectedMarket}
                selectedCoinListSetter={setSelectedMarket}
                tabLabelInfo={'코인 선택'}
              />
              <CoinDetailedInfo
                market="btc"
                tabLabelInfo={'상세 정보'}
              ></CoinDetailedInfo>
            </InfoContainerMobile>
          </SwipeableTemporaryDrawer>
        </Box>
      ) : (
        <SideBarContainer>
          <ChartSelectController
            selected={selectedChart}
            selectedSetter={setSelectedChart}
          />
          <Box sx={{ width: '100%', height: '60%' }}>
            <CoinSelectController
              selectedCoinList={selectedMarket}
              selectedCoinListSetter={setSelectedMarket}
            />
          </Box>
          <Box sx={{ width: '100%', height: '30%' }}>
            <CoinDetailedInfo market="btc"></CoinDetailedInfo>
          </Box>
        </SideBarContainer>
      )}
      {selectedMarket.length !== 0 ? (
        <ChartContainer>
          {selectedChart === 'RunningChart' ? (
            <RunningChart
              candleCount={20}
              data={coinData}
              Market={selectedMarket}
            />
          ) : (
            <TreeChart data={coinData} Market={selectedMarket} />
          )}
        </ChartContainer>
      ) : (
        '선택된 코인이 없습니다.' // 괜찮은 이미지 추가하면 좋을듯
      )}
    </HomeContainer>
  )
}

//솔직히 서버사이드 프롭스 없애는게 낫지 않나 싶음..
export const getServerSideProps: GetServerSideProps<
  getDataProps
> = async () => {
  const fetchedData: MarketCapInfo[] | null = await getMarketCapInfo()
  return {
    props: {
      data: fetchedData === null ? [] : fetchedData
    }
  }
}

const HomeContainer = styled('div')`
  display: flex;
  width: 100%;
  max-width: 1920px;
  height: 100%;
  align-items: center;
  ${props => props.theme.breakpoints.down('tablet')} {
    flex-direction: column-reverse;
  }
`
const SideBarContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 1rem;
  align-items: center;
  width: 500px;
  height: 100%;
  ${props => props.theme.breakpoints.down('tablet')} {
    width: 100%; //매직넘버 제거 및 반응형 관련 작업 필요(모바일에서는 100%)
    height: 100px;
  }
`
const ChartContainer = styled(Box)`
  display: flex;
  box-sizing: content-box; //얘가 차트 크기를 고정해준다. 이유는 아직 모르겠다..
  min-width: 300px;
  width: 100%;
  height: 100%;
  flex-direction: column;
`
