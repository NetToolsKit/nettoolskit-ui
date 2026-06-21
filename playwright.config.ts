import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:4173'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  outputDir: './.build/test-results/playwright',
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1600, height: 1000 },
  },
  webServer: {
    command: 'npm run build:samples && npm exec vite preview -- --host 127.0.0.1 --port 4173 --strictPort',
    port: 4173,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: './.build/playwright-report', open: 'never' }],
  ],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1600, height: 1000 },
      },
    },
  ],
})
