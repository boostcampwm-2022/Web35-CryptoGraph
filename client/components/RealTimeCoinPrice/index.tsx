import { styled } from '@mui/material'
import * as React from 'react'
import { TabProps } from '../InfoContainerMobile'

//코인 실시간 정보
export default function RealTimeCoinPrice(props: TabProps) {
  return <Container>코인 실시간 정보</Container>
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 24px;
`
