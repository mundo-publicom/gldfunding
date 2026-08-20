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
  /* --- 2. owner --- */
  owner: Owner
  /* --- 3. additional owner (conditional) --- */
  hasSecondOwner: boolean | null
  owner2: Owner
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
    signature: string // data URL
    signature2: string
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
  owner: emptyOwner(),
  hasSecondOwner: null,
  owner2: emptyOwner(),
  funding: { amountRequested: '', useOfFunds: '', urgency: '' },
  hasExistingFinancing: null,
  positions: [],
  documents: { method: '', statements: [] },
  authorization: {
    certified: false,
    fullName: '',
    title: '',
    signature: '',
    signature2: '',
    date: '',
    audit: null,
  },
})

/* ------------------------------------------------------------------
   Step model.

   The governing rule: only show a question when GLD needs the answer.
   `visible` decides whether a step exists at all for this applicant —
   a skipped step is never rendered, never numbered, and never appears
   as a greyed-out row in the review list.
   ------------------------------------------------------------------ */

export type StepId =
  | 'business'
  | 'owner'
  | 'owner2'
  | 'funding'
  | 'financing'
  | 'documents'
  | 'authorization'

export type StepDef = {
  id: StepId
  title: string
  shortTitle: string
  visible: (d: ApplicationData) => boolean
}

export const STEPS: StepDef[] = [
  { id: 'business', title: 'Business Information', shortTitle: 'Business', visible: () => true },
  { id: 'owner', title: 'Owner Information', shortTitle: 'Owner', visible: () => true },
  {
    id: 'owner2',
    title: 'Additional Owner',
    shortTitle: 'Additional owner',
    // Only when the primary owner told us there is one.
    visible: (d) => d.hasSecondOwner === true,
  },
  { id: 'funding', title: 'Funding Information', shortTitle: 'Funding', visible: () => true },
  {
    id: 'financing',
    title: 'Existing Financing',
    shortTitle: 'Existing financing',
    visible: () => true,
  },
  {
    id: 'documents',
    title: 'Bank Statements & Documents',
    shortTitle: 'Bank statements',
    visible: () => true,
  },
  {
    id: 'authorization',
    title: 'Authorization & Signature',
    shortTitle: 'Authorization & signature',
    visible: () => true,
  },
]

export const visibleSteps = (d: ApplicationData) => STEPS.filter((s) => s.visible(d))

/** Statement months required, derived from the business's state. */
export const requiredStatements = (d: ApplicationData) =>
  d.business.state === 'NY' ? PRODUCT.statementMonths.NY : PRODUCT.statementMonths.default
