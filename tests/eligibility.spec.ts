import { test, expect } from '@playwright/test'
import { gotoReady } from './helpers'

/**
 * The eligibility CTA replaced the funding calculator as the site's primary
 * lead-capture path, so the handoff it performs is now load-bearing: the amount
 * chosen on a marketing page has to survive the navigation into the
 * application, or the applicant is asked the same question twice.
 */
test.describe('eligibility CTA', () => {
  test('carries the chosen amount into the application', async ({ page }) => {
    await gotoReady(page, '/')

    const cta = page.locator('#eligibility')
    await expect(cta.getByText('How much funding are you looking for?')).toBeVisible()

    for (const label of ['$10K', '$25K', '$50K', '$100K', '$250K+']) {
      await expect(cta.getByRole('radio', { name: label })).toBeAttached()
    }

    // The input is sr-only by design; the visible target is its wrapping label.
    await cta.locator('label', { hasText: '$50K' }).click()
    await expect(cta.getByRole('radio', { name: '$50K' })).toBeChecked()

    await cta.getByRole('button', { name: /Check eligibility/i }).click()
    await expect(page).toHaveURL(/\/apply\?amount=/)

    await page.getByLabel(/average monthly revenue/i).selectOption('30-60k')
    await page.getByLabel(/how long have you been in business/i).selectOption('1-3y')
    await page.getByLabel(/what industry/i).selectOption('restaurants')
    await page.getByRole('button', { name: /Continue to application|Start application/i }).click()

    const saved = await page.evaluate(() => {
      const raw = localStorage.getItem('gld-application-v2')
      return raw ? JSON.parse(raw).data.funding.amountRequested : null
    })
    expect(saved, 'the amount must reach the funding step').toBe('$50,000')
  })

  test('is operable by keyboard alone', async ({ page }) => {
    await gotoReady(page, '/')
    const cta = page.locator('#eligibility')

    await cta.getByRole('radio', { name: '$10K' }).focus()
    await page.keyboard.press('ArrowRight')
    await expect(cta.getByRole('radio', { name: '$25K' })).toBeChecked()
  })

  test('applying directly, with no amount, still works', async ({ page }) => {
    await gotoReady(page, '/apply')
    await expect(page.getByLabel(/average monthly revenue/i)).toBeVisible()
  })
})

test('client login is reachable from the header', async ({ page }) => {
  await gotoReady(page, '/')
  await expect(page.locator('header a[href*="login.gldfunding.com"]')).toHaveCount(1)
})
