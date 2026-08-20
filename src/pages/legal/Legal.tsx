import type { ReactNode } from 'react'
import { WarningIcon } from '@phosphor-icons/react'
import { PageHero, Prose, Section } from '../../components/ui'

/**
 * Shared shell for legal pages.
 *
 * ⚠️ Every legal page on this site is a DRAFT SKELETON. The current site has no
 * privacy policy at all, and one is required before /apply collects a single
 * SSN or bank statement. Counsel must review and replace this content.
 */
export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string
  updated: string
  intro: string
  children: ReactNode
}) {
  return (
    <>
      <PageHero
        trail={[
          { name: 'Home', path: '/' },
          { name: title, path: '#' },
        ]}
        eyebrow="Legal"
        title={title}
        lead={intro}
      />

      <Section tone="white">
        <div className="mb-8 flex items-start gap-3 border-l-[3px] border-rate bg-rate-bg p-4">
          <WarningIcon size={18} className="mt-0.5 shrink-0 text-rate" />
          <p className="max-w-[72ch] text-[0.875rem] leading-relaxed text-ink-2">
            <strong className="font-semibold text-ink">Draft — not yet reviewed by counsel.</strong>{' '}
            This page is a structural placeholder written during the site rebuild. It must be
            replaced with GLD Funding's counsel-approved policy before the site accepts real
            applicant data.
          </p>
        </div>

        <p className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink-3">
          Last updated {updated}
        </p>

        <Prose className="mt-6">{children}</Prose>
      </Section>
    </>
  )
}
