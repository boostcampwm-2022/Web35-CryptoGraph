import * as React from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import SearchIcon from '@mui/icons-material/Search'
import { getMarketCapInfo } from '@/utils/metaDataManages'
import { MarketCapInfo } from '@/types/CoinDataTypes'
import { useRouter } from 'next/router'
import { matchNameKRwithENG, validateInputName } from '@/utils/inputBarManager'
import { useMediaQuery } from '@mui/material'
import theme from '@/styles/theme'
export default function SearchInput() {
  /* -------------주의------------- */
  // CoinNames의 fetch는 api_server를 이용했습니다.
  // express서버를 키고 작동해야 제대로 받아올 수 있습니다.
  const [CoinNames, setCoinNames] = React.useState<MarketCapInfo[]>([])
  const inputRef = React.useRef<HTMLInputElement>()
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))
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
  function goToDetail(value: string) {
    const inputCoinName = value
    if (validateInputName(CoinNames, inputCoinName)) {
      const engCoinName = matchNameKRwithENG(CoinNames, inputCoinName)
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
      sx={isMobile ? { width: 400 } : { paddingLeft: '68px', width: 400 }}
    >
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        onChange={(e, value) => goToDetail(value)}
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
                <a
                  style={{ display: 'flex', alignItems: 'center' }}
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
