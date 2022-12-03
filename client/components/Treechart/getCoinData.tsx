import { getCoinTicker } from '@/utils/upbitManager'
import { getTreeMapDataArray } from '@/utils/upbitManager'

export async function getTreeData() {
  let coinRate = {}
  const updateData = await getCoinTicker()
    .then(data => {
      for (const coin of data) {
        if (coin.market.split('-')[0] === 'KRW') {
          coinRate[coin.market] = {
            name: coin.market.split('-')[1],
            ticker: coin.market,
            parent: 'Origin',
            value: 1
          }
        }
      }
      return coinRate
    })
    .then(data => {
      return updateTreeData(data)
    })
  return updateData
}

export function updateTreeData(coinRate) {
  if (!coinRate) {
    return
  }
  const tick = Object.keys(coinRate).join(',')
  //tick은 코인들의 이름배열 [KRW-BTC,KRW-ETC 등등]
  getTreeMapDataArray(tick).then(data => {
    //data는 코인별 실시간 정보
    // 업비트에 선택된 티커에 대한 코인등락률을 받아와서 기존 데이터 업데이트
    for (const coin of data) {
      if (coinRate[coin.market]) {
        coinRate[coin.market].value = Number(
          (coin.signed_change_rate * 100) //실시간 등락rate를 퍼센테이지로 변경
            .toFixed(2)
        ) //소수점 두자리로 fix
      }
    }
  })
  return coinRate
}
