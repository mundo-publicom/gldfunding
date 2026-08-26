import { Link } from 'react-router-dom'
import { ArrowRightIcon, BookOpenIcon } from '@phosphor-icons/react'
import { AnswerBlock, PageHero, Section } from '../../components/ui'
import { Seo, breadcrumbSchema } from '../../lib/seo'
import { CTA } from '../../data/site'
import { useRevealGroup } from '../../lib/useReveal'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Resources', path: '/resources' },
]

/** The answer pages, gathered. Guides land here as they're published. */
const GUIDES = [
  {
    to: '/funding/merchant-cash-advance',
    title: 'What is a merchant cash advance?',
    blurb: 'What it is, how it works, how payments are handled, and how to apply.',
    tag: 'Fundamentals',
  },
  {
    to: '/funding/mca-vs-business-loan',
    title: 'MCA vs. business loan',
    blurb: 'A side-by-side comparison of a merchant cash advance and a traditional business loan.',
    tag: 'Comparison',
  },
  {
    to: '/funding/how-it-works',
    title: 'How funding works',
    blurb: 'What happens between submitting an application and money reaching your account.',
    tag: 'Process',
  },
]


export function Component() {
  const ref = useRevealGroup()

  return (
    <>
      <Seo
        path="/resources"
        title="Small Business Funding Resources"
        description="Plain-language guides to merchant cash advances: what they are, how they compare to a traditional business loan, and how funding works step by step."
        schema={[breadcrumbSchema(TRAIL)]}
      />

      <PageHero
        trail={TRAIL}
        eyebrow="Resources"
        title="Understand the product before you take it"
        lead="Straight explanations of how business funding actually works, before you apply."
      />

      <Section tone="white">
        <div className="max-w-[68ch]">
          <AnswerBlock>
            Three short guides explaining merchant cash advances in plain language: what they are,
            how they compare to a traditional business loan, and what happens between applying and
            getting funded.
          </AnswerBlock>
        </div>

        <div ref={ref} className="stagger mt-10 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <Link
              key={g.to}
              to={g.to}
              className="group flex flex-col bg-white p-6 transition-colors duration-150 hover:bg-paper"
            >
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-leaf-deep">
                {g.tag}
              </span>
              <h2 className="mt-3 text-[1.0625rem] font-semibold leading-snug text-ink">{g.title}</h2>
              <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-ink-2">{g.blurb}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-leaf-deep">
                Read
                <ArrowRightIcon
                  size={13}
                  weight="bold"
                  className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <BookOpenIcon size={26} className="mt-1 shrink-0 text-leaf-deep" />
            <div>
              <h2 className="text-h3 font-semibold text-ink">Still have a question?</h2>
              <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-ink-2">
                Call and ask. We would rather answer it than have you guess.
              </p>
            </div>
          </div>
          <Link to={CTA.primaryHref} className="btn btn-primary btn-lg shrink-0">
            {CTA.primary}
          </Link>
        </div>
      </Section>
    </>
  )
}

Component.displayName = 'ResourcesIndex'
