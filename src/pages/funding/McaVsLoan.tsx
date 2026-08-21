import { Link } from 'react-router-dom'
import { CheckIcon, MinusIcon } from '@phosphor-icons/react'
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

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Funding', path: '/funding/merchant-cash-advance' },
  { name: 'MCA vs. business loan', path: '/funding/mca-vs-business-loan' },
]

type Row = { label: string; mca: string; loan: string; sba: string }

const ROWS: Row[] = [
  { label: 'Product type', mca: 'Purchase of receivables', loan: 'Debt', sba: 'Government-guaranteed debt' },
  { label: 'Time to funding', mca: `${PRODUCT.fundingHours} hours`, loan: '1–4 weeks', sba: '6–12 weeks' },
  { label: 'Cost basis', mca: `Factor rate ${PRODUCT.factorRateMin}–${PRODUCT.factorRateMax}`, loan: 'Interest rate', sba: 'Interest rate' },
  { label: 'Typical annualized cost', mca: 'High', loan: 'Moderate', sba: 'Lowest available' },
  { label: 'Credit score minimum', mca: 'None', loan: '650–700+', sba: '680+' },
  { label: 'Collateral', mca: 'None', loan: 'Often required', sba: 'Usually required' },
  { label: 'Personal guarantee', mca: 'No', loan: 'Usually', sba: 'Yes' },
  { label: 'Paperwork', mca: `${PRODUCT.statementMonths.default} months of statements`, loan: 'Financials, tax returns, plan', sba: 'Extensive' },
  { label: 'Repayment', mca: 'Daily or weekly, revenue-linked', loan: 'Fixed monthly', sba: 'Fixed monthly' },
  { label: 'Term', mca: `${PRODUCT.termMinMonths}–${PRODUCT.termMaxMonths} months`, loan: '1–5 years', sba: '5–25 years' },
  { label: 'Early repayment saves money', mca: 'No', loan: 'Usually', sba: 'Usually' },
  { label: 'Builds business credit', mca: 'Generally no', loan: 'Yes', sba: 'Yes' },
]

const FAQS = [
  {
    q: 'Is a merchant cash advance cheaper than a business loan?',
    a: 'No. On an annualized basis a merchant cash advance is materially more expensive than a bank loan or SBA loan. It is faster and far easier to qualify for. If you can get bank financing and can wait for it, take the loan.',
  },
  {
    q: 'When does a merchant cash advance make more sense than a loan?',
    a: `When speed decides the outcome - a truck off the road, an equipment failure, inventory that has to be bought this week - or when a bank has already declined you. An advance funds in about ${PRODUCT.fundingHours} hours against bank statements, with no collateral and no credit-score minimum.`,
  },
  {
    q: 'Can I use an advance to pay off a bank loan?',
    a: 'It is almost never a good idea. Replacing cheaper long-term debt with more expensive short-term capital increases both cost and cash-flow pressure. The reverse - refinancing an advance into a bank loan once you qualify - is usually the right move.',
  },
  {
    q: 'Do merchant cash advances build business credit?',
    a: 'Generally not. Because an advance is a purchase of receivables rather than a loan, it is typically not reported to business credit bureaus as trade credit. If building credit is your goal, a business credit card or a small term loan does that work better.',
  },
]

