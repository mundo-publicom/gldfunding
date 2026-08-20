import { Link } from 'react-router-dom'
import { Seo } from '../lib/seo'
import { SITE } from '../data/site'

/** Shared so dynamic routes can render it for an unknown slug. */
export function NotFoundBody() {
  return (
    <div className="page flex min-h-[62dvh] flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mint-deep">
        404
      </p>
      <h1 className="mt-4 text-h1 font-semibold text-ink">This page isn't here</h1>
      <p className="mt-5 max-w-[48ch] text-lead text-ink-2">
        It may have moved, or the link may be out of date. Here's where most people are heading.
      </p>

      <ul className="mt-9 grid w-full max-w-2xl gap-px border border-rule bg-rule sm:grid-cols-2">
        {[
          { to: '/funding/merchant-cash-advance', t: 'What is an MCA?', d: 'How an advance works' },
          { to: '/funding/cost', t: 'What it costs', d: 'Factor rates and worked examples' },
          { to: '/funding/qualify', t: 'Do I qualify?', d: 'The exact thresholds' },
          { to: '/apply', t: 'Check eligibility', d: 'Three questions, no credit pull' },
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
        <a href={SITE.phoneHref} className="btn btn-secondary">
          Call {SITE.phone}
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
