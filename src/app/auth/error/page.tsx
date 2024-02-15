import Container from '@/components/ui/Container'

const error: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'AccessDenied',
  Verification: 'The token has expired or has already been used',
  Default: 'Unable to sign-in',
}

const AuthErrorPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  return (
    <Container>
      <pre>{error[searchParams.error as string]}</pre>
    </Container>
  )
}

export default AuthErrorPage
