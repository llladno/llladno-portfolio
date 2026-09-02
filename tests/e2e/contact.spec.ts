import { test, expect, type Page } from '@playwright/test'

const settle = (page: Page) => page.waitForTimeout(800)

test.describe('contact form', () => {
  test('the contact form is in the prerendered HTML', async ({ request }) => {
    const html = await (await request.get('/')).text()
    expect(html).toContain('id="contact"')
    expect(html).toContain('name="email"')
    expect(html).toContain('name="message"')
  })

  test('submitting posts to Web3Forms and shows the thank-you state', async ({
    page,
  }) => {
    await page.route('**/api.web3forms.com/submit', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'ok' }),
      }),
    )

    await page.goto('/#contact')
    await settle(page)

    const form = page.locator('form#contact-form')
    await form.getByLabel(/имя|name/i).fill('Jane Client')
    await form.getByLabel(/почта|e-?mail/i).fill('jane@example.com')
    await form.getByLabel(/сообщение|message/i).fill('Hello from the tests.')
    await form.getByRole('button', { name: /отправить|send/i }).click()

    await expect(page.getByText(/спасибо|thanks|получил/i)).toBeVisible()
  })

  test('a Web3Forms failure shows the error state', async ({ page }) => {
    await page.route('**/api.web3forms.com/submit', (route) =>
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'bad' }),
      }),
    )

    await page.goto('/#contact')
    await settle(page)

    const form = page.locator('form#contact-form')
    await form.getByLabel(/имя|name/i).fill('Jane')
    await form.getByLabel(/почта|e-?mail/i).fill('jane@example.com')
    await form.getByLabel(/сообщение|message/i).fill('Hi')
    await form.getByRole('button', { name: /отправить|send/i }).click()

    await expect(page.getByText(/не удалось|failed|ошибка|error/i)).toBeVisible()
  })
})
