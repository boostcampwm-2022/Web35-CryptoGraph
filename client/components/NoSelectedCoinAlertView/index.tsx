import { useMediaQuery, useTheme } from '@mui/material'
import { styled } from '@mui/material'
import Image from 'next/image'

const Container = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 2em;
    font-weight: bold;
  }

  p {
    font-size: 1.5em;
    text-align: center;
    color: #666;
  }
`

export function NoSelectedCoinAlertView() {
  const isMobile = useMediaQuery(useTheme().breakpoints.down('tablet'))
  return (
    <Container>
      <h1>선택된 코인이 없습니다..</h1>
      <Image
        src={'/doge.svg'}
        alt="/logo-only-white.svg"
        width={300}
        height={300}
      />
      <p>
        {isMobile
          ? '하단의 "차트 정보 더보기" 버튼을 클릭하여 차트에 보여줄 코인들을 선택해 주세요'
          : '좌측의 사이드바에서 차트에 보여줄 코인들을 선택해 주세요'}
      </p>
    </Container>
  )
}
