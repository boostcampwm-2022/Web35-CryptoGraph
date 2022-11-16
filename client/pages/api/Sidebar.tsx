import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'

export default function SideBar (props : any) {

  interface widthConfig {
    outerBoxWidth : number,
    boxHeight : number,
    innerBoxWidth : number,
    innerBoxHeight : number,
  }

  const widthConfig = {
    outerBoxWidth : "20%",
    innerBoxWidth : "96%",
  }

  const BoxStyle = styled.div`
    display: ${props.openSideBar ? 'block' : 'none'};
    width: ${widthConfig["outerBoxWidth"]};
    height: 952px,
  `

  return (
    <>
      <BoxStyle>
        <Box 
          sx={{
            border: "4px dashed black",
            "border-radius": "16px",
            margin: "16px 0px 16px 8px"
          }}
        >
          <Box 
            sx={{
              width: widthConfig["innerBoxWidth"],
              height: 56,
              border: "4px dashed black",
              "border-radius": "16px",
              margin: "16px 8px"
            }}
          />
          <Box 
            sx={{
              width: widthConfig["innerBoxWidth"],
              height: 416,
              border: "4px dashed black",
              "border-radius": "16px",
              margin: "16px 8px"
            }}
          />
          <Box 
            sx={{
              width: widthConfig["innerBoxWidth"],
              height: 352,
              border: "4px dashed black",
              "border-radius": "16px",
              margin: "16px 8px"
            }}
          />
          <Box 
            sx={{
              width: widthConfig["innerBoxWidth"],
              height: 48,
              border: "4px dashed black",
              "border-radius": "16px",
              margin: "16px 8px"
            }}
          />
        </Box>
      </BoxStyle>
    </>
  )
}