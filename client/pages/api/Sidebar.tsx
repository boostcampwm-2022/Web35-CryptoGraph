import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'

export default function SideBar (props : any) {

  const BoxStyle = styled.div`
    display: ${props.openSideBar ? 'block' : 'none'}
  `

  return (
    <>
      <BoxStyle>
        <Box 
          sx={{
            width: 400,
            height: 952,
            border: "4px dashed black",
            "border-radius": "32px",
            margin: "16px 8px"
          }}
        >
          <Box 
            sx={{
              width: 376,
              height: 56,
              border: "4px dashed black",
              "border-radius": "16px",
              margin: "16px 8px"
            }}
          />
          <Box 
            sx={{
              width: 376,
              height: 416,
              border: "4px dashed black",
              "border-radius": "16px",
              margin: "16px 8px"
            }}
          />
          <Box 
            sx={{
              width: 376,
              height: 352,
              border: "4px dashed black",
              "border-radius": "16px",
              margin: "16px 8px"
            }}
          />
          <Box 
            sx={{
              width: 376,
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