import { styled } from '@mui/material/styles'
import { Box, Button, useMediaQuery, useTheme } from '@mui/material'
import renderMobileInfo from '@/components/Tab'
import Link from 'next/link'
import Chartbutton from '@/components/ChartButton'
import { useState } from 'react'

export default function Detail() {
  const theme = useTheme()
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))

  return (
    <HomeContainer>
      <ChartContainer>
        차트공간
        <ChartPeriodSelectorContainer>
          <Chartbutton />
        </ChartPeriodSelectorContainer>
        <StyledChart>여기는 차트입니다.</StyledChart>
      </ChartContainer>
      <InfoContainer>
        {isMobile
          ? renderMobileInfo({ value: selectedTab, setValue: setSelectedTab })
          : //프롭스로 컴포넌트를 받아낸다. 프롭스안에 있는 녀석들은 hook 못쓸텐데? 흠.. 일단 해보자..
            renderDesktopInfo()}
      </InfoContainer>
    </HomeContainer>
  )
}

function renderDesktopInfo() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <StyledRTV>실시간 코인시세</StyledRTV>
      <StyledRTV>코인 상세정보</StyledRTV>
      <Link href="/">
        <Button
          style={{ minWidth: '100px', width: '100%' }}
          size="large"
          variant="contained"
        >
          Go To Main
        </Button>
      </Link>
    </div>
  )
}

const HomeContainer = styled(Box)`
  width: 100%;
  max-width: 1920px;
  height: 100%;
  display: flex;
  align-items: center;
  ${props => props.theme.breakpoints.down('tablet')} {
    flex-direction: column;
  }
`
//왼쪽 메인차트
const ChartContainer = styled('div')`
  display: flex;
  box-sizing: content-box;
  width: 100%;
  height: calc(100% - 48px);
  margin: 24px;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid black;
  border-radius: 32px;
  ${props => props.theme.breakpoints.down('tablet')} {
    margin: 0;
  }
`

//오른쪽 정보 표시 사이드바
const InfoContainer = styled(Box)`
  margin: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  border-radius: 32px;
  width: 390px;
  height: calc(100% - 48px);
  ${props => props.theme.breakpoints.down('tablet')} {
    transition: height 0.6s ease-in-out;
    margin: 0;
    width: 100%; //매직넘버 제거 및 반응형 관련 작업 필요(모바일에서는 100%)
    height: calc(70%);
  }
`

const ChartPeriodSelectorContainer = styled('div')`
  width: 100%;
  height: 10%;
  min-height: 55px;
  background-color: #ffffff;
  border: 1px solid #cac4d0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const StyledChart = styled('div')`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border: 1px solid #cac4d0;
  border-radius: 20px;
`

const StyledRTV = styled('div')`
  width: 100%;
  height: 43%;
  background-color: #ffffff;
  border: 1px solid #cac4d0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding-bottom: 24px;
`
