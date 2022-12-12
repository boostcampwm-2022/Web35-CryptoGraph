import { styled } from '@mui/material/styles'
import { Container, useMediaQuery, useTheme } from '@mui/material'
import SearchInput from './SearchInput'
import LogoImg from './LogoImg'

export default function GNB() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))
  return (
    <GNBContainer>
      <Container maxWidth="max" id="GNBcontainer" sx={ContainerStyle}>
        <LogoImg isMobile={isMobile} />
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
