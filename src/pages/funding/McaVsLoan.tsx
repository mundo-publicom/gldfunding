import { AnswerBlock, PageHero, Section } from '../../components/ui'
import { Seo, breadcrumbSchema, faqSchema } from '../../lib/seo'

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
  { label: 'Time to funding', mca: 'Same-day funding may be available once the file is complete', loan: 'Varies by lender and loan program. Do not state “1–4 weeks” as a universal rule for business loans.' },
  { label: 'Cost basis', mca: 'Factor rate', loan: 'Interest rate' },
  { label: 'Qualification', mca: 'Business performance, revenue, cash flow, and underwriting', loan: 'Varies by lender; may include credit, financials, revenue, and other underwriting criteria' },
  { label: 'Paperwork', mca: 'Application and 4 months of business bank statements; additional documents may be required', loan: 'Varies by lender and loan program' },
  { label: 'Payment Structure', mca: 'Subject to the agreement and applicable reconciliation provisions', loan: 'Scheduled payments according to the loan agreement' },
  { label: 'Term / Estimated Remittance Period', mca: 'Estimated remittance period varies based on the agreement and business receivables', loan: 'Varies by lender and loan product' },
  { label: 'Early Completion', mca: 'Subject to the terms of the agreement', loan: 'Subject to the terms of the loan agreement' },
  { label: 'Builds business credit', mca: 'Not typically structured as business credit', loan: 'May help build business credit when reported to business credit bureaus' }
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
        description="Side-by-side comparison of a merchant cash advance and a traditional business loan - speed, cost, qualification, paperwork and payment structure."
        schema={[breadcrumbSchema(TRAIL), faqSchema(FAQS)]}
      />

      <PageHero trail={TRAIL} eyebrow="Comparison" title="Merchant cash advance vs. business loan" />

      <Section tone="white">
        <div className="max-w-[68ch]">
          <AnswerBlock>
          A merchant cash advance and a traditional business loan are structured differently. 
          An MCA is a purchase of future receivables, while a business loan is debt. Qualification requirements, funding speed, cost, payment structure, and documentation vary by provider and applicant.
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
                    GLD Funding
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
        General comparison only. Products, eligibility requirements, costs, payment structures, terms, reporting practices, and documentation requirements vary by provider and applicant. Review the specific agreement and applicable disclosures before accepting financing.
        </p>
      </Section>

    </>
  )
}

Component.displayName = 'McaVsLoan'
