import styled from '@emotion/styled'
import { Button } from '@mui/material'
import Chartbutton from './components/ChartButton'

const StyledMainSection = styled.div`
  width: 100vw;
  min-width: 1000px;
  height: 80vh;
  /* background-color: violet; */
  display: flex;
`
//왼쪽 메인차트
const StyledDetailLeft = styled.div`
  width: 75vw;
  min-width: fit-content;
  height: 75vh;
  min-height: 750px;
  margin: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const StyledChartButton = styled.div`
  width: 95%;
  min-width: 700px;
  height: 10%;
  min-height: 55px;
  background-color: #ffffff;
  margin: 0 24px;
  border: 1px solid #cac4d0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const StyledChart = styled.div`
  width: 95%;
  min-width: 700px;
  height: 100%;
  min-height: 480px;
  background-color: #ffffff;
  margin: 24px;
  border: 1px solid #cac4d0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
`
//오른쪽 사이드바
const StyledDetailRight = styled.div`
  width: 18vw;
  min-width: 250px;
  height: 75vh;
  min-height: 750px;
  margin: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledRTV = styled.div`
  width: 100%;
  height: 43%;
  min-height: 300px;
  background-color: #ffffff;
  border: 1px solid #cac4d0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding-bottom: 24px;
`

export default function Detail() {
  return (
    <StyledMainSection>
      <StyledDetailLeft>
        <StyledChartButton>
          <Chartbutton />
        </StyledChartButton>
        <StyledChart>여기는 차트입니다.</StyledChart>
      </StyledDetailLeft>

      <StyledDetailRight>
        <StyledRTV>실시간 코인시세</StyledRTV>
        <StyledRTV>코인 상세정보</StyledRTV>
        <Button style={{ minWidth: '100px' }} size="large" variant="contained">
          Go To Main
        </Button>
      </StyledDetailRight>
    </StyledMainSection>
  )
}
