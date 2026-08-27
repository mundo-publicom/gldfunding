# Hero slideshow frames — PLACEHOLDERS

⚠️ **Every image in this folder is a stock placeholder.** None of it is GLD's
own photography, and none of it shows a GLD client. It exists to hold the hero
layout while the real shoot is commissioned, in the same spirit as the
`@needs-verification` numbers in `src/data/site.ts`.

Before launch these must be replaced with photography GLD owns or has licensed
with a model release — a funded-business hero implies the people in it are
customers, and stock faces cannot carry that implication.

## What is here

Six frames, each cut to 3:2 at three widths so the `srcset` in
`src/sections/heroSlides.ts` describes one picture at three sizes:

| Frame          | Stands for                 | Source (Unsplash photo id)     |
| -------------- | -------------------------- | ------------------------------ |
| `retail`       | Retail & specialty stores  | `photo-1556740758-90de374c12ad` |
| `restaurant`   | Restaurants & food service | `photo-1556910103-1c02745aae4d` |
| `auto-repair`  | Auto repair & service      | `photo-1625047509168-a7026f36de04` |
| `salon`        | Salons & spas              | `photo-1585747860715-2ba37e788b70` |
| `trades`       | Construction & trades      | `photo-1621905251189-08b45d6a269e` |
| `storefront`   | Independent storefronts    | `photo-1559925393-8be0ec4767c8` |

Widths on disk: `760`, `1100`, `1600`. Source images are from Unsplash, whose
licence permits free commercial use without attribution.

## Replacing them

Keep the filenames, the 3:2 crop, and the three widths and nothing in the code
has to change. The frame that matters most is `retail` — it is the only one in
the initial payload and is very likely the page's LCP element, so keep it under
roughly 220 KB. The rest mount one dwell ahead of their turn and are less
sensitive.

Compose for the scrim: the hero copy sits over the left third on desktop and
over the full width on mobile, so keep the subject right of centre and avoid
detail in the lower edge, where the trust strip crosses.
