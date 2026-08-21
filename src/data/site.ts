/**
 * Single source of truth for every business fact on the site.
 *
 * ⚠️  NUMBERS MARKED `@needs-verification` ARE PLACEHOLDERS.
 * They must be replaced with GLD's real, documented, *typical* outcomes before
 * launch. FTC substantiation rules require that advertised results be typical,
 * not best-case - and the GEO strategy depends entirely on these being real,
 * because specificity is what gets cited.
 */

export const SITE = {
  name: 'GLD Funding',
  legalName: 'GLD Funding LLC',
  domain: 'https://www.gldfunding.com',
  tagline: 'Working capital for small business, funded in 24 hours.',
  founded: 2004,
  phone: '1 (877) 498-4344',
  phoneHref: 'tel:+18774984344',
  fax: '1 (516) 941-0758',
  email: 'info@gldfunding.com',
  loginUrl: 'https://login.gldfunding.com/',
  address: {
    street: '591 Stewart Avenue, Suite 520',
    locality: 'Garden City',
    region: 'NY',
    postalCode: '11530',
    country: 'US',
  },
  social: {
    facebook: 'https://www.facebook.com/GLD-Funding-102567247876620/',
    instagram: 'https://www.instagram.com/gldfunding/',
    twitter: 'https://twitter.com/gldfunding',
    youtube: 'https://www.youtube.com/channel/UCbqqEh1zxoy6CsNLzdSjG_A',
  },
} as const

/** Product parameters. @needs-verification - every value below. */
export const PRODUCT = {
  advanceMin: 10_000,
  advanceMax: 500_000,
  factorRateMin: 1.15,
  factorRateMax: 1.49,
  termMinMonths: 3,
  termMaxMonths: 18,
  decisionHours: 4,
  fundingHours: 24,
  minMonthlyRevenue: 15_000,
  minMonthsInBusiness: 6,
  /** Ownership % at or above which a second owner must also authorize. */
  secondOwnerThreshold: 20,
  /** Statement months required at application, by state. NY runs longer. */
  statementMonths: { NY: 4, default: 3 },
} as const

export const CTA = {
  /** ONE label per intent, used in nav, every hero, and the footer. */
  primary: 'Check eligibility',
  primaryHref: '/apply',
  /** Reserved for applicants who have already pre-qualified. */
  apply: 'Apply now',
  secondary: 'How it works',
  secondaryHref: '/funding/how-it-works',
} as const

export type Testimonial = {
  quote: string
  author: string
  business: string
  industry: string
  location: string
}

/**
 * Real testimonials carried over from the current site.
 * ⚠️ Written consent must be on file before these carry Review schema.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Very easy and fair. I've been working with GLD for the past three years now, and I do not have any complaints. I must say they are very cooperative and understanding of your business needs.",
    author: 'Antonio V.',
    business: 'Mexicosina',
    industry: 'Restaurants',
    location: 'New York',
  },
  {
    quote:
      'I was glad that they were there to help when my business needed them. Overall, a pleasant experience.',
    author: 'Kirk G.',
    business: "Fisherman's Cove",
    industry: 'Restaurants',
    location: 'New York',
  },
  {
    quote:
      'I would highly recommend GLD to friends and family, their staff is excellent and always ready to help you. You will never have your questions unanswered.',
    author: 'Trudyanne B.',
    business: 'Silvers Crust',
    industry: 'Restaurants',
    location: 'New York',
  },
  {
    quote:
      'The people at GLD Funding are really helpful and attentive. If you need help with your cash advance, they will make sure to have all of your questions answered.',
    author: 'Manuel G.',
    business: 'Uno Communications',
    industry: 'Retail',
    location: 'New York',
  },
  {
    quote:
      "GLD Funding came in handy when I desperately needed capital for my business expenses. The process was quick and straightforward. You don't need good credit to be approved, which made everything much smoother.",
    author: 'Mok H.',
    business: 'ZenMedica',
    industry: 'Medical & dental',
    location: 'New York',
  },
  {
    quote:
      'Best people to work with. They really try their best to get you the funding that best fits your business needs. You will not be disappointed.',
    author: 'Linda S.',
    business: 'Linda Samuels',
    industry: 'Professional services',
    location: 'New York',
  },
]

export type Industry = {
  slug: string
  name: string
  short: string
  /** The 40–60 word answer block. Lifted verbatim into AI responses. */
  answer: string
  useCases: string[]
  typicalRange: string
}

