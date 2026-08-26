import { Link } from 'react-router-dom'
import { AnswerBlock, FaqList, PageHero, Prose, Section, SectionHead } from '../../components/ui'
import { EligibilityCta } from '../../components/EligibilityCta'
import { Seo, breadcrumbSchema, faqSchema, productSchema } from '../../lib/seo'
import { CTA, PRODUCT, currency } from '../../data/site'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Funding', path: '/funding/merchant-cash-advance' },
  { name: 'What is an MCA?', path: '/funding/merchant-cash-advance' },
]

/* Four questions, and only four: what is it, how does it work, how are
   payments handled, how do I apply. Mechanics, regulation, pricing depth and
   suitability were removed - they duplicated the comparison and process
   pages, and this page is the entry point, not the encyclopedia. */
const FAQS = [
  {
    q: 'Is a merchant cash advance a loan?',
    a: "No. A merchant cash advance is the purchase of a business's future receivables at a discount. Because it is a purchase rather than a loan, there is no interest rate, and providers like GLD Funding are not banks or lenders.",
  },
  {
    q: 'How is a factor rate different from an interest rate?',
    a: 'A factor rate is a flat multiplier applied once to the advance amount. At a factor rate of 1.30, a $50,000 advance is repaid as $65,000. Interest, by contrast, accrues over time, so repaying a loan early reduces what you owe.',
  },
  {
    q: 'How are remittances collected?',
    a: 'Remittances are collected by ACH debit from your business bank account on a fixed daily or weekly schedule agreed at signing, or as an agreed percentage of card settlements. The schedule is set out in your agreement before you sign anything.',
  },
  {
    q: 'What do I need to apply?',
    a: 'Four months of business bank statements, plus basic business and owner details. Anything further is requested only if your specific file calls for it, after review.',
  },
]

export function Component() {
  return (
    <>
      <Seo
        path="/funding/merchant-cash-advance"
        title="What Is a Merchant Cash Advance?"
        description={`A merchant cash advance is the purchase of future business receivables at a discount - not a loan. Amounts from ${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)}, repaid through fixed daily or weekly remittances.`}
        schema={[
          breadcrumbSchema(TRAIL),
          faqSchema(FAQS),
          productSchema({
            name: 'Merchant Cash Advance',
            description:
              'Purchase of future business receivables at a discount, providing immediate working capital repaid through fixed daily or weekly remittances.',
            amountMin: PRODUCT.advanceMin,
            amountMax: PRODUCT.advanceMax,
          }),
        ]}
      />

      <PageHero
        trail={TRAIL}
        eyebrow="Understanding the product"
        title="What is a merchant cash advance?"
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <AnswerBlock>
              A merchant cash advance is the purchase of a business's future receivables at a
              discount. The funder advances a lump sum - at GLD Funding,{' '}
              {currency(PRODUCT.advanceMin)} to {currency(PRODUCT.advanceMax)} - and recovers it
              through fixed daily or weekly remittances. It is not a loan and carries no interest
              rate.
            </AnswerBlock>

            <Prose className="mt-8">
              <h2>How does it work?</h2>
              <p>
                You agree to sell a specific dollar amount of your future receivables - the{' '}
                <strong>purchased amount</strong> - for a smaller sum paid to you today, the{' '}
                <strong>purchase price</strong>. The difference between the two is the cost of the
                advance, expressed as a <strong>factor rate</strong> rather than an interest rate.
              </p>
              <p>
                Say you take {currency(50_000)} at a factor rate of 1.30. You receive{' '}
                {currency(50_000)} now and repay {currency(65_000)} in total. That cost is fixed at
                signing: it does not accrue or compound if repayment takes longer than expected, and
                it does not shrink if you repay faster.
              </p>
              <p>
                Terms typically run {PRODUCT.termMinMonths} to {PRODUCT.termMaxMonths} months. A
                shorter term generally means a lower factor rate but larger individual remittances,
                so the structure is a trade-off between total cost and weekly cash-flow pressure.
              </p>

              <h2>How are payments handled?</h2>
              <p>
                Remittances come out by ACH debit from your business bank account on a fixed daily or
                weekly schedule, or as an agreed percentage of card settlements. The amount, the
                frequency and the total you will repay are all written into your agreement before you
                sign, and remittances usually begin the business day after funds arrive.
              </p>
              <p>
                Every offer comes with a written disclosure setting out the total dollar cost, the
                remittance amount and frequency, and the term.{' '}
                <Link to="/locations">See the rules that apply in your state</Link>.
              </p>

              <h2>How do I apply?</h2>
              <p>
                Complete the online application and provide four months of business bank statements.
                Our underwriting team reviews your business and presents the funding options
                available to you. If you accept, you sign electronically and funds are sent directly
                to your business account.
              </p>
              <p>
                For a side-by-side view of how this compares to bank financing, see{' '}
                <Link to="/funding/mca-vs-business-loan">MCA vs. business loan</Link>. For the
                process end to end, see <Link to="/funding/how-it-works">how it works</Link>.
              </p>
            </Prose>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <EligibilityCta />
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHead eyebrow="Common questions" title="What people ask before applying." />
          <FaqList items={FAQS} />
        </div>
      </Section>

      <Section tone="white">
        <div className="flex flex-col items-start gap-6 border-t border-rule pt-10 sm:flex-row sm:items-center sm:justify-between">
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

Component.displayName = 'MerchantCashAdvance'
