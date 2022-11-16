import Image from 'next/image'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import styled from '@emotion/styled'

export default function Gnb({}) {
  const BackgroundStyle = styled.div`
    width: 100%;
    background-color: #381e72;
  `
  const ContentStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  `
  const LogoStyle = styled.div`
    margin: 32px 0px 32px 48px;
  `
  const UserInfoStyle = styled.div`
    margin: 16px 64px 16px 0px;
  `
  return (
    <>
      <BackgroundStyle>
        <ContentStyle>
          <LogoStyle>
            <Image src="/logo-white.svg" alt="" width={288} height={80} />
          </LogoStyle>
          <TextField
            InputProps={{
              sx: {
                backgroundColor: 'white',
                height: '80px',
                width: '720px',
                margin: '32px 192px 32px 0px',
                p: 2,
                gap: 2
              },
              placeholder: 'Label',
              startAdornment: <SearchIcon sx={{ opacity: 0.2 }} />,
              endAdornment: <HighlightOffIcon sx={{ opacity: 0.2 }} />
            }}
          />
          <UserInfoStyle>
            <Image src="/userInfo.svg" alt="" width={96} height={96} />
          </UserInfoStyle>
        </ContentStyle>
      </BackgroundStyle>
    </>
  )
}
