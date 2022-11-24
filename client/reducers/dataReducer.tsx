import { useReducer } from 'react'
import { getCoinTicker } from '@/utils/upbitManager'
import { getTreeMapDataArray } from '@/utils/upbitManager'

export const dataReducer = (data, action) => {
  switch (action.type) {
    case 'init':
      action.coinRate = {}
      getCoinTicker().then(data => {
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
        for (const coin of data) {
          if (action.coinRate[coin.market]) {
            console.log(coin)
            action.coinRate[coin.market].value = (
              coin.signed_change_rate * 100
            ).toFixed(2)
          }
        }
      })
      return action.coinRate
  }
}
