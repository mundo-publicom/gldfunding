/**
 * Post-build: generate the crawl surface and trim the critical path.
 *
 *   1. robots.txt      — explicitly admits AI crawlers (GEO depends on this)
 *   2. sitemap.xml     — the current site has none; /sitemap.xml returns a 404 page
 *   3. llms.txt        — a plain-language index for answer engines
 *   4. Strip the hero's WebGL modulepreload, which vite-react-ssg injects and
 *      which fetches bytes for users the gates will reject.
 *   5. .nojekyll     — GitHub Pages otherwise hands the output to Jekyll, which
 *                      drops files and directories beginning with an underscore.
 *   6. Aliases        — a static redirect page per entry in src/data/redirects.json,
 *                      plus matching 301s in _redirects for hosts that honour it.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = fileURLToPath(new URL('../dist', import.meta.url))
const REDIRECTS = JSON.parse(
  readFileSync(fileURLToPath(new URL('../src/data/redirects.json', import.meta.url)), 'utf8'),
)

// The canonical origin every absolute URL in the crawl surface is built from.
// Override for a GitHub Pages project site: SITE_ORIGIN=https://user.github.io
const ORIGIN = (process.env.SITE_ORIGIN || 'https://www.gldfunding.com').replace(/\/$/, '')

// Matches vite's `base`. '/' collapses to '' so routes stay `/about`, while a
// project-site base of '/gldfunding/' yields `/gldfunding/about`.
const BASE = (process.env.BASE_PATH || '/').replace(/\/$/, '')

const url = (route) => `${ORIGIN}${BASE}${route === '/' && BASE ? '/' : route}`

// A build is only the real site when it is served from the canonical origin at
// the root. Anything else — a GitHub Pages staging URL, a preview host — must
// not be indexed: the legal pages, disclosures and state notes are still
// pending counsel review, and an answer engine that ingests them now will go on
// citing them long after they change.
const CANONICAL_ORIGIN = 'https://www.gldfunding.com'
const IS_PRODUCTION = ORIGIN === CANONICAL_ORIGIN && BASE === ''

const TODAY = new Date().toISOString().slice(0, 10)

/* ---------- collect routes ---------- */

function htmlFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full))
    else if (entry.endsWith('.html')) out.push(full)
  }
  return out
}

const files = htmlFiles(DIST)

const routes = files
  .map((f) => {
    const rel = relative(DIST, f).replace(/\\/g, '/')
    if (rel === 'index.html') return '/'
    if (rel === '404.html') return null
    return `/${rel.replace(/\.html$/, '')}`
  })
  .filter((r) => r !== null && !(r in REDIRECTS))
  .sort()

const fileFor = (route) => join(DIST, route === '/' ? 'index.html' : `${route.slice(1)}.html`)

const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

/** Title, description and canonical exactly as the page itself declares them. */
const headOf = (route) => {
  const html = readFileSync(fileFor(route), 'utf8')
  const pick = (re) => decode(html.match(re)?.[1] ?? '')
  return {
    title: pick(/<title[^>]*>([^<]*)<\/title>/).replace(/ \| GLD Factoring LLC DBA GLD Funding$/, ''),
    description: pick(/<meta[^>]*name="description"[^>]*content="([^"]*)"/),
    canonical: pick(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/),
  }
}

// The steps come from the page's own HowTo JSON-LD, so llms.txt can never say
// something different from what the page says.
function howItWorks() {
  const route = '/funding/how-it-works'
  if (!routes.includes(route)) return ''
  const blocks = [...readFileSync(fileFor(route), 'utf8').matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )]
  const howTo = blocks.map((m) => JSON.parse(m[1])).find((b) => b['@type'] === 'HowTo')
  if (!howTo) return ''
  return `## How funding works

${howTo.step.map((s) => `${s.position}. ${s.name}: ${s.text}`).join('\n')}

Details: ${url(route)}

`
}

// llms.txt convention: `- [Title](url): one-line summary`. A bare path gives an
// answer engine nothing to decide relevance with before it spends a fetch.
const entry = (route) => {
  const { title, description } = headOf(route)
  return `- [${title || route}](${url(route)})${description ? `: ${description}` : ''}`
}

