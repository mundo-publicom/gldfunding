import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { CheckCircleIcon, MapPinIcon } from '@phosphor-icons/react'
import { cn } from '../lib/cn'
import {
  mapsApiKey,
  placesConfigured,
  resolveAddress,
  suggestAddresses,
  validateEnteredAddress,
} from '../lib/googlePlaces'
import { Field, SelectInput, TextInput } from './fields'
import { US_STATE_OPTIONS } from '../data/site'
import type { AddressSuggestion, AddressValue } from './address'

type Props = {
  value: AddressValue
  onChange: (next: AddressValue) => void
  errors?: Partial<Record<keyof AddressValue, string>>
  streetLabel: string
  streetName?: string
  required?: boolean
}

const DEBOUNCE_MS = 220
const VALIDATE_MS = 700

export function AddressFields({
  value,
  onChange,
  errors = {},
  streetLabel,
  streetName,
  required,
}: Props) {
  const streetId = useId()
  const listId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const seq = useRef(0)

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [flip, setFlip] = useState(false)
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [active, setActive] = useState(0)
  const [applied, setApplied] = useState<string>('')
  const [consistency, setConsistency] = useState<string>('')

  const queryLongEnough = value.street.trim().length >= 3
  const showList = open && queryLongEnough

  useLayoutEffect(() => {
    if (!showList) return
    const place = () => {
      const el = inputRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vv = window.visualViewport
      const viewH = vv?.height ?? window.innerHeight
      const viewTop = vv?.offsetTop ?? 0
      const keyboardReserve = 24
      const spaceBelow = viewH - (rect.bottom - viewTop) - keyboardReserve
      setFlip(spaceBelow < 180)
    }
    place()
    const vv = window.visualViewport
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    vv?.addEventListener('resize', place)
    vv?.addEventListener('scroll', place)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
      vv?.removeEventListener('resize', place)
      vv?.removeEventListener('scroll', place)
    }
  }, [showList, suggestions.length, loading])

  useEffect(() => {
    const q = value.street.trim()
    if (!open || q.length < 3) return
    setLoading(true)
    const id = ++seq.current
    const t = window.setTimeout(() => {
      void suggestAddresses(q).then((next) => {
        if (id !== seq.current) return
        setSuggestions(next)
        setActive(0)
        setLoading(false)
      })
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(t)
  }, [value.street, open])

  useEffect(() => {
    if (applied) return
    const ready =
      value.street.trim() &&
      value.city.trim() &&
      value.state.trim() &&
      value.zip.replace(/\D/g, '').length === 5
    if (!ready) return
    const t = window.setTimeout(() => {
      void validateEnteredAddress(value).then((result) => {
        setConsistency(result?.warning ?? '')
      })
    }, VALIDATE_MS)
    return () => window.clearTimeout(t)
  }, [applied, value])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: PointerEvent) => {
      const node = e.target as Node
      if (wrapRef.current?.contains(node)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onDoc)
    return () => document.removeEventListener('pointerdown', onDoc)
  }, [open])

  const pick = async (suggestion: AddressSuggestion) => {
    setOpen(false)
    setSuggestions([])
    const resolved = await resolveAddress(suggestion)
    if (!resolved) {
      onChange({ ...value, street: suggestion.primary })
      return
    }
    onChange({
      street: resolved.street || suggestion.primary,
      city: resolved.city,
      state: resolved.state,
      zip: resolved.zip,
    })
    setApplied(resolved.formatted)
    setConsistency(resolved.warning ?? '')
  }

  const editStreet = (street: string) => {
    if (applied) setApplied('')
    setConsistency('')
    onChange({ ...value, street })
    setOpen(true)
    if (street.trim().length >= 3) setLoading(true)
  }

  const editPart = (part: keyof AddressValue, next: string) => {
    if (applied) setApplied('')
    setConsistency('')
    onChange({ ...value, [part]: next })
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showList && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      if (suggestions.length) setOpen(true)
      return
    }
    if (!showList) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, Math.max(suggestions.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      const hit = suggestions[active]
      if (hit) {
        e.preventDefault()
        void pick(hit)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    }
  }

  useEffect(() => {
    itemRefs.current[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const describedBy = [
    errors.street ? `${streetId}-err` : applied ? `${streetId}-applied` : `${streetId}-hint`,
    showList ? listId : '',
  ]
    .filter(Boolean)
    .join(' ')

  const emptyCopy = !placesConfigured()
    ? import.meta.env.DEV && !mapsApiKey()
      ? 'Address lookup needs VITE_GOOGLE_MAPS_API_KEY in .env.local. You can still type the address below.'
      : 'No matching U.S. addresses yet. You can keep entering it in the fields below.'
    : 'No matching U.S. addresses. You can keep entering it in the fields below.'

  return (
    <div className="flex flex-col gap-6">
      <Field
        label={streetLabel}
        required={required}
        error={errors.street}
        htmlFor={streetId}
        hint={
          applied
            ? undefined
            : 'Start typing a U.S. address and pick a match, or enter one that is not listed.'
        }
      >
        <div ref={wrapRef} className="relative">
          <input
            ref={inputRef}
            id={streetId}
            name={streetName}
            className="input"
            value={value.street}
            onChange={(e) => editStreet(e.target.value)}
            onFocus={() => {
              setOpen(true)
              window.setTimeout(() => {
                inputRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
              }, 280)
            }}
            onBlur={() => {
              window.setTimeout(() => {
                if (wrapRef.current?.contains(document.activeElement)) return
                setOpen(false)
              }, 120)
            }}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showList}
            aria-controls={listId}
            aria-activedescendant={
              showList && suggestions[active] ? `${listId}-${active}` : undefined
            }
            aria-invalid={errors.street ? 'true' : undefined}
            aria-describedby={describedBy || undefined}
          />

          {showList && (
            <div
              id={listId}
              role="listbox"
              aria-label="Address suggestions"
              className={cn(
                'absolute left-0 right-0 z-50 flex max-h-[min(20rem,45vh)] flex-col overflow-hidden rounded-[4px] border border-rule bg-white shadow-panel',
                flip ? 'bottom-[calc(100%+6px)]' : 'top-[calc(100%+6px)]',
              )}
            >
              <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-1">
                {loading && suggestions.length === 0 && (
                  <li className="px-3.5 py-3 text-[0.875rem] text-ink-3">Looking up addresses…</li>
                )}
                {!loading && suggestions.length === 0 && (
                  <li className="px-3.5 py-3 text-[0.875rem] leading-snug text-ink-3">{emptyCopy}</li>
                )}
                {suggestions.map((s, i) => (
                  <li key={s.id} role="presentation">
                    <button
                      ref={(el) => {
                        itemRefs.current[i] = el
                      }}
                      type="button"
                      id={`${listId}-${i}`}
                      role="option"
                      aria-selected={i === active}
                      onPointerDown={(e) => e.preventDefault()}
                      onClick={() => void pick(s)}
                      onPointerEnter={() => setActive(i)}
                      className={cn(
                        'flex min-h-12 w-full items-start gap-3 px-3.5 py-2.5 text-left transition-colors duration-150',
                        i === active ? 'bg-leaf/10' : 'hover:bg-paper',
                      )}
                    >
                      <MapPinIcon
                        size={16}
                        className={cn(
                          'mt-0.5 shrink-0',
                          i === active ? 'text-leaf-deep' : 'text-ink-4',
                        )}
                      />
                      <span className="min-w-0">
                        <span className="block text-[0.9375rem] font-medium leading-snug text-ink">
                          {s.primary}
                        </span>
                        {s.secondary && (
                          <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-3">
                            {s.secondary}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="shrink-0 border-t border-rule-soft px-3.5 py-1.5 text-right font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-4">
                Powered by Google
              </p>
            </div>
          )}
        </div>
        {applied && !errors.street && (
          <p
            id={`${streetId}-applied`}
            className="flex items-start gap-1.5 text-[0.8125rem] leading-snug text-leaf-deep"
          >
            <CheckCircleIcon size={15} weight="fill" className="mt-0.5 shrink-0" />
            <span>Using {applied}</span>
          </p>
        )}
      </Field>

      <div className="grid gap-6 sm:grid-cols-3">
        <TextInput
          label="City"
          required={required}
          value={value.city}
          onChange={(v) => editPart('city', v)}
          error={errors.city}
          autoComplete="address-level2"
        />
        <SelectInput
          label="State"
          required={required}
          value={value.state}
          onChange={(v) => editPart('state', v)}
          options={US_STATE_OPTIONS}
          error={errors.state}
          autoComplete="address-level1"
        />
        <TextInput
          label="ZIP"
          required={required}
          value={value.zip}
          onChange={(v) => editPart('zip', v)}
          error={errors.zip}
          inputMode="numeric"
          autoComplete="postal-code"
        />
      </div>

      {!applied && consistency && !errors.city && !errors.state && !errors.zip && (
        <p className="field-error -mt-3" role="status">
          {consistency}
        </p>
      )}
    </div>
  )
}
