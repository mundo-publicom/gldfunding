import { Link } from 'react-router-dom'
import { AnswerBlock, PageHero, Section, SectionHead, Stat, StatRow } from '../components/ui'
import { Testimonials } from '../sections/Testimonials'
import { Seo, breadcrumbSchema, localBusinessSchema, orgSchema } from '../lib/seo'
import { CTA, PRODUCT, SITE, currency } from '../data/site'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
]

/* Three principles, not a manifesto. The long-form Why We Exist / How We
   Underwrite / What We Won't Do sections were consolidated into these. */
const APPROACH = [
  {
    title: 'Fast',
    body: 'A streamlined application, a quick decision once your file is complete, and same-day funding available on signed contracts.',
  },
  {
    title: 'Transparent',
    body: 'Every offer comes with a written disclosure of the total dollar cost, the remittance amount and frequency, and the term - before you sign.',
  },
  {
    title: 'Business-focused',
    body: 'We underwrite the business, reading performance and cash flow rather than judging the owner by a credit score alone.',
  },
]

export function Component() {
  const years = new Date().getFullYear() - SITE.founded

  return (
    <>
      <Seo
        path="/about"
        title="About GLD Factoring LLC DBA GLD Funding"
        description={`GLD Factoring LLC DBA GLD Funding has provided merchant cash advances to small businesses since ${SITE.founded}, from offices in Garden City, New York. Advances from ${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)}, underwritten on business performance and cash flow.`}
        schema={[breadcrumbSchema(TRAIL), orgSchema(), localBusinessSchema()]}
      />

      <PageHero
        trail={TRAIL}
        eyebrow="About us"
        title="Funding solutions that are easier, faster and smarter"
        lead={`${years}+ years of putting working capital into the hands of small business owners.`}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            {/* Who we are - one paragraph, no history lesson. */}
            <AnswerBlock>
              GLD Factoring LLC DBA GLD Funding is a merchant cash advance provider headquartered in Garden City, New
              York, serving small businesses across the United States since {SITE.founded}. We
              purchase future receivables to provide working capital of{' '}
              {currency(PRODUCT.advanceMin)} to {currency(PRODUCT.advanceMax)}, underwritten
              primarily on business performance and cash flow.
            </AnswerBlock>

            <p className="mt-8 max-w-[64ch] text-[1.0625rem] leading-[1.7] text-ink-2">
              We work with the owners who keep neighbourhoods running - the restaurant on the
              corner, the shop that has been there thirty years, the contractor everyone calls. Our
              job is to look at what a business actually does, structure funding around it, and get
              an answer back quickly enough to be useful.
            </p>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6">
              <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
                Our experience
              </h2>
              <dl className="mt-5 flex flex-col divide-y divide-rule-soft">
                {[
                  ['Legal name', SITE.legalName],
                  ['Operating as', SITE.name],
                  ['Serving businesses since', String(SITE.founded)],
                  ['Headquarters', `${SITE.address.locality}, ${SITE.address.region}`],
                  [
                    'Advance range',
                    `${currency(PRODUCT.advanceMin)} – ${currency(PRODUCT.advanceMax)}`,
                  ],
                  ['Area served', 'United States'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="text-[0.875rem] text-ink-3">{k}</dt>
                    <dd className="text-right text-[0.875rem] font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link to={CTA.primaryHref} className="btn btn-primary mt-6 w-full">
                {CTA.primary}
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="petrol">
        <SectionHead invert eyebrow="Our approach" title="Three principles we work to." />
        <div className="mt-10 grid gap-px border border-white/10 bg-white/10 lg:grid-cols-3">
          {APPROACH.map((p) => (
            <div key={p.title} className="bg-petrol p-6 lg:p-8">
              <h3 className="text-h3 font-semibold text-white">{p.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-paper/80">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <StatRow invert>
            <Stat invert value={`${years}+`} label="Years funding" sub={`Since ${SITE.founded}`} />
            <Stat invert value="Same day" label="Funding available" sub="On signed contracts" />
            <Stat invert value="4 months" label="Bank statements" sub="All that is needed to apply" />
            <Stat invert value="50" label="States served" sub="Nationwide" />
          </StatRow>
        </div>
      </Section>

      {/* Our team. Real people, reachable - no invented bios or headcounts. */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead
              eyebrow="Our team"
              title="Garden City, New York."
              lead="An experienced funding team that stays with your file from application through funding. When you call, you reach a person who already knows your business."
            />
            <address className="mt-8 not-italic text-[1.0625rem] leading-relaxed text-ink-2">
              {SITE.address.street}
              <br />
              {SITE.address.locality}, {SITE.address.region} {SITE.address.postalCode}
            </address>
            <dl className="mt-6 flex flex-col gap-2.5 text-[0.9375rem]">
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 text-ink-3">Phone</dt>
                <dd>
                  <a href={SITE.phoneHref} className="font-mono tabular-nums text-leaf-deep">
                    {SITE.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 text-ink-3">Fax</dt>
                <dd className="font-mono tabular-nums text-ink-2">{SITE.fax}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 text-ink-3">Email</dt>
                <dd>
                  <a href={`mailto:${SITE.email}`} className="text-leaf-deep">
                    {SITE.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col justify-center border-l-[3px] border-leaf bg-paper p-7">
            <h2 className="text-h3 font-semibold text-ink">Prefer to talk it through?</h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
              Call and tell us what you're trying to do. We'll tell you quickly whether an advance
              is the right tool for it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={SITE.phoneHref} className="btn btn-primary">
                Call {SITE.phone}
              </a>
              <Link to="/contact" className="btn btn-secondary">
                Send a message
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Testimonials />

      <Section tone="paper">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-ink">Ready to get started?</h2>
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

Component.displayName = 'About'
