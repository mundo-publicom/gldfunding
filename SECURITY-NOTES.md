# Security notes

## Open advisories: react-router 6.30.6 (3 moderate, no upstream fix for 6.x)

`npm audit` reports three moderate advisories against `react-router` /
`react-router-dom` in the range `6.0.0 – 7.17.0`. React Router patched these in
**7.18.2**; there is **no 6.x patch**.

We are pinned to `react-router-dom@6.30.6` because `vite-react-ssg@0.9.2` — the
static pre-renderer that makes the GEO strategy possible — imports
`react-router-dom/server.js`, an entrypoint that does not exist in v7.

### Why these are not exploitable in this build

| Advisory | Requires | This build |
|---|---|---|
| [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) — open redirect via backslash in `<Link>` / `useNavigate` | A user-controlled value passed as a route target | Every `to=` on the site is a hardcoded internal literal. No route target is derived from query strings, path params, form input, or `postMessage`. |
| [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg) — arbitrary constructor injection via `deserializeErrors()` during SSR hydration | Runtime SSR with server-side data loaders that can return errors | The site is **statically pre-rendered at build time**. There are no route loaders, no runtime server, and no serialized error payload to deserialize. |

**Invariant to preserve:** if a route target is ever built from user input,
GHSA-wrjc-x8rr-h8h6 becomes live. Validate against an allowlist of internal
paths at that point, or migrate first.

### Recommended resolution

Migrate to `vite-plugin-react-ssg` (peer: `react-router ^7`, `vite ^8`), which
allows `react-router@7.18.2+` and clears all three advisories. Cost is a rewrite
of `src/lib/seo.tsx` from `react-helmet-async` to `@unhead/react`, plus the
entry in `src/main.tsx`. Roughly half a day.

This was **not** done during the initial build because `vite-plugin-react-ssg`
is at `0.2.0` and swapping the pre-render pipeline for an unproven package
mid-build carried more risk than three provably-inert advisories. Revisit before
the security review — a lender's site should not ship with unresolved audit
findings, even inert ones.

## Application data handling — not yet implemented

`/apply` currently posts nowhere. Before it accepts a single real submission:

- TLS in transit and encryption at rest for bank statements and SSNs.
- A published retention and deletion policy (the site has no privacy policy today).
- GLBA Safeguards Rule obligations apply if brokers or ISOs touch applicant data.
- Signature audit records (timestamp, IP, user agent, exact authorization text
  version) are captured client-side in `Apply.tsx` but must be persisted
  server-side to be defensible under E-SIGN / UETA.
- Rate limiting and bot protection on the submission endpoint.
