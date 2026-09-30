import { Link } from 'react-router-dom'
import { AnswerBlock, PageHero, Prose, Section } from '../../components/ui'
import { EligibilityCta } from '../../components/EligibilityCta'
import { Seo, breadcrumbSchema, productSchema } from '../../lib/seo'
import { PRODUCT, currency } from '../../data/site'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Funding', path: '/funding/merchant-cash-advance' },
  { name: 'What is an MCA?', path: '/funding/merchant-cash-advance' },
]

export function Component() {
  return (
    <>
      <Seo
        path="/funding/merchant-cash-advance"
        title="What Is a Merchant Cash Advance?"
        description={`A merchant cash advance is the purchase of future business receivables at a discount - not a loan. Amounts from ${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)}, with daily or weekly remittances.`}
        schema={[
          breadcrumbSchema(TRAIL),
          productSchema({
            name: 'Merchant Cash Advance',
            description:
              'Purchase of future business receivables at a discount, providing immediate working capital with daily or weekly remittances.',
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
              discount. The funder provides a lump sum - at GLD Funding,{' '}
              {currency(PRODUCT.advanceMin)} to {currency(PRODUCT.advanceMax)} - in exchange for an
              agreed amount of future receivables. Remittances are made daily or weekly, subject to
              the terms of the agreement and any applicable reconciliation provisions.
            </AnswerBlock>

            <Prose className="mt-8">
              <p>
                An MCA is structured as a purchase of future receivables rather than a traditional
                loan, and its cost is generally expressed through a factor rate rather than an
                interest rate.
              </p>

              <h2>How does it work?</h2>
              <p>
                You agree to sell a specific dollar amount of your future receivables, the{' '}
                <strong>purchased amount</strong>, for a smaller sum paid to you today, the{' '}
                <strong>purchase price</strong>. The difference between the two is the cost of the
                advance, expressed as a <strong>factor rate</strong> rather than an interest rate.
              </p>
              <p>
                For example, if the purchase price is {currency(50_000)} with a factor rate of 1.30,
                the Total Purchased Amount would be {currency(65_000)}.
              </p>
              <p>
                Unlike interest that accrues over time, the purchased amount is established in the
                agreement. Any early-remittance or prepayment terms will be disclosed in your
                agreement and applicable disclosures.
              </p>
              <p>
                The estimated remittance period may vary based on the structure of the agreement and
                the business's receivables.
              </p>

              <h2>How are payments handled?</h2>
              <p>
                Remittances are generally collected by ACH debit from your business bank account
                daily or weekly. The remittance amount, frequency, Total Purchased Amount, and other
                applicable terms are set out in your agreement before you sign.
              </p>
              <p>
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
    </>
  )
}

Component.displayName = 'MerchantCashAdvance'
