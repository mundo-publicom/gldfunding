import type { ApplicationData, Owner, StepId } from './types'
import { emptyOwner, ownersRevealed, requiredUploads } from './types'

type Errors = Record<string, string>

const req = (v: string) => v.trim().length > 0
const digits = (v: string) => v.replace(/\D/g, '')

/** Messages say how to fix it, not that something is wrong. */
const M = {
  required: 'Required',
  email: 'Enter a full email address, like you@business.com',
  phone: 'Enter a 10-digit phone number',
  zip: 'Enter a 5-digit ZIP code',
  ein: 'Enter your 9-digit EIN',
  ssn: 'Enter a 9-digit Social Security number',
  amount: 'Enter an amount',
}

function validateOwner(o: Owner, prefix: string, e: Errors) {
  if (!req(o.firstName)) e[`${prefix}.firstName`] = M.required
  if (!req(o.lastName)) e[`${prefix}.lastName`] = M.required
  if (!req(o.title)) e[`${prefix}.title`] = M.required
  if (!req(o.ownership)) e[`${prefix}.ownership`] = M.required
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(o.email)) e[`${prefix}.email`] = M.email
  if (digits(o.phone).length !== 10) e[`${prefix}.phone`] = M.phone
  if (!req(o.street)) e[`${prefix}.street`] = M.required
  if (!req(o.city)) e[`${prefix}.city`] = M.required
  if (!req(o.state)) e[`${prefix}.state`] = M.required
  if (digits(o.zip).length !== 5) e[`${prefix}.zip`] = M.zip
  if (!req(o.dob)) e[`${prefix}.dob`] = M.required
  if (digits(o.ssn).length !== 9) e[`${prefix}.ssn`] = M.ssn
}

export function validateStep(step: StepId, d: ApplicationData): Errors {
  const e: Errors = {}

  switch (step) {
    case 'business': {
      const b = d.business
      if (!req(b.legalName)) e['business.legalName'] = M.required
      if (!req(b.entityType)) e['business.entityType'] = M.required
      if (digits(b.ein).length !== 9) e['business.ein'] = M.ein
      if (!req(b.street)) e['business.street'] = M.required
      if (!req(b.city)) e['business.city'] = M.required
      if (!req(b.state)) e['business.state'] = M.required
      if (digits(b.zip).length !== 5) e['business.zip'] = M.zip
      if (digits(b.phone).length !== 10) e['business.phone'] = M.phone
      if (!req(b.industry)) e['business.industry'] = M.required
      if (!req(b.startDate)) e['business.startDate'] = M.required
      if (!req(b.monthlyRevenue)) e['business.monthlyRevenue'] = M.amount
      if (!d.ownerCount) e['ownerCount'] = M.required
      if (!req(d.funding.amountRequested)) e['funding.amountRequested'] = M.amount
      if (!req(d.funding.useOfFunds)) e['funding.useOfFunds'] = M.required
      break
    }

    case 'owner': {
      const shown = ownersRevealed(d)
      for (let i = 0; i < shown; i++) {
        validateOwner(d.owners[i] ?? emptyOwner(), `owners.${i}`, e)
      }
      break
    }

    case 'documents': {
      const connected = d.documents.method === 'plaid' && d.documents.plaidStatus === 'connected'
      const connecting = d.documents.method === 'plaid' && d.documents.plaidStatus === 'connecting'
      if (connecting) {
        e['documents'] = 'Wait for the bank connection to finish, or upload statements instead'
        break
      }
      if (!connected) {
        const done = d.documents.statements.filter((f) => f.status === 'done').length
        if (done < requiredUploads) {
          e['documents'] =
            d.documents.plaidStatus === 'failed'
              ? 'Bank connection did not finish. Upload at least one statement to continue'
              : 'Attach at least one bank statement, or connect your bank instead'
        }
      }

      if (d.hasExistingFinancing === null) {
        e['hasExistingFinancing'] = 'Answer yes or no to continue'
      } else if (d.hasExistingFinancing) {
        d.positions.forEach((p, i) => {
          if (!req(p.funder)) e[`positions.${i}.funder`] = M.required
          if (!req(p.currentBalance)) e[`positions.${i}.currentBalance`] = M.amount
          if (!req(p.frequency)) e[`positions.${i}.frequency`] = M.required
          if (!req(p.paymentAmount)) e[`positions.${i}.paymentAmount`] = M.amount
        })
      }
      break
    }

    case 'review': {
      const a = d.authorization
      if (!a.communicationsConsent) {
        e['authorization.communicationsConsent'] =
          'Confirm you agree to be contacted about this application'
      }
      if (!req(a.fullName)) e['authorization.fullName'] = M.required
      if (!a.signatures[0]) e['authorization.signatures.0'] = 'Sign above to continue'
      break
    }
  }

  return e
}
