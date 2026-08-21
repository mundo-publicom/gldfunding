import { Link } from 'react-router-dom'
import {
  AnswerBlock,
  Callout,
  FaqList,
  PageHero,
  Prose,
  Section,
  SectionHead,
} from '../../components/ui'
import { RateCalculator } from '../../components/RateCalculator'
import { Seo, breadcrumbSchema, faqSchema, productSchema } from '../../lib/seo'
import { CTA, PRODUCT, currency } from '../../data/site'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Funding', path: '/funding/merchant-cash-advance' },
  { name: 'What is an MCA?', path: '/funding/merchant-cash-advance' },
]

const FAQS = [
  {
    q: 'Is a merchant cash advance a loan?',
    a: 'No. A merchant cash advance is the purchase of a business\'s future receivables at a discount. Because it is a purchase rather than a loan, there is no interest rate, no fixed maturity date in the way a loan has one, and providers like GLD Funding are not banks or lenders.',
  },
  {
    q: 'How is a factor rate different from an interest rate?',
    a: 'A factor rate is a flat multiplier applied once to the advance amount. At a factor rate of 1.30, a $50,000 advance is repaid as $65,000 regardless of how quickly you repay it. Interest, by contrast, accrues over time, so repaying a loan early reduces what you owe.',
  },
  {
    q: 'How are remittances collected?',
    a: 'Remittances are collected by ACH debit from your business bank account on a fixed daily or weekly schedule agreed at signing, or as an agreed percentage of card settlements. The schedule is set out in your agreement before you sign anything.',
  },
  {
    q: 'What happens if my business has a slow month?',
    a: 'Contact us before a payment is missed. Because an advance is a purchase of receivables rather than a loan, remittances can often be reconciled against actual revenue. Providers vary in how they handle this, so ask about reconciliation before you sign with anyone.',
  },
  {
    q: 'Will a merchant cash advance affect my credit score?',
    a: 'GLD Funding does not require a minimum credit score, and applying does not involve a hard consumer credit pull. We may obtain business credit information as part of underwriting. Because an advance is not a loan, it is generally not reported to consumer credit bureaus as one.',
  },
  {
    q: 'Can I get an advance if I already have one?',
    a: 'Sometimes. Additional positions are underwritten case by case and depend on your revenue, the balance outstanding, and the remittance you are already carrying. Disclose existing positions on your application - undisclosed positions are the most common reason a file is declined late.',
  },
]

export function Component() {
  return (
    <>
      <Seo
        path="/funding/merchant-cash-advance"
        title="What Is a Merchant Cash Advance?"
        description={`A merchant cash advance is the purchase of future business receivables at a discount - not a loan. Amounts from ${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)}, factor rates from ${PRODUCT.factorRateMin}, funding in ${PRODUCT.fundingHours} hours.`}
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
              discount. The funder advances a lump sum - at GLD Funding, {currency(PRODUCT.advanceMin)}{' '}
              to {currency(PRODUCT.advanceMax)} - and recovers it through fixed daily or weekly
              remittances. It is not a loan, carries no interest rate, and requires no collateral.
            </AnswerBlock>

            <Prose className="mt-8">
              <p>
                The distinction between a purchase and a loan is not a technicality. It changes what
                the product costs, how it is priced, who can qualify, and which laws apply to it.
              </p>

              <h2>How the mechanics actually work</h2>
              <p>
                You agree to sell a specific dollar amount of your future receivables - the{' '}
                <strong>purchased amount</strong> - for a smaller sum paid to you today, the{' '}
                <strong>purchase price</strong>. The difference between the two is the cost of the
                advance, expressed as a <strong>factor rate</strong> rather than an interest rate.
              </p>
              <p>
                Say you take {currency(50_000)} at a factor rate of 1.30. You receive{' '}
                {currency(50_000)} now and repay {currency(65_000)} in total. That{' '}
                {currency(15_000)} is fixed at signing. It does not accrue, compound, or grow if
                repayment takes longer than expected - and, importantly, it does not shrink if you
                repay faster.
              </p>

              <h2>How repayment is collected</h2>
              <p>
                Remittances come out by ACH debit on a fixed daily or weekly schedule, or as an
                agreed percentage of card settlements. The schedule is written into your agreement
                before you sign, so there is nothing to discover afterwards.
              </p>
              <p>
                Terms typically run {PRODUCT.termMinMonths} to {PRODUCT.termMaxMonths} months.
                Shorter terms carry lower factor rates but larger individual remittances - the
                trade-off is between total cost and weekly cash-flow pressure, and it is the single
                most important decision in structuring an advance.
              </p>

              <Callout title="The honest version of the trade-off">
                Because the cost is fixed rather than accruing, a short-term advance can be an
                expensive way to borrow when expressed as an annualized rate. It exists to solve a
                different problem: capital in {PRODUCT.fundingHours} hours against bank deposits,
                for a business a bank would decline. Whether that trade is worth it depends entirely
                on what the capital lets you do.
              </Callout>

              <h2>Who qualifies</h2>
              <p>
                Underwriting reads your business bank statements rather than your credit file. The
                practical thresholds at GLD Funding are{' '}
                {currency(PRODUCT.minMonthlyRevenue)} in average monthly revenue and{' '}
                {PRODUCT.minMonthsInBusiness} months of trading history. There is no minimum credit
                score and no collateral requirement.
              </p>
              <p>
                What underwriting is really looking for is consistency: regular deposits, a bank
                balance that does not sit at zero, and few or no negative days. A business with
                modest but steady revenue is often a stronger file than one with high but erratic
                deposits. See <Link to="/funding/qualify">the full qualification criteria</Link>.
              </p>

              <h2>What it is not suited to</h2>
              <p>
                An advance is working capital, not long-term financing. It is a poor fit for buying
                real estate, funding a multi-year build-out, or refinancing debt you are already
                struggling to service. If you qualify for an SBA loan or a bank line of credit and
                can wait the six to twelve weeks, those are almost always cheaper - see{' '}
                <Link to="/funding/mca-vs-business-loan">the side-by-side comparison</Link>.
              </p>

              <h2>How it is regulated</h2>
              <p>
                Because an advance is a commercial transaction rather than consumer credit, federal
                Truth in Lending rules do not apply. A growing number of states now require their
                own disclosures: New York, California, Utah, Virginia, Connecticut, Georgia and
                Florida all mandate written disclosure of total cost and terms at the point of
                offer, typically including an APR-comparable figure.
              </p>
              <p>
                GLD Funding provides a written disclosure of total dollar cost with every offer,
                regardless of whether your state requires one.{' '}
                <Link to="/locations">See the rules that apply in your state</Link>.
              </p>
            </Prose>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <RateCalculator compact />
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
              Want to know what you'd actually qualify for?
            </h2>
            <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-ink-2">
              Three questions, no personal information, no credit pull.
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
