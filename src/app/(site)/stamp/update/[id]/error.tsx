'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

import { Heading, Text } from '@/components/ui'

const UpdateStampErrorPage = ({
  error,
}: {
  error: { digest?: string } & Error
}) => {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="mt-20 flex flex-col items-center justify-center">
      <Heading className="text-center">Something went wrong!</Heading>

      <Text>
        post this to the discord {JSON.stringify(error.message, undefined, 2)}
      </Text>
    </div>
  )
}

export default UpdateStampErrorPage
