import { EnvelopeSimpleIcon, MapPinIcon, PhoneIcon, PrinterIcon } from '@phosphor-icons/react'
import { PageHero, Section, SectionHead } from '../components/ui'
import { ContactForm } from '../components/ContactForm'
import { Seo, breadcrumbSchema, localBusinessSchema } from '../lib/seo'
import { SITE } from '../data/site'

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
]

export function Component() {
  return (
    <>
      <Seo
        path="/contact"
        title="Contact GLD Funding"
        description={`Call ${SITE.phone} or send a message. GLD Funding is at ${SITE.address.street}, ${SITE.address.locality}, ${SITE.address.region} ${SITE.address.postalCode}.`}
        schema={[breadcrumbSchema(TRAIL), localBusinessSchema()]}
      />

      <PageHero
        trail={TRAIL}
        eyebrow="Contact"
        title="Talk to someone who can answer"
        lead="Questions about funding, an application in progress, or an existing advance - a person picks up."
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHead eyebrow="Reach us" title="Garden City, New York." />

            <dl className="mt-8 flex flex-col divide-y divide-rule border-y border-rule">
              {[
                { Icon: PhoneIcon, label: 'Phone', value: SITE.phone, href: SITE.phoneHref, mono: true },
                { Icon: EnvelopeSimpleIcon, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
                { Icon: PrinterIcon, label: 'Fax', value: SITE.fax, mono: true },
              ].map(({ Icon, label, value, href, mono }) => (
                <div key={label} className="flex items-center gap-4 py-4">
                  <dt className="flex w-28 shrink-0 items-center gap-3 text-[0.875rem] text-ink-3">
                    <Icon size={18} className="shrink-0 text-leaf-deep" />
                    {label}
                  </dt>
                  <dd className={mono ? 'font-mono tabular-nums' : ''}>
                    {href ? (
                      <a href={href} className="text-[0.9375rem] text-ink transition-colors hover:text-leaf-deep">
                        {value}
                      </a>
                    ) : (
                      <span className="text-[0.9375rem] text-ink-2">{value}</span>
                    )}
                  </dd>
                </div>
              ))}
              <div className="flex items-start gap-4 py-4">
                <dt className="flex w-28 shrink-0 items-center gap-3 text-[0.875rem] text-ink-3">
                  <MapPinIcon size={18} className="shrink-0 text-leaf-deep" />
                  Office
                </dt>
                <dd className="text-[0.9375rem] leading-relaxed text-ink-2">
                  {SITE.address.street}
                  <br />
                  {SITE.address.locality}, {SITE.address.region} {SITE.address.postalCode}
                </dd>
              </div>
            </dl>

            <div className="mt-8 border-l-[3px] border-leaf bg-paper p-5">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">Hours</p>
              <p className="mt-2.5 text-[0.9375rem] text-ink-2">Monday to Friday, 9:00am – 6:00pm ET</p>
            </div>
          </div>

          <div>
            <ContactForm
              topics={[
                { value: 'new-funding', label: 'I want funding for my business' },
                { value: 'application', label: 'Question about my application' },
                { value: 'existing', label: 'Question about an existing advance' },
                { value: 'partner', label: 'Partnership or ISO enquiry' },
                { value: 'other', label: 'Something else' },
              ]}
            />
          </div>
        </div>
      </Section>
    </>
  )
}

Component.displayName = 'Contact'
