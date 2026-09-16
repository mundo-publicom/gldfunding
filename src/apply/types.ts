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
  currentBalance: string
  frequency: 'daily' | 'weekly' | 'monthly' | ''
  paymentAmount: string
  /** Kept so older drafts don't throw on restore. No longer collected. */
  originalAmount?: string
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

export type PlaidStatus = 'idle' | 'connecting' | 'connected' | 'failed'

export type ApplicationData = {
  /* --- pre-check (no PII) --- */
  precheck: {
    monthlyRevenue: string
    timeInBusiness: string
    industry: string
    completed: boolean
  }
  /* --- 1. business & funding --- */
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
     How many owners the applicant declared in step 1. Owner forms themselves
     stay collapsed until the merchant adds (or is prompted for) the next one.
  */
  ownerCount: number
  /** How many owner forms are currently on screen. Always ≥ 1, ≤ ownerCount. */
  ownersRevealed: number
  owners: Owner[]
  /* --- 1. funding (same step as business) --- */
  funding: {
    amountRequested: string
    useOfFunds: string
    /** No longer asked. Kept so older drafts restore cleanly. */
    urgency?: string
  }
  /* --- 3. existing financing --- */
  hasExistingFinancing: boolean | null
  positions: Position[]
  /* --- 3. bank statements --- */
  documents: {
    method: 'upload' | 'plaid' | ''
    plaidStatus: PlaidStatus
    statements: UploadedFile[]
  }
  /* --- 4. review & sign --- */
  authorization: {
    certified: boolean
    fullName: string
    title: string
    /** One data-URL signature for the applicant signing this submission. */
    signatures: string[]
    date: string
    /** Audit record. Must be persisted server-side to be defensible under E-SIGN/UETA. */
    audit: {
      signedAt: string
      userAgent: string
      authVersion: string
      applicationId: string
    } | null
  }
}

/** The authorization text version signed. Bump when counsel revises the language. */
export const AUTH_VERSION = 'gld-app-auth-2026-09'

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

export const emptyPosition = (): Position => ({
  funder: '',
  currentBalance: '',
  frequency: '',
  paymentAmount: '',
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
  ownersRevealed: 1,
  owners: [emptyOwner()],
  funding: { amountRequested: '', useOfFunds: '' },
  hasExistingFinancing: null,
  positions: [],
  documents: { method: '', plaidStatus: 'idle', statements: [] },
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

   Four steps, always. Extra owners and extra financing positions are
   conditional fields on those steps, never extra screens.
   ------------------------------------------------------------------ */

/** Beyond this, underwriting takes the extra owners on a separate schedule. */
export const MAX_OWNERS = 4

export const OWNER_COUNT_OPTIONS = Array.from({ length: MAX_OWNERS }, (_, i) => ({
  value: String(i + 1),
  label: i === 0 ? '1 owner' : `${i + 1} owners`,
}))

/** Declared owner count, clamped - a restored or hand-edited payload cannot
    make the form generate a thousand owner slots. */
export const ownerCount = (d: ApplicationData) =>
  Math.min(Math.max(Math.trunc(d.ownerCount) || 1, 1), MAX_OWNERS)

/** Owner forms currently on screen. Starts at 1; grows via add / continue. */
export const ownersRevealed = (d: ApplicationData) =>
  Math.min(Math.max(Math.trunc(d.ownersRevealed) || 1, 1), ownerCount(d))

/** The owners this application actually covers, padded if the roster is short. */
export const activeOwners = (d: ApplicationData): Owner[] =>
  Array.from({ length: ownerCount(d) }, (_, i) => d.owners[i] ?? emptyOwner())

export const ownerHasData = (o: Owner | undefined) =>
  Boolean(o && Object.values(o).some((v) => String(v).trim().length > 0))

export type StepId = 'business' | 'owner' | 'documents' | 'review'

export type StepDef = {
  id: StepId
  title: string
  shortTitle: string
}

export const STEPS: StepDef[] = [
  { id: 'business', title: 'Business & Funding Information', shortTitle: 'Business & Funding' },
  { id: 'owner', title: 'Owner Information', shortTitle: 'Owner' },
  { id: 'documents', title: 'Bank Statements & Existing Financing', shortTitle: 'Bank & Financing' },
  { id: 'review', title: 'Review & Sign', shortTitle: 'Review & Sign' },
]

export function visibleSteps(_d?: ApplicationData): StepDef[] {
  return STEPS
}

/** Statement months we ask for. */
export const requiredStatements = (_d: ApplicationData) => PRODUCT.statementMonths

/**
 * Files that must actually be attached before the step will pass.
 *
 * We ask for the full statement period, but one file is enough to continue -
 * most banks issue a single PDF covering every month, and holding an
 * application hostage to a file count is how applicants abandon at the last
 * step. Anything missing is chased after review.
 */
export const requiredUploads = 1

/** Last-four mask only. Full SSN must never appear on review. */
export const maskSsn = (ssn: string) => {
  const d = ssn.replace(/\D/g, '')
  if (d.length < 9) return 'On file'
  return `•••-••-${d.slice(-4)}`
}
