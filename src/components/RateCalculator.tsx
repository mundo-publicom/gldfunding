import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, InfoIcon } from '@phosphor-icons/react'
import { CTA, PRODUCT, currency } from '../data/site'

/**
 * Estimate the cost of an advance.
 *
 * Deliberately shows total dollar cost first, not a rate - that is the number
 * a business owner actually has to repay, and leading with it is the honest
 * presentation the disclosure regimes are driving the whole category toward.
 *
 * ⚠️ Factor-rate curve below is illustrative. Replace with GLD's real pricing
 * grid before launch; every figure is derived from PRODUCT in data/site.ts.
 */

const AMOUNT_STEPS = [10_000, 15_000, 25_000, 35_000, 50_000, 75_000, 100_000, 150_000, 200_000, 300_000, 500_000]
const TERM_STEPS = [3, 4, 6, 9, 12, 15, 18]

/** Shorter terms price tighter; larger advances price tighter. Illustrative. */
function factorRate(amount: number, months: number): number {
  const { factorRateMin, factorRateMax } = PRODUCT
  const termWeight = (months - PRODUCT.termMinMonths) / (PRODUCT.termMaxMonths - PRODUCT.termMinMonths)
  const sizeWeight =
    1 - (Math.log(amount / PRODUCT.advanceMin) / Math.log(PRODUCT.advanceMax / PRODUCT.advanceMin))
  const blend = termWeight * 0.68 + sizeWeight * 0.32
  return factorRateMin + (factorRateMax - factorRateMin) * blend
}

/** Count a value up to its target - draws the eye to a number that just changed. */
function useCountUp(target: number, duration = 280) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setValue(target)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fromRef.current = target
      setValue(target)
      return
    }

    const from = fromRef.current
    const start = performance.now()
    cancelAnimationFrame(rafRef.current)

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      // Strong ease-out: the user sees movement immediately.
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(from + (target - from) * eased)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = target
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

export function RateCalculator({ compact = false }: { compact?: boolean }) {
  const [amountIdx, setAmountIdx] = useState(4) // $50,000
  const [termIdx, setTermIdx] = useState(3) // 9 months

  const amount = AMOUNT_STEPS[amountIdx]
  const months = TERM_STEPS[termIdx]

  const { total, cost, weekly, daily } = useMemo(() => {
    const r = factorRate(amount, months)
    const t = amount * r
    const weeks = months * 4.345
    return {
      total: t,
      cost: t - amount,
      weekly: t / weeks,
      daily: t / (months * 21.7), // ~21.7 business days per month
    }
  }, [amount, months])

  const animTotal = useCountUp(total)
  const animCost = useCountUp(cost)
  const animWeekly = useCountUp(weekly)
  const animDaily = useCountUp(daily)

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-rule bg-paper px-6 py-5">
        <p className="eyebrow">Estimate your advance</p>
        <h3 className="mt-2 text-h3 font-semibold text-ink">
          What would this actually cost me?
        </h3>
        {!compact && (
          <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-2">
            Move the sliders to model a real advance. No email, no credit pull, nothing saved.
          </p>
        )}
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
        <div className="flex flex-col gap-7 p-6 lg:border-r lg:border-rule">
          <Slider
            label="Advance amount"
            value={currency(amount)}
            min={0}
            max={AMOUNT_STEPS.length - 1}
            step={1}
            current={amountIdx}
            onChange={setAmountIdx}
            minLabel={currency(PRODUCT.advanceMin)}
            maxLabel={currency(PRODUCT.advanceMax)}
          />
          <Slider
            label="Repayment term"
            value={`${months} months`}
            min={0}
            max={TERM_STEPS.length - 1}
            step={1}
            current={termIdx}
            onChange={setTermIdx}
            minLabel={`${PRODUCT.termMinMonths} mo`}
            maxLabel={`${PRODUCT.termMaxMonths} mo`}
          />
        </div>

        <div className="flex flex-col justify-between gap-6 bg-petrol p-6 text-paper">
          <div>
            {/* Total repayment leads. It is the number that actually matters. */}
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-leaf-glow">
              Total repayment
            </p>
            <p className="mt-2 font-mono text-[clamp(2rem,4.5vw,2.75rem)] font-medium tabular-nums leading-none tracking-[-0.03em] text-white">
              {currency(Math.round(animTotal))}
            </p>

            <dl className="mt-6 flex flex-col divide-y divide-white/10 border-t border-white/10">
              <Row label="Cost of capital" value={currency(Math.round(animCost))} />
              <Row label="Weekly remittance" value={currency(Math.round(animWeekly))} />
              <Row label="Daily remittance" value={currency(Math.round(animDaily))} sub="business days" />
            </dl>
          </div>

          <div>
            <Link to={CTA.primaryHref} className="btn btn-primary-invert group w-full">
              {CTA.primary}
              <ArrowRightIcon
                size={15}
                weight="bold"
                className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
              />
            </Link>
            <p className="mt-3 flex gap-2 text-[0.75rem] leading-relaxed text-paper/70">
              <InfoIcon size={14} className="mt-px shrink-0" />
              <span>
                An estimate, not an offer. Your actual terms depend on underwriting. Every offer
                comes with a written disclosure of total cost.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-[0.875rem] text-paper/75">
        {label}
        {sub && <span className="ml-1.5 text-[0.75rem] text-paper/65">{sub}</span>}
      </dt>
      <dd className="font-mono text-[1.0625rem] font-medium tabular-nums text-white">{value}</dd>
    </div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
  minLabel,
  maxLabel,
}: {
  label: string
  value: string
  min: number
  max: number
  step: number
  current: number
  onChange: (v: number) => void
  minLabel: string
  maxLabel: string
}) {
  const pct = ((current - min) / (max - min)) * 100
  const id = `slider-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[0.875rem] font-medium text-ink">
          {label}
        </label>
        <span className="font-mono text-[1.125rem] font-medium tabular-nums tracking-[-0.02em] text-ink">
          {value}
        </span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full cursor-pointer appearance-none bg-transparent
          [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full
          [&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:bg-leaf-deep [&::-webkit-slider-thumb]:shadow-lift
          [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-100
          active:[&::-webkit-slider-thumb]:scale-95
          [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full
          [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white
          [&::-moz-range-thumb]:bg-leaf-deep"
        style={{
          // Filled track to the thumb, neutral after it.
          ['--pct' as string]: `${pct}%`,
          background: 'transparent',
        }}
        onInput={(e) => {
          const el = e.currentTarget
          const p = ((Number(el.value) - min) / (max - min)) * 100
          el.style.setProperty('--pct', `${p}%`)
        }}
      />
      <style>{`
        #${id}::-webkit-slider-runnable-track {
          background: linear-gradient(to right, var(--color-leaf-deep) var(--pct, ${pct}%), var(--color-rule) var(--pct, ${pct}%));
        }
        #${id}::-moz-range-track {
          background: linear-gradient(to right, var(--color-leaf-deep) var(--pct, ${pct}%), var(--color-rule) var(--pct, ${pct}%));
        }
      `}</style>

      <div className="mt-2 flex justify-between font-mono text-[0.6875rem] tabular-nums text-ink-3">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}
