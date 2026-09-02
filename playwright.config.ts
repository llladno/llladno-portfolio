import { defineConfig, devices } from '@playwright/test'

const PORT = 3000
const BASE_URL = `http://localhost:${PORT}`

/*
 * E2E runs against the real static build: `nuxt generate` then `nuxi preview`.
 * This is what ships, so tests cover prerendered HTML, i18n routes and SEO.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm generate && pnpm preview',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      // A non-localhost URL keeps nuxt-site-config / i18n SEO happy while the
      // server is still served locally.
      NUXT_PUBLIC_SITE_URL:
        process.env.NUXT_PUBLIC_SITE_URL ?? 'https://portfolio.example',
      // Enables the contact form's submit button; the spec mocks the network.
      NUXT_PUBLIC_WEB3FORMS_KEY: process.env.NUXT_PUBLIC_WEB3FORMS_KEY ?? 'test-key-e2e',
    },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
  ],
})
