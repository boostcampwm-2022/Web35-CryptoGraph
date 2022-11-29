import * as React from 'react'
import styled from '@emotion/styled'
import CoinDetailedInfo from '@/components/CoinDetailedInfo'
import LinkButton from '@/components/LinkButton'
import RealTimeCoinPrice from '@/components/RealTimeCoinPrice'

export default function InfoContainerDesktop() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <StyledRTV>
        <RealTimeCoinPrice value={1} />
      </StyledRTV>
      <StyledRTV>
        <CoinDetailedInfo value={1} />
      </StyledRTV>
      <LinkButton goto="/" content="Go to Main" />
    </div>
  )
}

const StyledRTV = styled('div')`
  display: flex;
  width: 100%;
  height: 43%;
  background-color: #ffffff;
  border: 1px solid #cac4d0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding-bottom: 24px;
`
