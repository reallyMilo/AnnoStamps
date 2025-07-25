import * as Sentry from '@sentry/nextjs'
Sentry.init({
  dsn: 'https://a61bb8933f45b2800ce5ffa1c28d9305@o4506508177244160.ingest.us.sentry.io/4506508178817024',
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
})
