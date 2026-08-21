# Merchant Web Platform — Technical Specification

**Status:** draft v1 · **Owner:** engineering · **Last updated:** 2026-08-20

A merchant signs in with an email address and a one-time code, activates the
account immediately, answers a short guided flow about their business, and comes
out the other side with a real, deployed, QA-passed website — either a redesign
of the one they already have, or a new one built from nothing.

This document specifies that system end to end. It is written against a working
reference implementation that already lives in this repository (the GLD Funding
site), so Part I is not theory — it is an inventory of what has been built,
measured and verified here, and it is the quality bar every generated merchant
site must clear.

---

## Table of contents

- [Part I — What was built on this site, in detail](#part-i--what-was-built-on-this-site-in-detail)
- [Part II — Authentication: email + OTP, instant activation](#part-ii--authentication-email--otp-instant-activation)
- [Part III — Business context intake](#part-iii--business-context-intake)
- [Part IV — Redesign vs. new build](#part-iv--redesign-vs-new-build)
- [Part V — Geo: local presence, geo-targeting, and answer engines](#part-v--geo-local-presence-geo-targeting-and-answer-engines)
- [Part VI — QA: the gate between "generated" and "published"](#part-vi--qa-the-gate-between-generated-and-published)
- [Part VII — Non-negotiable baseline for every site we ship](#part-vii--non-negotiable-baseline-for-every-site-we-ship)
- [Part VIII — Data model, APIs, infrastructure](#part-viii--data-model-apis-infrastructure)
- [Part IX — Phasing and open questions](#part-ix--phasing-and-open-questions)

---

# Part I — What was built on this site, in detail

The reference implementation. 72 pre-rendered HTML pages, 8.0 MB total build
output. Every decision below exists for a stated reason; the platform should
reproduce the reasoning, not just the artifact.

## 1. Stack and rendering model

| Layer | Choice | Version |
|---|---|---|
| Build | Vite | 8.2 |
| UI | React | 19.2 |
| Language | TypeScript | 6.0 |
| Styling | Tailwind CSS (`@theme` tokens, no config file) | 4.3 |
| Routing | react-router-dom | pinned **6.30.6** |
| Pre-render | `vite-react-ssg` | 0.9.2 |
| Icons | `@phosphor-icons/react` | 2.1 |
| Fonts | `@fontsource-variable/geist`, `geist-mono` | self-hosted |
| Lint | oxlint | 1.75 |
| E2E / QA | Playwright + `@axe-core/playwright` | 1.58 / 4.11 |
| Package manager | **pnpm 11.22** (npm installs break CI) | — |

**Every route is rendered to real HTML at build time.** This is the load-bearing
decision of the whole project, not a performance nicety. A growing share of
commercial search intent resolves inside ChatGPT, Perplexity and AI Overviews
rather than a blue-link results page, and **most AI crawlers do not execute
JavaScript**. A client-rendered SPA is invisible to exactly the systems the site
exists to reach.

The rule that follows: **content ships in the initial HTML response, always.
Client JavaScript is for interaction only, never for content delivery.** That
rule is inherited by every merchant site the platform generates.

## 2. Route map

Defined in [src/App.tsx](../src/App.tsx). Static paths for the two dynamic
segments are enumerated at build time via `getStaticPaths`.

```
/                                     home
/funding/merchant-cash-advance        product answer page
/funding/cost                         cost / factor rate
/funding/qualify                      qualification criteria
/funding/mca-vs-business-loan         comparison
/funding/how-it-works                 process + explainer video
/industries          /industries/:slug        8 industry pages
/locations           /locations/:slug         45 state pages
/resources           /resources/glossary      41 defined terms
/apply                                7-step conditional application
/about  /partners  /contact
/legal/privacy  /legal/terms  /legal/disclosures
/404                                  emits dist/404.html
*                                     client-side dead-link handling
```

Both a literal `404` route and a `*` catch-all exist. `vite-react-ssg` excludes
catch-all routes from pre-rendering, so the explicit `404` path is what actually
produces `dist/404.html` — the file static hosts serve for unknown URLs — while
`*` still handles client-side navigation to a dead link.

## 3. Content architecture

Every business fact lives in one module, [src/data/site.ts](../src/data/site.ts)
(288 lines): brand identity, address, phone, socials, product parameters
(advance range, factor rate range, term, decision/funding times, qualification
thresholds), CTA labels, testimonials, industries, and the 45-state table.

Two consequences worth carrying into the platform:

1. **One CTA label per intent.** `CTA.primary` is `"Check eligibility"` and it
   is the same string in the nav, in every hero, and in the footer. Merchants
   will otherwise ship four names for one button.
2. **Unverified numbers are marked in the source.** Every product figure carries
   an `@needs-verification` annotation, because FTC substantiation rules require
   advertised results to be *typical* and documented. For the platform this
   generalizes to: **any claim we generate on a merchant's behalf must be traced
   to something the merchant asserted, and stored with that provenance.**

## 4. Design system

Tokens in [src/styles/index.css](../src/styles/index.css) under Tailwind v4's
`@theme`:

- **Palette:** a petrol/deep-teal ground (`#04181c` → `#0e4c58`), paper neutrals,
  and **one locked accent** — mint `#00b39a`. Every primary action is mint;
  nothing else is. Semantic colors (`rate`, `good`, `warn`) are reserved and
  never decorative, and are contrast-tuned at their real 10–11px badge size
  against *both* white and the mint tint, not just white.
- **Neutrals biased cool-teal** so the page reads as one system rather than
  brand-color-on-grey.
- **Fluid type scale** with `clamp()` — display / h1 / h2 / h3 / lead — each with
  its own line-height and negative tracking.
- **One radius scale, documented, never mixed:** 4px cards and inputs, full pill
  on buttons, 2px chips.
- **Custom easing curves** as tokens; the CSS built-ins are too weak to read as
  intentional.

## 5. Motion

Every animation answers three questions: should this animate at all, what is its
purpose, does it get tiring on the fiftieth repeat. `ease-in` is never used for
an entrance.

| Element | Duration | Curve |
|---|---|---|
| Button press | 120ms | `ease-out`, `scale(0.97)` on `:active` |
| Field focus | 150ms | `ease-out` |
| Step change | 240ms | `cubic-bezier(.32,.72,0,1)` — forward left, back right |
| Section reveal | 400ms | `cubic-bezier(.23,1,.32,1)`, fires **once**, then the observer disconnects |
| Calculator figures | 280ms | cubic ease-out count-up |
| How-it-works rail | scroll-linked | none |

## 6. The hero — hand-written WebGL2

[src/components/CapitalFlow.ts](../src/components/CapitalFlow.ts): one
`gl.POINTS` draw call, particle positions computed on the GPU from a time
uniform. **4.2 KB raw / 2.05 KB gzipped.**

three.js was the obvious reach and cost 125 KB gzipped for a single draw call —
39% over the hero's 90 KB budget. Hand-rolling removed the dependency entirely.

It is **never the LCP element**. The LCP is a CSS-painted gradient poster, so
there is no image request on the critical path. WebGL boots after `load`, and
only if *every* gate passes:

- not `prefers-reduced-motion`
- viewport ≥ 768px (never on mobile)
- `navigator.hardwareConcurrency` ≥ 4
- not `saveData`, not `2g`
- a WebGL context is actually obtainable

If any gate fails the poster simply stays. The chunk is stripped from
`modulepreload` in the postbuild step so gated-out users never fetch bytes they
will not use.

## 7. The application flow (`src/apply/`)

Seven steps governed by one rule: **only show a question when we need the
answer.** A skipped step is never rendered, never numbered, and never appears as
a greyed-out row in the review list.

| Step | Shown when |
|---|---|
| 0. Pre-check (no PII) | Always — revenue, time in business, industry |
| 1. Business | Always |
| 2. Owner | Always |
| 3. Additional owner | Primary owner declared a second owner ≥ 20% |
| 4. Funding | Always |
| 5. Existing financing | Always — detail fields only if "Yes" |
| 6. Bank statements | Always — **4 months in NY, 3 elsewhere** |
| 7. Authorization | Always — second signature block only if step 3 ran |

Mechanics worth reusing verbatim in the merchant onboarding flow:

- Visibility is data, not JSX: `STEPS[].visible(data)` in
  [src/apply/types.ts](../src/apply/types.ts). Verified behaviour: a
  single-owner applicant sees "Step 1 of 6"; declaring a second owner
  re-numbers to 7 and adds the second signature block.
- **State-dependent requirements are derived, not asked.**
  `requiredStatements(d)` reads the business's state and returns 4 for NY, 3
  otherwise. The merchant never sees the rule, only the correct ask.
- **Validation messages say how to fix it**, not that something is wrong:
  `"Enter a full email address, like you@business.com"`, not `"Invalid email"`.
  See [src/apply/validate.ts](../src/apply/validate.ts).
- Conditional validation only fires for questions that were actually asked — the
  second-owner question is only required when ownership is between 1 and 99%.
- Only bank statements block submission. Everything else is a stipulation
  requested after review. **One required field is worth ten optional ones.**
- Uploads report **real per-file progress**, not a fake animated bar.
- The e-signature captures an audit record — timestamp, user agent, and the
  exact authorization text version (`AUTH_VERSION = 'gld-app-auth-2026-08'`) —
  because E-SIGN/UETA defensibility depends on knowing *which* text was signed.

## 8. The explainer video

Lives on `/funding/how-it-works` rather than the homepage, because the narration
*is* that page's content and a 3.4 MB asset does not belong in a homepage's
first viewport.

- Source re-encoded, not merely re-hosted: 1920×1080 / 8.6 MB → 1280×720 /
  3.4 MB. 60% smaller with no visible loss (flat vector animation).
- `preload="none"`, no autoplay, no loop. Before play the page carries a 20 KB
  WebP poster and a 2.5 KB VTT; the MP4 is verified absent from the network log
  until the play button is pressed.
- **Real WebVTT captions** (33 cues) generated from word-level narration
  timings, plus the full transcript in a `<details>`. That satisfies WCAG 1.2.2
  (A) and 1.2.3 — an uncaptioned narrated video would have broken the AA claim —
  and puts ~220 words of crawlable on-topic text on the page.
- `VideoObject` schema with `Clip` chapters and `SeekToAction`.
- A tracked content-drift issue is documented in the README: the narration says
  "three months of bank statements" while the site now asks New York businesses
  for four. **Media outlives copy. The platform needs a drift check.**

## 9. GEO and structured data

[src/lib/seo.tsx](../src/lib/seo.tsx) exports a `<Seo>` component plus typed
JSON-LD builders. Everything lands in the pre-rendered HTML.

- A 40–60 word `<AnswerBlock>` opens **every** page, before any marketing copy.
- JSON-LD emitted: `FinancialService`, `LocalBusiness` (with `GeoCoordinates`
  and `OpeningHoursSpecification`), `FinancialProduct`, `FAQPage`,
  `BreadcrumbList`, `ItemList`, `DefinedTermSet`, `VideoObject`.
- Canonical URL, OpenGraph, Twitter card, and `article:modified_time` on every
  route. Titles avoid doubling the brand when the title already names it.
- `robots.txt` **names AI crawlers explicitly** rather than relying on wildcard
  behaviour: GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User,
  ClaudeBot, Claude-User, Claude-SearchBot, Google-Extended, Applebot,
  Applebot-Extended, Bingbot, cohere-ai, meta-externalagent.
- `llms.txt` gives answer engines a plain-language product summary.
- Geographic surface: 45 state pages carrying **real regulatory differences**
  (New York's CFDL offer-summary requirement under NYDFS, California SB 1235,
  Utah's registration act, and so on), not templated city spam. 8 industry pages
  with genuinely distinct use cases and ranges.

## 10. Accessibility

WCAG 2.2 AA, verified with axe-core across 18 routes × 2 browsers — **0
violations**. Fixes against the predecessor site: `maximum-scale=1` removed so
pinch-zoom works, body contrast raised above 4.5:1, visible labels above every
input, errors inline and below the field they belong to.

## 11. QA suite (`tests/`)

Playwright, run against the **production build** rather than the dev server.
`dist/` is what ships; dev-server behaviour hides real defects (titles injected
late, no `404.html`, no postbuild artifacts) while inventing fake ones.
[playwright.config.ts](../playwright.config.ts) builds and serves `dist/`
automatically, so `pnpm test` is the only command.

| Spec | Covers |
|---|---|
| `links.spec.ts` | Crawls every built page; resolves every internal link, asset and `#fragment`. Catches a **200 that is actually the 404 body**. Asserts every route has exactly one `<h1>`, a real title, a ≥40-char description, and an `https://` canonical that is not the legacy host. |
| `navigation.spec.ts` | Category menus via hover, click, **tap** and keyboard; Escape and outside-click close; mobile panel fills the viewport; nav never wraps between 1024–1920px; header keeps a CTA at 320–430px; footer links resolve. |
| `quality.spec.ts` | axe WCAG 2.2 AA on 18 routes × 2 browsers; zero console and page errors; `robots.txt` names the AI crawlers; every `sitemap.xml` URL resolves; no placeholder metadata anywhere; the video stays unfetched until played, and is captioned. |

Two details that matter more than they look:

- **Routes are read off `dist/`** ([tests/routes.ts](../tests/routes.ts)), never
  hand-listed. A hand-written list silently stops covering new pages.
- **`gotoReady()`** ([tests/helpers.ts](../tests/helpers.ts)) — a pre-rendered
  page is on screen and *looks* interactive before React attaches a single
  handler, so early clicks failed intermittently. `RootLayout` sets
  `data-hydrated` on mount and the helper waits for it.

Browsers: Chromium desktop and **WebKit on iPhone 14 Pro**. WebKit is not
optional — iOS Safari is most mobile traffic, the site leans on `dvh`,
`backdrop-filter` and `<video>`, and WebKit caught a keyboard-inaccessible
scroll region that Chromium did not.

## 12. Build, deploy, hosting

`pnpm build` = `tsc -b` → `vite-react-ssg build` → `node scripts/postbuild.mjs`.

[scripts/postbuild.mjs](../scripts/postbuild.mjs) generates the crawl surface and
trims the critical path:

1. `robots.txt`
2. `sitemap.xml` — with priority reflecting **commercial intent, not depth**
   (`/` 1.0, `/apply` and `/funding/*` 0.9, industries 0.8, locations 0.7, legal
   0.3)
3. `llms.txt`
4. Strips the WebGL `modulepreload`
5. `.nojekyll`

**Environment-driven origin.** `BASE_PATH` and `SITE_ORIGIN` make one build
correct for whichever URL it is served from — root custom domain or a GitHub
Pages project subpath. `BASE_PATH` becomes Vite's `base`, which `vite-react-ssg`
passes to react-router's `basename`, so assets and every `<Link>` pick up the
prefix.

**Staging builds refuse indexing.** A build counts as production *only* when
`SITE_ORIGIN` is the canonical origin **and** `BASE_PATH` is empty. Anything else
emits `Disallow: /` **and** `<meta name="robots" content="noindex,nofollow">` on
every page — both, because `robots.txt` only asks a crawler not to fetch, while
a URL linked from elsewhere can still be indexed without `noindex`. This is
directly load-bearing for the platform: **a merchant's draft site must never be
indexable, and an answer engine that ingests a draft keeps citing it long after
it changes.**

Host config: [vercel.json](../vercel.json) (`cleanUrls`, no trailing slash,
security headers, immutable caching on `/assets/*` and `/videos/*`, legacy
redirects) with a Netlify/Cloudflare-style [public/_headers](../public/_headers)
mirror. Security headers on every response: `nosniff`, `X-Frame-Options: DENY`,
`Referrer-Policy: strict-origin-when-cross-origin`, a `Permissions-Policy`
denying geolocation/mic/camera, and HSTS `max-age=63072000; includeSubDomains;
preload`.

## 13. Known constraints, carried forward

Documented in [SECURITY-NOTES.md](../SECURITY-NOTES.md) and the README:

- `react-router-dom` is pinned at 6.30.6 because `vite-react-ssg` imports
  `react-router-dom/server.js`, removed in v7. Three moderate advisories have no
  6.x fix. Both are argued inert here — every `to=` is a hardcoded internal
  literal, and there is no runtime SSR to deserialize errors into — with an
  explicit **invariant to preserve: if a route target is ever built from user
  input, the open-redirect advisory becomes live.** The platform builds routes
  from merchant data, so **this invariant does not survive the port.** Migrate
  to `react-router@7.18.2+` (or a different pre-renderer) before the platform
  generates a single route from user input.
- `scripts/patch-manifests.mjs` runs on `postinstall` to strip unresolved pnpm
  `catalog:` / `workspace:*` specifiers that upstream packages publish in their
  devDependencies. Remove once upstream fixes it.
- `/apply` and the contact forms currently post nowhere.
- Legal pages are draft skeletons pending counsel; testimonials carry no `Review`
  schema until written consent is on file; `og-default.png` is referenced but not
  yet created.

---

# Part II — Authentication: email + OTP, instant activation

## 2.1 The flow

```
  ┌─ enter email ────────────────────────────────────────────┐
  │  "Enter your email. We'll send you a 6-digit code."      │
  └──────────────────────┬───────────────────────────────────┘
                         │  POST /auth/otp/start
                         ▼
  ┌─ check your email ───────────────────────────────────────┐
  │  6 digits, auto-advancing inputs, paste-whole-code works │
  │  autocomplete="one-time-code"  inputmode="numeric"       │
  │  Resend available after 30s. "Wrong email?" → back.      │
  └──────────────────────┬───────────────────────────────────┘
                         │  POST /auth/otp/verify
                         ▼
  ┌─ account active ─────────────────────────────────────────┐
  │  No password. No confirmation step. No "verify your      │
  │  email" second round trip — the code *was* the           │
  │  verification. Land directly in the onboarding flow.     │
  └──────────────────────────────────────────────────────────┘
```

There is no separate sign-up and sign-in. The same two screens create an account
if the email is new and resume one if it is not. The merchant never chooses.

## 2.2 Requirements

**Code**
- 6 digits, cryptographically random (`crypto.randomInt`), never sequential or
  time-derived.
- TTL **10 minutes**. Single use. Invalidated on success, on a new code being
  issued for the same email, and on the 5th failed attempt.
- Stored as a **hash** (Argon2id or scrypt), never plaintext — an OTP table dump
  must not be a login table.
- Bound to the originating request: a `login_attempt_id` in an HttpOnly cookie,
  so a code phished out of an inbox cannot be redeemed from an unrelated browser
  session. (Fallback: allow cross-device redemption but re-confirm the email.)

**Rate limits** (all fail closed)
- 5 verify attempts per code, then burn it.
- 5 code requests per email per hour; 20 per IP per hour; 100 per IP per day.
- Exponential backoff surfaced honestly in the UI ("Try again in 4 minutes"),
  never a silent no-op.

**Enumeration resistance**
- `POST /auth/otp/start` returns the identical response and timing whether or
  not the email exists. The "check your email" screen is unconditional.

**Email deliverability** — this is the whole product's front door; treat it as
infrastructure, not a template:
- A transactional provider on a **dedicated sending subdomain**
  (`mail.<platform>`), with SPF, DKIM and DMARC (`p=quarantine` minimum)
  configured before the first send.
- Subject and preheader carry the code, so it is visible in the notification:
  `"123456 is your sign-in code"`.
- Plain-text alternative always. No tracking pixels on the OTP email — they are
  a deliverability liability and, in several jurisdictions, a consent problem.
- Bounce and complaint webhooks feed a suppression list; a merchant whose domain
  hard-bounces gets an in-product message, not silence.

**Session**
- HttpOnly, `Secure`, `SameSite=Lax` cookie. Rotating refresh token, ~30-day
  idle expiry, absolute expiry ~90 days. Re-auth (fresh OTP) required for
  destructive actions: publishing, changing DNS, deleting a site, or changing the
  account email.
- Session list in settings with device, location and last-used, plus "sign out
  everywhere".

**Accessibility of the code entry** — one `<input>` per digit is the common
pattern and the common failure. Requirements: a real `<label>`, paste of the
whole code into any box distributes it, backspace moves back, screen readers
announce "digit 3 of 6", and `autocomplete="one-time-code"` so iOS offers the
code from the notification.

## 2.3 What "activate right away" must mean

The account is fully usable the moment the code verifies. No approval queue, no
"we'll email you when your workspace is ready", no credit card. The first screen
after verification is the first question of the onboarding flow — not a dashboard
with an empty state.

**Deferred obligations** (email confirmed by the OTP itself; the rest is asked
only when it becomes load-bearing):

| Needed for | Asked at |
|---|---|
| Nothing | account creation |
| Publishing to a custom domain | domain step |
| Anything billable | checkout |
| Legal/regulated claims on the site | the compliance step of intake |

---

# Part III — Business context intake

The goal is a complete, structured picture of the business in **under eight
minutes on a phone**, with the merchant typing as little as possible.

## 3.1 Design principles

1. **Derive before you ask.** Every field that can be fetched from a URL, a
   Google Business Profile, or a public registry is fetched and shown for
   confirmation. Confirming is an order of magnitude easier than typing.
2. **One decision per screen on mobile**, grouped panels on desktop. Never a
   40-field form.
3. **Branch, never grey out.** Same rule as the application flow in Part I: a
   step that does not apply is never rendered and never numbered.
4. **Progress must be honest.** If answering "I have three locations" adds two
   screens, the counter changes and the merchant sees why.
5. **Everything is skippable except the four things that block a build.** Marked
   below as **[required]**.
6. **Save on every field change.** The flow is resumable from any device with a
   fresh OTP. A merchant interrupted by a customer at the counter must lose
   nothing.
7. **Plain language, no jargon.** "What should visitors do first?" not "Define
   your primary conversion goal."
8. **Show the site being built.** A live preview updating as answers land is the
   single biggest completion-rate lever; it converts a form into a tool.

## 3.2 Step 0 — The fork (before anything else)

One question, asked immediately after activation:

> **Do you have a website today?**
> · Yes — here it is: `[ url ]`
> · No, this is my first one
> · I have one but I want to start over

The answer routes to [Part IV](#part-iv--redesign-vs-new-build) and, when a URL
is given, kicks off the enrichment crawl **in the background while the merchant
keeps answering**. By the time they reach the brand step, colors, logo and copy
are already extracted and pre-filled.

## 3.3 Automatic enrichment

Run concurrently, each source independently failable — a dead source degrades to
a blank field, never to a blocked flow.

| Source | Yields |
|---|---|
| Existing site crawl | Title, meta, logo, favicon, palette (computed from CSS + logo), fonts, headings, services, hours, phone/email, address, social links, full page inventory, image assets |
| Google Business Profile / Places | Canonical NAP, categories, hours (incl. special hours), lat/lng, rating and review count, photos, price level |
| Social profiles | Bio, profile and cover imagery, posting cadence, follower counts |
| Domain WHOIS/DNS | Registrar, nameservers, existing MX (so we never break their email) |
| Secretary-of-State registry (optional, US) | Legal entity name, entity type, formation date, standing |
| Existing analytics (if merchant connects) | Top pages, top queries, traffic by geography, device split, conversions — the redesign's evidence base |

Everything enriched is presented as **"Is this right?"** with an inline edit, and
stored with `source` and `confidence`. Merchant-entered values always beat
enriched ones and are flagged as such.

## 3.4 The intake — field inventory

### A. Identity **[required]**
| Field | Notes |
|---|---|
| Business name (display) | **[required]** |
| Legal entity name + type | Pre-filled from registry; only asked if they want it in the footer/legal pages |
| One sentence: what you do | **[required]** · placeholder shows a real example in their category |
| Category / industry | **[required]** · typeahead over a fixed taxonomy — free text here poisons the schema and the templates |
| Year founded | Drives "serving X since YYYY" and `foundingDate` |
| Languages the site should speak | Default: one. Multi-language triggers the i18n branch |

### B. Places and service area **[required]**
The single most consequential branch. Ask the shape first:

> **Where do customers find you?**
> · At my location — customers come to me
> · I go to them — I travel to customers
> · Both
> · Online only

Then, per shape:

| Shape | Collected |
|---|---|
| Storefront | Per location: street address, unit, city, state/region, postal code, country, phone, email, hours (incl. holiday/seasonal), timezone, parking/access notes, lat/lng (map-pin confirm), photos, "is this the primary location?" |
| Service area | Base city, **service radius or explicit list of cities/counties/ZIPs**, travel-fee boundary, whether the base address is public |
| Both | Both of the above |
| Online only | Countries/regions shipped or served, fulfilment/lead times |

Rules: **NAP is entered once and referenced everywhere.** A location page is
generated only for a place that physically exists; service areas produce
*content*, not a page per ZIP code. See [Part V](#part-v--geo-local-presence-geo-targeting-and-answer-engines).

### C. What you offer
- Services or products, as a list with name, one-line description, and optional
  price or "from" price. Bulk paste and CSV/menu upload both accepted.
- Category grouping if more than ~8 items.
- Booking/ordering: is there an existing link (Calendly, Square, OpenTable,
  Toast, Resy, DoorDash)? Paste it and we wire it to the primary CTA.
- Seasonality — drives which offering leads the homepage at a given time of year.

### D. Proof
- Years in business, customers served, jobs completed — **each stored with a
  merchant attestation checkbox**, because these are advertised claims. Same
  discipline as the `@needs-verification` markers in Part I.
- Reviews: connect GBP/Yelp/Facebook to pull live, or paste manually.
  **Manually pasted testimonials require an explicit consent flag before they
  are allowed to carry `Review` schema** — exactly the constraint standing in
  this repository today.
- Licenses, certifications, insurance, association memberships, awards. These
  are trust signals *and* entity signals for answer engines.
- Team: names, roles, photos, bios. Optional, high-impact for local trust.

### E. Brand **[required — or explicitly delegated]**
- Logo upload (SVG preferred; PNG accepted and traced/cleaned). Or: **"I don't
  have one"** → generate a wordmark from the business name in a chosen type
  pairing.
- Colors: extracted from logo/site with a swatch confirm, or picked from
  curated, **pre-contrast-checked** palettes. Never allow a palette that cannot
  clear 4.5:1 for body text — the system silently derives compliant tints rather
  than shipping a violation.
- Typography: 3–4 pairings shown as real rendered specimens, not names.
- Photography: upload, connect Instagram/Google, or select from a licensed
  stock set filtered by category. **Every image's license is recorded.**
- Existing brand guidelines PDF → parsed for colors and fonts.

### F. Voice and audience
- Who is the customer, in the merchant's own words (one text box, optional).
- Tone: three named options with a live-rewritten sample paragraph from their
  own copy — "Warm and local" / "Direct and professional" / "Premium and quiet".
- Words to avoid, and claims never to make. Feeds every generation prompt as a
  hard constraint.

### G. The goal **[required]**
> **When someone lands on your site, what do you most want them to do?**
> Call · Book · Request a quote · Buy · Visit in person · Message · Join a list

This selection determines the primary CTA everywhere, the header's persistent
action, the mobile sticky bar, and what "conversion" means in the merchant's
dashboard. Optional secondary action allowed; a third is refused.

### H. Connections
Offered, never required, each with a one-line "what this does for you":
booking, POS/e-commerce, payments, CRM, email marketing, chat, reviews,
analytics, Search Console, Google Business Profile, Meta/TikTok, call tracking.

### I. Compliance
- Regulated-industry flags (health, legal, financial, food, childcare, cannabis,
  firearms) → required disclosures, license display, and restricted claim
  vocabulary.
- Privacy contact, data-request address, and whether they collect data from
  California / EU / UK visitors → drives the consent banner and privacy policy.
- Accessibility statement contact.
- Cookie/analytics consent posture.

### J. Domain and delivery **[required at publish, not at intake]**
- Existing domain, registrar, and who has access.
- **Existing MX records are read and preserved.** Breaking a merchant's email
  while launching their website is the single most damaging failure mode in this
  category of product — the DNS step must show current MX, state explicitly that
  it will not be touched, and refuse any change set that removes them.
- Or: buy a domain in-flow. Or: publish to a `*.platform` subdomain now and
  attach a domain later.

## 3.5 What the merchant never sees

Derived silently: timezone, currency and locale from country; hreflang; sitemap
priorities; schema type selection from category; image sizes and formats;
redirect map; robots posture; contrast-corrected color ramps; font subsetting;
which state/regional disclosures apply.

---

# Part IV — Redesign vs. new build

Same output contract either way: a deployed, QA-passed site meeting
[Part VII](#part-vii--non-negotiable-baseline-for-every-site-we-ship). The
difference is entirely in what comes *in*.

## 4.1 Redesign path

### Step 1 — Audit the existing site (automated, before anything is designed)

Produce a stored, merchant-visible report:

| Dimension | Checks |
|---|---|
| Inventory | Every URL, title, description, `<h1>`, word count, images, outbound links |
| Performance | Core Web Vitals (field data from CrUX if available, lab from Lighthouse), payload, render-blocking resources |
| Accessibility | axe WCAG 2.2 AA on every discovered page; the *count* is the baseline we must beat |
| SEO | Missing/duplicate titles and descriptions, canonicals, indexability, structured data present/absent, sitemap and robots validity |
| Local | NAP consistency across site, GBP, and major directories; `LocalBusiness` schema presence and correctness |
| Content | What is genuinely worth keeping — this is the asset, and the most common way redesigns lose traffic is by throwing it away |
| Security/infra | TLS, headers, mixed content, CMS version and known CVEs |
| Traffic | If analytics connected: top entry pages, top queries, converting paths, geography |

### Step 2 — Content migration
Every page is classified: **keep** (migrate, re-typeset), **merge** (fold into a
stronger page), **rewrite** (right topic, weak execution), **drop** (dead or
duplicate). The merchant sees the table and can override any row.

**Ranking pages are never dropped without an explicit confirmation** naming the
traffic at stake.

### Step 3 — Redirect map **[gate — non-negotiable]**
Every old URL maps to a new one, 301, no chains, no loops. Anything with no
sensible target maps to the nearest relevant page, never blanket-to-homepage.
The map is generated automatically, reviewed by the merchant, and **verified by
an automated test that must pass before publish** — the exact class of check
`links.spec.ts` already performs in this repository, extended to the old URL set.

### Step 4 — Cutover
1. Build and QA on a preview URL, `noindex` enforced by the build (the
   production-detection logic in `postbuild.mjs` generalizes directly).
2. Merchant reviews on a real device.
3. Lower DNS TTL 24h ahead.
4. Publish. **MX untouched.**
5. Post-publish sweep: redirects resolve, sitemap submitted, GBP website URL
   updated, Search Console change-of-address if the domain moved.
6. Watch: 404 rate, CWV, and indexed-page count for 14 days, with an alert on
   regression and a documented rollback (previous build is retained and
   re-deployable).

## 4.2 New-build path

No audit, no migration, no redirects. Instead:

- **Naming and domain assistance** — availability check across TLDs, with a
  strong preference for the exact business name.
- **Content generation from intake**, never from thin air. Every generated
  sentence traces to a merchant-supplied fact. Nothing that cannot be traced is
  written, and no claim is invented to fill a section — an empty section is
  removed instead.
- **Photography plan** — what to shoot with a phone this week, in priority
  order, since a new business's biggest asset gap is real imagery.
- **A launch checklist**: GBP creation and verification, Bing Places, Apple
  Business Connect, the two or three directories that matter in their category,
  and a review-request flow.

## 4.3 Generation architecture (both paths)

```
intake data ──▶ site plan ──▶ page specs ──▶ components ──▶ build ──▶ QA ──▶ preview ──▶ publish
   (typed)      (routes,      (sections,     (design       (static)  (gates)           (versioned)
                 nav, IA)      copy, schema)   system)
```

- **The site plan is data, not prose.** A typed structure — routes, navigation,
  per-page section list, schema types — that can be diffed, versioned, and
  regenerated deterministically.
- **Sections come from a fixed, hand-built, QA'd library.** The generator
  *selects and fills*; it does not author novel layout. This is what makes the
  quality bar in Part VII enforceable at all.
- **Static output.** Same rationale as Part I: crawlers, speed, cost, and
  cacheability. Dynamic behaviour (forms, booking, chat) is progressive
  enhancement on top.
- **Every build is a version.** Immutable, previewable, one-click rollback.

---

# Part V — Geo: local presence, geo-targeting, and answer engines

"Geo" covers three distinct things. All three are in scope; conflating them is
how sites end up with 400 doorway pages and a Google penalty.

## 5.1 Local presence (the real one)

**Structured data**, emitted into pre-rendered HTML — the builders in
[src/lib/seo.tsx](../src/lib/seo.tsx) generalize directly:

- `LocalBusiness` (or the correct subtype for the category — `Restaurant`,
  `Dentist`, `HomeAndConstructionBusiness`, …) per real location, with
  `PostalAddress`, `GeoCoordinates`, `telephone`, `openingHoursSpecification`,
  `areaServed`, `priceRange`, `sameAs`.
- `Organization` at the brand level, `@id`-linked to each location.
- `Service` with `areaServed` for service-area businesses.
- `BreadcrumbList`, `FAQPage`, `Review`/`AggregateRating` **only where consent
  and genuine review data exist**.

**NAP consistency.** One canonical record in the platform, pushed to the site,
GBP, Bing Places, Apple Business Connect, and monitored across major directories
with a drift alert. Inconsistent NAP is the most common cause of weak local
ranking and the easiest thing for a platform to solve permanently.

**Location pages** — one per physical location, each carrying content that only
that location could have: its own hours, staff, photos, directions, parking,
transit, neighborhoods served, and location-specific FAQs. **A location page for
a place that does not exist is a doorway page.** The platform refuses to
generate one.

**Service-area content** is generated for a *bounded* list the merchant
confirms, and only where there is something real to say. The rule from Part I
applies: the 45 state pages in this repository earn their existence because each
carries a genuine regulatory difference. Templated city pages differing only by a
noun do not, and actively hurt.

**Maps** are embedded lazily behind a static image placeholder — a third-party
map iframe on load costs Core Web Vitals and sets cookies before consent.

## 5.2 Geo-targeting the visitor

- **Never gate content on IP geolocation.** It breaks crawlers, poisons CDN
  caches, and is wrong often enough to be insulting ("Your nearest store:
  Newark" to someone in Manhattan).
- Correct pattern: the page is static and complete for everyone; a *hint* layer
  personalizes on top — "Looks like you're near our Garden City location →" with
  a visible, dismissible way to change it, and the choice persisted.
- Where the CDN supplies geo headers at the edge (country/region), use them for
  currency, language suggestion and phone-number formatting — with an override
  always present, and `Vary`/cache keys set correctly so one visitor's region
  never leaks into another's cached page.
- Multi-language sites: real `hreflang` pairs, `lang` on `<html>`, self-canonical
  per locale. Never auto-redirect by IP; suggest and remember.
- `Permissions-Policy: geolocation=()` stays denied unless a feature genuinely
  needs the browser API (store locator "use my location"), in which case it is
  requested in response to a user gesture, never on load.

## 5.3 GEO — generative engine optimization

The strategy already proven in Part I, productized per merchant:

- **Static HTML for all content.** Non-negotiable; most AI crawlers do not run
  JavaScript.
- **A 40–60 word answer block opening every page**, before marketing copy —
  directly answering the question that page exists to answer.
- **`robots.txt` naming AI crawlers explicitly**, with a per-merchant opt-out
  for anyone who does not want to be ingested (some regulated merchants will
  not).
- **`llms.txt`** — a plain-language summary of the business, its offerings,
  service area, and contact details.
- **Entity clarity**: consistent naming, `sameAs` links to every profile,
  unambiguous category. Answer engines resolve entities before they cite them.
- **Specificity is what earns citations.** Real prices, real ranges, real hours,
  real service areas. This is precisely why the intake in Part III insists on
  attested facts rather than adjectives.
- **Freshness signals**: `article:modified_time`, `lastmod` in the sitemap, and a
  content-drift check flagging copy that contradicts other assets (the video
  drift documented in Part I is the canonical example).

---

# Part VI — QA: the gate between "generated" and "published"

Every site runs the full suite against its **production build**, on a preview
URL, before publish is offered. A failing gate blocks publish; there is no
override for the P0 set.

## 6.1 Gates

| # | Gate | Assertion | Severity |
|---|---|---|---|
| 1 | Build | Type-check, lint, build all succeed | P0 |
| 2 | Links | Every internal link, asset and `#fragment` resolves; no 200-that-is-really-a-404 | P0 |
| 3 | Redirects (redesign only) | Every old URL 301s to a live target; no chains, no loops | P0 |
| 4 | Metadata | Exactly one `<h1>`; unique title; description ≥ 40 chars; `https://` canonical; no placeholder text anywhere | P0 |
| 5 | Accessibility | axe WCAG 2.2 AA, **0 violations**, every route × desktop Chromium + mobile WebKit | P0 |
| 6 | Console | Zero console errors, zero page errors | P0 |
| 7 | Forms | Every form actually delivers — a live test submission is received and confirmed end to end | P0 |
| 8 | Contact integrity | `tel:` and `mailto:` match the canonical NAP record exactly | P0 |
| 9 | Crawl surface | `robots.txt` correct for environment; every `sitemap.xml` URL resolves | P0 |
| 10 | Draft safety | Non-production builds emit `Disallow: /` **and** per-page `noindex` | P0 |
| 11 | Structured data | Every JSON-LD block validates; required properties present for the declared type | P1 |
| 12 | Performance | LCP ≤ 2.0s, INP ≤ 200ms, CLS ≤ 0.05 (throttled lab); initial JS ≤ 90 KB gzipped | P1 |
| 13 | Responsive | 320 / 375 / 768 / 1024 / 1440 / 1920 — no horizontal scroll, no wrapped nav, CTA always reachable | P1 |
| 14 | Media | Images sized and lazy below the fold; video `preload="none"` and captioned; no autoplay with audio | P1 |
| 15 | Visual regression | Snapshot diff vs. last approved build; changes above threshold need review | P2 |
| 16 | Content safety | No claim without an attested source; regulated-category vocabulary check | P0 for regulated |

## 6.2 Method notes carried from Part I

- Test the **production build**, never a dev server.
- **Enumerate routes from the built output**, never a hand-written list.
- **Wait for hydration** before interacting — the `data-hydrated` + `gotoReady()`
  pattern. Pre-rendered pages look interactive before they are.
- **Two engines minimum**, one of them WebKit on a real iPhone profile.
- Retain traces and screenshots on failure; a merchant-facing QA report shows
  what passed in plain language and what is being fixed.

## 6.3 Continuous QA after publish

Weekly per live site: uptime and TLS expiry, broken-link sweep, CWV field data,
form-delivery canary, NAP drift, GBP sync, 404-rate alerting, and a content-drift
check against connected assets. Regressions open a task in the merchant's
dashboard with a one-click fix where the platform can apply one.

---

# Part VII — Non-negotiable baseline for every site we ship

Anything below this line is a bug, not a preference.

**Performance** · Static HTML, CDN-served. LCP ≤ 2.0s / INP ≤ 200ms / CLS ≤ 0.05
on a throttled mid-range mobile. Initial JS ≤ 90 KB gzipped. Fonts self-hosted,
variable, subset, `font-display: swap`, preloaded — never a third-party font CDN.
Images AVIF/WebP with responsive `srcset`, explicit `width`/`height`, lazy below
the fold. Immutable caching on hashed assets. No render-blocking third-party
script; analytics deferred; embeds behind a click-to-load facade.

**Accessibility** · WCAG 2.2 AA, verified, zero axe violations. Full keyboard
operability with a visible focus ring. Real labels above inputs; errors inline,
below the field, describing the fix. Contrast ≥ 4.5:1 for body text at its actual
rendered size. Pinch-zoom never disabled. `prefers-reduced-motion` respected
everywhere. Semantic landmarks, one `<h1>`, no heading-level skips. Captions on
any narrated media.

**Security** · HTTPS enforced, HSTS with `includeSubDomains; preload`. `nosniff`,
`X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, a
restrictive `Permissions-Policy`, and a CSP that is actually tight because the
output is static and the asset origins are known. Forms rate-limited with
invisible bot mitigation — never a CAPTCHA as the first line. No secrets in
client bundles. Uploads scanned, typed, and size-capped.

**Privacy and legal** · Privacy policy and terms generated from the merchant's
actual data practices, not boilerplate. Consent banner only where a jurisdiction
requires one, and it genuinely gates the tags. Cookie inventory maintained.
Accessibility statement. Regulated-industry disclosures rendered where
applicable. Merchant data export and deletion available from settings.

**Content integrity** · No fabricated claims, statistics, reviews, or credentials
— ever. Every advertised figure traces to a merchant attestation with a
timestamp. Testimonials carry `Review` schema only with recorded consent. Stock
imagery is never presented as the merchant's own premises, team, or work.

**Craft** · One accent color, one radius scale, one type scale, one CTA label per
intent. Motion with a stated purpose and a custom curve. Empty states written for
a human. Real copy, not lorem. A 404 that helps.

---

# Part VIII — Data model, APIs, infrastructure

## 8.1 Core entities

```
merchant            id, name, created_at, status, plan
user                id, merchant_id, email (citext, unique), role,
                    email_verified_at, last_seen_at
otp_code            id, email, code_hash, attempt_id, expires_at,
                    consumed_at, attempts, ip, user_agent
session             id, user_id, refresh_hash, device, ip, region,
                    created_at, last_used_at, revoked_at

business_profile    merchant_id, legal_name, dba, category, founded,
                    description, languages[], tone, audience,
                    avoid_terms[], goal_primary, goal_secondary
location            id, merchant_id, label, address{}, lat, lng, phone,
                    email, timezone, hours{}, special_hours[],
                    is_primary, is_public
service_area        id, merchant_id, mode(radius|list), origin, radius_km,
                    regions[]
offering            id, merchant_id, name, description, price_from,
                    price_to, group, order, booking_url
proof               id, merchant_id, kind(review|award|license|stat),
                    body, author, source, consent_at, attested_at
brand_asset         id, merchant_id, kind(logo|photo|font|palette|doc),
                    url, license, source, extracted_from
claim               id, merchant_id, text, source_field, attested_by,
                    attested_at            -- provenance for every assertion

site                id, merchant_id, mode(redesign|new), domain,
                    status(draft|preview|live), current_version_id
site_version        id, site_id, plan{}, build_hash, preview_url,
                    qa_report{}, published_at, published_by
page                id, site_version_id, path, title, description,
                    sections[], schema[], source(kept|merged|rewritten|new)
redirect            id, site_id, from_path, to_path, code, verified_at
audit_report        id, site_id, source_url, findings{}, created_at
integration         id, merchant_id, provider, scopes[], status, tokens(enc)
deployment          id, site_version_id, target, status, logs_url, rolled_back_from
lead                id, site_id, form, payload(enc), received_at, delivered_at
```

## 8.2 API surface (sketch)

```
POST   /auth/otp/start          { email }                  → 200 always
POST   /auth/otp/verify         { email, code }            → session cookie
POST   /auth/session/refresh
POST   /auth/signout            ?all=true
GET    /me

POST   /onboarding/enrich       { url? , place_id? }       → job id
GET    /onboarding/enrich/:id                              → findings + confidence
PATCH  /profile                 (partial, autosaved)
POST   /locations  PATCH /locations/:id  DELETE /locations/:id
POST   /offerings  ... /proof  ... /brand-assets

POST   /sites                   { mode, domain? }
POST   /sites/:id/audit                                    → audit_report
POST   /sites/:id/plan                                     → site plan (typed)
POST   /sites/:id/build                                    → site_version + preview
GET    /sites/:id/qa/:version                              → gate results
POST   /sites/:id/publish       { version_id }             → requires fresh OTP
POST   /sites/:id/rollback      { version_id }
GET    /sites/:id/redirects   POST /sites/:id/redirects/verify

POST   /domains/check  /domains/attach  /domains/dns/preview
GET    /leads
```

## 8.3 Infrastructure notes

- **Generated sites are static artifacts** on a CDN, one immutable deployment per
  version, instant rollback. The build pipeline is the one in Part I, run
  per-tenant with tenant data injected: `tsc -b` → SSG build → postbuild (robots,
  sitemap, llms.txt, environment-aware indexing posture).
- **Preview URLs are always `noindex` + `Disallow: /`**, enforced by the build
  from the environment, not by a toggle someone can forget. This is the existing
  `IS_PRODUCTION = origin === canonical && base === ''` rule, generalized.
- **Forms and dynamic endpoints** are functions alongside the static output;
  submissions are encrypted at rest, delivered to the merchant, and retained per
  a published policy.
- **Build isolation** — a tenant build runs with no access to another tenant's
  assets or secrets.
- **Cost control** — builds are the dominant per-tenant cost. Incremental
  rebuilds keyed on the site plan diff; a copy change must not rebuild 200 pages.

---

# Part IX — Phasing and open questions

## 9.1 Suggested phasing

| Phase | Scope | Done when |
|---|---|---|
| 0 | Harden the reference implementation: migrate off `react-router@6` before any route is built from user input; wire `/apply` and contact forms to a real, secured endpoint | `SECURITY-NOTES.md` has no open items |
| 1 | Auth: OTP, sessions, activation, email infrastructure with SPF/DKIM/DMARC | A merchant can create an account and return to it |
| 2 | Intake + enrichment, autosave, live preview | A merchant completes the flow in ≤ 8 minutes on a phone |
| 3 | Section library + generator + static build pipeline | A generated site passes all P0 gates |
| 4 | QA harness per tenant, preview URLs, publish, rollback | Publish is gated and reversible |
| 5 | Redesign path: audit, migration, redirect map, cutover | An existing site migrates with zero broken inbound links |
| 6 | Geo: GBP/Bing/Apple sync, NAP monitoring, location pages, GEO surface | NAP drift is detected and fixable in one click |
| 7 | Post-publish monitoring, continuous QA, merchant dashboard | Regressions surface before the merchant notices |

## 9.2 Open questions

1. **Editing after publish.** Does the merchant get a visual editor, or a
   structured "change these answers, we rebuild" loop? The second is far cheaper
   to keep at the Part VII quality bar; the first is what merchants expect. This
   choice shapes the whole content model and should be made before Phase 3.
2. **Multi-user accounts.** Roles, invitations, and who is allowed to publish.
   The OTP model extends cleanly, but ownership transfer needs a design.
3. **Billing trigger.** Free through preview and pay at publish is the obvious
   shape; confirm before Phase 4, since it determines where re-auth lands.
4. **Content generation provenance.** Every generated sentence must be traceable
   to an intake field. Enforced how — at generation time, or by an audit pass in
   QA gate 16?
5. **AI-crawler opt-out default.** Opt-in or opt-out per merchant? Regulated
   categories may need it off by default.
6. **Regulated categories.** Which are supported at launch, and which are
   refused until counsel reviews the claim vocabulary.
7. **Data retention** for enrichment crawls of third-party sites, and for leads.
8. **Legal review** of generated privacy policies and terms — templated output
   still needs counsel sign-off on the template.

---

## Appendix — Reference implementation index

| Concern | File |
|---|---|
| Route map | [src/App.tsx](../src/App.tsx) |
| Business facts (single source of truth) | [src/data/site.ts](../src/data/site.ts) |
| SEO component + JSON-LD builders | [src/lib/seo.tsx](../src/lib/seo.tsx) |
| Design tokens | [src/styles/index.css](../src/styles/index.css) |
| Conditional step model | [src/apply/types.ts](../src/apply/types.ts) |
| Validation and message tone | [src/apply/validate.ts](../src/apply/validate.ts) |
| WebGL hero | [src/components/CapitalFlow.ts](../src/components/CapitalFlow.ts) |
| Crawl surface + indexing posture | [scripts/postbuild.mjs](../scripts/postbuild.mjs) |
| QA configuration | [playwright.config.ts](../playwright.config.ts) |
| QA specs | [tests/](../tests/) |
| Host headers, caching, redirects | [vercel.json](../vercel.json) · [public/_headers](../public/_headers) |
| Deployment and environment rules | [DEPLOYMENT.md](../DEPLOYMENT.md) |
| Open security items | [SECURITY-NOTES.md](../SECURITY-NOTES.md) |
