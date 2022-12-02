import * as React from 'react'
import { TabProps } from '@/components/InfoContainerMobile/index'
import { styled } from '@mui/material'
import Image from 'next/image'
import { CoinMetaData } from '@/types/CoinDataTypes'
import { useCoinMetaData } from 'hooks/useCoinMetaData'

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
  const coinMetaData: CoinMetaData | null = useCoinMetaData(market)
  return coinMetaData === null ? (
    <Container></Container>
  ) : (
    <Container>
      <Header>
        <HeaderLogo
          src={coinMetaData.logo}
          alt="/logo-only-white.svg"
          width={60}
          height={60}
        />
        <HeaderContent>
          <div> {coinMetaData.name_kr}</div>
          <div> {coinMetaData.symbol}</div>
        </HeaderContent>
      </Header>
      <Body>
        <BodyHeader>
          코인 정보({coinMetaData.time} 기준, coinmarketcap 제공)
        </BodyHeader>
        <BodyContentContainer>
          <BodyContent>시가총액: {coinMetaData.market_cap_kr}원</BodyContent>
          <BodyContent>시가총액 순위: {coinMetaData.cmc_rank}위</BodyContent>
          <BodyContent>24시간 거래량: {coinMetaData.volume_24h}원</BodyContent>
          <BodyContent key="max_supply">
            최대 공급량:{' '}
            {coinMetaData.max_supply === null
              ? '미정'
              : Math.floor(coinMetaData.max_supply).toLocaleString() +
                coinMetaData.symbol}
          </BodyContent>
          <BodyContent key="total_supply">
            총 공급량:{' '}
            {Math.floor(coinMetaData.total_supply).toLocaleString() +
              coinMetaData.symbol}
          </BodyContent>
          <BodyContent key="description">
            {coinMetaData.description}
          </BodyContent>
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
