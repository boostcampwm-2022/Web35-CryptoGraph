import { styled } from '@mui/material'
import * as React from 'react'
import { TabProps } from '@/components/TabContainer'
import Image from 'next/image'
import { CoinPrice } from '@/types/CoinPriceTypes'
//코인 실시간 정보
export default function RealTimeCoinPrice(props: TabProps) {
  return (
    <Container>
      <CoinPriceHeader></CoinPriceHeader>
      <CoinPriceContainer>
        {props.priceInfo &&
          Object.values(props.priceInfo).map(coinPrice => (
            <CoinPriceTab
              key={coinPrice.name}
              coinPrice={coinPrice}
            ></CoinPriceTab>
          ))}
      </CoinPriceContainer>
    </Container>
  )
}

interface CoinPriceTabProps {
  coinPrice: CoinPrice
}

const CoinPriceTab: React.FunctionComponent<CoinPriceTabProps> = ({
  coinPrice
}) => {
  const isMinus = coinPrice.signed_change_price < 0
  return (
    <CoinPriceDiv>
      <Image src={coinPrice.logo} alt="" width={40} height={40} />
      <div className="name">
        <p>{coinPrice.name_kr}</p>
        <p>{coinPrice.name}</p>
      </div>
      <div className={isMinus ? 'price red' : 'price'}>
        {coinPrice.price.toLocaleString()}
      </div>
      <div className={isMinus ? 'yesterday red' : 'yesterday'}>
        <p>
          {(isMinus ? '' : '+') +
            coinPrice.signed_change_price.toLocaleString()}
        </p>
        <p>
          {(isMinus ? '' : '+') +
            Math.floor(coinPrice.signed_change_rate * 10000) / 100}
          %
        </p>
      </div>
      <div className="amount">{transPrice(coinPrice.acc_trade_price_24h)}</div>
    </CoinPriceDiv>
  )
}

const CoinPriceHeader: React.FunctionComponent = () => {
  return (
    <Header>
      <p>코인 실시간 가격</p>
      <div className="header">
        <div className="empty"></div>
        <div className="name">코인명</div>
        <div className="price">현재가</div>
        <div className="yesterday">전일대비</div>
        <div className="amount">거래대금</div>
      </div>
    </Header>
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
  gap: 4px;
  & > div.header {
    display: flex;
    & > div.empty {
      width: 40px;
    }
    & > div:nth-child(n + 2) {
      flex: 1;
    }
  }
`

const CoinPriceContainer = styled('div')`
  width: 100%;
  height: 600px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const CoinPriceDiv = styled('div')`
  display: flex;
  width: 100%;
  height: 50px;
  font-size: 15px;
  gap: 4px;
  align-items: center;
  text-align: right;
  & > div.name {
    flex: 1;
    text-align: left;
    p {
      margin: 0;
      line-height: 100%;
      padding-left: 10px;
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
    color: black;
    flex: 1;
  }
`

const transPrice = (price: number): string => {
  return Math.floor(price / 1000000).toLocaleString() + '백만'
}
