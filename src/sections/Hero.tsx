import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, PhoneIcon } from '@phosphor-icons/react'
import type { FlowHandle } from '../components/CapitalFlow'
import { ATMOSPHERE, tint } from '../lib/atmosphere'
import { claimFieldSlot, gpuFieldAllowed, releaseFieldSlot } from '../lib/gpu'
import { CTA, PRODUCT, SITE, currency } from '../data/site'
import { cn } from '../lib/cn'

/**
 * The hero.
 *
 * LCP element is the headline over a CSS-painted ground - no image request,
 * no shader, nothing to wait on. WebGL initialises after `load`, behind four
 * gates, then cross-fades over the poster in 400ms. If any gate fails the
 * poster simply stays and nobody ever sees a blank hero.
 */
export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const flowRef = useRef<FlowHandle | null>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    let cancelled = false
    let claimed = false

    // The gate chain and the context budget both live in lib/gpu - the hero
    // and the ambient section fields answer to exactly the same policy.
    const boot = async () => {
      if (cancelled || !gpuFieldAllowed()) return
      // The hero takes its slot first; it is the one field that always wins.
      if (!claimFieldSlot()) return
      claimed = true
      try {
        const { createCapitalFlow } = await import('../components/CapitalFlow')
        if (cancelled) return
        const flow = createCapitalFlow(canvas)
        if (!flow) {
          releaseFieldSlot() // context creation failed - poster stays
          claimed = false
          return
        }
        flowRef.current = flow
        setLive(true)
      } catch {
        /* Poster stays. Nothing to report to the user. */
        releaseFieldSlot()
        claimed = false
      }
    }

    // Only after first paint has settled.
    const start = () => window.setTimeout(boot, 120)
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })

    // Pause when scrolled away - no cycles spent on pixels nobody is looking at.
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => flowRef.current?.setPaused(!entry.isIntersecting),
            { threshold: 0.05 },
          )
        : null
    io?.observe(wrap)

    const onVisibility = () =>
      flowRef.current?.setPaused(document.visibilityState === 'hidden')
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      io?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      document.removeEventListener('load', start)
      flowRef.current?.destroy()
      flowRef.current = null
      if (claimed) releaseFieldSlot()
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative isolate overflow-hidden bg-petrol">
      {/* Poster: painted, not fetched. This is what the LCP measurement sees. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            `radial-gradient(58% 76% at 71% 50%, ${tint(ATMOSPHERE.aGlow, 0.2)} 0%, ${tint(ATMOSPHERE.groundLift, 0.34)} 42%, ${tint(ATMOSPHERE.ground, 0)} 78%), radial-gradient(38% 52% at 88% 22%, ${tint(ATMOSPHERE.b, 0.16)} 0%, ${tint(ATMOSPHERE.ground, 0)} 70%)`,
        }}
      />

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full transition-opacity duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ opacity: live ? 1 : 0 }}
      />

      {/* Keeps the copy legible over the brightest part of the field. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-petrol via-petrol/70 to-transparent lg:via-petrol/55"
      />

      {/* min-h uses dvh so iOS Safari's collapsing address bar cannot shift it. */}
      <div className="page relative flex min-h-[min(76dvh,760px)] items-center py-16 lg:min-h-[min(82dvh,820px)] lg:py-24">
        {/* Asymmetric split - the value prop owns the left, the field breathes right. */}
        <div className="max-w-[46rem] lg:max-w-[38rem] xl:max-w-[42rem]">
          <p className="eyebrow eyebrow-invert">
            Working capital · Funded in {PRODUCT.fundingHours} hours
          </p>

          <h1 className="mt-5 text-display font-semibold text-white">
            Funded by
            <br />
            tomorrow.
          </h1>

          <p className="mt-6 max-w-[38ch] text-lead text-paper/80">
            Advances from {currency(PRODUCT.advanceMin)} to {currency(PRODUCT.advanceMax)}. Decisions
            in hours, not weeks. No collateral, no credit-score minimum.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to={CTA.primaryHref} className="btn btn-primary-invert btn-lg group">
              {CTA.primary}
              <ArrowRightIcon
                size={16}
                weight="bold"
                className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
              />
            </Link>
            <a href={SITE.phoneHref} className="btn btn-secondary-invert btn-lg">
              <PhoneIcon size={16} weight="fill" />
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Trust strip sits UNDER the hero copy, never inside it. */}
      <div className="relative border-t border-white/10">
        <div className="page grid grid-cols-2 lg:grid-cols-4">
          {[
            { v: `${PRODUCT.decisionHours} hours`, l: 'Typical decision time' },
            { v: `${PRODUCT.fundingHours} hours`, l: 'Funds in your account' },
            { v: 'No minimum', l: 'Credit score requirement' },
            { v: `${new Date().getFullYear() - SITE.founded}+ years`, l: 'Funding small business' },
          ].map((s, i) => (
            <div
              key={s.l}
              className={cn(
                'border-white/10 py-5 lg:py-6',
                // Column rule on every item except the first in its row.
                i % 2 === 1 && 'border-l pl-5 lg:border-l lg:pl-6',
                i % 2 === 0 && 'pr-5 lg:pr-6',
                i >= 2 && 'border-t lg:border-t-0',
                i > 0 && 'lg:border-l lg:pl-6',
              )}
            >
              <div className="font-mono text-[1.0625rem] font-medium tabular-nums tracking-[-0.02em] text-leaf-glow">
                {s.v}
              </div>
              <div className="mt-1 text-[0.8125rem] leading-snug text-paper/70">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
