import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import SearchIcon from '@mui/icons-material/Search'
import { MarketCapInfo } from '@/types/CoinDataTypes'
import { matchNameKRwithENG, validateInputName } from '@/utils/inputBarManager'
import { MyAppContext } from '../../pages/_app'
import { useMediaQuery } from '@mui/material'
import theme from '@/styles/theme'
import { styled } from '@mui/system'
import { useContext, useRef } from 'react'

export default function SearchInput() {
  const data = useContext(MyAppContext)
  const inputRef = useRef<HTMLInputElement>()
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))
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
    <Stack
      spacing={2}
      sx={isMobile ? { width: 400 } : { paddingLeft: '68px', width: 400 }} //단순 스타일링을 위한 매직넘버사용
    >
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
              //하나의 TextField도 여러 div태그로 겹겹이 감싸져있기때문에 sx스타일로 처리하면 타겟 태그에 padding적용이 안되서 따로 빼서 다이렉트로 적용.
              style: { padding: '0px 12px' },
              sx: {
                backgroundColor: 'white',
                height: '48px',
                width: { mobile: '100%', tablet: 400, desktop: 600 },
                p: 1,
                gap: 2
              },
              placeholder: '검색어를 입력하세요',
              endAdornment: (
                <StyledSearchIcon
                  href=""
                  onClick={e => {
                    e.preventDefault()
                    if (inputRef.current) goToDetail(inputRef.current.value)
                  }}
                >
                  <SearchIcon sx={{ opacity: 0.2 }} />
                </StyledSearchIcon>
              )
            }}
          />
        )}
      />
    </Stack>
  )
}
const StyledSearchIcon = styled('a')`
  display: flex;
  align-items: center;
`
