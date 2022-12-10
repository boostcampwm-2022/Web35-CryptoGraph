import Image from 'next/image'
import { styled } from '@mui/material/styles'
import { Container, useMediaQuery, useTheme } from '@mui/material'
import SearchInput from './SearchInput'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function GNB() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))
  const router = useRouter()
  return (
    <GNBContainer>
      <Container
        maxWidth="max"
        id="GNBcontainer"
        sx={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '16px'
        }}
      >
        {isMobile ? (
          //Router.push / Router.replace / Link태그 사용시 메인페이지->메인페이지 새로고침 불가능 => reload로 해결
          //ex)코인선택 기능을 여러번 사용하고 트리맵화면에서 logo아이콘 클릭시 다시 기본세팅 (코인세팅 전부 , 러닝차트 descending) 되지않음
          <Link href="/" onClick={() => router.reload()}>
            <Image
              style={{ paddingRight: '16px' }}
              src="/logo-only-white.svg"
              alt=""
              width={40}
              height={40}
            />
          </Link>
        ) : (
          <Link href="/" onClick={() => router.reload()}>
            <Image src="/logo-white.svg" alt="" width={200} height={48} />
          </Link>
        )}
        <SearchInput />
      </Container>
    </GNBContainer>
  )
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
