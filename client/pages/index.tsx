import { useState, useEffect, useContext } from 'react'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import CoinSelectController from '@/components/CoinSelectController'
import TreeChart from '@/components/Treechart'
import { RunningChart } from '@/components/Runningchart'
import { ChartType } from '@/types/ChartTypes'
import ChartSelectController from '@/components/ChartSelectController'
import SortSelectController from '@/components/SortSelectController'

import { useMediaQuery } from '@mui/material'
import SwipeableTemporaryDrawer from '@/components/SwiperableDrawer'
import TabContainer from '@/components/TabContainer'
import CoinDetailedInfo from '@/components/CoinDetailedInfo'
import { useRealTimeCoinListData } from '@/hooks/useRealTimeCoinListData'
import { MyAppContext } from './_app'
import MuiModal from '@/components/Modal'
import LinkButton from '@/components/LinkButton'
import TabBox from '@/components/TabBox'
import { NoSelectedCoinAlertView } from '@/components/NoSelectedCoinAlertView'

export default function Home() {
  const data = useContext(MyAppContext)
  const [selectedChart, setSelectedChart] = useState<ChartType>('RunningChart')
  const [selectedMarketList, setSelectedMarketList] = useState<string[]>(
    data.map(coin => coin.name)
  ) //선택된 market 컨트롤
  const [selectedMarket, setSelectedMarket] = useState<string>('btc')
  const [selectedSort, setSelectedSort] = useState<string>('descending')
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false)
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)
  const coinData = useRealTimeCoinListData(data)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))
  useEffect(() => {
    if (selectedChart === 'RunningChart') {
      setSelectedSort('descending')
    } else {
      setSelectedSort('change rate')
    }
  }, [selectedChart])

  const chartNodeHandler = (market: string) => {
    isMobile
      ? (() => {
          setIsDrawerOpened(true)
          setSelectedMarket(market)
          setSelectedTab(2) //코인 상세 정보가 3번째 탭에 위치에 있기 때문에 발생하는 매직 넘버
        })()
      : (() => {
          setIsModalOpened(true)
          setSelectedMarket(market)
        })()
    //모달, drawer, 탭컨테이너의 상태를 모두 page에서 관리해야한다.
    //전역상태관리 있었으면 좋았을지도?
  }
  return (
    <HomeContainer>
      {isMobile ? (
        <Box sx={{ position: 'absolute' }}>
          <SwipeableTemporaryDrawer
            buttonLabel="차트 정보 더보기"
            isDrawerOpened={isDrawerOpened}
            setIsDrawerOpened={setIsDrawerOpened}
          >
            <TabContainer
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            >
              <TabBox tabLabelInfo={'차트 설정'}>
                <Box sx={{ p: '32px' }}>
                  <ChartSelectController
                    selected={selectedChart}
                    selectedSetter={setSelectedChart}
                  />
                  <SortSelectController
                    selectedSort={selectedSort}
                    selectedSortSetter={setSelectedSort}
                    selectedChart={selectedChart}
                  />
                </Box>
              </TabBox>
              <TabBox tabLabelInfo={'코인 선택'}>
                <CoinSelectController
                  selectedCoinListSetter={setSelectedMarketList}
                />
              </TabBox>
              <TabBox tabLabelInfo={'상세 정보'}>
                <CoinDetailedInfo market={selectedMarket}></CoinDetailedInfo>
                <LinkButton
                  goto={`detail/${selectedMarket}`}
                  content={`${selectedMarket}(으)로 바로가기`}
                  style={LinkButtonStyle}
                />
              </TabBox>
            </TabContainer>
          </SwipeableTemporaryDrawer>
        </Box>
      ) : (
        <SideBarContainer sx={{ backgroundColor: '#ffffff' }}>
          <ChartSelectController
            selected={selectedChart}
            selectedSetter={setSelectedChart}
          />
          <SortSelectController
            selectedSort={selectedSort}
            selectedSortSetter={setSelectedSort}
            selectedChart={selectedChart}
          />
          <Box sx={{ width: '100%', height: '80%' }}>
            <CoinSelectController
              selectedCoinListSetter={setSelectedMarketList}
            />
          </Box>
          <MuiModal
            isModalOpened={isModalOpened}
            setIsModalOpened={setIsModalOpened}
          >
            <CoinDetailedInfo market={selectedMarket}></CoinDetailedInfo>
            <LinkButton
              goto={`detail/${selectedMarket}`}
              content={`${selectedMarket}으로 바로가기`}
            />
          </MuiModal>
        </SideBarContainer>
      )}
      <ChartContainer>
        {selectedMarketList.length !== 0 ? (
          <>
            {selectedChart === 'RunningChart' ? (
              <RunningChart
                durationPeriod={500}
                data={coinData}
                Market={selectedMarketList}
                selectedSort={selectedSort}
                modalOpenHandler={chartNodeHandler}
                isMobile={isMobile}
              />
            ) : (
              <TreeChart
                data={coinData}
                Market={selectedMarketList}
                selectedSort={selectedSort}
                modalOpenHandler={chartNodeHandler}
                isMobile={isMobile}
              />
            )}
          </>
        ) : (
          <NoSelectedCoinAlertView />
        )}
      </ChartContainer>
    </HomeContainer>
  )
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
  background-color: #ffffff;
  align-items: center;
  min-width: 330px;
  max-width: 330px;
  height: 100%;
  margin-right: 8px;
  margin-bottom: 8px;
  margin-top: 8px;
  ${props => props.theme.breakpoints.down('tablet')} {
    width: 100%; //매직넘버 제거 및 반응형 관련 작업 필요(모바일에서는 100%)
    height: 100px;
  }
`
const ChartContainer = styled(Box)`
  display: flex;
  background: #ffffff;
  box-sizing: content-box; //얘가 차트 크기를 고정해준다. 이유는 아직 모르겠다..
  min-width: 300px;
  width: 100%;
  height: 100%;
  flex-direction: column;
`
const LinkButtonStyle = { position: 'absolute', bottom: 0 }
