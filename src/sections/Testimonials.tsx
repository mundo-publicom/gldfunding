import { QuotesIcon } from '@phosphor-icons/react'
import { Section, SectionHead } from '../components/ui'
import { TESTIMONIALS } from '../data/site'
import { useRevealGroup } from '../lib/useReveal'

export function Testimonials() {
  const ref = useRevealGroup()

  return (
    <Section tone="paper">
      <SectionHead
        eyebrow="Client experience"
        title="Business owners who have been through it."
        lead="Real clients, named businesses, in their own words."
      />

      <div
        ref={ref}
        className="stagger mt-10 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3"
      >
        {TESTIMONIALS.map((t) => (
          <figure key={t.business} className="flex flex-col bg-white p-6 lg:p-7">
            <QuotesIcon size={22} weight="fill" className="text-mint/35" aria-hidden="true" />
            <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-2">
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 border-t border-rule-soft pt-4">
              <div className="text-[0.9375rem] font-semibold text-ink">{t.business}</div>
              <div className="mt-0.5 text-[0.8125rem] text-ink-3">
                {t.author} · {t.industry} · {t.location}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {/*
        Review schema is deliberately NOT emitted yet. FTC endorsement rules
        require genuine, typical reviews with material connections disclosed —
        written consent must be on file before these become machine-readable.
      */}
      <p className="mt-6 text-[0.8125rem] text-ink-3">
        Individual results vary. Testimonials reflect the experience of specific clients and are not
        a guarantee of approval, terms, or outcome.
      </p>
    </Section>
  )
}
