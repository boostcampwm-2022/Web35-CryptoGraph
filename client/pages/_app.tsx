import * as React from 'react'
import Head from 'next/head'
import App, { AppContext, AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Global, css, CacheProvider, EmotionCache } from '@emotion/react'
import theme from '../style/theme'
import createEmotionCache from '../style/createEmotionCache'
import GNB from '@/components/GNB'
import { Container, styled } from '@mui/material'
import { MarketCapInfo } from '@/types/CoinDataTypes'
import { getMarketCapInfo } from '@/utils/metaDataManages'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
  data: MarketCapInfo[]
}

export const MyAppContext = React.createContext<MarketCapInfo[]>([])

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const data = props.data
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Global styles={GlobalStyle} />
        <MyAppContext.Provider value={data}>
          <GNB />
          <ContainerHeightLimiter>
            <Container
              disableGutters
              maxWidth="max"
              sx={{ display: 'flex', width: '100%', height: '100%' }}
            >
              <Component {...pageProps} />
            </Container>
          </ContainerHeightLimiter>
        </MyAppContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  )
}

MyApp.getInitialProps = async (context: AppContext) => {
  const ctx = await App.getInitialProps(context)
  const fetchedData: MarketCapInfo[] | null = await getMarketCapInfo()
  return { ...ctx, data: fetchedData === null ? [] : fetchedData } // pageProps와 합쳐주는 과정
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

const ContainerHeightLimiter = styled('div')`
  display: flex;
  width: 100%;
  height: 100%;
  ${props => props.theme.breakpoints.down('tablet')} {
    padding-top: calc(64px + 8px);
  }
  ${props => props.theme.breakpoints.up('tablet')} {
    padding-top: calc(96px + 8px);
    //매직 넘버 상수화 필요
  }
`
