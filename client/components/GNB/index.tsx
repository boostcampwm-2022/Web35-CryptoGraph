import Image from 'next/image'
import { styled } from '@mui/material/styles'
import { Container, useMediaQuery, useTheme } from '@mui/material'
import SearchInput from './SearchInput'
import Link from 'next/link'

export default function GNB() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))
  return (
    <GNBContainer>
      <Container maxWidth="max" id="GNBcontainer" sx={ContainerStyle}>
        {isMobile ? (
          <Link href="/">
            <Image
              style={MobileImageStyle}
              src="/logo-only-white.svg"
              alt=""
              width={40}
              height={40}
            />
          </Link>
        ) : (
          <Link href="/">
            <Image
              style={DesktopImageStyle}
              src="/logo-white.svg"
              alt=""
              width={200}
              height={48}
            />
          </Link>
        )}
        <SearchInput />
      </Container>
    </GNBContainer>
  )
}
const ContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '16px'
}
const MobileImageStyle = { paddingRight: '16px' }
const DesktopImageStyle = { margin: '0px 16px 0px 32px' }

const GNBContainer = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 96px;
  padding-top: 24px;
  background-color: ${props => props.theme.palette.primary.main};
  ${props => props.theme.breakpoints.down('tablet')} {
    padding-top: 8px;
    height: 64px;
  }
  ${props => props.theme.breakpoints.up('tablet')} {
    background-color: ${props => props.theme.palette.primary.dark};
  }
  align-items: center;
  justify-content: space-between;
  width: 100%;
`
