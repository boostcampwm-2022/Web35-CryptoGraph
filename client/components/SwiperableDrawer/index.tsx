import Box from '@mui/material/Box'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Fab from '@mui/material/Fab'
import NavigationIcon from '@mui/icons-material/Navigation'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  MouseEvent,
  KeyboardEvent
} from 'react'
interface SwipeableTemporaryDrawerProps {
  buttonLabel: string
  isDrawerOpened: boolean
  setIsDrawerOpened: Dispatch<SetStateAction<boolean>>
  children: ReactNode
}

export default function SwipeableTemporaryDrawer({
  buttonLabel,
  isDrawerOpened,
  setIsDrawerOpened,
  children
}: SwipeableTemporaryDrawerProps) {
  // const [isDrawerOpened, setIsDrawerOpened] = React.useState(false)

  const toggleDrawer =
    (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as KeyboardEvent).key === 'Tab' ||
          (event as KeyboardEvent).key === 'Shift')
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
        sx={{ mb: 1, mt: 1 }}
      >
        <NavigationIcon sx={{ mr: 1 }} />
        {buttonLabel}
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
