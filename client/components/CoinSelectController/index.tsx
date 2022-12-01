import * as React from 'react'
import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface CoinSelectControllerProps {
  isSideBarOpened: boolean
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

const getData = () => {
  return 'hello'
}

//코인 상세정보
export default function CoinSelectController(props: CoinSelectControllerProps) {
  const [coinList, setCoinList] = useState([])
  // {
  //   name: 영문이름,
  //   name_kr: 한글이름,
  //   logo: 이미지 url,
  //   cmc_rank: 시가총액 순위
  //   }[ ]

  useEffect(() => {
    getCoinInfo().then(data => {
      setCoinList(data)
    })
  }, [])

  return (
    <>
      <SelectCoinHead
        style={{ display: props.isSideBarOpened ? 'block' : 'none' }}
      >
        <SelectCoinTitle>
          <SelectCoinTitleFont>코인선택</SelectCoinTitleFont>
          <SelectCoinTitleBox>
            <SelectCoinTitleBoxFont>전부 [선택/해제]</SelectCoinTitleBoxFont>
            <Checkbox />
          </SelectCoinTitleBox>
        </SelectCoinTitle>
        {coinList.map((coin, index) => {
          return (
            <SelectCoinInnerLayer key={index}>
              <Image src={coin.logo} alt="" width={44} height={44} />
              <SelectCoinInnerFont>{coin.name_kr}</SelectCoinInnerFont>
              <Checkbox onClick={getData} />
            </SelectCoinInnerLayer>
          )
        })}
      </SelectCoinHead>
    </>
  )
}
