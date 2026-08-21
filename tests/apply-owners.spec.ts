import { test, expect } from '@playwright/test'
import { gotoReady } from './helpers'

/**
 * The application form is built from the owner count given in step 1.
 *
 * Two things regress easily here: the step list must grow and shrink with that
 * number (and renumber itself), and the authorization must end up asking for
 * exactly one signature per owner — no more, no fewer.
 */

const fillPrecheck = async (page: import('@playwright/test').Page) => {
  await gotoReady(page, '/apply')
  await page.getByLabel("What's your average monthly revenue?").selectOption('30-60k')
  await page.getByLabel('How long have you been in business?').selectOption('3-10y')
  await page.getByLabel('What industry are you in?').selectOption({ index: 1 })
  await page.getByRole('button', { name: /continue to application|start application/i }).click()
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
  await page.getByLabel('How many owners does the business have?').selectOption(owners)
}

const fillOwner = async (page: import('@playwright/test').Page, first: string) => {
  await page.getByLabel('First name').fill(first)
  await page.getByLabel('Last name').fill('Rivera')
  await page.getByLabel('Title / position').fill('Managing Member')
  await page.getByLabel('Ownership percentage').fill('50')
  await page.getByLabel('Email').fill(`${first.toLowerCase()}@test.com`)
  await page.getByLabel('Mobile phone').fill('5165550123')
  await page.getByLabel('Home address').fill('2 Elm St')
  await page.getByLabel('City').fill('Garden City')
  await page.getByLabel('State').selectOption('NY')
  await page.getByLabel('ZIP').fill('11530')
  await page.getByLabel('Date of birth').fill('1980-05-04')
  await page.getByLabel('Social Security number').fill('123456789')
}

test.describe('owner count drives the form', () => {
  test.skip(({ isMobile }) => !!isMobile, 'one viewport is enough for form logic')

  test('one owner: a single owner step, six steps total', async ({ page }) => {
    await fillPrecheck(page)
    await fillBusiness(page, '1')
    await expect(page.getByText(/Step 1 of 6/)).toBeVisible()

    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible()
    await expect(page.getByText(/Step 2 of 6/)).toBeVisible()
  })

  test('three owners: three owner steps, renumbered, eight steps total', async ({ page }) => {
    await fillPrecheck(page)
    await fillBusiness(page, '3')
    await expect(page.getByText(/Step 1 of 8/)).toBeVisible()

    for (const n of [1, 2, 3]) {
      await page.getByRole('button', { name: /continue/i }).click()
      await expect(page.getByRole('heading', { name: `Owner ${n} Information` })).toBeVisible()
      await expect(page.getByText(`Step ${n + 1} of 8`)).toBeVisible()
      await expect(page.getByText(`Owner ${n} of 3`)).toBeVisible()
      await fillOwner(page, `Owner${n}`)
    }

    // Funding
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: 'Funding Information' })).toBeVisible()
    await page.getByLabel('How much are you looking for?').fill('$50,000')
    await page.getByLabel('What will you use it for?').selectOption('inventory')
    await page.getByLabel('How soon do you need the funds?').selectOption('this-week')

    // Existing financing — "No" closes the step.
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: 'Existing Financing' })).toBeVisible()
    await page.getByRole('button', { name: 'No', exact: true }).click()

    // Documents: one file is enough, even though four months are requested (NY).
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: /Bank Statements/ })).toBeVisible()
    await page.getByLabel('Upload bank statements').setInputFiles({
      name: 'statements.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 test'),
    })
    await expect(page.getByText(/1 file uploaded/)).toBeVisible()

    // Authorization: exactly one signature block per owner.
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: /Authorization/ })).toBeVisible()
    await expect(page.getByRole('img', { name: /draw your signature/ })).toHaveCount(3)
    for (const n of [1, 2, 3]) {
      await expect(page.getByText(`Owner #${n} · Owner${n} Rivera`)).toBeVisible()
    }
  })

  test('lowering the count removes the extra steps but keeps what was typed', async ({ page }) => {
    await fillPrecheck(page)
    await fillBusiness(page, '2')
    await page.getByRole('button', { name: /continue/i }).click()

    // Type into owner 2, then drop back to a single owner.
    await fillOwner(page, 'Alex')
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: 'Owner 2 Information' })).toBeVisible()
    await page.getByLabel('First name').fill('Dana')

    await page.getByRole('button', { name: /^back$/i }).click()
    await page.getByRole('button', { name: /^back$/i }).click()
    await page.getByLabel('How many owners does the business have?').selectOption('1')
    await expect(page.getByText(/Step 1 of 6/)).toBeVisible()

    // Put it back — the second owner's details survived the round trip.
    await page.getByLabel('How many owners does the business have?').selectOption('2')
    await page.getByRole('button', { name: /continue/i }).click()
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByLabel('First name')).toHaveValue('Dana')
  })
})
