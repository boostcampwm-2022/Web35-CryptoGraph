import { useState } from 'react'
import styled from '@emotion/styled'
import Image from 'next/image'

const StyledTimeButton = styled.button`
  background: #e7e5ef;
  border-radius: 100px;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 2vh;
  margin: 8px 16px;
  width: 12vw;
  height: 55%;
  min-width: 108px;
  min-height: 30px;
`
export default function Chartbutton() {
  return (
    <>
      <StyledTimeButton>1분</StyledTimeButton>
      <StyledTimeButton>30분</StyledTimeButton>
      <StyledTimeButton>1시간</StyledTimeButton>
      <StyledTimeButton>4시간</StyledTimeButton>
      <StyledTimeButton>
        일
        <Image
          alt="menu-open"
          src="/menu-open.svg"
          width={30}
          height={16}
        ></Image>
      </StyledTimeButton>
    </>
  )
}
