import { useState } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import SideBar from '../components/Sidebar'

const HomeContainer = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`

const ResponsiveBox = styled(Box)`
  display: flex;
  align-items: center;
  width: 390px; //매직넘버 제거 및 반응형 관련 작업 필요(모바일에서는 100%)
  height: 100%; //(모바일에서는 50%정도)
  transition: all 0.6s ease-in-out;
  &.opened {
    width: 0px;
  }
  > .div {
    border: 0px;
  }
`

export default function Home() {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false) //사이드바가 열렸는지 컨트롤
  const [selectedMarket, setSelectedMarket] = useState<string[]>(['btc']) //선택된 market 컨트롤

  return (
    <HomeContainer>
      <ResponsiveBox className={sideBarOpen ? 'opened' : ''}>
        <SideBar isSideBarOpened={sideBarOpen} />
      </ResponsiveBox>
      <Image
        onClick={() => {
          setSideBarOpen(!sideBarOpen)
        }}
        src="/openBtn.svg"
        alt=""
        width={32}
        height={140}
      />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          border: '1px solid black',
          borderRadius: '32px'
        }}
      />
    </HomeContainer>
  )
}
