import type { ReactNode } from 'react'
import { PlusIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { cn } from '../lib/cn'
import { AddressFields } from './AddressFields'
import { SelectInput, SignaturePad, SsnInput, TextInput, YesNo, ConsentCheckbox } from './fields'
import { PhoneInput } from './PhoneInput'
import { formatUsPhone } from './phone'
import { DocumentsStep } from './DocumentsStep'
import { AuthorizationText } from './AuthorizationText'
import { SIGNATURE_ACKNOWLEDGEMENT } from './authorizationCopy'
import {
  MAX_OWNERS,
  OWNER_COUNT_OPTIONS,
  activeOwners,
  emptyOwner,
  emptyPosition,
  maskSsn,
  ownerCount,
  ownerHasData,
  ownersRevealed,
} from './types'
import type { ApplicationData, Owner, Position, StepId, StepProps } from './types'
import { INDUSTRIES } from '../data/site'

const ENTITY_TYPES = [
  { value: 'llc', label: 'LLC' },
  { value: 's-corp', label: 'S Corporation' },
  { value: 'c-corp', label: 'C Corporation' },
  { value: 'sole-prop', label: 'Sole Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
]

const INDUSTRY_OPTIONS = [
  ...INDUSTRIES.map((i) => ({ value: i.slug, label: i.name })),
  { value: 'professional-services', label: 'Professional services' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'other', label: 'Other' },
]

const USE_OF_FUNDS = [
  { value: 'inventory', label: 'Inventory or supplies' },
  { value: 'equipment', label: 'Equipment purchase or repair' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'expansion', label: 'Expansion or renovation' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'cash-flow', label: 'Bridging a cash-flow gap' },
  { value: 'debt', label: 'Consolidating existing financing' },
  { value: 'other', label: 'Other' },
]

export function BusinessStep({ data, update, errors }: StepProps) {
  const set = (k: keyof ApplicationData['business'], v: string) =>
    update('business', { ...data.business, [k]: v })

  const count = ownerCount(data)

  /* Grow the roster to match, never truncate it - dropping the count from
     three to two and back must not wipe details somebody already typed. */
  const setOwners = (n: number) => {
    update('ownerCount', n)
    if (data.owners.length < n) {
      update('owners', [
        ...data.owners,
        ...Array.from({ length: n - data.owners.length }, emptyOwner),
      ])
    }
    if (data.ownersRevealed > n) update('ownersRevealed', n)
  }

  const setFunding = (k: keyof ApplicationData['funding'], v: string) =>
    update('funding', { ...data.funding, [k]: v })

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextInput
          label="Legal business name"
          required
          value={data.business.legalName}
          onChange={(v) => set('legalName', v)}
          error={errors['business.legalName']}
          autoComplete="organization"
          name="organization"
        />
        <TextInput
          label="DBA / trade name"
          hint="If it differs from the legal name"
          value={data.business.dba}
          onChange={(v) => set('dba', v)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <SelectInput
          label="Entity type"
          required
          value={data.business.entityType}
          onChange={(v) => set('entityType', v)}
          options={ENTITY_TYPES}
          error={errors['business.entityType']}
        />
        <TextInput
          label="EIN"
          required
          value={data.business.ein}
          onChange={(v) => set('ein', v)}
          error={errors['business.ein']}
          placeholder="12-3456789"
          inputMode="numeric"
        />
      </div>

      <AddressFields
        streetLabel="Business street address"
        streetName="business-street"
        required
        value={{
          street: data.business.street,
          city: data.business.city,
          state: data.business.state,
          zip: data.business.zip,
        }}
        onChange={(next) => update('business', { ...data.business, ...next })}
        errors={{
          street: errors['business.street'],
          city: errors['business.city'],
          state: errors['business.state'],
          zip: errors['business.zip'],
        }}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <PhoneInput
          label="Business phone"
          required
          value={data.business.phone}
          onChange={(v) => set('phone', v)}
          error={errors['business.phone']}
        />
        <SelectInput
          label="Industry"
          required
          value={data.business.industry}
          onChange={(v) => set('industry', v)}
          options={INDUSTRY_OPTIONS}
          error={errors['business.industry']}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextInput
          label="Business start date"
          required
          type="month"
          value={data.business.startDate}
          onChange={(v) => set('startDate', v)}
          error={errors['business.startDate']}
        />
        <TextInput
          label="Average monthly revenue"
          required
          value={data.business.monthlyRevenue}
          onChange={(v) => set('monthlyRevenue', v)}
          error={errors['business.monthlyRevenue']}
          inputMode="decimal"
          placeholder="$50,000"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <SelectInput
          label="Number of owners"
          required
          value={String(count)}
          onChange={(v) => setOwners(Number(v))}
          options={OWNER_COUNT_OPTIONS}
          error={errors['ownerCount']}
          placeholder="Select…"
          hint={
            count === 1
              ? 'We will ask for one set of owner details next.'
              : `We will collect ${count} owners one at a time on the next step.`
          }
        />
      </div>

      <div className="grid gap-6 border-t border-rule pt-8 sm:grid-cols-2">
        <TextInput
          label="How much funding are you looking for?"
          required
          value={data.funding.amountRequested}
          onChange={(v) => setFunding('amountRequested', v)}
          error={errors['funding.amountRequested']}
          inputMode="decimal"
          placeholder="$50,000"
          hint="Enter the approximate amount of funding you are looking for. An estimate is fine."
        />
        <SelectInput
          label="What will you use it for?"
          required
          value={data.funding.useOfFunds}
          onChange={(v) => setFunding('useOfFunds', v)}
          error={errors['funding.useOfFunds']}
          options={USE_OF_FUNDS}
        />
      </div>
    </div>
  )
}

function OwnerFields({
  owner,
  onChange,
  errors,
  prefix,
}: {
  owner: Owner
  onChange: (o: Owner) => void
  errors: Record<string, string>
  prefix: string
}) {
  const set = (k: keyof Owner, v: string) => onChange({ ...owner, [k]: v })

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextInput
          label="First name"
          required
          value={owner.firstName}
          onChange={(v) => set('firstName', v)}
          error={errors[`${prefix}.firstName`]}
          autoComplete="given-name"
        />
        <TextInput
          label="Last name"
          required
          value={owner.lastName}
          onChange={(v) => set('lastName', v)}
          error={errors[`${prefix}.lastName`]}
          autoComplete="family-name"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextInput
          label="Title / position"
          required
          value={owner.title}
          onChange={(v) => set('title', v)}
          error={errors[`${prefix}.title`]}
          placeholder="Managing Member"
          autoComplete="organization-title"
        />
        <TextInput
          label="Ownership percentage"
          required
          value={owner.ownership}
          onChange={(v) => set('ownership', v)}
          error={errors[`${prefix}.ownership`]}
          inputMode="numeric"
          placeholder="100"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextInput
          label="Email"
          required
          type="email"
          value={owner.email}
          onChange={(v) => set('email', v)}
          error={errors[`${prefix}.email`]}
          autoComplete="email"
        />
        <PhoneInput
          label="Mobile phone"
          required
          value={owner.phone}
          onChange={(v) => set('phone', v)}
          error={errors[`${prefix}.phone`]}
        />
      </div>

      <AddressFields
        streetLabel="Home address"
        streetName={`${prefix}-street`}
        required
        value={{
          street: owner.street,
          city: owner.city,
          state: owner.state,
          zip: owner.zip,
        }}
        onChange={(next) => onChange({ ...owner, ...next })}
        errors={{
          street: errors[`${prefix}.street`],
          city: errors[`${prefix}.city`],
          state: errors[`${prefix}.state`],
          zip: errors[`${prefix}.zip`],
        }}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextInput
          label="Date of birth"
          required
          type="date"
          value={owner.dob}
          onChange={(v) => set('dob', v)}
          error={errors[`${prefix}.dob`]}
        />
        <SsnInput
          label="Social Security number"
          required
          value={owner.ssn}
          onChange={(v) => set('ssn', v)}
          error={errors[`${prefix}.ssn`]}
          hint="Used for identity verification, underwriting, and authorized credit/background review."
        />
      </div>
    </div>
  )
}

/**
 * One owner form by default. Extra owners are added on demand so the screen
 * never opens with a stack of blank forms.
 */
export function OwnerStep({ data, update, errors }: StepProps) {
  const total = ownerCount(data)
  const revealed = ownersRevealed(data)

  const setOwner = (index: number, o: Owner) => {
    const next = [...data.owners]
    while (next.length <= index) next.push(emptyOwner())
    next[index] = o
    update('owners', next)
  }

  const revealNext = () => {
    const next = Math.min(revealed + 1, total, MAX_OWNERS)
    if (data.owners.length < next) {
      update('owners', [
        ...data.owners,
        ...Array.from({ length: next - data.owners.length }, emptyOwner),
      ])
    }
    update('ownersRevealed', next)
  }

  const hideOwner = (index: number) => {
    if (index === 0 || index !== revealed - 1) return
    /* Collapse the last extra form. Typed details stay in the roster so
       adding that owner again restores them. */
    update('ownersRevealed', revealed - 1)
  }

  return (
    <div className="flex flex-col gap-8">
      {total > 1 && (
        <p className="text-[0.9375rem] leading-relaxed text-ink-2">
          You indicated {total} owners. Complete the first owner, then add each additional owner.
          Each additional owner may be asked to complete a separate credit and background
          authorization — signing this application does not authorize a personal check on someone
          else.
        </p>
      )}

      {Array.from({ length: revealed }, (_, index) => {
        const owner = data.owners[index] ?? emptyOwner()
        return (
          <section
            key={index}
            aria-label={total > 1 ? `Owner ${index + 1}` : 'Owner'}
            className={cn(index > 0 && 'border-t border-rule pt-8')}
          >
            {total > 1 && (
              <div className="mb-5 flex items-center justify-between gap-4">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
                  Owner {index + 1} of {total}
                  {index === 0 && ' · list the majority owner first'}
                </p>
                {index > 0 && index === revealed - 1 && (
                  <button
                    type="button"
                    onClick={() => hideOwner(index)}
                    className="flex items-center gap-1.5 text-[0.8125rem] text-ink-3 transition-colors hover:text-rate"
                  >
                    <TrashIcon size={14} />
                    Remove
                  </button>
                )}
              </div>
            )}
            <OwnerFields
              owner={owner}
              onChange={(o) => setOwner(index, o)}
              errors={errors}
              prefix={`owners.${index}`}
            />
          </section>
        )
      })}

      {total > 1 && revealed < total && (
        <button type="button" onClick={revealNext} className="btn btn-secondary self-start">
          <PlusIcon size={15} weight="bold" />
          Add another owner
        </button>
      )}
    </div>
  )
}

export function FinancingStep({ data, update, errors }: StepProps) {
  const setPosition = (i: number, p: Position) => {
    const next = [...data.positions]
    next[i] = p
    update('positions', next)
  }

  return (
    <div className="flex flex-col gap-8 border-t border-rule pt-10">
      <YesNo
        label="Do you currently have any existing business financing?"
        hint="Include merchant cash advances, business loans, or lines of credit."
        value={data.hasExistingFinancing}
        onChange={(v) => {
          update('hasExistingFinancing', v)
          if (v && data.positions.length === 0) update('positions', [emptyPosition()])
          if (!v) update('positions', [])
        }}
        error={errors['hasExistingFinancing']}
      />

      {data.hasExistingFinancing === true && (
        <div className="flex flex-col gap-5">
          {data.positions.map((pos, i) => (
            <div key={i} className="card p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
                  Financing position {i + 1}
                </h3>
                {data.positions.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        'positions',
                        data.positions.filter((_, idx) => idx !== i),
                      )
                    }
                    className="flex items-center gap-1.5 text-[0.8125rem] text-ink-3 transition-colors hover:text-rate"
                  >
                    <TrashIcon size={14} />
                    Remove
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-5">
                <TextInput
                  label="Provider / funder name"
                  required
                  value={pos.funder}
                  onChange={(v) => setPosition(i, { ...pos, funder: v })}
                  error={errors[`positions.${i}.funder`]}
                />
                <div className="grid gap-5 sm:grid-cols-3">
                  <TextInput
                    label="Current balance"
                    required
                    value={pos.currentBalance}
                    onChange={(v) => setPosition(i, { ...pos, currentBalance: v })}
                    error={errors[`positions.${i}.currentBalance`]}
                    inputMode="decimal"
                    placeholder="$25,000"
                  />
                  <TextInput
                    label="Payment amount"
                    required
                    value={pos.paymentAmount}
                    onChange={(v) => setPosition(i, { ...pos, paymentAmount: v })}
                    error={errors[`positions.${i}.paymentAmount`]}
                    inputMode="decimal"
                  />
                  <SelectInput
                    label="Payment frequency"
                    required
                    value={pos.frequency}
                    onChange={(v) =>
                      setPosition(i, { ...pos, frequency: v as Position['frequency'] })
                    }
                    error={errors[`positions.${i}.frequency`]}
                    options={[
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                      { value: 'monthly', label: 'Monthly' },
                    ]}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => update('positions', [...data.positions, emptyPosition()])}
            className="btn btn-secondary self-start"
          >
            <PlusIcon size={15} weight="bold" />
            Add another financing position
          </button>
        </div>
      )}
    </div>
  )
}

export function BankFinancingStep(props: StepProps) {
  return (
    <div className="flex flex-col">
      <DocumentsStep {...props} />
      <FinancingStep {...props} />
    </div>
  )
}

const ENTITY_LABEL: Record<string, string> = Object.fromEntries(
  ENTITY_TYPES.map((e) => [e.value, e.label]),
)
const INDUSTRY_LABEL: Record<string, string> = Object.fromEntries(
  INDUSTRY_OPTIONS.map((e) => [e.value, e.label]),
)
const USE_LABEL: Record<string, string> = Object.fromEntries(USE_OF_FUNDS.map((e) => [e.value, e.label]))
const formatEin = (ein: string) => {
  const d = ein.replace(/\D/g, '')
  return d.length === 9 ? `${d.slice(0, 2)}-${d.slice(2)}` : ein
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-4">
      <dt className="text-[0.8125rem] text-ink-3">{label}</dt>
      <dd className="min-w-0 break-words text-[0.9375rem] text-ink">{value || '—'}</dd>
    </div>
  )
}

function ReviewSection({
  title,
  stepId,
  onEdit,
  children,
}: {
  title: string
  stepId: StepId
  onEdit: (id: StepId) => void
  children: ReactNode
}) {
  return (
    <section className="border-b border-rule pb-6">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h3 className="text-[1.0625rem] font-semibold text-ink">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(stepId)}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-rule px-3.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-leaf-deep transition-colors duration-150 hover:border-leaf hover:bg-leaf/6"
        >
          <PencilSimpleIcon size={12} />
          Edit
        </button>
      </div>
      <dl className="divide-y divide-rule-soft">{children}</dl>
    </section>
  )
}

