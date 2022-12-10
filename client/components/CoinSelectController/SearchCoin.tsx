import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import { MarketCapInfo } from '@/types/CoinDataTypes'
import { debounce } from 'lodash'
import { useContext } from 'react'
import { MyAppContext } from '../../pages/_app'

interface SearchCoinProps {
  inputCoinName: string
  setInputCoinNameSetter: React.Dispatch<React.SetStateAction<string>>
}

export default function SearchCoin({
  inputCoinName,
  setInputCoinNameSetter
}: SearchCoinProps) {
  const data = useContext(MyAppContext)
  return (
    <Autocomplete
      freeSolo
      disableClearable
      options={
        data.length
          ? [
              ...data.map((coin: MarketCapInfo) => coin.name),
              ...data.map((coin: MarketCapInfo) => coin.name_kr)
            ]
          : [] //CoinName 검증을 위한 삼항연산자 만일 fetch 되지않았으면 껍데기만 보이게 함
      }
      renderInput={params => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            maxLength: 25
          }}
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
      onInputChange={debounce((event, newCoinName) => {
        setInputCoinNameSetter(newCoinName.toUpperCase())
      }, 10)}
    />
  )
}
