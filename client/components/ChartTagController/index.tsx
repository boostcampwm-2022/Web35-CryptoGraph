import Box from '@mui/material/Box'
import { convertUnit } from '@/utils/chartManager'
import { MainChartPointerData } from '@/types/ChartTypes'

interface ChartTagControllerProps {
  pointerInfo: MainChartPointerData
}

export default function ChartTagController({
  pointerInfo
}: ChartTagControllerProps) {
  return (
    <>
      <Box
        key={pointerInfo.data?.name}
        id="coin-info"
        sx={{
          width: 'auto',
          height: 'auto',
          scroll: 'no',
          backgroundColor: 'white',
          border: 'solid',
          borderWidth: '1px',
          padding: '6px',
          borderRadius: '15px',
          position: 'absolute',
          marginLeft: `${pointerInfo.offsetX}px`,
          marginTop: `${pointerInfo.offsetY}px`,
          display:
            pointerInfo.offsetX === -1 || pointerInfo.offsetY === -1
              ? 'none'
              : 'block'
        }}
      >
        <p>코인명 : {pointerInfo.data?.name}</p>
        <p>종목코드 : {pointerInfo.data?.ticker.split('-')[1]}</p>
        <p>시가총액 : {convertUnit(Number(pointerInfo.data?.market_cap))}</p>
      </Box>
    </>
  )
}
