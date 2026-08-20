import { Link } from 'react-router-dom'
import { Seo, breadcrumbSchema } from '../../lib/seo'
import { PRODUCT, SITE } from '../../data/site'
import { LegalPage } from './Legal'

export function Component() {
  return (
    <>
      <Seo
        path="/legal/disclosures"
        title="Disclosures"
        description="GLD Funding's disclosure policy, including state commercial financing disclosure requirements and how advertised figures are substantiated."
        schema={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Disclosures', path: '/legal/disclosures' }])]}
      />
      <LegalPage
        title="Disclosures"
        updated="August 2026"
        intro="What we tell you before you sign, and how the figures on this site are substantiated."
      >
        <h2>Product nature</h2>
        <p>A merchant cash advance is the purchase of a business's future receivables at a discount. It is not a loan. There is no interest rate; cost is expressed as a factor rate applied once at signing. {SITE.legalName} is not a bank or a lender.</p>

        <h2>Written cost disclosure on every offer</h2>
        <p>Every offer we make is accompanied by a written statement of the total dollar cost of the financing, the remittance amount and frequency, and the expected term — in every state, whether or not state law requires one.</p>

        <h2>State commercial financing disclosure laws</h2>
        <p>Several states require standardized disclosures for commercial financing. Where they apply, we provide the disclosure in the form and manner the state requires. In New York, that means an OFFER SUMMARY showing total dollar cost, an annualized rate comparable to an APR, and the repayment term, as required by the Commercial Finance Disclosure Law and enforced by the Department of Financial Services.</p>
        <p><Link to="/locations">See what applies in your state</Link>.</p>

        <h2>Figures used on this website</h2>
        <p>
          Advance amounts of {PRODUCT.advanceMin.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}–
          {PRODUCT.advanceMax.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })},
          factor rates of {PRODUCT.factorRateMin}–{PRODUCT.factorRateMax}, decision times of approximately{' '}
          {PRODUCT.decisionHours} business hours and funding within {PRODUCT.fundingHours} hours describe typical outcomes.
          They are not guarantees, and individual results depend on underwriting.
        </p>
        <p>[Counsel and operations to confirm each figure against documented internal metrics before launch, as required for advertising substantiation.]</p>

        <h2>Calculator and estimates</h2>
        <p>The estimate tools on this site are illustrative only. They do not constitute an offer, a pre-approval or a commitment to fund, and the figures they produce may differ from any offer made after underwriting.</p>

        <h2>Testimonials</h2>
        <p>Testimonials reflect the experience of individual clients and are not a guarantee of approval, terms or outcome. Individual results vary. [Confirm written consent is on file for each testimonial before publication.]</p>

        <h2>Restricted industries</h2>
        <p>Certain industries cannot be funded. <Link to="/contact">Contact us</Link> if you are unsure whether yours is affected.</p>
      </LegalPage>
    </>
  )
}

Component.displayName = 'Disclosures'