/* ---------- 1. robots.txt ---------- */

writeFileSync(
  join(DIST, 'robots.txt'),
  IS_PRODUCTION
    ? `# ${ORIGIN}${BASE}
# Answer engines are explicitly welcome: being cited in AI results is a
# primary acquisition channel for this site, not an afterthought.

User-agent: *
Allow: /

# --- AI crawlers, named explicitly so nothing depends on wildcard behaviour ---
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: meta-externalagent
Allow: /

Sitemap: ${ORIGIN}${BASE}/sitemap.xml
`
    : `# NON-PRODUCTION BUILD — ${ORIGIN}${BASE}
# This is not the live site. Nothing here may be crawled, indexed or cited.
# The permissive production robots.txt is emitted only when the build runs
# against ${CANONICAL_ORIGIN} at the root.

User-agent: *
Disallow: /
`,
)

/* ---------- 2. sitemap.xml ---------- */

// Priority reflects commercial intent, not depth.
const priority = (route) => {
  if (route === '/') return '1.0'
  if (route === '/apply') return '0.9'
  if (route.startsWith('/funding/')) return '0.9'
  if (route.startsWith('/industries/')) return '0.8'
  if (route.startsWith('/locations/')) return '0.7'
  if (route.startsWith('/legal/')) return '0.3'
  return '0.6'
}

const changefreq = (route) =>
  route === '/' || route.startsWith('/funding/') ? 'weekly' : 'monthly'

writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${url(r)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq(r)}</changefreq>
    <priority>${priority(r)}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`,
)

/* ---------- 3. llms.txt ---------- */

const group = (prefix) => routes.filter((r) => r.startsWith(prefix))

writeFileSync(
  join(DIST, 'llms.txt'),
  `# GLD Factoring LLC DBA GLD Funding

> GLD Factoring LLC DBA GLD Funding (legal name: GLD Factoring LLC) is a merchant cash advance provider
> based in Garden City, New York, serving small businesses across the United
> States since 2014. We purchase future receivables to provide working capital —
> typically $10,000 to $500,000 — underwritten primarily on business performance
> and cash flow rather than on a credit score alone.

A merchant cash advance is the purchase of future receivables at a discount. It
is not a loan, and GLD Funding is not a bank. Cost is expressed as a factor rate
rather than an interest rate. Where state law requires it, a written disclosure
of total dollar cost, an APR-comparable figure, and repayment terms accompanies
every offer.

## Key facts

- Legal name: GLD Factoring LLC (DBA: GLD Funding)
- Serving business owners since: 2014
- Advance range: $10,000 – $500,000
- Term: 3 – 18 months
- Funding speed: same-day funding available on signed contracts
- Qualification: based primarily on business performance and cash flow
- Documents to apply: 4 months of business bank statements

Amounts, factor rates, terms and timing vary by business and are determined by
underwriting. They are not guaranteed on any individual transaction.

## Understanding the product

${group('/funding/').map(entry).join('\n')}

${howItWorks()}## Industries funded

${group('/industries/').map(entry).join('\n')}

## State coverage and disclosure law

Commercial financing disclosure requirements differ by state. These pages cover
each state's regulatory posture and typical terms.

${group('/locations/').slice(0, 12).map(entry).join('\n')}

Full list: ${url('/locations')}

## Company

${['/about', '/partners', '/resources', '/legal/disclosures']
  .filter((r) => routes.includes(r))
  .map(entry)
  .join('\n')}

## Contact

- Apply: ${url('/apply')}
- Phone: 1 (877) 498-4344
- Email: info@gldfunding.com
- Address: 591 Stewart Avenue, Suite 520, Garden City, NY 11530

