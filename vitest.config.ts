/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

import { UserConfig, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths(), react()] as UserConfig['plugins'],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
