import { HandshakeIcon, LightningIcon, TrendUpIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { AnswerBlock, FeatureCard, FeatureGrid, PageHero, Prose, Section, SectionHead } from '../components/ui'
import { PartnerForm } from '../components/PartnerForm'
import { HowItWorksTimeline } from '../sections/HowItWorksTimeline'
import { Seo, breadcrumbSchema, faqSchema } from '../lib/seo'
import { PRODUCT, currency } from '../data/site'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Partners', path: '/partners' },
]

const PARTNER_STEPS = [
  {
    n: '01',
    title: 'Become a Partner',
    body: 'Get in touch to set up your partner account and complete the applicable partner agreement.',
  },
  {
    n: '02',
    title: 'Submit a Deal',
    body: 'Send the completed application and required business bank statements.',
  },
  {
    n: '03',
    title: 'Review & Offer',
    body: 'Your relationship manager coordinates the review and communicates available funding options.',
  },
  {
    n: '04',
    title: 'Funding & Commission',
    body: 'Once the merchant completes the required documents and the transaction is funded, applicable partner commissions are processed according to the partner agreement.',
  },
]

const FAQS = [
  {
    q: 'Who can partner with GLD Funding?',
    a: 'Independent sales organizations, brokers, accountants, equipment vendors, POS resellers, and anyone who advises small business owners on capital. We work with both established ISOs and individuals building a book.',
  },
  {
    q: 'How quickly do submissions get a decision?',
    a: 'Complete submissions are turned around quickly. A dedicated relationship manager handles your files rather than a general queue.',
  },
  {
    q: 'What do you need from a submission?',
    a: 'A signed application and four months of business bank statements. Additional documentation may be requested depending on the file.',
  },
  {
    q: 'What deal sizes do you fund?',
    a: `${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)}, across most industries. Renewals and existing funding positions are reviewed case by case.`,
  },
]

export function Component() {
  return (
    <>
      <Seo
        path="/partners"
        title="ISO & Broker Partnerships"
        description={`Partner with GLD Funding. Fast decisions, deal sizes from ${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)}, and a dedicated relationship manager on every file.`}
        schema={[breadcrumbSchema(TRAIL), faqSchema(FAQS)]}
      />

      <PageHero
        trail={TRAIL}
        eyebrow="Partners & ISOs"
        title="Bring us your merchants. We'll get them funded."
        lead="GLD Funding works with ISOs, brokers and advisors who need a responsive funding partner, straightforward communication, and dedicated support."
      />

      <Section tone="white">
        <div className="max-w-[68ch]">
          <AnswerBlock>
          GLD Funding partners with independent sales organizations, brokers and advisors serving small businesses. We offer funding from $10,000 to $500,000, responsive deal review, and a dedicated relationship manager for every partner.
          </AnswerBlock>
        </div>

        <div className="mt-10 border border-rule">
          <FeatureGrid cols={4}>
            <FeatureCard icon={<LightningIcon size={24} weight="light" />} title="Fast decisions">
              Complete submissions receive a prompt response from a dedicated contact.
            </FeatureCard>
            <FeatureCard icon={<UsersThreeIcon size={24} weight="light" />} title="A real person">
              A dedicated relationship manager who knows your book, not a shared inbox.
            </FeatureCard>
            <FeatureCard icon={<TrendUpIcon size={24} weight="light" />} title="Competitive buy rates">
              Competitive pricing, clear deal terms, and renewal opportunities.
            </FeatureCard>
            <FeatureCard icon={<HandshakeIcon size={24} weight="light" />} title="Merchants treated well">
              Professional communication and clear deal terms help protect the partner relationship.
            </FeatureCard>
          </FeatureGrid>
        </div>
      </Section>

      <HowItWorksTimeline
        steps={PARTNER_STEPS}
        title="Four steps, from partnership to commission."
        lead="Submit complete files and your relationship manager keeps each deal moving from review to funding."
        ambientSeed="partners-how-it-works"
      />

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Prose>
            <h2>Why partner with us</h2>
            <p>
            GLD Funding values long-term partner relationships. We work with ISOs, brokers and other business advisors to evaluate funding opportunities, communicate clearly throughout the process, and provide merchants with funding options based on their business performance and underwriting.
            </p>

            <h2>What we look for</h2>
            <ul>
              <li>Complete submissions, including a signed application and required bank statements</li>
              <li>Merchants that meet GLD&apos;s current minimum revenue and time-in-business requirements</li>
              <li>Existing funding positions disclosed at submission</li>
              <li>Clear and accurate communication with merchants regarding proposed terms and remittances</li>
            </ul>
          </Prose>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead eyebrow="Get started" title="Tell us about your book." />
            <div className="mt-6">
              <PartnerForm />
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
