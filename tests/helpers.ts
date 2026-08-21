import type { Page } from '@playwright/test'

/**
 * Navigate and wait until React has actually hydrated.
 *
 * The site is statically pre-rendered: markup is on screen - and looks
 * interactive - before any handler is attached. Interacting before hydration
 * silently does nothing, which surfaces as flaky "element not found" failures
 * on menus that open via JS. `data-hydrated` is set by RootLayout on mount.
 */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path)
  await page.waitForSelector('html[data-hydrated="true"]', { timeout: 20_000 })
  return page
}
