import LinkButton from '@/components/LinkButton'
import { styled } from '@mui/material'
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
  return (
    <StyledNotFound>
      <h1>404 - 존재하지 않는 페이지입니다.</h1>
      <Image
        src={'/doge.svg'}
        alt="/logo-only-white.svg"
        width={500}
        height={500}
      />
      <p>
        버튼을 클릭하여 메인 화면으로 돌아가거나, 검색창에서 원하는 코인을
        검색하세요.
      </p>
      <LinkButton goto="/" content="메인 화면으로 돌아가기" />
    </StyledNotFound>
  )
}
