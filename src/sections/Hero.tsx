import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  ArrowsLeftRightIcon,
  ClockIcon,
  FileTextIcon,
  LightningIcon,
  LockSimpleIcon,
  PauseIcon,
  PhoneIcon,
  PlayIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react'
import { ATMOSPHERE, tint } from '../lib/atmosphere'
import { CTA, PRODUCT, SITE, currency } from '../data/site'
import { cn } from '../lib/cn'
import { HERO_SLIDES, slideSrc, slideSrcSet } from './heroSlides'

/**
 * The hero.
 *
 * A cross-fading slideshow of the trades GLD funds, over a painted petrol
 * ground. The ground is CSS, not an image, so the headline still has
 * something to sit on before the first frame decodes - if every image fails
 * the hero is simply a dark panel and nobody ever sees a blank.
 *
 * Only the first frame is in the initial payload. Each later frame mounts one
 * dwell ahead of its turn, so the other five never compete with LCP.
 */

/** How long a frame holds. Also the length of the progress ring. */
const DWELL_MS = 6500
/** Cross-fade length. Comfortably shorter than the dwell. */
const FADE_MS = 900
/** Distance between dot centres, and the size of the ring that rides them.
    The ring is placed off these two numbers rather than eyeballed, so it
    stays centred on dot six as exactly as it is on dot one. */
const DOT_PITCH = 28
const RING_SIZE = 26

const FEATURES = [
  { Icon: ClockIcon, title: 'Fast decisions', body: 'Get a decision in hours, not weeks.' },
  {
    Icon: ArrowsLeftRightIcon,
    title: 'Flexible funding',
    body: 'Options built around your business.',
  },
  {
    Icon: FileTextIcon,
    title: 'Simple process',
    body: 'Quick application with minimal paperwork.',
  },
  { Icon: ShieldCheckIcon, title: 'Trusted partner', body: 'Experienced team here to support you.' },
]

