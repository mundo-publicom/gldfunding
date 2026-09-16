/**
 * Writes public/legal/application-authorization.pdf from the authorization
 * clauses. Keep the body in sync with src/apply/authorizationCopy.ts.
 *
 *   node scripts/write-authorization-pdf.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public/legal/application-authorization.pdf')

const CLAUSES = [
  {
    title: '01  Accuracy of Information',
    body: '[PLACEHOLDER — counsel to supply] The undersigned represents and warrants that all information and documents submitted in connection with this application are true, accurate and complete in all material respects, and agrees to promptly notify GLD Factoring LLC DBA GLD Funding of any material change.',
  },
  {
    title: '02  Business Purpose',
    body: '[PLACEHOLDER — counsel to supply] The undersigned certifies that any funding provided will be used solely for business or commercial purposes and not for personal, family or household purposes.',
  },
  {
    title: '03  Credit & Background Authorization',
    body: '[PLACEHOLDER — counsel to supply] The undersigned authorizes GLD Factoring LLC DBA GLD Funding and its assigns to obtain consumer and business credit reports and other background information from any source, for the purpose of evaluating this application, and on an ongoing basis in connection with any funding provided.',
  },
  {
    title: '04  Financial & Banking Verification',
    body: '[PLACEHOLDER — counsel to supply] The undersigned authorizes GLD Factoring LLC DBA GLD Funding to verify all financial information provided, including by contacting the business\'s financial institutions, payment processors and references, and authorizes those parties to release such information.',
  },
  {
    title: '05  Electronic Records & Signature',
    body: '[PLACEHOLDER — counsel to supply] The undersigned consents to receive all disclosures, notices and documents electronically, and agrees that an electronic signature has the same force and effect as a handwritten signature under the federal E-SIGN Act and applicable state UETA.',
  },
  {
    title: '06  Communications Consent',
    body: '[PLACEHOLDER — counsel to supply] The undersigned authorizes GLD Factoring LLC DBA GLD Funding to contact the undersigned about this application — including by telephone to a mobile number, automated dialing system, prerecorded or artificial voice, SMS/text message, and email — at the numbers and addresses provided. Consent is not a condition of receiving funding. Message and data rates may apply; message frequency varies. Reply STOP to any text to opt out or HELP for help. Calls may be monitored or recorded. Counsel must confirm this clause against GLD\'s actual communication practices before launch.',
  },
]

const HEADER = [
  'GLD Factoring LLC DBA GLD Funding',
  'Application Authorization',
  'Version gld-app-auth-2026-09-c',
  '',
  'This document is the complete authorization presented at Review & Sign.',
  'The language below is a placeholder describing coverage until GLD counsel',
  'supplies the approved final text. When that text changes, bump AUTH_VERSION',
  'and regenerate this PDF.',
  '',
]

const FOOTER = [
  '',
  'By signing the application, the undersigned acknowledges that they have read',
  'and agree to this Authorization and certifies that they are authorized to',
  'submit the application on behalf of the business.',
]

function wrap(text, width = 92) {
  const words = text.split(/\s+/)
  const lines = []
  let line = ''
  for (const w of words) {
    const next = line ? `${line} ${w}` : w
    if (next.length > width) {
      if (line) lines.push(line)
      line = w
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function pdfEscape(s) {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

const lines = [
  ...HEADER.flatMap((l) => (l ? wrap(l) : [''])),
  ...CLAUSES.flatMap((c) => ['', c.title, ...wrap(c.body)]),
  ...FOOTER.flatMap((l) => (l ? wrap(l) : [''])),
]

const PAGE_H = 792
const PAGE_W = 612
const MARGIN_X = 54
const MARGIN_TOP = 54
const LINE_H = 13
const LINES_PER_PAGE = Math.floor((PAGE_H - MARGIN_TOP * 2) / LINE_H)

const pages = []
for (let i = 0; i < lines.length; i += LINES_PER_PAGE) {
  pages.push(lines.slice(i, i + LINES_PER_PAGE))
}

function pageStream(pageLines) {
  const ops = ['BT', '/F1 10 Tf', '14 TL', `${MARGIN_X} ${PAGE_H - MARGIN_TOP} Td`]
  pageLines.forEach((line, i) => {
    if (i > 0) ops.push('T*')
    ops.push(`(${pdfEscape(line)}) Tj`)
  })
  ops.push('ET')
  return ops.join('\n')
}

const objects = []
const add = (body) => {
  objects.push(body)
  return objects.length
}

const fontId = add('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>')
const contentIds = pages.map((p) => {
  const stream = pageStream(p)
  return add(
    `<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}\nendstream`,
  )
})
const pageIds = contentIds.map((contentId) =>
  add(
    `<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`,
  ),
)
const pagesId = add(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`)
objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`
for (const pageId of pageIds) {
  objects[pageId - 1] = objects[pageId - 1].replace('/Parent 0 0 R', `/Parent ${pagesId} 0 R`)
}
const catalogId = add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`)

let out = '%PDF-1.4\n'
const offsets = [0]
for (let i = 0; i < objects.length; i++) {
  offsets.push(Buffer.byteLength(out, 'utf8'))
  out += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`
}
const xref = Buffer.byteLength(out, 'utf8')
out += `xref\n0 ${objects.length + 1}\n`
out += '0000000000 65535 f \n'
for (let i = 1; i < offsets.length; i++) {
  out += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
}
out += `trailer << /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF\n`

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, out)
console.log(`wrote ${OUT} (${pages.length} page${pages.length === 1 ? '' : 's'})`)
