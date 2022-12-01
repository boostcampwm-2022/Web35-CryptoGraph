import * as React from 'react'
import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { domainToASCII } from 'url'

interface CoinSelectControllerProps {
  isSideBarOpened: boolean
}

interface CoinInfo {
  name: string
  cmc_rank: number
  name_kr: string
  logo: string
}

interface CoinChecked {
  [key: string]: boolean
}

const SelectCoinTitle = styled('div')`
  display: flex;
  justify-content: space-between;
  margin: 8% 12%;
  align-items: center;
`
const SelectCoinTitleFont = styled('div')`
  font-size: 24px;
`

const SelectCoinTitleBox = styled('div')`
  display: flex;
  align-items: center;
`

const SelectCoinTitleBoxFont = styled('div')`
  font-size: 12px;
`

const SelectCoinInnerLayer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8% 12%;
`

const SelectCoinInnerFont = styled('div')`
  align-items: center;
  margin: 8% 12%;
  font-size: 24px;
`

const SelectCoinHead = styled('div')`
  overflow: scroll;
  height: 100%;
`

const getCoinInfo = async () => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_SERVER_URL + '/market-cap-info',
    {
      method: 'GET',
      headers: { accept: 'application/json' }
    }
  )
  return res.json()
}

export default function CoinSelectController(props: CoinSelectControllerProps) {
  const [coinList, setCoinList] = useState<CoinInfo[]>([])
  const [checked, setChecked] = useState<CoinChecked>({
    all: true
  })

  useEffect(() => {
    getCoinInfo().then(data => {
      setCoinList(data)
    })
  }, [])

  useEffect(() => {
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
    <>
      <SelectCoinHead
        style={{ display: props.isSideBarOpened ? 'block' : 'none' }}
      >
        <SelectCoinTitle>
          <SelectCoinTitleFont>코인선택</SelectCoinTitleFont>
          <SelectCoinTitleBox>
            <SelectCoinTitleBoxFont>전부 [선택/해제]</SelectCoinTitleBoxFont>
            <Checkbox
              checked={checked.all}
              onChange={coinCheckAll}
              name="all"
            />
          </SelectCoinTitleBox>
        </SelectCoinTitle>
        {coinList.map((coin: CoinInfo, index) => {
          return (
            <SelectCoinInnerLayer key={index}>
              <Image src={coin.logo} alt="" width={44} height={44} />
              <SelectCoinInnerFont>{coin.name_kr}</SelectCoinInnerFont>
              <Checkbox
                checked={checked[coin.name]}
                onChange={coinCheck}
                name={coin.name}
              />
            </SelectCoinInnerLayer>
          )
        })}
      </SelectCoinHead>
    </>
  )
}