export function Component() {
  return (
    <>
      <Seo
        path="/funding/mca-vs-business-loan"
        title="Merchant Cash Advance vs. Business Loan"
        description={`Side-by-side comparison of merchant cash advances, bank loans and SBA loans - speed, cost, credit requirements, collateral and repayment. An advance funds in ${PRODUCT.fundingHours} hours; an SBA loan takes 6–12 weeks.`}
        schema={[breadcrumbSchema(TRAIL), faqSchema(FAQS)]}
      />

      <PageHero
        trail={TRAIL}
        eyebrow="Comparison"
        title="Merchant cash advance vs. business loan"
      />

      <Section tone="white">
        <div className="max-w-[68ch]">
          <AnswerBlock>
            A merchant cash advance funds in about {PRODUCT.fundingHours} hours with no collateral
            and no credit-score minimum, but costs more on an annualized basis. A bank or SBA loan
            costs considerably less and builds credit, but takes weeks and requires strong credit,
            collateral and full financials.
          </AnswerBlock>
        </div>

        <div
          className="mt-10 overflow-x-auto border border-rule focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          tabIndex={0}
          role="region"
          aria-label="Comparison of merchant cash advances, bank loans and SBA loans - scrolls horizontally"
        >
          <table className="w-full min-w-[760px] border-collapse bg-white">
            <thead>
              <tr className="border-b border-rule">
                <th className="bg-paper px-5 py-4 text-left font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-3">
                  &nbsp;
                </th>
                <th className="bg-leaf/8 px-5 py-4 text-left">
                  <span className="block text-[0.9375rem] font-semibold text-ink">
                    Merchant cash advance
                  </span>
                  <span className="mt-0.5 block font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-leaf-deep">
                    GLD Funding
                  </span>
                </th>
                <th className="bg-paper px-5 py-4 text-left">
                  <span className="block text-[0.9375rem] font-semibold text-ink">Bank loan</span>
                  <span className="mt-0.5 block font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-3">
                    Traditional
                  </span>
                </th>
                <th className="bg-paper px-5 py-4 text-left">
                  <span className="block text-[0.9375rem] font-semibold text-ink">SBA loan</span>
                  <span className="mt-0.5 block font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-3">
                    7(a) / 504
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-rule-soft last:border-0">
                  <td className="bg-paper px-5 py-3.5 text-[0.875rem] font-medium text-ink">
                    {r.label}
                  </td>
                  <td className="bg-leaf/4 px-5 py-3.5 text-[0.9375rem] text-ink-2">{r.mca}</td>
                  <td className="px-5 py-3.5 text-[0.9375rem] text-ink-2">{r.loan}</td>
                  <td className="px-5 py-3.5 text-[0.9375rem] text-ink-2">{r.sba}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHead
          eyebrow="Choosing"
          title="Which one is right for your situation."
          lead="Neither product is better. They solve different problems, and the honest answer depends on your timeline and whether a bank will say yes."
        />

        <div className="mt-10 grid gap-px border border-rule bg-rule lg:grid-cols-2">
          <div className="bg-white p-6 lg:p-8">
            <h3 className="text-[1.0625rem] font-semibold text-ink">Take the advance when…</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {[
                'You need capital in days and the opportunity or problem will not wait',
                'A bank has already declined you, or your credit will not clear their floor',
                'You have no collateral to pledge',
                'Your revenue is strong but your monthly cash flow is uneven',
                'The capital pays for itself faster than the cost accrues',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
                  <CheckIcon size={15} weight="bold" className="mt-1 shrink-0 text-leaf-deep" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 lg:p-8">
            <h3 className="text-[1.0625rem] font-semibold text-ink">Take the loan when…</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {[
                'You can wait four to twelve weeks for funding',
                'Your credit and financials will clear a bank\'s criteria',
                'You are funding something long-lived - property, a major build-out',
                'You want the lowest available cost of capital',
                'Building business credit matters to you',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
                  <MinusIcon size={15} weight="bold" className="mt-1 shrink-0 text-ink-4" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <Prose>
          <h2>The comparison nobody makes for you</h2>
          <p>
            Most funders in this category avoid this page, because an honest comparison does not
            always favour the advance. We would rather you make the right decision - including the
            decision to go elsewhere - than take an advance that was the wrong tool.
          </p>

          <h2>Work out whether the maths clears</h2>
          <p>
            The useful question is not "is this expensive?" - it is "does the capital earn more than
            it costs?" A {currency(50_000)} advance at a 1.28 factor costs {currency(14_000)}. If
            that {currency(50_000)} buys inventory you sell at a {currency(30_000)} margin inside
            the term, the advance made you {currency(16_000)}. If it covers a shortfall that
            recurs next month, it made the problem worse.
          </p>

          <Callout title="The test">
            Write down what the capital will do, what it will return, and when. If you cannot state
            a return that exceeds the cost within the term, an advance is not the answer - no matter
            how quickly it funds.
          </Callout>

          <h2>Refinancing into cheaper capital later</h2>
          <p>
            Plenty of businesses use an advance to get through a moment, strengthen their financials
            over the following year, and then qualify for a bank line at a fraction of the cost.
            That is a perfectly good arc - and it is the direction the refinancing should run.
          </p>
          <p>
            What does not work is the reverse: using an advance to service existing debt. If that is
            where you are, talk to us before applying. Sometimes the right advice is not to fund.
          </p>

          <h2>Read more</h2>
          <ul>
            <li>
              <Link to="/funding/merchant-cash-advance">How a merchant cash advance works</Link>
            </li>
            <li>
              <Link to="/funding/cost">What an advance costs, with worked examples</Link>
            </li>
            <li>
              <Link to="/funding/qualify">The exact qualification thresholds</Link>
            </li>
          </ul>
        </Prose>
      </Section>

      <Section tone="paper">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHead eyebrow="Questions" title="Comparing the options." />
          <FaqList items={FAQS} />
        </div>
      </Section>

      <Section tone="white">
        <div className="flex flex-col items-start gap-6 border-t border-rule pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-ink">
              Decided an advance is the right tool?
            </h2>
            <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-ink-2">
              See your indicative range in about a minute.
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

Component.displayName = 'McaVsLoan'
