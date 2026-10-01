import { INDUSTRIES, STATES } from '../data/site'
import REDIRECTS from '../data/redirects.json'

type Page = { to: string; label: string }

const PAGES: Page[] = [
  { to: '/', label: 'Home' },
  { to: '/funding/merchant-cash-advance', label: 'What is a merchant cash advance?' },
  { to: '/funding/mca-vs-business-loan', label: 'MCA vs. business loan' },
  { to: '/funding/how-it-works', label: 'How it works' },
  { to: '/industries', label: 'Industries we fund' },
  { to: '/locations', label: 'Where we fund' },
  { to: '/resources', label: 'Resources' },
  { to: '/apply', label: 'Check eligibility' },
  { to: '/about', label: 'About GLD Funding' },
  { to: '/partners', label: 'Partners' },
  { to: '/contact', label: 'Contact us' },
  { to: '/legal/privacy', label: 'Privacy policy' },
  { to: '/legal/terms', label: 'Terms of use' },
  { to: '/legal/disclosures', label: 'Disclosures' },
  ...INDUSTRIES.map((i) => ({ to: `/industries/${i.slug}`, label: `Funding for ${i.short.toLowerCase()}` })),
  ...STATES.map((s) => ({ to: `/locations/${s.slug}`, label: `Business funding in ${s.name}` })),
]

const byPath = new Map(PAGES.map((p) => [p.to, p]))
const lastSegment = (path: string) => path.slice(path.lastIndexOf('/') + 1)

function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const next = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = next
    }
  }
  return row[b.length]
}

/**
 * The page a dead URL most plausibly meant: a known alias, the same slug under
 * a different parent (`/restaurants`, `/locations/restaurants`), or a near-miss
 * spelling (`/funding/how-it-work`). Null rather than a weak guess.
 */
export function suggestPage(pathname: string): Page | null {
  const path =
    decodeURIComponent(pathname)
      .toLowerCase()
      .replace(/\.(html?|php|aspx?)$/, '')
      .replace(/[\s_]+/g, '-')
      .replace(/\/+$/, '') || '/'

  const alias = (REDIRECTS as Record<string, string>)[path]
  if (alias) return byPath.get(alias) ?? null
  if (byPath.has(path)) return byPath.get(path)!

  const slug = lastSegment(path)
  if (slug.length < 3) return null

  let best: Page | null = null
  let bestScore = Infinity
  for (const page of PAGES) {
    const target = lastSegment(page.to)
    if (!target) continue
    const score = target === slug ? 0 : distance(slug, target)
    if (score < bestScore) {
      best = page
      bestScore = score
    }
  }
  const tolerance = slug.length >= 8 ? 2 : 1
  return bestScore <= tolerance ? best : null
}
