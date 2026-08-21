import { Link } from 'react-router-dom'
import { AnswerBlock, PageHero, Prose, Section, SectionHead } from '../../components/ui'
import { Seo, breadcrumbSchema } from '../../lib/seo'
import { CTA, PRODUCT, SITE, STATES, currency } from '../../data/site'
import { useRevealGroup } from '../../lib/useReveal'
import { cn } from '../../lib/cn'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Locations', path: '/locations' },
]

const BADGE = {
  'in-force': { label: 'Disclosure law', cls: 'border-leaf text-leaf-deep' },
  enacted: { label: 'Enacted', cls: 'border-warn text-warn' },
  none: { label: '-', cls: 'border-rule text-ink-4' },
}

export function Component() {
  const ref = useRevealGroup()
  const featured = STATES.filter((s) => s.featured)
  const rest = STATES.filter((s) => !s.featured)
  const withLaw = STATES.filter((s) => s.disclosure === 'in-force').length

  return (
    <>
      <Seo
        path="/locations"
        title="Merchant Cash Advances by State"
        description={`GLD Funding provides working capital to small businesses in ${STATES.length} states. Commercial financing disclosure requirements differ by state - see what applies where you operate.`}
        schema={[
          breadcrumbSchema(TRAIL),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: STATES.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: `Merchant cash advance in ${s.name}`,
              url: `${SITE.domain}/locations/${s.slug}`,
            })),
          },
        ]}
      />

      <PageHero
        trail={TRAIL}
        eyebrow="Where we fund"
        title="Funding across the United States"
        lead="Commercial financing rules genuinely differ by state - disclosure obligations, registration, and permitted terms. Find what applies where you operate."
      />

      <Section tone="white">
        <div className="max-w-[68ch]">
          <AnswerBlock>
            GLD Funding provides merchant cash advances to businesses in {STATES.length} states,
            from {currency(PRODUCT.advanceMin)} to {currency(PRODUCT.advanceMax)}. {withLaw} of
            those states require a written commercial financing disclosure before signing; GLD
            provides one on every offer regardless of state.
          </AnswerBlock>
        </div>

        <div className="mt-12">
          <SectionHead
            eyebrow="States with disclosure requirements"
            title="Where the law already requires cost transparency."
            lead="These states mandate a written disclosure of total cost and terms at the point of offer - several including an APR-comparable figure."
          />

          <div ref={ref} className="stagger mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-2">
            {featured.map((s) => (
              <Link
                key={s.slug}
                to={`/locations/${s.slug}`}
                className="group bg-white p-6 transition-colors duration-150 hover:bg-paper"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-h3 font-semibold text-ink">{s.name}</h3>
                  <span
                    className={cn(
                      'shrink-0 rounded-[2px] border px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em]',
                      BADGE[s.disclosure].cls,
                    )}
                  >
                    {BADGE[s.disclosure].label}
                  </span>
                </div>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{s.note}</p>
                <span className="mt-4 inline-block text-[0.875rem] font-medium text-leaf-deep">
                  Funding in {s.name} →
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <SectionHead eyebrow="All states" title="Every state we fund." />
          <ul className="mt-8 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((s) => (
              <li key={s.slug} className="border-b border-rule-soft">
                <Link
                  to={`/locations/${s.slug}`}
                  className="flex items-center justify-between gap-3 py-2.5 text-[0.9375rem] text-ink-2 transition-colors duration-150 hover:text-leaf-deep"
                >
                  {s.name}
                  {s.disclosure !== 'none' && (
                    <span
                      className={cn(
                        'shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.1em]',
                        s.disclosure === 'in-force' ? 'text-leaf-deep' : 'text-warn',
                      )}
                    >
                      {BADGE[s.disclosure].label}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="paper">
        <Prose>
          <h2>Why state matters more here than in most industries</h2>
          <p>
            Since 2022, a growing number of states have brought commercial financing under
            disclosure regimes that look a lot like consumer lending rules. New York, California,
            Utah, Virginia, Connecticut, Georgia and Florida all now require providers to give
            business owners a written summary of what financing actually costs - in several cases
            including an annualized rate comparable to an APR.
          </p>
          <p>
            That has practical consequences for you. In a disclosure state you are entitled to a
            standardized document that makes competing offers directly comparable. In a state
            without one, you have to ask for the equivalent yourself.
          </p>
          <p>
            One operational difference on our side: New York businesses submit four months of bank
            statements rather than three. Everything else about applying is the same wherever you
            are.
          </p>

          <h2>Not sure which rules apply to you?</h2>
          <p>
            It is generally the state where your business operates, not where the funder sits. If
            you trade across state lines, <Link to="/contact">get in touch</Link> and we will tell
            you which disclosure you should expect.
          </p>
        </Prose>

        <p className="mt-8 max-w-[86ch] text-[0.8125rem] leading-relaxed text-ink-3">
          Regulatory information on these pages is general guidance, not legal advice. Commercial
          financing requirements change; confirm current obligations with qualified counsel.
        </p>
      </Section>

      <Section tone="white">
        <div className="flex flex-col items-start gap-6 border-t border-rule pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-ink">Wherever you are, start the same way.</h2>
            <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-ink-2">
              Three questions to see your indicative range.
            </p>
          </div>
          <Link to={CTA.primaryHref} className="btn btn-primary btn-lg shrink-0">
            {CTA.primary}
          </Link>
        </div>
      </Section>
    </>
  )
}

Component.displayName = 'LocationsIndex'
