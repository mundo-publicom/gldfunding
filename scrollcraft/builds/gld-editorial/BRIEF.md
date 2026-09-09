# BRIEF: GLD Funding, editorial rebuild

**Authority.** Interviewed for the four topics the user answered directly.
Everything else is **self-authored under explicit creative delegation**: the
proposals were put to the user in full on 2026-09-09 and accepted with "go".
Delegated lines are marked `[authored]`. Nothing below is presented as a
quotation unless it is one.

Build: `scrollcraft/builds/gld-editorial/`. Standalone concept page; if it earns
it, porting into the React home (`src/pages/Home.tsx`) is a separate step.

---

## The eight topics

**1. Vibe and references.**
User, verbatim: *"premium, trusted"*, *"more editorial rather than a bunch of
different AI-generated assets"*, *"more premium."*
References `[authored]`: a printed New York CFDL offer summary (the document
itself); Monocle magazine (measured, dense but airy); a mid-century bank
passbook (figures in columns, nothing decorative).

**2. The scroll journey.** `[authored]`
Title page → who we fund → how a business gets read → what it costs, in writing
→ apply, review, funded → in their words → colophon.

**3. Energy.** `[authored]` Calm open, rising through chapter two, sharpest at
chapter three, settling through four and five, quiet close.

**4. Feeling, stage by stage, and the one moment.** `[authored]` See the curve
and the peak below.

**5. One thing no site does.** `[authored]` The offer writes itself while you
read it. The cost of the money is typeset on the page, line by line, before
anyone asks you for anything.

**6. Aesthetic family.** User, verbatim: *"more editorial"*. Editorial, on the
brand's own palette (paper, petrol, one leaf accent), not premium-minimal-dark.

**7. One world or distinct scenes.** User, verbatim: *"not like a world that
we'd be flying through."* Distinct chapters, hard cuts.

**8. Assets.** User, verbatim: *"rather than a bunch of different AI-generated
assets."* From the repo: `logo.svg` (the mark), Geist and Geist Mono, the
palette in `src/styles/index.css`, six named testimonials, and six Unsplash
stand-in photographs that `public/hero/README.md` says cannot imply customers.
No GLD-owned photography exists. Nothing is generated for this build.

---

**Hero revision, 2026-09-09, user decision after review.** User, verbatim:
*"the hero section is too simple. We need to enhance it and make it look nicer,
with more animations and 3D effects, and show images or a free royalty video in
the background. The video category would be small businesses."* This overrides
the editorial grammar's media-free title page. The title page becomes a
**cover**: a petrol ground with three royalty-free small-business clips
(Mixkit, licence in `assets/LICENSES.txt`) cycling as a masked bed behind the
copy, a perspective card stack (two trade photographs and the offer sheet)
tilting to the pointer, five planes at distinct scroll rates, an on-load
entrance, and the headline receding on exit. Faces were avoided in the clips so
no stock person reads as a customer; the cover credits the footage as a
stand-in. Reduced motion and Save-Data get the poster only. Chapters and the
close are unchanged.

## Step 1

- **What, for whom.** GLD Factoring LLC DBA GLD Funding: merchant cash advance
  provider, Garden City NY, since 2014, small businesses nationwide. Purchases
  future receivables, remitted daily or weekly, underwritten on bank statements
  rather than credit files. (From `src/data/site.ts` and `src/pages/About.tsx`.)
- **Belief.** `[authored]` *GLD reads what my business actually does, and tells
  me the whole cost in writing before I commit.*
- **Action.** `Check eligibility` → `/apply`. One label, from `CTA.primary`.
- **Art direction.** Photographic where there is a photograph; typographic
  everywhere else. One stand-in photograph, captioned honestly as a stand-in.

## Journey

```
1  Recognition   the title page names the owners this is for, and the year
2  Relief        somebody reads the business, not the score
3  Trust         the whole cost, typeset on the page, before any ask   ← peak
4  Confidence    three steps, compressed, one document required
5  Warmth        six owners, by name, in their words
6  Resolve       the colophon: the ask as a line of running text, and it holds
```

## Grammar: chaptered editorial

Why the other seven lost:

- **Filmic one-shot**: needs a scrub hero and a continuous argument; the user
  said no world and no generated assets, and there is no footage to scrub.
- **Live surface**: GLD's product is an underwriting decision and a document,
  not software the visitor can operate.
- **Continuous world**: explicitly refused by the user.
- **Typographic poster**: right for a brand whose asset is one sentence; a
  lender's asset is substance and disclosure, which wants prose and columns.
- **Gallery / catalog**: the eight trades are a set, not the argument. They fit
  inside one chapter as a set list, not as the page.
- **Split stage**: "bank vs GLD" is a real comparison but it would make the page
  an argument against banks, and the brief is "trusted", not "combative".
- **Rhythmic cutlist**: energy brand grammar; the opposite of trusted.

Grammar constraints honoured: no fixed wordmark-and-CTA bar (a margin folio
instead, plus a table of contents on the title page); title page with no media
above the fold; hard cuts between grounds, painted per section, no drift; media
in its own column with a caption; no pinned crossfade type acts; no magnet, no
spotlight, no scrub; the close is a colophon plate with the CTA as running text.

## Signature move: the offer that writes itself

A New York-style OFFER SUMMARY sits in the media column of chapter three,
sticky. As each paragraph of the chapter passes the reading line, the matching
row of the summary is typeset: label, rule, then the figure counting to its
value. By the end of the chapter the document is complete. When the reader
leaves the chapter it docks as a small slip at the page edge (desktop), a
persistent record of the cost they just read, and a way back to it.

