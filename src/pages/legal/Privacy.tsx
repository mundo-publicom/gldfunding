import { Seo, breadcrumbSchema } from '../../lib/seo'
import { SITE } from '../../data/site'
import { LegalPage } from './Legal'

export function Component() {
  return (
    <>
      <Seo
        path="/legal/privacy"
        title="Privacy Policy"
        description="How GLD Funding collects, uses, protects and retains business and personal information submitted through this site."
        schema={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Privacy policy', path: '/legal/privacy' }])]}
      />
      <LegalPage
        title="Privacy policy"
        updated="August 2026"
        intro="How we collect, use, protect and retain the information you give us."
      >
        <h2>What we collect</h2>
        <p>When you apply for funding we collect information about your business and its owners, including:</p>
        <ul>
          <li>Business identity — legal name, DBA, entity type, EIN, address, phone, industry, start date</li>
          <li>Owner identity — name, title, ownership percentage, contact details, home address, date of birth and Social Security number</li>
          <li>Financial information — bank statements, deposit history, existing financing positions</li>
          <li>Authorization records — your electronic signature together with a timestamp, IP address, browser user agent and the version of the authorization text displayed to you</li>
          <li>Technical information — pages viewed, referring source, and device information collected through analytics</li>
        </ul>

        <h2>Why we collect it</h2>
        <p>To evaluate your application, verify identity and financial information, meet legal and regulatory obligations, service any funding provided, and communicate with you about your application.</p>

        <h2>Who we share it with</h2>
        <p>We share information with service providers who help us underwrite and service funding — including banking data providers, identity verification services and payment processors — and with regulators or law enforcement where required by law. <strong>We do not sell your personal information.</strong></p>

        <h2>How long we keep it</h2>
        <p>[Counsel to specify retention periods for applications, funded files, declined files and signature audit records.]</p>

        <h2>How we protect it</h2>
        <p>Information is encrypted in transit and at rest. Access is limited to personnel who need it. [Counsel and security to confirm specific safeguards, including obligations under the GLBA Safeguards Rule where applicable.]</p>

        <h2>Your choices</h2>
        <p>You may withdraw consent to be contacted by phone, SMS or email at any time by replying STOP to a message or contacting us. [Counsel to add state-specific rights, including CCPA/CPRA where applicable.]</p>

        <h2>Contact us</h2>
        <p>
          {SITE.legalName}, {SITE.address.street}, {SITE.address.locality}, {SITE.address.region}{' '}
          {SITE.address.postalCode}. Phone {SITE.phone}. Email{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </LegalPage>
    </>
  )
}

Component.displayName = 'Privacy'
