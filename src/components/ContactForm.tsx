import { useState } from 'react'
import { CheckIcon, LockSimpleIcon } from '@phosphor-icons/react'
import { SelectInput, TextArea, TextInput } from '../apply/fields'

type Values = { name: string; email: string; phone: string; business: string; topic: string; message: string }

const empty: Values = { name: '', email: '', phone: '', business: '', topic: '', message: '' }

/**
 * ⚠️ Posts nowhere yet. Wire to a real endpoint with server-side validation,
 * rate limiting and bot protection before launch — see SECURITY-NOTES.md.
 */
export function ContactForm({
  topics,
  submitLabel = 'Send message',
  successTitle = 'Message sent',
  successBody = "We'll get back to you within one business day.",
}: {
  topics: { value: string; label: string }[]
  submitLabel?: string
  successTitle?: string
  successBody?: string
}) {
  const [v, setV] = useState<Values>(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  const set = (k: keyof Values, val: string) => setV((s) => ({ ...s, [k]: val }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!v.name.trim()) next.name = 'Required'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v.email)) next.email = 'Enter a full email address'
    if (v.phone.replace(/\D/g, '').length !== 10) next.phone = 'Enter a 10-digit phone number'
    if (!v.topic) next.topic = 'Pick a topic'
    if (!v.message.trim()) next.message = 'Tell us how we can help'
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
        <h3 className="mt-5 text-h3 font-semibold text-ink">{successTitle}</h3>
        <p className="mt-2.5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-2">{successBody}</p>
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
        <TextInput label="Name" required value={v.name} onChange={(x) => set('name', x)} error={errors.name} autoComplete="name" />
        <TextInput label="Business name" value={v.business} onChange={(x) => set('business', x)} autoComplete="organization" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput label="Email" required type="email" value={v.email} onChange={(x) => set('email', x)} error={errors.email} autoComplete="email" />
        <TextInput label="Mobile phone" required type="tel" value={v.phone} onChange={(x) => set('phone', x)} error={errors.phone} autoComplete="tel" />
      </div>
      <SelectInput label="What's this about?" required value={v.topic} onChange={(x) => set('topic', x)} options={topics} error={errors.topic} />
      <TextArea label="How can we help?" required rows={5} value={v.message} onChange={(x) => set('message', x)} error={errors.message} />

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-5">
        <p className="flex items-center gap-2 text-[0.8125rem] text-ink-3">
          <LockSimpleIcon size={14} />
          Your information is never sold.
        </p>
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
      </div>
    </form>
  )
}
