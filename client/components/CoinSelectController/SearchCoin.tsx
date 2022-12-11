import TextField from '@mui/material/TextField'
import { debounce } from 'lodash'

interface SearchCoinProps {
  setInputCoinNameSetter: React.Dispatch<React.SetStateAction<string>>
}

export default function SearchCoin({
  setInputCoinNameSetter
}: SearchCoinProps) {
  const handleChange = debounce(event => {
    setInputCoinNameSetter(event.target.value.toUpperCase())
  }, 10)
  return (
    <TextField
      label=""
      onChange={handleChange}
      placeholder={'검색어를 입력하세요'}
      inputProps={{
        maxLength: 25
      }}
      sx={textFieldStyle}
    />
  )
}

const textFieldStyle = {
  backgroundColor: 'white',
  height: '48px',
  width: '100%',
  pl: 2,
  gap: 2
}
