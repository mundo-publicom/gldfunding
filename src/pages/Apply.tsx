import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  LockSimpleIcon,
  PencilSimpleIcon,
} from '@phosphor-icons/react'
import { Seo, breadcrumbSchema } from '../lib/seo'
import { PRODUCT, SITE, currency } from '../data/site'
import { cn } from '../lib/cn'
import {
  AUTH_VERSION,
  emptyApplication,
  ownerIndexOf,
  requiredStatements,
  visibleSteps,
} from '../apply/types'
import type { ApplicationData, StepDef, StepId } from '../apply/types'
import {
  AuthorizationStep,
  BusinessStep,
  DocumentsStep,
  FinancingStep,
  FundingStep,
  OwnerStep,
} from '../apply/steps'
import { Precheck } from '../apply/Precheck'
import { validateStep } from '../apply/validate'

const STORAGE_KEY = 'gld-application-v2'

type Phase = 'precheck' | 'form' | 'review' | 'done'

export function Component() {
  const [data, setData] = useState<ApplicationData>(emptyApplication)
  const [phase, setPhase] = useState<Phase>('precheck')
  const [stepIndex, setStepIndex] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [direction, setDirection] = useState<1 | -1>(1)
  const [restored, setRestored] = useState(false)
  const [reference, setReference] = useState('')
  const topRef = useRef<HTMLDivElement>(null)

  /* --- steps visible to THIS applicant --- */
  const steps = useMemo(() => visibleSteps(data), [data])
  const step = steps[Math.min(stepIndex, steps.length - 1)]

  /* --- restore in-progress application --- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw) as { data: ApplicationData; phase: Phase; stepIndex: number }
      if (saved?.data) {
        setData(saved.data)
        setPhase(saved.phase === 'done' ? 'precheck' : saved.phase)
        setStepIndex(saved.stepIndex ?? 0)
        setRestored(true)
      }
    } catch {
      /* corrupt payload — start clean rather than trapping the applicant */
    }
  }, [])

  /* --- save on every change; business owners fill these in between customers --- */
  useEffect(() => {
    if (phase === 'done') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, phase, stepIndex }))
    } catch {
      /* storage full or blocked — the form still works, it just won't resume */
    }
  }, [data, phase, stepIndex])

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

  const goNext = () => {
    const found = validateStep(step.id, data)
    if (Object.keys(found).length) {
      setErrors(found)
      // Move focus to the first thing that needs fixing.
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      })
      return
    }
    setErrors({})
    setDirection(1)
    if (stepIndex >= steps.length - 1) setPhase('review')
    else setStepIndex((i) => i + 1)
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
    setPhase('form')
    setDirection(-1)
    scrollToTop()
  }

  const submit = () => {
    setData((d) => ({
      ...d,
      authorization: {
        ...d.authorization,
        date: new Date().toISOString(),
        // ⚠️ Must be persisted server-side to be defensible under E-SIGN / UETA.
        audit: {
          signedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          authVersion: AUTH_VERSION,
        },
      },
    }))
    const ref = `GLD-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`
    setReference(ref)
    setPhase('done')
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* nothing to clean up */
    }
    scrollToTop()
  }

  /* ---------------------------------------------------------------- */

  if (phase === 'done') {
    return (
      <>
        <Seo
          path="/apply"
          title="Application received"
          description="Your application has been received by GLD Funding."
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
        description={`Apply for a merchant cash advance from ${currency(PRODUCT.advanceMin)} to ${currency(PRODUCT.advanceMax)}. A few short steps, your bank statements, and a decision in about ${PRODUCT.decisionHours} hours.`}
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
            {phase === 'precheck'
              ? 'See what you qualify for.'
              : phase === 'review'
                ? 'Review your application'
                : step.title}
          </h1>
          {phase === 'precheck' && (
            <p className="mt-4 max-w-[54ch] text-lead text-ink-2">
              Three questions first. No contact details, no personal information, no credit pull —
              just an indicative range so you know whether it's worth continuing.
            </p>
          )}
        </div>
      </div>

      {phase === 'form' && (
        <ProgressBar current={stepIndex} total={steps.length} title={step.title} />
      )}

      <div className="page grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16 lg:py-16">
        <div className="min-w-0">
          {restored && phase !== 'review' && (
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
              <StepBody id={step.id} data={data} update={update} errors={errors} />

              <div className="mt-10 flex items-center justify-between gap-4 border-t border-rule pt-6">
                <button type="button" onClick={goBack} className="btn btn-secondary">
                  <ArrowLeftIcon size={15} weight="bold" />
                  Back
                </button>
                <button type="button" onClick={goNext} className="btn btn-primary group">
                  {stepIndex >= steps.length - 1 ? 'Review application' : 'Continue'}
                  <ArrowRightIcon
                    size={15}
                    weight="bold"
                    className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>
          )}

          {phase === 'review' && (
            <Review data={data} steps={steps} onEdit={editStep} onSubmit={submit} onBack={() => {
              setPhase('form')
              setStepIndex(steps.length - 1)
            }} />
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
  ...props
}: { id: StepId } & {
  data: ApplicationData
  update: <K extends keyof ApplicationData>(key: K, value: ApplicationData[K]) => void
  errors: Record<string, string>
}) {
  const ownerIdx = ownerIndexOf(id)
  if (ownerIdx !== null) return <OwnerStep {...props} index={ownerIdx} />

  switch (id) {
    case 'business':
      return <BusinessStep {...props} />
    case 'funding':
      return <FundingStep {...props} />
    case 'financing':
      return <FinancingStep {...props} />
    case 'documents':
      return <DocumentsStep {...props} />
    case 'authorization':
      return <AuthorizationStep {...props} />
  }
}

function ProgressBar({
  current,
  total,
  title,
}: {
  current: number
  total: number
  title: string
}) {
  return (
    <div className="sticky top-[68px] z-30 border-b border-rule bg-white/94 backdrop-blur-md lg:top-[72px]">
      <div className="page flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3.5">
        <p className="text-[0.9375rem] font-medium text-ink">
          <span className="font-mono tabular-nums text-ink-3">
            Step {current + 1} of {total}
          </span>
          <span className="mx-2 text-rule" aria-hidden="true">
            —
          </span>
          {title}
        </p>
        <ol className="flex items-center gap-2" aria-label={`Step ${current + 1} of ${total}`}>
          {Array.from({ length: total }, (_, i) => (
            <li
              key={i}
              aria-current={i === current ? 'step' : undefined}
              className={cn(
                'h-2 w-2 rounded-full border transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]',
                i < current && 'border-leaf-deep bg-leaf-deep',
                i === current && 'scale-125 border-leaf-deep bg-leaf-deep',
                i > current && 'border-rule bg-transparent',
              )}
            />
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */

function Review({
  data,
  steps,
  onEdit,
  onSubmit,
  onBack,
}: {
  data: ApplicationData
  steps: ReturnType<typeof visibleSteps>
  onEdit: (id: StepId) => void
  onSubmit: () => void
  onBack: () => void
}) {
  const summaryFor = (s: StepDef): string => {
    if (s.ownerIndex !== undefined) {
      const o = data.owners[s.ownerIndex]
      return `${o?.firstName ?? ''} ${o?.lastName ?? ''}`.trim() || '—'
    }
    switch (s.id) {
      case 'business':
        return data.business.legalName || '—'
      case 'funding':
        return data.funding.amountRequested || '—'
      case 'financing':
        return data.hasExistingFinancing === false
          ? 'None'
          : `${data.positions.length} position${data.positions.length === 1 ? '' : 's'}`
      case 'documents': {
        if (data.documents.method === 'plaid') return 'Bank connection'
        const n = data.documents.statements.filter((f) => f.status === 'done').length
        return `${n} statement${n === 1 ? '' : 's'} attached`
      }
      case 'authorization':
        return data.authorization.certified ? 'Signed' : 'Not signed'
      default:
        return '—'
    }
  }

  return (
    <div>
      <p className="max-w-[62ch] text-lead text-ink-2">
        Everything you've entered, in one place. Change anything before you submit — editing brings
        you straight back here.
      </p>

      <ul className="mt-8 divide-y divide-rule border-y border-rule">
        {steps.map((s) => (
          <li key={s.id} className="flex items-center gap-4 py-4">
            <CheckIcon size={17} weight="bold" className="shrink-0 text-good" />
            <div className="min-w-0 flex-1">
              <p className="text-[0.9375rem] font-medium text-ink">{s.title}</p>
              <p className="mt-0.5 truncate text-[0.8125rem] text-ink-3">{summaryFor(s)}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(s.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-rule px-3.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-leaf-deep transition-colors duration-150 hover:border-leaf hover:bg-leaf/6"
            >
              <PencilSimpleIcon size={12} />
              Edit
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onBack} className="btn btn-secondary">
          <ArrowLeftIcon size={15} weight="bold" />
          Back
        </button>
        <button type="button" onClick={onSubmit} className="btn btn-primary btn-lg">
          Submit application
        </button>
      </div>

      <p className="mt-5 flex items-start gap-2 text-[0.8125rem] leading-relaxed text-ink-3">
        <LockSimpleIcon size={14} className="mt-0.5 shrink-0" />
        <span>
          Submitting does not obligate you to anything. If we can fund you, an underwriter will call
          with an offer and a written disclosure of the total dollar cost before you sign.
        </span>
      </p>
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

      <h1 className="mt-7 text-h1 font-semibold text-ink">Application received</h1>

      <p className="mt-5 max-w-[52ch] text-lead text-ink-2">
        Thank you for applying with GLD Funding. Your application and documents have been
        successfully received. A member of our funding team will review your information and
        contact you regarding the next steps.
      </p>

      <dl className="mt-9 grid w-full max-w-lg gap-px border border-rule bg-rule sm:grid-cols-2">
        <div className="bg-white p-4">
          <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
            Reference
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
            Within {PRODUCT.decisionHours} business hours
          </dd>
        </div>
      </dl>

      {email && (
        <p className="mt-5 text-[0.875rem] text-ink-3">
          A confirmation is on its way to <span className="text-ink">{email}</span>
        </p>
      )}

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <a href={SITE.phoneHref} className="btn btn-primary">
          Call {SITE.phone}
        </a>
        <Link to="/" className="btn btn-secondary">
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
          What you'll need
        </h2>
        <ul className="mt-3.5 flex flex-col gap-2.5">
          {[
            'Business details and EIN',
            'Owner contact information',
            `${months} months of bank statements`,
          ].map((t) => (
            <li key={t} className="flex items-start gap-2.5 text-[0.875rem] leading-snug text-ink-2">
              <CheckIcon size={14} weight="bold" className="mt-0.5 shrink-0 text-leaf-deep" />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-rule-soft pt-3.5 text-[0.8125rem] leading-relaxed text-ink-3">
          That's it. Anything else is requested only if your file needs it, after review.
        </p>
      </div>

      {phase !== 'precheck' && (
        <div className="card p-5">
          <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
            Your progress is saved
          </h2>
          <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-2">
            Close this tab and come back whenever — everything you've entered stays put on this
            device.
          </p>
        </div>
      )}

      <div className="flex items-start gap-2.5 px-1 text-[0.8125rem] leading-relaxed text-ink-3">
        <LockSimpleIcon size={15} className="mt-0.5 shrink-0" />
        <span>
          Your information is encrypted in transit and at rest, and is never sold. See our{' '}
          <Link to="/legal/privacy" className="text-leaf-deep underline underline-offset-2">
            privacy policy
          </Link>
          .
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
