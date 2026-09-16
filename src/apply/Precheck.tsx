import { useState } from 'react'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { SelectInput } from './fields'
import type { ApplicationData } from './types'
import { INDUSTRIES } from '../data/site'

/**
 * Pre-check - a few short questions, no personally identifying information.
 *
 * Collects three facts so the application can start. It does not approve,
 * decline, or quote a range. Credit and background information may be
 * obtained only after a full application is submitted with authorization.
 */

const REVENUE_BANDS = [
  { value: 'under-15k', label: 'Under $15,000' },
  { value: '15-30k', label: '$15,000 – $30,000' },
  { value: '30-60k', label: '$30,000 – $60,000' },
  { value: '60-100k', label: '$60,000 – $100,000' },
  { value: '100-250k', label: '$100,000 – $250,000' },
  { value: 'over-250k', label: 'Over $250,000' },
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

  return (
    <div className="max-w-xl">
      <div className="flex flex-col gap-6">
        <SelectInput
          label="What's your average monthly revenue?"
          required
          value={p.monthlyRevenue}
          onChange={(v) => set('monthlyRevenue', v)}
          options={REVENUE_BANDS}
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

      <div className="mt-9">
        <button
          type="button"
          onClick={() => {
            setTouched(true)
            if (!complete) return
            update('precheck', { ...p, completed: true })
            if (!data.business.industry && p.industry) {
              update('business', { ...data.business, industry: p.industry })
            }
            onContinue()
          }}
          className="btn btn-primary btn-lg group min-h-12 w-full sm:w-auto"
        >
          Start Application
          <ArrowRightIcon
            size={16}
            weight="bold"
            className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
          />
        </button>
        <p className="mt-3.5 max-w-[54ch] text-[0.8125rem] leading-relaxed text-ink-3">
          No credit inquiry during the eligibility check. Credit and background information may be
          obtained after you submit a full application and provide authorization.
        </p>
      </div>
    </div>
  )
}
