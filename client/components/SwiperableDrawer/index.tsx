import * as React from 'react'
import Box from '@mui/material/Box'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Button from '@mui/material/Button'

import Fab from '@mui/material/Fab'
import NavigationIcon from '@mui/icons-material/Navigation'
interface SwipeableTemporaryDrawerProps {
  children: React.ReactNode
}

export default function SwipeableTemporaryDrawer({
  children
}: SwipeableTemporaryDrawerProps) {
  const [state, setState] = React.useState(false)

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
      setState(open)
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
        open={state}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box sx={{ maxHeight: '50vh' }}>{children}</Box>
      </SwipeableDrawer>
    </div>
  )
}