export const INDUSTRIES: Industry[] = [
  {
    slug: 'restaurants',
    name: 'Restaurants & food service',
    short: 'Restaurants',
    answer:
      'Restaurants can use a merchant cash advance to cover equipment repair, seasonal payroll, inventory, or a build-out, repaying through a fixed daily or weekly remittance tied to card and deposit volume. GLD Funding typically advances $10,000 to $250,000 to restaurants with at least six months of trading history.',
    useCases: ['Kitchen equipment repair or replacement', 'Seasonal staffing and payroll gaps', 'Inventory and supplier deposits', 'Dining room build-out or expansion', 'Bridging a slow month'],
    typicalRange: '$10,000 – $250,000',
  },
  {
    slug: 'retail',
    name: 'Retail & specialty stores',
    short: 'Retail',
    answer:
      'Retailers use merchant cash advances to buy inventory ahead of a selling season, fund a store refit, or cover rent during a slow quarter. Because repayment flexes with card volume, retail businesses with uneven monthly sales often find an advance easier to carry than a fixed-payment loan.',
    useCases: ['Seasonal inventory buys', 'Store refit or relocation', 'Point-of-sale and systems upgrades', 'Marketing pushes before peak season', 'Covering rent through a slow quarter'],
    typicalRange: '$10,000 – $200,000',
  },
  {
    slug: 'medical-dental',
    name: 'Medical & dental practices',
    short: 'Medical & dental',
    answer:
      'Medical and dental practices use merchant cash advances to buy clinical equipment, expand treatment rooms, or bridge insurance reimbursement delays. Approval rests on practice deposit history rather than credit score, which suits practitioners carrying student debt or a recent practice acquisition.',
    useCases: ['Clinical and imaging equipment', 'Additional treatment rooms', 'Bridging insurance reimbursement lag', 'Practice acquisition costs', 'Software and compliance systems'],
    typicalRange: '$25,000 – $500,000',
  },
  {
    slug: 'trucking-logistics',
    name: 'Trucking & logistics',
    short: 'Trucking',
    answer:
      'Trucking and logistics operators use merchant cash advances for fuel, repairs, insurance premiums, and driver payroll while invoices sit unpaid. Funding usually lands within 24 hours of a signed contract, which matters when a truck is off the road and the repair bill is due now.',
    useCases: ['Emergency repairs and downtime', 'Fuel and operating float', 'Insurance premium payments', 'Driver payroll between settlements', 'Adding a truck or trailer'],
    typicalRange: '$15,000 – $300,000',
  },
  {
    slug: 'construction-trades',
    name: 'Construction & trades',
    short: 'Construction',
    answer:
      'Contractors and trades businesses use merchant cash advances to fund materials and labor before a progress payment arrives. Because underwriting reads bank deposits rather than credit files, contractors with strong revenue but lumpy monthly cash flow are frequently approved where banks decline.',
    useCases: ['Materials ahead of a progress payment', 'Crew payroll between draws', 'Tools, plant and vehicle purchases', 'Bonding and permit costs', 'Taking on a larger contract'],
    typicalRange: '$15,000 – $350,000',
  },
  {
    slug: 'auto-repair',
    name: 'Auto repair & service',
    short: 'Auto repair',
    answer:
      'Auto repair shops use merchant cash advances to stock parts, buy diagnostic equipment, or add a service bay. Repayment tracks card and deposit volume, so a slow week costs less than a busy one - useful in a trade where revenue swings with season and weather.',
    useCases: ['Diagnostic and lift equipment', 'Parts inventory', 'Adding a service bay', 'Technician hiring and certification', 'Shop marketing and signage'],
    typicalRange: '$10,000 – $200,000',
  },
  {
    slug: 'salons-spas',
    name: 'Salons & spas',
    short: 'Salons & spas',
    answer:
      'Salons, barbershops and spas use merchant cash advances to fit out stations, buy retail stock, or fund a second location. Advances are typically smaller and shorter than in other trades, and approval leans on card processing volume rather than the owner’s personal credit.',
    useCases: ['Station and chair fit-out', 'Retail product stock', 'Opening a second location', 'Booking and POS systems', 'Stylist recruitment and training'],
    typicalRange: '$10,000 – $150,000',
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce & online retail',
    short: 'E-commerce',
    answer:
      'E-commerce businesses use merchant cash advances to fund inventory and advertising ahead of a sales peak, repaying as revenue arrives. For sellers whose cash is locked in stock for 60 to 90 days, an advance smooths the gap between paying a supplier and collecting from customers.',
    useCases: ['Inventory ahead of Q4', 'Advertising and customer acquisition', 'Supplier deposits and freight', 'Warehouse and 3PL costs', 'Platform and fulfilment expansion'],
    typicalRange: '$10,000 – $250,000',
  },
]

export type StateInfo = {
  slug: string
  name: string
  abbr: string
  /** Whether the state has an in-force commercial financing disclosure regime. */
  disclosure: 'in-force' | 'enacted' | 'none'
  /** One-line summary of the state's regulatory posture. Reviewed by counsel. */
  note: string
  featured?: boolean
}

/**
 * Disclosure status reflects publicly reported state commercial-financing
 * regimes. ⚠️ Requires per-state legal review before publishing.
 */
