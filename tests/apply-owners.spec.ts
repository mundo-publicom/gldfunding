import { test, expect } from '@playwright/test'
import { gotoReady } from './helpers'

/**
 * The application is four steps. Extra owners and financing positions are
 * conditional fields on those steps, never extra screens.
 */

const fillPrecheck = async (page: import('@playwright/test').Page) => {
  await gotoReady(page, '/apply')
  await page.getByLabel("What's your average monthly revenue?").selectOption('30-60k')
  await page.getByLabel('How long have you been in business?').selectOption('3-10y')
  await page.getByLabel('What industry are you in?').selectOption({ index: 1 })
  await page.getByRole('button', { name: /start application/i }).click()
}

const fillBusiness = async (page: import('@playwright/test').Page, owners: string) => {
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
  await page.getByLabel('Number of owners').selectOption(owners)
  await page.getByLabel('How much funding are you looking for?').fill('$50,000')
  await page.getByLabel('What will you use it for?').selectOption('inventory')
}

const fillOwnerIn = async (
  page: import('@playwright/test').Page,
  first: string,
  scope?: import('@playwright/test').Locator,
) => {
  const root = scope ?? page
  await root.getByLabel('First name').fill(first)
  await root.getByLabel('Last name').fill('Rivera')
  await root.getByLabel('Title / position').fill('Managing Member')
  await root.getByLabel('Ownership percentage').fill('50')
  await root.getByLabel('Email').fill(`${first.toLowerCase()}@test.com`)
  await root.getByLabel('Mobile phone').fill('5165550123')
  await root.getByLabel('Home address').fill('2 Elm St')
  await root.getByLabel('City').fill('Garden City')
  await root.getByLabel('State').selectOption('NY')
  await root.getByLabel('ZIP').fill('11530')
  await root.getByLabel('Date of birth').fill('1980-05-04')
  await root.getByRole('textbox', { name: 'Social Security number' }).fill('123456789')
}

test.describe('four-step application', () => {
  test.skip(({ isMobile }) => !!isMobile, 'one viewport is enough for form logic')

  test('eligibility never judges and never claims a blanket no-credit-pull', async ({ page }) => {
    await gotoReady(page, '/apply')
    await page.getByLabel("What's your average monthly revenue?").selectOption('under-15k')
    await page.getByLabel('How long have you been in business?').selectOption('under-6m')
    await page.getByLabel('What industry are you in?').selectOption({ index: 1 })

    await expect(page.getByText(/you may not qualify/i)).toHaveCount(0)
    await expect(page.getByText(/no credit pull at any point/i)).toHaveCount(0)
    await expect(page.getByRole('button', { name: /start application/i })).toBeVisible()
  })

  test('one owner: four steps, funding lives on step 1', async ({ page }) => {
    await fillPrecheck(page)
    await expect(page.getByRole('heading', { name: 'Business & Funding Information' })).toBeVisible()
    await fillBusiness(page, '1')
    await expect(page.getByText('Business & Funding', { exact: true })).toBeVisible()
    await expect(page.getByText(/how soon do you need/i)).toHaveCount(0)
    await expect(page.getByText(/minimum 6 months/i)).toHaveCount(0)

    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible()
    await expect(page.getByRole('button', { name: /add another owner/i })).toHaveCount(0)
  })

  test('three owners: still four steps; extra owners are added, not extra screens', async ({
    page,
  }) => {
    await fillPrecheck(page)
    await fillBusiness(page, '3')

    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible()
    await expect(page.getByText('Owner 1 of 3')).toBeVisible()
    await expect(page.getByRole('region', { name: 'Owner 2' })).toHaveCount(0)

    await fillOwnerIn(page, 'Owner1', page.getByRole('region', { name: 'Owner 1' }))
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('region', { name: 'Owner 2' })).toBeVisible()

    await fillOwnerIn(page, 'Owner2', page.getByRole('region', { name: 'Owner 2' }))
    await page.getByRole('button', { name: /add another owner/i }).click()
    await expect(page.getByRole('region', { name: 'Owner 3' })).toBeVisible()
    await fillOwnerIn(page, 'Owner3', page.getByRole('region', { name: 'Owner 3' }))

    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: /Bank Statements/ })).toBeVisible()
    await expect(page.getByText(/do you currently have any existing business financing/i)).toBeVisible()
    await page.getByRole('button', { name: 'No', exact: true }).click()
    await page.getByLabel('Upload bank statements').setInputFiles({
      name: 'statements.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 test'),
    })
    await expect(page.getByText(/1 file uploaded/)).toBeVisible()

    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: 'Review & Sign' })).toBeVisible()
    await expect(page.getByRole('img', { name: /draw your signature/ })).toHaveCount(1)
    await expect(page.getByText('123-45-6789')).toHaveCount(0)
    await expect(page.getByText('•••-••-6789')).toHaveCount(3)
    await expect(page.getByText('Owner1 Rivera')).toBeVisible()
    await expect(page.getByText('Owner2 Rivera')).toBeVisible()
    await expect(page.getByText('Owner3 Rivera')).toBeVisible()
  })

  test('lowering the owner count keeps what was typed', async ({ page }) => {
    await fillPrecheck(page)
    await fillBusiness(page, '2')
    await page.getByRole('button', { name: /continue/i }).click()

    await fillOwnerIn(page, 'Alex', page.getByRole('region', { name: 'Owner 1' }))
    await page.getByRole('button', { name: /add another owner/i }).click()
    await page.getByRole('region', { name: 'Owner 2' }).getByLabel('First name').fill('Dana')

    await page.getByRole('button', { name: /^back$/i }).click()
    await page.getByLabel('Number of owners').selectOption('1')

    await page.getByLabel('Number of owners').selectOption('2')
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('region', { name: 'Owner 1' }).getByLabel('First name')).toHaveValue(
      'Alex',
    )
    await page.getByRole('button', { name: /add another owner/i }).click()
    await expect(page.getByRole('region', { name: 'Owner 2' }).getByLabel('First name')).toHaveValue(
      'Dana',
    )
  })

  test('existing financing fields appear only after Yes', async ({ page }) => {
    await fillPrecheck(page)
    await fillBusiness(page, '1')
    await page.getByRole('button', { name: /continue/i }).click()
    await fillOwnerIn(page, 'Alex')
    await page.getByRole('button', { name: /continue/i }).click()

    await expect(page.getByLabel('Provider / funder name')).toHaveCount(0)
    await page.getByRole('button', { name: 'Yes', exact: true }).click()
    await expect(page.getByLabel('Provider / funder name')).toBeVisible()
    await expect(page.getByLabel('Current balance')).toBeVisible()
    await expect(page.getByLabel('Payment amount')).toBeVisible()
    await expect(page.getByLabel('Payment frequency')).toBeVisible()
    await expect(page.getByLabel(/original amount/i)).toHaveCount(0)
    await page.getByRole('button', { name: /add another financing position/i }).click()
    await expect(page.getByText('Financing position 2')).toBeVisible()
  })
})