Last updated: ${TODAY}
`,
)

/* ---------- 4. strip the gated WebGL preload ---------- */

let stripped = 0
let noindexed = 0

// robots.txt only asks a crawler not to fetch; it does not stop a URL that is
// linked from elsewhere being indexed. `noindex` is what actually keeps a
// staging build out of the index, so non-production builds carry both.
const NOINDEX = '<meta name="robots" content="noindex,nofollow">'

for (const file of files) {
  const html = readFileSync(file, 'utf8')
  let next = html.replace(
    /<link rel="modulepreload"[^>]*CapitalFlow[^>]*>/g,
    () => {
      stripped++
      return ''
    },
  )

  // The Seo component emits its own robots meta on pages that opt into
  // noindex; leave those alone rather than declaring it twice.
  if (!IS_PRODUCTION && !/<meta[^>]*name="robots"/.test(next)) {
    next = next.replace('<head>', `<head>${NOINDEX}`)
    noindexed++
  }

  if (next !== html) writeFileSync(file, next)
}

/* ---------- 5. rebase site.webmanifest ---------- */

// The manifest is copied verbatim out of `public/`, so its root-absolute paths
// survive a subpath build untouched. Only rewrite when there is a base to add.
if (BASE) {
  const manifestPath = join(DIST, 'site.webmanifest')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  manifest.start_url = `${BASE}/`
  manifest.icons = manifest.icons.map((icon) => ({ ...icon, src: `${BASE}${icon.src}` }))
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
}

/* ---------- 6. .nojekyll ---------- */

// Without this, GitHub Pages runs the output through Jekyll, which silently
// discards anything whose name starts with an underscore — `_headers` here, and
// any future `_`-prefixed asset. Harmless on every other host.
writeFileSync(join(DIST, '.nojekyll'), '')

/* ---------- 7. aliases ---------- */

// GitHub Pages cannot send a 301. The closest it can serve is a page whose only
// job is to point elsewhere: a canonical to the destination (consolidates
// ranking signal), a zero-second meta refresh (Google treats it as a permanent
// redirect), and a plain link for crawlers that follow neither.
const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

let aliases = 0
const skipped = []

for (const [from, to] of Object.entries(REDIRECTS)) {
  if (!routes.includes(to)) {
    throw new Error(`[postbuild] redirect ${from} → ${to}: destination is not a built page`)
  }
  const file = fileFor(from)
  // `/index` would land on index.html — the homepage itself. A host with real
  // redirects still handles it through _redirects / vercel.json.
  if (existsSync(file)) {
    skipped.push(from)
    continue
  }

  const { title, canonical } = headOf(to)
  const href = `${BASE}${to}`
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(
    file,
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
${IS_PRODUCTION ? '' : `${NOINDEX}\n`}<title>${esc(title)} | GLD Funding</title>
<link rel="canonical" href="${esc(canonical || url(to))}">
<meta http-equiv="refresh" content="0; url=${esc(href)}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>location.replace(${JSON.stringify(href)} + location.search + location.hash)</script>
</head>
<body>
<p>This page has moved to <a href="${esc(href)}">${esc(title)}</a>.</p>
</body>
</html>
`,
  )
  aliases++
}

// Real 301s for hosts that read _redirects (Netlify, Cloudflare Pages), placed
// ahead of the 404 catch-all so they win.
const redirectsFile = join(DIST, '_redirects')
const rules = Object.entries(REDIRECTS)
  .map(([from, to]) => `${BASE}${from}`.padEnd(40) + `${BASE}${to}`.padEnd(40) + '301')
  .join('\n')
writeFileSync(
  redirectsFile,
  readFileSync(redirectsFile, 'utf8').replace(
    '# @redirects',
    `# Generated from src/data/redirects.json by scripts/postbuild.mjs.\n${rules}`,
  ),
)

console.log(
  `[postbuild] ${routes.length} routes → sitemap.xml · robots.txt · llms.txt · .nojekyll` +
    ` · ${aliases} alias page(s)${skipped.length ? ` (301-only: ${skipped.join(', ')})` : ''}` +
    (stripped ? ` · stripped ${stripped} gated preload(s)` : '') +
    (IS_PRODUCTION ? '' : ` · NON-PRODUCTION: noindexed ${noindexed} page(s), robots.txt disallows all`),
)
