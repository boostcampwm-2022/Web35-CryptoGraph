import { useEffect, useState } from 'react'
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
import { CoinRateType, CoinRateContentType } from '@/types/ChartTypes'
import useInterval from '@/hooks/useInterval'
import { updateTreeData } from '@/components/Treechart/getCoinData'
import { update } from 'lodash'

const coinIntervalRate = 5000

const getInitData = (data: MarketCapInfo[]) => {
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

const dataMarket = data => {
  return Object.keys(data).map(x => data[x].name_k)
}

export default function Home({
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [selectedChart, setSelectedChart] = useState<ChartType>('RunningChart')
  const [selectedMarket, setSelectedMarket] = useState<string[]>(
    dataMarket(data)
  ) //선택된 market 컨트롤
  const [coinData, setCoinData] = useState(getInitData(data))

  useInterval(() => {
    async function update() {
      const updatedCoinRate = await updateTreeData(coinData)
      setCoinData(updatedCoinRate)
    }
    update()
  }, coinIntervalRate)

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
          <RunningChart candleCount={20} data={coinData} />
        ) : (
          <TreeChart data={coinData} Market={selectedMarket} />
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
