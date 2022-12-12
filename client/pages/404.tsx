import LinkButton from '@/components/LinkButton'
import { styled, useMediaQuery, useTheme } from '@mui/material'
import Image from 'next/image'

const StyledNotFound = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 3em;
    font-weight: bold;
  }

  p {
    font-size: 1.5em;
    color: #666;
  }
`

export default function My404Page() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'))
  return (
    <StyledNotFound>
      <h1>404 - 존재하지 않는 페이지</h1>
      <Image
        src={'/doge.svg'}
        alt="/logo-only-white.svg"
        width={isMobile ? 200 : 500}
        height={isMobile ? 200 : 500}
      />
      <p>
        버튼을 클릭하여 메인 화면으로 돌아가거나, 검색창에서 원하는 코인을
        검색하세요.
      </p>
      <div style={{ width: '200px', maxWidth: '50vw' }}>
        <LinkButton goto="/" content="메인 화면으로 돌아가기" />
      </div>
    </StyledNotFound>
  )
}
