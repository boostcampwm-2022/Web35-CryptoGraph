import { useState } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { useMediaQuery, useTheme } from '@mui/material'
import CoinSelectController from '@/components/CoinSelectController'
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

export default function Home() {
  const [selectedMarket, setSelectedMarket] = useState<string[]>(['btc']) //선택된 market 컨트롤
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))
  return (
    <HomeContainer>
      <SideBarContainer>
        <CoinSelectController />
      </SideBarContainer>
      <ChartContainer />
    </HomeContainer>
  )
}
