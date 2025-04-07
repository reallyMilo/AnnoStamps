import { GoogleAnalytics } from '@next/third-parties/google'
import { Poppins } from 'next/font/google'

import '@/app/globals.css'

const poppins = Poppins({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '700'],
})

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className={poppins.className} lang="en">
      <body>
        <div className="bg-default flex min-h-screen flex-col dark:bg-zinc-900">
          <main className="relative mx-auto min-h-full w-full grow">
            {children}
          </main>
        </div>
      </body>
      <GoogleAnalytics
        gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as string}
      />
    </html>
  )
}

export default AuthLayout
