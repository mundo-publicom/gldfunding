# Deployment

Output is fully static (`dist/`). Any static host works. GitHub Pages is wired up
and documented first; the Vercel notes below still apply if you move.

## GitHub Pages

Publishing runs from `.github/workflows/deploy.yml` on every push to `main`, and
on demand from the Actions tab. Because it publishes from a workflow rather than
a branch, `dist/` stays gitignored and no `CNAME` file is needed — a `CNAME` file
committed to the repo would be ignored anyway. The custom domain lives in the
repository's Pages settings.

The workflow reads `base_path` and `origin` from `actions/configure-pages` and
passes them to the build as `BASE_PATH` and `SITE_ORIGIN`. That makes one build
correct for whichever URL the site is actually served from:

| Serving from | `BASE_PATH` | `SITE_ORIGIN` |
|---|---|---|
| `www.gldfunding.com` | `` (empty) | `https://www.gldfunding.com` |
| `<user>.github.io/gldfunding` | `/gldfunding` | `https://<user>.github.io` |

`BASE_PATH` becomes vite's `base`, which `vite-react-ssg` passes straight to
react-router's `basename`, so asset URLs and every `<Link>` pick up the prefix.
`SITE_ORIGIN` and `BASE_PATH` together build the absolute URLs in `sitemap.xml`,
`robots.txt` and `llms.txt`, and rebase `site.webmanifest`. Both default to the
custom-domain values, so a plain local `pnpm build` is unchanged.

To build a subpath copy locally:

```
BASE_PATH=/gldfunding SITE_ORIGIN=https://<user>.github.io pnpm build
```

### What GitHub Pages does for us

- **Extensionless URLs.** `/about` resolves to `about.html` with no config, so
  the pre-rendered per-route files are served at their canonical paths.
- **`404.html`.** Served for any unknown URL. The `404` route in `src/App.tsx`
  exists purely to emit it — `vite-react-ssg` excludes catch-all `*` routes from
  prerendering, so the `*` route alone produces no file.
- **`.nojekyll`.** Written by `scripts/postbuild.mjs`. Without it Jekyll would
  discard `_headers` and anything else underscore-prefixed.
- **Apex ↔ `www` redirect.** With DNS records for both, GitHub redirects one to
  the other automatically, in whichever direction the custom domain setting
  names. Setting `www.gldfunding.com` gives the apex → `www` redirect this
  project's canonical URLs assume.

### Staging builds refuse indexing

`scripts/postbuild.mjs` treats a build as production only when `SITE_ORIGIN` is
`https://www.gldfunding.com` **and** `BASE_PATH` is empty. Any other combination
— the GitHub Pages URL above, or any preview host — emits:

- a `robots.txt` of `User-agent: * / Disallow: /`, replacing the permissive one
- `<meta name="robots" content="noindex,nofollow">` on every generated page

Both, because `robots.txt` only asks a crawler not to fetch; a URL linked from
elsewhere can still be indexed without `noindex`. This matters more than usual
here: the legal pages, disclosures and per-state notes are still pending counsel
review, and an answer engine that ingests them now will keep citing them long
after they are corrected. Pages that already opt into `noindex` via the `Seo`
component are left alone rather than declaring it twice.

Nothing about the production build changes — verify with `pnpm build` and check
that `dist/robots.txt` still reads `Allow: /`.

### Attaching a custom domain redirects the github.io URL away

Setting a custom domain makes GitHub Pages 301 the whole
`mundo-publicom.github.io/gldfunding/*` path to that domain. While the domain
still resolves to the old Heroku site, that sends every staging visitor to
production. Keep `cname` unset until cutover:

```
gh api repos/:owner/gldfunding/pages --jq '{cname,https_enforced}'   # cname should be null
gh api -X PUT repos/:owner/gldfunding/pages -F cname=null            # detach if it was set
```

Removing it leaves a cached 301 at the CDN edge; re-run the workflow
(`gh workflow run deploy.yml`) to purge it.

### What GitHub Pages will NOT do — read before committing to it

1. **No custom response headers.** `public/_headers` is inert here. The security
   headers in it — `X-Frame-Options`, `X-Content-Type-Options`,
   `Referrer-Policy`, `Permissions-Policy` — simply are not sent. HSTS is the one
   exception: it comes from GitHub's "Enforce HTTPS" setting. If those headers are
   a requirement, GitHub Pages is the wrong host, or it needs a proxy (Cloudflare)
   in front that can add them.
2. **No server-side redirects.** The entire redirect map below — the Heroku
   origin, `/mca` → `/funding/merchant-cash-advance`, `/blog` → `/resources` —
   cannot be expressed on Pages. There is no 301 mechanism. The only in-repo
   substitute is a per-URL HTML file with a `<meta http-equiv="refresh">` and a
   `<link rel="canonical">`, which Google treats as a weaker signal than a 301
   and passes link equity less reliably. Given that the old Heroku host holds the
   accumulated signal, **this is the deciding constraint**: either front Pages
   with something that can issue 301s, or host where redirects are native.

