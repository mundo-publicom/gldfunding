import { PRODUCT } from '../data/site'

export type StepProps = {
  data: ApplicationData
  update: <K extends keyof ApplicationData>(key: K, value: ApplicationData[K]) => void
  errors: Record<string, string>
}

export type Owner = {
  firstName: string
  lastName: string
  title: string
  ownership: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  dob: string
  ssn: string
}

export type Position = {
  funder: string
  originalAmount: string
  currentBalance: string
  frequency: 'daily' | 'weekly' | 'monthly' | ''
  paymentAmount: string
}

export type UploadedFile = {
  id: string
  name: string
  size: number
  /** 0–100. Real per-file progress, not a fake bar. */
  progress: number
  status: 'uploading' | 'done' | 'error'
  error?: string
}

export type ApplicationData = {
  /* --- pre-check (no PII) --- */
  precheck: {
    monthlyRevenue: string
    timeInBusiness: string
    industry: string
    completed: boolean
  }
  /* --- 1. business --- */
  business: {
    legalName: string
    dba: string
    entityType: string
    ein: string
    street: string
    city: string
    state: string
    zip: string
    phone: string
    industry: string
    startDate: string
    monthlyRevenue: string
  }
  /*
     --- 2…n. owners ---
     How many owners the applicant declared in step 1. Everything downstream
     — how many owner steps exist, how many signatures the authorization
     needs — is derived from this one number.
  */
  ownerCount: number
  owners: Owner[]
  /* --- 4. funding --- */
  funding: {
    amountRequested: string
    useOfFunds: string
    urgency: string
  }
  /* --- 5. existing financing --- */
  hasExistingFinancing: boolean | null
  positions: Position[]
  /* --- 6. documents --- */
  documents: {
    method: 'upload' | 'plaid' | ''
    statements: UploadedFile[]
  }
  /* --- 7. authorization --- */
  authorization: {
    certified: boolean
    fullName: string
    title: string
    /** One data-URL signature per owner, index-aligned with `owners`. */
    signatures: string[]
    date: string
    /** Audit record. Must be persisted server-side to be defensible under E-SIGN/UETA. */
    audit: {
      signedAt: string
      userAgent: string
      authVersion: string
    } | null
  }
}

/** The authorization text version signed. Bump when counsel revises the language. */
export const AUTH_VERSION = 'gld-app-auth-2026-08'

export const emptyOwner = (): Owner => ({
  firstName: '',
  lastName: '',
  title: '',
  ownership: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  dob: '',
  ssn: '',
})

export const emptyApplication = (): ApplicationData => ({
  precheck: { monthlyRevenue: '', timeInBusiness: '', industry: '', completed: false },
  business: {
    legalName: '',
    dba: '',
    entityType: '',
    ein: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    industry: '',
    startDate: '',
    monthlyRevenue: '',
  },
  ownerCount: 1,
  owners: [emptyOwner()],
  funding: { amountRequested: '', useOfFunds: '', urgency: '' },
  hasExistingFinancing: null,
  positions: [],
  documents: { method: '', statements: [] },
  authorization: {
    certified: false,
    fullName: '',
    title: '',
    signatures: [],
    date: '',
    audit: null,
  },
})

/* ------------------------------------------------------------------
   Step model.

   The governing rule: only show a question when GLD needs the answer.
   The step list is built per applicant rather than filtered from a fixed
   array — a step that does not apply is never rendered, never numbered,
   and never appears as a greyed-out row in the review list.

   Step 1 asks how many owners the business has, and that answer is what
   grows the middle of the form: one full owner step each, one signature
   each on the authorization.
   ------------------------------------------------------------------ */

/** Beyond this, underwriting takes the extra owners on a separate schedule. */
export const MAX_OWNERS = 4

export const OWNER_COUNT_OPTIONS = Array.from({ length: MAX_OWNERS }, (_, i) => ({
  value: String(i + 1),
  label: i === 0 ? '1 owner' : `${i + 1} owners`,
}))

/** Declared owner count, clamped — a restored or hand-edited payload cannot
    make the form generate a thousand steps. */
export const ownerCount = (d: ApplicationData) =>
  Math.min(Math.max(Math.trunc(d.ownerCount) || 1, 1), MAX_OWNERS)

/** The owners this application actually covers, padded if the roster is short. */
export const activeOwners = (d: ApplicationData): Owner[] =>
  Array.from({ length: ownerCount(d) }, (_, i) => d.owners[i] ?? emptyOwner())

export type StepId =
  | 'business'
  | `owner-${number}`
  | 'funding'
  | 'financing'
  | 'documents'
  | 'authorization'

export type StepDef = {
  id: StepId
  title: string
  shortTitle: string
  /** Set on owner steps only — which owner in the roster this step edits. */
  ownerIndex?: number
}

/** `owner-2` → 2; anything else → null. */
export const ownerIndexOf = (id: StepId): number | null => {
  const m = /^owner-(\d+)$/.exec(id)
  return m ? Number(m[1]) : null
}

export function visibleSteps(d: ApplicationData): StepDef[] {
  const total = ownerCount(d)
  const owners: StepDef[] = Array.from({ length: total }, (_, i) => ({
    id: `owner-${i}` as StepId,
    title: total === 1 ? 'Owner Information' : `Owner ${i + 1} Information`,
    shortTitle: total === 1 ? 'Owner' : `Owner ${i + 1}`,
    ownerIndex: i,
  }))

  return [
    { id: 'business', title: 'Business Information', shortTitle: 'Business' },
    ...owners,
    { id: 'funding', title: 'Funding Information', shortTitle: 'Funding' },
    { id: 'financing', title: 'Existing Financing', shortTitle: 'Existing financing' },
    { id: 'documents', title: 'Bank Statements & Documents', shortTitle: 'Bank statements' },
    {
      id: 'authorization',
      title: 'Authorization & Signature',
      shortTitle: 'Authorization & signature',
    },
  ]
}

/** Statement months we ask for, derived from the business's state. */
export const requiredStatements = (d: ApplicationData) =>
  d.business.state === 'NY' ? PRODUCT.statementMonths.NY : PRODUCT.statementMonths.default

/**
 * Files that must actually be attached before the step will pass.
 *
 * We ask for the full statement period, but one file is enough to continue —
 * most banks issue a single PDF covering every month, and holding an
 * application hostage to a file count is how applicants abandon at the last
 * step. Anything missing is chased after review.
 */
export const requiredUploads = 1
