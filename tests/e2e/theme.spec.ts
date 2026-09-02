import { test, expect, type Page } from '@playwright/test'

/*
 * Light / dark theme: first visit follows the OS, the menu-bar / header toggle
 * pins an explicit choice on <html data-theme>, and the choice survives a reload
 * with no flash (applied by an inline <head> script).
 */

const schemeOf = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)

const dataTheme = (page: Page) =>
  page.evaluate(() => document.documentElement.dataset.theme ?? '')

const toggle = (page: Page) =>
  page.getByRole('button', { name: /тёмн|светл|dark theme|light theme/i }).first()

test.describe('theme', () => {
  test('first visit follows prefers-color-scheme, no attribute pinned', async ({
    browser,
  }) => {
    const dark = await browser.newContext({ colorScheme: 'dark' })
    const darkPage = await dark.newPage()
    await darkPage.goto('/')
    await expect(darkPage.locator('h1')).toBeVisible()
    expect(await schemeOf(darkPage)).toBe('dark')
    expect(await dataTheme(darkPage)).toBe('')
    await dark.close()

    const light = await browser.newContext({ colorScheme: 'light' })
    const lightPage = await light.newPage()
    await lightPage.goto('/')
    await expect(lightPage.locator('h1')).toBeVisible()
    expect(await schemeOf(lightPage)).toBe('light')
    await light.close()
  })

  test('the toggle pins a choice and it survives a reload', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' })
    const page = await context.newPage()
    await page.goto('/')
    await expect(toggle(page)).toBeVisible()

    await toggle(page).click()
    expect(await dataTheme(page)).toBe('light')
    expect(await schemeOf(page)).toBe('light')

    await page.reload()
    expect(await dataTheme(page)).toBe('light')
    expect(await schemeOf(page)).toBe('light')

    await toggle(page).click()
    expect(await dataTheme(page)).toBe('dark')

    await context.close()
  })
})
