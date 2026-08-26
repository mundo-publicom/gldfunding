import { Link } from 'react-router-dom'
import { AnswerBlock, FaqList, PageHero, Prose, Section, SectionHead } from '../../components/ui'
import { HowItWorksTimeline } from '../../sections/HowItWorksTimeline'
import { EligibilityCta } from '../../components/EligibilityCta'
import { Seo, breadcrumbSchema, faqSchema } from '../../lib/seo'
import { CTA } from '../../data/site'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Funding', path: '/funding/merchant-cash-advance' },
  { name: 'How it works', path: '/funding/how-it-works' },
]

/*
 * The 2021 overview video was removed from this page, and its transcript data
 * deleted, rather than re-cut. The narration - and therefore the published
 * transcript and the VideoObject schema built from it - states "no personal
 * guarantees", "three months of statements" and "funds in only 24 hours", none
 * of which the site claims any more, and a transcript has to match the audio.
 * A re-recorded video can drop straight back in: `components/VideoPlayer.tsx`
 * is untouched and carries no claims of its own. The old media still sits in
 * `public/videos/` and should be replaced or removed there too.
 */

const FAQS = [
  {
    q: 'What happens after I submit?',
    a: 'Our underwriting team reviews your business and your bank statements, then a member of the funding team contacts you with the options available, including a written disclosure of the total dollar cost.',
  },
  {
    q: 'When do remittances start?',
    a: 'Typically the business day after funding, on the schedule set out in your agreement. Nothing starts before the funds reach your account.',
  },
  {
    q: 'Do I have to accept the offer?',
    a: 'No. Submitting an application obligates you to nothing. You see the full cost in writing before you sign, and you are free to decline.',
  },
  {
    q: 'How long does the application take?',
    a: 'Most applicants finish in one sitting with their bank statements to hand, or faster by connecting their bank read-only instead of uploading. Your progress saves as you go, so you can stop and come back.',
  },
]

export function Component() {
  return (
    <>
      <Seo
        path="/funding/how-it-works"
        title="How Funding Works, Step by Step"
        description="Apply, review, get funded. Complete a simple application with four months of business bank statements, review the options our underwriting team presents, and receive funds directly into your business account."
        schema={[breadcrumbSchema(TRAIL), faqSchema(FAQS)]}
      />

      <PageHero trail={TRAIL} eyebrow="The process" title="How it works" />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
          <div>
            <AnswerBlock>
              Applying takes one sitting and needs four months of business bank statements. Our
              underwriting team reviews your business and presents the funding options available.
              Once you review and sign, funds are sent directly to your business account - same-day
              funding is available.
            </AnswerBlock>
            <p className="mt-6 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-2">
              Three steps, no branch visit and no business plan. The section below walks through
              each one, and the notes further down cover what underwriting is actually doing while
              you wait.
            </p>
          </div>

          <EligibilityCta />
        </div>
      </Section>

      <HowItWorksTimeline />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Prose>
            <h2>What underwriting is doing while you wait</h2>
            <p>
              Reading your statements. Specifically: total monthly deposits, how consistently they
              arrive, your average daily balance, and whether any existing advances are already
              taking remittances.
            </p>
            <p>
              From that, underwriting works out what remittance the business can carry without
              strain - and the offer is built backwards from that number, not from what you asked
              for.
            </p>

            <h2>What you'll be asked for</h2>
            <p>
              Four months of business bank statements, and nothing else to submit. If your specific
              file needs something further - a driver's licence, a voided check, a processing
              statement - a member of the team requests it after review, through a secure link. You
              are never sent back to the start.
            </p>

            <h2>Reviewing the offer</h2>
            <p>
              Someone from the funding team walks you through the terms: the advance amount, total
              dollar repayment, remittance amount and frequency, and the term. You receive a written
              disclosure of total cost before signing.
            </p>
            <p>
              Take the time you need. Ask what the total repayment is, what gets debited and how
              often, and whether early repayment changes anything. Those three questions cover
              almost everything that matters.
            </p>

            <h2>After funding</h2>
            <p>
              Remittances usually begin the business day after funds arrive, on the agreed schedule.
              If your revenue drops materially, call before a payment is missed.
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
            <h2 className="text-h3 font-semibold text-ink">
              See what your business may qualify for.
            </h2>
            <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-ink-2">
              Answer a few simple questions to get started.
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
