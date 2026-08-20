import type { ApplicationData, Owner, StepId } from './types'
import { requiredStatements } from './types'
import { PRODUCT } from '../data/site'

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
      break
    }

    case 'owner': {
      validateOwner(d.owner, 'owner', e)
      const pct = Number(digits(d.owner.ownership)) || 0
      // Only demand the second-owner answer when the question was actually asked.
      if (pct > 0 && pct < 100 && d.hasSecondOwner === null) {
        e['hasSecondOwner'] = 'Let us know so we can skip the next step if it does not apply'
      }
      break
    }

    case 'owner2':
      validateOwner(d.owner2, 'owner2', e)
      break

    case 'funding': {
      if (!req(d.funding.amountRequested)) e['funding.amountRequested'] = M.amount
      if (!req(d.funding.useOfFunds)) e['funding.useOfFunds'] = M.required
      if (!req(d.funding.urgency)) e['funding.urgency'] = M.required
      break
    }

    case 'financing': {
      if (d.hasExistingFinancing === null) {
        e['hasExistingFinancing'] = 'Answer yes or no to continue'
        break
      }
      if (d.hasExistingFinancing) {
        d.positions.forEach((p, i) => {
          if (!req(p.funder)) e[`positions.${i}.funder`] = M.required
          if (!req(p.originalAmount)) e[`positions.${i}.originalAmount`] = M.amount
          if (!req(p.currentBalance)) e[`positions.${i}.currentBalance`] = M.amount
          if (!req(p.frequency)) e[`positions.${i}.frequency`] = M.required
          if (!req(p.paymentAmount)) e[`positions.${i}.paymentAmount`] = M.amount
        })
      }
      break
    }

    case 'documents': {
      if (d.documents.method === 'plaid') break
      const done = d.documents.statements.filter((f) => f.status === 'done').length
      const need = requiredStatements(d)
      if (done < need) {
        e['documents'] =
          `Add ${need - done} more statement${need - done === 1 ? '' : 's'}, or connect your bank instead`
      }
      break
    }

    case 'authorization': {
      const a = d.authorization
      if (!a.certified) e['authorization.certified'] = 'Tick the box to continue'
      if (!req(a.fullName)) e['authorization.fullName'] = M.required
      if (!req(a.title)) e['authorization.title'] = M.required
      if (!a.signature) e['authorization.signature'] = 'Sign above to continue'
      if (d.hasSecondOwner === true && !a.signature2) {
        e['authorization.signature2'] = `A second signature is required for owners at ${PRODUCT.secondOwnerThreshold}% or more`
      }
      break
    }
  }

  return e
}
