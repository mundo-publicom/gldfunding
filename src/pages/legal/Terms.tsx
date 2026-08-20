import { Seo, breadcrumbSchema } from '../../lib/seo'
import { SITE } from '../../data/site'
import { LegalPage } from './Legal'

export function Component() {
  return (
    <>
      <Seo
        path="/legal/terms"
        title="Terms of Use"
        description="Terms governing use of the GLD Funding website."
        schema={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Terms of use', path: '/legal/terms' }])]}
      />
      <LegalPage
        title="Terms of use"
        updated="August 2026"
        intro="The terms that govern your use of this website."
      >
        <h2>Acceptance</h2>
        <p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>

        <h2>Not an offer</h2>
        <p>Nothing on this website is an offer of financing. Rates, amounts, terms and timelines shown are illustrative and typical, not guaranteed. Any actual offer is made in writing following underwriting and comes with a disclosure of total dollar cost and terms.</p>

        <h2>Not a lender</h2>
        <p>{SITE.legalName} is not a bank and does not make loans. A merchant cash advance is the purchase of future receivables and is a commercial transaction. Funding is for business purposes only and is not available for personal, family or household use.</p>

        <h2>Accuracy of information you provide</h2>
        <p>You agree that information you submit is true and complete, and that you are authorized to submit it on behalf of the business named.</p>

        <h2>Third-party content</h2>
        <p>Regulatory summaries on state pages are general guidance, not legal advice. Confirm current obligations with qualified counsel.</p>

        <h2>Limitation of liability</h2>
        <p>[Counsel to supply.]</p>

        <h2>Governing law</h2>
        <p>[Counsel to supply — expected to be New York.]</p>
      </LegalPage>
    </>
  )
}

Component.displayName = 'Terms'
