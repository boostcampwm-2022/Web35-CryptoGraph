import { useState, useEffect, useRef, useReducer } from 'react'
import useInterval from 'hooks/useInterval'
import { dataReducer } from 'hooks/reducers/dataReducer'
import { ActionType, EmptyObject, CoinRateType } from '@/types/ChartTypes'
import { RunningChart } from '@/components/RunningChart'

const COIN_INTERVAL_RATE = 1000
export default function RunningChartPage() {
  const [coinRate, setCoinRate] = useState<CoinRateType[]>([]) //coin의 등락률 값
  const [data, dispatch] = useReducer<
    (
      data: CoinRateType | EmptyObject,
      action: ActionType
    ) => CoinRateType | undefined
  >(dataReducer, {} as never) //coin의 등락률 변화값을 받아서 coinRate에 넣어줌
  useEffect(() => {
    dispatch({ type: 'init', coinRate: coinRate[0] }) //coinRate초기세팅
  }, [])

  useInterval(() => {
    // 2. 주기적으로 코인 등락률을 업데이트
    dispatch({ type: 'update', coinRate: coinRate[0] }) //coinRate업데이트
    if (data) {
      //비동기 검증
      setCoinRate([data])
    }
  }, COIN_INTERVAL_RATE)
  return (
    <>
      <RunningChart
        coinRate={coinRate}
        WIDTH={1000}
        HEIGHT={800}
        CANDLECOUNT={15}
      ></RunningChart>
    </>
  )
}
