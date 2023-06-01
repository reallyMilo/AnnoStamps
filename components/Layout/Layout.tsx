import Head from 'next/head'

import AuthModal from '../Auth/AuthModal'
import Footer from './Footer'
import Navbar from './Navbar'

const Layout = ({ children = null }) => {
  return (
    <>
      <Head>
        <title>Anno 1800 Stamps | Stamp Sharing</title>
        <meta
          name="description"
          content="A community site for uploading and sharing stamps for Anno 1800"
        ></meta>
        <meta name="og:title" content="Anno 1800 Stamps | Stamp Sharing" />
        <meta
          name="og:description"
          content="A community site for uploading and sharing stamps for Anno 1800"
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <AuthModal />
      <div className="flex min-h-screen flex-col bg-[#F0F3F4]">
        <Navbar />

        <main className="s relative z-10 mx-auto mb-20 min-h-full w-full bg-[#F0F3F4] bg-opacity-95">
          {children}
        </main>

        <Footer />
      </div>
    </>
  )
}

export default Layout
