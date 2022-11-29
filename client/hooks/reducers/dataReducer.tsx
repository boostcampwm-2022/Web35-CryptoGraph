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
        //각 코인별 english_name, korean_name, market이름을 객체 배열로 가져옴
        //english_name: "Bitcoin"
        //korean_name: "비트코인"
        //market: "KRW-BTC"
        // 선택한 코인 티커를 받아오는 작업
        for (const key of data) {
          if (key.market.split('-')[0] === 'KRW') {
            action.coinRate[key.market] = {
              name: key.market.split('-')[1],
              ticker: key.market,
              parent: 'Origin',
              value: 1
            }
            //위 값에 KRW-BTC를 대입한경우 예시 :
            //action.coinRate[KRW-BTC] = {
            //name: BTC,
            //ticker : KRW-BTC,
            //parent:'Origin,
            //value:1
            //}
          }
        }
      })
      return action.coinRate
    case 'update':
      const tick = Object.keys(action.coinRate).join(',')
      //tick은 코인들의 이름배열 [KRW-BTC,KRW-ETC 등등]
      getTreeMapDataArray(tick).then(data => {
        //data는 코인별 실시간 정보
        // 업비트에 선택된 티커에 대한 코인등락률을 받아와서 기존 데이터 업데이트
        for (const coin of data) {
          if (action.coinRate[coin.market]) {
            action.coinRate[coin.market].value = (
              coin.signed_change_rate * 100 //실시간 등락rate를 퍼센테이지로 변경
            ).toFixed(2)//소수점 두자리로 fix
          }
        }
      })
      return action.coinRate
  }
}
