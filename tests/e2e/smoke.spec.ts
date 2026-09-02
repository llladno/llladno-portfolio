import { test, expect } from '@playwright/test'

test.describe('smoke', () => {
  test('RU home renders with all sections', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    for (const id of ['about', 'experience', 'projects', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }
  })

  test('EN home is served under /en/', async ({ page }) => {
    const res = await page.goto('/en/')
    expect(res?.status()).toBeLessThan(400)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('robots.txt and sitemaps are reachable', async ({ request }) => {
    const robots = await request.get('/robots.txt')
    expect(robots.status()).toBe(200)
    expect(await robots.text()).toContain('Sitemap:')

    const index = await request.get('/sitemap_index.xml')
    expect(index.status()).toBe(200)

    const enSitemap = await request.get('/__sitemap__/en-US.xml')
    expect(enSitemap.status()).toBe(200)
    expect(await enSitemap.text()).toContain('/en')
  })

  test('home exposes canonical + hreflang alternates', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(
      1,
    )
  })
})
