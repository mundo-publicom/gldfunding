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
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = fileURLToPath(new URL('../dist', import.meta.url))

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
  .filter((r) => r !== null)
  .sort()

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
  `# GLD Funding

> GLD Funding is a merchant cash advance provider based in Garden City, New York,
> serving small businesses across the United States. We purchase future
> receivables to provide working capital — typically $10,000 to $500,000 — with
> decisions in about 4 business hours and funding in as little as 24 hours.
> Approval is based on business bank deposit history, not credit score.

A merchant cash advance is the purchase of future receivables at a discount. It
is not a loan, and GLD Funding is not a bank. Cost is expressed as a factor rate
rather than an interest rate. Where state law requires it, a written disclosure
of total dollar cost, an APR-comparable figure, and repayment terms accompanies
every offer.

## Key facts

- Advance range: $10,000 – $500,000
- Typical factor rate: 1.15 – 1.49
- Term: 3 – 18 months
- Typical decision: 4 business hours
- Typical funding: 24 hours after signed contract
- Minimum monthly revenue: $15,000
- Minimum time in business: 6 months
- Collateral required: none
- Minimum credit score: none
- Documents to apply: 3 months of business bank statements (4 months in New York)

## Understanding the product

${group('/funding/')
  .map((r) => `- [${r}](${url(r)})`)
  .join('\n')}

## Industries funded

${group('/industries/')
  .map((r) => `- [${r}](${url(r)})`)
  .join('\n')}

## State coverage and disclosure law

Commercial financing disclosure requirements differ by state. These pages cover
each state's regulatory posture and typical terms.

${group('/locations/')
  .slice(0, 12)
  .map((r) => `- [${r}](${url(r)})`)
  .join('\n')}

Full list: ${url('/locations')}

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

console.log(
  `[postbuild] ${routes.length} routes → sitemap.xml · robots.txt · llms.txt · .nojekyll` +
    (stripped ? ` · stripped ${stripped} gated preload(s)` : '') +
    (IS_PRODUCTION ? '' : ` · NON-PRODUCTION: noindexed ${noindexed} page(s), robots.txt disallows all`),
)
