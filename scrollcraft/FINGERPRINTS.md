# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| gld-editorial (2026-09-09) | Chaptered editorial | No bar. Vertical margin folio (chapter number + title, updating) plus a contents list on the title page; folio becomes a top strip on phones | Title page: type on paper over a ledger-rule plane, the offer sheet as a foreground plane; parallax; no media above the fold | Title + 5 chapters + colophon, all `flow`, zero pinned acts; 10.3vh desktop, 15.3vh phone; parallax → reveal → kinetic → bespoke+count → reveal → in → static | Colophon plate: the CTA as one underlined line of running text, masthead, small print; static, holds | The offer summary typesets itself row by row while you read chapter three, figures counting in, then docks as a slip at the page edge that returns you to it | Paper and petrol, hard cuts, one captioned photograph, no generated assets | Standalone HTML concept for gldfunding.com; React port is a later step |

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **Chaptered editorial** with a vertical margin folio and a title-page
  contents list (gld-editorial). The next editorial build needs a different
  nav treatment and a different close.
- **A self-typesetting document in a sticky media column, docking as a slip**
  (gld-editorial). No other build may make its signature move "a document that
  fills in as you read".
- **All-`flow`, zero-pin page at ~10vh with a static colophon close**
  (gld-editorial).
- **Title page with parallax planes and no media** as the hero device
  (gld-editorial).

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
