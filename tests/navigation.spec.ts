import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { builtRoutes } from './routes'
import { gotoReady } from './helpers'

/**
 * Navigation, across every input method.
 *
 * These exist because the category dropdowns shipped hover-only: they worked
 * with a mouse, and were completely unreachable on any touch device wide enough
 * to get the desktop nav (iPad, Surface, touch laptops). Regression guard.
 */

const CATEGORIES = [
  { trigger: 'Funding', child: '/funding/cost', overview: '/funding/merchant-cash-advance' },
  { trigger: 'Industries', child: '/industries/restaurants', overview: '/industries' },
]

const triggerFor = (page: Page, label: string) =>
  page.locator('header nav[aria-label="Main"] button', { hasText: label }).first()

test.describe('desktop category menus', () => {
  test.skip(({ isMobile }) => !!isMobile, 'desktop nav only')

  for (const cat of CATEGORIES) {
    test(`${cat.trigger}: opens on hover, click goes to the section`, async ({ page }) => {
      await gotoReady(page, '/')
      const trigger = triggerFor(page, cat.trigger)

      await expect(trigger).toHaveAttribute('aria-expanded', 'false')
      await trigger.hover()
      await expect(page.locator(`header a[href="${cat.child}"]`)).toBeVisible()
      await expect(trigger).toHaveAttribute('aria-expanded', 'true')

      // With a mouse the menu is already open, so a click means "go there".
      await trigger.click()
      await expect(page).toHaveURL(new RegExp(`${cat.overview}$`))
    })

    test(`${cat.trigger}: reachable by TAP (touch device at desktop width)`, async ({ browser }) => {
      // The case that was fully broken: hover never fires, so a hover-only
      // menu can never be opened at all.
      const ctx = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        hasTouch: true,
      })
      const page = await ctx.newPage()
      await gotoReady(page, '/')

      const trigger = triggerFor(page, cat.trigger)
      await trigger.tap()

      const child = page.locator(`header a[href="${cat.child}"]`)
      await expect(child, 'tapping the category must open its menu').toBeVisible()
      await expect(page, 'tapping must not navigate away').toHaveURL(/\/$/)

      await child.click()
      await expect(page).toHaveURL(new RegExp(`${cat.child}$`))
      await ctx.close()
    })

    test(`${cat.trigger}: keyboard operable and Escape closes`, async ({ page }) => {
      await gotoReady(page, '/')
      const trigger = triggerFor(page, cat.trigger)

      await trigger.focus()
      await page.keyboard.press('ArrowDown')
      await expect(page.locator(`header a[href="${cat.child}"]`)).toBeVisible()

      await page.keyboard.press('Escape')
      await expect(page.locator(`header a[href="${cat.child}"]`)).toHaveCount(0)
      await expect(trigger, 'Escape returns focus to the trigger').toBeFocused()
    })

    test(`${cat.trigger}: every menu entry points at a real page`, async ({ page }) => {
      /* links.spec.ts already resolves every href on every page over HTTP.
         Re-fetching them here duplicated that and starved the shared preview
         server, so this asserts the menu's targets against the routes the build
         actually emitted — same guarantee, no network. */
      await gotoReady(page, '/')
      await triggerFor(page, cat.trigger).hover()

      const menu = page.locator(`#menu-${cat.trigger.toLowerCase()}`)
      await expect(menu).toBeVisible()

      const hrefs = await menu.locator('a[href]').evaluateAll((els) =>
        els.map((e) => (e as HTMLAnchorElement).getAttribute('href')!),
      )
      expect(hrefs.length, `${cat.trigger} menu has entries`).toBeGreaterThan(2)

      const routes = new Set(builtRoutes())
      const missing = hrefs.filter((h) => !routes.has(h.split('#')[0]))
      expect(missing.join(', '), `${cat.trigger} menu points at unbuilt routes`).toHaveLength(0)
    })
  }

  test('outside click closes an open menu', async ({ page }) => {
    await gotoReady(page, '/')
    await triggerFor(page, 'Industries').hover()
    await expect(page.locator('header a[href="/industries/restaurants"]')).toBeVisible()

    await page.mouse.click(700, 650)
    await expect(page.locator('header a[href="/industries/restaurants"]')).toHaveCount(0)
  })

  test('nav fits on one line — no wrap, no page overflow', async ({ page }) => {
    for (const width of [1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      await gotoReady(page, '/')
      const nav = page.locator('header nav[aria-label="Main"]')
      const box = await nav.boundingBox()
      expect(box!.height, `nav wrapped at ${width}px`).toBeLessThan(56)

      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      )
      expect(overflows, `horizontal overflow at ${width}px`).toBe(false)
    }
  })
})

test.describe('mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile only')

  test('opens, covers the viewport, and navigates', async ({ page }) => {
    await gotoReady(page, '/')

    const burger = page.getByRole('button', { name: 'Open menu' })
    await expect(burger).toBeVisible()
    await burger.click()

    // Regression: the panel used to render inside the backdrop-filtered
    // <header>, which made it the containing block for position:fixed and
    // collapsed the panel to a ~1px sliver.
    const panel = page.locator('#mobile-menu')
    await expect(panel).toBeVisible()
    const box = await panel.boundingBox()
    expect(box!.height, 'panel must fill the viewport, not collapse').toBeGreaterThan(400)

    await panel.locator('a[href="/funding/cost"]').first().click()
    await expect(page).toHaveURL(/\/funding\/cost$/)
    await expect(page.locator('#mobile-menu')).toHaveCount(0)
  })

  test('header keeps a call and an apply action at every width', async ({ page }) => {
    for (const width of [320, 360, 390, 430]) {
      await page.setViewportSize({ width, height: 800 })
      await gotoReady(page, '/')

      await expect(
        page.locator('header a[href="/apply"]'),
        `no CTA in header at ${width}px`,
      ).toBeVisible()

      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      )
      expect(overflows, `horizontal overflow at ${width}px`).toBe(false)
    }
  })
})

test('logo returns home from a deep page', async ({ page }) => {
  await gotoReady(page, '/locations/new-york')
  await page.locator('header a[aria-label*="home"]').click()
  await expect(page).toHaveURL(/localhost:4173\/$/)
})

test('footer links all resolve', async ({ page }) => {
  await gotoReady(page, '/')
  const hrefs = await page
    .locator('footer a[href^="/"]')
    .evaluateAll((els) => [...new Set(els.map((e) => (e as HTMLAnchorElement).getAttribute('href')!))])

  // Trimmed when the per-state list came out of the footer; the columns and
  // legal row are what must always be there.
  expect(hrefs.length).toBeGreaterThan(15)
  for (const href of hrefs) {
    const res = await page.request.get(href)
    expect(res.status(), `footer → ${href}`).toBe(200)
  }
})
