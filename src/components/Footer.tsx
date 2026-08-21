import { Link } from 'react-router-dom'
import {
  EnvelopeSimpleIcon,
  FacebookLogoIcon,
  InstagramLogoIcon,
  MapPinIcon,
  PhoneIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from '@phosphor-icons/react'
import { CTA, INDUSTRIES, SITE } from '../data/site'
import { AmbientBackdrop } from './AmbientBackdrop'
import { Logo } from './Logo'

const COLUMNS = [
  {
    title: 'Funding',
    links: [
      { label: 'What is an MCA?', href: '/funding/merchant-cash-advance' },
      { label: 'What it costs', href: '/funding/cost' },
      { label: 'Do I qualify?', href: '/funding/qualify' },
      { label: 'MCA vs. business loan', href: '/funding/mca-vs-business-loan' },
      { label: 'How it works', href: '/funding/how-it-works' },
    ],
  },
  {
    title: 'Industries',
    links: INDUSTRIES.slice(0, 6).map((i) => ({ label: i.short, href: `/industries/${i.slug}` })),
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Partners & ISOs', href: '/partners' },
      { label: 'Resources', href: '/resources' },
      { label: 'Glossary', href: '/resources/glossary' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative isolate mt-auto border-t border-rule bg-petrol text-paper">
      {/* Quietest field on the page - the footer is the exit, not a feature. */}
      <AmbientBackdrop variant="drift" tone="dark" seed="footer" intensity={0.55} />
      {/* Closing CTA - one label per intent, same as the nav and every hero. */}
      <div className="border-b border-white/10">
        <div className="page grid gap-8 py-14 lg:grid-cols-[1.2fr_auto] lg:items-center lg:py-16">
          <div>
            <h2 className="text-h2 font-semibold text-white">
              See what your business qualifies for.
            </h2>
            <p className="mt-3 max-w-[46ch] text-[1.0625rem] leading-relaxed text-paper/75">
              Three questions, no personal information, no credit pull. You'll get an indicative
              range before we ask for anything else.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={CTA.primaryHref} className="btn btn-primary-invert btn-lg">
              {CTA.primary}
            </Link>
            <a href={SITE.phoneHref} className="btn btn-secondary-invert btn-lg">
              <PhoneIcon size={16} weight="fill" />
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          {/* Petrol ground: this is the one place the artwork runs as drawn,
              white wordmark and all. */}
          <Logo className="h-[46px] text-white" title={SITE.name} />
          <p className="mt-4 max-w-[38ch] text-[0.9375rem] leading-relaxed text-paper/70">
            Merchant cash advances and working capital for small businesses across the United
            States. Serving business owners since {SITE.founded}.
          </p>

          <address className="mt-6 flex flex-col gap-2.5 not-italic text-[0.875rem] text-paper/75">
            <span className="flex items-start gap-2.5">
              <MapPinIcon size={16} className="mt-0.5 shrink-0 text-leaf-glow" />
              <span>
                {SITE.address.street}
                <br />
                {SITE.address.locality}, {SITE.address.region} {SITE.address.postalCode}
              </span>
            </span>
            <a
              href={SITE.phoneHref}
              className="flex items-center gap-2.5 font-mono tabular-nums transition-colors hover:text-leaf-glow"
            >
              <PhoneIcon size={16} className="shrink-0 text-leaf-glow" />
              {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-2.5 transition-colors hover:text-leaf-glow"
            >
              <EnvelopeSimpleIcon size={16} className="shrink-0 text-leaf-glow" />
              {SITE.email}
            </a>
          </address>

          <div className="mt-6 flex gap-1">
            {[
              { href: SITE.social.facebook, Icon: FacebookLogoIcon, label: 'Facebook' },
              { href: SITE.social.instagram, Icon: InstagramLogoIcon, label: 'Instagram' },
              { href: SITE.social.twitter, Icon: XLogoIcon, label: 'X' },
              { href: SITE.social.youtube, Icon: YoutubeLogoIcon, label: 'YouTube' },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-paper/70 transition-colors duration-150 hover:bg-white/8 hover:text-leaf-glow"
              >
                <Icon size={17} weight="fill" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-leaf-glow">
              {col.title}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    to={l.href}
                    className="text-[0.9375rem] text-paper/75 transition-colors duration-150 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/8">
        <div className="page flex flex-col gap-4 py-6 text-[0.8125rem] text-paper/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {SITE.legalName}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/legal/privacy" className="transition-colors hover:text-paper">
              Privacy policy
            </Link>
            <Link to="/legal/terms" className="transition-colors hover:text-paper">
              Terms of use
            </Link>
            <Link to="/legal/disclosures" className="transition-colors hover:text-paper">
              Disclosures
            </Link>
            <a href={SITE.loginUrl} className="transition-colors hover:text-paper">
              Client login
            </a>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="page py-6">
          <p className="max-w-[92ch] text-[0.75rem] leading-relaxed text-paper/65">
            A merchant cash advance is the purchase of future receivables, not a loan. GLD Funding
            is not a bank and does not offer loans. Funding amounts, factor rates, and terms vary by
            business and are determined by underwriting. Approval times and funding speed reflect
            typical outcomes and are not guaranteed. Where required by state law, a written
            disclosure of total cost and terms is provided with every offer.
          </p>
        </div>
      </div>
    </footer>
  )
}
