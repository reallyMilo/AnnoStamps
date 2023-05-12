import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import PropTypes from 'prop-types'

import Navigation from './Navigation'

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

      <div className="flex min-h-screen flex-col bg-[#F0F3F4]">
        <header className="relative z-20 h-20 w-full bg-[#222939] shadow-md">
          <div className="container mx-auto h-full">
            <div className="flex h-full items-center justify-between space-x-4 px-4">
              <Navigation />
            </div>
          </div>
        </header>

        <main className="s relative z-10 mx-auto mb-20 min-h-full w-full bg-[#F0F3F4] bg-opacity-95">
          {typeof children === 'function' ? children(openModal) : children}
        </main>
        <footer className="mt-auto  bg-[#222939] py-6">
          <div className="container mx-auto flex items-center justify-between px-5">
            <p className="text-sm font-bold text-white">Anno Stamps</p>

            <div className="flex items-center space-x-5 px-5">
              <Link href="https://discord.gg/73hfP54qXe" target="_blank">
                <Image
                  src="/discord.svg"
                  alt="Google"
                  width={32}
                  height={32}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              </Link>
              <Link
                href="https://github.com/reallyMilo/AnnoStamps"
                target="_blank"
              >
                <Image
                  src="/github-mark.svg"
                  width="24"
                  height="24"
                  alt="Github"
                />
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
}

export default Layout