export function ReviewSignStep({
  data,
  update,
  errors,
  onEdit,
}: StepProps & { onEdit: (id: StepId) => void }) {
  const set = <K extends keyof ApplicationData['authorization']>(
    k: K,
    v: ApplicationData['authorization'][K],
  ) => update('authorization', { ...data.authorization, [k]: v })

  const owners = activeOwners(data)
  const today = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })

  const bankStatus = (() => {
    if (data.documents.method === 'plaid' && data.documents.plaidStatus === 'connected') {
      return 'Bank connected'
    }
    if (data.documents.plaidStatus === 'failed') return 'Bank connection did not finish — statements uploaded'
    const n = data.documents.statements.filter((f) => f.status === 'done').length
    return n ? `${n} statement${n === 1 ? '' : 's'} uploaded` : 'No statements yet'
  })()

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-8">
        <p className="max-w-[62ch] text-lead text-ink-2">
          Confirm the details below, then read the authorization and sign. Use Edit to change a
          section — your other answers stay as you left them.
        </p>

        <ReviewSection title="Business & funding" stepId="business" onEdit={onEdit}>
          <ReviewRow label="Legal business name" value={data.business.legalName} />
          <ReviewRow label="DBA / trade name" value={data.business.dba} />
          <ReviewRow
            label="Entity type"
            value={ENTITY_LABEL[data.business.entityType] ?? data.business.entityType}
          />
          <ReviewRow label="EIN" value={formatEin(data.business.ein)} />
          <ReviewRow
            label="Business address"
            value={[
              data.business.street,
              [data.business.city, data.business.state, data.business.zip].filter(Boolean).join(', '),
            ]
              .filter(Boolean)
              .join(', ')}
          />
          <ReviewRow label="Business phone" value={formatUsPhone(data.business.phone)} />
          <ReviewRow
            label="Industry"
            value={INDUSTRY_LABEL[data.business.industry] ?? data.business.industry}
          />
          <ReviewRow label="Business start date" value={data.business.startDate} />
          <ReviewRow label="Average monthly revenue" value={data.business.monthlyRevenue} />
          <ReviewRow label="Number of owners" value={String(ownerCount(data))} />
          <ReviewRow label="Funding requested" value={data.funding.amountRequested} />
          <ReviewRow
            label="Use of funds"
            value={USE_LABEL[data.funding.useOfFunds] ?? data.funding.useOfFunds}
          />
        </ReviewSection>

        {owners.map((o, i) => (
          <ReviewSection
            key={i}
            title={owners.length > 1 ? `Owner ${i + 1}` : 'Owner'}
            stepId="owner"
            onEdit={onEdit}
          >
            <ReviewRow label="Name" value={`${o.firstName} ${o.lastName}`.trim()} />
            <ReviewRow label="Title / position" value={o.title} />
            <ReviewRow label="Ownership" value={o.ownership ? `${o.ownership}%` : ''} />
            <ReviewRow label="Email" value={o.email} />
            <ReviewRow label="Mobile phone" value={formatUsPhone(o.phone)} />
            <ReviewRow
              label="Home address"
              value={[o.street, [o.city, o.state, o.zip].filter(Boolean).join(', ')].filter(Boolean).join(', ')}
            />
            <ReviewRow label="Date of birth" value={o.dob} />
            <ReviewRow label="Social Security number" value={ownerHasData(o) ? maskSsn(o.ssn) : '—'} />
          </ReviewSection>
        ))}

        <ReviewSection title="Bank statements & financing" stepId="documents" onEdit={onEdit}>
          <ReviewRow label="Bank documents" value={bankStatus} />
          <ReviewRow
            label="Existing financing"
            value={
              data.hasExistingFinancing === false
                ? 'None'
                : data.hasExistingFinancing
                  ? `${data.positions.length} position${data.positions.length === 1 ? '' : 's'}`
                  : '—'
            }
          />
          {data.hasExistingFinancing &&
            data.positions.map((p, i) => (
              <ReviewRow
                key={i}
                label={data.positions.length > 1 ? `Position ${i + 1}` : 'Position'}
                value={[p.funder, p.currentBalance, p.paymentAmount, p.frequency]
                  .filter(Boolean)
                  .join(' · ')}
              />
            ))}
        </ReviewSection>
      </div>

      <AuthorizationText />

      {ownerCount(data) > 1 && (
        <p className="max-w-[62ch] text-[0.875rem] leading-relaxed text-ink-3">
          The signature below is from the person submitting this application. Additional owners may
          be asked to complete their own credit and background authorization. This signature does not
          authorize a personal credit or background check for another owner.
        </p>
      )}

      <ConsentCheckbox
        label="I agree that GLD Factoring LLC DBA GLD Funding may contact me about this application by call, text, or email at the phone numbers and email I provided. Consent is not a condition of receiving funding. Message and data rates may apply."
        checked={data.authorization.communicationsConsent}
        onChange={(v) => set('communicationsConsent', v)}
        error={errors['authorization.communicationsConsent']}
      />

      <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink">
        {SIGNATURE_ACKNOWLEDGEMENT}
      </p>

      <TextInput
        label="Applicant name"
        required
        value={data.authorization.fullName}
        onChange={(v) => set('fullName', v)}
        error={errors['authorization.fullName']}
        autoComplete="name"
        className="max-w-md"
      />

      <SignaturePad
        label="Signature"
        required
        value={data.authorization.signatures[0] ?? ''}
        onChange={(v) => set('signatures', [v])}
        error={errors['authorization.signatures.0']}
      />

      <div className="field max-w-[220px]">
        <span className="field-label">
          Date
          <span className="ml-1 text-rate" aria-hidden="true">
            *
          </span>
        </span>
        <div className="input flex items-center bg-paper font-mono tabular-nums text-ink-2">
          {today}
        </div>
        <p className="field-hint">Populated automatically</p>
      </div>
    </div>
  )
}

export { DocumentsStep }
