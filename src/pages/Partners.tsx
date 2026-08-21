import { HandshakeIcon, LightningIcon, TrendUpIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { AnswerBlock, FeatureCard, FeatureGrid, PageHero, Prose, Section, SectionHead } from '../components/ui'
import { ContactForm } from '../components/ContactForm'
import { Seo, breadcrumbSchema, faqSchema } from '../lib/seo'
import { PRODUCT, currency } from '../data/site'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Partners', path: '/partners' },
]

const FAQS = [
  {
    q: 'Who can partner with GLD Funding?',
    a: 'Independent sales organizations, brokers, accountants, equipment vendors, POS resellers, and anyone who advises small business owners on capital. We work with both established ISOs and individuals building a book.',
  },
  {
    q: 'How quickly do submissions get a decision?',
    a: `Most complete submissions receive a decision within ${PRODUCT.decisionHours} business hours. A dedicated relationship manager handles your files rather than a general queue.`,
  },
  {
    q: 'What do you need from a submission?',
    a: `A signed application and ${PRODUCT.statementMonths.default} months of business bank statements - four for New York merchants. Anything further is requested only when a specific file needs it.`,
  },
  {
    q: 'What deal sizes do you fund?',
    a: `${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)}, across most industries. We look at renewals, second positions and consolidations case by case.`,
  },
]

export function Component() {
  return (
    <>
      <Seo
        path="/partners"
        title="ISO & Broker Partnerships"
        description={`Partner with GLD Funding. Decisions in ${PRODUCT.decisionHours} business hours, deal sizes from ${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)}, and a dedicated relationship manager on every file.`}
        schema={[breadcrumbSchema(TRAIL), faqSchema(FAQS)]}
      />

      <PageHero
        trail={TRAIL}
        eyebrow="Partners & ISOs"
        title="Bring us your merchants. We'll get them funded."
        lead="GLD Funding works with ISOs, brokers and advisors who need a funder that answers fast, prices honestly, and treats their merchants well."
      />

      <Section tone="white">
        <div className="max-w-[68ch]">
          <AnswerBlock>
            GLD Funding partners with independent sales organizations, brokers and advisors to fund
            small business merchants. Submissions receive a decision within about{' '}
            {PRODUCT.decisionHours} business hours, deal sizes run {currency(PRODUCT.advanceMin)} to{' '}
            {currency(PRODUCT.advanceMax)}, and every partner works with a dedicated relationship
            manager.
          </AnswerBlock>
        </div>

        <div className="mt-10 border border-rule">
          <FeatureGrid cols={4}>
            <FeatureCard icon={<LightningIcon size={24} weight="light" />} title="Fast decisions">
              Complete submissions get an answer within {PRODUCT.decisionHours} business hours - not
              a queue position.
            </FeatureCard>
            <FeatureCard icon={<UsersThreeIcon size={24} weight="light" />} title="A real person">
              A dedicated relationship manager who knows your book, not a shared inbox.
            </FeatureCard>
            <FeatureCard icon={<TrendUpIcon size={24} weight="light" />} title="Competitive buy rates">
              Transparent pricing with room to build a sustainable book, plus renewals.
            </FeatureCard>
            <FeatureCard icon={<HandshakeIcon size={24} weight="light" />} title="Merchants treated well">
              Written cost disclosure on every offer. Your reputation travels with the file.
            </FeatureCard>
          </FeatureGrid>
        </div>
      </Section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Prose>
            <h2>Why partner with us</h2>
            <p>
              GLD Funding values its partners and financial organizations, and we are always looking
              for opportunities to bring capital to small business owners. Working together, we can
              get merchants the working capital they need - and both build our portfolios doing it.
            </p>

            <h2>What we look for</h2>
            <ul>
              <li>Complete submissions - signed application plus statements, first time</li>
              <li>Merchants at {currency(PRODUCT.minMonthlyRevenue)}+ monthly revenue and {PRODUCT.minMonthsInBusiness}+ months trading</li>
              <li>Existing positions disclosed up front rather than discovered in underwriting</li>
              <li>Honest expectation-setting with the merchant about cost and remittance</li>
            </ul>

            <h2>How it works</h2>
            <ol>
              <li>Get in touch and we'll set up your partner account and agreement.</li>
              <li>Submit deals with the application and statements.</li>
              <li>Your relationship manager returns an offer, usually same day.</li>
              <li>Merchant signs, funds go out, and commissions are paid on schedule.</li>
            </ol>

            <h2>A word on how we underwrite</h2>
            <p>
              We will decline a merchant when the statements say an advance would make their
              position worse. That costs us both a deal occasionally - and it is why the merchants
              you send keep taking your calls afterwards.
            </p>
          </Prose>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead eyebrow="Get started" title="Tell us about your book." />
            <div className="mt-6">
              <ContactForm
                submitLabel="Send enquiry"
                successTitle="Enquiry received"
                successBody="A partnership manager will be in touch within one business day to set up your account."
                topics={[
                  { value: 'iso', label: 'ISO / brokerage' },
                  { value: 'individual', label: 'Individual broker' },
                  { value: 'referral', label: 'Referral partner' },
                  { value: 'vendor', label: 'Equipment or POS vendor' },
                  { value: 'accountant', label: 'Accountant or advisor' },
                  { value: 'other', label: 'Something else' },
                ]}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHead eyebrow="Questions" title="Partnering with GLD." />
          <div className="[&_details]:border-rule">
            {FAQS.map((f) => (
              <details key={f.q} className="group border-b border-rule py-5 first:border-t">
                <summary className="cursor-pointer list-none text-[1.0625rem] font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                </summary>
                <p className="mt-3 max-w-[68ch] text-[0.9375rem] leading-relaxed text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}

Component.displayName = 'Partners'
