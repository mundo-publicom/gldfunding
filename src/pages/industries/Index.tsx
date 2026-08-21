import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { AnswerBlock, PageHero, Section } from '../../components/ui'
import { Seo, breadcrumbSchema } from '../../lib/seo'
import { CTA, INDUSTRIES } from '../../data/site'
import { useRevealGroup } from '../../lib/useReveal'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Industries', path: '/industries' },
]

export function Component() {
  const ref = useRevealGroup()

  return (
    <>
      <Seo
        path="/industries"
        title="Small Business Funding by Industry"
        description="Merchant cash advances for restaurants, retail, medical and dental practices, trucking, construction, auto repair, salons and e-commerce. Underwriting that already understands your trade's cash flow."
        schema={[
          breadcrumbSchema(TRAIL),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: INDUSTRIES.map((i, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: i.name,
              url: `https://www.gldfunding.com/industries/${i.slug}`,
            })),
          },
        ]}
      />

      <PageHero
        trail={TRAIL}
        eyebrow="Industries"
        title="Funding built around how your trade actually earns"
        lead="Twenty years funding the same industries means underwriting already knows why a restaurant's deposits dip in February and why a contractor's arrive in lumps."
      />

      <Section tone="white">
        <div className="max-w-[68ch]">
          <AnswerBlock>
            GLD Funding provides merchant cash advances across eight core industries — restaurants,
            retail, medical and dental, trucking, construction, auto repair, salons and e-commerce.
            Advances range from $10,000 to $500,000, underwritten on business deposit history rather
            than credit score.
          </AnswerBlock>
        </div>

        <div ref={ref} className="stagger mt-10 grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {INDUSTRIES.map((ind) => (
            <Link
              key={ind.slug}
              to={`/industries/${ind.slug}`}
              className="group flex flex-col bg-white p-6 transition-colors duration-150 hover:bg-paper lg:p-8"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-h3 font-semibold text-ink">{ind.name}</h2>
                <span className="shrink-0 font-mono text-[0.8125rem] tabular-nums text-leaf-deep">
                  {ind.typicalRange}
                </span>
              </div>
              <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-2">
                {ind.answer}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-leaf-deep">
                Funding for {ind.short.toLowerCase()}
                <ArrowRightIcon
                  size={13}
                  weight="bold"
                  className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-2">
          Not listed? We fund well beyond these eight — professional services, manufacturing,
          wholesale and more. A short restricted list applies to regulated categories.{' '}
          <Link to="/contact" className="text-leaf-deep underline underline-offset-[3px]">
            Ask us about yours
          </Link>
          .
        </p>
      </Section>

      <Section tone="paper">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-ink">See what your business qualifies for.</h2>
            <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-ink-2">
              Three questions, no personal information, no credit pull.
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

Component.displayName = 'IndustriesIndex'
