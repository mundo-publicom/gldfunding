import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { SelectInput, SignaturePad, TextInput, YesNo } from './fields'
import { DocumentsStep } from './DocumentsStep'
import { AuthorizationText } from './AuthorizationText'
import type { ApplicationData, Owner, Position, StepProps } from './types'
import { PRODUCT, US_STATE_OPTIONS, INDUSTRIES } from '../data/site'

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

/* ================================================================ 1 */

export function BusinessStep({ data, update, errors }: StepProps) {
  const set = (k: keyof ApplicationData['business'], v: string) =>
    update('business', { ...data.business, [k]: v })

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

      <TextInput
        label="Business street address"
        required
        value={data.business.street}
        onChange={(v) => set('street', v)}
        error={errors['business.street']}
        autoComplete="street-address"
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <TextInput
          label="City"
          required
          value={data.business.city}
          onChange={(v) => set('city', v)}
          error={errors['business.city']}
          autoComplete="address-level2"
        />
        {/* State drives statement count, disclosure copy and licensing notes downstream. */}
        <SelectInput
          label="State"
          required
          value={data.business.state}
          onChange={(v) => set('state', v)}
          options={US_STATE_OPTIONS}
          error={errors['business.state']}
        />
        <TextInput
          label="ZIP"
          required
          value={data.business.zip}
          onChange={(v) => set('zip', v)}
          error={errors['business.zip']}
          inputMode="numeric"
          autoComplete="postal-code"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextInput
          label="Business phone"
          required
          type="tel"
          value={data.business.phone}
          onChange={(v) => set('phone', v)}
          error={errors['business.phone']}
          autoComplete="tel"
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
          hint={`Minimum ${PRODUCT.minMonthsInBusiness} months in business`}
        />
        <TextInput
          label="Average monthly revenue"
          required
          value={data.business.monthlyRevenue}
          onChange={(v) => set('monthlyRevenue', v)}
          error={errors['business.monthlyRevenue']}
          inputMode="numeric"
          placeholder="$50,000"
        />
      </div>
    </div>
  )
}

/* ================================================================ 2 & 3 */

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
        <TextInput
          label="Mobile phone"
          required
          type="tel"
          value={owner.phone}
          onChange={(v) => set('phone', v)}
          error={errors[`${prefix}.phone`]}
          autoComplete="tel"
        />
      </div>

      <TextInput
        label="Home address"
        required
        value={owner.street}
        onChange={(v) => set('street', v)}
        error={errors[`${prefix}.street`]}
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <TextInput
          label="City"
          required
          value={owner.city}
          onChange={(v) => set('city', v)}
          error={errors[`${prefix}.city`]}
        />
        <SelectInput
          label="State"
          required
          value={owner.state}
          onChange={(v) => set('state', v)}
          options={US_STATE_OPTIONS}
          error={errors[`${prefix}.state`]}
        />
        <TextInput
          label="ZIP"
          required
          value={owner.zip}
          onChange={(v) => set('zip', v)}
          error={errors[`${prefix}.zip`]}
          inputMode="numeric"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextInput
          label="Date of birth"
          required
          type="date"
          value={owner.dob}
          onChange={(v) => set('dob', v)}
          error={errors[`${prefix}.dob`]}
        />
        <TextInput
          label="Social Security number"
          required
          value={owner.ssn}
          onChange={(v) => set('ssn', v)}
          error={errors[`${prefix}.ssn`]}
          inputMode="numeric"
          placeholder="•••-••-••••"
          hint="Encrypted in transit and at rest. Used for identity verification only."
        />
      </div>
    </div>
  )
}

export function OwnerStep({ data, update, errors }: StepProps) {
  const ownership = Number(data.owner.ownership.replace(/[^0-9.]/g, '')) || 0
  // The trigger: anything short of full ownership raises exactly one question.
  const askSecond = ownership > 0 && ownership < 100

  return (
    <div className="flex flex-col gap-8">
      <OwnerFields
        owner={data.owner}
        onChange={(o) => update('owner', o)}
        errors={errors}
        prefix="owner"
      />

      {askSecond && (
        <div className="border-t border-rule pt-8">
          <YesNo
            label={`Is there another owner with ${PRODUCT.secondOwnerThreshold}% or more of the business?`}
            hint={`You listed ${ownership}% ownership. Owners at or above ${PRODUCT.secondOwnerThreshold}% must also authorize the application.`}
            value={data.hasSecondOwner}
            onChange={(v) => update('hasSecondOwner', v)}
            error={errors['hasSecondOwner']}
          />
        </div>
      )}
    </div>
  )
}

export function Owner2Step({ data, update, errors }: StepProps) {
  return (
    <OwnerFields
      owner={data.owner2}
      onChange={(o) => update('owner2', o)}
      errors={errors}
      prefix="owner2"
    />
  )
}

/* ================================================================ 4 */

