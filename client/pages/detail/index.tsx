import styled from '@emotion/styled'
import Chartbutton from './components/ChartButton'

const StyledMainSection = styled.div`
  width: 100%;
  height: 100%;
  /* background-color: violet; */
  display: flex;
`
const StyledDetailLeft = styled.div`
  width: 75%;
  height: 80%;
  margin: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const StyledChartButton = styled.div`
  width: 95%;
  height: 10%;
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
  height: 100%;
  background-color: #ffffff;
  margin: 24px;
  border: 1px solid #cac4d0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
`
const StyledDetailRight = styled.div`
  width: 20%;
  height: 90%;
  margin: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledRTV = styled.div`
  width: 100%;
  height: 43%;
  background-color: #ffffff;
  border: 1px solid #cac4d0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding-bottom: 24px;
`
const StyledGoToMainButton = styled.button`
  width: 100%;
  height: 7%;
  background-color: #6750a4;
  border: 1px solid #cac4d0;
  border-radius: 10px;
  padding-bottom: 24px;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.1px;

  color: #ffffff;
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
        <StyledGoToMainButton>Go To Main</StyledGoToMainButton>
      </StyledDetailRight>
    </StyledMainSection>
  )
}
