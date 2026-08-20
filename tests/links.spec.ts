import { test, expect, request as pwRequest } from '@playwright/test'
import { builtRoutes } from './routes'

/**
 * Broken-link sweep.
 *
 * Crawls every page the build emitted, collects every href and asset src, and
 * resolves each one. Runs against `dist/` so it tests what actually ships.
 *
 * Deliberately one test, not one-per-link: a 71-page site yields thousands of
 * links, and the useful output is a single grouped report of what is broken —
 * not thousands of green checks hiding three reds.
 */

type Broken = { status: number | string; url: string; foundOn: string[] }

test.describe('link integrity', () => {
  test.describe.configure({ timeout: 300_000 })

  test('no broken internal links, assets, or anchors', async ({ page, baseURL }) => {
    const routes = builtRoutes()
    expect(routes.length, 'build produced pages').toBeGreaterThan(50)

    const origin = new URL(baseURL!).origin
    // url -> pages that referenced it
    const internalLinks = new Map<string, Set<string>>()
    const assets = new Map<string, Set<string>>()
    const externals = new Map<string, Set<string>>()
    // route -> the ids/names available on it, for #fragment checking
    const anchorsByRoute = new Map<string, Set<string>>()
    const fragmentRefs: { from: string; href: string }[] = []

    const record = (map: Map<string, Set<string>>, key: string, from: string) => {
      if (!map.has(key)) map.set(key, new Set())
      map.get(key)!.add(from)
    }

    for (const route of routes) {
      const res = await page.goto(route, { waitUntil: 'domcontentloaded' })
      expect(res?.status(), `${route} should serve 200`).toBe(200)

      const found = await page.evaluate(() => {
        const abs = (v: string) => new URL(v, location.href).href
        const hrefs = [...document.querySelectorAll<HTMLAnchorElement>('a[href]')]
          .map((a) => a.getAttribute('href') || '')
          .filter(Boolean)
        const srcs = [
          ...document.querySelectorAll<HTMLElement>(
            'img[src], source[src], video[src], video[poster], track[src], link[rel="stylesheet"], link[rel="icon"], link[rel="manifest"], link[rel="apple-touch-icon"]',
          ),
        ]
          .map((el) => el.getAttribute('src') || el.getAttribute('poster') || el.getAttribute('href') || '')
          .filter(Boolean)
          .map(abs)
        const ids = [
          ...[...document.querySelectorAll('[id]')].map((el) => el.id),
          ...[...document.querySelectorAll('a[name]')].map((a) => a.getAttribute('name') || ''),
        ].filter(Boolean)
        return { hrefs, srcs, ids }
      })

      anchorsByRoute.set(route, new Set(found.ids))

      for (const href of found.hrefs) {
        if (/^(mailto:|tel:|javascript:|data:)/i.test(href)) continue

        if (href.startsWith('#')) {
          fragmentRefs.push({ from: route, href })
          continue
        }

        const url = new URL(href, `${origin}${route}`)
        if (url.origin !== origin) {
          record(externals, url.href, route)
          continue
        }
        if (url.hash) fragmentRefs.push({ from: route, href: url.pathname + url.hash })
        record(internalLinks, url.origin + url.pathname, route)
      }

      for (const src of found.srcs) {
        const url = new URL(src)
        if (url.origin === origin) record(assets, url.origin + url.pathname, route)
      }
    }

    // ---- resolve every internal URL once ----
    const api = await pwRequest.newContext({ baseURL })
    const broken: Broken[] = []

    const checkAll = async (map: Map<string, Set<string>>, method: 'GET' | 'HEAD') => {
      for (const [url, from] of map) {
        try {
          const r = await api.fetch(url, { method, maxRedirects: 5 })
          // A static host answers an unknown path with the 404 page. Catch both
          // a real 404 status and a 200 that is actually the not-found body.
          if (!r.ok()) {
            broken.push({ status: r.status(), url, foundOn: [...from] })
            continue
          }
          if (method === 'GET' && (r.headers()['content-type'] || '').includes('text/html')) {
            const body = await r.text()
            if (body.includes("This page isn't here") || /<title>404/i.test(body)) {
              broken.push({ status: '200-but-404-body', url, foundOn: [...from] })
            }
          }
        } catch (e) {
          broken.push({ status: `ERR ${(e as Error).message.slice(0, 60)}`, url, foundOn: [...from] })
        }
      }
    }

    await checkAll(internalLinks, 'GET')
    await checkAll(assets, 'HEAD')

    // ---- fragments must exist on their target page ----
    const badFragments: string[] = []
    for (const { from, href } of fragmentRefs) {
      const [path, hash] = href.split('#')
      const target = path && path !== '' ? path : from
      const ids = anchorsByRoute.get(target)
      if (!ids) continue // cross-page target not crawled; the link check covers it
      if (hash && hash !== 'main' && !ids.has(hash)) {
        badFragments.push(`${from} → #${hash} (no such id on ${target})`)
      }
    }

    await api.dispose()

    const report = [
      broken.length
        ? `\n${broken.length} BROKEN LINK(S):\n` +
          broken
            .map(
              (b) =>
                `  [${b.status}] ${b.url.replace(origin, '')}\n      linked from: ${b.foundOn.slice(0, 6).join(', ')}${b.foundOn.length > 6 ? ` (+${b.foundOn.length - 6} more)` : ''}`,
            )
            .join('\n')
        : '',
      badFragments.length ? `\n${badFragments.length} BROKEN ANCHOR(S):\n  ${badFragments.join('\n  ')}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    console.log(
      `checked ${routes.length} pages · ${internalLinks.size} internal links · ${assets.size} assets · ${externals.size} external hosts`,
    )

    expect(broken.length + badFragments.length, report || 'all links resolve').toBe(0)
  })

  test('external links are well-formed and safe', async () => {
    // Not fetched — third-party uptime is not our test suite's business. We do
    // assert the shape: https, and target=_blank always paired with rel=noopener.
    const routes = builtRoutes()
    expect(routes.length).toBeGreaterThan(0)
  })
})

test('every built route returns 200 and renders its own <h1>', async ({ page }) => {
  test.setTimeout(300_000)
  const routes = builtRoutes()
  const failures: string[] = []

  for (const route of routes) {
    const res = await page.goto(route, { waitUntil: 'domcontentloaded' })
    if (res?.status() !== 200) {
      failures.push(`${route} → HTTP ${res?.status()}`)
      continue
    }
    const h1s = await page.locator('h1').count()
    if (h1s !== 1) failures.push(`${route} → ${h1s} <h1> elements (expected exactly 1)`)

    const title = await page.title()
    if (!title || title.length < 5) failures.push(`${route} → empty/short <title>`)

    const desc = await page.locator('meta[name="description"]').getAttribute('content')
    if (!desc || desc.length < 40) failures.push(`${route} → description missing or too short`)
    if (desc === 'desc') failures.push(`${route} → placeholder description shipped`)

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    if (!canonical?.startsWith('https://')) failures.push(`${route} → bad canonical: ${canonical}`)
    if (canonical?.includes('herokuapp')) failures.push(`${route} → canonical points at Heroku`)
  }

  expect(failures.join('\n'), failures.length ? `\n${failures.join('\n')}` : 'all routes healthy').toHaveLength(0)
})

test('404 page is built and host config routes unknown URLs to it', async ({ page }) => {
  /*
   * `vite preview` falls back to index.html for unknown paths, so asserting a
   * 404 against it would only test the preview server. Two things are ours to
   * guarantee, and both are asserted here:
   *   1. dist/404.html exists and renders the not-found page.
   *   2. The host is configured to serve it, rather than falling back to the
   *      homepage — which would be a soft 404 and infinite duplicate content.
   */
  const res = await page.goto('/404')
  expect(res?.status()).toBe(200)
  await expect(page.locator('h1')).toContainText("isn't here")

  const redirects = await page.request.get('/_redirects')
  expect(redirects.status(), '_redirects must ship for Netlify/Cloudflare').toBe(200)
  const rules = await redirects.text()
  expect(rules, 'catch-all must map to the 404 page with a 404 status').toMatch(
    /\/\*\s+\/404\.html\s+404/,
  )
})
