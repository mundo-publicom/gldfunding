import { useEffect, useRef, useState } from 'react'
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
const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif']

const fmtSize = (b: number) =>
  b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`

export function DocumentsStep({ data, update, errors }: StepProps) {
  const months = requiredStatements(data)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const files = data.documents.statements
  const method = data.documents.method
  const plaidStatus = data.documents.plaidStatus
  const plaidChosen = method === 'plaid'
  const showUpload = method === 'upload' || plaidStatus === 'failed'
  const docsRef = useRef(data.documents)
  const connectTimer = useRef<number | null>(null)

  useEffect(() => {
    docsRef.current = data.documents
  }, [data.documents])

  useEffect(
    () => () => {
      if (connectTimer.current) window.clearTimeout(connectTimer.current)
    },
    [],
  )

  const setDocs = (patch: Partial<typeof data.documents>) =>
    update('documents', { ...data.documents, ...patch })

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const incoming: UploadedFile[] = []

    for (const file of Array.from(list)) {
      const id = `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`
      let error: string | undefined
      if (file.size > MAX_BYTES) error = `Over the 25 MB limit - try splitting or compressing it.`
      else if (!ACCEPTED.includes(file.type) && !/\.(pdf|jpe?g|png|heic|heif)$/i.test(file.name))
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
    setDocs({ statements: next, method: 'upload', plaidStatus: 'idle' })

    // Simulated transfer. Replace with a real signed-URL upload that reports
    // genuine progress - a fake bar on a document upload is a trust problem.
    for (const f of incoming) {
      if (f.status === 'error') continue
      let pct = 0
      const tick = setInterval(() => {
        pct = Math.min(pct + 8 + Math.random() * 14, 100)
        update('documents', {
          ...data.documents,
          method: 'upload',
          plaidStatus: 'idle',
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

  const remove = (id: string) => setDocs({ statements: files.filter((f) => f.id !== id) })

  const choosePlaid = () => setDocs({ method: 'plaid', plaidStatus: 'idle' })

  const startPlaid = () => {
    setDocs({ method: 'plaid', plaidStatus: 'connecting' })
    if (connectTimer.current) window.clearTimeout(connectTimer.current)
    connectTimer.current = window.setTimeout(() => {
      /* No live bank-link SDK in this build. Fail visibly so the merchant can
         switch to upload instead of sitting on a fake "next screen". */
      update('documents', { ...docsRef.current, method: 'plaid', plaidStatus: 'failed' })
    }, 1200)
  }

  const done = files.filter((f) => f.status === 'done').length

  return (
    <div className="flex flex-col gap-8">
      <div className="border-l-[3px] border-leaf bg-paper p-5">
        <p className="text-[1.0625rem] font-semibold text-ink">Bank statements</p>
        <p className="mt-1.5 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-2">
          Upload your most recent {months} months of complete business bank statements. You may
          upload individual statements or one combined PDF. If additional documentation is needed,
          we&apos;ll contact you after review.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={choosePlaid}
          className={cn(
            'flex flex-col items-start gap-2 rounded-[4px] border p-5 text-left transition-all duration-150 active:scale-[0.99]',
            plaidChosen && plaidStatus !== 'failed'
              ? 'border-leaf bg-leaf/8 shadow-[inset_0_0_0_1px_var(--color-leaf)]'
              : 'border-rule bg-white hover:border-ink-4',
          )}
        >
          <span className="flex items-center gap-2 text-leaf-deep">
            <LightningIcon size={20} weight="fill" />
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em]">Fastest</span>
          </span>
          <span className="text-[1.0625rem] font-semibold text-ink">Connect your bank</span>
          <span className="text-[0.875rem] leading-relaxed text-ink-2">
            Read-only access to your business accounts. You can connect more than one account if you
            bank in a few places.
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setDocs({ method: 'upload', plaidStatus: 'idle' })
            inputRef.current?.click()
          }}
          className={cn(
            'flex flex-col items-start gap-2 rounded-[4px] border p-5 text-left transition-all duration-150 active:scale-[0.99]',
            method === 'upload'
              ? 'border-leaf bg-leaf/8 shadow-[inset_0_0_0_1px_var(--color-leaf)]'
              : 'border-rule bg-white hover:border-ink-4',
          )}
        >
          <span className="flex items-center gap-2 text-ink-3">
            <BankIcon size={20} />
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em]">Manual</span>
          </span>
          <span className="text-[1.0625rem] font-semibold text-ink">Upload statements</span>
          <span className="text-[0.875rem] leading-relaxed text-ink-2">
            Drag files in, or choose from Files or Photos on your phone. PDF, JPG, PNG, or HEIC.
          </span>
        </button>
      </div>

      {plaidChosen && plaidStatus !== 'failed' && (
        <div className="flex flex-col gap-4 rounded-[4px] border border-rule bg-paper p-5">
          {plaidStatus === 'connected' ? (
            <div className="flex items-start gap-3">
              <CheckCircleIcon size={20} weight="fill" className="mt-0.5 shrink-0 text-good" />
              <div>
                <p className="text-[0.9375rem] font-medium text-ink">Bank connected</p>
                <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-2">
                  GLD Factoring LLC DBA GLD Funding receives read-only access to statement data. We
                  can never move money, and you can revoke access at any time.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[0.9375rem] font-medium text-ink">
                {plaidStatus === 'connecting'
                  ? 'Opening a secure bank connection…'
                  : 'Connect one or more business accounts'}
              </p>
              <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-2">
                You will sign in with your bank. GLD receives read-only statement data and can never
                move money.
              </p>
              {plaidStatus !== 'connecting' && (
                <button
                  type="button"
                  onClick={startPlaid}
                  className="btn btn-primary mt-4"
                >
                  Connect to your bank
                </button>
              )}
            </div>
          )}
          {plaidStatus !== 'connected' && (
            <button
              type="button"
              onClick={() => {
                setDocs({ method: 'upload', plaidStatus: 'idle' })
                inputRef.current?.click()
              }}
              className="self-start text-[0.875rem] font-medium text-leaf-deep underline underline-offset-[3px]"
            >
              Having trouble? Upload statements instead
            </button>
          )}
        </div>
      )}

      {plaidStatus === 'failed' && (
        <div className="flex items-start gap-3 rounded-[4px] border border-rule bg-paper p-5">
          <WarningCircleIcon size={20} weight="fill" className="mt-0.5 shrink-0 text-rate" />
          <div>
            <p className="text-[0.9375rem] font-medium text-ink">
              We couldn&apos;t connect to your bank
            </p>
            <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-2">
              Upload your statements below to keep going. You can try connecting again later if you
              prefer.
            </p>
            <button
              type="button"
              onClick={startPlaid}
              className="mt-3 text-[0.875rem] font-medium text-leaf-deep underline underline-offset-[3px]"
            >
              Try connecting again
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,application/pdf,image/jpeg,image/png,image/heic,image/heif,image/*"
        onChange={(e) => {
          addFiles(e.target.files)
          e.target.value = ''
        }}
        className="sr-only"
        aria-label="Upload bank statements"
      />

      {showUpload && !(plaidChosen && plaidStatus === 'connected') && (
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
              dragging ? 'border-leaf bg-leaf/5' : 'border-rule bg-paper',
            )}
          >
            <UploadSimpleIcon size={26} className="text-ink-3" />
            <div>
              <p className="text-[0.9375rem] font-medium text-ink">
                Drag statements here, or{' '}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-leaf-deep underline underline-offset-[3px]"
                >
                  browse Files or Photos
                </button>
              </p>
              <p className="mt-1 text-[0.8125rem] text-ink-3">
                PDF, JPG, PNG or HEIC · multiple files · up to 25 MB each
              </p>
            </div>
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
                          className="h-full bg-leaf-deep transition-[width] duration-150 ease-linear"
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
    </div>
  )
}
