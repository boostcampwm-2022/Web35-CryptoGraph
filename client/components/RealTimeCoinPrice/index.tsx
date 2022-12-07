import { styled, Typography, useTheme } from '@mui/material'
import * as React from 'react'
import { TabProps } from '@/components/TabContainer'
import Image from 'next/image'
import { CoinPrice } from '@/types/CoinPriceTypes'
import Link from 'next/link'
import { useRouter } from 'next/router'
//코인 실시간 정보
export default function RealTimeCoinPrice(props: TabProps) {
  return (
    <Container>
      <CoinPriceHeader />
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
  const theme = useTheme()
  const router = useRouter()
  const isMinus = coinPrice.signed_change_price <= 0
  const textColor =
    coinPrice.signed_change_price === 0
      ? 'black'
      : coinPrice.signed_change_price < 0
      ? theme.palette.custom.blue
      : theme.palette.custom.red
  return (
    <CoinPriceDiv>
      <Image src={coinPrice.logo} alt="" width={40} height={40} />
      <div className="name">
        <Link href={`/detail/${coinPrice.name}`}>
          <Typography sx={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>
            {coinPrice.name_kr}
          </Typography>
        </Link>
        <Typography sx={{ margin: 0, fontSize: '12px' }}>
          {coinPrice.name}
        </Typography>
      </div>
      <div className="price">
        <Typography sx={{ color: textColor, fontSize: '12px' }}>
          {coinPrice.price.toLocaleString()}
        </Typography>
      </div>
      <div className="yesterday">
        <Typography sx={{ color: textColor, margin: 0, fontSize: '12px' }}>
          {(isMinus ? '' : '+') +
            coinPrice.signed_change_price.toLocaleString()}
        </Typography>
        <Typography sx={{ color: textColor, fontSize: '12px' }}>
          {(isMinus ? '' : '+') +
            Math.floor(coinPrice.signed_change_rate * 10000) / 100}
          %
        </Typography>
      </div>
      <div className="amount">{transPrice(coinPrice.acc_trade_price_24h)}</div>
    </CoinPriceDiv>
  )
}

const CoinPriceHeader: React.FunctionComponent = () => {
  return (
    <Header>
      <div className="header">
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
  overflow-y: auto;
  padding: 8px;
  background-color: #ffffff;
  border: 1px solid #cac4d0;
  border-radius: 20px;
  ${props => props.theme.breakpoints.down('tablet')} {
    height: 100%;
  }
`

const Header = styled('div')`
  width: 100%;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  gap: 4px;
  padding-left: 40px;
  & > div.header {
    display: flex;
    & > div:first-child {
      flex: 2;
    }
    & > div:nth-child(n + 2) {
      flex: 1;
    }
  }
`

const CoinPriceContainer = styled('div')`
  flex: 1 1 auto;
  margin-top: 8px;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
  ::-webkit-scrollbar {
    width: 4px;
    position: relative;
  }
  ::-webkit-scrollbar-track {
    display: none;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgb(199, 199, 199);
  }
`

const CoinPriceDiv = styled('div')`
  display: flex;
  width: 100%;
  height: 50px;
  font-size: 12px;
  gap: 4px;
  align-items: center;
  text-align: right;
  & a {
    text-decoration: none;
    color: black;
  }
  & > div.name {
    flex: 2;
    text-align: left;
    padding-left: 10px;
  }
  & > div.price {
    flex: 1;
  }
  & > div.yesterday {
    flex: 1;
  }
  & > div.amount {
    flex: 1;
  }
`

const transPrice = (price: number): string => {
  return Math.floor(price / 1000000).toLocaleString() + '백만'
}
