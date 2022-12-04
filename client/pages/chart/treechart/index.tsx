import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import TreeChart from '@/components/Treechart'
import { MarketCapInfo, TreeChartPageProps } from '@/types/CoinDataTypes'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getMarketCapInfo } from '@/utils/metaDataManages'

export default function TreeChartPage({
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <HomeContainer>
      <TreeChart data={data} />
    </HomeContainer>
  )
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
