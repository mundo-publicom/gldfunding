import { useState } from 'react'
import { CaretDownIcon, WarningIcon } from '@phosphor-icons/react'
import { cn } from '../lib/cn'

/**
 * Authorization presentation.
 *
 * Deliberately a clean summary rather than several screens of contract text —
 * but the full language stays one click away and downloadable, because a
 * consent nobody can read is not a consent.
 *
 * ⚠️ THE LANGUAGE BELOW IS A PLACEHOLDER DESCRIBING COVERAGE, NOT APPROVED
 *    LEGAL TEXT. It must be replaced with GLD's counsel-approved authorization
 *    and aligned with the authorizations in the MCA agreement itself. A
 *    mismatch between what the applicant consents to here and what the
 *    agreement says is the kind of gap that voids enforceability.
 *    When the text changes, bump AUTH_VERSION in types.ts.
 */

const CLAUSES = [
  {
    title: 'Accuracy of information',
    summary:
      'You confirm that everything in this application, and every document attached to it, is true, accurate and complete.',
    full: '[PLACEHOLDER — counsel to supply] The undersigned represents and warrants that all information and documents submitted in connection with this application are true, accurate and complete in all material respects, and agrees to promptly notify GLD Funding of any material change.',
  },
  {
    title: 'Business purpose',
    summary:
      'You certify that the funding is for business purposes only, and not for personal, family or household use.',
    full: '[PLACEHOLDER — counsel to supply] The undersigned certifies that any funding provided will be used solely for business or commercial purposes and not for personal, family or household purposes.',
  },
  {
    title: 'Credit and background authorization',
    summary:
      'You authorize GLD Funding to obtain business and personal credit reports and background information to evaluate this application and any renewal.',
    full: '[PLACEHOLDER — counsel to supply] The undersigned authorizes GLD Funding and its assigns to obtain consumer and business credit reports and other background information from any source, for the purpose of evaluating this application, and on an ongoing basis in connection with any funding provided.',
  },
  {
    title: 'Financial and banking verification',
    summary:
      'You authorize GLD Funding to verify the bank and financial information you have provided, including contacting your bank or processor directly.',
    full: '[PLACEHOLDER — counsel to supply] The undersigned authorizes GLD Funding to verify all financial information provided, including by contacting the business’s financial institutions, payment processors and references, and authorizes those parties to release such information.',
  },
  {
    title: 'Electronic communications and signature',
    summary:
      'You consent to receive documents and disclosures electronically, and agree that your electronic signature is legally binding. Contact consent can be withdrawn at any time.',
    full: '[PLACEHOLDER — counsel to supply] The undersigned consents to receive all disclosures, notices and documents electronically, and agrees that an electronic signature has the same force and effect as a handwritten signature under the federal E-SIGN Act and applicable state UETA. The undersigned further consents to be contacted by telephone, SMS and email at the numbers and addresses provided, including by automated means, and may withdraw consent at any time.',
  },
]

export function AuthorizationText() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-h3 font-semibold text-ink">What you're authorizing</h3>
        <p className="mt-2 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-2">
          Five things, in plain language. Open any one to read the full text, or{' '}
          <a
            href="/legal/application-authorization.pdf"
            className="text-leaf-deep underline underline-offset-[3px]"
          >
            download the complete authorization
          </a>
          .
        </p>
      </div>

      <ol className="divide-y divide-rule border-y border-rule">
        {CLAUSES.map((clause, i) => (
          <li key={clause.title}>
            <div className="flex items-start gap-3.5 py-4">
              <span className="mt-0.5 font-mono text-[0.75rem] tabular-nums text-leaf-deep">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="text-[0.9375rem] font-semibold text-ink">{clause.title}</h4>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-2">
                  {clause.summary}
                </p>

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

      {/* Remove this banner once counsel-approved language is in place. */}
      <div className="mt-5 flex items-start gap-3 border-l-[3px] border-rate bg-rate-bg p-4">
        <WarningIcon size={18} className="mt-0.5 shrink-0 text-rate" />
        <p className="text-[0.8125rem] leading-relaxed text-ink-2">
          <strong className="font-semibold text-ink">Placeholder text.</strong> The clauses above
          describe intended coverage only. GLD's counsel must supply the approved authorization
          language, aligned with the MCA agreement, before this form accepts a real submission.
        </p>
      </div>
    </div>
  )
}
