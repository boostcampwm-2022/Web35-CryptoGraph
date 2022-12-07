import {
  Theme as OriginalTheme,
  ThemeOptions as OriginalThemeOption
} from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    custom: CustomPaletteColor
  }
  interface PaletteOptions {
    custom: CustomPaletteColorOptions
  }
  interface CustomPaletteColorOptions {
    red?: string
    blue?: string
  }
  interface CustomPaletteColor {
    red?: string
    blue?: string
  }
  interface BreakpointOverrides {
    xs: false // removes the `xs` breakpoint
    sm: false
    md: false
    lg: false
    xl: false
    mobile: true
    tablet: true // adds the `tablet` breakpoint
    laptop: true
    desktop: true
    max: true
  }
  export type Theme = OriginalTheme & {
    breakpoints: {
      values: {
        mobile: number
        tablet: number
        laptop: number
        desktop: number
        max: number
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
      custom: {
        red: string
        blue: string
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
  export type ThemeOptions = OriginalThemeOption & {
    breakpoints?: {
      values?: {
        mobile?: number
        tablet?: number
        laptop?: number
        desktop?: number
        max?: number
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
      custom?: {
        red?: string
        blue?: string
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
