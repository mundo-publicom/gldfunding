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
import { Seo, breadcrumbSchema, faqSchema } from '../../lib/seo'
import { CTA, PRODUCT, currency } from '../../data/site'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Funding', path: '/funding/merchant-cash-advance' },
  { name: 'What it costs', path: '/funding/cost' },
]

/** Worked examples. Illustrative — replace with GLD's real pricing grid. */
const EXAMPLES = [
  { amount: 25_000, factor: 1.35, months: 6 },
  { amount: 50_000, factor: 1.28, months: 9 },
  { amount: 100_000, factor: 1.22, months: 12 },
  { amount: 250_000, factor: 1.18, months: 15 },
]

const FAQS = [
  {
    q: 'How much does a merchant cash advance cost?',
    a: `Cost is expressed as a factor rate, typically between ${PRODUCT.factorRateMin} and ${PRODUCT.factorRateMax} at GLD Funding. At a factor rate of 1.28, a ${currency(50_000)} advance is repaid as ${currency(64_000)} — a cost of capital of ${currency(14_000)}. The rate depends on your revenue consistency, time in business, industry, and the term you choose.`,
  },
  {
    q: 'Does repaying early save me money?',
    a: 'Not by default. A factor rate is applied once at signing, so the total repayment is fixed regardless of speed. Some funders offer an early-repayment discount; always ask before signing, and get it in writing in the agreement rather than as a verbal assurance.',
  },
  {
    q: 'Are there origination or hidden fees?',
    a: 'GLD Funding discloses every fee in writing before you sign. Ask any funder for a single figure: the total dollar amount you will repay. If that number is not stated plainly on the offer, treat it as a warning sign.',
  },
  {
    q: 'What is the APR equivalent of a factor rate?',
    a: 'Because remittances begin immediately and the cost is fixed, the annualized cost of a short-term advance is substantially higher than the factor rate suggests. A 1.28 factor over 9 months works out to an APR far above 28%. Several states now require an APR-comparable figure on every offer for exactly this reason.',
  },
  {
    q: 'What makes my factor rate higher or lower?',
    a: 'Longer terms and smaller advances price higher; shorter terms and larger advances price lower. Beyond that: consistency of deposits, time in business, industry risk, average daily bank balance, number of negative days, and any existing advances you are already carrying.',
  },
]

