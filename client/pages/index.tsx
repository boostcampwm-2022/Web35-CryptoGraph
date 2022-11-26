import { useState } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import SideBar from '../components/Sidebar'
import { useMediaQuery, useTheme } from '@mui/material'
const HomeContainer = styled('div')`
  width: 100%;
  max-width: 1920px;
  height: 100%;
  display: flex;
  align-items: center;
  ${props => props.theme.breakpoints.down('tablet')} {
    flex-direction: column-reverse;
  }
`
const ResponsiveBox = styled(Box)`
  display: flex;
  align-items: center;

  ${props => props.theme.breakpoints.down('tablet')} {
    transition: height 0.6s ease-in-out;
    width: 100%; //매직넘버 제거 및 반응형 관련 작업 필요(모바일에서는 100%)
    height: 0%;
    &.opened {
      height: calc(100% - 48px);
    }
  }
  ${props => props.theme.breakpoints.up('tablet')} {
    width: 0px;
    transition: width 0.6s ease-in-out;
    height: calc(100% - 48px);
    &.opened {
      width: 390px;
    }
  }
`
const ResponsiveImage = styled(Image)`
  /* ${props => props.theme.breakpoints.down('tablet')} {
    transform: rotate(270deg);
  } */
`

export default function Home() {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false) //사이드바가 열렸는지 컨트롤
  const [selectedMarket, setSelectedMarket] = useState<string[]>(['btc']) //선택된 market 컨트롤
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))
  return (
    <HomeContainer>
      <ResponsiveBox className={sideBarOpen ? 'opened' : ''}>
        <SideBar isSideBarOpened={sideBarOpen} />
      </ResponsiveBox>
      <ResponsiveImage
        onClick={() => {
          setSideBarOpen(!sideBarOpen)
        }}
        src={isMobile ? '/openBtn-mobile.svg' : '/openBtn.svg'}
        alt=""
        width={isMobile ? 140 : 32}
        height={isMobile ? 34 : 140}
      />
      <Box
        sx={{
          width: '100%',
          height: `calc(100% - 48px)`,
          margin: '24px',
          border: '1px solid black',
          borderRadius: '32px'
        }}
      />
    </HomeContainer>
  )
}
