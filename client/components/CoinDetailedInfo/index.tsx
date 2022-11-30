import * as React from 'react'
import { TabProps } from '@/components/InfoContainerMobile/index'
import { styled } from '@mui/material'
import Image from 'next/image'

type mockingType = {
  [key: string]: string
}
const mocking: mockingType = {
  market_Cap: '1',
  Data2: '2',
  Data3: '3',
  Data4: '4',
  Data5: '12',
  Data6: '22',
  Data7: '32',
  Data23: '12',
  Data231: '22',
  Data2341: '32',
  Data8: '42'
}
//코인 상세정보
interface CoinDetailedInfoProps extends TabProps {
  market: string
}
export default function CoinDetailedInfo({ market }: CoinDetailedInfoProps) {
  return (
    <Container>
      <Header>
        <HeaderLogo
          src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"
          alt="/logo-only-white.svg"
          width={60}
          height={60}
        />
        <HeaderContent>
          <div> {'비트코인.. 처럼 한국말이름'}</div>
          <div> {market}</div>
        </HeaderContent>
      </Header>
      <Body>
        <BodyHeader>코인 정보(xx.xx.xx 기준, coinmarketcap 제공)</BodyHeader>
        <BodyContentContainer>
          {Object.keys(mocking).map((key, index: number) => {
            return (
              <BodyContent key={key + index}>
                {key + ':' + mocking[key]}
              </BodyContent>
            )
          })}
        </BodyContentContainer>
      </Body>
    </Container>
  )
}
const Container = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  padding: 24px;
`

const Header = styled('div')`
  display: flex;
  flex-direction: row;
`
const HeaderLogo = styled(Image)``
const HeaderContent = styled('div')`
  display: flex;
  margin-left: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`

const Body = styled('div')``
const BodyHeader = styled('div')`
  font-size: 1.1rem;
  font-weight: bold;
`
const BodyContentContainer = styled('div')`
  height: 200px;
  overflow-y: scroll;
`
const BodyContent = styled('div')``
