import { Link } from 'react-router-dom'
import { Seo, breadcrumbSchema } from '../../lib/seo'
import { Callout } from '../../components/ui'
import { PRODUCT, SITE, currency } from '../../data/site'
import { LegalPage } from './Legal'

export function Component() {
  return (
    <>
      <Seo
        path="/legal/disclosures"
        title="Disclosures"
        description="GLD Funding's disclosure policy - how a merchant cash advance is priced, what every offer discloses in writing, state commercial financing disclosure requirements, and how the figures on this site are substantiated."
        schema={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Disclosures', path: '/legal/disclosures' }])]}
      />
      <LegalPage
        title="Disclosures"
        updated="August 2026"
        intro="What we tell you before you sign, and how the figures on this site are substantiated."
      >
        <h2>Product nature</h2>
        <p>
          A merchant cash advance is the purchase of a business's future receivables at a discount.
          It is not a loan. There is no interest rate and no amortization schedule; cost is expressed
          as a factor rate applied once at signing, and the total repayment amount is fixed from that
          moment. {SITE.legalName} is not a bank, is not a lender, and does not make loans.
        </p>
        <p>
          Because an advance is a purchase rather than an extension of credit, most federal
          consumer lending statutes - including the Truth in Lending Act - do not apply to it. That
          is precisely why the disclosure practices described on this page matter, and why a growing
          number of states now regulate commercial financing directly.
        </p>

        <h2>Business purpose only</h2>
        <p>
          Funding is available for business or commercial purposes only. It is not available for
          personal, family or household use, and every applicant certifies this at signing.
        </p>

        <h2>How cost is expressed</h2>
        <p>
          A factor rate is a multiplier, not a percentage rate. At a factor rate of 1.28, a{' '}
          {currency(50_000)} advance is repaid as {currency(64_000)} - a cost of capital of{' '}
          {currency(14_000)}. Because remittances begin immediately and the cost does not accrue over
          time, repaying early does not reduce the total unless the agreement expressly says so.
        </p>
        <Callout title="A factor rate is not an APR.">
          The annualized cost of a short-term advance is substantially higher than the factor rate
          makes it look - a 1.28 factor over nine months annualizes well above 28%. Several states
          require an APR-comparable figure on every commercial financing offer for exactly this
          reason. Where that figure is required, it appears on your offer.{' '}
          <Link to="/funding/cost">See worked examples</Link>.
        </Callout>

        <h2>Written cost disclosure on every offer</h2>
        <p>
          Every offer we make is accompanied by a written statement showing, at minimum:
        </p>
        <ul>
          <li>The advance amount, and the net amount that will reach your account after any fees</li>
          <li>The total dollar cost of the financing, and the total dollar amount you will repay</li>
          <li>The remittance amount and how often it is taken</li>
          <li>The expected term</li>
          <li>Every fee, itemized, including any origination, underwriting or ACH fee</li>
          <li>Whether early repayment changes the total, and on what terms</li>
          <li>The specified percentage of receivables being purchased</li>
          <li>Any prepayment, reconciliation and default provisions</li>
        </ul>
        <p>
          We provide this in every state, whether or not state law requires it. If a figure you were
          quoted verbally does not appear on the written offer, do not sign - call us.
        </p>

        <h2>State commercial financing disclosure laws</h2>
        <p>
          Several states require standardized disclosures for commercial financing. Where they apply,
          we provide the disclosure in the form and manner the state requires, at the time the state
          requires it, and we register with the state regulator where registration is required.
        </p>
        <p>
          In New York, that means an OFFER SUMMARY showing total dollar cost, an annualized rate
          comparable to an APR, and the repayment term, as required by the Commercial Finance
          Disclosure Law and enforced by the Department of Financial Services. California,
          Connecticut, Utah, Virginia, Georgia, Florida, Kansas and Missouri have their own regimes
          with differing content and timing requirements, and further states have enacted laws whose
          effective dates are still approaching.
        </p>
        <p>
          <Link to="/locations">See what applies in your state</Link>. Those state summaries are
          general information about the regulatory landscape, not legal advice, and are current only
          as of the date shown.
        </p>

        <h2>Figures used on this website</h2>
        <p>
          Advance amounts of {currency(PRODUCT.advanceMin)}–{currency(PRODUCT.advanceMax)}, factor
          rates of {PRODUCT.factorRateMin}–{PRODUCT.factorRateMax}, terms of{' '}
          {PRODUCT.termMinMonths}–{PRODUCT.termMaxMonths} months, decision times of approximately{' '}
          {PRODUCT.decisionHours} business hours and funding within {PRODUCT.fundingHours} hours
          describe typical outcomes across our funded book. They are not guarantees, not the best
          case, and not a range you should expect to sit at the favorable end of.
        </p>
        <p>
          Your own amount, rate, term and timing depend on underwriting - principally deposit
          consistency, time in business, average daily balance, industry, and any advances you are
          already carrying. Decision and funding times are measured in business hours from a
          complete file, meaning one with every required bank statement attached and every owner's
          signature in place; an incomplete file starts that clock later. Funding speed also depends
          on your bank's processing times, which we do not control.
        </p>
        <p>
          Worked examples elsewhere on this site, including the cost table and the rate calculator,
          are illustrative structures chosen to show how the arithmetic works. They are not offers,
          not quotes, and not drawn from any individual client's file.
        </p>

        <h2>Calculator and estimates</h2>
        <p>
          The estimate tools on this site are illustrative only. They apply simple arithmetic to the
          inputs you provide and do not reflect underwriting, your bank statements, your existing
          positions or your industry. They do not constitute an offer, a pre-approval or a commitment
          to fund, and the figures they produce may differ materially from any offer made after
          underwriting. Nothing entered into the calculator is stored or used to price you.
        </p>

        <h2>Eligibility check</h2>
        <p>
          The three-question check that opens the application returns an indicative range only. It
          collects no personal information, is not a credit inquiry, is not underwriting, and is not
          an approval. Guideline thresholds - at least{' '}
          {currency(PRODUCT.minMonthlyRevenue)} in monthly revenue and at least{' '}
          {PRODUCT.minMonthsInBusiness} months in business - are starting points, not rules. Meeting
          them does not guarantee an offer, and falling slightly short does not automatically
          preclude one.
        </p>

        <h2>Credit and background inquiries</h2>
        <p>
          There is no credit inquiry during the eligibility check. Once you submit a full application
          and sign the authorization, we may obtain business and personal credit reports and
          background information for each owner listed, both to evaluate that application and in
          connection with any renewal. If we decline an application based in whole or in part on
          information in a consumer report, we will tell you and identify the reporting agency so you
          can obtain a free copy and dispute anything inaccurate. See our{' '}
          <Link to="/legal/privacy">privacy policy</Link>.
        </p>

        <h2>Guarantees and confessions of judgment</h2>
        <p>
          A merchant cash advance from {SITE.legalName} is unsecured and does not require the kind of
          personal guarantee attached to a conventional bank loan, and we do not place a lien on
          personal property. Our agreements do include a performance guarantee, standard across the
          industry, under which an owner is personally liable for breach of the agreement, fraud, or
          a prohibited act such as diverting receivables or shutting the business to avoid
          remittance - not for ordinary business failure.
        </p>
        <p>
          <strong>We do not use confessions of judgment.</strong> A UCC-1 financing statement may be
          filed against business assets to perfect our interest in the receivables purchased; this is
          disclosed before signing.
        </p>

        <h2>Remittance and reconciliation</h2>
        <p>
          Remittances are taken by ACH from the bank account you designate, usually beginning the
          business day after funds arrive, on the schedule stated in your agreement. Because an
          advance is a purchase of receivables rather than a loan, remittances can be reconciled
          against actual revenue if your business's income drops materially. Reconciliation is
          governed by the express terms of your agreement and requires you to contact us and provide
          supporting records - call before a payment is missed, not after.
        </p>

        <h2>Renewals and additional positions</h2>
        <p>
          You may be offered a renewal before an existing advance is fully remitted. A renewal
          typically pays off the outstanding balance and advances new funds, and the payoff amount
          may include cost you have not yet remitted. Taking additional advances from other funders
          increases the total remittance load on the same revenue and generally raises the rate on
          anything new. Ask for the payoff figure and the net new funds in writing before agreeing to
          any renewal.
        </p>

        <h2>Testimonials</h2>
        <p>
          Testimonials on this site reflect the experience of individual clients who consented in
          writing to their publication. They describe those clients' own experiences and are not a
          guarantee of approval, of terms, or of any outcome. Individual results vary. Clients are
          not compensated for testimonials.
        </p>

        <h2>Restricted industries</h2>
        <p>
          Certain industries cannot be funded, generally for regulatory or risk reasons. The
          restricted list covers, among others, firearms and ammunition, adult entertainment,
          cannabis and cannabis-adjacent businesses, gambling and gaming, cryptocurrency and certain
          financial services, multi-level marketing, and any business operating unlawfully under
          federal or state law. The list changes as regulation does.{' '}
          <Link to="/contact">Contact us</Link> if you are unsure whether yours is affected - before
          you apply rather than after.
        </p>

        <h2>Referral partners and independent sales organizations</h2>
        <p>
          Some applications reach us through independent sales organizations, brokers and referral
          partners. Those parties are independent contractors, not employees or agents of{' '}
          {SITE.legalName}, and they are not authorized to make offers, quote final terms, or bind us.
          They may receive commission on funded deals, which is disclosed on your offer where state
          law requires it. If a partner has quoted you terms, rely on the written offer we send you,
          not on the quote. See our <Link to="/partners">partner page</Link>.
        </p>

        <h2>Availability</h2>
        <p>
          {SITE.legalName} funds businesses across the United States. Availability, terms and product
          features vary by state, and we do not fund businesses outside the United States. Nothing on
          this site is an offer in any jurisdiction where we are not authorized to make one.
        </p>

        <h2>Accessibility and questions</h2>
        <p>
          If you have difficulty accessing any disclosure on this site, or want any of this material
          in another format, call us and we will provide it. Questions about anything on this page go
          to {SITE.legalName}, {SITE.address.street}, {SITE.address.locality}, {SITE.address.region}{' '}
          {SITE.address.postalCode}. Phone {SITE.phone}. Email{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </LegalPage>
    </>
  )
}

Component.displayName = 'Disclosures'
