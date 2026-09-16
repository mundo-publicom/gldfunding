import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { CTA } from '../data/site'
import { cn } from '../lib/cn'

/**
 * Replaces the funding calculator.
 *
 * The calculator published a price before underwriting had seen a file, which
 * is the thing we are no longer willing to imply. This asks the one question
 * that qualifies a lead instead, and hands the answer to the application so
 * the applicant does not have to type it twice.
 */

const AMOUNT_OPTIONS = [
  { label: '$10K', value: '$10,000' },
  { label: '$25K', value: '$25,000' },
  { label: '$50K', value: '$50,000' },
  { label: '$100K', value: '$100,000' },
  { label: '$250K+', value: '$250,000+' },
] as const

export function EligibilityCta({
  invert = false,
  className,
}: {
  /** Petrol/deep grounds. */
  invert?: boolean
  className?: string
}) {
  const [amount, setAmount] = useState<string | null>(null)
  const navigate = useNavigate()

  const go = () =>
    navigate(amount ? `${CTA.primaryHref}?amount=${encodeURIComponent(amount)}` : CTA.primaryHref)

  return (
    <div
      className={cn(
        'border p-6 lg:p-8',
        invert ? 'border-white/12 bg-white/[0.04]' : 'border-rule bg-white',
        className,
      )}
    >
      <h2 className={cn('text-h3 font-semibold', invert ? 'text-white' : 'text-ink')}>
        See what your business may qualify for
      </h2>

      <fieldset className="mt-7 border-0 p-0">
        <legend
          className={cn(
            'text-[0.9375rem] font-medium',
            invert ? 'text-paper/85' : 'text-ink-2',
          )}
        >
          How much funding are you looking for?
        </legend>

        {/* Radios, not buttons - the selection is a form answer, and this is
            what gives arrow-key movement and a real focus ring for free. */}
        <div className="mt-4 flex flex-wrap gap-2">
          {AMOUNT_OPTIONS.map((opt) => {
            const on = amount === opt.value
            return (
              <label
                key={opt.value}
                className={cn(
                  'cursor-pointer rounded-full border px-4 py-2.5 font-mono text-[0.875rem] font-medium tabular-nums transition-colors duration-150',
                  'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-leaf',
                  on
                    ? invert
                      ? 'border-leaf-glow bg-leaf-glow text-petrol'
                      : 'border-leaf-deep bg-leaf-deep text-white'
                    : invert
                      ? 'border-white/20 text-paper/80 hover:border-leaf-glow hover:text-white'
                      : 'border-rule text-ink-2 hover:border-leaf hover:text-ink',
                )}
              >
                <input
                  type="radio"
                  name="eligibility-amount"
                  value={opt.value}
                  checked={on}
                  onChange={() => setAmount(opt.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            )
          })}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={go}
        className={cn('btn btn-lg group mt-7 w-full sm:w-auto', invert ? 'btn-primary-invert' : 'btn-primary')}
      >
        {CTA.primary}
        <ArrowRightIcon
          size={16}
          weight="bold"
          className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
        />
      </button>

      <p className={cn('mt-3.5 text-[0.8125rem]', invert ? 'text-paper/60' : 'text-ink-3')}>
        Answer a few simple questions to get started. No credit inquiry during the eligibility check.
      </p>
    </div>
  )
}
