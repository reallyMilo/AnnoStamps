import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

import Layout from '@/components/Layout/Layout'
const StampsApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} className="font-sans" />
        <Toaster />
      </Layout>
    </SessionProvider>
  )
}

export default StampsApp
