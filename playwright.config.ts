import { defineConfig, devices } from '@playwright/test'

/**
 * Library-only browser + accessibility gate.
 *
 * Targets the design-system sample/catalog host (`samples/`, served by Vite on
 * port 3000) — NOT product/CMS/template runtime. Kept small and deterministic so
 * it stays a fast, bounded gate. Runs separately from `npm run verify`
 * (jsdom/unit) via `npm run test:e2e`; see README "Browser & a11y gate".
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Serve the built sample catalog (static, deterministic — no dev-server HMR or
  // dependency pre-bundling) so the gate validates the real build artifact.
  webServer: {
    command: 'npm run build:samples && npx vite preview --port 3000 --strictPort',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})