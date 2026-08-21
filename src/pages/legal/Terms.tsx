import { Link } from 'react-router-dom'
import { Seo, breadcrumbSchema } from '../../lib/seo'
import { Callout } from '../../components/ui'
import { SITE } from '../../data/site'
import { LegalPage } from './Legal'

export function Component() {
  return (
    <>
      <Seo
        path="/legal/terms"
        title="Terms of Use"
        description="Terms governing use of the GLD Funding website, the online funding application, electronic signatures, contact consent and limitation of liability."
        schema={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Terms of use', path: '/legal/terms' }])]}
      />
      <LegalPage
        title="Terms of use"
        updated="August 2026"
        intro="The terms that govern your use of this website and the online funding application."
      >
        <h2>Acceptance</h2>
        <p>
          These terms are an agreement between you and {SITE.legalName} ("GLD Funding", "we", "us").
          By using this website, submitting a form, or starting a funding application, you agree to
          them. If you do not agree, do not use the site.
        </p>
        <p>
          If you use the site on behalf of a business, you represent that you are authorized to bind
          that business, and "you" means both you and that business.
        </p>

        <h2>Who may use this site</h2>
        <p>
          The site is intended for owners and officers of United States businesses who are at least
          18 years old. It is not directed to consumers seeking personal credit, and it is not
          available where use would be unlawful.
        </p>

        <h2>Nothing here is an offer</h2>
        <p>
          Nothing on this website is an offer, a commitment, a pre-approval or a promise of
          financing. Advance amounts, factor rates, terms, decision times and funding timelines
          shown on this site describe typical outcomes and are not guaranteed. Any actual offer is
          made to you in writing after underwriting, and comes with a written statement of total
          dollar cost, remittance amount and frequency, and expected term.
        </p>
        <p>
          The calculators and estimate tools on this site are illustrative. They do not price your
          business, do not reflect underwriting, and the figures they produce may differ materially
          from any offer you receive. See our <Link to="/legal/disclosures">disclosures</Link>.
        </p>

        <h2>We are not a lender</h2>
        <p>
          {SITE.legalName} is not a bank and does not make loans. A merchant cash advance is the
          purchase of a business's future receivables at a discount - a commercial transaction, not
          an extension of consumer credit. Funding is for business or commercial purposes only and
          is not available for personal, family or household use.
        </p>

        <h2>Applying for funding</h2>
        <p>
          The eligibility check that opens the application collects no personal information and is
          not a credit inquiry. Continuing into the full application means giving us information
          about the business and each owner listed, uploading or connecting bank statements, and
          signing the authorization presented at the final step.
        </p>
        <p>
          Submitting an application does not create any obligation on our part to make an offer, and
          does not create a lending, brokerage, fiduciary or advisory relationship between us. We may
          decline any application, at our discretion, for any lawful reason.
        </p>

        <h2>Accuracy of information you provide</h2>
        <p>
          You agree that everything you submit is true, accurate and complete, that the documents you
          upload are genuine and unaltered, that each owner listed has authorized their information
          to be submitted, and that you will tell us promptly if anything material changes before
          funding. Submitting information you know to be false, or a document you know to be
          altered, may be a criminal offense and is grounds for us to terminate the application and
          report it.
        </p>

        <h2>Electronic communications and signatures</h2>
        <p>
          You consent to conduct this transaction electronically and to receive disclosures, notices,
          agreements and other documents from us in electronic form. You agree that your electronic
          signature has the same legal force and effect as a handwritten signature under the federal
          E-SIGN Act and applicable state Uniform Electronic Transactions Acts.
        </p>
        <p>
          To access and retain electronic records you need a current web browser, an internet
          connection, an active email address, and the ability to view and save PDF files. You may
          withdraw consent to electronic delivery, or request a paper copy of any record, by
          contacting us - this may delay or end an application in progress. When you sign, we record
          the timestamp, IP address, browser user agent and the version of the text that was
          displayed to you, and we retain that record as described in our{' '}
          <Link to="/legal/privacy">privacy policy</Link>.
        </p>

        <h2>Calls, texts and email</h2>
        <Callout title="Consent can be withdrawn at any time.">
          By giving us a phone number you agree we may contact you at it about your inquiry or
          application - including by automated dialing system, prerecorded or artificial voice, and
          SMS. Consent is not a condition of receiving funding. Message and data rates may apply,
          and message frequency varies. Reply <strong>STOP</strong> to any text to opt out or{' '}
          <strong>HELP</strong> for help. Calls may be monitored or recorded for quality and
          training.
        </Callout>

        <h2>Client login</h2>
        <p>
          Access to the client portal is subject to any additional terms presented there. You are
          responsible for keeping your credentials confidential and for activity under your account.
          Tell us immediately if you believe an account has been compromised.
        </p>

        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the site for any unlawful purpose, or to submit fraudulent or fabricated information</li>
          <li>Impersonate any person or business, or misstate your authority to act for one</li>
          <li>
            Scrape, crawl, harvest or systematically extract content or data, or use automated means
            to submit forms
          </li>
          <li>
            Attempt to probe, scan or breach the security of the site, defeat rate limits or bot
            protection, or gain unauthorized access to any system or data
          </li>
          <li>Introduce malware, or interfere with the operation of the site or its infrastructure</li>
          <li>Reverse engineer, decompile or copy the site's software or design</li>
          <li>Use the site or its content to build or train a competing product or service</li>
        </ul>
        <p>
          We may suspend or terminate access to the site, or to an application in progress, if we
          reasonably believe these terms have been breached.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The site, and its content, design, text, graphics, logos and software, are owned by{' '}
          {SITE.legalName} or its licensors and are protected by copyright, trademark and other
          laws. You may view and print pages for your own business use in evaluating financing. Any
          other reproduction, distribution, modification or commercial use requires our written
          permission. "GLD Funding" and our logo are our marks; other marks belong to their owners.
        </p>
        <p>
          If you send us feedback or suggestions, you grant us an unrestricted, royalty-free right to
          use them without obligation to you.
        </p>

        <h2>Third-party content and links</h2>
        <p>
          The site links to third-party sites and services we do not control, including our client
          login portal, bank data providers and social platforms. We are not responsible for their
          content, availability or practices, and a link is not an endorsement.
        </p>
        <p>
          Educational content on this site - including the glossary, industry pages and the
          regulatory summaries on state pages - is general information, not legal, tax, accounting
          or financial advice, and is current only as of its last update. Confirm current
          obligations with qualified counsel before relying on any of it.
        </p>

        <h2>Disclaimer of warranties</h2>
        <p>
          The site and its content are provided "as is" and "as available", without warranty of any
          kind. To the fullest extent permitted by law, we disclaim all warranties, express or
          implied, including merchantability, fitness for a particular purpose, title and
          non-infringement. We do not warrant that the site will be uninterrupted, timely, secure or
          error-free, that defects will be corrected, or that any content, estimate or calculator
          output is accurate, complete or current. Some jurisdictions do not allow the exclusion of
          certain warranties, so parts of this section may not apply to you.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, neither {SITE.legalName} nor its members, officers,
          employees, agents, service providers or licensors will be liable for any indirect,
          incidental, special, consequential, exemplary or punitive damages, or for any loss of
          profits, revenue, business, goodwill, data or business opportunity, arising out of or
          relating to your use of - or inability to use - this site, its content, or any estimate,
          calculator output or information obtained through it. This applies regardless of the legal
          theory and even if we have been advised of the possibility of such damages.
        </p>
        <p>
          Our total aggregate liability for all claims relating to the site will not exceed one
          hundred United States dollars ($100). This limitation does not apply to liability that
          cannot be excluded or limited under applicable law, and it does not limit either party's
          rights or obligations under a signed funding agreement, which is governed by its own terms.
        </p>
        <p>
          Some jurisdictions do not allow the limitation or exclusion of liability for incidental or
          consequential damages, so parts of this section may not apply to you.
        </p>

        <h2>Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless {SITE.legalName} and its members, officers,
          employees and agents from any claim, loss, liability, cost or expense - including
          reasonable attorneys' fees - arising out of your use of the site, your breach of these
          terms, your violation of any law or the rights of a third party, or any information you
          submit that proves to be false, altered or submitted without authority.
        </p>

        <h2>Governing law and venue</h2>
        <p>
          These terms, and any dispute arising out of or relating to them or to your use of this
          site, are governed by the laws of the State of New York, without regard to its conflict of
          laws rules. You and {SITE.legalName} agree to the exclusive jurisdiction and venue of the
          state and federal courts located in Nassau County, New York, and waive any objection to
          that venue as inconvenient.
        </p>
        <p>
          Any dispute must be brought within one year after the claim arises, or it is permanently
          barred, to the extent that limitation is enforceable under applicable law. Nothing in this
          section limits the dispute resolution, governing law or venue provisions of a signed
          funding agreement, which control over this section for disputes arising under that
          agreement.
        </p>

        <h2>General</h2>
        <p>
          If any provision of these terms is held unenforceable, it is modified to the minimum extent
          necessary and the remaining provisions stay in force. Our failure to enforce a provision is
          not a waiver of it. You may not assign these terms; we may assign them in connection with a
          merger, acquisition or sale of assets. These terms, together with our{' '}
          <Link to="/legal/privacy">privacy policy</Link> and{' '}
          <Link to="/legal/disclosures">disclosures</Link>, are the entire agreement between us
          regarding the site - and are superseded, as to any funding, by the signed agreement
          covering it.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may revise these terms at any time. The "last updated" date at the top of this page
          reflects the current version, and changes take effect when posted. Continuing to use the
          site after a change means you accept it. If you do not, stop using the site.
        </p>

        <h2>Contact us</h2>
        <p>
          {SITE.legalName}, {SITE.address.street}, {SITE.address.locality}, {SITE.address.region}{' '}
          {SITE.address.postalCode}. Phone {SITE.phone}. Fax {SITE.fax}. Email{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. You can also reach us through our{' '}
          <Link to="/contact">contact form</Link>.
        </p>
      </LegalPage>
    </>
  )
}

Component.displayName = 'Terms'
