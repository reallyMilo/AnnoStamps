// @ts-check
import NextBundleAnalyzer from '@next/bundle-analyzer'
import { withSentryConfig } from '@sentry/nextjs'

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'd16532dqapk4x.cloudfront.net',
        protocol: 'https',
      },
      {
        hostname: 'zvzegsqprutvkaafnfdh.supabase.in',
        protocol: 'https',
      },
      {
        hostname: 'bxeklzgnntgnhkipxvol.supabase.in',
        protocol: 'https',
      },
      {
        hostname: 'lh3.googleusercontent.com',
        protocol: 'https',
      },
      {
        hostname: 'cdn.discordapp.com',
        protocol: 'https',
      },
      {
        hostname: 'placehold.co',
        protocol: 'https',
      },
    ],
  },
  reactStrictMode: true,
}

export default withBundleAnalyzer(
  withSentryConfig(nextConfig, {
    // An auth token is required for uploading source maps.
    authToken: process.env.SENTRY_AUTH_TOKEN,
    org: 'mkdotcy',

    project: 'javascript-nextjs',

    silent: true, // Can be used to suppress logs
  }),
)
