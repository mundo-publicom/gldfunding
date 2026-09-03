import { Link } from 'react-router-dom'
import { CheckIcon, MinusIcon } from '@phosphor-icons/react'
import { AnswerBlock, FaqList, PageHero, Section, SectionHead } from '../../components/ui'
import { Seo, breadcrumbSchema, faqSchema } from '../../lib/seo'
import { CTA, PRODUCT } from '../../data/site'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Funding', path: '/funding/merchant-cash-advance' },
  { name: 'MCA vs. business loan', path: '/funding/mca-vs-business-loan' },
]

/* Two columns, not three. The brief asks for a comparison of an advance and a
   traditional business loan; the SBA column and the long editorial sections
   below the table were what made this page an argument rather than a table. */
type Row = { label: string; mca: string; loan: string }

const ROWS: Row[] = [
  { label: 'Product type', mca: 'Purchase of future receivables', loan: 'Debt' },
  { label: 'Time to funding', mca: 'Same-day funding available', loan: '1–4 weeks' },
  { label: 'Cost basis', mca: 'Factor rate', loan: 'Interest rate' },
  { label: 'Typical annualized cost', mca: 'Higher', loan: 'Lower' },
  { label: 'Qualification', mca: 'Business performance and cash flow', loan: 'Credit score and financials' },
  { label: 'Paperwork', mca: '4 months of bank statements', loan: 'Financials, tax returns, business plan' },
  { label: 'Repayment', mca: 'Fixed daily or weekly remittance', loan: 'Fixed monthly payment' },
  { label: 'Term', mca: `${PRODUCT.termMinMonths}–${PRODUCT.termMaxMonths} months`, loan: '1–5 years' },
  { label: 'Early repayment saves money', mca: 'No - cost is fixed at signing', loan: 'Usually' },
  { label: 'Builds business credit', mca: 'Generally no', loan: 'Yes' },
]

const FAQS = [
  {
    q: 'Is a merchant cash advance cheaper than a business loan?',
    a: 'No. On an annualized basis a merchant cash advance costs more than a bank loan. It is faster and easier to qualify for. If you can get bank financing and can wait for it, the loan is usually the cheaper option.',
  },
  {
    q: 'When does a merchant cash advance make more sense than a loan?',
    a: 'When speed decides the outcome - a truck off the road, an equipment failure, inventory that has to be bought this week - or when a bank has already declined you. An advance is underwritten on business performance rather than a credit file, and same-day funding is available.',
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
        description="Side-by-side comparison of a merchant cash advance and a traditional business loan - speed, cost, qualification, paperwork and repayment."
        schema={[breadcrumbSchema(TRAIL), faqSchema(FAQS)]}
      />

      <PageHero trail={TRAIL} eyebrow="Comparison" title="Merchant cash advance vs. business loan" />

      <Section tone="white">
        <div className="max-w-[68ch]">
          <AnswerBlock>
            A merchant cash advance is funded quickly and qualified on business performance and cash
            flow, but costs more on an annualized basis. A traditional business loan costs less and
            builds credit, but takes weeks and requires strong credit and full financials.
          </AnswerBlock>
        </div>

        <div
          className="mt-10 overflow-x-auto border border-rule focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          tabIndex={0}
          role="region"
          aria-label="Comparison of a merchant cash advance and a traditional business loan - scrolls horizontally"
        >
          <table className="w-full min-w-[620px] border-collapse bg-white">
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
                    GLD Factoring LLC DBA GLD Funding
                  </span>
                </th>
                <th className="bg-paper px-5 py-4 text-left">
                  <span className="block text-[0.9375rem] font-semibold text-ink">
                    Business loan
                  </span>
                  <span className="mt-0.5 block font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-3">
                    Traditional
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[0.8125rem] text-ink-3">
          General comparison only. Actual terms vary by business and are determined by underwriting.
        </p>
      </Section>

      <Section tone="paper">
        <SectionHead
          eyebrow="Choosing"
          title="Which one fits your situation."
          lead="Neither product is better. They solve different problems, and the right answer depends on your timeline and what a bank will say."
        />

        <div className="mt-10 grid gap-px border border-rule bg-rule lg:grid-cols-2">
          <div className="bg-white p-6 lg:p-8">
            <h3 className="text-[1.0625rem] font-semibold text-ink">An advance may fit when…</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {[
                'You need capital quickly and the opportunity or problem will not wait',
                'A bank has already declined you, or your credit will not clear their floor',
                'Your revenue is strong but your monthly cash flow is uneven',
                'The capital pays for itself faster than the cost of taking it',
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink-2"
                >
                  <CheckIcon size={15} weight="bold" className="mt-1 shrink-0 text-leaf-deep" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 lg:p-8">
            <h3 className="text-[1.0625rem] font-semibold text-ink">A loan may fit when…</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {[
                'You can wait several weeks for funding',
                "Your credit and financials will clear a bank's criteria",
                'You are funding something long-lived - property, a major build-out',
                'You want the lowest available cost of capital',
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink-2"
                >
                  <MinusIcon size={15} weight="bold" className="mt-1 shrink-0 text-ink-4" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHead eyebrow="Questions" title="Comparing the options." />
          <FaqList items={FAQS} />
        </div>
      </Section>

      <Section tone="paper">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-ink">Decided an advance is the right tool?</h2>
            <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-ink-2">
              Answer a few simple questions to see what your business may qualify for.
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
