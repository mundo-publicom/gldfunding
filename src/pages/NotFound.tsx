import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { Seo } from '../lib/seo'
import { suggestPage } from '../lib/suggest'
import { SITE } from '../data/site'

/** Shared so dynamic routes can render it for an unknown slug. */
export function NotFoundBody() {
  const { pathname } = useLocation()
  // One static 404.html answers every dead URL, so the guess can only be made
  // in the browser - after hydration, or the markup would not match.
  const [match, setMatch] = useState<ReturnType<typeof suggestPage>>(null)
  useEffect(() => setMatch(suggestPage(pathname)), [pathname])

  return (
    <div className="page flex min-h-[62dvh] flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-leaf-deep">
        404
      </p>
      <h1 className="mt-4 text-h1 font-semibold text-ink">This page isn't here</h1>
      <p className="mt-5 max-w-[48ch] text-lead text-ink-2">
        It may have moved, or the link may be out of date. Here's where most people are heading.
      </p>

      {match && (
        <Link
          to={match.to}
          className="group mt-9 flex w-full max-w-2xl items-center justify-between gap-6 border border-leaf/45 bg-leaf-glow/15 px-5 py-4 text-left transition-colors duration-150 hover:border-leaf hover:bg-leaf-glow/25"
        >
          <span>
            <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-leaf-deep">
              Closest match
            </span>
            <span className="mt-1 block text-[1.0625rem] font-semibold text-ink">{match.label}</span>
          </span>
          <ArrowRightIcon
            size={18}
            weight="bold"
            aria-hidden="true"
            className="shrink-0 text-leaf-deep transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
          />
        </Link>
      )}

      <ul
        className={`${match ? 'mt-3' : 'mt-9'} grid w-full max-w-2xl gap-px border border-rule bg-rule sm:grid-cols-2`}
      >
        {[
          { to: '/funding/merchant-cash-advance', t: 'What is an MCA?', d: 'How an advance works' },
          { to: '/funding/mca-vs-business-loan', t: 'MCA vs. business loan', d: 'A side-by-side comparison' },
          { to: '/funding/how-it-works', t: 'How it works', d: 'Apply, review, get funded' },
          { to: '/apply', t: 'Check eligibility', d: 'A few simple questions to get started' },
        ].map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="block h-full bg-white p-5 text-left transition-colors hover:bg-paper">
              <span className="block text-[0.9375rem] font-semibold text-ink">{l.t}</span>
              <span className="mt-1 block text-[0.875rem] text-ink-3">{l.d}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
        <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
          WhatsApp {SITE.phone}
        </a>
      </div>
    </div>
  )
}

export function Component() {
  return (
    <>
      <Seo
        path="/404"
        title="Page not found"
        description="The page you're looking for isn't here."
        noindex
      />
      <NotFoundBody />
    </>
  )
}

Component.displayName = 'NotFound'
