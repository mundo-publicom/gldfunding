import { Link } from 'react-router-dom'
import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react'
import {
  AnswerBlock,
  Callout,
  FaqList,
  PageHero,
  Prose,
  Section,
  SectionHead,
} from '../../components/ui'
import { Seo, breadcrumbSchema, faqSchema } from '../../lib/seo'
import { CTA, PRODUCT, currency } from '../../data/site'
import { useRevealGroup } from '../../lib/useReveal'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Funding', path: '/funding/merchant-cash-advance' },
  { name: 'Do I qualify?', path: '/funding/qualify' },
]

const CRITERIA = [
  {
    label: 'Average monthly revenue',
    value: `${currency(PRODUCT.minMonthlyRevenue)}+`,
    note: 'Measured across your recent bank statements, not a projection.',
  },
  {
    label: 'Time in business',
    value: `${PRODUCT.minMonthsInBusiness}+ months`,
    note: 'From the date the business started trading, not the date it was registered.',
  },
  {
    label: 'Business bank account',
    value: 'Required',
    note: 'An account in the business name. Personal accounts cannot be underwritten.',
  },
  {
    label: 'Credit score',
    value: 'No minimum',
    note: 'We read deposit history instead. Past bankruptcies are not automatic declines.',
  },
  {
    label: 'Collateral',
    value: 'None',
    note: 'No lien on business or personal property.',
  },
  {
    label: 'Industry',
    value: 'Most',
    note: 'A short restricted list applies — call us if you are unsure about yours.',
  },
]

const STRENGTHENS = [
  'Consistent deposits week to week rather than in unpredictable lumps',
  'An average daily balance that stays clear of zero',
  'Few or no negative days across the statement period',
  'Three or more years of trading history',
  'Existing positions disclosed up front',
  'Complete statements — every page, as the bank issues them',
]

const WEAKENS = [
  'Frequent overdrafts or returned items',
  'Revenue that arrives in one or two large payments a month',
  'Multiple existing advances already taking daily remittances',
  'A recent sharp decline in deposit volume',
  'Statements with pages missing or screenshots instead of documents',
  'Undisclosed positions found during underwriting',
]

const FAQS = [
  {
    q: 'What credit score do I need for a merchant cash advance?',
    a: 'None. GLD Funding does not set a minimum credit score. Underwriting is based on business bank deposit history — how much comes in, how consistently, and what balance the account holds. Business owners declined by banks on credit grounds are routinely approved here.',
  },
  {
    q: 'Can I qualify with a past bankruptcy?',
    a: 'Often, yes, provided the bankruptcy is discharged and current revenue supports the advance. A discharged bankruptcy is not an automatic decline. An open or undischarged bankruptcy generally is.',
  },
  {
    q: 'I have been in business less than six months. Any options?',
    a: `Six months of trading history is our practical minimum, because underwriting needs enough statements to read a pattern. If you are close, call us — a strong deposit history over four or five months is sometimes workable. Under three months, an advance is not the right product yet.`,
  },
  {
    q: 'Does applying hurt my credit?',
    a: 'No. There is no hard consumer credit pull in the application. We may review business credit information as part of underwriting, which does not affect your personal score.',
  },
  {
    q: 'Which industries cannot be funded?',
    a: 'A short restricted list applies, generally covering regulated categories such as firearms, adult entertainment, cannabis, gambling, and certain financial services. If you are unsure whether yours is affected, call before you apply rather than after.',
  },
  {
    q: 'What if I already have an advance from another funder?',
    a: 'Additional positions are underwritten case by case, based on your revenue, the balance outstanding, and the remittance load you already carry. Disclose every existing position on the application — undisclosed positions discovered during underwriting are the most common cause of a late decline.',
  },
]

