import { withSentryConfig } from '@sentry/nextjs'
// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd16532dqapk4x.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'zvzegsqprutvkaafnfdh.supabase.in',
      },
      {
        protocol: 'https',
        hostname: 'bxeklzgnntgnhkipxvol.supabase.in',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
}

export default withSentryConfig(nextConfig, {
  org: 'mkdotcy',
  project: 'javascript-nextjs',

  // An auth token is required for uploading source maps.
  authToken: process.env.SENTRY_AUTH_TOKEN,

  silent: true, // Can be used to suppress logs
})