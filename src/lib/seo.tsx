import { Head } from 'vite-react-ssg'
import { SITE } from '../data/site'

type SeoProps = {
  title: string
  description: string
  path: string
  /** JSON-LD blocks. Emitted into the pre-rendered HTML, so crawlers see them. */
  schema?: Record<string, unknown>[]
  image?: string
  noindex?: boolean
  /** ISO date. Freshness is a documented ranking input for answer engines. */
  modified?: string
}

export function Seo({ title, description, path, schema = [], image, noindex, modified }: SeoProps) {
  const url = `${SITE.domain}${path === '/' ? '' : path}`
  // Don't double the brand on titles that already name it ("Contact GLD Funding").
  const fullTitle =
    path === '/' || title.includes(SITE.name) ? title : `${title} | ${SITE.name}`
  const ogImage = `${SITE.domain}${image ?? '/og-default.png'}`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,follow" />}
      {modified && <meta property="article:modified_time" content={modified} />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {schema.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Head>
  )
}

/* ------------------------------------------------------------------
   Schema builders. Every one of these lands in the pre-rendered HTML.
   ------------------------------------------------------------------ */

export const orgSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  '@id': `${SITE.domain}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.domain,
  logo: `${SITE.domain}/logo.svg`,
  telephone: SITE.phone,
  email: SITE.email,
  faxNumber: SITE.fax,
  foundingDate: String(SITE.founded),
  description:
    'GLD Funding provides merchant cash advances and working capital to small businesses across the United States, with decisions in hours and funding in as little as 24 hours.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  areaServed: { '@type': 'Country', name: 'United States' },
  sameAs: Object.values(SITE.social),
})

export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE.domain}/#localbusiness`,
  name: SITE.name,
  image: `${SITE.domain}/logo.svg`,
  url: SITE.domain,
  telephone: SITE.phone,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: 40.7268, longitude: -73.6343 },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
})

export const faqSchema = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
})

export const breadcrumbSchema = (trail: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: `${SITE.domain}${t.path}`,
  })),
})

export const productSchema = (opts: {
  name: string
  description: string
  amountMin: number
  amountMax: number
}) => ({
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: opts.name,
  description: opts.description,
  provider: { '@id': `${SITE.domain}/#organization` },
  amount: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    minValue: opts.amountMin,
    maxValue: opts.amountMax,
  },
  areaServed: { '@type': 'Country', name: 'United States' },
})
