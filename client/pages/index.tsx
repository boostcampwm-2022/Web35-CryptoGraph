import * as React from 'react'
import Box from '@mui/material/Box'
import styled from '@emotion/styled'
import Image from 'next/image'
import { useState } from '@storybook/addons'

export default function Home() {
  //const [sideBarOpen, setSideBarOpen] = useState(false);
  interface config {
    treeMapWidth : number,
    treeMapHeight : number,
  }

  const config = {
    treeMapWidth : 1856,
    treeMapHeight : 896,
  }

  const BackgroundStyle = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
  `

  // const sideBarOpenHandler = () => {
  //   setSideBarOpen(!sideBarOpen)
  // }

  return (
    <BackgroundStyle>
      <Image src="/openBtn.svg" alt="" width={32} height={140} />
      <Box
        sx={{
          width: config["treeMapWidth"],
          height: config["treeMapHeight"],
          border: "4px dashed black",
          "border-radius": "35px",
          margin: "20px 35px"
        }}
      />
    </BackgroundStyle>
  )
}
