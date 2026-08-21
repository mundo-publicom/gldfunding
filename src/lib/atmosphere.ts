/**
 * The two hues the ambient layers paint with.
 *
 * These mirror the accent and ground tokens in `styles/index.css`, and they are
 * duplicated here on purpose: the WebGL field needs literal colour strings at
 * context-creation time, and reading them back out of `getComputedStyle` on the
 * init path costs a layout flush for a value that is a compile-time constant.
 *
 * The pairing is the logo's: A is the arrow's lime, B is the chart bars' blue.
 * Change these and the CSS tokens together - nothing else reads them.
 */
export const ATMOSPHERE = {
  /** Accent hue. `deep` is the light-ground weight, `glow` the dark-ground one. */
  aDeep: '#4c7a12',
  aMid: '#688f25',
  aGlow: '#a8d456',
  /** Support hue - the mark's blue, used at roughly half the accent's weight. */
  b: '#12a8e0',
  bDeep: '#12718f',
  /** The ground both gradients fade into. */
  ground: '#04181f',
  groundLift: '#0d4457',
} as const

/** `rgba()` string for a token above, for gradient stops. */
export function tint(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`
}
