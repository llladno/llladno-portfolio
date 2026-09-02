import { test, expect, type Page } from '@playwright/test'

const settle = (page: Page) => page.waitForTimeout(1000)

test.describe('résumé', () => {
  test('the plain-stack résumé download link is in the prerendered HTML', async ({
    request,
  }) => {
    const ru = await request.get('/')
    expect(await ru.text()).toContain('href="/resume/ru.pdf"')
    const en = await request.get('/en/')
    expect(await en.text()).toContain('href="/resume/en.pdf"')
  })

  test('the Dock résumé tile opens a modal with a download link; Escape closes it', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Dock is desktop-only')

    await page.goto('/#about')
    await settle(page)

    const dock = page.getByRole('navigation', {
      name: /панель приложений|application dock/i,
    })
    const trigger = dock.getByRole('button', { name: /резюме|résumé/i })
    await expect(trigger).toBeVisible()
    await trigger.click()

    const dialog = page.getByRole('dialog', { name: /резюме|résumé/i })
    await expect(dialog).toBeVisible()
    const download = dialog.getByRole('link', { name: /скачать|download/i })
    await expect(download).toHaveAttribute('href', '/resume/ru.pdf')
    await expect(download).toHaveAttribute('download', /.*/)

    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
  })
})
