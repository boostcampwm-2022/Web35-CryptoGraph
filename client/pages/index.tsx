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

export default function Home() {
  const data = useContext(MyAppContext)
  const [selectedChart, setSelectedChart] = useState<ChartType>('RunningChart')
  const [selectedMarket, setSelectedMarket] = useState<string[]>(
    data.map(coin => coin.name)
  ) //선택된 market 컨트롤
  const [selectedSort, setSelectedSort] = useState<string>('descending')
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

  return (
    <HomeContainer>
      {isMobile ? (
        <Box sx={{ position: 'absolute' }}>
          <SwipeableTemporaryDrawer>
            <TabContainer>
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
                selectedCoinListSetter={setSelectedMarket}
                tabLabelInfo={'코인 선택'}
              />
              <CoinDetailedInfo
                market="btc"
                tabLabelInfo={'상세 정보'}
              ></CoinDetailedInfo>
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
            <CoinSelectController selectedCoinListSetter={setSelectedMarket} />
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
              candleCount={selectedMarket.length}
              durationPeriod={500}
              data={coinData}
              Market={selectedMarket}
              selectedSort={selectedSort}
            />
          ) : (
            <TreeChart
              data={coinData}
              Market={selectedMarket}
              selectedSort={selectedSort}
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
