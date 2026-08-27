import { asset } from '../lib/asset'

/**
 * The hero slideshow frames.
 *
 * ⚠️  PLACEHOLDER PHOTOGRAPHY. Every file in `public/hero/` is a stock
 * stand-in chosen to hold the layout, not GLD's own imagery - see
 * `public/hero/README.md` for the source of each and what has to replace it.
 *
 * Each `name` resolves to `public/hero/{name}-{1600,1100,760}.webp`, all cut
 * to 3:2 so the three entries in a srcset describe the same picture. `label`
 * is the trade the frame stands for and is announced beside the pagination,
 * so the rotation reads as "who we fund" rather than as decoration - the
 * wording matches INDUSTRIES in data/site.ts wherever an industry page exists.
 */
export type HeroSlide = {
  name: string
  label: string
}

export const HERO_SLIDES: HeroSlide[] = [
  { name: 'retail', label: 'Retail & specialty stores' },
  { name: 'restaurant', label: 'Restaurants & food service' },
  { name: 'auto-repair', label: 'Auto repair & service' },
  { name: 'salon', label: 'Salons & spas' },
  { name: 'trades', label: 'Construction & trades' },
  { name: 'storefront', label: 'Independent storefronts' },
]

/** Widths on disk, narrowest first - the order a srcset wants them in. */
const WIDTHS = [760, 1100, 1600] as const

export const slideSrc = (name: string) => asset(`/hero/${name}-1600.webp`)

export const slideSrcSet = (name: string) =>
  WIDTHS.map((w) => `${asset(`/hero/${name}-${w}.webp`)} ${w}w`).join(', ')
