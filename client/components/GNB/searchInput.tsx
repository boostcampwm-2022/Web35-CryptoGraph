import * as React from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import SearchIcon from '@mui/icons-material/Search'
import { MarketCapInfo } from '@/types/CoinDataTypes'
//import { useRouter } from 'next/router'
import { matchNameKRwithENG, validateInputName } from '@/utils/inputBarManager'

interface SearchInputProps {
  data: MarketCapInfo[]
}

export default function SearchInput({ data }: SearchInputProps) {
  /* -------------주의------------- */
  // CoinNames의 fetch는 api_server를 이용했습니다.
  // express서버를 키고 작동해야 제대로 받아올 수 있습니다.
  const [coins, setCoins] = React.useState<MarketCapInfo[]>(data)
  //const router = useRouter()
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={
          coins
            ? [
                ...coins.map((coin: MarketCapInfo) => coin.name),
                ...coins.map((coin: MarketCapInfo) => coin.name_kr)
              ]
            : [] //coinNames 검증을 위한 삼항연산자 만일 fetch 되지않았으면 껍데기만 보이게 함
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
            if (validateInputName(coins, inputCoinName)) {
              const engCoinName = matchNameKRwithENG(coins, inputCoinName)
              //생각해볼점   router.push(`/detail/${engCoinName}`)
              window.location.href = `/detail/${engCoinName}`
            }
          }
        }}
      />
    </Stack>
  )
}