export function Component() {
  return (
    <>
      <Seo
        path="/funding/cost"
        title="How Much Does a Merchant Cash Advance Cost?"
        description={`Factor rates from ${PRODUCT.factorRateMin} to ${PRODUCT.factorRateMax}, with worked examples showing total repayment and cost of capital on advances from ${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)}.`}
        schema={[breadcrumbSchema(TRAIL), faqSchema(FAQS)]}
      />

      <PageHero
        trail={TRAIL}
        eyebrow="Cost transparency"
        title="How much does a merchant cash advance cost?"
      />

      <Section tone="white">
        <div className="max-w-[68ch]">
          <AnswerBlock>
            A merchant cash advance is priced with a factor rate, typically{' '}
            {PRODUCT.factorRateMin} to {PRODUCT.factorRateMax}. At a factor rate of 1.28, a{' '}
            {currency(50_000)} advance is repaid as {currency(64_000)} — a cost of{' '}
            {currency(14_000)}. The rate is fixed at signing and does not accrue over time.
          </AnswerBlock>
        </div>

        <div className="mt-10">
          <RateCalculator />
        </div>
      </Section>

      <Section tone="paper">
        <SectionHead
          eyebrow="Worked examples"
          title="What real advances actually cost."
          lead="Four representative structures. Every figure is the total you repay, not a monthly payment with the rest hidden below the fold."
        />

        <div
          className="mt-10 overflow-x-auto border border-rule bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
          tabIndex={0}
          role="region"
          aria-label="Worked cost examples — scrolls horizontally"
        >
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-rule bg-paper">
                {['Advance', 'Factor rate', 'Term', 'Total repayment', 'Cost of capital', 'Weekly'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-3"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map((ex) => {
                const total = ex.amount * ex.factor
                const cost = total - ex.amount
                const weekly = total / (ex.months * 4.345)
                return (
                  <tr key={ex.amount} className="border-b border-rule-soft last:border-0">
                    <td className="px-5 py-4 font-mono text-[0.9375rem] font-medium tabular-nums text-ink">
                      {currency(ex.amount)}
                    </td>
                    <td className="px-5 py-4 font-mono text-[0.9375rem] tabular-nums text-ink-2">
                      {ex.factor.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 font-mono text-[0.9375rem] tabular-nums text-ink-2">
                      {ex.months} mo
                    </td>
                    <td className="px-5 py-4 font-mono text-[0.9375rem] font-medium tabular-nums text-ink">
                      {currency(total)}
                    </td>
                    <td className="px-5 py-4 font-mono text-[0.9375rem] tabular-nums text-rate">
                      {currency(cost)}
                    </td>
                    <td className="px-5 py-4 font-mono text-[0.9375rem] tabular-nums text-ink-2">
                      {currency(Math.round(weekly))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[0.8125rem] text-ink-3">
          Illustrative structures, not offers. Your factor rate depends on underwriting.
        </p>
      </Section>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Prose>
            <h2>What drives your rate</h2>
            <p>
              Two structural factors do most of the work. <strong>Term length</strong> is the
              biggest single input — shorter terms price lower because the funder's capital is at
              risk for less time. <strong>Advance size</strong> is next: larger advances carry
              proportionally lower rates because the underwriting cost is spread further.
            </p>
            <p>Beyond those, underwriting weighs:</p>
            <ul>
              <li>
                <strong>Deposit consistency.</strong> Steady weekly deposits price better than the
                same annual revenue arriving in unpredictable lumps.
              </li>
              <li>
                <strong>Time in business.</strong> Past three years, rates improve noticeably.
              </li>
              <li>
                <strong>Average daily balance and negative days.</strong> A balance that regularly
                touches zero signals thin cushion, and prices accordingly.
              </li>
              <li>
                <strong>Existing positions.</strong> Each additional advance you are carrying
                increases the remittance load on the same revenue, and raises the rate on anything
                new.
              </li>
              <li>
                <strong>Industry.</strong> Seasonality and chargeback exposure both matter.
              </li>
            </ul>

            <h2>How to compare offers honestly</h2>
            <p>
              Funders present cost in different ways, which makes comparison harder than it should
              be. Reduce every offer to the same three numbers before you decide:
            </p>
            <ol>
              <li>
                <strong>Total dollar repayment.</strong> The single figure that leaves your account
                over the life of the advance.
              </li>
              <li>
                <strong>Remittance amount and frequency.</strong> What actually gets debited, and
                how often. This is what determines whether you can carry it.
              </li>
              <li>
                <strong>Every fee, itemized.</strong> Origination, underwriting, ACH, and any
                early-repayment terms.
              </li>
            </ol>

            <Callout title="One question that reveals a lot">
              Ask any funder: <em>"What is the total dollar amount I will repay, and what will you
              debit, how often?"</em> A straight answer takes one sentence. Anything evasive tells
              you what you need to know.
            </Callout>

            <h2>Your right to a written disclosure</h2>
            <p>
              If your business is in New York, California, Utah, Virginia, Connecticut, Georgia or
              Florida, state law requires the funder to give you a standardized written disclosure
              before you sign — including total cost, an APR-comparable figure, and repayment terms.
            </p>
            <p>
              GLD Funding provides that disclosure on every offer regardless of state.{' '}
              <Link to="/locations">Check the rules where you operate</Link>.
            </p>
          </Prose>

          <div>
            <SectionHead eyebrow="Questions" title="About cost." />
            <div className="mt-6">
              <FaqList items={FAQS} />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-ink">See your own numbers.</h2>
            <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-ink-2">
              Three questions gets you an indicative range. No credit pull, no obligation.
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

Component.displayName = 'Cost'
