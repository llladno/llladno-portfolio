import { test, expect, type Page } from '@playwright/test'

/*
 * The code-driven intro: on a desktop viewport, scrolling through the sticky
 * stage boots the macOS chrome; scrolling back to the top retracts it.
 * Reduced motion / mobile skip straight to the plain layout with everything
 * still in the DOM.
 */

const WHEEL_STEPS = 24
const WHEEL_DELTA_PX = 500
const SETTLE_MS = 700

const wheelBy = async (page: Page, deltaY: number) => {
  await page.mouse.move(400, 300)
  for (let step = 0; step < WHEEL_STEPS; step += 1) {
    await page.mouse.wheel(0, deltaY)
    await page.waitForTimeout(24)
  }
  await page.waitForTimeout(SETTLE_MS)
}

const dockLocator = (page: Page) =>
  page.getByRole('navigation', { name: /панель приложений|application dock/i })

test.describe('intro', () => {
  test('desktop: scrolling boots the chrome, scrolling back retracts it', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'boot choreography is desktop-only')

    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    await expect(dockLocator(page)).toHaveCount(0)

    await wheelBy(page, WHEEL_DELTA_PX)
    await expect(dockLocator(page)).toBeVisible()
    await expect(page.locator('header.fixed')).toBeVisible()

    // Dock = 3 social links + the résumé button.
    const tiles = dockLocator(page).locator('a[href], button')
    await expect(tiles).toHaveCount(4)
    await expect(dockLocator(page).locator('a[href*="github"]')).toHaveCount(1)
    await expect(dockLocator(page).locator('a[href*="t.me"]')).toHaveCount(1)

    await wheelBy(page, -WHEEL_DELTA_PX)
    await expect(dockLocator(page)).toHaveCount(0)
  })

  test('reduced motion: no scrub, chrome never appears, content is present', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()

    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    for (const id of ['about', 'experience', 'projects']) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }
    await expect(dockLocator(page)).toHaveCount(0)

    // The intro stat callouts render statically here (no count-up scrub).
    const hero = page.locator('section').first()
    await expect(hero.getByText('4+', { exact: true })).toBeVisible()
    await expect(hero.getByText(/years of experience|года опыта/i)).toBeVisible()
    await expect(hero.getByText(/technologies|технологий/i)).toBeVisible()

    await context.close()
  })
})
