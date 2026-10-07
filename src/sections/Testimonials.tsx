import { useState, type UIEvent } from 'react'
import { QuotesIcon } from '@phosphor-icons/react'
import { Section, SectionHead } from '../components/ui'
import { TESTIMONIALS, type Testimonial } from '../data/site'
import { useRevealGroup } from '../lib/useReveal'

type TestimonialGridProps = {
  items: Testimonial[]
  /** Drop a caption field that the surrounding page already makes obvious. */
  omit?: 'industry' | 'location'
}

/** The approved testimonial cards + disclaimer, shared by every page that shows client quotes. */
export function TestimonialGrid({ items, omit }: TestimonialGridProps) {
  const ref = useRevealGroup()
  const [slide, setSlide] = useState(0)
  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const first = el.firstElementChild as HTMLElement | null
    if (!first) return
    setSlide(Math.min(Math.max(Math.round(el.scrollLeft / (first.offsetWidth + 12)), 0), items.length - 1))
  }

  return (
    <>
      {/* Phones: a swipeable scroll-snap slideshow. sm and up: the original grid. */}
      <div
        ref={ref}
        onScroll={onScroll}
        className="stagger no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-px sm:overflow-visible sm:border sm:border-rule sm:bg-rule sm:px-0 sm:pb-0 lg:grid-cols-3"
      >
        {items.map((t) => (
          <figure
            key={t.business}
            className="flex w-[85%] shrink-0 snap-center flex-col border border-rule bg-white p-6 sm:w-auto sm:border-0 lg:p-7"
          >
            <QuotesIcon size={22} weight="fill" className="text-leaf/35" aria-hidden="true" />
            <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-2">
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 border-t border-rule-soft pt-4">
              <div className="text-[0.9375rem] font-semibold text-ink">{t.business}</div>
              <div className="mt-0.5 text-[0.8125rem] text-ink-3">
                {[t.author, omit !== 'industry' && t.industry, omit !== 'location' && t.location]
                  .filter(Boolean)
                  .join(' · ')}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-5 flex justify-center gap-2 sm:hidden" aria-hidden="true">
        {items.map((t, i) => (
          <span
            key={t.business}
            className={`h-1.5 rounded-full transition-all duration-200 ${i === slide ? 'w-5 bg-leaf-deep' : 'w-1.5 bg-rule'}`}
          />
        ))}
      </div>

      {/*
        Review schema is deliberately NOT emitted yet. FTC endorsement rules
        require genuine, typical reviews with material connections disclosed -
        written consent must be on file before these become machine-readable.
      */}
      <p className="mt-6 text-[0.8125rem] text-ink-3">
        Individual results vary. Testimonials reflect the experience of specific clients and are not
        a guarantee of approval, terms, or outcome.
      </p>
    </>
  )
}

export function Testimonials() {
  return (
    <Section tone="paper">
      <SectionHead
        eyebrow="Client experience"
        title="Business owners who have been through it."
        lead="Real clients, named businesses, in their own words."
      />
      <TestimonialGrid items={TESTIMONIALS} />
    </Section>
  )
}
