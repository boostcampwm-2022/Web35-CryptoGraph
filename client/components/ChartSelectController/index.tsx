import { styled } from '@mui/material/styles'
import { Dispatch, SetStateAction } from 'react'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { ChartTypeArr, ChartType } from '@/types/ChartTypes'

interface ChartSelectControllerProps {
  selected: ChartType
  selectedSetter: Dispatch<SetStateAction<ChartType>>
}
const ChartPeriodSelectorContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: 10%;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`
//메인페이지 트리맵/러닝차트 선택 컴포넌트
export default function ChartSelectController({
  selected,
  selectedSetter
}: ChartSelectControllerProps) {
  const handleChange = (event: SelectChangeEvent) => {
    selectedSetter(event.target.value as ChartType)
    // as 사용을 지양해야하지만, 런타임 중에
    // ChartPeriod 이외에 다른 value가 들어올
    // 가능성이 없으므로 사용함.
  }
  return (
    <ChartPeriodSelectorContainer>
      <Box sx={{ minWidth: 300 }}>
        <FormControl fullWidth>
          <InputLabel>차트 선택</InputLabel>
          <Select value={selected} onChange={handleChange}>
            {ChartTypeArr.map(value => {
              return (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </Box>
    </ChartPeriodSelectorContainer>
  )
}
