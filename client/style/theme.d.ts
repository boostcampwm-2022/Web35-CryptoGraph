declare module '@mui/material/styles' {
  interface Theme {
    breakpoints: {
      values: {
        xs: number
        sm: number
        md: number
        lg: number
        xl: number
      }
    }
    palette: {
      primary: {
        main: string
      }
      secondary: {
        main: string
      }
      error: {
        main: string
      }
    }
    typography: {
      fontFamily: string
      button: {
        textTransform: string
      }
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    breakpoints?: {
      values?: {
        xs?: number
        sm?: number
        md?: number
        lg?: number
        xl?: number
      }
    }
    palette?: {
      primary?: {
        main?: string
      }
      secondary?: {
        main?: string
      }
      error?: {
        main?: string
      }
    }
    typography?: {
      fontFamily?: string
      button?: {
        textTransform?: string
      }
    }
  }
}
