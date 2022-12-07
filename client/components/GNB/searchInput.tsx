import * as React from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import SearchIcon from '@mui/icons-material/Search'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { getMarketCapInfo } from '@/utils/metaDataManages'
import { MarketCapInfo } from '@/types/CoinDataTypes'
import { useRouter } from 'next/router'
import { matchNameKRwithENG, validateInputName } from '@/utils/inputBarManager'
export default function SearchInput() {
  /* -------------주의------------- */
  // CoinNames의 fetch는 api_server를 이용했습니다.
  // express서버를 키고 작동해야 제대로 받아올 수 있습니다.
  const [CoinNames, setCoinNames] = React.useState<MarketCapInfo[]>([])
  const router = useRouter()
  React.useEffect(() => {
    async function asyncGetCoinName() {
      const data: MarketCapInfo[] | null = await getMarketCapInfo()
      if (!data) {
        console.error('검색바 자동완성기능 데이터 fetch 에러')
        return
      }
      setCoinNames(data)
    }
    asyncGetCoinName()
  }, [])
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={
          CoinNames.length
            ? [
                ...CoinNames.map((coin: MarketCapInfo) => coin.name),
                ...CoinNames.map((coin: MarketCapInfo) => coin.name_kr)
              ]
            : [] //CoinName 검증을 위한 삼항연산자 만일 fetch 되지않았으면 껍데기만 보이게 함
        }
        renderInput={params => (
          <TextField
            sx={{ marginLeft: 'auto' }}
            {...params}
            InputProps={{
              ...params.InputProps,
              type: 'search',
              sx: {
                backgroundColor: 'white',
                height: '48px',
                width: { mobile: '100%', tablet: 400, desktop: 600 },
                p: 2,
                gap: 2
              },
              placeholder: '검색어를 입력하세요',
              endAdornment: <SearchIcon sx={{ opacity: 0.2 }} />
            }}
          />
        )}
        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
          const inputCoinName = (e.target as HTMLInputElement).value
          if (e.key === 'Enter') {
            //1.입력값이 db에 있는지 검증하는 로직
            //2.로직을 통과하면 해당 값으로 리다이렉트
            if (validateInputName(CoinNames, inputCoinName)) {
              const engCoinName = matchNameKRwithENG(CoinNames, inputCoinName)
              //생각해볼점
              //window.history.pushState('', 'asdf', `/detail/${engCoinName}`)
              router.replace(`/detail/${engCoinName}`)
              // window.location.href = `/detail/${engCoinName}`
            }
          }
        }}
      />
    </Stack>
  )
}
