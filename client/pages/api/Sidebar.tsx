import Box from '@mui/material/Box'
import { EventHandler, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import Button from '@mui/material/Button';

export default function SideBar (props : any) {
  const [buttonSelect, setButtonSelect] = useState('treeMap')
  
  interface Button {
    color : string,
    backgroundColor : string
  }

  interface buttonColorConfig {
    onButton : Button,
    offButton : Button,
  }

  const buttonColorConfig = {
    onButton : {color: "white", backgroundColor: "#6750A4"},
    offButton : {color: "black", backgroundColor: "rgba(103, 80, 164, 0.12)"}
  }

  interface widthConfig {
    outerBoxWidth : string,
    innerBoxWidth : string,
  }

  const widthConfig = {
    outerBoxWidth : "20%",
    innerBoxWidth : "96%",
  }
  
  const treeMapButtonConfig = {
    ...buttonSelect === 'treeMap' ? buttonColorConfig["onButton"] : buttonColorConfig["offButton"], 
    width: "44%", 
    height: "48px", 
    margin: "0px 19px", 
    "border-radius": "100px"
  }

  const runningButtonConfig = {
    ...buttonSelect === 'running' ? buttonColorConfig["onButton"] : buttonColorConfig["offButton"], 
      width: "44%", 
      height: "48px", 
      margin: "0px 19px", 
      "border-radius": "100px"
    }

  const BoxStyle = styled.div`
    display: ${props.openSideBar ? 'block' : 'none'};
    width: ${widthConfig["outerBoxWidth"]};
  `

  const ButtonStyle = styled.div`
    display: flex;
    margin: 0px 19px;
    align-items: center;
  `

  const treeMapButtonSelectHandler = function (e : MouseEventHandler<HTMLButtonElement>) {
    e.preventDefault();
    setButtonSelect('treeMap');
  }

  const runningButtonSelectHandler = function (e : MouseEventHandler<HTMLElement>) {
    e.preventDefault();
    setButtonSelect('running');
  }

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
              margin: "16px 8px",
            }}
          >
            <ButtonStyle>
              <Button variant="contained" 
                onClick={treeMapButtonSelectHandler}
                sx={treeMapButtonConfig}>TreeMap</Button>
              <Button variant="contained"
               onClick={runningButtonSelectHandler}
               sx={runningButtonConfig}>Running</Button>
            </ButtonStyle>
          </Box>
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