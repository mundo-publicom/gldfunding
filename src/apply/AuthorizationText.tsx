import { useState } from 'react'
import { CaretDownIcon } from '@phosphor-icons/react'
import { cn } from '../lib/cn'
import { AUTH_CLAUSES, AUTH_PDF_HREF } from './authorizationCopy'

export function AuthorizationText() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-h3 font-semibold text-ink">What you&apos;re authorizing</h3>
        <p className="mt-2 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-2">
          {AUTH_CLAUSES.length} sections, in plain language. Open any one to read the full text, or{' '}
          <a href={AUTH_PDF_HREF} className="text-leaf-deep underline underline-offset-[3px]">
            download the complete authorization
          </a>
          .
        </p>
      </div>

      <ol className="divide-y divide-rule border-y border-rule">
        {AUTH_CLAUSES.map((clause, i) => (
          <li key={clause.title}>
            <div className="flex items-start gap-3.5 py-4">
              <span className="mt-0.5 font-mono text-[0.75rem] tabular-nums text-leaf-deep">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="text-[0.9375rem] font-semibold text-ink">{clause.title}</h4>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-2">{clause.summary}</p>

                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="mt-2 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink-3 transition-colors hover:text-ink"
                >
                  {open === i ? 'Hide full text' : 'Read full text'}
                  <CaretDownIcon
                    size={11}
                    weight="bold"
                    className={cn('transition-transform duration-200', open === i && 'rotate-180')}
                  />
                </button>

                {open === i && (
                  <p className="mt-3 border-l-2 border-rule bg-paper p-3.5 text-[0.8125rem] leading-relaxed text-ink-2">
                    {clause.full}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
