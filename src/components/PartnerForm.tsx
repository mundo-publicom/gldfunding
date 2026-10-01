import { useState } from 'react'
import { CheckIcon, LockSimpleIcon } from '@phosphor-icons/react'
import { SelectInput, TextArea, TextInput } from '../apply/fields'
import { PhoneInput } from '../apply/PhoneInput'
import { isUsPhone } from '../apply/phone'

type Values = { name: string; company: string; email: string; phone: string; partnerType: string; volume: string; message: string }

const empty: Values = { name: '', company: '', email: '', phone: '', partnerType: '', volume: '', message: '' }

const PARTNER_TYPES = [
  { value: 'iso', label: 'ISO' },
  { value: 'broker', label: 'Broker' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'equipment-vendor', label: 'Equipment Vendor' },
  { value: 'pos-provider', label: 'POS Provider' },
  { value: 'other', label: 'Other' },
]

const VOLUMES = [
  { value: 'starting', label: 'Just getting started' },
  { value: '1-5', label: '1–5 deals' },
  { value: '6-15', label: '6–15 deals' },
  { value: '16-30', label: '16–30 deals' },
  { value: '30+', label: '30+ deals' },
]

/**
 * ⚠️ Posts nowhere yet. Wire to a real endpoint with server-side validation,
 * rate limiting and bot protection before launch - see SECURITY-NOTES.md.
 */
export function PartnerForm() {
  const [v, setV] = useState<Values>(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  const set = (k: keyof Values, val: string) => setV((s) => ({ ...s, [k]: val }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!v.name.trim()) next.name = 'Required'
    if (!v.company.trim()) next.company = 'Required'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v.email)) next.email = 'Enter a full email address'
    if (!isUsPhone(v.phone)) next.phone = 'Enter a 10-digit US phone number'
    if (!v.partnerType) next.partnerType = 'Pick a partner type'
    setErrors(next)
    if (Object.keys(next).length) return
    setSent(true)
  }

  if (sent) {
    return (
      <div className="card flex flex-col items-start p-7">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-good text-good">
          <CheckIcon size={20} weight="bold" />
        </span>
        <h3 className="mt-5 text-h3 font-semibold text-ink">Partner request received</h3>
        <p className="mt-2.5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-2">
          A partnership manager will be in touch within one business day to set up your account.
        </p>
        <button
          type="button"
          onClick={() => {
            setV(empty)
            setSent(false)
          }}
          className="mt-5 text-[0.875rem] font-medium text-leaf-deep underline underline-offset-[3px]"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="card flex flex-col gap-5 p-6 lg:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput label="Full name" required value={v.name} onChange={(x) => set('name', x)} error={errors.name} autoComplete="name" />
        <TextInput label="Company / ISO name" required value={v.company} onChange={(x) => set('company', x)} error={errors.company} autoComplete="organization" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput label="Email" required type="email" value={v.email} onChange={(x) => set('email', x)} error={errors.email} autoComplete="email" />
        <PhoneInput label="Mobile phone" required value={v.phone} onChange={(x) => set('phone', x)} error={errors.phone} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectInput label="Partner type" required value={v.partnerType} onChange={(x) => set('partnerType', x)} options={PARTNER_TYPES} error={errors.partnerType} />
        <SelectInput label="Aprox. monthly volume" value={v.volume} onChange={(x) => set('volume', x)} options={VOLUMES} hint="Optional" />
      </div>
      <TextArea label="How can we help?" rows={4} value={v.message} onChange={(x) => set('message', x)} hint="Optional" />

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-5">
        <p className="flex items-center gap-2 text-[0.8125rem] text-ink-3">
          <LockSimpleIcon size={14} />
          Your information is never sold.
        </p>
        <button type="submit" className="btn btn-primary">Become a Partner</button>
      </div>
    </form>
  )
}
