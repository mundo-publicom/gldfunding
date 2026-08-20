import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  ClockIcon,
  FileTextIcon,
  ScalesIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react'
import { Hero } from '../sections/Hero'
import { RateCalculator } from '../components/RateCalculator'
import { Testimonials } from '../sections/Testimonials'
import { HowItWorksTimeline } from '../sections/HowItWorksTimeline'
import {
  AnswerBlock,
  FeatureCard,
  FeatureGrid,
  FaqList,
  Section,
  SectionHead,
} from '../components/ui'
import { Seo, faqSchema, localBusinessSchema, orgSchema, productSchema } from '../lib/seo'
import { INDUSTRIES, PRODUCT, currency } from '../data/site'
import { useRevealGroup } from '../lib/useReveal'

const FAQS = [
  {
    q: 'What is a merchant cash advance?',
    a: `A merchant cash advance is the purchase of a business's future receivables at a discount, not a loan. GLD Funding advances a lump sum — typically between ${currency(PRODUCT.advanceMin)} and ${currency(PRODUCT.advanceMax)} — and recovers it through fixed daily or weekly remittances tied to your revenue.`,
  },
  {
    q: 'How fast can I get funded?',
    a: `Most applications receive a decision within ${PRODUCT.decisionHours} business hours of complete bank statements being received. Once a contract is signed, funds typically arrive in your account within ${PRODUCT.fundingHours} hours, and same-day on contracts signed before 2pm ET.`,
  },
  {
    q: 'Do I need good credit to qualify?',
    a: 'No. GLD Funding does not set a minimum credit score. Underwriting reads your business bank statements to understand real deposit volume and cash-flow patterns, which is why business owners who have been declined by a bank are frequently approved here.',
  },
  {
    q: 'What documents do I need to apply?',
    a: `Your last three months of business bank statements — four months for New York businesses. That is all that is required to submit. Anything else is requested only if your specific file calls for it, after review.`,
  },
  {
    q: 'Is collateral required?',
    a: 'No. A merchant cash advance is unsecured and requires no collateral. There are no personal guarantees of the kind attached to a traditional bank loan, and no lien is placed on business or personal property.',
  },
  {
    q: 'How much does a merchant cash advance cost?',
    a: `Cost is expressed as a factor rate rather than an interest rate, typically between ${PRODUCT.factorRateMin} and ${PRODUCT.factorRateMax}. At a factor rate of 1.25, a ${currency(50_000)} advance is repaid as ${currency(62_500)}. Every offer includes a written disclosure of total dollar cost and terms.`,
  },
]

export function Component() {
  const industriesRef = useRevealGroup()

  return (
    <>
      <Seo
        path="/"
        title="Merchant Cash Advance & Small Business Funding | GLD Funding"
        description={`Working capital from ${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)} for small businesses. Decisions in ${PRODUCT.decisionHours} hours, funding in ${PRODUCT.fundingHours}. No collateral, no minimum credit score.`}
        schema={[
          orgSchema(),
          localBusinessSchema(),
          productSchema({
            name: 'Merchant Cash Advance',
            description:
              'Purchase of future business receivables providing immediate working capital, repaid through fixed daily or weekly remittances.',
            amountMin: PRODUCT.advanceMin,
            amountMax: PRODUCT.advanceMax,
          }),
          faqSchema(FAQS),
        ]}
      />

      <Hero />

      {/* The answer block. First real content in the DOM after the hero. */}
      <Section tone="white" className="!py-14 lg:!py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
          <div>
            <p className="eyebrow">What GLD Funding does</p>
            <h2 className="mt-3 text-h2 font-semibold text-ink">
              Capital that reads your bank statements, not your credit file.
            </h2>
          </div>
          <div>
            <AnswerBlock>
              GLD Funding provides merchant cash advances of {currency(PRODUCT.advanceMin)} to{' '}
              {currency(PRODUCT.advanceMax)} to small businesses across the United States. Approval
              is based on business deposit history rather than credit score, decisions typically
              come within {PRODUCT.decisionHours} business hours, and funds reach your account in as
              little as {PRODUCT.fundingHours} hours.
            </AnswerBlock>
            <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-2">
              Banks have spent two decades tightening lending criteria, and the businesses that keep
              neighbourhoods running have been squeezed out of the process. An advance works
              differently: we buy a portion of your future receivables at a discount, you get the
              capital now, and repayment moves with your revenue instead of against it.
            </p>
            <Link
              to="/funding/merchant-cash-advance"
              className="group mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-mint-deep"
            >
              How a merchant cash advance works
              <ArrowRightIcon
                size={14}
                weight="bold"
                className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHead
          eyebrow="Why business owners choose us"
          title="Four things a bank will not do."
          lead="No collateral, no credit-score floor, no six weeks of waiting, and no filing cabinet of paperwork."
        />
        <div className="mt-10 border border-rule">
          <FeatureGrid cols={4}>
            <FeatureCard icon={<ClockIcon size={24} weight="light" />} title="Decisions in hours">
              Underwriting reviews your file and comes back within {PRODUCT.decisionHours} business
              hours, typically the same day you submit.
            </FeatureCard>
            <FeatureCard icon={<ScalesIcon size={24} weight="light" />} title="Repayment that flexes">
              Remittances track your revenue. A slow week costs less than a busy one, which is the
              whole point in a seasonal trade.
            </FeatureCard>
            <FeatureCard
              icon={<ShieldCheckIcon size={24} weight="light" />}
              title="No credit-score minimum"
            >
              We read banking data to understand how your business actually moves money. Personal
              credit is not the gate.
            </FeatureCard>
            <FeatureCard icon={<FileTextIcon size={24} weight="light" />} title="Statements, not files">
              Three months of business bank statements is all it takes to apply. Four if you're in
              New York.
            </FeatureCard>
          </FeatureGrid>
        </div>
      </Section>

      <HowItWorksTimeline />

      {/* Cost transparency, up front — the content that earns AI citations. */}
      <Section tone="paper" id="calculator">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
          <SectionHead
            eyebrow="No surprises"
            title="See the cost before you talk to anybody."
            lead="Most funders make you apply to find out what you'll pay. Model it here first — total repayment, cost of capital, and what leaves your account each week."
          />
          <RateCalculator />
        </div>
      </Section>

      <Section tone="white">
        <SectionHead
          eyebrow="Industries we fund"
          title="We know your trade's cash flow."
          lead="Twenty years of funding the same industries means underwriting already understands why your deposits look the way they do."
        />
        <div ref={industriesRef} className="stagger mt-10 grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((ind) => (
            <Link
              key={ind.slug}
              to={`/industries/${ind.slug}`}
              className="group bg-white p-6 transition-colors duration-150 hover:bg-paper"
            >
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">
                {ind.short}
              </h3>
              <p className="mt-2 font-mono text-[0.8125rem] tabular-nums text-mint-deep">
                {ind.typicalRange}
              </p>
              <p className="mt-3 line-clamp-3 text-[0.875rem] leading-relaxed text-ink-3">
                {ind.useCases.slice(0, 2).join(' · ')}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-mint-deep">
                Funding for {ind.short.toLowerCase()}
                <ArrowRightIcon
                  size={12}
                  weight="bold"
                  className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Testimonials />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHead eyebrow="Common questions" title="Straight answers." />
          <div>
            <FaqList items={FAQS} />
            <Link
              to="/resources/glossary"
              className="group mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-mint-deep"
            >
              Browse the full funding glossary
              <ArrowRightIcon
                size={14}
                weight="bold"
                className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}

Component.displayName = 'Home'
