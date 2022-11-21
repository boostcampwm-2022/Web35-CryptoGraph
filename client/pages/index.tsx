import { useState } from 'react'
import Box from '@mui/material/Box'
import styled from '@emotion/styled'
import Image from 'next/image'
import SideBar from '../components/Sidebar'

interface treeMapconfig {
  treeMapWidth: string
  treeMapHeight: number
}
const BackgroundStyle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`

export default function Home() {
  const [sideBarOpen, setSideBarOpen] = useState(false)

  const treeMapconfig: treeMapconfig = {
    treeMapWidth: sideBarOpen ? '80%' : '96%',
    treeMapHeight: 952
  }

  const sideBarOpenHandler = () => {
    setSideBarOpen(!sideBarOpen)
  }

  return (
    <BackgroundStyle>
      <Image
        onClick={sideBarOpenHandler}
        src="/openBtn.svg"
        alt=""
        width={32}
        height={140}
      />
      <SideBar openSideBar={sideBarOpen} />
      <Box
        sx={{
          width: treeMapconfig['treeMapWidth'],
          height: treeMapconfig['treeMapHeight'],
          border: '1px solid black',
          'border-radius': '32px',
          margin: '16px 32px',
          'min-width': '1536px'
        }}
      />
    </BackgroundStyle>
  )
}
