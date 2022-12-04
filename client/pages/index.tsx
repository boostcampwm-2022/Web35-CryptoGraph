import { useState } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import CoinSelectController from '@/components/CoinSelectController'
import TreeChart, { TreeChartProps } from '@/components/Treechart'
import { RunningChart } from '@/components/RunningChart'
import { ChartType } from '@/types/ChartTypes'
import ChartSelectController from '@/components/ChartSelectController'
import { MarketCapInfo } from '@/types/CoinDataTypes'
import { getMarketCapInfo } from '@/utils/metaDataManages'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
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
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 1px solid black;
  border-radius: 32px;
`

export default function Home({
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [selectedChart, setSelectedChart] = useState<ChartType>('RunningChart')
  const [selectedMarket, setSelectedMarket] = useState<string[]>([
    'CELO',
    'ETH',
    'MFT',
    'WEMIX'
  ]) //선택된 market 컨트롤
  return (
    <HomeContainer>
      <SideBarContainer>
        <ChartSelectController
          selected={selectedChart}
          selectedSetter={setSelectedChart}
        />
        <CoinSelectController
          selectedCoinList={selectedMarket}
          selectedCoinListSetter={setSelectedMarket}
        />
      </SideBarContainer>
      <ChartContainer>
        {selectedChart === 'RunningChart' ? (
          <RunningChart
            candleCount={20}
            toRenderCoinTickerList={selectedMarket}
          />
        ) : (
          <TreeChart data={data} />
        )}
      </ChartContainer>
    </HomeContainer>
  )
}

//솔직히 서버사이드 프롭스 없애는게 낫지 않나 싶음..
export const getServerSideProps: GetServerSideProps<
  TreeChartProps
> = async () => {
  const fetchedData: MarketCapInfo[] | null = await getMarketCapInfo()
  return {
    props: {
      data: fetchedData === null ? [] : fetchedData
    }
  }
}
