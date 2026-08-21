import { useRef, useState } from 'react'
import {
  BankIcon,
  CheckCircleIcon,
  FilePdfIcon,
  LightningIcon,
  TrashIcon,
  UploadSimpleIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { requiredStatements, requiredUploads } from './types'
import type { StepProps, UploadedFile } from './types'
import { cn } from '../lib/cn'

const MAX_BYTES = 25 * 1024 * 1024
const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic']

const fmtSize = (b: number) =>
  b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`

export function DocumentsStep({ data, update, errors }: StepProps) {
  const months = requiredStatements(data)
  const stateName = data.business.state
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const files = data.documents.statements

  const setDocs = (patch: Partial<typeof data.documents>) =>
    update('documents', { ...data.documents, ...patch })

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const incoming: UploadedFile[] = []

    for (const file of Array.from(list)) {
      const id = `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`
      let error: string | undefined
      if (file.size > MAX_BYTES) error = `Over the 25 MB limit — try splitting or compressing it.`
      else if (!ACCEPTED.includes(file.type) && !/\.(pdf|jpe?g|png|heic)$/i.test(file.name))
        error = 'Needs to be a PDF or a photo (JPG, PNG, HEIC).'

      incoming.push({
        id,
        name: file.name,
        size: file.size,
        progress: error ? 0 : 0,
        status: error ? 'error' : 'uploading',
        error,
      })
    }

    const next = [...files, ...incoming]
    setDocs({ statements: next, method: 'upload' })

    // Simulated transfer. Replace with a real signed-URL upload that reports
    // genuine progress — a fake bar on a document upload is a trust problem.
    for (const f of incoming) {
      if (f.status === 'error') continue
      let pct = 0
      const tick = setInterval(() => {
        pct = Math.min(pct + 8 + Math.random() * 14, 100)
        update('documents', {
          ...data.documents,
          method: 'upload',
          statements: next.map((s) =>
            s.id === f.id
              ? { ...s, progress: pct, status: pct >= 100 ? 'done' : 'uploading' }
              : s,
          ),
        })
        if (pct >= 100) clearInterval(tick)
      }, 140)
    }
  }

  const remove = (id: string) =>
    setDocs({ statements: files.filter((f) => f.id !== id) })

  const done = files.filter((f) => f.status === 'done').length
  const plaidChosen = data.documents.method === 'plaid'

  return (
    <div className="flex flex-col gap-8">
      {/* The requirement is computed from step 1 and stated plainly. */}
      <div className="border-l-[3px] border-mint bg-paper p-5">
        <p className="text-[1.0625rem] font-semibold text-ink">
          Upload your last {months} months of business bank statements
        </p>
        <p className="mt-1.5 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-2">
          {stateName === 'NY'
            ? 'New York businesses need four months rather than the usual three.'
            : `Three months is all we need to make a decision.`}{' '}
          Every page of each statement, as your bank issues them. PDFs are best; clear photos work
          too.
        </p>
        {/* The ask is the full period; the gate is one file. Most banks issue a
            single PDF covering every month, and blocking submission on a file
            count is where applications get abandoned. */}
        <p className="mt-2 max-w-[62ch] text-[0.875rem] leading-relaxed text-ink-3">
          One file is enough to continue — if your statements come as a single combined PDF, attach
          that. Anything still missing, we'll ask for after review.
        </p>
      </div>

      {/* Plaid as the fast path — one consent screen instead of hunting for PDFs. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setDocs({ method: 'plaid', statements: [] })}
          className={cn(
            'flex flex-col items-start gap-2 rounded-[4px] border p-5 text-left transition-all duration-150 active:scale-[0.99]',
            plaidChosen
              ? 'border-mint bg-mint/8 shadow-[inset_0_0_0_1px_var(--color-mint)]'
              : 'border-rule bg-white hover:border-ink-4',
          )}
        >
          <span className="flex items-center gap-2 text-mint-deep">
            <LightningIcon size={20} weight="fill" />
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em]">Fastest</span>
          </span>
          <span className="text-[1.0625rem] font-semibold text-ink">Connect your bank</span>
          <span className="text-[0.875rem] leading-relaxed text-ink-2">
            Read-only, one consent screen, no downloading anything. Replaces the upload entirely.
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setDocs({ method: 'upload' })
            inputRef.current?.click()
          }}
          className={cn(
            'flex flex-col items-start gap-2 rounded-[4px] border p-5 text-left transition-all duration-150 active:scale-[0.99]',
            data.documents.method === 'upload'
              ? 'border-mint bg-mint/8 shadow-[inset_0_0_0_1px_var(--color-mint)]'
              : 'border-rule bg-white hover:border-ink-4',
          )}
        >
          <span className="flex items-center gap-2 text-ink-3">
            <BankIcon size={20} />
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em]">Manual</span>
          </span>
          <span className="text-[1.0625rem] font-semibold text-ink">Upload statements</span>
          <span className="text-[0.875rem] leading-relaxed text-ink-2">
            Drag files in, or take a photo of each statement on your phone.
          </span>
        </button>
      </div>

      {plaidChosen ? (
        <div className="flex items-start gap-3 rounded-[4px] border border-rule bg-paper p-5">
          <CheckCircleIcon size={20} weight="fill" className="mt-0.5 shrink-0 text-good" />
          <div>
            <p className="text-[0.9375rem] font-medium text-ink">
              You'll connect your bank on the next screen
            </p>
            <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-2">
              GLD Funding receives read-only access to statement data. We can never move money, and
              you can revoke access at any time.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              addFiles(e.dataTransfer.files)
            }}
            className={cn(
              'flex flex-col items-center justify-center gap-3 rounded-[4px] border border-dashed px-6 py-10 text-center transition-colors duration-150',
              dragging ? 'border-mint bg-mint/5' : 'border-rule bg-paper',
            )}
          >
            <UploadSimpleIcon size={26} className="text-ink-3" />
            <div>
              <p className="text-[0.9375rem] font-medium text-ink">
                Drag statements here, or{' '}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-mint-deep underline underline-offset-[3px]"
                >
                  browse your files
                </button>
              </p>
              <p className="mt-1 text-[0.8125rem] text-ink-3">
                PDF, JPG, PNG or HEIC · up to 25 MB each
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.heic,application/pdf,image/*"
              onChange={(e) => {
                addFiles(e.target.files)
                e.target.value = ''
              }}
              className="sr-only"
              aria-label="Upload bank statements"
            />
          </div>

          {files.length > 0 && (
            <ul className="flex flex-col divide-y divide-rule border-y border-rule">
              {files.map((f) => (
                <li key={f.id} className="flex items-center gap-3.5 py-3.5">
                  <FilePdfIcon
                    size={20}
                    className={cn('shrink-0', f.status === 'error' ? 'text-rate' : 'text-ink-3')}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-[0.9375rem] text-ink">{f.name}</span>
                      <span className="shrink-0 font-mono text-[0.75rem] tabular-nums text-ink-3">
                        {fmtSize(f.size)}
                      </span>
                    </div>

                    {f.status === 'error' ? (
                      <p className="mt-1 flex items-center gap-1.5 text-[0.8125rem] text-rate">
                        <WarningCircleIcon size={13} weight="fill" />
                        {f.error}
                      </p>
                    ) : f.status === 'uploading' ? (
                      <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-rule">
                        <div
                          className="h-full bg-mint-deep transition-[width] duration-150 ease-linear"
                          style={{ width: `${f.progress}%` }}
                        />
                      </div>
                    ) : (
                      <p className="mt-1 flex items-center gap-1.5 text-[0.8125rem] text-good">
                        <CheckCircleIcon size={13} weight="fill" />
                        Uploaded
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(f.id)}
                    aria-label={`Remove ${f.name}`}
                    className="shrink-0 rounded-full p-1.5 text-ink-3 transition-colors hover:bg-paper hover:text-rate"
                  >
                    <TrashIcon size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {files.length > 0 && (
            <p className="font-mono text-[0.8125rem] tabular-nums text-ink-3">
              {done} file{done === 1 ? '' : 's'} uploaded
              {done >= requiredUploads && ' · enough to continue'}
            </p>
          )}
        </>
      )}

      {errors['documents'] && (
        <p className="field-error" role="alert">
          {errors['documents']}
        </p>
      )}

      {/* Everything else is a stip, requested after review — not a barrier to submitting. */}
      <div className="border-t border-rule pt-6">
        <h3 className="text-[0.9375rem] font-semibold text-ink">
          That's everything we need to submit
        </h3>
        <p className="mt-2 max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-2">
          If your file needs anything further — a driver's licence, a voided check, a processing
          statement — underwriting will request it after review, through a secure link. You will
          never be asked to fill this application in again.
        </p>
      </div>
    </div>
  )
}
