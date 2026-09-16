import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  ClockIcon,
  FileTextIcon,
  HeadsetIcon,
  SlidersHorizontalIcon,
} from '@phosphor-icons/react'
import { Hero } from '../sections/Hero'
import { EligibilityCta } from '../components/EligibilityCta'
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
    a: `A merchant cash advance is the purchase of a business's future receivables at a discount, not a loan. GLD Factoring LLC DBA GLD Funding advances a lump sum - typically between ${currency(PRODUCT.advanceMin)} and ${currency(PRODUCT.advanceMax)} - and recovers it through fixed daily or weekly remittances.`,
  },
  {
    q: 'How fast can I get funded?',
    a: 'Same-day funding is available. Once we have a complete file, underwriting moves quickly, and funds can reach your business account the same day a contract is signed. Actual timing depends on underwriting and your bank.',
  },
  {
    q: 'Do I need good credit to qualify?',
    a: 'We look beyond just a credit score. Underwriting reads business performance and cash flow to understand how the business actually moves money. A prior bank decline does not determine the outcome here.',
  },
  {
    q: 'What documents do I need to apply?',
    a: 'Four months of business bank statements, plus basic business and owner details. Anything else is requested only if your specific file calls for it, after review.',
  },
  {
    q: 'How much does a merchant cash advance cost?',
    a: `Cost is expressed as a factor rate rather than an interest rate. At a factor rate of 1.25, a ${currency(50_000)} advance has a Total Purchased Amount of ${currency(62_500)}. Every offer includes a written disclosure of total dollar cost and terms.`,
  },
  {
    q: 'How do I apply?',
    a: 'Complete the online application and provide four months of business bank statements. Our underwriting team reviews your business and presents the funding options available to you before you commit to anything.',
  },
]


export function Component() {
  const industriesRef = useRevealGroup()

  return (
    <>
      <Seo
        path="/"
        title="Merchant Cash Advance & Small Business Funding | GLD Factoring LLC DBA GLD Funding"
        description={`Working capital from ${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)} for small businesses, based on business performance and cash flow. Fast decisions, same-day funding, and a simple application.`}
        schema={[
          orgSchema(),
          localBusinessSchema(),
          productSchema({
            name: 'Merchant Cash Advance',
            description:
              'Purchase of future business receivables providing immediate working capital, with daily or weekly remittances.',
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
            <p className="eyebrow">What GLD Factoring LLC DBA GLD Funding does</p>
            <h2 className="mt-3 text-h2 font-semibold text-ink">
              Capital that reads your bank statements, not your credit file.
            </h2>
          </div>
          <div>
            <AnswerBlock>
              GLD Factoring LLC DBA GLD Funding provides working capital to businesses based primarily on business
              performance and cash flow. Our streamlined process means less paperwork, faster
              decisions, and funding structured around your business.
            </AnswerBlock>
            <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-2">
              Advances run from {currency(PRODUCT.advanceMin)} to {currency(PRODUCT.advanceMax)}.
              We purchase a portion of your future receivables at a discount, so you get the capital
              now, with daily or weekly remittances set out before you sign.
            </p>
            <Link
              to="/funding/merchant-cash-advance"
              className="group mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-leaf-deep"
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

      <Section tone="paper" ambient="orbit" ambientSeed="why-businesses-choose-gld">
        <SectionHead
          eyebrow="Why business owners choose us"
          title="Why Businesses Choose GLD"
        />
        <div className="mt-10 border border-rule">
          <FeatureGrid cols={4}>
            <FeatureCard icon={<ClockIcon size={24} weight="light" />} title="Fast decisions">
              Get a decision quickly once we have a complete file.
            </FeatureCard>
            <FeatureCard
              icon={<SlidersHorizontalIcon size={24} weight="light" />}
              title="Flexible qualifications"
            >
              We look beyond just a credit score.
            </FeatureCard>
            <FeatureCard icon={<FileTextIcon size={24} weight="light" />} title="Simple application">
              A streamlined process with minimal paperwork.
            </FeatureCard>
            <FeatureCard icon={<HeadsetIcon size={24} weight="light" />} title="Real support">
              Work with an experienced funding team from application through funding.
            </FeatureCard>
          </FeatureGrid>
        </div>
      </Section>

      <HowItWorksTimeline />

      {/* Lead capture. The calculator that used to sit here implied a price
          before underwriting had seen a file; this asks the qualifying
          question instead and hands the answer to the application. */}
      <Section tone="paper" id="eligibility" ambient="converge" ambientSide="left">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
          <SectionHead
            eyebrow="Get started"
            title="See what your business may qualify for."
            lead="Tell us roughly how much you are looking for and we'll take it from there. No credit inquiry during the eligibility check. No obligation."
          />
          <EligibilityCta />
        </div>
      </Section>

      <Section tone="white" ambient="drift" ambientSeed="industries-we-fund" ambientIntensity={0.75}>
        <SectionHead
          eyebrow="Industries we fund"
          title="We know your trade's cash flow."
          lead="We have funded these trades for years, so underwriting already understands why your deposits look the way they do."
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
              <p className="mt-2 font-mono text-[0.8125rem] tabular-nums text-leaf-deep">
                {ind.typicalRange}
              </p>
              <p className="mt-3 line-clamp-3 text-[0.875rem] leading-relaxed text-ink-3">
                {ind.useCases.slice(0, 2).join(' · ')}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-leaf-deep">
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
              to="/resources"
              className="group mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-leaf-deep"
            >
              Read our funding guides
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
