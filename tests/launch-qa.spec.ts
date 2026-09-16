import { test, expect, type Page, type Locator } from '@playwright/test'
import { gotoReady } from './helpers'

/**
 * Launch QA: eligibility through confirmation, including the flows a live
 * merchant will actually take. Assertions name the product requirement they
 * protect so a failure reads as a launch finding, not a test implementation.
 */

const pdf = (name: string) => ({
  name,
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4 launch-qa'),
})

const fillPrecheck = async (page: Page) => {
  await page.getByLabel("What's your average monthly revenue?").selectOption('30-60k')
  await page.getByLabel('How long have you been in business?').selectOption('3-10y')
  await page.getByLabel('What industry are you in?').selectOption('restaurants')
  await page.getByRole('button', { name: /start application/i }).click()
}

const fillBusiness = async (page: Page, owners: string) => {
  await page.getByLabel('Legal business name').fill('Harbor Grill LLC')
  await page.getByLabel('Entity type').selectOption('llc')
  await page.getByLabel('EIN').fill('123456789')
  await page.getByLabel('Business street address').fill('1 Main St')
  await page.getByLabel('City').fill('Garden City')
  await page.getByLabel('State').selectOption('NY')
  await page.getByLabel('ZIP').fill('11530')
  await page.getByLabel('Business phone').fill('5165550123')
  await page.getByLabel('Industry').selectOption('restaurants')
  await page.getByLabel('Business start date').fill('2019-04')
  await page.getByLabel('Average monthly revenue').fill('$50,000')
  await page.getByLabel('Number of owners').selectOption(owners)
  const amount = page.getByLabel('How much funding are you looking for?')
  if (!(await amount.inputValue())) await amount.fill('$50,000')
  await page.getByLabel('What will you use it for?').selectOption('inventory')
}

const fillOwnerIn = async (root: Locator | Page, first: string, pct = '100') => {
  await root.getByLabel('First name').fill(first)
  await root.getByLabel('Last name').fill('Rivera')
  await root.getByLabel('Title / position').fill('Managing Member')
  await root.getByLabel('Ownership percentage').fill(pct)
  await root.getByLabel('Email').fill(`${first.toLowerCase()}@harborgrill.test`)
  await root.getByLabel('Mobile phone').fill('5165550123')
  await root.getByLabel('Home address').fill('2 Elm St')
  await root.getByLabel('City').fill('Garden City')
  await root.getByLabel('State').selectOption('NY')
  await root.getByLabel('ZIP').fill('11530')
  await root.getByLabel('Date of birth').fill('1980-05-04')
  await root.getByRole('textbox', { name: 'Social Security number' }).fill('123456789')
}

const signTyped = async (page: Page, name: string) => {
  await page.getByRole('checkbox', { name: /agree that .* contact me/i }).check()
  await page.getByRole('button', { name: 'Type' }).click()
  await page.getByLabel(/type your signature/i).fill(name)
}

