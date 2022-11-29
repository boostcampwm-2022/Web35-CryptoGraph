import { useState, useEffect, useRef, useReducer } from 'react'
import useInterval from 'hooks/useInterval'
import { dataReducer } from 'hooks/reducers/dataReducer'
import { ActionType, EmptyObject, CoinRateType } from '@/types/ChartTypes'
import { RunningChart } from '@/components/RunningChart'

const COIN_INTERVAL_RATE = 1000
export default function TreeChartPage() {
  const [coinRate, setCoinRate] = useState<CoinRateType[]>([]) //coin의 등락률 값
  const [data, dispatch] = useReducer<
    (
      data: CoinRateType | EmptyObject,
      action: ActionType
    ) => CoinRateType | undefined
  >(dataReducer, {} as never) //coin의 등락률 변화값을 받아서 coinRate에 넣어줌
  useEffect(() => {
    // 1. 러닝맵 초기화(width,height 설정) 및  티커 추가
    // initChart(chartSvg)
    dispatch({ type: 'init', coinRate: coinRate[0] })
  }, [])

  useInterval(() => {
    // 2. 주기적으로 코인 등락률을 업데이트
    dispatch({ type: 'update', coinRate: coinRate[0] })
    if (data) {
      setCoinRate([data])
    }
  }, COIN_INTERVAL_RATE)

  return (
    <>
      <RunningChart coinRate={coinRate[0]}></RunningChart>
    </>
  )
}
