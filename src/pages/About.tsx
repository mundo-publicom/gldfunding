import { Link } from 'react-router-dom'
import { AnswerBlock, PageHero, Prose, Section, SectionHead, Stat, StatRow } from '../components/ui'
import { Testimonials } from '../sections/Testimonials'
import { Seo, breadcrumbSchema, localBusinessSchema, orgSchema } from '../lib/seo'
import { CTA, PRODUCT, SITE, currency } from '../data/site'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
]

const PRINCIPLES = [
  {
    title: 'Not rocket science',
    body: 'Minimal paperwork, no collateral, and no credit-score gate. Three months of bank statements is genuinely all we need to make a decision.',
  },
  {
    title: 'Solutions, not products',
    body: 'Offers are built backwards from what your account can carry, not forwards from what you asked for. Sometimes that means a smaller advance than you wanted.',
  },
  {
    title: 'Someone picks up',
    body: 'A named underwriter walks you through the terms. If revenue drops mid-term, you call a person who already knows your file.',
  },
]

export function Component() {
  const years = new Date().getFullYear() - SITE.founded

  return (
    <>
      <Seo
        path="/about"
        title="About GLD Funding"
        description={`GLD Funding has provided merchant cash advances to small businesses since ${SITE.founded}, from offices in Garden City, New York. Advances from ${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)}, underwritten on deposit history.`}
        schema={[breadcrumbSchema(TRAIL), orgSchema(), localBusinessSchema()]}
      />

      <PageHero
        trail={TRAIL}
        eyebrow="About us"
        title="Funding solutions that are easier, faster and smarter"
        lead={`${years} years of putting working capital into the hands of small business owners the banks stopped serving.`}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <AnswerBlock>
              GLD Funding is a merchant cash advance provider headquartered in Garden City, New
              York, serving small businesses across the United States since {SITE.founded}. We
              purchase future receivables to provide working capital of{' '}
              {currency(PRODUCT.advanceMin)} to {currency(PRODUCT.advanceMax)}, underwritten on
              business deposit history rather than credit score.
            </AnswerBlock>

            <Prose className="mt-8">
              <h2>Why we exist</h2>
              <p>
                Over the past two decades banks have steadily tightened lending criteria. The
                businesses that hold neighbourhoods together — the restaurant on the corner, the
                shop that has been there thirty years, the contractor everyone calls — kept meeting
                the same answer: strong revenue, wrong credit file.
              </p>
              <p>
                We built GLD Funding for those owners. Not as a lender, but as a funder that reads
                what a business actually does rather than what a scoring model says about its owner.
                Small businesses are what make the economy work. Without them, there is no us.
              </p>

              <h2>How we underwrite</h2>
              <p>
                Bank statements, not credit scores. We look at how much comes in, how consistently,
                what balance the account holds, and how many days it goes negative. That tells us
                what remittance a business can genuinely carry — which is the only question that
                matters.
              </p>
              <p>
                It also means the answer arrives fast. Most applicants hear back within{' '}
                {PRODUCT.decisionHours} business hours, and funds land within{' '}
                {PRODUCT.fundingHours} hours of signing.
              </p>

              <h2>What we will not do</h2>
              <p>
                We will not fund a business into a hole. If your statements say an advance would
                make the pressure worse rather than better, we say so — and we would rather lose the
                deal than write it. If a bank line or SBA loan is genuinely available to you,{' '}
                <Link to="/funding/mca-vs-business-loan">take it</Link>. It is cheaper, and we will
                tell you that too.
              </p>

              <h2>Transparency as policy</h2>
              <p>
                Every offer comes with a written disclosure of total dollar cost, the remittance
                amount and frequency, and the term — in every state, whether or not the law requires
                it. <Link to="/funding/cost">Our pricing is published</Link> before you talk to
                anyone.
              </p>
            </Prose>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6">
              <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
                At a glance
              </h2>
              <dl className="mt-5 flex flex-col divide-y divide-rule-soft">
                {[
                  ['Founded', String(SITE.founded)],
                  ['Headquarters', `${SITE.address.locality}, ${SITE.address.region}`],
                  ['Advance range', `${currency(PRODUCT.advanceMin)} – ${currency(PRODUCT.advanceMax)}`],
                  ['Typical decision', `${PRODUCT.decisionHours} business hours`],
                  ['Typical funding', `${PRODUCT.fundingHours} hours`],
                  ['Credit minimum', 'None'],
                  ['Collateral', 'None'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="text-[0.875rem] text-ink-3">{k}</dt>
                    <dd className="text-right font-mono text-[0.875rem] font-medium tabular-nums text-ink">
                      {v}
                    </dd>
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
        <SectionHead invert eyebrow="How we work" title="Three things we hold to." />
        <div className="mt-10 grid gap-px border border-white/10 bg-white/10 lg:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="bg-petrol p-6 lg:p-8">
              <h3 className="text-h3 font-semibold text-white">{p.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-paper/80">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <StatRow invert>
            <Stat invert value={`${years}+`} label="Years funding" sub={`Since ${SITE.founded}`} />
            <Stat invert value={`${PRODUCT.decisionHours}h`} label="Typical decision" sub="From complete statements" />
            <Stat invert value={`${PRODUCT.fundingHours}h`} label="To funded" sub="After a signed contract" />
            <Stat invert value="0" label="Credit score minimum" sub="Deposit history instead" />
          </StatRow>
        </div>
      </Section>

      <Testimonials />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead eyebrow="Find us" title="Garden City, New York." />
            <address className="mt-6 not-italic text-[1.0625rem] leading-relaxed text-ink-2">
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
              Call and tell us what you're trying to do. If an advance is the wrong tool, we'll say
              so in five minutes rather than take an application that was never going to work.
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
    </>
  )
}

Component.displayName = 'About'
