import Image from 'next/image'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { styled } from '@mui/material/styles'
import { Container, useMediaQuery, useTheme } from '@mui/material'

const GNBContainer = styled('div')`
  display: flex;
  height: 96px;
  background-color: ${props => props.theme.palette.primary.main};
  ${props => props.theme.breakpoints.down('sm')} {
    height: 64px;
  }
  ${props => props.theme.breakpoints.up('lg')} {
    background-color: ${props => props.theme.palette.primary.dark};
  }
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export default function GNB() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <GNBContainer>
      <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center' }}>
        {isMobile ? (
          <Image src="/logo-only-white.svg" alt="" width={40} height={40} />
        ) : (
          <Image src="/logo-white.svg" alt="" width={200} height={48} />
        )}
        {!isMobile && (
          <TextField
            sx={{ marginLeft: 'auto' }}
            InputProps={{
              sx: {
                backgroundColor: 'white',
                height: '48px',
                width: { sm: 300, md: 480, lg: 600 },
                p: 2,
                gap: 2
              },
              placeholder: '검색어를 입력하세요',
              startAdornment: <SearchIcon sx={{ opacity: 0.2 }} />,
              endAdornment: <HighlightOffIcon sx={{ opacity: 0.2 }} />
            }}
          />
        )}
      </Container>
    </GNBContainer>
  )
}
