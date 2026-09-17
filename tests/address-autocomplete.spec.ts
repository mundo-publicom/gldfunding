import { test, expect, type Page } from '@playwright/test'
import { gotoReady } from './helpers'

const mockScript = () => {
  window.__GLD_PLACES_MOCK__ = {
    suggest(input) {
      const q = input.toLowerCase()
      if (q.includes('elm')) {
        return [
          {
            id: 'elm',
            primary: '2 Elm Street',
            secondary: 'Garden City, NY, USA',
            query: '2 Elm Street, Garden City, NY, USA',
          },
        ]
      }
      if (q.includes('stewart') || q.includes('591')) {
        return [
          {
            id: 'stewart',
            primary: '591 Stewart Avenue',
            secondary: 'Garden City, NY, USA',
            query: '591 Stewart Avenue, Garden City, NY, USA',
          },
        ]
      }
      return []
    },
    validate(query, current) {
      const elm = /elm/i.test(query)
      const next = elm
        ? {
            street: '2 Elm Street',
            city: 'Garden City',
            state: 'NY',
            zip: '11530',
            formatted: '2 Elm Street, Garden City, NY 11530',
            confirmed: true,
          }
        : {
            street: '591 Stewart Avenue',
            city: 'Garden City',
            state: 'NY',
            zip: '11530',
            formatted: '591 Stewart Avenue, Garden City, NY 11530',
            confirmed: true,
          }
      if (current && current.zip.replace(/\D/g, '') === '00000') {
        return {
          ...next,
          confirmed: false,
          warning:
            'City, state, and ZIP do not match this street. Check the combination, or pick an address from the list.',
        }
      }
      return next
    },
  }
}

const fillPrecheck = async (page: Page) => {
  await page.addInitScript(mockScript)
  await gotoReady(page, '/apply')
  await page.getByLabel("What's your average monthly revenue?").selectOption('30-60k')
  await page.getByLabel('How long have you been in business?').selectOption('3-10y')
  await page.getByLabel('What industry are you in?').selectOption({ index: 1 })
  await page.getByRole('button', { name: /start application/i }).click()
}

test.describe('address autocomplete', () => {
  test.skip(({ isMobile }) => !!isMobile, 'logic covered on desktop; touch targets checked on mobile')

  test('business address suggestions populate street, city, state, and ZIP', async ({ page }) => {
    await fillPrecheck(page)
    const street = page.getByLabel('Business street address')
    await street.fill('591 Stewart')
    const list = page.getByRole('listbox', { name: 'Address suggestions' })
    await expect(list).toBeVisible()
    await expect(list.getByRole('option', { name: /591 Stewart Avenue/ })).toBeVisible()
    await list.getByRole('option', { name: /591 Stewart Avenue/ }).click()

    await expect(street).toHaveValue('591 Stewart Avenue')
    await expect(page.getByLabel('City')).toHaveValue('Garden City')
    await expect(page.getByLabel('State')).toHaveValue('NY')
    await expect(page.getByLabel('ZIP')).toHaveValue('11530')
    await expect(page.getByText(/Using 591 Stewart Avenue, Garden City, NY 11530/)).toBeVisible()
  })

  test('home address works for every owner, and manual entry is still allowed', async ({
    page,
  }) => {
    await fillPrecheck(page)
    await page.getByLabel('Number of owners').selectOption('2')
    await page.getByLabel('Legal business name').fill('Test Co LLC')
    await page.getByLabel('Entity type').selectOption('llc')
    await page.getByLabel('EIN').fill('123456789')
    await page.getByLabel('Business street address').fill('1 Main St')
    await page.getByLabel('City').fill('Garden City')
    await page.getByLabel('State').selectOption('NY')
    await page.getByLabel('ZIP').fill('11530')
    await page.getByLabel('Business phone').fill('5165550123')
    await page.getByLabel('Industry').selectOption({ index: 1 })
    await page.getByLabel('Business start date').fill('2019-04')
    await page.getByLabel('Average monthly revenue').fill('$50,000')
    await page.getByLabel('How much funding are you looking for?').fill('$50,000')
    await page.getByLabel('What will you use it for?').selectOption('inventory')
    await page.getByRole('button', { name: /continue/i }).click()

    const owner1 = page.getByRole('region', { name: 'Owner 1' })
    await owner1.getByLabel('Home address').fill('2 Elm')
    const list = page.getByRole('listbox', { name: 'Address suggestions' })
    await expect(list.getByRole('option', { name: /2 Elm Street/ })).toBeVisible()
    await list.getByRole('option', { name: /2 Elm Street/ }).click()
    await expect(owner1.getByLabel('Home address')).toHaveValue('2 Elm Street')
    await expect(owner1.getByLabel('City')).toHaveValue('Garden City')
    await expect(owner1.getByLabel('ZIP')).toHaveValue('11530')

    await page.getByRole('button', { name: /add another owner/i }).click()
    const owner2 = page.getByRole('region', { name: 'Owner 2' })
    await owner2.getByLabel('Home address').fill('99 Not In The Index Lane')
    const owner2List = owner2.getByRole('listbox', { name: 'Address suggestions' })
    await expect(owner2List).toBeVisible()
    await expect(owner2List.getByRole('option')).toHaveCount(0)
    await expect(owner2.getByText(/No matching U.S. addresses/)).toBeVisible()
    await owner2.getByLabel('City').fill('Hempstead')
    await owner2.getByLabel('State').selectOption('NY')
    await owner2.getByLabel('ZIP').fill('11550')
    await expect(owner2.getByLabel('Home address')).toHaveValue('99 Not In The Index Lane')
    await expect(owner2.getByLabel('City')).toHaveValue('Hempstead')
  })

  test('city / state / ZIP mismatch is a warning, not a hard block', async ({ page }) => {
    await fillPrecheck(page)
    await page.getByLabel('Business street address').fill('591 Stewart Avenue')
    await page.getByLabel('City').fill('Garden City')
    await page.getByLabel('State').selectOption('NY')
    await page.getByLabel('ZIP').fill('00000')
    await expect(
      page.getByText(/City, state, and ZIP do not match this street/),
    ).toBeVisible({ timeout: 8_000 })
  })
})

test.describe('address autocomplete — mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'desktop covered above')

  test('suggestions are tappable and sit in the viewport', async ({ page }) => {
    await fillPrecheck(page)
    await page.getByLabel('Business street address').fill('591 Stewart')
    const option = page.getByRole('option', { name: /591 Stewart Avenue/ })
    await expect(option).toBeVisible()
    const box = await option.boundingBox()
    expect(box, 'suggestion must be on screen').toBeTruthy()
    expect(box!.height, 'touch target must be at least 44px').toBeGreaterThanOrEqual(44)
    const view = page.viewportSize()
    expect(box!.y + box!.height).toBeLessThanOrEqual((view?.height ?? 0) + 1)
    await option.tap()
    await expect(page.getByLabel('Business street address')).toHaveValue('591 Stewart Avenue')
    await expect(page.getByLabel('ZIP')).toHaveValue('11530')
  })
})
