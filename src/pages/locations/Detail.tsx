import { Link, useParams } from 'react-router-dom'
import { InfoIcon, ScalesIcon } from '@phosphor-icons/react'
import {
  AnswerBlock,
  FaqList,
  PageHero,
  Prose,
  Section,
  SectionHead,
} from '../../components/ui'
import { RateCalculator } from '../../components/RateCalculator'
import { Seo, breadcrumbSchema, faqSchema, localBusinessSchema } from '../../lib/seo'
import { CTA, INDUSTRIES, PRODUCT, SITE, STATES, TESTIMONIALS, currency } from '../../data/site'
import { NotFoundBody } from '../NotFound'
import { cn } from '../../lib/cn'

const DISCLOSURE_LABEL = {
  'in-force': 'Disclosure law in force',
  enacted: 'Disclosure law enacted',
  none: 'No state disclosure statute',
} as const

export function Component() {
  const { slug } = useParams<{ slug: string }>()
  const state = STATES.find((s) => s.slug === slug)

  if (!state) return <NotFoundBody />

  const isNY = state.abbr === 'NY'
  const months = isNY ? PRODUCT.statementMonths.NY : PRODUCT.statementMonths.default
  const local = TESTIMONIALS.filter((t) => t.location === state.name)

  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Locations', path: '/locations' },
    { name: state.name, path: `/locations/${state.slug}` },
  ]

  const faqs = [
    {
      q: `Are merchant cash advances legal in ${state.name}?`,
      a:
        state.disclosure === 'none'
          ? `Yes. Merchant cash advances are legal commercial transactions in ${state.name}. The state has no dedicated commercial financing disclosure statute, but GLD Funding provides a written disclosure of total dollar cost and terms on every offer regardless.`
          : `Yes. Merchant cash advances are legal in ${state.name}, and the state regulates how they must be disclosed. ${state.note}`,
    },
    {
      q: `How many bank statements do ${state.name} businesses need?`,
      a: isNY
        ? `New York businesses provide four months of business bank statements, one more than our standard three. That is all that is required to submit an application.`
        : `${state.name} businesses provide three months of business bank statements. That is all that is required to submit an application — anything further is requested only if underwriting needs it.`,
    },
    {
      q: `How much can a ${state.name} business get?`,
      a: `Advances range from ${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)}, typically sized around one month of revenue. Approval requires ${currency(PRODUCT.minMonthlyRevenue)} in average monthly deposits and ${PRODUCT.minMonthsInBusiness} months in business.`,
    },
    {
      q: `How fast can a ${state.name} business get funded?`,
      a: `Decisions typically come within ${PRODUCT.decisionHours} business hours, and funds arrive within ${PRODUCT.fundingHours} hours of a signed contract — same day on contracts signed before 2pm ET.`,
    },
  ]

  return (
    <>
      <Seo
        path={`/locations/${state.slug}`}
        title={`Merchant Cash Advance in ${state.name}`}
        description={`Working capital of ${currency(PRODUCT.advanceMin)}–${currency(PRODUCT.advanceMax)} for ${state.name} businesses. ${months} months of bank statements, decisions in ${PRODUCT.decisionHours} hours, and a written cost disclosure on every offer.`}
        schema={[
          breadcrumbSchema(trail),
          faqSchema(faqs),
          ...(isNY ? [localBusinessSchema()] : []),
        ]}
      />

      <PageHero
        trail={trail}
        eyebrow={`${state.name} · Small business funding`}
        title={`Merchant cash advances in ${state.name}`}
        lead={`Advances from ${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)} for ${state.name} businesses, underwritten on deposit history rather than credit score.`}
      >
        <div className="flex flex-wrap gap-3">
          <Link to={CTA.primaryHref} className="btn btn-primary">
            {CTA.primary}
          </Link>
          <a href={SITE.phoneHref} className="btn btn-secondary">
            {SITE.phone}
          </a>
        </div>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <AnswerBlock>
              GLD Funding provides merchant cash advances to {state.name} businesses from{' '}
              {currency(PRODUCT.advanceMin)} to {currency(PRODUCT.advanceMax)}. {state.name}{' '}
              applicants submit {months} months of business bank statements, receive a decision in
              about {PRODUCT.decisionHours} business hours, and are funded within{' '}
              {PRODUCT.fundingHours} hours of signing.
            </AnswerBlock>

            {/* The substantive part: what actually differs by state. */}
            <div
              className={cn(
                'mt-10 border-l-[3px] p-5',
                state.disclosure === 'in-force'
                  ? 'border-leaf bg-paper'
                  : state.disclosure === 'enacted'
                    ? 'border-warn bg-paper'
                    : 'border-rule bg-paper',
              )}
            >
              <p className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
                <ScalesIcon size={14} />
                {DISCLOSURE_LABEL[state.disclosure]}
              </p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{state.note}</p>
            </div>

            <Prose className="mt-10">
              {isNY && (
                <>
                  <h2>What New York's disclosure law means for you</h2>
                  <p>
                    New York's Commercial Finance Disclosure Law applies to commercial financing
                    under $2.5 million and requires a standardized disclosure before you sign.
                    Headed <strong>OFFER SUMMARY</strong> in bold at the top, it must state the
                    total dollar cost of the financing, an annualized percentage rate comparable to
                    an APR, and the repayment term. It is enforced by the New York Department of
                    Financial Services.
                  </p>
                  <p>
                    In practice this is a genuinely useful document: it reduces any offer to
                    comparable numbers. Ask for it from every funder you speak to, not just us, and
                    compare the total dollar cost line by line.
                  </p>

                  <h2>Local to Garden City</h2>
                  <p>
                    Our office is at {SITE.address.street}, {SITE.address.locality},{' '}
                    {SITE.address.region} {SITE.address.postalCode} — on Long Island, serving
                    businesses across Nassau, Suffolk, Queens, Brooklyn, Manhattan, the Bronx, and
                    upstate. You are welcome to call or come in.
                  </p>
                </>
              )}

              {!isNY && state.disclosure === 'in-force' && (
                <>
                  <h2>Your right to a written disclosure in {state.name}</h2>
                  <p>
                    {state.name} requires commercial financing providers to give you a written
                    disclosure of cost and terms before you sign. That means you are entitled to see
                    the total dollar cost and repayment terms in writing — from any funder, not just
                    this one.
                  </p>
                  <p>
                    Use it. Reduce every offer you receive to the same figure: what leaves your
                    account in total, and what gets debited how often.
                  </p>
                </>
              )}

              {state.disclosure === 'none' && (
                <>
                  <h2>Disclosure in {state.name}</h2>
                  <p>
                    {state.name} has not enacted a dedicated commercial financing disclosure
                    statute, which means funders operating there are not required by state law to
                    show you a standardized cost summary.
                  </p>
                  <p>
                    GLD Funding provides one anyway. Every offer we make comes with a written
                    statement of the total dollar cost, the remittance amount and frequency, and the
                    term — because you should be able to compare offers regardless of where you
                    happen to operate.
                  </p>
                </>
              )}

              <h2>What {state.name} businesses use funding for</h2>
              <p>
                Across trades, the pattern is consistent: capital that has to arrive before the
                revenue it unlocks. Inventory ahead of a season, equipment that failed without
                warning, payroll between progress payments, a second location while the first is
                still paying for itself.
              </p>

              <h2>Applying from {state.name}</h2>
              <p>
                The application is entirely online and takes about eight minutes. You will need{' '}
                {months} months of business bank statements — or you can connect your bank read-only
                and skip the upload. <Link to="/funding/qualify">Check the full criteria</Link>{' '}
                before you start.
              </p>
            </Prose>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <RateCalculator compact />
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHead
          eyebrow={`${state.name} industries`}
          title="Trades we fund here."
        />
        <div className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((i) => (
            <Link
              key={i.slug}
              to={`/industries/${i.slug}`}
              className="bg-white p-5 transition-colors duration-150 hover:bg-paper"
            >
              <h3 className="text-[0.9375rem] font-semibold text-ink">{i.short}</h3>
              <p className="mt-1.5 font-mono text-[0.8125rem] tabular-nums text-leaf-deep">
                {i.typicalRange}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      {local.length > 0 && (
        <Section tone="white">
          <SectionHead eyebrow={`${state.name} clients`} title="Businesses we've funded here." />
          <div className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {local.slice(0, 3).map((t) => (
              <figure key={t.business} className="flex flex-col bg-white p-6">
                <blockquote className="flex-1 text-[0.9375rem] leading-relaxed text-ink-2">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 border-t border-rule-soft pt-3.5">
                  <div className="text-[0.9375rem] font-semibold text-ink">{t.business}</div>
                  <div className="mt-0.5 text-[0.8125rem] text-ink-3">
                    {t.author} · {t.industry}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      <Section tone={local.length > 0 ? 'paper' : 'white'}>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHead eyebrow="Questions" title={`Funding in ${state.name}.`} />
          <FaqList items={faqs} />
        </div>
      </Section>

      <Section tone="white">
        <div className="flex items-start gap-3 border-t border-rule pt-8 text-[0.8125rem] leading-relaxed text-ink-3">
          <InfoIcon size={15} className="mt-0.5 shrink-0" />
          <p className="max-w-[86ch]">
            Regulatory information on this page is provided for general guidance and is not legal
            advice. Commercial financing requirements change; confirm current obligations with
            qualified counsel. GLD Funding is not a bank and does not offer loans — a merchant cash
            advance is the purchase of future receivables.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-ink">
              See what your {state.name} business qualifies for.
            </h2>
            <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-ink-2">
              Three questions. No personal information, no credit pull.
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

Component.displayName = 'LocationDetail'
