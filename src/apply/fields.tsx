import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

/* ------------------------------------------------------------------
   Form primitives.
   Labels above inputs, never placeholder-as-label. Errors inline, below
   the field, saying how to fix it rather than that something is wrong.
   ------------------------------------------------------------------ */

type BaseProps = {
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
}

export function Field({
  label,
  hint,
  error,
  required,
  className,
  children,
  htmlFor,
}: BaseProps & { children: ReactNode; htmlFor: string }) {
  return (
    <div className={cn('field', className)}>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {required && (
          <span className="ml-1 text-rate" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  )
}

export function TextInput({
  label,
  hint,
  error,
  required,
  className,
  value,
  onChange,
  ...rest
}: BaseProps & {
  value: string
  onChange: (v: string) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'className'>) {
  const id = useId()
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
      htmlFor={id}
    >
      <input
        id={id}
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        {...rest}
      />
    </Field>
  )
}

export function SelectInput({
  label,
  hint,
  error,
  required,
  className,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  ...rest
}: BaseProps & {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange' | 'className'>) {
  const id = useId()
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
      htmlFor={id}
    >
      <select
        id={id}
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function TextArea({
  label,
  hint,
  error,
  required,
  className,
  value,
  onChange,
  rows = 3,
  ...rest
}: BaseProps & {
  value: string
  onChange: (v: string) => void
  rows?: number
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'className'>) {
  const id = useId()
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
      htmlFor={id}
    >
      <textarea
        id={id}
        rows={rows}
        className="input resize-y"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      />
    </Field>
  )
}

/** Big, tappable yes/no. These drive the conditional logic, so they earn the size. */
export function YesNo({
  label,
  hint,
  value,
  onChange,
  error,
  yesLabel = 'Yes',
  noLabel = 'No',
}: {
  label: string
  hint?: string
  value: boolean | null
  onChange: (v: boolean) => void
  error?: string
  yesLabel?: string
  noLabel?: string
}) {
  return (
    <fieldset className="field">
      <legend className="field-label mb-2">{label}</legend>
      {hint && <p className="field-hint -mt-1 mb-3">{hint}</p>}
      <div className="grid max-w-md grid-cols-2 gap-3">
        {[
          { v: true, l: yesLabel },
          { v: false, l: noLabel },
        ].map(({ v, l }) => {
          const on = value === v
          return (
            <button
              key={l}
              type="button"
              onClick={() => onChange(v)}
              aria-pressed={on}
              className={cn(
                'rounded-[4px] border px-4 py-3.5 text-[0.9375rem] font-medium transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]',
                on
                  ? 'border-mint bg-mint/8 text-mint-deep shadow-[inset_0_0_0_1px_var(--color-mint)]'
                  : 'border-rule bg-white text-ink-2 hover:border-ink-4',
              )}
            >
              {l}
            </button>
          )
        })}
      </div>
      {error && (
        <p className="field-error mt-2" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}

/* ------------------------------------------------------------------
   Signature pad.
   Accepts touch, stylus and mouse, with a type-to-sign fallback for
   anyone who cannot draw a legible signature on a phone.
   ------------------------------------------------------------------ */

export function SignaturePad({
  label,
  value,
  onChange,
  error,
  required,
}: {
  label: string
  value: string
  onChange: (dataUrl: string) => void
  error?: string
  required?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<'draw' | 'type'>('draw')
  const [typed, setTyped] = useState('')
  const [hasInk, setHasInk] = useState(false)
  const drawing = useRef(false)
  const lastPt = useRef<{ x: number; y: number } | null>(null)

  const setup = () => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    if (canvas.width !== rect.width * dpr) {
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#0d1618'
    return ctx
  }

  useEffect(() => {
    setup()
    const onResize = () => setup()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const pointFrom = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drawing.current = true
    lastPt.current = pointFrom(e)
  }

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const ctx = canvasRef.current?.getContext('2d')
    const from = lastPt.current
    if (!ctx || !from) return
    const to = pointFrom(e)
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    lastPt.current = to
    setHasInk(true)
  }

  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    lastPt.current = null
    const canvas = canvasRef.current
    if (canvas && hasInk) onChange(canvas.toDataURL('image/png'))
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasInk(false)
    setTyped('')
    onChange('')
  }

  const commitTyped = (text: string) => {
    setTyped(text)
    if (!text.trim()) {
      onChange('')
      return
    }
    // Render the typed name to a canvas so the stored artifact is identical in shape.
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 160
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#0d1618'
    ctx.font = 'italic 52px "Geist Variable", Georgia, serif'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 24, 84)
    onChange(canvas.toDataURL('image/png'))
  }

  return (
    <div className="field">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="field-label">
          {label}
          {required && (
            <span className="ml-1 text-rate" aria-hidden="true">
              *
            </span>
          )}
        </span>
        <div className="flex items-center gap-1 rounded-full border border-rule p-0.5">
          {(['draw', 'type'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m)
                clear()
              }}
              aria-pressed={mode === m}
              className={cn(
                'rounded-full px-3 py-1 text-[0.75rem] font-medium transition-colors duration-150',
                mode === m ? 'bg-ink text-white' : 'text-ink-3 hover:text-ink',
              )}
            >
              {m === 'draw' ? 'Draw' : 'Type'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'draw' ? (
        <div className="relative">
          <canvas
            ref={canvasRef}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
            onPointerCancel={end}
            className="h-[140px] w-full touch-none rounded-[4px] border border-dashed border-rule bg-paper"
            aria-label={`${label} — draw your signature`}
            role="img"
          />
          {!hasInk && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-4">
              Sign here
            </span>
          )}
        </div>
      ) : (
        <input
          className="input h-[140px] text-center font-serif text-[2rem] italic"
          value={typed}
          onChange={(e) => commitTyped(e.target.value)}
          placeholder="Type your full name"
          autoComplete="off"
          aria-label={`${label} — type your signature`}
        />
      )}

      <div className="flex items-center justify-between gap-3">
        {error ? (
          <p className="field-error" role="alert">
            {error}
          </p>
        ) : (
          <p className="field-hint">
            Your signature is recorded with a timestamp and audit record.
          </p>
        )}
        {(hasInk || typed) && (
          <button
            type="button"
            onClick={clear}
            className="shrink-0 text-[0.8125rem] font-medium text-ink-3 underline underline-offset-2 transition-colors hover:text-ink"
          >
            Clear
          </button>
        )}
      </div>

      {value && <input type="hidden" value={value} readOnly />}
    </div>
  )
}
