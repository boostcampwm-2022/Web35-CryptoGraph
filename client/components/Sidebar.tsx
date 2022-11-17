import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Image from 'next/image'

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
    margin: "0px 16px",
    "border-radius": "100px",
    "font-size": "24px"
  }

  const runningButtonConfig = {
    ...buttonSelect === 'running' ? buttonColorConfig["onButton"] : buttonColorConfig["offButton"], 
      width: "44%", 
      height: "48px", 
      margin: "0px 16px", 
      "border-radius": "100px",
      "font-size": "24px"
    }

    const detailButtonConfig = {
      ...buttonColorConfig["onButton"],
      width: "100%", 
      height: "100%", 
      "border-radius": "16px",
      "font-size": "24px"
    }

  const BoxStyle = styled.div`
    display: ${props.openSideBar ? 'block' : 'none'};
    width: ${widthConfig["outerBoxWidth"]};
    min-width: fit-content;
  `

  const ButtonStyle = styled.div`
    display: flex;
    margin: 0px 19px;
    align-items: center;
  `

  const SelectCoinInnerLayerStyle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 48px;
  `

  const SelectCoinInnerBoxStyle = styled.div`
    display: flex;
    align-items: center;
  `

  const SelectCoinInnerBoxFontStyle = styled.div`
    margin: 16px;
    font-size: 24px;
  `
  const SelectCoinTitleStyle = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 48px;
    align-items: center;
  `

  const SelectCoinTitleFontStyle = styled.div`
    font-size: 32px;
  `

  const SelectCoinTitleBoxStyle = styled.div`
    display: flex;
    align-items: center;
  `

  const SelectCoinTitleBoxFontStyle = styled.div`
    font-size: 24px;
  `

  const CoinIntroductionTitle = styled.div`
    display: flex;
    margin: 32px;
    
  `
  const CoinIntroductionTitleContent = styled.div`
    margin: 0px 48px 0px 32px;
  `

  const CoinIntroductionTitleCoin = styled.div`
    font-size: 32px;
  `

  const CoinIntroductionTitleTicker = styled.div`
    font-size: 24px;
  `

  const CoinIntroductionLayer = styled.div`
    margin: 32px;
    font-size: 16px;
  `

  const treeMapButtonSelectHandler = function (e : React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    setButtonSelect('treeMap');
  }

  const runningButtonSelectHandler = function (e : React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    setButtonSelect('running');
  }

  return (
    <>
      <BoxStyle>
        <Box 
          sx={{
            border: "1px solid black",
            "border-radius": "16px",
            margin: "16px 0px 16px 8px",
          }}
        >
          <Box
            sx={{
              width: widthConfig["innerBoxWidth"],
              height: 56,
              border: "1px solid black",
              "border-radius": "16px",
              margin: "16px 8px",
            }}
          >
            <ButtonStyle>
              <Button variant="contained" 
                onClick={treeMapButtonSelectHandler}
                sx={treeMapButtonConfig}
                >TreeMap</Button>
              <Button variant="contained"
               onClick={runningButtonSelectHandler}
               sx={runningButtonConfig}>Running</Button>
            </ButtonStyle>
          </Box>
          <Box 
            sx={{
              width: widthConfig["innerBoxWidth"],
              height: 416,
              border: "1px solid black",
              "border-radius": "16px",
              margin: "16px 8px"
            }}
          >
            <div className='selectCoin'>
              <SelectCoinTitleStyle>
                <SelectCoinTitleFontStyle>코인선택</SelectCoinTitleFontStyle>
                <SelectCoinTitleBoxStyle>
                  <SelectCoinTitleBoxFontStyle>전부 [선택/해제]</SelectCoinTitleBoxFontStyle>
                  <Checkbox/>
                </SelectCoinTitleBoxStyle>
              </SelectCoinTitleStyle>
              <SelectCoinInnerLayerStyle>
                <SelectCoinInnerBoxStyle>
                  <Image src="/btc.svg" alt="" width={40} height={40} />
                  <SelectCoinInnerBoxFontStyle>BTC</SelectCoinInnerBoxFontStyle>
                </SelectCoinInnerBoxStyle>
                <Checkbox/>
              </SelectCoinInnerLayerStyle>
              <SelectCoinInnerLayerStyle>
                <SelectCoinInnerBoxStyle>
                  <Image src="/btc.svg" alt="" width={40} height={40} />
                  <SelectCoinInnerBoxFontStyle>BTC</SelectCoinInnerBoxFontStyle>
                </SelectCoinInnerBoxStyle>
                <Checkbox/>
              </SelectCoinInnerLayerStyle>
            </div>
          </Box>
          <Box 
            sx={{
              width: widthConfig["innerBoxWidth"],
              height: 352,
              border: "1px solid black",
              "border-radius": "16px",
              margin: "16px 8px"
            }}
          >
            <div className='CoinIntroduction'>
              <CoinIntroductionTitle>
                <Image src="/btc.svg" alt="" width={88} height={88} />
                <CoinIntroductionTitleContent>
                  <CoinIntroductionTitleCoin>BitCoin</CoinIntroductionTitleCoin>
                  <CoinIntroductionTitleTicker>BTC</CoinIntroductionTitleTicker>
                </CoinIntroductionTitleContent>
              </CoinIntroductionTitle>
              <CoinIntroductionLayer>
                <div>코인 정보 (22.11.09 기준, coinmarketcap 제공)</div>
                <div>시가총액 : 1,000,000 $ </div>
                <div>일일 채굴량 : 1,000,000 $ </div>
                <div>일일 거래량 : 1,000,000 $ </div>
                <div>기타 : 1,000,000 $ </div>
                <div>정보 : 1,000,000 $ </div>
                <div>되는대로 추가하기 : 1,000,000 $ </div>
                <div>etc:etcetc</div>
              </CoinIntroductionLayer>
            </div>
          </Box>
          <Box 
            sx={{
              width: widthConfig["innerBoxWidth"],
              height: 48,
              border: "1px solid black",
              "border-radius": "16px",
              margin: "16px 8px"
            }}
          >
            <Button variant="contained" 
                onClick={treeMapButtonSelectHandler}
                sx={detailButtonConfig}
                >Detail About BTC</Button>
          </Box>
        </Box>
      </BoxStyle>
    </>
  )
}