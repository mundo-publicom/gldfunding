import { Link } from 'react-router-dom'
import { AnswerBlock, FaqList, PageHero, Prose, Section, SectionHead } from '../../components/ui'
import { HowItWorksTimeline } from '../../sections/HowItWorksTimeline'
import { VideoPlayer } from '../../components/VideoPlayer'
import { Seo, breadcrumbSchema, faqSchema } from '../../lib/seo'
import { OVERVIEW_VIDEO, videoSchema } from '../../data/video'
import { CTA, PRODUCT } from '../../data/site'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Funding', path: '/funding/merchant-cash-advance' },
  { name: 'How it works', path: '/funding/how-it-works' },
]

const FAQS = [
  {
    q: 'How long does the application take?',
    a: 'About eight minutes if you have your bank statements to hand, or less if you connect your bank read-only instead of uploading. Your progress saves as you go, so you can stop and come back.',
  },
  {
    q: 'What happens after I submit?',
    a: `Underwriting reviews your deposit history and builds an offer. Most applicants hear back within ${PRODUCT.decisionHours} business hours from a named underwriter who walks through the terms, including a written disclosure of the total dollar cost.`,
  },
  {
    q: 'When do remittances start?',
    a: 'Typically the business day after funding, on the schedule set out in your agreement. Nothing starts before the funds reach your account.',
  },
  {
    q: 'Do I have to accept the offer?',
    a: 'No. Submitting an application obligates you to nothing. You see the full cost in writing before you sign, and you are free to decline or take it elsewhere.',
  },
]

export function Component() {
  return (
    <>
      <Seo
        path="/funding/how-it-works"
        title="How Funding Works, Step by Step"
        description={`Apply in about eight minutes, get a decision in ${PRODUCT.decisionHours} business hours, and receive funds within ${PRODUCT.fundingHours} hours of signing. Three steps, no branch visit, no business plan.`}
        schema={[breadcrumbSchema(TRAIL), faqSchema(FAQS), videoSchema('/funding/how-it-works')]}
      />

      <PageHero trail={TRAIL} eyebrow="The process" title="How it works" />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
          <div>
            <AnswerBlock>
              Applying takes about eight minutes and needs {PRODUCT.statementMonths.default} months
              of business bank statements — four in New York. Underwriting returns a decision within
              about {PRODUCT.decisionHours} business hours, and funds reach your account within{' '}
              {PRODUCT.fundingHours} hours of a signed contract.
            </AnswerBlock>
            <p className="mt-6 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-2">
              Prefer to watch? The overview covers the same ground in under a minute and a half —
              what an advance is, how it differs from a bank loan, and the three steps end to end.
            </p>
          </div>

          <VideoPlayer
            src={OVERVIEW_VIDEO.src}
            poster={OVERVIEW_VIDEO.poster}
            captions={OVERVIEW_VIDEO.captions}
            title={OVERVIEW_VIDEO.title}
            durationLabel={OVERVIEW_VIDEO.durationLabel}
            description={OVERVIEW_VIDEO.description}
            chapters={[...OVERVIEW_VIDEO.chapters]}
            transcript={[...OVERVIEW_VIDEO.transcript]}
          />
        </div>
      </Section>

      <HowItWorksTimeline />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Prose>
            <h2>What underwriting is doing while you wait</h2>
            <p>
              Reading your statements. Specifically: total monthly deposits, how consistently they
              arrive, your average daily balance, how many days the account went negative, and
              whether any existing advances are already taking remittances.
            </p>
            <p>
              From that, underwriting works out what remittance the business can carry without
              strain — and the offer is built backwards from that number, not from what you asked
              for.
            </p>

            <h2>What you'll be asked for</h2>
            <p>
              Bank statements, and nothing else to submit. If your specific file needs something
              further — a driver's licence, a voided check, a processing statement — an underwriter
              requests it after review, through a secure link. You are never sent back to the start.
            </p>

            <h2>Reviewing the offer</h2>
            <p>
              A named underwriter calls to walk through the terms: the advance amount, total dollar
              repayment, remittance amount and frequency, and the term. You receive a written
              disclosure of total cost before signing — in every state, whether or not the law
              requires it.
            </p>
            <p>
              Take the time you need. Ask what the total repayment is, what gets debited and how
              often, and whether early repayment changes anything. Those three questions cover
              almost everything that matters.
            </p>

            <h2>After funding</h2>
            <p>
              Remittances usually begin the business day after funds arrive, on the agreed schedule.
              If your revenue drops materially, call before a payment is missed — reconciliation is
              often possible, but only if we hear from you early.
            </p>
          </Prose>

          <div>
            <SectionHead eyebrow="Questions" title="About the process." />
            <div className="mt-6">
              <FaqList items={FAQS} />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-ink">Start with three questions.</h2>
            <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-ink-2">
              No contact details needed to see your indicative range.
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

Component.displayName = 'HowItWorks'
