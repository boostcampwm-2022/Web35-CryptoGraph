import * as React from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import SearchIcon from '@mui/icons-material/Search'
import { MarketCapInfo } from '@/types/CoinDataTypes'
import { matchNameKRwithENG, validateInputName } from '@/utils/inputBarManager'
import { MyAppContext } from '../../pages/_app'

export default function SearchInput() {
  const data = React.useContext(MyAppContext)
  const inputRef = React.useRef<HTMLInputElement>()
  function goToDetail(value: string) {
    const inputCoinName = value
    if (validateInputName(data, inputCoinName)) {
      const engCoinName = matchNameKRwithENG(data, inputCoinName)
      //생각해볼점
      //window.history.pushState('', 'asdf', `/detail/${engCoinName}`)
      // router.replace(`/detail/${engCoinName}`)
      window.location.href = `/detail/${engCoinName}`
      // router.push(`/detail/${engCoinName}`)
    }
  }
  return (
    <Stack spacing={2} sx={{ width: 400 }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        onChange={(e, value) => goToDetail(value)}
        options={[
          ...data.map((coin: MarketCapInfo) => coin.name),
          ...data.map((coin: MarketCapInfo) => coin.name_kr)
        ]}
        renderInput={params => (
          <TextField
            inputRef={inputRef}
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
              endAdornment: (
                <a
                  href=""
                  onClick={e => {
                    e.preventDefault()
                    if (inputRef.current) goToDetail(inputRef.current.value)
                  }}
                >
                  <SearchIcon sx={{ opacity: 0.2 }} />
                </a>
              )
            }}
          />
        )}
      />
    </Stack>
  )
}
