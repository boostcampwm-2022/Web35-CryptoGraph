import Box from '@mui/material/Box'
import { useState } from 'react'
import CoinSelectController from '../CoinSelectController/index'

interface SideBarProps {
  isSideBarOpened: boolean
}

export default function SideBar({ isSideBarOpened }: SideBarProps) {
  const [buttonSelect, setButtonSelect] = useState(false)

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        border: '1px solid black',
        borderRadius: '16px'
      }}
    >
      <CoinSelectController isSideBarOpened={isSideBarOpened} />
    </Box>
  )
}
