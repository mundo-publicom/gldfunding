/**
 * Shared GPU-backdrop policy.
 *
 * Every animated field on the site — the hero's capital flow and the ambient
 * section fields — goes through the same gate chain and the same slot budget.
 * Written once here so the answer to "may I paint pixels?" cannot drift
 * between components.
 */

/**
 * The gate chain. Every one of these must pass before a WebGL context is
 * created anywhere on the page. A failure is not an error: the caller keeps
 * its painted poster and nobody sees a blank surface.
 */
export function gpuFieldAllowed(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  // Never on mobile: applicants on phones need speed, not atmosphere.
  if (window.innerWidth < 768) return false
  if ((navigator.hardwareConcurrency ?? 4) < 4) return false

  // Respect Save-Data and slow connections.
  const conn = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection
  if (conn?.saveData) return false
  if (conn?.effectiveType && /2g/.test(conn.effectiveType)) return false

  // Confirm the device can actually give us a context.
  try {
    const probe = document.createElement('canvas')
    if (!probe.getContext('webgl2') && !probe.getContext('webgl')) return false
  } catch {
    return false
  }
  return true
}

/**
 * Browsers cap live WebGL contexts (~16) and silently kill the oldest when you
 * pass it. A page with a hero plus several ambient sections is nowhere near
 * that, but the budget keeps a future page with a dozen fields honest: past
 * the cap, later fields simply stay posters until a slot frees.
 */
const MAX_LIVE_FIELDS = 8
let liveFields = 0
const waiting: (() => void)[] = []

export function claimFieldSlot(): boolean {
  if (liveFields >= MAX_LIVE_FIELDS) return false
  liveFields += 1
  return true
}

export function releaseFieldSlot(): void {
  liveFields = Math.max(0, liveFields - 1)
  waiting.shift()?.()
}

/** Queue a callback for the next freed slot. Returns an unsubscribe. */
export function waitForFieldSlot(cb: () => void): () => void {
  waiting.push(cb)
  return () => {
    const i = waiting.indexOf(cb)
    if (i >= 0) waiting.splice(i, 1)
  }
}

/** Stable 32-bit hash of a string — turns a section id into a repeatable seed. */
export function hashSeed(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Small, fast, seedable PRNG. Deterministic output keeps renders repeatable. */
export function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
