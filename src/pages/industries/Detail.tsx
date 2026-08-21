import { Link, useParams } from 'react-router-dom'
import { ArrowRightIcon, CheckIcon, QuotesIcon } from '@phosphor-icons/react'
import {
  AnswerBlock,
  FaqList,
  PageHero,
  Prose,
  Section,
  SectionHead,
} from '../../components/ui'
import { RateCalculator } from '../../components/RateCalculator'
import { Seo, breadcrumbSchema, faqSchema, productSchema } from '../../lib/seo'
import { CTA, INDUSTRIES, PRODUCT, TESTIMONIALS, currency } from '../../data/site'
import { NotFoundBody } from '../NotFound'

export function Component() {
  const { slug } = useParams<{ slug: string }>()
  const ind = INDUSTRIES.find((i) => i.slug === slug)

  if (!ind) return <NotFoundBody />

  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Industries', path: '/industries' },
    { name: ind.short, path: `/industries/${ind.slug}` },
  ]

  // Real proof from this trade, where we have it.
  const proof = TESTIMONIALS.filter((t) => t.industry === ind.short)

  const faqs = [
    {
      q: `How much funding can a ${ind.short.toLowerCase().replace(/s$/, '')} business get?`,
      a: `${ind.name} typically qualify for ${ind.typicalRange} at GLD Funding. The amount is driven by average monthly deposits rather than credit score - most offers land near one month of revenue.`,
    },
    {
      q: `How fast can a ${ind.short.toLowerCase().replace(/s$/, '')} business get funded?`,
      a: `Most applications receive a decision within ${PRODUCT.decisionHours} business hours, with funds arriving within ${PRODUCT.fundingHours} hours of a signed contract - same day on contracts signed before 2pm ET.`,
    },
    {
      q: `What do I need to apply?`,
      a: `${PRODUCT.statementMonths.default} months of business bank statements - four if you are in New York - plus basic business and owner details. Nothing else is required to submit; anything further is requested only if your file needs it.`,
    },
    {
      q: `Do I need good credit?`,
      a: `No. There is no minimum credit score. Underwriting reads your deposit history to understand how the business actually moves money, which is why ${ind.short.toLowerCase()} owners declined by banks are frequently approved here.`,
    },
  ]

  return (
    <>
      <Seo
        path={`/industries/${ind.slug}`}
        title={`${ind.name} Funding & Merchant Cash Advances`}
        description={`Working capital of ${ind.typicalRange} for ${ind.name.toLowerCase()}. Decisions in ${PRODUCT.decisionHours} hours, funding in ${PRODUCT.fundingHours}. No collateral, no minimum credit score.`}
        schema={[
          breadcrumbSchema(trail),
          faqSchema(faqs),
          productSchema({
            name: `Merchant Cash Advance for ${ind.name}`,
            description: ind.answer,
            amountMin: PRODUCT.advanceMin,
            amountMax: PRODUCT.advanceMax,
          }),
        ]}
      />

      <PageHero
        trail={trail}
        eyebrow="Industry funding"
        title={`Funding for ${ind.name.toLowerCase()}`}
        lead={`Typical advances of ${ind.typicalRange}, underwritten on your deposit history rather than your credit file.`}
      >
        <div className="flex flex-wrap gap-3">
          <Link to={CTA.primaryHref} className="btn btn-primary">
            {CTA.primary}
          </Link>
          <Link to="/funding/cost" className="btn btn-secondary">
            See what it costs
          </Link>
        </div>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <AnswerBlock>{ind.answer}</AnswerBlock>

            <div className="mt-10">
              <h2 className="text-h3 font-semibold text-ink">
                What {ind.short.toLowerCase()} clients use it for
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {ind.useCases.map((u) => (
                  <li
                    key={u}
                    className="flex items-start gap-2.5 border-t border-rule pt-3 text-[0.9375rem] leading-relaxed text-ink-2"
                  >
                    <CheckIcon size={15} weight="bold" className="mt-1 shrink-0 text-leaf-deep" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>

            <Prose className="mt-10">
              <h2>Why underwriting understands this trade</h2>
              <p>
                Every industry has a cash-flow shape, and a bank's credit model tends to read that
                shape as risk. {ind.name} are a clear example: revenue that is perfectly healthy
                across a year can look erratic across any given month.
              </p>
              <p>
                We have funded this trade for two decades, so the pattern reads as normal rather
                than as a red flag. That is the practical difference between applying here and
                applying to an institution that has never underwritten your sector.
              </p>

              <h2>What to expect</h2>
              <p>
                Advances for {ind.name.toLowerCase()} typically run {ind.typicalRange}, with terms
                of {PRODUCT.termMinMonths} to {PRODUCT.termMaxMonths} months and remittances
                collected daily or weekly. Offers are usually built around one month of revenue,
                sized so the remittance does not strain the account.
              </p>
              <p>
                Cost is expressed as a factor rate between {PRODUCT.factorRateMin} and{' '}
                {PRODUCT.factorRateMax}. <Link to="/funding/cost">See worked examples</Link>, or
                model your own with the calculator.
              </p>
            </Prose>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <RateCalculator compact />
          </div>
        </div>
      </Section>

      {proof.length > 0 && (
        <Section tone="paper">
          <SectionHead
            eyebrow="From this industry"
            title={`${ind.short} owners we've funded.`}
          />
          <div className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {proof.map((t) => (
              <figure key={t.business} className="flex flex-col bg-white p-6">
                <QuotesIcon size={20} weight="fill" className="text-leaf/35" aria-hidden="true" />
                <blockquote className="mt-3.5 flex-1 text-[0.9375rem] leading-relaxed text-ink-2">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 border-t border-rule-soft pt-3.5">
                  <div className="text-[0.9375rem] font-semibold text-ink">{t.business}</div>
                  <div className="mt-0.5 text-[0.8125rem] text-ink-3">
                    {t.author} · {t.location}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-5 text-[0.8125rem] text-ink-3">
            Individual results vary. Testimonials are not a guarantee of approval or terms.
          </p>
        </Section>
      )}

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHead
            eyebrow="Questions"
            title={`${ind.short} funding, answered.`}
          />
          <FaqList items={faqs} />
        </div>
      </Section>

      <Section tone="paper">
        <SectionHead eyebrow="Other industries" title="We fund these too." />
        <div className="mt-8 flex flex-wrap gap-2.5">
          {INDUSTRIES.filter((i) => i.slug !== ind.slug).map((i) => (
            <Link
              key={i.slug}
              to={`/industries/${i.slug}`}
              className="rounded-full border border-rule bg-white px-4 py-2 text-[0.875rem] text-ink-2 transition-colors duration-150 hover:border-leaf hover:text-leaf-deep"
            >
              {i.short}
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-6 border-t border-rule pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-ink">
              Ready to see your range?
            </h2>
            <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-ink-2">
              Advances from {currency(PRODUCT.advanceMin)}. Three questions to find out.
            </p>
          </div>
          <Link to={CTA.primaryHref} className="btn btn-primary btn-lg group shrink-0">
            {CTA.primary}
            <ArrowRightIcon
              size={16}
              weight="bold"
              className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </Section>
    </>
  )
}

Component.displayName = 'IndustryDetail'
