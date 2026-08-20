import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = fileURLToPath(new URL('../dist', import.meta.url))

/**
 * Every route the build actually emitted, read off disk rather than hand-listed.
 * A hand-written list silently stops covering new pages; this cannot.
 */
export function builtRoutes(): string[] {
  const out: string[] = []

  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        walk(full)
      } else if (entry.endsWith('.html')) {
        const rel = relative(DIST, full).replace(/\\/g, '/')
        if (rel === '404.html') continue
        out.push(rel === 'index.html' ? '/' : `/${rel.replace(/\.html$/, '')}`)
      }
    }
  }

  walk(DIST)
  return out.sort()
}

/** A representative slice — full sweeps run over `builtRoutes()`. */
export const KEY_ROUTES = [
  '/',
  '/funding/merchant-cash-advance',
  '/funding/cost',
  '/funding/qualify',
  '/funding/mca-vs-business-loan',
  '/funding/how-it-works',
  '/industries',
  '/industries/restaurants',
  '/locations',
  '/locations/new-york',
  '/locations/texas',
  '/resources',
  '/resources/glossary',
  '/apply',
  '/about',
  '/partners',
  '/contact',
  '/legal/privacy',
]
