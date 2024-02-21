'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

const GlobalError = ({ error }: { error: Error & { digest?: string } }) => {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
      </body>
    </html>
  )
}
export default GlobalError
