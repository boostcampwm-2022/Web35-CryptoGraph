import { styled, Typography, useTheme } from '@mui/material'
import { TabProps } from '@/components/TabContainer'
import Image from 'next/image'
import { CoinPrice } from '@/types/CoinPriceTypes'
import Link from 'next/link'
import { useState, FunctionComponent, memo, useCallback } from 'react'
//코인 실시간 정보

const sortTypeArr = [
  'signed_change_rate',
  'acc_trade_price_24h',
  'price'
] as const
type sortType = typeof sortTypeArr[number]

interface SortManual {
  toSort: sortType
  sortDirection: boolean
}

export default function RealTimeCoinPrice(props: TabProps) {
  const [sortManual, setSortManual] = useState<SortManual>({
    toSort: 'acc_trade_price_24h',
    sortDirection: true
  })

  const sortHandler = useCallback(
    (clicked: sortType) => {
      setSortManual(prev => {
        if (prev.toSort === clicked) {
          return { toSort: clicked, sortDirection: !prev.sortDirection }
        }
        return { toSort: clicked, sortDirection: true }
      })
    },
    [setSortManual]
  )

  return (
    <Container>
      <MemoCoinPriceHeader sortHandler={sortHandler} />
      <CoinPriceContainer>
        {props.priceInfo &&
          Object.values(props.priceInfo)
            .sort((a, b) => {
              return (
                (sortManual.sortDirection ? 1 : -1) *
                (b[sortManual.toSort] - a[sortManual.toSort])
              )
            })
            .map(coinPrice => (
              <MemoCoinPriceTab key={coinPrice.name} coinPrice={coinPrice} />
            ))}
      </CoinPriceContainer>
    </Container>
  )
}

interface CoinPriceTabProps {
  coinPrice: CoinPrice
}

const CoinPriceTab: FunctionComponent<CoinPriceTabProps> = ({ coinPrice }) => {
  const theme = useTheme()
  const isMinus = coinPrice.signed_change_price <= 0
  const textColor =
    coinPrice.signed_change_price === 0
      ? 'black'
      : coinPrice.signed_change_price < 0
      ? theme.palette.custom.blue
      : theme.palette.custom.red
  return (
    <Link
      href={`/detail/${coinPrice.name}`}
      style={{ textDecoration: 'none', color: 'black' }}
    >
      <CoinPriceDiv>
        <Image src={coinPrice.logo} alt="" width={40} height={40} />
        <div className="name">
          <Typography sx={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>
            {coinPrice.name_kr}
          </Typography>
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
        <div className="amount">
          {transPrice(coinPrice.acc_trade_price_24h)}
        </div>
      </CoinPriceDiv>
    </Link>
  )
}

const MemoCoinPriceTab = memo(CoinPriceTab)

interface CoinPriceHeaderProps {
  sortHandler: (clicked: sortType) => void
}

const CoinPriceHeader: FunctionComponent<CoinPriceHeaderProps> = ({
  sortHandler
}) => {
  return (
    <Header>
      <div className="header">
        <div className="name">코인명</div>
        <div
          className="price"
          onClick={() => {
            sortHandler('price')
          }}
        >
          현재가
        </div>
        <div
          className="yesterday"
          onClick={() => {
            sortHandler('signed_change_rate')
          }}
        >
          전일대비
        </div>
        <div
          className="amount"
          onClick={() => {
            sortHandler('acc_trade_price_24h')
          }}
        >
          거래대금
        </div>
      </div>
    </Header>
  )
}

const MemoCoinPriceHeader = memo(CoinPriceHeader)

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  padding: 8px;
  background-color: #ffffff;
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
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    & > div:first-of-type {
      flex: 2;
    }
    & > div:nth-of-type(n + 2) {
      flex: 1;
    }

    & > div {
      cursor: pointer;
      :hover {
        background-color: ${props => props.theme.palette.primary.main};
        color: #ffffff;
        transition: 0.5s;
        transform: scale(1.1); /*  default */
        -webkit-transform: scale(1.1); /*  크롬 */
        -moz-transform: scale(1.1); /* FireFox */
        -o-transform: scale(1.1); /* Opera */
      }
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
  :hover {
    background-color: #eee6e6;
    transition: 0.5s;
  }
`

const transPrice = (price: number): string => {
  return Math.floor(price / 1000000).toLocaleString() + '백만'
}