test.describe('launch QA — full application', () => {
  test.skip(({ isMobile }) => !!isMobile, 'mobile viewport covered in a dedicated test')

  test('eligibility CTA hands the amount into Start Application', async ({ page }) => {
    await gotoReady(page, '/')
    const cta = page.locator('#eligibility')
    await cta.locator('label', { hasText: '$50K' }).click()
    await cta.getByRole('button', { name: /Check eligibility/i }).click()
    await expect(page).toHaveURL(/\/apply\?amount=/)

    await fillPrecheck(page)
    await expect(page.getByRole('heading', { name: 'Business & Funding Information' })).toBeVisible()
    await expect(page.getByLabel('How much funding are you looking for?')).toHaveValue('$50,000')
  })

  test('step 1 validation, persistence, single-owner happy path through confirmation', async ({
    page,
  }) => {
    const outbound: { url: string; method: string }[] = []
    page.on('request', (req) => {
      const url = req.url()
      if (url.startsWith('http://localhost')) return
      outbound.push({ url, method: req.method() })
    })

    await gotoReady(page, '/apply')
    await page.evaluate(() => localStorage.removeItem('gld-application-v3'))
    await page.reload()
    await page.waitForSelector('html[data-hydrated="true"]')

    /* Eligibility never judges. */
    await page.getByLabel("What's your average monthly revenue?").selectOption('under-15k')
    await page.getByLabel('How long have you been in business?').selectOption('under-6m')
    await page.getByLabel('What industry are you in?').selectOption('restaurants')
    await expect(page.getByText(/you may not qualify/i)).toHaveCount(0)
    await page.getByRole('button', { name: /start application/i }).click()

    /* Empty Continue surfaces Step 1 validation. */
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('alert').first()).toBeVisible()
    await expect(page.getByLabel('Legal business name')).toHaveAttribute('aria-invalid', 'true')

    await fillBusiness(page, '1')

    /* Persistence: reload keeps the draft. */
    await page.reload()
    await page.waitForSelector('html[data-hydrated="true"]')
    await expect(page.getByText(/picked up where you left off/i)).toBeVisible()
    await expect(page.getByLabel('Legal business name')).toHaveValue('Harbor Grill LLC')

    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible()

    /* SSN Show / Hide. */
    await fillOwnerIn(page, 'Alex')
    const ssn = page.getByRole('textbox', { name: 'Social Security number' })
    await expect(ssn).toHaveClass(/ssn-masked/)
    await page.getByRole('button', { name: /show social security number/i }).click()
    await expect(ssn).not.toHaveClass(/ssn-masked/)
    await expect(page.getByRole('button', { name: /hide social security number/i })).toBeVisible()
    await page.getByRole('button', { name: /hide social security number/i }).click()
    await expect(ssn).toHaveClass(/ssn-masked/)

    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: /Bank Statements/ })).toBeVisible()

    /* Bank connection always fails in this build; upload is the fallback. */
    await page.getByRole('button', { name: /connect your bank/i }).first().click()
    await page.getByRole('button', { name: /connect to your bank/i }).click()
    await expect(page.getByText(/couldn't connect to your bank/i)).toBeVisible()
    await expect(page.getByText(/upload your statements below/i)).toBeVisible()

    await page.getByLabel('Upload bank statements').setInputFiles([
      pdf('jan.pdf'),
      pdf('feb.pdf'),
    ])
    await expect(page.getByText(/2 files uploaded/)).toBeVisible({ timeout: 15_000 })

    /* Existing financing = No. */
    await page.getByRole('button', { name: 'No', exact: true }).click()
    await expect(page.getByLabel('Provider / funder name')).toHaveCount(0)

    /* Back / Continue keep data. */
    await page.getByRole('button', { name: /^back$/i }).click()
    await expect(page.getByRole('textbox', { name: 'Social Security number' })).toHaveValue(
      '123-45-6789',
    )
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByText(/2 files uploaded/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'No', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: 'Review & Sign' })).toBeVisible()

    /* Review never shows a full SSN. */
    await expect(page.getByText('123-45-6789')).toHaveCount(0)
    await expect(page.getByText('•••-••-6789')).toHaveCount(1)
    await expect(page.getByText('Harbor Grill LLC')).toBeVisible()
    await expect(page.getByText('Alex Rivera')).toBeVisible()
    await expect(page.getByText(/2 statements uploaded/i)).toBeVisible()

    /* Edit returns to the section and Continue brings the applicant back. */
    await page.getByRole('button', { name: 'Edit' }).first().click()
    await expect(page.getByRole('heading', { name: 'Business & Funding Information' })).toBeVisible()
    await expect(page.getByLabel('Legal business name')).toHaveValue('Harbor Grill LLC')
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: 'Review & Sign' })).toBeVisible()

    /* Authorization expand / collapse. */
    await page.getByRole('button', { name: /read full text/i }).first().click()
    await expect(page.getByText(/PLACEHOLDER — counsel to supply/i)).toBeVisible()
    await page.getByRole('button', { name: /hide full text/i }).first().click()

    await expect(page.getByRole('heading', { name: 'Communications Consent' })).toBeVisible()
    await page.getByRole('button', { name: /read full text/i }).nth(5).click()
    await expect(page.getByText(/counsel must confirm this clause/i)).toBeVisible()
    await page.getByRole('button', { name: /hide full text/i }).click()

    const authPdf = page.getByRole('link', { name: /download the complete authorization/i })
    await expect(authPdf).toHaveAttribute('href', '/legal/application-authorization.pdf')
    const pdfRes = await page.request.get('/legal/application-authorization.pdf')
    expect(pdfRes.status(), 'authorization PDF must exist').not.toBe(404)

    await page.getByRole('button', { name: /submit application/i }).click()
    await expect(page.getByText(/confirm you agree to be contacted/i)).toBeVisible()

    await page.getByLabel('Applicant name').fill('Alex Rivera')
    await signTyped(page, 'Alex Rivera')
    await expect(page.getByText(/populated automatically/i)).toBeVisible()

    /* Double-submit: two clicks, one confirmation. */
    const submit = page.getByRole('button', { name: /submit application/i })
    await Promise.all([submit.click(), submit.click()])
    await expect(page.getByRole('heading', { name: 'Application submitted' })).toHaveCount(1)
    await expect(page.getByText(/application id/i)).toBeVisible()
    await expect(page.getByText(/a confirmation is on its way to/i)).toBeVisible()
    await expect(page.getByText('alex@harborgrill.test')).toBeVisible()

    /* Nothing left the origin — no CRM, no email, no upload endpoint. */
    expect(
      outbound.filter((r) => !r.url.includes('localhost') && !r.url.includes('font')),
      'a real submission must leave the browser',
    ).toEqual([])
  })

  test('multiple owners, existing financing Yes, multiple positions', async ({ page }) => {
    await gotoReady(page, '/apply')
    await page.evaluate(() => localStorage.removeItem('gld-application-v3'))
    await page.reload()
    await page.waitForSelector('html[data-hydrated="true"]')

    await fillPrecheck(page)
    await fillBusiness(page, '2')
    await page.getByRole('button', { name: /continue/i }).click()

    await expect(page.getByText('Owner 1 of 2')).toBeVisible()
    await fillOwnerIn(page.getByRole('region', { name: 'Owner 1' }), 'Alex', '60')
    await page.getByRole('button', { name: /add another owner/i }).click()
    await fillOwnerIn(page.getByRole('region', { name: 'Owner 2' }), 'Dana', '40')
    await page.getByRole('button', { name: /continue/i }).click()

    await page.getByRole('button', { name: /upload statements/i }).click()
    await page.getByLabel('Upload bank statements').setInputFiles(pdf('combined.pdf'))
    await expect(page.getByText(/1 file uploaded/)).toBeVisible({ timeout: 15_000 })

    await page.getByRole('button', { name: 'Yes', exact: true }).click()
    await page.getByLabel('Provider / funder name').fill('Rapid Advance')
    await page.getByLabel('Current balance').fill('$18,000')
    await page.getByLabel('Payment amount').fill('$420')
    await page.getByLabel('Payment frequency').selectOption('daily')
    await page.getByRole('button', { name: /add another financing position/i }).click()
    await expect(page.getByText('Financing position 2')).toBeVisible()
    const pos2 = page.locator('.card', { hasText: 'Financing position 2' })
    await pos2.getByLabel('Provider / funder name').fill('Capital Stack')
    await pos2.getByLabel('Current balance').fill('$9,500')
    await pos2.getByLabel('Payment amount').fill('$275')
    await pos2.getByLabel('Payment frequency').selectOption('weekly')

    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('heading', { name: 'Review & Sign' })).toBeVisible()
    await expect(page.getByText('Alex Rivera')).toBeVisible()
    await expect(page.getByText('Dana Rivera')).toBeVisible()
    await expect(page.getByText('•••-••-6789')).toHaveCount(2)
    await expect(page.getByText('Rapid Advance · $18,000 · $420 · daily')).toBeVisible()
    await expect(page.getByText('Capital Stack · $9,500 · $275 · weekly')).toBeVisible()
    await expect(
      page.getByText(/does not authorize a personal credit or background check for another owner/i),
    ).toBeVisible()
  })
})

