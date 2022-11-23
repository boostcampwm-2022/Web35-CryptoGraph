import Box from '@mui/material/Box'
import { useState } from 'react'

interface SideBarProps {
  isSideBarOpened: boolean
}

export default function SideBar({ isSideBarOpened }: SideBarProps) {
  const [buttonSelect, setButtonSelect] = useState('treeMap')

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        border: '1px solid black',
        borderRadius: '16px'
      }}
    ></Box>
  )
}
