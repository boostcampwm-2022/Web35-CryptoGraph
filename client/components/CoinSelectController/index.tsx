import * as React from 'react'
import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { MarketCapInfo } from '@/types/CoinDataTypes'
import SearchCoin from './SearchCoin'
import MakeCoinDict from './MakeCoinDict'
import { MyAppContext } from '../../pages/_app'

interface dict<T> {
  [key: string]: T
}

interface CoinChecked {
  [key: string]: boolean
}
interface CoinSelectControllerProps {
  selectedCoinListSetter: React.Dispatch<React.SetStateAction<string[]>>
  tabLabelInfo?: string
}

export default function CoinSelectController({
  selectedCoinListSetter
}: CoinSelectControllerProps) {
  const data = React.useContext(MyAppContext)
  const [coinList, setCoinList] = useState<MarketCapInfo[] | null>(data)
  const [checked, setChecked] = useState<CoinChecked>({
    all: true
  })
  const [inputCoinName, setInputCoinName] = useState('')
  const [coinDict, setCoinDict] = useState<dict<Array<string>>>(
    MakeCoinDict(data)
  )

  useEffect(() => {
    if (coinList == null) return
    for (const coin of coinList) {
      checked[coin.name] = true
    }

    setChecked({
      ...checked
    })
  }, [coinList])

  useEffect(() => {
    selectedCoinListSetter(
      Object.keys(checked).filter(x => {
        return checked[x] && x !== 'all'
      })
    )
  }, [checked])

  const coinCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (checked['all']) {
      for (const coin in checked) {
        checked[coin] = event.target.checked
      }
    } else {
      for (const coin in checked) {
        if (
          coin !== 'all' &&
          inputCoinName &&
          !coinDict[inputCoinName].includes(coin)
        )
          continue
        checked[coin] = event.target.checked
      }
    }

    setChecked({
      ...checked
    })
  }

  const coinCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked({
      ...checked,
      [event.target.name]: event.target.checked
    })
  }

  return (
    <Container>
      <Header>
        <HeaderSelectCoin>
          <HeaderTitle>코인 선택</HeaderTitle>
          <HeaderSelectBox>
            <HeaderSelectBoxContent>전체 [선택/해제]</HeaderSelectBoxContent>
            <Checkbox
              checked={checked.all}
              onChange={coinCheckAll}
              name="all"
            />
          </HeaderSelectBox>
        </HeaderSelectCoin>
        <HeaderSearchCoin>
          <SearchCoin setInputCoinNameSetter={setInputCoinName} />
        </HeaderSearchCoin>
      </Header>
      <Body>
        {coinList?.map((coin: MarketCapInfo, index) => {
          return (
            <SelectCoinInnerLayer
              key={index}
              style={
                inputCoinName
                  ? coinDict[inputCoinName]?.includes(coin.name)
                    ? { display: 'flex' }
                    : { display: 'none' }
                  : {}
              }
            >
              <Image src={coin.logo} alt="" width={44} height={44} />
              <SelectCoinInnerFont>{coin.name_kr}</SelectCoinInnerFont>
              <Checkbox
                checked={
                  checked[coin.name] !== undefined ? checked[coin.name] : false
                  //undefined일때 처리 안해주면 mui에러 남..
                }
                onChange={coinCheck}
                name={coin.name}
              />
            </SelectCoinInnerLayer>
          )
        })}
      </Body>
    </Container>
  )
}

const Container = styled('div')`
  display: flex;
  background-color: '#ffffff';
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-bottom: 100px;
`
const Header = styled('div')`
  padding: 1rem;
  align-items: center;
`
const HeaderSelectCoin = styled('div')`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  align-items: center;
`
const HeaderSearchCoin = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Body = styled('div')`
  overflow: scroll;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const HeaderTitle = styled('div')`
  font-size: 1.5rem;
`

const HeaderSelectBox = styled('div')`
  display: flex;
  align-items: center;
`

const HeaderSelectBoxContent = styled('div')`
  font-size: 0.8rem;
`

const SelectCoinInnerLayer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  width: 100%;
`

const SelectCoinInnerFont = styled('div')`
  align-items: center;
  font-size: 1rem;
`
