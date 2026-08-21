import { useMemo, useState } from 'react'
import { ArrowRightIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { SelectInput } from './fields'
import type { ApplicationData } from './types'
import { INDUSTRIES, PRODUCT, SITE, currency } from '../data/site'

/**
 * Pre-check — three questions, no personally identifying information.
 *
 * Two jobs: filter unqualified traffic before it reaches an underwriter, and
 * give qualified traffic a concrete reason to start seven steps. Nothing here
 * is stored against a person, and nothing is a credit pull.
 */

const REVENUE_BANDS = [
  { value: 'under-15k', label: 'Under $15,000', mid: 10_000 },
  { value: '15-30k', label: '$15,000 – $30,000', mid: 22_500 },
  { value: '30-60k', label: '$30,000 – $60,000', mid: 45_000 },
  { value: '60-100k', label: '$60,000 – $100,000', mid: 80_000 },
  { value: '100-250k', label: '$100,000 – $250,000', mid: 175_000 },
  { value: 'over-250k', label: 'Over $250,000', mid: 350_000 },
]

const TIME_BANDS = [
  { value: 'under-6m', label: 'Less than 6 months' },
  { value: '6-12m', label: '6 – 12 months' },
  { value: '1-3y', label: '1 – 3 years' },
  { value: '3-10y', label: '3 – 10 years' },
  { value: 'over-10y', label: 'More than 10 years' },
]

export function Precheck({
  data,
  update,
  onContinue,
}: {
  data: ApplicationData
  update: <K extends keyof ApplicationData>(key: K, value: ApplicationData[K]) => void
  onContinue: () => void
}) {
  const [touched, setTouched] = useState(false)
  const p = data.precheck

  const set = (k: keyof ApplicationData['precheck'], v: string) =>
    update('precheck', { ...p, [k]: v })

  const complete = Boolean(p.monthlyRevenue && p.timeInBusiness && p.industry)

  const result = useMemo(() => {
    if (!complete) return null

    const band = REVENUE_BANDS.find((b) => b.value === p.monthlyRevenue)
    const tooSmall = p.monthlyRevenue === 'under-15k'
    const tooNew = p.timeInBusiness === 'under-6m'

    if (tooSmall || tooNew) {
      return {
        ok: false as const,
        reason: tooSmall
          ? `Most approvals start around ${currency(PRODUCT.minMonthlyRevenue)} in monthly revenue.`
          : `Most approvals need at least ${PRODUCT.minMonthsInBusiness} months of trading history.`,
      }
    }

    // Indicative only — roughly one month of revenue, bounded by the product range.
    const mid = band?.mid ?? 30_000
    const low = Math.max(PRODUCT.advanceMin, Math.round((mid * 0.6) / 5000) * 5000)
    const high = Math.min(PRODUCT.advanceMax, Math.round((mid * 1.4) / 5000) * 5000)

    return { ok: true as const, low, high }
  }, [complete, p.monthlyRevenue, p.timeInBusiness])

  return (
    <div className="max-w-xl">
      <div className="flex flex-col gap-6">
        <SelectInput
          label="What's your average monthly revenue?"
          required
          value={p.monthlyRevenue}
          onChange={(v) => set('monthlyRevenue', v)}
          options={REVENUE_BANDS.map(({ value, label }) => ({ value, label }))}
          error={touched && !p.monthlyRevenue ? 'Pick a range to continue' : undefined}
        />
        <SelectInput
          label="How long have you been in business?"
          required
          value={p.timeInBusiness}
          onChange={(v) => set('timeInBusiness', v)}
          options={TIME_BANDS}
          error={touched && !p.timeInBusiness ? 'Pick a range to continue' : undefined}
        />
        <SelectInput
          label="What industry are you in?"
          required
          value={p.industry}
          onChange={(v) => set('industry', v)}
          options={[
            ...INDUSTRIES.map((i) => ({ value: i.slug, label: i.name })),
            { value: 'professional-services', label: 'Professional services' },
            { value: 'other', label: 'Other' },
          ]}
          error={touched && !p.industry ? 'Pick an industry to continue' : undefined}
        />
      </div>

      {result?.ok && (
        <div className="mt-8 border-l-[3px] border-leaf bg-paper p-5 motion-safe:animate-[resultIn_320ms_cubic-bezier(0.23,1,0.32,1)]">
          <p className="eyebrow">Indicative range</p>
          <p className="mt-2.5 font-mono text-[clamp(1.5rem,3.4vw,2rem)] font-medium tabular-nums leading-none tracking-[-0.03em] text-ink">
            {currency(result.low)} – {currency(result.high)}
          </p>
          <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-2">
            Businesses like yours typically qualify for this range. It is an estimate based on
            revenue alone — your actual offer depends on underwriting your bank statements.
          </p>
        </div>
      )}

      {result && !result.ok && (
        <div className="mt-8 flex items-start gap-3 border-l-[3px] border-rate bg-rate-bg p-5">
          <WarningCircleIcon size={19} weight="fill" className="mt-0.5 shrink-0 text-rate" />
          <div>
            <p className="text-[0.9375rem] font-semibold text-ink">
              You may not qualify just yet
            </p>
            <p className="mt-1.5 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-2">
              {result.reason} You are welcome to apply anyway — underwriting looks at the whole
              picture — or call us and we'll tell you straight away whether it's worth your time.
            </p>
            <a
              href={SITE.phoneHref}
              className="mt-3 inline-block font-medium text-leaf-deep underline underline-offset-[3px]"
            >
              {SITE.phone}
            </a>
          </div>
        </div>
      )}

      <div className="mt-9">
        <button
          type="button"
          onClick={() => {
            setTouched(true)
            if (!complete) return
            update('precheck', { ...p, completed: true })
            onContinue()
          }}
          className="btn btn-primary btn-lg group"
        >
          {result?.ok ? 'Continue to application' : 'Start application'}
          <ArrowRightIcon
            size={16}
            weight="bold"
            className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
          />
        </button>
        <p className="mt-3.5 text-[0.8125rem] text-ink-3">
          A few short steps from here. No credit pull at any point in the application.
        </p>
      </div>

      <style>{`
        @keyframes resultIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  )
}
