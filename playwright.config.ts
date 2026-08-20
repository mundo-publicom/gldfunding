import { defineConfig, devices } from '@playwright/test'

/**
 * QA runs against the PRODUCTION build, not the dev server.
 *
 * That matters here: the site is statically pre-rendered, so `dist/` is the
 * artifact that actually ships. Dev-server behaviour differs in ways that hide
 * real defects (titles injected late, no 404.html, no postbuild artifacts) and
 * invents fake ones. `webServer` builds and serves it for us.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // All workers share one preview server; oversubscribing it produces
  // timeouts that look like product bugs.
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],

  timeout: 45_000,
  // One dev-grade preview server serves every worker; a saturated moment must
  // not read as a product failure.
  expect: { timeout: 15_000 },

  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile',
      use: { ...devices['iPhone 14 Pro'] },
      testIgnore: /links\.spec\.ts/, // link graph is viewport-independent
    },
  ],

  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
