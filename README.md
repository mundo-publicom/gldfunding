# GLD Funding

Rebuild of [gldfunding.com](https://www.gldfunding.com) — a merchant cash advance
provider in Garden City, NY.

Vite 8 · React 19 · TypeScript · Tailwind v4 · statically pre-rendered with
`vite-react-ssg`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 71 static pages → dist/
npm run preview  # serve dist/
```

---

## Why static pre-rendering

Every route is rendered to real HTML at build time. This is not a performance
nicety — it is the load-bearing decision behind the whole project.

A meaningful share of "how do I get funding for my restaurant" now resolves
inside ChatGPT, Perplexity and Google AI Overviews rather than a blue-link page.
**Most AI crawlers do not execute JavaScript.** A pure SPA would be invisible to
exactly the systems this site is built to reach.

So: content in the initial HTML response, always. Client JS is for interaction
only, never for content delivery.

## Layout

```
src/
  data/site.ts          ← every business fact lives here (see "Placeholders")
  data/glossary.ts      ← 41 definitions
  lib/seo.tsx           ← <Seo> + JSON-LD builders
  lib/useReveal.ts      ← scroll reveal; fires once, then disconnects
  components/           ← Header, Footer, ui kit, RateCalculator, CapitalFlow
  sections/             ← Hero, HowItWorksTimeline, Testimonials
  apply/                ← the 7-step conditional application
  pages/                ← one file per route
scripts/
  postbuild.mjs         ← robots.txt · sitemap.xml · llms.txt
  patch-manifests.mjs   ← works around upstream publish bugs (see below)
```

## The application (`src/apply/`)

Seven steps governed by one rule: **only show a question when GLD needs the
answer.** A skipped step is never rendered, never numbered, and never appears as
a greyed-out row in the review list.

| Step | Shown when |
|---|---|
| 1. Business | Always |
| 2. Owner | Always |
| 3. Additional owner | Primary owner declared a second owner ≥ 20% |
| 4. Funding | Always |
| 5. Existing financing | Always — but detail fields only if "Yes" |
| 6. Bank statements | Always — **4 months in NY, 3 elsewhere** |
| 7. Authorization | Always — Owner #2 signature only if step 3 ran |

Conditional logic lives in `STEPS[].visible()` in `apply/types.ts`. Verified: a
single-owner applicant sees "Step 1 of 6"; declaring a second owner shifts it to
7 and adds the second signature block.

Only bank statements are required to submit. Everything else is a stip requested
after review.

## The hero (`components/CapitalFlow.ts`)

Raw WebGL2 — one `gl.POINTS` draw call, positions computed on the GPU from a
time uniform. **4.2 KB raw / 2.05 KB gzipped.**

three.js was the obvious reach and cost 125 KB gzipped for one draw call — 39%
over the hero's 90 KB budget. Hand-rolling it removed the dependency entirely.

It is never the LCP element. The LCP is a CSS-painted gradient poster — no image
request. WebGL boots after `load`, and only when **every** gate passes:

- not `prefers-reduced-motion`
- viewport ≥ 768px (never on mobile)
- `hardwareConcurrency` ≥ 4
- not `saveData`, not 2G
- a WebGL context is actually obtainable

If any gate fails the poster simply stays. The chunk is excluded from
`modulepreload` in `scripts/postbuild.mjs` so gated-out users never fetch it.

## Motion

Every animation answers: should this animate, what is its purpose, does it get
tiring on repeat? Custom curves throughout — the CSS built-ins are too weak to
read as intentional. `ease-in` is never used for entrances.

| Element | Duration | Easing |
|---|---|---|
| Button press | 120ms | `ease-out`, `scale(0.97)` on `:active` |
| Field focus | 150ms | `ease-out` |
| Step change | 240ms | `cubic-bezier(.32,.72,0,1)` — forward left, back right |
| Section reveal | 400ms | `cubic-bezier(.23,1,.32,1)`, fires once |
| Calculator figures | 280ms | cubic ease-out count-up |
| How-it-works rail | scroll-linked | none |

## GEO

- 40–60 word `<AnswerBlock>` opens every page, before marketing copy
- JSON-LD: `FinancialService`, `LocalBusiness`, `FinancialProduct`, `FAQPage`,
  `BreadcrumbList`, `ItemList`, `DefinedTermSet`
- `robots.txt` names GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Applebot
  and others explicitly
- `llms.txt` gives answer engines a plain-language product summary
- 45 state pages carrying real regulatory differences, 8 industry pages

## Accessibility

WCAG 2.2 AA, verified with axe-core across 10 representative routes — **0
violations**. Notable fixes vs. the old site: `maximum-scale=1` removed
(pinch-zoom works), body text contrast raised above 4.5:1, labels above every
input, errors inline and below.

## Placeholders — read before launch

Marked `@needs-verification` in `src/data/site.ts`. **All product figures are
illustrative** — factor rates, advance ranges, decision and funding times,
qualification thresholds. FTC substantiation rules require advertised results to
be typical and documented, and the GEO strategy depends entirely on these being
real, because specificity is what earns citations.

Also outstanding:

- `src/apply/AuthorizationText.tsx` — placeholder authorization language.
  Counsel must supply approved text aligned with the MCA agreement, then bump
  `AUTH_VERSION` in `apply/types.ts`.
- `src/pages/legal/*` — draft skeletons, not reviewed.
- Testimonials need written consent on file before they carry `Review` schema.
  Schema is deliberately not emitted yet.
- `/apply` and the contact forms post nowhere. See `SECURITY-NOTES.md`.
- `og-default.png` is referenced but not yet created.

## Upstream workarounds

`scripts/patch-manifests.mjs` runs on `postinstall`. `vite-react-ssg` and
`@vitejs/plugin-react` publish unresolved pnpm `catalog:` / `workspace:*`
specifiers in their devDependencies, which makes every `npm install` after the
first fail with `EUNSUPPORTEDPROTOCOL`. A dependency's devDependencies are never
installed by consumers, so stripping them is safe. Remove the script once
upstream fixes the publishes.

`react-router-dom` is pinned to `6.30.6` because `vite-react-ssg` imports
`react-router-dom/server.js`, which v7 removed. This carries three moderate
advisories with no 6.x fix — see `SECURITY-NOTES.md` for why they are inert here
and how to clear them.
