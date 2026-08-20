import { test, expect } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'
import { KEY_ROUTES, builtRoutes } from './routes'

/** Accessibility, console health, SEO/GEO surface, and the video player. */

test.describe('accessibility (WCAG 2.2 AA)', () => {
  for (const route of KEY_ROUTES) {
    test(`no violations: ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' })
      // Contrast is measured off rendered pixels, so the webfont must be in
      // place first — otherwise fallback metrics make results non-deterministic.
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(250)

      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()

      const report = violations
        .map((v) => `[${v.impact}] ${v.id}: ${v.help}\n    → ${v.nodes[0]?.target.join(' ')}`)
        .join('\n')
      expect(violations.length, report ? `\n${report}` : '').toBe(0)
    })
  }
})

test.describe('runtime health', () => {
  for (const route of KEY_ROUTES) {
    test(`no console or page errors: ${route}`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
      page.on('console', (m) => {
        if (m.type() !== 'error') return
        const t = m.text()
        // Headless-browser chatter that is not a site defect: GPU driver
        // messages, and WebKit's own media controls failing to load their
        // placard icons inside Playwright.
        if (/GL Driver Message|WebGL-0x|Download the React DevTools/.test(t)) return
        if (/Button failed to load, iconName =/.test(t)) return
        errors.push(`console: ${t}`)
      })
      page.on('requestfailed', (r) => {
        const f = r.failure()?.errorText ?? ''
        if (/ERR_ABORTED/.test(f)) return // cancelled media/prefetch
        errors.push(`requestfailed: ${r.url()} ${f}`)
      })

      await page.goto(route, { waitUntil: 'networkidle' })
      await page.waitForTimeout(600)
      expect(errors.join('\n'), errors.join('\n')).toHaveLength(0)
    })
  }
})

test.describe('SEO / GEO surface', () => {
  // Byte-level assertions about dist/ — identical in every browser.
  test.skip(({ isMobile }) => !!isMobile, 'artifact-level, runs once on desktop')

  test('crawl files exist and name the AI agents', async ({ page }) => {
    const robots = await page.request.get('/robots.txt')
    expect(robots.status()).toBe(200)
    const txt = await robots.text()
    for (const agent of ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended']) {
      expect(txt, `robots.txt must name ${agent}`).toContain(agent)
    }
    expect(txt).toContain('Sitemap:')

    const sitemap = await page.request.get('/sitemap.xml')
    expect(sitemap.status()).toBe(200)
    const xml = await sitemap.text()
    const urls = (xml.match(/<loc>/g) || []).length
    expect(urls, 'sitemap covers every built route').toBe(builtRoutes().length)

    expect((await page.request.get('/llms.txt')).status()).toBe(200)
  })

  test('every sitemap URL resolves', async ({ page }) => {
    test.setTimeout(180_000)
    const xml = await (await page.request.get('/sitemap.xml')).text()
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    const bad: string[] = []
    for (const loc of locs) {
      const path = new URL(loc).pathname
      const res = await page.request.get(path)
      if (res.status() !== 200) bad.push(`${path} → ${res.status()}`)
    }
    expect(bad.join('\n'), bad.join('\n')).toHaveLength(0)
  })

  test('structured data parses and declares the org once', async ({ page }) => {
    await page.goto('/')
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) => els.map((e) => e.textContent || ''))

    expect(blocks.length).toBeGreaterThan(2)
    const types = blocks.map((b) => JSON.parse(b)['@type'])
    expect(types).toContain('FinancialService')
    expect(types).toContain('FAQPage')
  })

  test('no placeholder metadata survives anywhere', async ({ page }) => {
    test.setTimeout(180_000)
    const offenders: string[] = []
    for (const route of builtRoutes()) {
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      const desc = await page.locator('meta[name="description"]').getAttribute('content')
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      if (desc === 'desc' || !desc) offenders.push(`${route}: description="${desc}"`)
      if (canonical?.includes('herokuapp')) offenders.push(`${route}: canonical=${canonical}`)
    }
    expect(offenders.join('\n'), offenders.join('\n')).toHaveLength(0)
  })
})

test.describe('overview video', () => {
  test('does not download until played, and is captioned', async ({ page }) => {
    const media: string[] = []
    page.on('request', (r) => {
      if (/\.(mp4|webm)$/.test(r.url())) media.push(r.url())
    })

    await page.goto('/funding/how-it-works', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    expect(media, 'the MP4 must not load before play').toHaveLength(0)

    const video = page.locator('video')
    await expect(video).toHaveAttribute('preload', 'none')
    await expect(page.locator('video track[kind="captions"]')).toHaveCount(1)

    await page.getByRole('button', { name: /Play video/i }).click()
    await page.waitForFunction(() => {
      const v = document.querySelector('video')
      return !!v && !v.paused && v.currentTime > 0
    }, { timeout: 20_000 })

    expect(media.length, 'MP4 loads on play').toBeGreaterThan(0)

    const cues = await page.evaluate(() => document.querySelector('video')?.textTracks[0]?.cues?.length ?? 0)
    expect(cues, 'caption cues parsed').toBeGreaterThan(10)
  })

  test('transcript is in the HTML for crawlers', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'artifact-level, runs once on desktop')
    const res = await page.request.get('/funding/how-it-works')
    const html = await res.text()
    expect(html).toContain('Unlike traditional bank loans')
    expect(html).toContain('"@type":"VideoObject"')
  })
})