### DNS for the custom domain

Apex `gldfunding.com` — four `A` records (add the `AAAA` records too for IPv6),
or a single `ALIAS`/`ANAME` to `<user>.github.io` if the provider supports it:

```
A     185.199.108.153        AAAA  2606:50c0:8000::153
A     185.199.109.153        AAAA  2606:50c0:8001::153
A     185.199.110.153        AAAA  2606:50c0:8002::153
A     185.199.111.153        AAAA  2606:50c0:8003::153
```

`www` — a `CNAME` to `<user>.github.io`, **excluding** the repository name:

```
CNAME  www  ->  <user>.github.io
```

Then set the custom domain to `www.gldfunding.com` in Settings → Pages, wait for
the DNS check to pass, and enable **Enforce HTTPS** (can take up to 24 hours to
become available).

## Vercel

```
Build command:      npm run build
Output directory:   dist
Install command:    npm install
Node version:       22.x
```

Because every route is pre-rendered to its own `.html`, no SPA rewrite is needed
— and you should NOT add a catch-all rewrite to `/index.html`, because that would
serve the homepage's markup for every URL and destroy the GEO work.

`vercel.json`:

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "geolocation=(), microphone=(), camera=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

For Netlify or Cloudflare Pages, `public/_headers` already carries the equivalent.

## Redirect map from the current site

The old site is a Next.js 9 export on Heroku. Preserve every existing URL:

| Old | New | Type |
|---|---|---|
| `/mca` | `/funding/merchant-cash-advance` | 301 |
| `/blog` | `/resources` | 301 |
| `/apply` | `/apply` | — unchanged |
| `/about` | `/about` | — unchanged |
| `/partners` | `/partners` | — unchanged |
| `/contact` | `/contact` | — unchanged |
| `/index` | `/` | 301 |

Also redirect the Heroku origin itself. The current site's Open Graph tags and
JSON-LD both declare `gld-funding.herokuapp.com` as canonical, so that host has
accumulated real signal:

```
https://gld-funding.herokuapp.com/*  →  https://www.gldfunding.com/:splat  (301)
```

Pick one canonical host (`www.gldfunding.com` is assumed throughout
`src/data/site.ts` and every JSON-LD block) and 301 the apex to it.

## Phase 0 — ship against the OLD site today

These are hours of work and pay back before the rebuild launches:

1. Replace `<meta name="description" content="desc">` — it is literally the
   string `desc` on every page in production right now.
2. Add `<link rel="canonical">` and fix the `og:url` / JSON-LD `url` fields that
   currently point at Heroku.
3. Stand up GA4. The site loads `UA-179716502-1`, a Universal Analytics property
   Google stopped processing in July 2023 — there is no organic baseline to
   measure this rebuild against, so start collecting one now.
4. Claim and populate the Google Business Profile for Garden City.
5. Fix the "2020" copyright in the footer.

## Launch checklist

- [ ] Replace every `@needs-verification` figure in `src/data/site.ts`
- [ ] Counsel-approved authorization text in `apply/AuthorizationText.tsx`
- [ ] Counsel-reviewed `src/pages/legal/*`
- [ ] Per-state legal review of `STATES[].note` in `src/data/site.ts`
- [ ] Written testimonial consent on file, then enable `Review` schema
- [ ] Wire `/apply` and contact forms to a real endpoint (see `SECURITY-NOTES.md`)
- [ ] Create `public/og-default.png` (1200×630)
- [ ] Create `public/apple-touch-icon.png` (180×180) — `index.html` references it
      and the file does not exist, so it 404s on every page today
- [ ] Redirect map above deployed and verified
- [ ] Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools
- [ ] Confirm AI crawler hits in server logs after launch
- [ ] Resolve or formally accept the react-router advisories

## Measurement

Baselines are unknown because analytics has been dead since 2023. Capture three
weeks of GA4 data on the current site before cutting over.

| Metric | Now | 90 days | 180 days |
|---|---|---|---|
| Indexed pages | 7 | 75+ | 110+ |
| LCP (mobile) | unmeasured | < 2.0s | < 1.8s |
| INP | unmeasured | < 200ms | < 150ms |
| Application completion | untracked | baseline set | +60% |
| AI citations (25 tracked prompts) | 0 | first citations | top-3 on 10+ |

Track AI visibility deliberately: run a fixed set of 25 real prospect prompts
monthly against ChatGPT, Perplexity, Gemini and Google AI Overviews, logging
whether GLD is cited. Nothing else measures the GEO work.
