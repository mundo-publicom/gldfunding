/**
 * Authorization copy shown on Review & Sign, and written into the downloadable
 * PDF at /legal/application-authorization.pdf.
 *
 * ⚠️ COUNSEL HOLD — do not treat this file as approved legal text.
 *
 * Counsel / compliance must confirm, against GLD's actual practices:
 *   1. Final language for every clause below (currently PLACEHOLDER).
 *   2. Whether a separate Communications Consent is required for calls, SMS
 *      and email, and whether that consent must cover autodialers / prerecorded
 *      voice (TCPA) versus application/servicing contact only.
 *   3. That this copy matches the MCA agreement and the site Terms
 *      ("Calls, texts and email") — a mismatch is an enforceability gap.
 *   4. Credit-report wording: "No credit inquiry during the eligibility check.
 *      Credit and background information may be obtained after you submit a
 *      full application and provide authorization."
 *
 * Do not paste another funder's marketing/SMS script here. When any clause
 * changes, bump AUTH_VERSION in types.ts and regenerate the PDF
 * (`node scripts/write-authorization-pdf.mjs`).
 */

export type AuthClause = {
  title: string
  summary: string
  full: string
}

export const AUTH_CLAUSES: AuthClause[] = [
  {
    title: 'Accuracy of Information',
    summary:
      'You confirm that everything in this application, and every document attached to it, is true, accurate and complete.',
    full: '[PLACEHOLDER — counsel to supply] The undersigned represents and warrants that all information and documents submitted in connection with this application are true, accurate and complete in all material respects, and agrees to promptly notify GLD Factoring LLC DBA GLD Funding of any material change.',
  },
  {
    title: 'Business Purpose',
    summary:
      'You certify that the funding is for business purposes only, and not for personal, family or household use.',
    full: '[PLACEHOLDER — counsel to supply] The undersigned certifies that any funding provided will be used solely for business or commercial purposes and not for personal, family or household purposes.',
  },
  {
    title: 'Credit & Background Authorization',
    summary:
      'You authorize GLD Factoring LLC DBA GLD Funding to obtain business and personal credit reports and background information to evaluate this application and any renewal.',
    full: '[PLACEHOLDER — counsel to supply] The undersigned authorizes GLD Factoring LLC DBA GLD Funding and its assigns to obtain consumer and business credit reports and other background information from any source, for the purpose of evaluating this application, and on an ongoing basis in connection with any funding provided.',
  },
  {
    title: 'Financial & Banking Verification',
    summary:
      'You authorize GLD Factoring LLC DBA GLD Funding to verify the bank and financial information you have provided, including contacting your bank or processor directly.',
    full: '[PLACEHOLDER — counsel to supply] The undersigned authorizes GLD Factoring LLC DBA GLD Funding to verify all financial information provided, including by contacting the business’s financial institutions, payment processors and references, and authorizes those parties to release such information.',
  },
  {
    title: 'Electronic Records & Signature',
    summary:
      'You consent to receive documents and disclosures electronically, and agree that your electronic signature is legally binding.',
    full: '[PLACEHOLDER — counsel to supply] The undersigned consents to receive all disclosures, notices and documents electronically, and agrees that an electronic signature has the same force and effect as a handwritten signature under the federal E-SIGN Act and applicable state UETA.',
  },
  {
    title: 'Communications Consent',
    summary:
      'You agree that GLD Factoring LLC DBA GLD Funding may contact you about this application by phone, text, or email at the contact details you provided. Consent is not a condition of receiving funding.',
    full: '[PLACEHOLDER — counsel to supply] The undersigned authorizes GLD Factoring LLC DBA GLD Funding to contact the undersigned about this application — including by telephone to a mobile number, automated dialing system, prerecorded or artificial voice, SMS/text message, and email — at the numbers and addresses provided. Consent is not a condition of receiving funding. Message and data rates may apply; message frequency varies. Reply STOP to any text to opt out or HELP for help. Calls may be monitored or recorded. Counsel must confirm this clause against GLD’s actual communication practices (application/servicing vs. marketing) before launch.',
  },
]

export const AUTH_PDF_HREF = '/legal/application-authorization.pdf'

export const SIGNATURE_ACKNOWLEDGEMENT =
  'By signing below, I acknowledge that I have read and agree to the complete Authorization and certify that I am authorized to submit this application on behalf of the business.'
