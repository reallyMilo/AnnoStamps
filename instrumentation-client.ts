// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    allowUrls: ['https://annostamps.com'],

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    dsn: 'https://a61bb8933f45b2800ce5ffa1c28d9305@o4506508177244160.ingest.sentry.io/4506508178817024',
    enabled: process.env.NODE_ENV === 'production',
    // You can remove this option if you're not planning to use the Sentry Session Replay feature:
    integrations: [
      Sentry.replayIntegration({
        unblock: ['.sentry-unblock, [data-sentry-unblock]'],
        unmask: ['.sentry-unmask, [data-sentry-unmask]'],
      }),
    ],

    replaysOnErrorSampleRate: 1.0,

    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,
    sendDefaultPii: true,
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,
  })
}
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
