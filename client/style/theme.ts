import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// Create a theme instance.
const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 750,
      laptop: 1024,
      desktop: 1280,
      max: 1920
    }
  },
  palette: {
    primary: {
      main: '#6750a4'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#eee6e6'
    },
    custom: {
      red: '#D24F45',
      blue: '#1D61C4'
    }
  },
  typography: {
    fontFamily: 'LINESeedKR-Rg',
    button: {
      textTransform: 'none'
    }
  }
})

export default theme
