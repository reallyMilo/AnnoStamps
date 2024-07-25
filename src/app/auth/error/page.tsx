'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { Container, Heading, Text } from '@/components/ui'
const errorMap = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'Access denied.',
  Verification: 'The token has expired or has already been used.',
  Default: 'Unable to sign-in.',
} as const

const Wrap = () => {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error') as keyof typeof errorMap

  return <Text>{errorMap[error]}</Text>
}
const AuthErrorPage = () => {
  return (
    <Container className="text-center">
      <Heading>Something went wrong try to sign in</Heading>
      <Suspense>
        <Wrap />
      </Suspense>
      <Text>Please contact us on the discord.</Text>
    </Container>
  )
}

export default AuthErrorPage
