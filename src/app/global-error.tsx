'use client'

import * as Sentry from '@sentry/nextjs'
import NextError from 'next/error'
import { useEffect } from 'react'

const GlobalError = ({ error }: { error: { digest?: string } & Error }) => {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <NextError statusCode={undefined as any} />
        }
      </body>
    </html>
  )
}
export default GlobalError
