import * as React from 'react'
import { styled } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { TabProps } from '@/components/TabContainer'

interface SortSelectControllerProps extends TabProps {
  selectedSort: string
  selectedSortSetter: React.Dispatch<React.SetStateAction<string>>
  selectedChart: string
}

export default function SortSelectController({
  selectedSort,
  selectedSortSetter,
  selectedChart
}: SortSelectControllerProps) {
  const handleChange = (event: SelectChangeEvent) => {
    selectedSortSetter(event.target.value)
  }
  const treeSortTypeArr = [
    'change rate',
    'change rate(absolute)',
    'market capitalization',
    'trade price'
  ]
  const runningSortTypeArr = [
    'ascending',
    'descending',
    'absolute',
    'market capitalization',
    'trade price'
  ]
  return (
    <SortSelectorContainer>
      <Box sx={{ minWidth: 300 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">정렬 기준</InputLabel>
          <Select value={selectedSort} onChange={handleChange}>
            {selectedChart === 'RunningChart'
              ? runningSortTypeArr.map(value => {
                  return (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  )
                })
              : treeSortTypeArr.map(value => {
                  return (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  )
                })}
          </Select>
        </FormControl>
      </Box>
    </SortSelectorContainer>
  )
}

const SortSelectorContainer = styled('div')`
  display: flex;
  width: 100%;
  height: 10%;
  background-color: #ffffff;
  box-sizing: border-box;
  border: 1px solid #cac4d0;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`
