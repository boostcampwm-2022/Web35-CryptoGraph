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
          setSelectedTab(3)
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
            isDrawerOpened={isDrawerOpened}
            setIsDrawerOpened={setIsDrawerOpened}
          >
            <TabContainer
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            >
              <ChartSelectController
                selected={selectedChart}
                selectedSetter={setSelectedChart}
                tabLabelInfo={'차트 선택'}
              />
              <SortSelectController
                selectedSort={selectedSort}
                selectedSortSetter={setSelectedSort}
                selectedChart={selectedChart}
                tabLabelInfo={'정렬 기준'}
              />
              <CoinSelectController
                selectedCoinListSetter={setSelectedMarketList}
                tabLabelInfo={'코인 선택'}
              />
              <Box>
                <CoinDetailedInfo
                  market={selectedMarket}
                  tabLabelInfo={'상세 정보'}
                ></CoinDetailedInfo>
                <LinkButton
                  goto={`detail/${selectedMarket}`}
                  content={`${selectedMarket}(으)로 바로가기`}
                />
              </Box>
            </TabContainer>
          </SwipeableTemporaryDrawer>
        </Box>
      ) : (
        <SideBarContainer>
          <ChartSelectController
            selected={selectedChart}
            selectedSetter={setSelectedChart}
          />
          <SortSelectController
            selectedSort={selectedSort}
            selectedSortSetter={setSelectedSort}
            selectedChart={selectedChart}
          />
          <Box sx={{ width: '100%', height: '60%' }}>
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
      {selectedMarketList.length !== 0 ? (
        <ChartContainer>
          {selectedChart === 'RunningChart' ? (
            <RunningChart
              candleCount={selectedMarketList.length}
              durationPeriod={500}
              data={coinData}
              Market={selectedMarketList}
              selectedSort={selectedSort}
              modalOpenHandler={chartNodeHandler}
            />
          ) : (
            <TreeChart
              data={coinData}
              Market={selectedMarketList}
              selectedSort={selectedSort}
              modalOpenHandler={chartNodeHandler}
            />
          )}
        </ChartContainer>
      ) : (
        '선택된 코인이 없습니다.' // 괜찮은 이미지 추가하면 좋을듯
      )}
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
  padding: 0 1rem;
  align-items: center;
  min-width: 330px;
  max-width: 330px;
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
