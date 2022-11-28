import { useReducer } from 'react'
import { getCoinTicker } from '@/utils/upbitManager'
import { getTreeMapDataArray } from '@/utils/upbitManager'
import { ActionType } from '@/types/ChartTypes'
import { CoinRateType } from '@/types/ChartTypes'

export const dataReducer = (data: CoinRateType, action: ActionType) => {
  switch (action.type) {
    case 'init':
      action.coinRate = {}
      getCoinTicker().then(data => {
        // 선택한 코인 티커를 받아오는 작업
        for (const key of data) {
          if (key.market.split('-')[0] === 'KRW') {
            action.coinRate[key.market] = {
              name: key.market.split('-')[1],
              ticker: key.market,
              parent: 'Origin',
              value: 1
            }
          }
        }
      })
      return action.coinRate
    case 'update':
      const tick = Object.keys(action.coinRate).join(',')
      getTreeMapDataArray(tick).then(data => {
        // 업비트에 선택된 티커에 대한 코인등락률을 받아와서 기존 데이터 업데이트
        for (const coin of data) {
          if (action.coinRate[coin.market]) {
            action.coinRate[coin.market].value = (
              coin.signed_change_rate * 100
            ).toFixed(2)
          }
        }
      })
      return action.coinRate
  }
}
