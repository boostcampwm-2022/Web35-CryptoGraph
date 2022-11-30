import * as React from 'react'
import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'

interface CoinSelectControllerProps {
  isSideBarOpened: boolean
}
const SelectCoinTitle = styled('div')`
  display: flex;
  justify-content: space-between;
  margin: 24px;
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
  font-size: 16px;
`

const SelectCoinInnerLayer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 24px;
`

const SelectCoinInnerFont = styled('div')`
  align-items: center;
  margin: 16px;
  font-size: 24px;
`

//코인 상세정보
export default function CoinSelectController(props: CoinSelectControllerProps) {
  const coinList = ['bit', 'eth', 'xrp', 'doge']
  return (
    <>
      <div style={{ display: props.isSideBarOpened ? 'block' : 'none' }}>
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
              <SelectCoinInnerFont>{coin}</SelectCoinInnerFont>
              <Checkbox />
            </SelectCoinInnerLayer>
          )
        })}
      </div>
    </>
  )
}
