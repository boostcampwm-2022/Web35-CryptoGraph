import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Global, css, CacheProvider, EmotionCache } from '@emotion/react'
import theme from '../style/theme'
import createEmotionCache from '../style/createEmotionCache'
import GNB from '@/components/GNB'
import { Container } from '@mui/material'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}
const GlobalStyle = css`
  html {
    font-size: 1rem;
  }
  html,
  body,
  div#__next {
    height: 100%;
  }
`
export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Global styles={GlobalStyle} />
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <GNB />
          <Container
            disableGutters
            maxWidth="max"
            sx={{ display: 'flex', width: '100%', height: '100%' }}
          >
            <Component {...pageProps} />
          </Container>
        </div>
      </ThemeProvider>
    </CacheProvider>
  )
}
