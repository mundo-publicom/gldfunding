import { AnswerBlock, PageHero, Section } from '../../components/ui'
import { HowItWorksTimeline } from '../../sections/HowItWorksTimeline'
import { STEPS } from '../../sections/howItWorksSteps'
import { EligibilityCta } from '../../components/EligibilityCta'
import { Seo, breadcrumbSchema, faqSchema, howToSchema } from '../../lib/seo'

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

const TITLE = 'How Funding Works, Step by Step'
const DESCRIPTION =
  'Apply, review, get funded. Complete a simple application with four months of business bank statements, review the options our underwriting team presents, and receive funds directly into your business account.'

export function Component() {
  return (
    <>
      <Seo
        path="/funding/how-it-works"
        title={TITLE}
        description={DESCRIPTION}
        schema={[
          breadcrumbSchema(TRAIL),
          howToSchema({ name: TITLE, description: DESCRIPTION, path: '/funding/how-it-works', steps: STEPS }),
          faqSchema(FAQS),
        ]}
      />

      <PageHero trail={TRAIL} eyebrow="The process" title="How it works" />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
          <div>
            <AnswerBlock>
              The process has three simple steps. Below, we walk through each step and explain what happens during the review process.
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

      <HowItWorksTimeline video />

    </>
  )
}

Component.displayName = 'HowItWorks'
