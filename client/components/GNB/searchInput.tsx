import * as React from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import SearchIcon from '@mui/icons-material/Search'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
export default function SearchInput() {
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={coinInfos.map(option => option.title)}
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
}

const coinInfos = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 }
]
