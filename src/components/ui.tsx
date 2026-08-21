import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CaretRightIcon } from '@phosphor-icons/react'
import { useReveal, useRevealGroup } from '../lib/useReveal'
import { AmbientBackdrop } from './AmbientBackdrop'
import type { AmbientVariant } from './AmbientField'
import { cn } from '../lib/cn'

/* ------------------------------------------------------------------ */

export function Section({
  children,
  className,
  tone = 'white',
  id,
  ambient,
  ambientSeed,
  ambientIntensity,
  ambientSide,
}: {
  children: ReactNode
  className?: string
  tone?: 'white' | 'paper' | 'petrol' | 'deep'
  id?: string
  /** Paints a GPU field behind the section. 'auto' picks a variant from the seed. */
  ambient?: AmbientVariant | 'auto'
  /** Stable string that decides layout and particle placement. Defaults to the id. */
  ambientSeed?: string
  ambientIntensity?: number
  /** Point the field at the section's empty half so it never sits under the copy. */
  ambientSide?: 'left' | 'right' | 'auto'
}) {
  const tones = {
    white: 'bg-white text-ink',
    paper: 'bg-paper text-ink',
    petrol: 'bg-petrol text-paper',
    deep: 'bg-deep text-paper',
  }
  return (
    <section
      id={id}
      className={cn(
        'py-16 lg:py-24',
        tones[tone],
        // `isolate` is what lets the -z-10 backdrop paint above the section's
        // own background. No overflow clipping — sections hold sticky columns.
        ambient && 'relative isolate',
        className,
      )}
    >
      {ambient && (
        <AmbientBackdrop
          variant={ambient}
          tone={tone === 'petrol' || tone === 'deep' ? 'dark' : 'light'}
          seed={ambientSeed ?? id ?? `${tone}-${ambient}`}
          intensity={ambientIntensity}
          side={ambientSide}
        />
      )}
      <div className="page">{children}</div>
    </section>
  )
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = 'left',
  invert,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  invert?: boolean
  className?: string
}) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className={cn(
        'reveal',
        align === 'center' ? 'mx-auto max-w-[52ch] text-center' : 'max-w-[56ch]',
        className,
      )}
    >
      {eyebrow && <p className={cn('eyebrow', invert && 'eyebrow-invert')}>{eyebrow}</p>}
      <h2
        className={cn(
          'text-h2 font-semibold',
          eyebrow && 'mt-3',
          invert ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            'mt-4 text-lead',
            invert ? 'text-paper/80' : 'text-ink-2',
            align === 'center' && 'mx-auto',
          )}
        >
          {lead}
        </p>
      )}
    </div>
  )
}

/**
 * The 40–60 word direct answer, above the marketing copy.
 * This is the block that gets lifted verbatim into an AI response,
 * so it stays first in the DOM and reads as a complete statement.
 */
