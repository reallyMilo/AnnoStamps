import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {},
    video: false,
    chromeWebSecurity: false,
    env: {
      sessionToken: JSON.stringify({
        sessionToken: 'cdc4b0fb-77b5-44b5-947a-dde785af2676',
        csrfToken:
          'dfbc1c2ed29dd90157662042a479720a4bf4c394f954bdd2e01a372aa42c9f1b%7C426823b50e26ac90384ba7a800b10b79c4d19202dd2a5e1f80739d2c7594db44',
      }),
    },
  },
})
