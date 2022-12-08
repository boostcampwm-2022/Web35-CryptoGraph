import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import { MarketCapInfo } from '@/types/CoinDataTypes'
import { useState } from 'react'

export default function SearchCoin(data) {
  const [coinName, setCoinName] = useState('')
  const [inputCoinName, setInputCoinName] = useState('')
  console.log(coinName)
  console.log(inputCoinName)
  //실시간으로 밑에 코인이 변하면서 보이기 vs 엔터 후 보이기
  return (
    <Autocomplete
      freeSolo
      disableClearable
      options={
        data.coinNames.length
          ? [
              ...data.coinNames.map((coin: MarketCapInfo) => coin.name),
              ...data.coinNames.map((coin: MarketCapInfo) => coin.name_kr)
            ]
          : [] //CoinName 검증을 위한 삼항연산자 만일 fetch 되지않았으면 껍데기만 보이게 함
      }
      renderInput={params => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            type: 'search',
            sx: {
              backgroundColor: 'white',
              height: '48px',
              width: { mobile: '100%', tablet: 200, desktop: 320 },
              p: 2,
              gap: 2
            },
            placeholder: '검색어를 입력하세요',
            endAdornment: <SearchIcon sx={{ opacity: 0.2 }} />
          }}
        />
      )}
      onChange={(event, newCoinName) => {
        setCoinName(newCoinName)
      }}
      onInputChange={(event, newCoinName) => {
        setInputCoinName(newCoinName)
      }}
      // onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
      //   setInputCoinName(e.target.value)
      // }}
    />
  )
}
