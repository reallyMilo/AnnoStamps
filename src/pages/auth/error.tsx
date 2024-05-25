import { useRouter } from 'next/router'

import { Container } from '@/components/ui'

const error: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'AccessDenied',
  Verification: 'The token has expired or has already been used',
  Default: 'Unable to sign-in',
}

const Error = () => {
  const { query } = useRouter()

  return (
    <Container>
      <pre>{error[query.error as string]}</pre>
    </Container>
  )
}

export default Error
