import { useEffect, useMemo, useRef, useState } from 'react'
import { ATMOSPHERE, tint } from '../lib/atmosphere'
import type { AmbientHandle, AmbientVariant } from './AmbientField'
import {
  claimFieldSlot,
  gpuFieldAllowed,
  hashSeed,
  releaseFieldSlot,
  waitForFieldSlot,
} from '../lib/gpu'

/**
 * Ambient section backdrop.
 *
 * The same contract the hero makes: a painted poster ships in the HTML, the
 * WebGL field arrives later behind the gate chain and cross-fades in, and if
 * any gate fails the poster is simply what the section has. Nothing here is
 * ever the LCP element and nothing here is ever load-bearing.
 *
 * Unlike the hero it does not boot on load - it boots when the section is
 * within a screen of the viewport, and pauses the moment it leaves.
 */

const VARIANTS: AmbientVariant[] = ['drift', 'orbit', 'stream', 'converge']

/**
 * Static ground, per tone and variant. Deliberately faint: on light sections
 * this sits under body copy, so it hints at the field's composition rather
 * than competing with it.
 */
function poster(tone: 'light' | 'dark', variant: AmbientVariant, anchor: 'left' | 'right'): string {
  const x = (v: number) => (anchor === 'left' ? 100 - v : v)
  if (tone === 'dark') {
    switch (variant) {
      case 'orbit':
        return `radial-gradient(36% 72% at ${x(74)}% 48%, ${tint(ATMOSPHERE.aGlow, 0.17)} 0%, ${tint(ATMOSPHERE.ground, 0)} 70%), radial-gradient(46% 60% at ${x(14)}% 84%, ${tint(ATMOSPHERE.b, 0.13)} 0%, ${tint(ATMOSPHERE.ground, 0)} 72%)`
      case 'stream':
        return `linear-gradient(180deg, ${tint(ATMOSPHERE.ground, 0)} 0%, ${tint(ATMOSPHERE.aGlow, 0.11)} 48%, ${tint(ATMOSPHERE.ground, 0)} 100%), radial-gradient(50% 70% at ${x(82)}% 30%, ${tint(ATMOSPHERE.b, 0.14)} 0%, ${tint(ATMOSPHERE.ground, 0)} 74%)`
      case 'converge':
        return `radial-gradient(34% 68% at ${x(66)}% 50%, ${tint(ATMOSPHERE.aGlow, 0.19)} 0%, ${tint(ATMOSPHERE.ground, 0)} 66%), radial-gradient(52% 62% at ${x(10)}% 18%, ${tint(ATMOSPHERE.b, 0.11)} 0%, ${tint(ATMOSPHERE.ground, 0)} 72%)`
      default:
        return `radial-gradient(48% 80% at ${x(24)}% 10%, ${tint(ATMOSPHERE.aGlow, 0.14)} 0%, ${tint(ATMOSPHERE.ground, 0)} 72%), radial-gradient(42% 62% at ${x(84)}% 94%, ${tint(ATMOSPHERE.b, 0.13)} 0%, ${tint(ATMOSPHERE.ground, 0)} 72%)`
    }
  }
  switch (variant) {
    case 'orbit':
      return `radial-gradient(32% 64% at ${x(78)}% 46%, ${tint(ATMOSPHERE.aMid, 0.10)} 0%, ${tint(ATMOSPHERE.aMid, 0)} 68%), radial-gradient(44% 56% at ${x(10)}% 88%, ${tint(ATMOSPHERE.b, 0.06)} 0%, ${tint(ATMOSPHERE.b, 0)} 72%)`
    case 'stream':
      return `linear-gradient(180deg, ${tint(ATMOSPHERE.aMid, 0)} 0%, ${tint(ATMOSPHERE.aMid, 0.055)} 50%, ${tint(ATMOSPHERE.aMid, 0)} 100%), radial-gradient(48% 64% at ${x(86)}% 26%, ${tint(ATMOSPHERE.b, 0.06)} 0%, ${tint(ATMOSPHERE.b, 0)} 74%)`
    case 'converge':
      return `radial-gradient(34% 70% at ${x(70)}% 50%, ${tint(ATMOSPHERE.aMid, 0.11)} 0%, ${tint(ATMOSPHERE.aMid, 0)} 66%), radial-gradient(50% 60% at ${x(8)}% 14%, ${tint(ATMOSPHERE.b, 0.05)} 0%, ${tint(ATMOSPHERE.b, 0)} 72%)`
    default:
      return `radial-gradient(46% 78% at ${x(20)}% 8%, ${tint(ATMOSPHERE.aMid, 0.085)} 0%, ${tint(ATMOSPHERE.aMid, 0)} 70%), radial-gradient(40% 58% at ${x(84)}% 96%, ${tint(ATMOSPHERE.b, 0.06)} 0%, ${tint(ATMOSPHERE.b, 0)} 72%)`
  }
}

