'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

const CreateStampErrorPage = ({
  error,
}: {
  error: Error & { digest?: string }
}) => {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>

      <pre>
        post this to the discord {JSON.stringify(error.message, undefined, 2)}
      </pre>
    </main>
  )
}

export default CreateStampErrorPage
