module.exports = {
  // TODO: unignore ts and eslint build errors
  reactStrictMode: true,
  eslint: {
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'zvzegsqprutvkaafnfdh.supabase.in',
      'bxeklzgnntgnhkipxvol.supabase.in',
      'lh3.googleusercontent.com',
      'cdn.discordapp.com',
      'cdn.buymeacoffee.com',
    ],
  },
}