export function AnswerBlock({ children, invert }: { children: ReactNode; invert?: boolean }) {
  return (
    <div
      className={cn(
        'border-l-[3px] py-1 pl-5',
        invert ? 'border-leaf-glow' : 'border-leaf',
      )}
    >
      <p
        className={cn(
          'text-lead font-medium',
          invert ? 'text-paper/85' : 'text-ink-2',
        )}
      >
        {children}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */

export function Stat({
  value,
  label,
  sub,
  invert,
}: {
  value: string
  label: string
  sub?: string
  invert?: boolean
}) {
  return (
    <div>
      <div
        className={cn(
          'font-mono text-[clamp(1.75rem,3.4vw,2.5rem)] font-medium tabular-nums leading-none tracking-[-0.03em]',
          invert ? 'text-leaf-glow' : 'text-leaf-deep',
        )}
      >
        {value}
      </div>
      <div className={cn('mt-2.5 text-[0.9375rem] font-medium', invert ? 'text-white' : 'text-ink')}>
        {label}
      </div>
      {sub && (
        <div className={cn('mt-1 text-[0.8125rem] leading-snug', invert ? 'text-paper/70' : 'text-ink-3')}>
          {sub}
        </div>
      )}
    </div>
  )
}

export function StatRow({ children, invert }: { children: ReactNode; invert?: boolean }) {
  const ref = useRevealGroup()
  return (
    <div
      ref={ref}
      className={cn(
        'stagger grid gap-8 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4',
        invert ? 'border-white/12' : 'border-rule',
      )}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */

export function FeatureGrid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const ref = useRevealGroup()
  const map = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }
  return (
    <div ref={ref} className={cn('stagger grid gap-px bg-rule', map[cols])}>
      {children}
    </div>
  )
}

export function FeatureCard({
  icon,
  title,
  children,
}: {
  icon?: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <div className="bg-white p-6 lg:p-7">
      {icon && <div className="mb-4 text-leaf-deep">{icon}</div>}
      <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">{title}</h3>
      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-2">{children}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'max-w-[68ch] text-[1.0625rem] leading-[1.7] text-ink-2',
        '[&_h2]:mt-12 [&_h2]:text-h3 [&_h2]:font-semibold [&_h2]:text-ink',
        '[&_h3]:mt-9 [&_h3]:text-[1.0625rem] [&_h3]:font-semibold [&_h3]:text-ink',
        '[&_p]:mt-4 [&_ul]:mt-4 [&_ol]:mt-4',
        '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
        '[&_li]:mt-2 [&_li]:marker:text-leaf',
        '[&_strong]:font-semibold [&_strong]:text-ink',
        '[&_a]:text-leaf-deep [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:decoration-1',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Callout({
  children,
  tone = 'accent',
  title,
}: {
  children: ReactNode
  tone?: 'accent' | 'rate'
  title?: string
}) {
  return (
    <div
      className={cn(
        'my-7 border-l-[3px] p-5',
        tone === 'accent' ? 'border-leaf bg-paper' : 'border-rate bg-rate-bg',
      )}
    >
      {title && <p className="font-semibold text-ink">{title}</p>}
      <div className={cn('text-[0.9375rem] leading-relaxed text-ink-2', title && 'mt-1.5')}>
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-ink-3">
        {trail.map((t, i) => (
          <li key={t.path} className="flex items-center gap-1.5">
            {i > 0 && <CaretRightIcon size={11} className="text-ink-4" />}
            {i === trail.length - 1 ? (
              <span className="text-ink-2">{t.name}</span>
            ) : (
              <Link to={t.path} className="transition-colors hover:text-leaf-deep">
                {t.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function PageHero({
  eyebrow,
  title,
  lead,
  trail,
  children,
  ambient = 'auto',
}: {
  eyebrow?: string
  title: string
  lead?: string
  trail?: { name: string; path: string }[]
  children?: ReactNode
  /** Every inner page gets a field keyed to its title, so no two look alike. Pass `false` to opt out. */
  ambient?: AmbientVariant | 'auto' | false
}) {
  return (
    <div className={cn('border-b border-rule bg-paper', ambient && 'relative isolate')}>
      {ambient && <AmbientBackdrop variant={ambient} tone="light" seed={title} intensity={0.8} />}
      <div className="page relative py-12 lg:py-16">
        {trail && <Breadcrumbs trail={trail} />}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className={cn('text-h1 font-semibold text-ink', eyebrow && 'mt-3')}>{title}</h1>
        {lead && <p className="mt-5 max-w-[62ch] text-lead text-ink-2">{lead}</p>}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const ref = useRevealGroup()
  return (
    <div ref={ref} className="stagger divide-y divide-rule border-y border-rule">
      {items.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[1.0625rem] font-medium text-ink [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="relative mt-2 h-[1px] w-3.5 shrink-0 bg-ink-3 transition-colors group-open:bg-leaf-deep">
              <span className="absolute inset-0 bg-current transition-transform duration-200 group-open:rotate-0 rotate-90" />
            </span>
          </summary>
          <p className="mt-3 max-w-[68ch] text-[0.9375rem] leading-relaxed text-ink-2">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
