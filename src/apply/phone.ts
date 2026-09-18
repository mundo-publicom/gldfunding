/** National 10-digit NANP number, whether stored as E.164 or typed locally. */
export function nationalPhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, '')
  return digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
}

export function isUsPhone(value: string): boolean {
  return nationalPhoneDigits(value).length === 10
}

export function formatUsPhone(value: string): string {
  const n = nationalPhoneDigits(value)
  if (n.length !== 10) return value
  return `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}`
}
