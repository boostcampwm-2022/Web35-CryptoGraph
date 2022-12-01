import * as React from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import SearchIcon from '@mui/icons-material/Search'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
export default function SearchInput() {
  /* -------------주의------------- */
  // CoinNames의 fetch는 api_server를 이용했습니다.
  // express서버를 키고 작동해야 제대로 받아올 수 있습니다.
  fetchCoinNames().then(CoinNames => {
    return (
      <Stack spacing={2} sx={{ width: 300 }}>
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          options={CoinNames.map((coin: any) => coin.name)}
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
                startAdornment: <SearchIcon sx={{ opacity: 0.2 }} />,
                endAdornment: <HighlightOffIcon sx={{ opacity: 0.2 }} />
              }}
            />
          )}
        />
      </Stack>
    )
  }) //next.js v13
}

//원래 fetch부분을 SSR로 미리 받아올까했었는데
//Next.js 13버전에서는 더이상 getServerSideProps를 사용하지 않는다고해서
//그냥 이렇게 SSG로 만들어 봤습니다. 어차피 저희는 코인 이름만 필요하니까요
//참고자료 https://youtu.be/5BRFGMs1v_o?t=137
//참고자료2 https://itchallenger.tistory.com/778
export async function fetchCoinNames() {
  const res = await fetch('http://localhost:8080/market-cap-info')
  const data = await res.json()
  return data
}
