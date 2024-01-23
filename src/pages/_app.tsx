import '../styles/globals.css'

import type { AppProps } from 'next/app'
import Script from 'next/script'
import { SessionProvider } from 'next-auth/react'

import Layout from '@/components/Layout/Layout'
const StampsApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-9KT01SRSVX"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          
          window.dataLayer = window.dataLayer || [];
          
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-9KT01SRSVX');
        `}
      </Script>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} className="font-sans" />
        </Layout>
      </SessionProvider>
    </>
  )
}

export default StampsApp
