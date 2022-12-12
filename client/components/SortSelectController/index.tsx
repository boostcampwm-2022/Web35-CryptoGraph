import { styled } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Dispatch, SetStateAction } from 'react'

interface SortSelectControllerProps {
  selectedSort: string
  selectedSortSetter: Dispatch<SetStateAction<string>>
  selectedChart: string
}

type sortType = {
  [value: string]: string
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
  const sortType: sortType = {
    'change rate': '등락률',
    'change rate(absolute)': '등락률(절대값)',
    'market capitalization': '시가총액',
    'trade price': '24시간 거래량',
    ascending: '등락률(오름차순)',
    descending: '등락률(내림차순)',
    absolute: '등락률(절대값)'
  }
  return (
    <SortSelectorContainer sx={{ backgroundColor: '#ffffff' }}>
      <Box sx={{ minWidth: 300, backgroundColor: 'white' }}>
        <FormControl fullWidth>
          <InputLabel>정렬 기준</InputLabel>
          <Select value={selectedSort} onChange={handleChange}>
            {selectedChart === 'RunningChart'
              ? runningSortTypeArr.map(value => {
                  return (
                    <MenuItem key={value} value={value}>
                      {sortType[value]}
                    </MenuItem>
                  )
                })
              : treeSortTypeArr.map(value => {
                  return (
                    <MenuItem key={value} value={value}>
                      {sortType[value]}
                    </MenuItem>
                  )
                })}
          </Select>
        </FormControl>
      </Box>
    </SortSelectorContainer>
  )
}

const SortSelectorContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: 10%;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
`