test.describe('launch QA — mobile apply', () => {
  test.skip(({ isMobile }) => !isMobile, 'desktop covered above')

  test('eligibility through bank fallback fits a phone and submits', async ({ page }) => {
    await gotoReady(page, '/apply')
    await page.evaluate(() => localStorage.removeItem('gld-application-v3'))
    await page.reload()
    await page.waitForSelector('html[data-hydrated="true"]')

    await fillPrecheck(page)
    await fillBusiness(page, '1')
    await page.getByRole('button', { name: /continue/i }).click()
    await fillOwnerIn(page, 'Alex')
    await page.getByRole('button', { name: /continue/i }).click()

    await page.getByRole('button', { name: /upload statements/i }).click()
    await page.getByLabel('Upload bank statements').setInputFiles(pdf('jan.pdf'))
    await expect(page.getByText(/1 file uploaded/)).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: 'No', exact: true }).click()
    await page.getByRole('button', { name: /continue/i }).click()

    await page.getByLabel('Applicant name').fill('Alex Rivera')
    await signTyped(page, 'Alex Rivera')
    await page.getByRole('button', { name: /submit application/i }).click()
    await expect(page.getByRole('heading', { name: 'Application submitted' })).toBeVisible()

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(overflow, 'apply must not overflow the phone viewport').toBe(false)
  })
})
