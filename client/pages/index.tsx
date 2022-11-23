import { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import SideBar from '../components/Sidebar'

const HomeContainer = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`

export default function Home() {
  const [sideBarOpen, setSideBarOpen] = useState(false) //사이드바가 열렸는지 컨트롤
  const [selectedMarket, setSelectedMarket] = useState<string[]>(['btc']) //선택된 market 컨트롤

  return (
    <HomeContainer>
      <Grid container sx={{ flexWrap: 'wrap-reverse', height: '100%' }}>
        <Grid
          item
          xs={2}
          lg={2}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <div></div>
          <SideBar isSideBarOpened={sideBarOpen} />
          <Image
            onClick={() => {
              setSideBarOpen(!sideBarOpen)
            }}
            src="/openBtn.svg"
            alt=""
            width={32}
            height={140}
          />
        </Grid>
        <Grid item xs={10} lg={10}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              border: '1px solid black',
              borderRadius: '32px'
            }}
          />
        </Grid>
      </Grid>
    </HomeContainer>
  )
}
