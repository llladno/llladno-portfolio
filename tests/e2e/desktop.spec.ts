import { test, expect, type Page } from '@playwright/test'

/*
 * The interactive desktop: folder icons can be selected, opened with a double
 * click, dragged around (position persists), and right-clicked for a context
 * menu.
 */

const settle = (page: Page) => page.waitForTimeout(1200)

const icon = (page: Page, index: number) => page.locator('.desktop-icon').nth(index)

const windowOpacity = (page: Page, index: number) =>
  page
    .locator('.deck-window')
    .nth(index)
    .evaluate((node) => Number.parseFloat(getComputedStyle(node).opacity))

/** Boot the chrome, then close back to the bare desktop. */
const gotoDesktop = async (page: Page) => {
  await page.goto('/#about')
  await settle(page)
  await page
    .locator('.deck-window')
    .first()
    .getByRole('button', { name: /рабоч|desktop/i })
    .click()
  await settle(page)
}

test.describe('interactive desktop', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'desktop is desktop-only')

  test('single click selects an icon; clicking empty space clears it', async ({
    page,
  }) => {
    await gotoDesktop(page)

    await icon(page, 0).click()
    await expect(icon(page, 0)).toHaveAttribute('aria-pressed', 'true')

    await page.mouse.click(720, 480)
    await expect(icon(page, 0)).toHaveAttribute('aria-pressed', 'false')
  })

  test('double click opens that section window without scrolling the page', async ({
    page,
  }) => {
    await gotoDesktop(page)
    const scrollBefore = await page.evaluate(() => window.scrollY)

    await icon(page, 1).dblclick()
    await settle(page)

    expect(await windowOpacity(page, 1)).toBeGreaterThan(0.75)
    expect(new URL(page.url()).hash).toBe('#experience')

    const scrollAfter = await page.evaluate(() => window.scrollY)
    expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThan(4)

    // Closing returns to the bare desktop.
    await page
      .locator('.deck-window')
      .nth(1)
      .getByRole('button', { name: /рабоч|desktop/i })
      .click()
    await settle(page)
    expect(await windowOpacity(page, 1)).toBeLessThan(0.5)
    expect(new URL(page.url()).hash).toBe('')
  })

  test('scrolling inside an open window scrolls its content, not the deck', async ({
    page,
  }) => {
    await gotoDesktop(page)
    await icon(page, 1).dblclick()
    await settle(page)
    expect(await windowOpacity(page, 1)).toBeGreaterThan(0.75)

    const body = page.locator('.deck-window').nth(1).locator('.deck-window__body')
    const overflow = await body.evaluate((node) => node.scrollHeight - node.clientHeight)
    expect(overflow).toBeGreaterThan(40)

    await body.hover()
    await page.mouse.wheel(0, 400)
    await page.waitForTimeout(400)

    expect(await body.evaluate((node) => node.scrollTop)).toBeGreaterThan(0)
    // window stays open, deck doesn't take over
    expect(await windowOpacity(page, 1)).toBeGreaterThan(0.75)
    expect(new URL(page.url()).hash).toBe('#experience')
  })

  test('the green traffic light zooms the window full screen and back', async ({
    page,
  }) => {
    await gotoDesktop(page)
    await icon(page, 0).dblclick()
    await settle(page)

    const win = page.locator('.deck-window').nth(0)
    const lights = win.locator('.h-11 button')
    await expect(lights).toHaveCount(2) // close + zoom, no minimize

    const before = await win.boundingBox()
    await win.getByRole('button', { name: /весь экран|full screen/i }).click()
    await page.waitForTimeout(400)
    const zoomed = await win.boundingBox()
    expect(zoomed!.width).toBeGreaterThan((before?.width ?? 0) + 100)

    await win.getByRole('button', { name: /обычному размеру|restore/i }).click()
    await page.waitForTimeout(400)
    const restored = await win.boundingBox()
    expect(Math.abs((restored?.width ?? 0) - (before?.width ?? 0))).toBeLessThan(24)
  })

  test('an icon can be dragged and the new position survives a reload', async ({
    page,
  }) => {
    await gotoDesktop(page)

    const start = await icon(page, 0).boundingBox()
    if (!start) throw new Error('icon has no box')

    await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2)
    await page.mouse.down()
    await page.mouse.move(start.x + 260, start.y + 180, { steps: 12 })
    await page.mouse.up()
    await settle(page)

    const moved = await icon(page, 0).boundingBox()
    expect(moved!.x - start.x).toBeGreaterThan(150)

    await page.reload()
    await gotoDesktop(page)

    const afterReload = await icon(page, 0).boundingBox()
    expect(afterReload!.x - start.x).toBeGreaterThan(150)
  })

  test('right-click context menu opens a window and arranges icons', async ({ page }) => {
    await gotoDesktop(page)

    // Move an icon, then arrange it back via the desktop menu.
    const home = await icon(page, 0).boundingBox()
    await page.mouse.move(home!.x + home!.width / 2, home!.y + home!.height / 2)
    await page.mouse.down()
    await page.mouse.move(home!.x + 240, home!.y + 200, { steps: 10 })
    await page.mouse.up()
    await settle(page)
    expect((await icon(page, 0).boundingBox())!.x - home!.x).toBeGreaterThan(150)

    await page.mouse.click(760, 520, { button: 'right' })
    const menu = page.getByRole('menu')
    await expect(menu).toBeVisible()
    await menu
      .getByRole('menuitem', { name: /упорядочить значки|clean up icons/i })
      .click()
    await settle(page)
    expect(Math.abs((await icon(page, 0).boundingBox())!.x - home!.x)).toBeLessThan(8)

    // Right-click an icon → Open.
    await icon(page, 2).click({ button: 'right' })
    await expect(menu).toBeVisible()
    await menu.getByRole('menuitem', { name: /^открыть$|^open$/i }).click()
    await settle(page)
    expect(await windowOpacity(page, 2)).toBeGreaterThan(0.75)
  })
})