export function AmbientBackdrop({
  variant = 'auto',
  tone = 'light',
  seed = '',
  intensity = 1,
  side = 'auto',
}: {
  /** 'auto' derives a variant from the seed, so every section differs but never changes between visits. */
  variant?: AmbientVariant | 'auto'
  tone?: 'light' | 'dark'
  /** Any stable string - a section id, a page title. Drives variant, layout and particle placement. */
  seed?: string
  /** 0–1 multiplier on the field's opacity, for sections that need it quieter still. */
  intensity?: number
  /** Which half the field hangs in. Set it to the section's empty half; 'auto' takes the seed's word. */
  side?: 'left' | 'right' | 'auto'
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fieldRef = useRef<AmbientHandle | null>(null)
  const [live, setLive] = useState(false)

  const { resolved, seedNum, anchor } = useMemo(() => {
    const h = hashSeed(seed || 'ambient')
    return {
      resolved: variant === 'auto' ? VARIANTS[h % VARIANTS.length] : variant,
      seedNum: h,
      anchor: (side === 'auto' ? ((h >> 8) % 2 === 1 ? 'left' : 'right') : side) as 'left' | 'right',
    }
  }, [variant, seed, side])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    let cancelled = false
    let claimed = false
    let ready = document.readyState === 'complete'
    let nearby = false
    let unwait: (() => void) | null = null

    const boot = async () => {
      if (cancelled || fieldRef.current || !ready || !nearby) return
      if (!gpuFieldAllowed()) return
      if (!claimed && !claimFieldSlot()) {
        // Budget is full. Take the next slot that frees; until then, poster.
        unwait?.()
        unwait = waitForFieldSlot(() => {
          unwait = null
          void boot()
        })
        return
      }
      claimed = true

      try {
        const { createAmbientField } = await import('./AmbientField')
        if (cancelled) return
        const field = createAmbientField(canvas, {
          variant: resolved,
          tone,
          seed: seedNum,
          anchor,
        })
        if (!field) {
          releaseFieldSlot()
          claimed = false
          return
        }
        fieldRef.current = field
        field.setPaused(document.visibilityState === 'hidden')
        setLive(true)
      } catch {
        /* Poster stays. Nothing to report to the user. */
        releaseFieldSlot()
        claimed = false
      }
    }

    const onLoad = () => {
      ready = true
      void boot()
    }
    if (!ready) window.addEventListener('load', onLoad, { once: true })

    // Boot a screen ahead of arrival so the cross-fade is never the thing you
    // notice; pause the moment the section leaves.
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              nearby = entry.isIntersecting
              fieldRef.current?.setPaused(!nearby)
              if (nearby) void boot()
            },
            { rootMargin: '35% 0px', threshold: 0 },
          )
        : null

    if (io) io.observe(wrap)
    else {
      nearby = true
      void boot()
    }

    const onVisibility = () =>
      fieldRef.current?.setPaused(document.visibilityState === 'hidden' || !nearby)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      unwait?.()
      io?.disconnect()
      window.removeEventListener('load', onLoad)
      document.removeEventListener('visibilitychange', onVisibility)
      fieldRef.current?.destroy()
      fieldRef.current = null
      if (claimed) releaseFieldSlot()
    }
  }, [resolved, tone, seedNum, anchor])

  const peak = (tone === 'dark' ? 0.85 : 0.6) * intensity

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0" style={{ background: poster(tone, resolved, anchor) }} />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-[700ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ opacity: live ? peak : 0 }}
      />
    </div>
  )
}
