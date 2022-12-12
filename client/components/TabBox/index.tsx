import Box from '@mui/material/Box'
import { ReactNode } from 'react'
import { TabProps } from '@/components/TabContainer'

interface TabBoxProps extends TabProps {
  children: ReactNode
}
const style = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%'
}
export default function TabBox({ children }: TabBoxProps) {
  return <Box sx={style}>{children}</Box>
}
