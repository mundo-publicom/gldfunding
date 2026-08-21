import type { ReactNode } from 'react'
import { PageHero, Prose, Section } from '../../components/ui'

/**
 * Shared shell for legal pages.
 *
 * Each page renders as a single Prose column under a dated header, so the
 * "last updated" line is the first thing read - a legal page whose currency
 * you have to guess at is worth very little.
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
        <p className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink-3">
          Last updated {updated}
        </p>

        <Prose className="mt-6">{children}</Prose>
      </Section>
    </>
  )
}
