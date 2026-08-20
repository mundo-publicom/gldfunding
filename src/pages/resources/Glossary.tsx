import { Link } from 'react-router-dom'
import { AnswerBlock, PageHero, Section } from '../../components/ui'
import { Seo, breadcrumbSchema } from '../../lib/seo'
import { GLOSSARY } from '../../data/glossary'
import { CTA, SITE } from '../../data/site'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Resources', path: '/resources' },
  { name: 'Glossary', path: '/resources/glossary' },
]

const slug = (t: string) =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function Component() {
  const letters = Array.from(new Set(GLOSSARY.map((g) => g.term[0].toUpperCase()))).sort()

  return (
    <>
      <Seo
        path="/resources/glossary"
        title="Business Funding Glossary"
        description={`${GLOSSARY.length} merchant cash advance and business funding terms explained in plain language — factor rate, holdback, stacking, reconciliation, UCC filing and more.`}
        schema={[
          breadcrumbSchema(TRAIL),
          {
            '@context': 'https://schema.org',
            '@type': 'DefinedTermSet',
            name: 'Business Funding Glossary',
            url: `${SITE.domain}/resources/glossary`,
            hasDefinedTerm: GLOSSARY.map((g) => ({
              '@type': 'DefinedTerm',
              name: g.term,
              description: g.definition,
              url: `${SITE.domain}/resources/glossary#${slug(g.term)}`,
            })),
          },
        ]}
      />

      <PageHero
        trail={TRAIL}
        eyebrow="Reference"
        title="Business funding glossary"
        lead={`${GLOSSARY.length} terms you'll meet in an advance agreement, explained without the jargon that usually surrounds them.`}
      />

      <Section tone="white">
        <div className="max-w-[68ch]">
          <AnswerBlock>
            This glossary defines the terms used in merchant cash advance agreements and
            underwriting — factor rate, purchased amount, holdback, stacking, reconciliation, UCC
            filing and more. Each definition is written for business owners rather than for
            lawyers.
          </AnswerBlock>
        </div>

        {/* Jump nav — a 41-term list needs one. */}
        <nav aria-label="Jump to letter" className="mt-9 flex flex-wrap gap-1.5 border-y border-rule py-4">
          {letters.map((l) => (
            <a
              key={l}
              href={`#letter-${l}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-rule font-mono text-[0.75rem] text-ink-2 transition-colors duration-150 hover:border-mint hover:text-mint-deep"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="mt-10">
          {letters.map((letter) => (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-28">
              <h2 className="mt-10 border-b border-rule pb-2 font-mono text-[0.875rem] uppercase tracking-[0.18em] text-mint-deep first:mt-0">
                {letter}
              </h2>
              <dl>
                {GLOSSARY.filter((g) => g.term[0].toUpperCase() === letter).map((g) => (
                  <div
                    key={g.term}
                    id={slug(g.term)}
                    className="scroll-mt-28 border-b border-rule-soft py-5"
                  >
                    <dt className="text-[1.0625rem] font-semibold text-ink">
                      {g.term}
                      {g.also && (
                        <span className="ml-2.5 font-mono text-[0.75rem] font-normal uppercase tracking-[0.1em] text-ink-3">
                          also: {g.also.join(', ')}
                        </span>
                      )}
                    </dt>
                    <dd className="mt-2 max-w-[72ch] text-[0.9375rem] leading-relaxed text-ink-2">
                      {g.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-ink">Term you don't see here?</h2>
            <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-ink-2">
              Call and ask before you sign anything — with any funder, not just us.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a href={SITE.phoneHref} className="btn btn-secondary">
              {SITE.phone}
            </a>
            <Link to={CTA.primaryHref} className="btn btn-primary">
              {CTA.primary}
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}

Component.displayName = 'Glossary'
