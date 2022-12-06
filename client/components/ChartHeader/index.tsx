import { styled } from '@mui/material/styles'
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
  const coinPrice = props.coinPriceInfo
  const isMinus = coinPrice.signed_change_rate < 0
  return (
    <HeaderCoinInfoContainer>
      <Image src={coinPrice.logo} alt="" width={50} height={50} />
      <div className="name">
        <span>
          <span className="big">{coinPrice.name_kr}</span>{' '}
          {coinPrice.name + '/KRW'}
        </span>
      </div>
      <div className="price">
        <p>{coinPrice.price.toLocaleString() + 'KRW'}</p>
        <span>
          {(isMinus ? '' : '+') +
            coinPrice.signed_change_price.toLocaleString() +
            (isMinus ? '' : '+') +
            Math.floor(coinPrice.signed_change_rate * 10000) / 100}
          %
        </span>
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
  const handleChange = (event: SelectChangeEvent) => {
    props.selectedSetter(event.target.value as ChartPeriod)
    // as 사용을 지양해야하지만, 런타임 중에
    // ChartPeriod 이외에 다른 value가 들어올
    // 가능성이 없으므로 사용함.
  }
  return (
    <Box sx={{ minWidth: 300 }}>
      <FormControl fullWidth>
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
  border: 1px solid #cac4d0;
  border-radius: 20px;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
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
  & > div.price {
    text-align: left;
    font-size: 15px;
    & p {
      margin: 0;
    }
  }
`
