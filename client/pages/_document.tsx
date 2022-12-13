import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps
} from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import theme from '../style/theme'
import createEmotionCache from '../style/createEmotionCache'
import { EmotionCache } from '@emotion/react'
import { AppType } from 'next/app'
import { ReactNode } from 'react'

interface DocumentProps extends DocumentInitialProps {
  emotionStyleTags: ReactNode[]
}
export default function MyDocument(props: DocumentProps) {
  return (
    <Html lang="ko">
      <Head>
        {/* PWA primary color */}
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta name="emotion-insertion-point" content="" />
        {props.emotionStyleTags}
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cryptograph.servehttp.com/" />
        <meta property="og:title" content="크립토그래프" />
        <meta
          property="og:image"
          content="https://cryptograph.servehttp.com/doge_thumbnail.png"
        />
        <meta
          property="og:description"
          content="실시간 암호화폐 데이터 시각화 웹 서비스"
        />
        <meta
          name="description"
          content="실시간 암호화폐 데이터 시각화 웹 서비스 - CryptoGraph"
        ></meta>
        <meta property="og:site_name" content="CryptoGraph" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (
  ctx: DocumentContext
): Promise<DocumentProps> => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (
        App: AppType | React.ComponentType<{ emotionCache: EmotionCache }>
      ) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />
        }
    })
  const initialProps = await Document.getInitialProps(ctx)
  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map(style => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    emotionStyleTags
  }
}
