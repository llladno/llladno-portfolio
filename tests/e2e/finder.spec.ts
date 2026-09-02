import { test, expect, type Page } from '@playwright/test'

/*
 * The projects Finder: inside the desktop deck, the Portfolio window shows a
 * grid of "files" plus an inspector that stays hidden until a file is picked.
 * The plain card list (SSR / mobile / reduced motion) is covered by
 * projects.spec.ts.
 */

const PROJECT_COUNT = 6

const settle = (page: Page) => page.waitForTimeout(1500)

const portfolioWindow = (page: Page) =>
  page.locator('.deck-window', { hasText: 'Портфолио' })

test.describe('projects finder', () => {
  // ru-RU so `/` stays on the default locale (the assertions below are RU).
  test.use({ locale: 'ru-RU' })

  test.skip(({ browserName }) => browserName !== 'chromium', 'deck is desktop-only')

  test('shows one file tile per project, inspector hidden until a pick', async ({
    page,
  }) => {
    await page.goto('/#projects')
    await settle(page)

    await expect(page.getByRole('option')).toHaveCount(PROJECT_COUNT)
    await expect(portfolioWindow(page).getByText('Информация')).toHaveCount(0)
    await expect(portfolioWindow(page).locator('video')).toHaveCount(0)
    await expect(page.getByRole('option', { selected: true })).toHaveCount(0)
  })

  test('a deep link opens with the file selected and its inspector shown', async ({
    page,
  }) => {
    await page.goto('/#projects/sillage-landing')
    await settle(page)

    await expect(page.getByRole('option', { name: /sillage-landing/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    const window = portfolioWindow(page)
    await expect(window.getByRole('heading', { name: /SILLAGE/ })).toBeVisible()
    await expect(window.getByText('Сайт', { exact: true })).toBeVisible()
    await expect(window.locator('video')).toHaveCount(1)
  })

  test('clicking a tile selects it and writes the hash', async ({ page }) => {
    await page.goto('/#projects')
    await settle(page)

    const tile = page.getByRole('option', { name: /followpulse/ })
    await tile.click()

    await expect(tile).toHaveAttribute('aria-selected', 'true')
    await expect(page).toHaveURL(/#projects\/followpulse$/)
  })

  test('the document project has no video and is named *.md', async ({ page }) => {
    await page.goto('/#projects/cnc-monitoring')
    await settle(page)

    await expect(portfolioWindow(page).locator('video')).toHaveCount(0)
    await expect(page.getByRole('option', { name: /cnc-monitoring\.md/ })).toBeVisible()
  })
})
