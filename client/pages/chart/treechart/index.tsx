import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import TreeChart from '@/components/Treechart'
import { getTreeData, updateTreeData } from '@/components/Treechart/getCoinData'
import { useEffect, useState } from 'react'
import { CoinRateContentType } from '@/types/ChartTypes'
import { MarketCapInfo } from '@/types/CoinDataTypes'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getMarketCapInfo } from '@/utils/metaDataManages'

export default function TreeChartPage({
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // const [updateData, setUpdateData] = useState<CoinRateContentType>()
  console.log(data)
  // useEffect(() => {
  //   getTreeData().then(data => {
  //     setUpdateData(data)
  //   })
  // }, [])
  return (
    <HomeContainer>
      <TreeChart data={data} />
    </HomeContainer>
  )
}

interface TreeChartPageProps {
  data: MarketCapInfo[]
}

export const getServerSideProps: GetServerSideProps<
  TreeChartPageProps
> = async () => {
  const fetchedData: MarketCapInfo[] | null = await getMarketCapInfo()
  return {
    props: {
      data: fetchedData === null ? [] : fetchedData
    }
  }
}

const HomeContainer = styled(Box)`
  display: flex;
  width: 100%;
  max-width: 1920px;
  height: 100%;
  align-items: center;
  ${props => props.theme.breakpoints.down('tablet')} {
    flex-direction: column;
  }
`
