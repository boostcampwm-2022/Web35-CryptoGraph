import { styled } from '@mui/material'
import * as React from 'react'
import { TabProps } from '../InfoContainerMobile'
import Image from 'next/image'

const mockingData: CoinInfo = {
  logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
  name: 'BTC',
  name_kr: '비트코인',
  price: 23144000,
  signed_change_price: -48000.0,
  signed_change_rate: -0.0020696792,
  acc_trade_price_24h: 86114284886.73242
}

interface CoinInfo {
  logo: string
  name: string
  name_kr: string
  price: number
  signed_change_price: number
  signed_change_rate: number
  acc_trade_price_24h: number
}

//코인 실시간 정보
export default function RealTimeCoinPrice(props: TabProps) {
  return (
    <Container>
      <Header>코인 실시간 정보</Header>
      <CoinPriceContainer>
        <CoinPriceTab />
        <CoinPriceTab />
        <CoinPriceTab />
        <CoinPriceTab />
        <CoinPriceTab />
        {/* <CoinPriceTab />
        <CoinPriceTab />
        <CoinPriceTab />
        <CoinPriceTab />
        <CoinPriceTab />
        <CoinPriceTab />
        <CoinPriceTab />
        <CoinPriceTab />
        <CoinPriceTab />
        <CoinPriceTab />
        <CoinPriceTab />
        <CoinPriceTab />
        <CoinPriceTab /> */}
      </CoinPriceContainer>
    </Container>
  )
}

const CoinPriceTab: React.FunctionComponent = () => {
  return (
    <CoinPrice>
      <Image src={mockingData.logo} alt="" width={40} height={40} />
      <div className="name">
        <p>{mockingData.name_kr}</p>
        <p>{mockingData.name}</p>
      </div>
      <div className="price">{mockingData.price.toLocaleString()}</div>
      <div className="yesterday">
        <p>{mockingData.signed_change_price.toLocaleString()}</p>
        <p>{Math.floor(mockingData.signed_change_rate * 100) / 100}%</p>
      </div>
      <div className="amount">
        {transPrice(mockingData.acc_trade_price_24h)}
      </div>
    </CoinPrice>
  )
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  overflow-y: auto;
  padding: 24px;
  background-color: #ffffff;
  border: 1px solid #cac4d0;
  border-radius: 20px;
`

const Header = styled('div')`
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`

const CoinPriceContainer = styled('div')`
  width: 100%;
  height: 600px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const CoinPrice = styled('div')`
  display: flex;
  width: 100%;
  height: 50px;
  font-size: 20px;
  gap: 4px;
  align-items: center;
  text-align: right;
  & > div.name {
    flex: 1;
    font-size: 18px;
    text-align: left;
    p {
      margin: 0;
      line-height: 100%;
    }
  }
  & > div.price {
    flex: 1;
  }
  & > div.yesterday {
    flex: 1;
    p {
      margin: 0;
      line-height: 100%;
    }
  }
  & > div.amount {
    flex: 1;
  }
`

const transPrice = (price: number): string => {
  return Math.floor(price / 1000000).toLocaleString() + '백만'
}
