import { styled } from '@mui/material/styles'
import { ChartPeriod } from '@/types/ChartTypes'
import { Dispatch, SetStateAction } from 'react'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { ChartPeriodList } from '@/types/ChartTypes'
const ChartPeriodSelectorContainer = styled('div')`
  display: flex;
  width: 100%;
  height: auto;
  background-color: #ffffff;
  border: 1px solid #cac4d0;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`
const StyledTimeButton = styled('button')`
  background: #e7e5ef;
  border-radius: 16px;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  margin: 8px 16px;
  width: auto;
  height: 50%;
`
interface ChartPeriodSelectorProps {
  selected: ChartPeriod
  selectedSetter: Dispatch<SetStateAction<ChartPeriod>>
}
export default function ChartPeriodSelector(props: ChartPeriodSelectorProps) {
  const handleChange = (event: SelectChangeEvent) => {
    props.selectedSetter(event.target.value as ChartPeriod)
    // as 사용을 지양해야하지만, 런타임 중에
    // ChartPeriod 이외에 다른 value가 들어올
    // 가능성이 없으므로 사용함.
  }
  return (
    <ChartPeriodSelectorContainer>
      <Box sx={{ minWidth: 300 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">분봉 선택</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={props.selected}
            label="Age"
            onChange={handleChange}
          >
            {ChartPeriodList.map(value => {
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
