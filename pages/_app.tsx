import * as React from 'react'

import { CacheProvider, EmotionCache } from '@emotion/react'
import { Container } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { appWithTranslation } from 'next-i18next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { Hydrate, QueryClientProvider } from 'react-query'

import createEmotionCache from '../lib/createEmotionCache'
import { generateQueryClient } from '../lib/react-query/queryClient'
import theme from '../styles/theme'
import { KiboHeader } from '@/components/layout'
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface KiboAppProps extends AppProps {
  emotionCache?: EmotionCache
  onInitialData?: any
}

const App = (props: KiboAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, onInitialData } = props
  const [queryClient] = React.useState(() => generateQueryClient())

  const handleInitialData = (value: any) => {
    console.log('app', value)
  }

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Title</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <KiboHeader
              navLinks={[
                {
                  link: '#',
                  text: 'Order Status',
                },
                {
                  link: '#',
                  text: 'Wishlist',
                },
                {
                  link: '#',
                  text: 'Nav Link 2',
                },
                {
                  link: '#',
                  text: 'Nav Link 3',
                },
              ]}
            />
            <Container maxWidth={'lg'}>
              <Component {...pageProps} onInitialData={handleInitialData} />
            </Container>
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
export default appWithTranslation<KiboAppProps>(App)
