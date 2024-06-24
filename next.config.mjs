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
  reactStrictMode: true,
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

export default withBundleAnalyzer(
  withSentryConfig(nextConfig, {
    org: 'mkdotcy',
    project: 'javascript-nextjs',

    // An auth token is required for uploading source maps.
    authToken: process.env.SENTRY_AUTH_TOKEN,

    silent: true, // Can be used to suppress logs
  })
)
