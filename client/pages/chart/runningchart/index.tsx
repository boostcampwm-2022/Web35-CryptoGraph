import { useState, useEffect, useRef, useReducer } from 'react'
import { dataReducer } from 'hooks/reducers/dataReducer'
import { ActionType, EmptyObject, CoinRateType } from '@/types/ChartTypes'
import { RunningChart } from '@/components/RunningChart'

export default function RunningChartPage() {
  const [coinRate, setCoinRate] = useState<CoinRateType>({}) //coin의 등락률 값
  const [data, dispatch] = useReducer<
    (
      data: CoinRateType | EmptyObject,
      action: ActionType
    ) => CoinRateType | undefined
  >(dataReducer, {} as never) //coin의 등락률 변화값을 받아서 coinRate에 넣어줌
  useEffect(() => {
    dispatch({ type: 'init', coinRate: {} }) //coinRate초기세팅
  }, [])
  useEffect(() => {
    setCoinRate(data)
    // console.log('fetchedData :', data) // : {values} 잘나옴
    // console.log('fetchedData.keys : ', Object.keys(data)) //: {}빈객체 ???????
    //위 이슈때문에 coinRate의 빈객체 방지로직을 못짜고 러닝차트 컴포넌트에서 적용했습니다(184 번째 줄)
  }, [data])
  return (
    <>
      <RunningChart coinRate={coinRate} candleCount={20}></RunningChart>
    </>
  )
}
