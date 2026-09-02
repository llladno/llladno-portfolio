import { test, expect, type Page } from '@playwright/test'

/*
 * The window deck after the reshape:
 * - the intro boots straight into the first window (About) at deckProgress 0;
 * - the bare desktop is the FINAL state at the bottom of the deck scroll;
 * - the red traffic light on a scroll-focused window falls through to that
 *   bare desktop.
 */

const settle = (page: Page) => page.waitForTimeout(1200)

/** Jump the page to a fraction (0–1) through the deck stage's own scroll range. */
const scrollDeckTo = async (page: Page, fraction: number) => {
  await page.evaluate((frac) => {
    const stage = document.querySelector('.deck-stage') as HTMLElement | null
    if (!stage) throw new Error('no .deck-stage')
    const top = window.scrollY + stage.getBoundingClientRect().top
    const range = stage.offsetHeight - window.innerHeight
    window.scrollTo(0, Math.round(top + range * frac))
  }, fraction)
  await page.waitForTimeout(900)
}

const windowOpacity = (page: Page, index: number) =>
  page
    .locator('.deck-window')
    .nth(index)
    .evaluate((node) => Number.parseFloat(getComputedStyle(node).opacity))

test.describe('window deck', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'deck is desktop-only')

  test('the first window is focused at the top of the deck', async ({ page }) => {
    await page.goto('/')
    await scrollDeckTo(page, 0.02)
    expect(await windowOpacity(page, 0)).toBeGreaterThan(0.75)
  })

  test('the end of the deck is the bare desktop', async ({ page }) => {
    await page.goto('/')
    await scrollDeckTo(page, 1)

    for (const index of [0, 1, 2, 3]) {
      expect(await windowOpacity(page, index)).toBeLessThan(0.5)
    }
    const surface = page.getByRole('group', { name: /рабочий стол|desktop/i })
    await expect(surface).toHaveCSS('pointer-events', 'auto')
  })

  test('deep link focuses a window; close falls through to the bare desktop', async ({
    page,
  }) => {
    await page.goto('/#experience')
    await settle(page)
    expect(await windowOpacity(page, 1)).toBeGreaterThan(0.75)

    await page
      .locator('.deck-window')
      .nth(1)
      .getByRole('button', { name: /рабоч|desktop/i })
      .click()
    await settle(page)

    for (const index of [0, 1, 2, 3]) {
      expect(await windowOpacity(page, index)).toBeLessThan(0.5)
    }
    expect(new URL(page.url()).hash).toBe('')
  })

  test('a scroll-focused window scrolls its own content before the deck advances', async ({
    page,
  }) => {
    await page.goto('/')
    // Experience is scroll window index 1 of 3 (contact is overlay-only); its
    // focus centre sits at deckProgress ≈ 1/(3−1) · (1 − TRAIL) ≈ 0.42. Its
    // long timeline overflows the frame.
    await scrollDeckTo(page, 0.42)
    expect(await windowOpacity(page, 1)).toBeGreaterThan(0.75)

    const body = page.locator('.deck-window').nth(1).locator('.deck-window__body')
    const overflow = await body.evaluate((node) => node.scrollHeight - node.clientHeight)
    test.skip(overflow < 60, 'experience window content fits — nothing to nested-scroll')

    await body.hover()
    await page.mouse.wheel(0, 200)
    await page.waitForTimeout(400)

    expect(await body.evaluate((node) => node.scrollTop)).toBeGreaterThan(0)
    expect(await windowOpacity(page, 1)).toBeGreaterThan(0.75)
  })

  test('contact is an overlay window: a deep link opens it, scrolling never does', async ({
    page,
  }) => {
    // Contact is deck window index 3 (last), but not in the scroll cascade.
    await page.goto('/')
    for (const fraction of [0.02, 0.42, 0.84, 1]) {
      await scrollDeckTo(page, fraction)
      expect(await windowOpacity(page, 3)).toBeLessThan(0.5)
    }

    // Opening it directly still works.
    await page.goto('/#contact')
    await settle(page)
    expect(await windowOpacity(page, 3)).toBeGreaterThan(0.75)
    await expect(page.locator('form#contact-form')).toBeVisible()
  })
})
