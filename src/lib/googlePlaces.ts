/// <reference types="google.maps" />
import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import {
  CITY_STATE_ZIP_WARNING,
  cityFromComponents,
  parseValidationResult,
  streetFromComponents,
  type AddressSuggestion,
  type AddressValue,
  type ValidatedAddress,
} from '../apply/address'

export type PlacesMock = {
  suggest: (input: string) => AddressSuggestion[]
  validate: (query: string, current?: AddressValue) => ValidatedAddress | null
}

type Session = google.maps.places.AutocompleteSessionToken

let configured = false
let session: Session | null = null
let requestSeq = 0

export function mapsApiKey(): string {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? ''
}

export function placesConfigured(): boolean {
  return Boolean(mapsApiKey() || mock())
}

function mock(): PlacesMock | undefined {
  if (typeof window === 'undefined') return undefined
  return window.__GLD_PLACES_MOCK__
}

async function ensureConfigured(): Promise<boolean> {
  if (mock()) return true
  const key = mapsApiKey()
  if (!key || typeof window === 'undefined') return false
  if (!configured) {
    setOptions({
      key,
      v: 'weekly',
      language: 'en-US',
      region: 'US',
    })
    configured = true
  }
  return true
}

async function placesLib() {
  await ensureConfigured()
  return importLibrary('places')
}

async function validationLib() {
  await ensureConfigured()
  return importLibrary('addressValidation')
}

async function sessionToken(): Promise<Session> {
  if (session) return session
  const { AutocompleteSessionToken } = await placesLib()
  session = new AutocompleteSessionToken()
  return session
}

function resetSession() {
  session = null
}

export async function suggestAddresses(input: string): Promise<AddressSuggestion[]> {
  const q = input.trim()
  if (q.length < 3) return []

  const mocked = mock()
  if (mocked) return mocked.suggest(q)

  if (!(await ensureConfigured())) return []

  const seq = ++requestSeq
  try {
    const { AutocompleteSuggestion } = await placesLib()
    const token = await sessionToken()
    const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input: q,
      includedRegionCodes: ['us'],
      language: 'en-US',
      region: 'us',
      sessionToken: token,
    })
    if (seq !== requestSeq) return []
    return suggestions
      .map((s, i) => {
        const pred = s.placePrediction
        if (!pred) return null
        const query = pred.text?.toString() ?? ''
        const primary = pred.mainText?.toString() || query
        const secondary = pred.secondaryText?.toString() ?? ''
        return {
          id: pred.placeId || `${query}-${i}`,
          primary,
          secondary,
          query,
        }
      })
      .filter((s): s is AddressSuggestion => Boolean(s?.query))
  } catch {
    /* Fail open — the merchant can still type a legitimate address. */
    return []
  }
}

export async function resolveAddress(
  suggestion: AddressSuggestion,
): Promise<ValidatedAddress | null> {
  const mocked = mock()
  if (mocked) return mocked.validate(suggestion.query)

  if (!(await ensureConfigured())) return null

  try {
    const { AddressValidation } = await validationLib()
    const token = session
    const result = await AddressValidation.fetchAddressValidation({
      address: {
        regionCode: 'US',
        addressLines: [suggestion.query],
      },
      sessionToken: token ?? undefined,
      uspsCASSEnabled: true,
    })
    resetSession()
    return fromValidation(result)
  } catch {
    resetSession()
    return fallbackFromSuggestion(suggestion)
  }
}

export async function validateEnteredAddress(
  value: AddressValue,
): Promise<ValidatedAddress | null> {
  const street = value.street.trim()
  const city = value.city.trim()
  const state = value.state.trim()
  const zip = value.zip.trim()
  if (!street || !city || !state || zip.replace(/\D/g, '').length !== 5) return null

  const mocked = mock()
  if (mocked) return mocked.validate([street, city, state, zip].join(', '), value)

  if (!(await ensureConfigured())) return null

  try {
    const { AddressValidation } = await validationLib()
    const result = await AddressValidation.fetchAddressValidation({
      address: {
        regionCode: 'US',
        addressLines: [street],
        locality: city,
        administrativeArea: state,
        postalCode: zip,
      },
      uspsCASSEnabled: true,
    })
    return fromValidation(result, value)
  } catch {
    return null
  }
}

function fallbackFromSuggestion(suggestion: AddressSuggestion): ValidatedAddress | null {
  return parseValidationResult({
    street: suggestion.primary,
    formatted: suggestion.query,
    confirmed: false,
  })
}

function fromValidation(
  result: google.maps.addressValidation.AddressValidation,
  entered?: AddressValue,
): ValidatedAddress | null {
  const usps = result.uspsData?.standardizedAddress
  const postal = result.address?.postalAddress
  const components = (result.address?.components ?? []).map((c) => ({
    type: c.componentType ?? '',
    name: c.componentName ?? '',
  }))

  const street =
    usps?.firstAddressLine?.trim() ||
    streetFromComponents(components) ||
    postal?.addressLines?.[0]?.trim() ||
    ''
  const city =
    usps?.city?.trim() ||
    postal?.locality?.trim() ||
    cityFromComponents(components)
  const state = usps?.state?.trim() || postal?.administrativeArea?.trim() || ''
  const zip = usps?.zipCode?.trim() || postal?.postalCode?.trim() || ''
  const formatted =
    result.address?.formattedAddress?.trim() ||
    usps?.cityStateZipAddressLine?.trim() ||
    ''

  const parsed = parseValidationResult({
    street,
    city,
    state,
    zip,
    formatted,
    confirmed: Boolean(result.verdict?.addressComplete),
  })
  if (!parsed) return null

  if (entered && !sameParts(entered, parsed)) {
    parsed.confirmed = false
    parsed.warning = CITY_STATE_ZIP_WARNING
  } else {
    const unconfirmed = result.address?.unconfirmedComponentTypes ?? []
    const localityOff = unconfirmed.some((t) =>
      ['locality', 'postal_code', 'administrative_area_level_1'].includes(t),
    )
    if (localityOff) {
      parsed.confirmed = false
      parsed.warning = CITY_STATE_ZIP_WARNING
    }
  }

  return parsed
}

function sameParts(a: AddressValue, b: AddressValue) {
  return (
    a.city.trim().toLowerCase() === b.city.trim().toLowerCase() &&
    a.state.trim().toUpperCase() === b.state.trim().toUpperCase() &&
    a.zip.replace(/\D/g, '').slice(0, 5) === b.zip.replace(/\D/g, '').slice(0, 5)
  )
}
