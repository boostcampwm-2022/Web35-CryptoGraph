import * as React from 'react'
import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getMarketCapInfo } from '@/utils/metaDataManages'
import { MarketCapInfo } from '@/types/CoinDataTypes'

interface CoinChecked {
  [key: string]: boolean
}

export default function CoinSelectController() {
  const [coinList, setCoinList] = useState<MarketCapInfo[] | null>([])
  const [checked, setChecked] = useState<CoinChecked>({
    all: false
  })

  useEffect(() => {
    getMarketCapInfo().then(data => {
      setCoinList(data)
    })
  }, [])

  useEffect(() => {
    if (coinList == null) return
    for (const coin of coinList) {
      checked[coin.name] = false
    }

    setChecked({
      ...checked
    })
  }, [coinList])
  const coinCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    for (const coin in checked) {
      checked[coin] = event.target.checked
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
        <HeaderTitle>코인선택</HeaderTitle>
        <HeaderSelectBox>
          <HeaderSelectBoxContent>전부 [선택/해제]</HeaderSelectBoxContent>
          <Checkbox checked={checked.all} onChange={coinCheckAll} name="all" />
        </HeaderSelectBox>
      </Header>
      <Body>
        {coinList?.map((coin: MarketCapInfo, index) => {
          return (
            <SelectCoinInnerLayer key={index}>
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
  flex-direction: column;
  width: 100%;
  height: 100%;
`
const Header = styled('div')`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
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
