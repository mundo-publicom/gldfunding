import { STATES } from '../data/site'

export type AddressValue = {
  street: string
  city: string
  state: string
  zip: string
}

export type AddressSuggestion = {
  id: string
  primary: string
  secondary: string
  /** Full line sent to Address Validation when the merchant picks this row. */
  query: string
}

export type ValidatedAddress = AddressValue & {
  formatted: string
  /** City / state / ZIP that the service confirmed for this street. */
  confirmed: boolean
  warning?: string
}

const STATE_BY_ABBR = new Map(STATES.map((s) => [s.abbr.toUpperCase(), s.abbr]))
const STATE_BY_NAME = new Map(STATES.map((s) => [s.name.toLowerCase(), s.abbr]))

export function normalizeState(raw: string): string {
  const t = raw.trim()
  if (!t) return ''
  if (t.length === 2) return STATE_BY_ABBR.get(t.toUpperCase()) ?? t.toUpperCase()
  return STATE_BY_NAME.get(t.toLowerCase()) ?? t
}

export function normalizeZip(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 5)
}

export function normalizeCity(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[.]/g, '')
    .replace(/\s+/g, ' ')
}

export function formatAddressLine(a: AddressValue): string {
  const locality = [a.city, a.state, a.zip].filter(Boolean).join(' ')
  return [a.street, locality].filter(Boolean).join(', ')
}

export function sameCityStateZip(a: AddressValue, b: AddressValue): boolean {
  return (
    normalizeCity(a.city) === normalizeCity(b.city) &&
    normalizeState(a.state) === normalizeState(b.state) &&
    normalizeZip(a.zip) === normalizeZip(b.zip)
  )
}

type NamedComponent = {
  type: string
  name: string
}

export function streetFromComponents(components: NamedComponent[]): string {
  const get = (type: string) => components.find((c) => c.type === type)?.name?.trim() ?? ''
  const number = get('street_number')
  const route = get('route')
  const unit = get('subpremise')
  const street = [number, route].filter(Boolean).join(' ')
  if (!street) return unit
  if (!unit) return street
  const unitLabel = /^(#|apt|apartment|suite|ste|unit|fl|floor|bldg|building)\b/i.test(unit)
    ? unit
    : `#${unit}`
  return `${street}, ${unitLabel}`
}

export function cityFromComponents(components: NamedComponent[]): string {
  const order = ['locality', 'postal_town', 'sublocality_level_1', 'sublocality', 'neighborhood']
  for (const type of order) {
    const hit = components.find((c) => c.type === type)?.name?.trim()
    if (hit) return hit
  }
  return ''
}

export function parseValidationResult(result: {
  formatted?: string
  street?: string
  city?: string
  state?: string
  zip?: string
  confirmed?: boolean
  warning?: string
}): ValidatedAddress | null {
  const street = (result.street ?? '').trim()
  const city = (result.city ?? '').trim()
  const state = normalizeState(result.state ?? '')
  const zip = normalizeZip(result.zip ?? '')
  if (!street && !city) return null
  const value = { street, city, state, zip }
  return {
    ...value,
    formatted: result.formatted?.trim() || formatAddressLine(value),
    confirmed: result.confirmed ?? Boolean(street && city && state && zip.length === 5),
    warning: result.warning,
  }
}

export const CITY_STATE_ZIP_WARNING =
  'City, state, and ZIP do not match this street. Check the combination, or pick an address from the list.'
