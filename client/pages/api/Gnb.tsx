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
    justify-content: space-between;
    width: 100%;
  `
  const LogoStyle = styled.div`
    margin: 33px 0px 28px 50px;
  `
  const UserInfoStyle = styled.div`
    margin: 20px 64px 20px 0px;
  `

  return (
    <>
      <BackgroundStyle>
        <ContentStyle>
          <LogoStyle>
            <Image src="/logo-white.svg" alt="" width={291.31} height={79} />
          </LogoStyle>
          <TextField
            InputProps={{
              sx: {
                backgroundColor: 'white',
                height: '79px',
                width: '710px',
                margin: '33px 0px 28px 0px',
                p: 2,
                gap: 2
              },
              placeholder: 'Label',
              startAdornment: <SearchIcon sx={{ opacity: 0.2 }} />,
              endAdornment: <HighlightOffIcon sx={{ opacity: 0.2 }} />
            }}
          ></TextField>
          <UserInfoStyle>
            <Image src="/userInfo.svg" alt="" width={100} height={100} />
          </UserInfoStyle>
        </ContentStyle>
      </BackgroundStyle>
    </>
  )
}