export function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  /** Explicit user stop, via the pause control. Survives everything else. */
  const [stopped, setStopped] = useState(false)
  /** Scrolled away, tab hidden, or the pointer/keyboard is inside the hero. */
  const [held, setHeld] = useState(false)
  const [reduced, setReduced] = useState(false)
  /** Which frames have been mounted. Index 0 ships; the rest arrive in turn. */
  const [mounted, setMounted] = useState<number[]>([0])

  const running = !stopped && !held && !reduced

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  /* Pause when the hero is off screen or the tab is in the background - no
     decoding, no compositing, no timer for pixels nobody is looking at. */
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    let offscreen = false
    let backgrounded = document.visibilityState === 'hidden'
    const apply = () => setHeld(offscreen || backgrounded)

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              offscreen = !entry.isIntersecting
              apply()
            },
            { threshold: 0.15 },
          )
        : null
    io?.observe(wrap)

    const onVisibility = () => {
      backgrounded = document.visibilityState === 'hidden'
      apply()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      io?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  /* Show a frame, and mount the one after it so it is decoded by the time it
     is needed. Mounting happens here rather than in an effect on `index` so
     that nothing schedules a second render just to catch up. */
  const show = useCallback((i: number) => {
    setIndex(i)
    setMounted((m) => {
      const wanted = [i, (i + 1) % HERO_SLIDES.length].filter((n) => !m.includes(n))
      return wanted.length ? [...m, ...wanted] : m
    })
  }, [])

  /* Frame two waits for `load`: it is the only fetch that could contend with
     the LCP frame, and it has a full dwell before anyone needs it. */
  useEffect(() => {
    const prefetch = () => setMounted((m) => (m.includes(1) ? m : [...m, 1]))
    if (document.readyState === 'complete') {
      const id = window.setTimeout(prefetch, 0)
      return () => window.clearTimeout(id)
    }
    window.addEventListener('load', prefetch, { once: true })
    return () => window.removeEventListener('load', prefetch)
  }, [])

  /* Advance. Keyed on `index` as well as `running`, so picking a frame by
     hand gives it a full dwell rather than whatever was left of the last. */
  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(() => show((index + 1) % HERO_SLIDES.length), DWELL_MS)
    return () => window.clearTimeout(id)
  }, [running, index, show])

  const active = HERO_SLIDES[index]

  return (
    <div
      ref={wrapRef}
      className="relative isolate overflow-hidden bg-petrol"
      style={
        {
          '--hero-dwell': `${DWELL_MS}ms`,
          '--hero-fade': `${FADE_MS}ms`,
        } as React.CSSProperties
      }
      /* Hovering or tabbing into the hero holds the rotation, so copy and
         controls never move under a reader who has just arrived at them. */
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      {/* Painted, not fetched. This is what is on screen before frame one. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            `radial-gradient(58% 76% at 71% 50%, ${tint(ATMOSPHERE.aGlow, 0.2)} 0%, ${tint(ATMOSPHERE.groundLift, 0.34)} 42%, ${tint(ATMOSPHERE.ground, 0)} 78%), radial-gradient(38% 52% at 88% 22%, ${tint(ATMOSPHERE.b, 0.16)} 0%, ${tint(ATMOSPHERE.ground, 0)} 70%)`,
        }}
      />

      {/* The frames. Decorative: every word the hero has to say is in the
          copy beside them, so an empty alt is the honest one. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {HERO_SLIDES.map((slide, i) =>
          mounted.includes(i) ? (
            <div key={slide.name} className="hero-frame" data-active={i === index}>
              <img
                src={slideSrc(slide.name)}
                srcSet={slideSrcSet(slide.name)}
                sizes="100vw"
                alt=""
                width={1600}
                height={1067}
                decoding="async"
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'low'}
              />
            </div>
          ) : null,
        )}
      </div>

      {/* Scrim. Two passes: a flat tint that pulls the photograph back into
          the brand's key, then a left-weighted wash that guarantees the copy
          its contrast whatever the frame underneath happens to be doing. On
          one column the copy spans the full width, so the wash stays heavy
          all the way across until there is a second column to fall away to. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-petrol/34" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-petrol/95 via-petrol/78 to-petrol/55 lg:from-petrol lg:via-petrol/68 lg:to-petrol/5"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-petrol/70 via-transparent to-petrol/85"
      />

      {/* min-h uses dvh so iOS Safari's collapsing address bar cannot shift it. */}
      <div className="page relative flex min-h-[min(76dvh,760px)] flex-col py-16 lg:min-h-[min(82dvh,820px)] lg:py-20">
        <div className="my-auto grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center lg:gap-14">
          {/* The value prop owns the left; the frames breathe on the right. */}
          <div className="max-w-[42rem] lg:max-w-[46rem]">
            <p className="eyebrow eyebrow-invert">Working capital for small businesses</p>

            <h1 className="mt-5 text-hero font-semibold text-white">
              Business Funding{' '}
              <span className="lg:block">Built Around Your Business</span>
            </h1>

            <p className="mt-6 text-lead font-medium text-white">
              Fast decisions. Flexible funding. Simple application.
            </p>

            <p className="mt-4 max-w-[52ch] text-paper/80">
              Get the working capital you need to grow, manage cash flow, and seize opportunities.
              Funding available as soon as the same business day.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to={CTA.primaryHref} className="btn btn-primary-invert btn-lg group">
                {CTA.heroPrimary}
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

            <p className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8125rem] text-paper/75">
              <span className="inline-flex items-center gap-2">
                <LockSimpleIcon size={15} weight="fill" className="text-leaf-glow" aria-hidden="true" />
                Secure process
              </span>
              <span aria-hidden="true" className="hidden text-paper/40 sm:inline">
                ·
              </span>
              <span>No impact on credit score to apply</span>
            </p>
          </div>

          {/* The one figure that decides whether an owner reads on. */}
          <div className="max-w-[26rem] rounded-card border border-white/15 bg-white/8 p-6 backdrop-blur-md lg:max-w-none lg:p-7">
            <p className="text-[0.9375rem] text-paper/80">Funding between</p>
            <p className="mt-2 whitespace-nowrap font-mono text-[clamp(1.25rem,2vw,1.625rem)] font-medium tabular-nums tracking-[-0.03em] text-leaf-glow">
              {currency(PRODUCT.advanceMin)} &ndash; {currency(PRODUCT.advanceMax)}
            </p>
            <div className="mt-5 flex gap-3 border-t border-white/15 pt-5">
              <LightningIcon
                size={18}
                weight="fill"
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-leaf-glow"
              />
              <p className="text-[0.875rem] leading-relaxed text-paper/80">
                Decisions in hours. Funding as soon as the same business day.
              </p>
            </div>
          </div>
        </div>

        {/* Pagination. Dots plus one travelling ring that runs down the dwell,
            so the rotation is legible rather than something that just happens.
            The pause control is what makes an auto-advancing hero pass 2.2.2. */}
        <div className="mt-12 flex items-center gap-4">
          <div className="relative flex items-center" style={{ marginLeft: -(DOT_PITCH - 5) / 2 }}>
            {/* The ring rides on top of the dots, one pitch at a time. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 26 26"
              className="pointer-events-none absolute left-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{
                top: (DOT_PITCH - RING_SIZE) / 2,
                height: RING_SIZE,
                width: RING_SIZE,
                transform: `translateX(${index * DOT_PITCH + (DOT_PITCH - RING_SIZE) / 2}px) rotate(-90deg)`,
              }}
            >
              <circle
                cx="13"
                cy="13"
                r="11.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                className="text-white/25"
              />
              {/* Remounting on every change is what restarts the sweep. */}
              <circle
                key={`${index}-${running}`}
                cx="13"
                cy="13"
                r="11.5"
                className="hero-ring"
                style={{ animationPlayState: running ? 'running' : 'paused' }}
              />
            </svg>

            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.name}
                type="button"
                onClick={() => show(i)}
                aria-label={`Show ${slide.label}`}
                aria-current={i === index}
                className="group grid h-7 place-items-center"
                style={{ width: DOT_PITCH }}
              >
                <span
                  className={cn(
                    'h-[5px] w-[5px] rounded-full transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]',
                    i === index
                      ? 'bg-leaf-glow'
                      : 'bg-white/45 group-hover:scale-125 group-hover:bg-white/80',
                  )}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setStopped((s) => !s)}
            aria-label={stopped ? 'Resume the slideshow' : 'Pause the slideshow'}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/20 text-paper/70 transition-colors duration-200 hover:border-white/45 hover:text-white"
          >
            {stopped ? (
              <PlayIcon size={11} weight="fill" />
            ) : (
              <PauseIcon size={11} weight="fill" />
            )}
          </button>

          {/* Names the frame on screen. Polite, so it never interrupts. */}
          <p
            aria-live="polite"
            className="min-w-0 truncate font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-paper/70"
          >
            {active.label}
          </p>
        </div>
      </div>

      {/* Trust strip sits UNDER the hero copy, never inside it. */}
      <div className="relative border-t border-white/10">
        <div className="page grid grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, body }, i) => (
            <div
              key={title}
              className={cn(
                'flex gap-3 border-white/10 py-5 lg:py-6',
                // Column rule on every item except the first in its row.
                i % 2 === 1 && 'border-l pl-5 lg:border-l lg:pl-6',
                i % 2 === 0 && 'pr-5 lg:pr-6',
                i >= 2 && 'border-t lg:border-t-0',
                i > 0 && 'lg:border-l lg:pl-6',
              )}
            >
              <Icon
                size={20}
                weight="regular"
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-leaf-glow"
              />
              <div className="min-w-0">
                <div className="text-[0.9375rem] font-medium leading-snug text-white">{title}</div>
                <div className="mt-1 text-[0.8125rem] leading-snug text-paper/70">{body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
