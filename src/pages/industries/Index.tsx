import { Link } from 'react-router-dom'
import { AnswerBlock, PageHero, Section } from '../../components/ui'
import { Seo, breadcrumbSchema } from '../../lib/seo'
import { INDUSTRIES } from '../../data/site'
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
        lead="Years of funding the same industries means underwriting already knows why a restaurant's deposits dip in February and why a contractor's arrive in lumps."
      />

      <Section tone="white">
        <div className="max-w-[68ch]">
          <AnswerBlock>
            GLD Funding provides merchant cash advances across eight core industries, restaurants, retail, medical and dental, trucking, construction, auto repair, salons and e-commerce. Funding amounts range from $10,000 to $500,000 and are subject to underwriting and approval.
          </AnswerBlock>
        </div>

        <div ref={ref} className="stagger mt-10 grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {INDUSTRIES.map((ind) => (
            <div key={ind.slug} className="flex flex-col bg-white p-6 lg:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-h3 font-semibold text-ink">{ind.name}</h2>
                <span className="shrink-0 font-mono text-[0.8125rem] tabular-nums text-leaf-deep">
                  {ind.typicalRange}
                </span>
              </div>
              <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-2">
                {ind.answer}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-2">
          Not listed? We fund well beyond these eight, professional services, manufacturing,
          wholesale and more. A short restricted list applies to regulated categories.{' '}
          <Link to="/contact" className="text-leaf-deep underline underline-offset-[3px]">
            Ask us about yours
          </Link>
          .
        </p>
      </Section>
    </>
  )
}

Component.displayName = 'IndustriesIndex'
