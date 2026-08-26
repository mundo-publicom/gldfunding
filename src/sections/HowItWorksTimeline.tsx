import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CTA } from '../data/site'
import { Section, SectionHead } from '../components/ui'

const STEPS = [
  {
    n: '01',
    title: 'Apply',
    body: 'Complete a simple application and provide recent business bank statements.',
  },
  {
    n: '02',
    title: 'Review',
    body: 'Our underwriting team reviews your business and presents available funding options.',
  },
  {
    n: '03',
    title: 'Get Funded',
    body: 'Review your terms, sign electronically, and receive funds directly into your business account.',
  },
]


/**
 * Scroll-scrubbed three-step timeline.
 *
 * Pure CSS transforms driven by one scroll listener - no WebGL, no additional
 * JS beyond this component. The rail fills as the reader travels, so the motion
 * is explaining the process rather than decorating it.
 */
export function HowItWorksTimeline() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1)
      setActive(STEPS.length - 1)
      return
    }

    let ticking = false
    const measure = () => {
      ticking = false
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the block's top reaches 78% of the viewport, 1 when its bottom passes 42%.
      const start = vh * 0.78
      const end = vh * 0.42
      const span = rect.height + (start - end)
      const travelled = start - rect.top
      const p = Math.min(Math.max(travelled / span, 0), 1)
      setProgress(p)
      setActive(Math.min(Math.floor(p * STEPS.length + 0.28), STEPS.length - 1))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <Section tone="petrol" ambient="stream" ambientSeed="how-it-works-timeline" ambientIntensity={0.7}>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            invert
            eyebrow="How it works"
            title="Three steps, start to funded."
            lead="Apply, review, get funded. Same-day funding is available once your file is complete."
          />
          <div className="mt-8">
            <Link to={CTA.primaryHref} className="btn btn-primary-invert">
              {CTA.primary}
            </Link>
          </div>
        </div>

        <div ref={wrapRef} className="relative">
          {/* The rail: a track that fills as the reader travels the section. */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/12" aria-hidden="true">
            <div
              className="w-px origin-top bg-leaf-glow"
              style={{
                height: '100%',
                transform: `scaleY(${progress})`,
                transition: 'transform 120ms linear',
              }}
            />
          </div>

          <ol className="flex flex-col gap-12">
            {STEPS.map((step, i) => {
              const on = i <= active
              return (
                <li key={step.n} className="relative pl-12">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border transition-[background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{
                      background: on ? 'var(--color-leaf-glow)' : 'var(--color-petrol)',
                      borderColor: on ? 'var(--color-leaf-glow)' : 'rgba(255,255,255,0.22)',
                      transform: on ? 'scale(1)' : 'scale(0.88)',
                    }}
                  >
                    <span
                      className="font-mono text-[0.6875rem] font-medium tabular-nums transition-colors duration-300"
                      style={{ color: on ? 'var(--color-petrol)' : 'rgba(255,255,255,0.75)' }}
                    >
                      {step.n}
                    </span>
                  </span>

                  <div
                    className="transition-opacity duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{ opacity: on ? 1 : 0.72 }}
                  >
                    <h3 className="text-h3 font-semibold text-white">{step.title}</h3>
                    <p className="mt-3 max-w-[54ch] text-[1.0625rem] leading-relaxed text-paper/80">
                      {step.body}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </Section>
  )
}
