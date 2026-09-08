import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],

    // Only run Vitest unit/component tests
    include: [
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
    ],

    // Never let Vitest run Playwright E2E tests
    exclude: [
      'node_modules/**',
      'dist/**',
      'tests/e2e/**',
    ],
  },
})
