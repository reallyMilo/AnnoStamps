import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/signin',
    signOut: '/',
    error: '/auth/error',
    verifyRequest: '/',
  },
  callbacks: {
    authorized: ({ req }) => {
      //FIXME: Hack for fixing production middleware issues.
      // could be env variables in production NEXTAUTH_URL
      const localSessionToken = req.cookies.get('next-auth.session-token')
      const prodSessionToken = req.cookies.get(
        '__Secure-next-auth.session-token'
      )
      if (localSessionToken || prodSessionToken) return true
      else return false
    },
  },
})

export const config = { matcher: ['/user/:path*'] }
