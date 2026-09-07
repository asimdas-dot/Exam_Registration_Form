import { defineConfig, devices } from '@playwright/test';

const skipWebServer = process.env.SKIP_PLAYWRIGHT_WEBSERVER === '1' || process.env.SKIP_PLAYWRIGHT_WEBSERVER === 'true'

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5 * 1000,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    // baseURL is used so tests can call page.goto('/') when TEST_BASE_URL is set
    baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:4173'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Conditionally include webServer: when SKIP_PLAYWRIGHT_WEBSERVER is true, do not start a webServer from Playwright.
  ...(skipWebServer ? {} : {
    webServer: {
      // Build first so preview serves the up-to-date production bundle when running tests
      command: 'npm run build && npm run preview -- --port 4173',
      url: 'http://127.0.0.1:4173',
      // Increase timeout to 10 minutes to allow slow builds on CI/machines
      timeout: 10 * 60 * 1000,
      // Allow reuse if a preview server is already running to speed up local iterations
      reuseExistingServer: true,
    }
  }),
});
