# GLD Funding

Rebuild of [gldfunding.com](https://www.gldfunding.com) — a merchant cash advance
provider in Garden City, NY.

Vite 8 · React 19 · TypeScript · Tailwind v4 · statically pre-rendered with
`vite-react-ssg`.

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # 71 static pages → dist/
pnpm preview      # serve dist/

pnpm test         # full QA suite (builds + serves dist/ automatically)
pnpm test:links   # broken-link sweep only
pnpm test:ui      # interactive runner
pnpm test:report  # open the last HTML report
```

**This repo uses pnpm** (`packageManager` in `package.json`, `pnpm-lock.yaml`,
and both workflows run `pnpm install --frozen-lockfile`). Installing with npm
creates a `package-lock.json` that drifts from the pnpm lockfile and breaks CI
at the install step.

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

## The overview video

`/funding/how-it-works` carries the 2021 animated explainer. It lives there
rather than on the homepage because the narration *is* that page's content —
it walks Apply → Approve → Get funded in order — and because a 3.4 MB asset and
a bright-blue cartoon palette both sit better on a consideration-stage page than
in the homepage's first viewport. The homepage links to it instead of embedding
a second copy.

**Source asset was re-encoded**, not just re-hosted: 1920×1080 / 8.6 MB →
1280×720 / 3.4 MB (60% smaller, no visible loss — it is flat vector animation).
Assets live in `public/videos/`.

Nothing loads until someone presses play:

| Before play | On play |
|---|---|
| 20 KB WebP poster + 2.5 KB VTT | 3.4 MB MP4 |

`preload="none"`, no autoplay, no loop — the narration means autoplaying audio
would be hostile. Verified: the MP4 is absent from the network log until the
play button is pressed.

**Captions are a real WebVTT track** (`description.en.vtt`, 33 cues), generated
from the narration's own word-level timings, and the full transcript renders in
a `<details>` below the player. That is WCAG 1.2.2 (Level A) and 1.2.3 satisfied
— an uncaptioned narrated video would have broken the AA claim below — and it
puts ~220 words of crawlable, on-topic text on the page for answer engines.
`VideoObject` schema with `Clip` chapters and `SeekToAction` ships with it.

⚠️ **Content drift:** the narration says "your last three months of your business
bank statements." The site now asks New York businesses for four. The video
predates that rule. Re-record or add an on-screen note before leaning on it in
paid campaigns.

## QA (`tests/`)

Playwright, run against the **production build** rather than the dev server —
`dist/` is what ships, and dev-server behaviour hides real defects (titles
injected late, no `404.html`, no postbuild artifacts) while inventing fake ones.
`playwright.config.ts` builds and serves it automatically, so `npm test` is the
only command.

| Spec | Covers |
|---|---|
| `links.spec.ts` | Crawls every built page, resolves every internal link, asset and `#fragment`. Also catches a **200 that is really the 404 body**. Verifies every route has one `<h1>`, a real title, a ≥40-char description and an `https://` canonical that is not Heroku. |
| `navigation.spec.ts` | Category menus by hover, click, **tap**, and keyboard; Escape and outside-click close; mobile panel actually fills the viewport; nav never wraps at 1024–1920px; header keeps a CTA at 320–430px; footer links resolve. |
| `quality.spec.ts` | axe WCAG 2.2 AA on 18 routes × 2 browsers; zero console/page errors; `robots.txt` names the AI crawlers; every `sitemap.xml` URL resolves; no placeholder metadata anywhere; the video stays unfetched until played and is captioned. |

Routes come from `tests/routes.ts`, read off `dist/` — a hand-written list
silently stops covering new pages.

**Two browsers:** Chromium desktop and **WebKit** on iPhone. WebKit matters here
because iOS Safari is most of the mobile traffic and the site leans on `dvh`,
`backdrop-filter` and `<video>` — it caught a keyboard-inaccessible scroll region
that Chromium did not.

### `gotoReady()`, and why it exists

The site is pre-rendered, so markup is on screen **and looks interactive**
before React attaches a single handler. Tests that clicked too early failed
intermittently with "element not found" on menus that open via JS. `RootLayout`
now sets `data-hydrated` on mount and `tests/helpers.ts` waits for it. Use
`gotoReady(page, path)` instead of `page.goto` for anything that interacts.

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