export const STATES: StateInfo[] = [
  { slug: 'new-york', name: 'New York', abbr: 'NY', disclosure: 'in-force', featured: true, note: 'The Commercial Finance Disclosure Law requires a standardized OFFER SUMMARY on commercial financing under $2.5M, showing total dollar cost, an APR-comparable figure, and repayment terms. Enforced by NYDFS.' },
  { slug: 'california', name: 'California', abbr: 'CA', disclosure: 'in-force', featured: true, note: 'SB 1235 requires commercial financing disclosures including an annualized rate, administered by the Department of Financial Protection and Innovation.' },
  { slug: 'utah', name: 'Utah', abbr: 'UT', disclosure: 'in-force', featured: true, note: 'The Commercial Financing Registration and Disclosure Act requires provider registration and written disclosure of total cost and terms.' },
  { slug: 'virginia', name: 'Virginia', abbr: 'VA', disclosure: 'in-force', featured: true, note: 'Sales-based financing providers must register with the State Corporation Commission and give written disclosures before consummation.' },
  { slug: 'connecticut', name: 'Connecticut', abbr: 'CT', disclosure: 'in-force', featured: true, note: 'Sales-based financing is subject to registration and disclosure requirements including an annual percentage rate.' },
  { slug: 'georgia', name: 'Georgia', abbr: 'GA', disclosure: 'in-force', featured: true, note: 'Commercial financing disclosure requirements apply to sales-based financing transactions, with registration obligations for providers and brokers.' },
  { slug: 'florida', name: 'Florida', abbr: 'FL', disclosure: 'in-force', featured: true, note: 'The Commercial Financing Disclosure Law requires written disclosure of total funds, finance charge, and payment terms at the time of offer.' },
  { slug: 'texas', name: 'Texas', abbr: 'TX', disclosure: 'none', featured: true, note: 'Texas has no dedicated commercial financing disclosure statute. GLD Funding provides full cost disclosure on every offer regardless.' },
  { slug: 'kansas', name: 'Kansas', abbr: 'KS', disclosure: 'in-force', note: 'Commercial financing disclosure requirements apply to covered transactions.' },
  { slug: 'missouri', name: 'Missouri', abbr: 'MO', disclosure: 'in-force', note: 'Commercial financing disclosure and registration requirements apply to sales-based financing.' },
  { slug: 'maryland', name: 'Maryland', abbr: 'MD', disclosure: 'enacted', note: 'Commercial financing disclosure legislation has been enacted; confirm current effective date before relying on terms.' },
  { slug: 'illinois', name: 'Illinois', abbr: 'IL', disclosure: 'enacted', note: 'Commercial financing disclosure requirements have been enacted; confirm current effective date.' },
  { slug: 'new-jersey', name: 'New Jersey', abbr: 'NJ', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force. GLD Funding discloses total cost on every offer regardless.' },
  { slug: 'pennsylvania', name: 'Pennsylvania', abbr: 'PA', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'ohio', name: 'Ohio', abbr: 'OH', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'michigan', name: 'Michigan', abbr: 'MI', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'north-carolina', name: 'North Carolina', abbr: 'NC', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'arizona', name: 'Arizona', abbr: 'AZ', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'massachusetts', name: 'Massachusetts', abbr: 'MA', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'washington', name: 'Washington', abbr: 'WA', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'colorado', name: 'Colorado', abbr: 'CO', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'tennessee', name: 'Tennessee', abbr: 'TN', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'indiana', name: 'Indiana', abbr: 'IN', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'wisconsin', name: 'Wisconsin', abbr: 'WI', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'minnesota', name: 'Minnesota', abbr: 'MN', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'south-carolina', name: 'South Carolina', abbr: 'SC', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'alabama', name: 'Alabama', abbr: 'AL', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'louisiana', name: 'Louisiana', abbr: 'LA', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'kentucky', name: 'Kentucky', abbr: 'KY', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'oregon', name: 'Oregon', abbr: 'OR', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'oklahoma', name: 'Oklahoma', abbr: 'OK', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'nevada', name: 'Nevada', abbr: 'NV', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'arkansas', name: 'Arkansas', abbr: 'AR', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'iowa', name: 'Iowa', abbr: 'IA', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'mississippi', name: 'Mississippi', abbr: 'MS', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'nebraska', name: 'Nebraska', abbr: 'NE', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'new-mexico', name: 'New Mexico', abbr: 'NM', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'west-virginia', name: 'West Virginia', abbr: 'WV', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'idaho', name: 'Idaho', abbr: 'ID', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'new-hampshire', name: 'New Hampshire', abbr: 'NH', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'maine', name: 'Maine', abbr: 'ME', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'rhode-island', name: 'Rhode Island', abbr: 'RI', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'delaware', name: 'Delaware', abbr: 'DE', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'montana', name: 'Montana', abbr: 'MT', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'hawaii', name: 'Hawaii', abbr: 'HI', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
  { slug: 'alaska', name: 'Alaska', abbr: 'AK', disclosure: 'none', note: 'No dedicated commercial financing disclosure statute in force.' },
]

export const US_STATE_OPTIONS = STATES.map((s) => ({ value: s.abbr, label: s.name })).sort((a, b) =>
  a.label.localeCompare(b.label),
)

/** Statement months for a given state abbreviation. Drives step 6 of the application. */
export function statementMonthsFor(stateAbbr: string | undefined): number {
  if (stateAbbr === 'NY') return PRODUCT.statementMonths.NY
  return PRODUCT.statementMonths.default
}

export const currency = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
