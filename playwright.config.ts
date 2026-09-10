import { defineConfig, devices } from '@playwright/test';

const skipWebServer =
  process.env.SKIP_PLAYWRIGHT_WEBSERVER === '1' ||
  process.env.SKIP_PLAYWRIGHT_WEBSERVER === 'true';

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

    baseURL:
      process.env.TEST_BASE_URL ||
      'http://127.0.0.1:4173/Exam_Registration_Form/',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  ...(skipWebServer
    ? {}
    : {
        webServer: {
          command: 'npm run build && npm run preview -- --port 4173',
          url: 'http://127.0.0.1:4173/Exam_Registration_Form/',
          timeout: 10 * 60 * 1000,
          reuseExistingServer: true,
        },
      }),
});
