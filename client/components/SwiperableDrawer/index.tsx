import * as React from 'react'
import Box from '@mui/material/Box'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Fab from '@mui/material/Fab'
import NavigationIcon from '@mui/icons-material/Navigation'
interface SwipeableTemporaryDrawerProps {
  isDrawerOpened: boolean
  setIsDrawerOpened: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}

export default function SwipeableTemporaryDrawer({
  isDrawerOpened,
  setIsDrawerOpened,
  children
}: SwipeableTemporaryDrawerProps) {
  // const [isDrawerOpened, setIsDrawerOpened] = React.useState(false)

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }
      setIsDrawerOpened(open)
    }

  return (
    <div>
      <Fab
        onClick={toggleDrawer(true)}
        variant="extended"
        size="medium"
        color="primary"
        aria-label="add"
        sx={{ mb: 3 }}
      >
        <NavigationIcon sx={{ mr: 1 }} />
        차트 정보 더보기
      </Fab>
      <SwipeableDrawer
        anchor={'bottom'}
        open={isDrawerOpened}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box sx={style}>{children}</Box>
      </SwipeableDrawer>
    </div>
  )
}

const style = {
  height: '400px',
  maxHeight: '80vh', //400px보다 화면 높이가 작을경우, 최대 값 정의, 100vh면 drawer를 나갈 수 없다.. 적당히 80vh 설정
  width: '100%'
}
