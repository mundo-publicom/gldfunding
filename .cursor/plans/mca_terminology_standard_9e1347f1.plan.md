---
name: MCA terminology standard
overview: "Item 3 is a legal/copy standard: when the site describes GLD's MCA, it must use purchase/remittance language, not loan language. The work is targeted copy edits on named pages, plus a site-wide search so leftover MCA-as-loan wording does not remain."
todos:
  - id: home-copy
    content: Rewrite Home.tsx MCA repay/repaid phrases to remittance / Total Purchased Amount
    status: completed
  - id: mca-page
    content: Rewrite MerchantCashAdvance.tsx body, FAQ, meta, and schema MCA loan-words per the find/replace table
    status: completed
  - id: how-it-works
    content: Replace total/early repayment wording in HowItWorks.tsx with Total Purchased Amount / early completion
    status: completed
  - id: vs-loan
    content: Rename McaVsLoan table heading to Payment Structure; retitle Early repayment row to Early Completion without changing loan-side copy
    status: completed
  - id: disclosures
    content: Replace remaining MCA repay/repayment phrases in Disclosures.tsx; keep NY statute wording
    status: completed
  - id: industry-answer
    content: Fix restaurants answer in site.ts from 'repaying through' to remittance wording
    status: completed
  - id: qa-search
    content: Site-wide search for repay/repayment/repaid and confirm only valid loan or statute uses remain
    status: completed
isProject: false
---

# MCA Terminology Site-Wide Standard

This is **not a visual redesign**. It is a legal/product wording change so the public site never describes GLD's MCA as if it were a loan.

An MCA is a **purchase of future receivables**, not debt. Words like repay / borrower / interest rate / loan payment treat it as a loan, which is the thing this item exists to stop.

## Approved vs avoided terms

**Use when describing GLD's MCA:**
- Purchase of Future Receivables
- Purchase Price (what the merchant receives today)
- Purchased Amount / Total Purchased Amount (what is remitted in total)
- Factor Rate
- Remittance / Remittances

**Do not use when the sentence is describing the MCA:**
- repay, repayment, repaid
- borrower
- interest rate
- loan payment

**Keep loan language when it is actually about a loan:**
- MCA vs. Business Loan page, **loan column and loan-side copy only**
- Contrast sentences that exist to say an MCA is *not* a loan (e.g. "there is no interest rate", "factor rate rather than an interest rate")
- Statutory New York disclosure wording ("repayment terms" in the CFDL / OFFER SUMMARY summaries on [src/pages/locations/Detail.tsx](src/pages/locations/Detail.tsx) and [src/data/site.ts](src/data/site.ts))

## Exact replacements already specified

The priority list already maps current phrases to replacements. Those still exist in the source:

**Homepage** — [src/pages/Home.tsx](src/pages/Home.tsx)
- "repay through..." → remittance wording ("with daily or weekly remittances")
- "advance is repaid as..." (FAQ + schema description) → "the Total Purchased Amount is..."

**What Is an MCA?** — [src/pages/funding/MerchantCashAdvance.tsx](src/pages/funding/MerchantCashAdvance.tsx)
- "repay $65,000" → "remit a Total Purchased Amount of $65,000"
- "repayment takes longer" → "the remittance period takes longer"
- "repay faster" → "complete the remittances sooner"
- "total you will repay" → "Total Purchased Amount"
- "advance is repaid as..." (FAQ + meta description + schema) → Purchased Amount wording

Keep the FAQ that compares a factor rate to an interest rate, including "repaying a **loan** early" — that sentence is about a loan.

**How It Works** — [src/pages/funding/HowItWorks.tsx](src/pages/funding/HowItWorks.tsx)
- "total dollar repayment" / "total repayment" → "Total Purchased Amount"
- "early repayment" → "early completion" / "early completion of remittances"

**MCA vs. Business Loan** — [src/pages/funding/McaVsLoan.tsx](src/pages/funding/McaVsLoan.tsx)
- Table heading **"Repayment"** → **"Payment Structure"**
- Row **"Early repayment saves money"** → keep the comparison, rename to **"Early Completion"**, and keep remittance wording on the MCA cell. Leave the loan cell as loan language.
- Meta description "paperwork and repayment" → remittance/payment-structure wording, without turning the loan side into MCA language

**Disclosures** — [src/pages/legal/Disclosures.tsx](src/pages/legal/Disclosures.tsx)
(The "How cost is expressed" section is already gone. Remaining MCA-as-loan words still need fixing.)
- "total repayment amount" → "Total Purchased Amount"
- "total dollar amount you will repay" → "Total Purchased Amount"
- "early repayment" → "early completion"
- Keep NY law "repayment term" where it quotes the statute

**Industry copy** — [src/data/site.ts](src/data/site.ts)
- Restaurants answer currently says "repaying through a fixed daily or weekly remittance" → remittance wording (item 6 also requires this on industry pages)

## Extra hits from a site-wide search (item 8 overlap)

These are the current `repay|repayment|repaid` matches. Change only the MCA ones:

| Location | Action |
|---|---|
| Home, MCA page, How It Works, Disclosures, Restaurants `answer` | Change (MCA copy) |
| McaVsLoan table heading / early-repayment row / SEO description | Change heading/MCA side; keep loan side |
| NY location note + Disclosures NY statute paragraph | **Keep** (law language) |
| MCA FAQ "repaying a loan early" | **Keep** (describes a loan) |

No `borrower` hits. "Interest rate" stays where it contrasts MCA vs loan.

## What this item does not include

Items 1, 2, 4–7 (company identity, deleting the disclosures cost section, CTA "may qualify for", bank-statement wording, industry proofreading, footer industries) are separate. This plan only does item 3, plus the repay/repayment/repaid QA pass that item 8 requires for this terminology.

## Verification

After edits, search the repo again for `repay`, `repayment`, `repaid`. Review each remaining hit. Then check the affected pages (home, What is an MCA, How it works, MCA vs loan, Disclosures, Restaurants industry) on desktop and mobile.