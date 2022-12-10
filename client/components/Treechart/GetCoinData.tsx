import { getTreeMapDataArray } from '@/utils/upbitManager'
import { CoinRateType } from '@/types/ChartTypes'

export async function UpdateTreeData(coinRate: CoinRateType) {
  const tosetData = { ...coinRate }
  const tick = Object.keys(tosetData).join(',')
  //tick은 코인들의 이름배열 [KRW-BTC,KRW-ETC 등등]
  const allUpbitData = await getTreeMapDataArray(tick)
  for (const coin of allUpbitData) {
    if (tosetData[coin.market]) {
      tosetData[coin.market].value = Number(
        (coin.signed_change_rate * 100) //실시간 등락rate를 퍼센테이지로 변경
          .toFixed(2)
      ) //소수점 두자리로 fix
    }
  }
  return tosetData
}
