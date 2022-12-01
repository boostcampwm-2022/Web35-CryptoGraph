import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import TreeChart from '@/components/Treechart'
export default function TreeChartPage() {
  return (
    <HomeContainer>
      <TreeChart />
    </HomeContainer>
  )
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
