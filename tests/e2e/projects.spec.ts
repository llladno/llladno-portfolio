import { test, expect } from '@playwright/test'

/*
 * The portfolio section: every project case body is in the prerendered HTML,
 * and projects with a demo/repo carry an outbound link with safe rel attrs.
 * These assertions target the plain card list — the SSR / mobile / reduced
 * motion baseline — so a narrow viewport keeps the window deck (and its
 * Finder) from taking over. The Finder itself is covered by finder.spec.ts.
 * `ru-RU` so `/` stays on the default (RU) locale instead of redirecting.
 */

const NEW_SLUGS = ['followpulse', 'lume-store', 'sillage-landing']

test.describe('portfolio', () => {
  test.use({ viewport: { width: 390, height: 844 }, locale: 'ru-RU' })

  test('new project case bodies are in the prerendered HTML', async ({ page }) => {
    await page.goto('/')
    for (const slug of NEW_SLUGS) {
      await expect(page.locator(`#projects-${slug}`)).toBeAttached()
    }
  })

  test('the SILLAGE card links to its live demo with safe rel', async ({ page }) => {
    await page.goto('/')
    const link = page
      .locator('#projects-sillage-landing')
      .getByRole('link', { name: /демо/i })
    await expect(link).toHaveAttribute('href', 'https://sillage.mansurov.workers.dev/ru/')
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
  })

  test('EN portfolio labels the demo link in English', async ({ page }) => {
    await page.goto('/en/')
    const link = page.locator('#projects-lume-store').getByRole('link', { name: /demo/i })
    await expect(link).toHaveAttribute('href', 'https://lume-clothes.vercel.app/')
  })

  test('the experience timeline surfaces its project links', async ({ page }) => {
    await page.goto('/')
    const experience = page.locator('#experience')
    // FollowPulse now lives as a sub-block under the GameSport role.
    await expect(experience.getByRole('link', { name: 'FollowPulse' })).toHaveAttribute(
      'href',
      'https://followpulse.com/',
    )
    await expect(experience.getByRole('link', { name: 'SILLAGE' })).toHaveAttribute(
      'href',
      'https://sillage.mansurov.workers.dev/ru/',
    )
  })
})