export function FundingStep({ data, update, errors }: StepProps) {
  const set = (k: keyof ApplicationData['funding'], v: string) =>
    update('funding', { ...data.funding, [k]: v })

  return (
    <div className="flex flex-col gap-6">
      <TextInput
        label="How much are you looking for?"
        required
        value={data.funding.amountRequested}
        onChange={(v) => set('amountRequested', v)}
        error={errors['funding.amountRequested']}
        inputMode="numeric"
        placeholder="$50,000"
        hint="Advances range from $10,000 to $500,000. An estimate is fine."
        className="max-w-md"
      />

      <SelectInput
        label="What will you use it for?"
        required
        value={data.funding.useOfFunds}
        onChange={(v) => set('useOfFunds', v)}
        error={errors['funding.useOfFunds']}
        className="max-w-md"
        options={[
          { value: 'inventory', label: 'Inventory or supplies' },
          { value: 'equipment', label: 'Equipment purchase or repair' },
          { value: 'payroll', label: 'Payroll' },
          { value: 'expansion', label: 'Expansion or renovation' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'cash-flow', label: 'Bridging a cash-flow gap' },
          { value: 'debt', label: 'Consolidating existing financing' },
          { value: 'other', label: 'Other' },
        ]}
      />

      <SelectInput
        label="How soon do you need the funds?"
        required
        value={data.funding.urgency}
        onChange={(v) => set('urgency', v)}
        error={errors['funding.urgency']}
        className="max-w-md"
        options={[
          { value: 'immediately', label: 'Immediately' },
          { value: 'this-week', label: 'Within a week' },
          { value: 'this-month', label: 'Within a month' },
          { value: 'exploring', label: 'Just exploring options' },
        ]}
      />
    </div>
  )
}

/* ================================================================ 5 */

const emptyPosition = (): Position => ({
  funder: '',
  originalAmount: '',
  currentBalance: '',
  frequency: '',
  paymentAmount: '',
})

export function FinancingStep({ data, update, errors }: StepProps) {
  const setPosition = (i: number, p: Position) => {
    const next = [...data.positions]
    next[i] = p
    update('positions', next)
  }

  return (
    <div className="flex flex-col gap-8">
      {/*
        One question first. "No" closes the step immediately — this is where
        paper applications lose people, because they show the full grid to
        everyone regardless.
      */}
      <YesNo
        label="Do you have any existing advances or business loans?"
        hint="Including any merchant cash advance, term loan, or line of credit currently outstanding."
        value={data.hasExistingFinancing}
        onChange={(v) => {
          update('hasExistingFinancing', v)
          if (v && data.positions.length === 0) update('positions', [emptyPosition()])
          if (!v) update('positions', [])
        }}
        error={errors['hasExistingFinancing']}
      />

      {data.hasExistingFinancing === true && (
        <div className="flex flex-col gap-5 border-t border-rule pt-8">
          {data.positions.map((pos, i) => (
            <div key={i} className="card p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
                  Position {i + 1}
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
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextInput
                    label="Funder / lender"
                    required
                    value={pos.funder}
                    onChange={(v) => setPosition(i, { ...pos, funder: v })}
                    error={errors[`positions.${i}.funder`]}
                  />
                  <TextInput
                    label="Original amount"
                    required
                    value={pos.originalAmount}
                    onChange={(v) => setPosition(i, { ...pos, originalAmount: v })}
                    error={errors[`positions.${i}.originalAmount`]}
                    inputMode="numeric"
                    placeholder="$25,000"
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <TextInput
                    label="Current balance"
                    required
                    value={pos.currentBalance}
                    onChange={(v) => setPosition(i, { ...pos, currentBalance: v })}
                    error={errors[`positions.${i}.currentBalance`]}
                    inputMode="numeric"
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
                  <TextInput
                    label="Payment amount"
                    required
                    value={pos.paymentAmount}
                    onChange={(v) => setPosition(i, { ...pos, paymentAmount: v })}
                    error={errors[`positions.${i}.paymentAmount`]}
                    inputMode="numeric"
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
            Add another position
          </button>
        </div>
      )}
    </div>
  )
}

export { DocumentsStep }

/* ================================================================ 7 */

export function AuthorizationStep({ data, update, errors }: StepProps) {
  const set = <K extends keyof ApplicationData['authorization']>(
    k: K,
    v: ApplicationData['authorization'][K],
  ) => update('authorization', { ...data.authorization, [k]: v })

  const today = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col gap-8">
      <AuthorizationText />

      {/* One certification checkbox carries the whole consent. */}
      <label className="flex cursor-pointer items-start gap-3.5 border-y border-rule py-5">
        <input
          type="checkbox"
          checked={data.authorization.certified}
          onChange={(e) => set('certified', e.target.checked)}
          className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer accent-[var(--color-mint-deep)]"
          aria-describedby="cert-err"
        />
        <span className="text-[0.9375rem] leading-relaxed text-ink-2">
          I certify that the information provided in this application is true and complete, and I
          acknowledge and agree to the applicable authorizations and disclosures above.
        </span>
      </label>
      {errors['authorization.certified'] && (
        <p id="cert-err" className="field-error -mt-6" role="alert">
          {errors['authorization.certified']}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <TextInput
          label="Full name"
          required
          value={data.authorization.fullName}
          onChange={(v) => set('fullName', v)}
          error={errors['authorization.fullName']}
          autoComplete="name"
        />
        <TextInput
          label="Title / position"
          required
          value={data.authorization.title}
          onChange={(v) => set('title', v)}
          error={errors['authorization.title']}
        />
      </div>

      <SignaturePad
        label="Electronic signature"
        required
        value={data.authorization.signature}
        onChange={(v) => set('signature', v)}
        error={errors['authorization.signature']}
      />

      {/* Owner #2's block appears only because step 3 was completed. */}
      {data.hasSecondOwner === true && (
        <div className="border-t border-rule pt-8">
          <p className="mb-5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
            Owner #2 · {data.owner2.firstName} {data.owner2.lastName}
          </p>
          <SignaturePad
            label="Owner #2 electronic signature"
            required
            value={data.authorization.signature2}
            onChange={(v) => set('signature2', v)}
            error={errors['authorization.signature2']}
          />
        </div>
      )}

      <div className="field max-w-[220px]">
        <span className="field-label">Date</span>
        <div className="input flex items-center bg-paper font-mono tabular-nums text-ink-2">
          {today}
        </div>
        <p className="field-hint">Populated automatically</p>
      </div>
    </div>
  )
}