It is built from the site's one existing worked example ($50,000 at a factor
rate of 1.25 → Total Purchased Amount $62,500, from the home FAQ) and is labelled
illustrative on its face. **No factor-rate range is published** (`site.ts`
forbids it). Fields whose values are not documented read "stated on your offer"
rather than an invented number.

Page-local JS only. The engine is untouched.

## Fingerprint gate

Registry `scrollcraft/FINGERPRINTS.md` is empty. First build; nothing to clear.
Row to append after shipping is at the end of this file.

## Feeling curve

```
Title   Recognition   paper, the mark, the claim, the year; the offer sheet already peeking
One     Relief        "the owners who keep neighbourhoods running", the trades as a set list
Two     Being read    hard cut to petrol; the second-person line assembles: your deposits already tell the story
Three   Trust         white plate, a quiet intertitle, then the offer summary typesets itself beside the prose   ← PEAK
Four    Confidence    a rule draws itself across the page: apply, review, funded; one document required
Five    Warmth        petrol again; six owners by name, arriving in reading order
Colophon Resolve      paper; the ask as one underlined line of running text; masthead; it holds
```

No two adjacent acts share a feeling. The peak has the largest span on the page.

## The peak

Chapter three. As the visitor would tell a friend:

> *"The whole cost of the advance was typeset on the page before they asked me
> for a single thing."*

## Tell-someone sentence

> It's the site where the offer summary writes itself while you read what it
> costs.

## Authored silence

The intertitle plate of chapter three: a white ground, the chapter number and
title only, with extra room below it before the prose and the sheet begin. It
is the quiet in front of the peak. The harness should read it as an intentional
hold, not dead scroll; it is a flow section, so it is outside the dead-scroll
check by design, and the sheet publishes `data-sc-verify-state` once the
chapter starts.

## Score

| Chapter | Feeling | Device | Why this one |
|---|---|---|---|
| Title | Recognition | `parallax` (three planes: ledger rules, type, the offer sheet) + `in` on the contents | Depth on a title page without media: the sheet overtakes the type's corner, which plants the peak |
| One | Relief | `reveal` up on the photograph at the chapter boundary; set list as plain type | A wipe is a change of state: the page gets its first picture |
| Two | Being read | `kinetic` lines on the second-person turn; marginalia `in` | The line assembles as the reader is implicated |
| Three | Trust | **bespoke**: the offer typesets itself; `count` on the real figures | The peak is a document, so the device is typesetting |
| Four | Confidence | `reveal` left on the process rule; steps as `in` | A rule drawing itself across the page reads as a timeline being ruled |
| Five | Warmth | `in` stagger on six quotes | Letters page. Nothing louder than the names |
| Colophon | Resolve | none; static plate, CTA as running text | The last screen stands still with content on it |

Five families (parallax, reveal, kinetic, bespoke+count, in). No family twice in
a row. Zero scrub acts. Seven sections; total length is content-driven and
expected around 10 to 11 viewport-heights, outside the 13.6 to 13.8 band.

## Hard rules carried from the repo

- No public factor-rate range. One illustrative example only, labelled.
- No invented figures. The only counters are the worked example's dollars.
- Typical advance ranges per trade are the site's own published copy, still
  marked `@needs-verification` in `site.ts`. Reported, not invented.
- Stock photograph appears once, captioned as a stand-in, no faces as customers.
- No autoplay audio. No em dashes. WCAG 2.2 AA contrast measured on the render.
- Content in the initial HTML: the page is static markup; JS only decorates.

## Feel check (round 1, desktop contact sheet, before rereading the curve)

Felt, one word per act: orientation · information · addressed ·
watching-it-fill · brisk · warm · resolved.

Diff against the intended curve: chapter one was written for **relief** and
read as **information**, because the set-list table outweighed the sentence
that carries the feeling. Fixed on the page, not in the brief: the closing
sentence of chapter one ("their bank statements say more about them than their
credit files do") was promoted to a ruled pull line above the set list. The peak
reads as the peak on the sheet: chapter three holds the most scroll room and
the sticky sheet filling is the largest visual change on the page. The last
frame stands still with the ask, the masthead and the docked slip on it.

Caveat on "cold": the same author wrote the curve and scrolled the page, so
the check is as cold as one person can make it, not a fresh reader.

Round 1 also found: phone reading order in chapter two (marginalia preceded the
prose it annotates; DOM reordered, margin column kept on desktop with `order`),
a too-long ramp on the turn line (a reader stopping mid-window saw half-risen
lines; ramp shortened), the undocked slip reachable by keyboard at opacity 0
(`visibility` now gates it), and phone anchor jumps landing under the folio
strip (`scroll-margin-top`). Round 1 evidence kept in `lab/round1/`.

## Fingerprint row (to append after shipping)

| gld-editorial | Chaptered editorial | Vertical margin folio (chapter number + title) + title-page contents list; no bar | Title page: type over a ledger-rule plane with the offer sheet as a foreground plane, parallax, no media | title, 5 chapters, colophon; ~10.5vh; parallax→reveal→kinetic→bespoke→reveal→in→static | Colophon plate, CTA as running text, holds | The offer summary typesets itself while you read, then docks as a slip | Paper and petrol, hard cuts, one photograph | Standalone HTML → React home later |
