import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  LockSimpleIcon,
} from '@phosphor-icons/react'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { SITE } from '../data/site'
import { cn } from '../lib/cn'
import {
  AUTH_VERSION,
  emptyApplication,
  ownerCount,
  ownersRevealed,
  requiredStatements,
  visibleSteps,
} from '../apply/types'
import type { ApplicationData, StepId } from '../apply/types'
import { BankFinancingStep, BusinessStep, OwnerStep, ReviewSignStep } from '../apply/steps'
import { Precheck } from '../apply/Precheck'
import { validateStep } from '../apply/validate'

const STORAGE_KEY = 'gld-application-v3'

type Phase = 'precheck' | 'form' | 'done'

function errorsEqual(a: Record<string, string>, b: Record<string, string>) {
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every((k) => a[k] === b[k])
}

export function Component() {
  const [data, setData] = useState<ApplicationData>(emptyApplication)
  const [phase, setPhase] = useState<Phase>('precheck')
  const [stepIndex, setStepIndex] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [direction, setDirection] = useState<1 | -1>(1)
  const [restored, setRestored] = useState(false)
  const [reference, setReference] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [returnToReview, setReturnToReview] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const submittingLock = useRef(false)

  const steps = useMemo(() => visibleSteps(data), [data])
  const step = steps[Math.min(stepIndex, steps.length - 1)]

  const [searchParams] = useSearchParams()

  /* --- restore in-progress application, then apply the requested amount ---
     Both live in one effect because order matters: restoring replaces `data`
     wholesale, so an amount applied first would be thrown away. The amount is
     the `?amount=$50,000` handed over by the eligibility CTA, and it is only
     written into an empty field - a restored draft or a typed value wins. */
  useEffect(() => {
    let next: ApplicationData | null = null
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const saved = raw
        ? (JSON.parse(raw) as { data: ApplicationData; phase: Phase; stepIndex: number })
        : null
      if (saved?.data) {
        next = {
          ...emptyApplication(),
          ...saved.data,
          documents: {
            ...emptyApplication().documents,
            ...saved.data.documents,
          },
          authorization: {
            ...emptyApplication().authorization,
            ...saved.data.authorization,
            audit: saved.data.authorization?.audit ?? null,
          },
        }
        setPhase(saved.phase === 'done' ? 'precheck' : saved.phase)
        setStepIndex(Math.min(saved.stepIndex ?? 0, steps.length - 1))
        setRestored(true)
      }
    } catch {
      /* corrupt payload - start clean rather than trapping the applicant */
    }

    const amount = searchParams.get('amount')
    setData((current) => {
      const base = next ?? current
      if (!amount || base.funding.amountRequested) return next ?? current
      return { ...base, funding: { ...base.funding, amountRequested: amount } }
    })
    // Mount only - a later query change must not reopen a half-filled draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* --- save on every change; business owners fill these in between customers --- */
  useEffect(() => {
    if (phase === 'done') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, phase, stepIndex }))
    } catch {
      /* storage full or blocked - the form still works, it just won't resume */
    }
  }, [data, phase, stepIndex])

  /* Inline errors clear as fields are fixed, rather than waiting for Continue. */
  useEffect(() => {
    if (!Object.keys(errors).length || phase !== 'form') return
    const next = validateStep(step.id, data)
    setErrors((prev) => (errorsEqual(prev, next) ? prev : next))
  }, [data, errors, phase, step.id])

  const update = useCallback(
    <K extends keyof ApplicationData>(key: K, value: ApplicationData[K]) => {
      setData((d) => ({ ...d, [key]: value }))
    },
    [],
  )

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    })
  }

  const focusFirstError = () => {
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]')
      el?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      if (el && (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA')) {
        el.focus()
      } else {
        el?.querySelector<HTMLElement>('input, select, textarea, button')?.focus()
      }
    })
  }

  const goNext = () => {
    if (step.id === 'owner') {
      const found = validateStep('owner', data)
      if (Object.keys(found).length) {
        setErrors(found)
        focusFirstError()
        return
      }
      const revealed = ownersRevealed(data)
      const needed = ownerCount(data)
      if (revealed < needed) {
        const nextShown = revealed + 1
        setData((d) => ({ ...d, ownersRevealed: nextShown }))
        setErrors({})
        requestAnimationFrame(() => {
          document
            .querySelector<HTMLElement>(`[aria-label="Owner ${nextShown}"]`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
        return
      }
    }

    const found = validateStep(step.id, data)
    if (Object.keys(found).length) {
      setErrors(found)
      focusFirstError()
      return
    }
    setErrors({})
    setDirection(1)

    if (step.id === 'review') {
      submit()
      return
    }

    if (returnToReview) {
      setReturnToReview(false)
      setStepIndex(steps.findIndex((s) => s.id === 'review'))
      scrollToTop()
      return
    }

    setStepIndex((i) => Math.min(i + 1, steps.length - 1))
    scrollToTop()
  }

  const goBack = () => {
    setErrors({})
    setDirection(-1)
    if (stepIndex === 0) setPhase('precheck')
    else setStepIndex((i) => i - 1)
    scrollToTop()
  }

  const editStep = (id: StepId) => {
    const idx = steps.findIndex((s) => s.id === id)
    if (idx < 0) return
    setStepIndex(idx)
    setReturnToReview(true)
    setDirection(-1)
    scrollToTop()
  }

  const submit = () => {
    if (submittingLock.current || submitting) return
    const found = validateStep('review', data)
    if (Object.keys(found).length) {
      setErrors(found)
      focusFirstError()
      return
    }
    submittingLock.current = true
    setSubmitting(true)

    const signedAt = new Date().toISOString()
    const ref = `GLD-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`

    setData((d) => ({
      ...d,
      authorization: {
        ...d.authorization,
        certified: true,
        date: signedAt,
        // ⚠️ Must be persisted server-side to be defensible under E-SIGN / UETA.
        audit: {
          signedAt,
          userAgent: navigator.userAgent,
          authVersion: AUTH_VERSION,
          applicationId: ref,
          communicationsConsent: d.authorization.communicationsConsent,
        },
      },
    }))
    setReference(ref)
    setPhase('done')
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* nothing to clean up */
    }
    scrollToTop()
  }

  /* Keep Continue above the on-screen keyboard. */
  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const t = e.target
      if (!(t instanceof HTMLElement)) return
      if (!t.matches('input, select, textarea')) return
      window.setTimeout(() => {
        t.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }, 300)
    }
    document.addEventListener('focusin', onFocus)
    return () => document.removeEventListener('focusin', onFocus)
  }, [])

  /* ---------------------------------------------------------------- */

  if (phase === 'done') {
    return (
      <>
        <Seo
          path="/apply"
          title="Application submitted"
          description="Your application has been submitted to GLD Factoring LLC DBA GLD Funding."
          noindex
        />
        <Confirmation reference={reference} email={data.owners[0]?.email ?? ''} />
      </>
    )
  }

  return (
    <>
      <Seo
        path="/apply"
        title="Apply for Business Funding"
        description="Apply for a merchant cash advance from GLD Funding. Four short steps, your bank statements, and a review by our underwriting team."
        schema={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Apply', path: '/apply' },
          ]),
        ]}
      />

      <div ref={topRef} className="scroll-mt-24 border-b border-rule bg-paper">
        <div className="page py-10 lg:py-12">
          <p className="eyebrow">Apply for funding</p>
          <h1 className="mt-3 text-h1 font-semibold text-ink">
            {phase === 'precheck' ? 'Start your application' : step.title}
          </h1>
          {phase === 'precheck' && (
            <p className="mt-4 max-w-[54ch] text-lead text-ink-2">
              Three quick questions, then the full application. No contact details on this screen.
            </p>
          )}
        </div>
      </div>

      {phase === 'form' && (
        <ProgressBar current={stepIndex} steps={steps.map((s) => s.shortTitle)} />
      )}

      <div className="page grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16 lg:py-16">
        <div className="min-w-0 pb-28 lg:pb-0">
          {restored && (
            <div className="mb-8 flex items-start gap-3 border-l-[3px] border-leaf bg-paper p-4">
              <CheckIcon size={17} weight="bold" className="mt-0.5 shrink-0 text-leaf-deep" />
              <p className="text-[0.9375rem] text-ink-2">
                We picked up where you left off.{' '}
                <button
                  type="button"
                  onClick={() => {
                    setData(emptyApplication())
                    setPhase('precheck')
                    setStepIndex(0)
                    setRestored(false)
                    setReturnToReview(false)
                  }}
                  className="font-medium text-leaf-deep underline underline-offset-[3px]"
                >
                  Start over
                </button>
              </p>
            </div>
          )}

          {phase === 'precheck' && (
            <Precheck
              data={data}
              update={update}
              onContinue={() => {
                setPhase('form')
                setStepIndex(0)
                setDirection(1)
                scrollToTop()
              }}
            />
          )}

          {phase === 'form' && (
            <div
              key={step.id}
              className="motion-safe:animate-[stepIn_240ms_cubic-bezier(0.32,0.72,0,1)]"
              style={{ ['--dir' as string]: direction === 1 ? '1' : '-1' }}
            >
              <StepBody
                id={step.id}
                data={data}
                update={update}
                errors={errors}
                onEdit={editStep}
              />

              <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-white/96 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:static lg:mt-10 lg:border-t lg:bg-transparent lg:p-0 lg:pt-6 lg:backdrop-blur-none">
                <div className="pointer-events-auto flex flex-col-reverse gap-3 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-0">
                  <button
                    type="button"
                    onClick={goBack}
                    className="btn btn-secondary min-h-12 w-full sm:w-auto"
                  >
                    <ArrowLeftIcon size={15} weight="bold" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={submitting}
                    className="btn btn-primary btn-lg group min-h-12 w-full sm:w-auto"
                  >
                    {step.id === 'review'
                      ? submitting
                        ? 'Submitting…'
                        : 'Submit application'
                      : 'Continue'}
                    {step.id !== 'review' && (
                      <ArrowRightIcon
                        size={15}
                        weight="bold"
                        className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <SidePanel data={data} phase={phase} />
        </aside>
      </div>

      <style>{`
        @keyframes stepIn {
          from { opacity: 0; transform: translateX(calc(var(--dir, 1) * 16px)); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </>
  )
}

Component.displayName = 'Apply'

/* ---------------------------------------------------------------- */

function StepBody({
  id,
  onEdit,
  ...props
}: {
  id: StepId
  onEdit: (id: StepId) => void
} & {
  data: ApplicationData
  update: <K extends keyof ApplicationData>(key: K, value: ApplicationData[K]) => void
  errors: Record<string, string>
}) {
  switch (id) {
    case 'business':
      return <BusinessStep {...props} />
    case 'owner':
      return <OwnerStep {...props} />
    case 'documents':
      return <BankFinancingStep {...props} />
    case 'review':
      return <ReviewSignStep {...props} onEdit={onEdit} />
  }
}

function ProgressBar({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="sticky top-[68px] z-30 border-b border-rule bg-white/94 backdrop-blur-md lg:top-[72px]">
      <div className="page py-3.5">
        <ol className="flex items-center gap-1 overflow-x-auto pb-0.5" aria-label={`Step ${current + 1} of ${steps.length}`}>
          {steps.map((title, i) => (
            <li key={title} className="flex min-w-0 items-center gap-1">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={cn('mx-1 h-px w-4 shrink-0 sm:w-8', i <= current ? 'bg-leaf-deep' : 'bg-rule')}
                />
              )}
              <span
                aria-current={i === current ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-full px-1.5 py-1 text-[0.6875rem] font-medium sm:text-[0.75rem]',
                  i === current && 'text-ink',
                  i < current && 'text-leaf-deep',
                  i > current && 'text-ink-3',
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[0.625rem] tabular-nums',
                    i <= current
                      ? 'border-leaf-deep bg-leaf-deep text-white'
                      : 'border-rule bg-transparent text-ink-3',
                  )}
                >
                  {i < current ? <CheckIcon size={10} weight="bold" /> : i + 1}
                </span>
                <span className="max-sm:max-w-[9.5rem] max-sm:truncate">{title}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */

function Confirmation({ reference, email }: { reference: string; email: string }) {
  return (
    <div className="page flex min-h-[70dvh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-good text-good motion-safe:animate-[popIn_320ms_cubic-bezier(0.23,1,0.32,1)]">
        <CheckIcon size={26} weight="bold" />
      </div>

      <h1 className="mt-7 text-h1 font-semibold text-ink">Application submitted</h1>

      <p className="mt-5 max-w-[52ch] text-lead text-ink-2">
        Thank you for applying with GLD Factoring LLC DBA GLD Funding. Your application and documents have been
        successfully received. A member of our funding team will review your information and
        contact you regarding the next steps.
      </p>

      <dl className="mt-9 grid w-full max-w-lg gap-px border border-rule bg-rule sm:grid-cols-2">
        <div className="bg-white p-4">
          <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
            Application ID
          </dt>
          <dd className="mt-1.5 font-mono text-[0.9375rem] font-medium tabular-nums text-ink">
            {reference}
          </dd>
        </div>
        <div className="bg-white p-4">
          <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
            Expected callback
          </dt>
          <dd className="mt-1.5 text-[0.9375rem] font-medium text-ink">
            Once underwriting has reviewed your file
          </dd>
        </div>
      </dl>

      {email && (
        <p className="mt-5 text-[0.875rem] text-ink-3">
          A confirmation is on its way to <span className="text-ink">{email}</span>
        </p>
      )}

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <a href={SITE.phoneHref} className="btn btn-primary min-h-12">
          Call {SITE.phone}
        </a>
        <Link to="/" className="btn btn-secondary min-h-12">
          Back to home
        </Link>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

/* ---------------------------------------------------------------- */

function SidePanel({ data, phase }: { data: ApplicationData; phase: Phase }) {
  const months = requiredStatements(data)

  return (
    <div className="flex flex-col gap-5">
      <div className="card p-5">
        <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
          What you&apos;ll need
        </h2>
        <ul className="mt-3.5 flex flex-col gap-2.5">
          {[
            'Business details and EIN',
            'Owner contact information',
            `${months} months of recent business bank statements`,
            'Additional documentation may be requested after review.',
          ].map((t) => (
            <li key={t} className="flex items-start gap-2.5 text-[0.875rem] leading-snug text-ink-2">
              <CheckIcon size={14} weight="bold" className="mt-0.5 shrink-0 text-leaf-deep" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      {phase !== 'precheck' && (
        <div className="card p-5">
          <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
            Your progress is saved
          </h2>
          <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-2">
            Close this tab and come back whenever - everything you&apos;ve entered stays put on this
            device.
          </p>
        </div>
      )}

      <div className="flex items-start gap-2.5 px-1 text-[0.8125rem] leading-relaxed text-ink-3">
        <LockSimpleIcon size={15} className="mt-0.5 shrink-0" />
        <span>
          See our{' '}
          <Link to="/legal/privacy" className="text-leaf-deep underline underline-offset-2">
            privacy policy
          </Link>{' '}
          for how application information is handled.
        </span>
      </div>

      <div className="px-1 text-[0.8125rem] leading-relaxed text-ink-3">
        Questions?{' '}
        <a href={SITE.phoneHref} className="font-medium text-leaf-deep">
          {SITE.phone}
        </a>
      </div>
    </div>
  )
}
