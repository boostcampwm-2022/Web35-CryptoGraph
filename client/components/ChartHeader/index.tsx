import { styled, useTheme } from '@mui/material/styles'
import { ChartPeriod } from '@/types/ChartTypes'
import { Dispatch, SetStateAction } from 'react'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { ChartPeriodList } from '@/types/ChartTypes'
import { CoinPrice } from '@/types/CoinPriceTypes'
import Image from 'next/image'
import { Typography, useMediaQuery } from '@mui/material'

interface ChartHeaderProps {
  selected: ChartPeriod
  selectedSetter: Dispatch<SetStateAction<ChartPeriod>>
  coinPriceInfo: CoinPrice
}

// 분봉선택과 코인정보를 나타내는 컴포넌트를 포함하는 컨테이너
export default function ChartHeader(props: ChartHeaderProps) {
  return (
    <ChartHeaderContainer>
      <HeaderCoinInfo coinPriceInfo={props.coinPriceInfo}></HeaderCoinInfo>
      <ChartPeriodSelector
        selected={props.selected}
        selectedSetter={props.selectedSetter}
      ></ChartPeriodSelector>
    </ChartHeaderContainer>
  )
}

interface HeaderCoinPriceInfoProps {
  coinPriceInfo: CoinPrice
}
// 코인의 정보를 표시하는 컴포넌트
function HeaderCoinInfo(props: HeaderCoinPriceInfoProps) {
  const theme = useTheme()
  const coinPrice = props.coinPriceInfo
  const isMinus = coinPrice.signed_change_price <= 0
  const textColor =
    coinPrice.signed_change_price === 0
      ? 'black'
      : coinPrice.signed_change_price < 0
      ? theme.palette.custom.blue
      : theme.palette.custom.red
  const isSmallDesktop = useMediaQuery(
    theme.breakpoints.between('tablet', 'desktop')
  )
  return (
    <HeaderCoinInfoContainer>
      <Image
        src={coinPrice.logo}
        alt=""
        width={isSmallDesktop ? 30 : 50}
        height={isSmallDesktop ? 30 : 50}
      />
      <div className="name">
        <span>
          <span className="big">{coinPrice.name_kr}</span>{' '}
          {coinPrice.name + '/KRW'}
        </span>
      </div>
      <div className="price">
        <Typography
          sx={{ color: textColor, fontSize: isSmallDesktop ? '8px' : '12px' }}
        >
          {coinPrice.price.toLocaleString() + 'KRW'}
        </Typography>
        <Typography
          sx={{ color: textColor, fontSize: isSmallDesktop ? '8px' : '12px' }}
        >
          {`${
            (isMinus ? '' : '+') +
            coinPrice.signed_change_price.toLocaleString() +
            'KRW'
          } 
            ${
              (isMinus ? '' : '+') +
              Math.floor(coinPrice.signed_change_rate * 10000) / 100
            }`}
          %
        </Typography>
      </div>
    </HeaderCoinInfoContainer>
  )
}

// 기존의 ChartPeriodSelector
interface ChartPeriodSelectorProps {
  selected: ChartPeriod
  selectedSetter: Dispatch<SetStateAction<ChartPeriod>>
}
function ChartPeriodSelector(props: ChartPeriodSelectorProps) {
  const theme = useTheme()
  const isSmallDesktop = useMediaQuery(
    theme.breakpoints.between('tablet', 'desktop')
  )
  const handleChange = (event: SelectChangeEvent) => {
    props.selectedSetter(event.target.value as ChartPeriod)
    // as 사용을 지양해야하지만, 런타임 중에
    // ChartPeriod 이외에 다른 value가 들어올
    // 가능성이 없으므로 사용함.
  }
  return (
    <Box sx={{ width: 200 }}>
      <FormControl
        sx={{ width: '100%', height: '100%' }}
        size={isSmallDesktop ? 'small' : 'medium'}
      >
        <InputLabel id="demo-simple-select-label">분봉 선택</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.selected}
          label="Age"
          onChange={handleChange}
        >
          {ChartPeriodList.map(value => {
            return (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </Box>
  )
}

const ChartHeaderContainer = styled('div')`
  display: flex;
  width: 100%;
  height: 10%;
  background-color: #ffffff;
  box-sizing: border-box;
  justify-content: space-around;
  align-items: center;
  ${props => props.theme.breakpoints.down('tablet')} {
    flex-direction: column;
    height: 150px;
  }
`

const HeaderCoinInfoContainer = styled('div')`
  display: flex;
  width: 50%;
  gap: 20px;
  align-items: center;
  text-align: right;
  & > div.name {
    & span {
      font-size: 10px;
    }
    & .big {
      font-size: 20px;
      font-weight: 600;
    }
  }
  ${props => props.theme.breakpoints.down('tablet')} {
    width: 100%;
    justify-content: center;
  }
  ${props => props.theme.breakpoints.between('tablet', 'desktop')} {
    gap: 5px;
    & > div.name {
      & span {
        font-size: 8px;
      }
      & .big {
        font-size: 16px;
      }
    }
  }
`