export function Component() {
  const strengthRef = useRevealGroup()

  return (
    <>
      <Seo
        path="/funding/qualify"
        title="Do I Qualify for a Merchant Cash Advance?"
        description={`GLD Funding requires ${currency(PRODUCT.minMonthlyRevenue)} average monthly revenue, ${PRODUCT.minMonthsInBusiness} months in business, and a business bank account. No minimum credit score and no collateral.`}
        schema={[breadcrumbSchema(TRAIL), faqSchema(FAQS)]}
      />

      <PageHero
        trail={TRAIL}
        eyebrow="Qualification"
        title="Do I qualify for a merchant cash advance?"
      />

      <Section tone="white">
        <div className="max-w-[68ch]">
          <AnswerBlock>
            GLD Funding requires {currency(PRODUCT.minMonthlyRevenue)} in average monthly revenue,
            at least {PRODUCT.minMonthsInBusiness} months in business, and a business bank account.
            There is no minimum credit score and no collateral requirement — approval is based on
            deposit history rather than your credit file.
          </AnswerBlock>
        </div>

        <div className="mt-10 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {CRITERIA.map((c) => (
            <div key={c.label} className="bg-white p-6">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
                {c.label}
              </p>
              <p className="mt-2.5 font-mono text-[1.375rem] font-medium tabular-nums tracking-[-0.02em] text-mint-deep">
                {c.value}
              </p>
              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-2">{c.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <SectionHead
          eyebrow="What underwriting actually reads"
          title="Meeting the minimum is not the same as being approved."
          lead="Once you clear the thresholds, the decision comes down to what your statements say about how the business runs."
        />

        <div ref={strengthRef} className="stagger mt-10 grid gap-px border border-rule bg-rule lg:grid-cols-2">
          <div className="bg-white p-6 lg:p-8">
            <h3 className="flex items-center gap-2.5 text-[1.0625rem] font-semibold text-ink">
              <CheckCircleIcon size={20} weight="fill" className="text-good" />
              Strengthens your file
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {STRENGTHENS.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-good" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 lg:p-8">
            <h3 className="flex items-center gap-2.5 text-[1.0625rem] font-semibold text-ink">
              <XCircleIcon size={20} weight="fill" className="text-rate" />
              Weakens it
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {WEAKENS.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rate" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Prose>
            <h2>Why we read statements instead of credit scores</h2>
            <p>
              A personal credit score describes how someone has handled consumer debt. It says
              remarkably little about whether a restaurant that takes {currency(60_000)} a month can
              carry a {currency(1_200)} weekly remittance.
            </p>
            <p>
              Bank statements answer that question directly. They show what actually arrives, how
              regularly, what cushion the account holds, and whether the business runs close to the
              edge. That is why an owner who took a credit hit during a bad year can be a perfectly
              good file today — the statements describe the business now, not five years ago.
            </p>

            <h2>What to have ready</h2>
            <p>
              {PRODUCT.statementMonths.default} months of business bank statements — four if you are
              in New York. Complete statements, every page, exactly as your bank issues them.
              Screenshots and partial exports slow underwriting down more than anything else.
            </p>
            <p>
              You can also connect your bank read-only during the application, which replaces the
              upload entirely and usually shortens the decision.
            </p>

            <Callout title="Disclose existing positions">
              If you are already carrying an advance, put it on the application. Underwriting will
              find it in the statements regardless, and a position discovered rather than disclosed
              turns a workable file into a decline.
            </Callout>

            <h2>If you do not qualify yet</h2>
            <p>
              Call us anyway. Sometimes the gap is small and worth waiting out — another two months
              of trading, or one clean statement period without negative days, changes the answer.
              We would rather tell you that in five minutes than take an application that was never
              going to work.
            </p>
          </Prose>

          <div>
            <SectionHead eyebrow="Questions" title="About qualifying." />
            <div className="mt-6">
              <FaqList items={FAQS} />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-ink">Find out in about a minute.</h2>
            <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-ink-2">
              Three questions — revenue, time in business, industry. No contact details required to
              see your range.
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

Component.displayName = 'Qualify'
