import { Link } from 'react-router-dom'
import { Seo, breadcrumbSchema } from '../../lib/seo'
import { Callout } from '../../components/ui'
import { SITE } from '../../data/site'
import { LegalPage } from './Legal'

export function Component() {
  return (
    <>
      <Seo
        path="/legal/privacy"
        title="Privacy Policy"
        description="How GLD Funding collects, uses, protects and retains business and personal information submitted through this site, including bank data, credit information and signature records."
        schema={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Privacy policy', path: '/legal/privacy' }])]}
      />
      <LegalPage
        title="Privacy policy"
        updated="August 2026"
        intro="How we collect, use, protect and retain the information you give us - written to be read, not to be scrolled past."
      >
        <h2>Who this policy covers</h2>
        <p>
          This policy applies to {SITE.legalName} ("GLD Funding", "we", "us"), to this website at{' '}
          {SITE.domain.replace('https://', '')}, and to the funding applications, forms and support
          channels we operate. It covers information about businesses that apply to us, about the
          owners and officers who apply on a business's behalf, and about visitors who browse the
          site without applying.
        </p>
        <p>
          It does not cover the separate privacy practices of the third parties we link to,
          including our client login portal's identity provider, the banks and payment processors
          that hold your accounts, or the social platforms linked in our footer. Those are governed
          by their own policies.
        </p>

        <h2>Information we collect</h2>

        <h3>Information you give us directly</h3>
        <p>When you apply for funding, we collect:</p>
        <ul>
          <li>
            <strong>Business identity</strong> - legal name, DBA, entity type, Employer
            Identification Number, business address, phone, industry and start date
          </li>
          <li>
            <strong>Owner identity</strong> - for each owner listed on the application: name, title,
            ownership percentage, email, mobile phone, home address, date of birth and Social
            Security number
          </li>
          <li>
            <strong>Financial information</strong> - business bank statements, deposit and balance
            history, average monthly revenue, and the details of any existing advances or financing
            positions you disclose
          </li>
          <li>
            <strong>Your funding request</strong> - amount requested, intended use of funds and
            timing
          </li>
          <li>
            <strong>Authorization records</strong> - your electronic signature image together with
            the timestamp, IP address, browser user agent and the version identifier of the
            authorization text displayed to you at the moment you signed
          </li>
          <li>
            <strong>Correspondence</strong> - what you send us through the contact form, by email,
            by SMS, or say to us on a recorded servicing call
          </li>
        </ul>

        <Callout title="The eligibility check asks for none of this.">
          The three-question check that opens the application asks only for monthly revenue, time in
          business and industry. It collects no name, no contact details and no personal
          information, it is not stored against a person, and it is not a credit inquiry. Personal
          and financial information is collected only once you continue into the full application.
        </Callout>

        <h3>Information we collect automatically</h3>
        <ul>
          <li>
            <strong>Device and connection data</strong> - IP address, browser type and version,
            operating system, and screen characteristics
          </li>
          <li>
            <strong>Usage data</strong> - pages viewed, time on page, the link or search that
            referred you, and the path you took through the site
          </li>
          <li>
            <strong>Application progress</strong> - which steps of the application you have
            completed, so a part-finished application can be resumed
          </li>
        </ul>

        <h3>Information we receive from other sources</h3>
        <ul>
          <li>
            <strong>Consumer and business credit reporting agencies</strong> - credit reports and
            scores, obtained under the authorization you sign on the application, during
            underwriting and in connection with any renewal
          </li>
          <li>
            <strong>Bank data aggregators</strong> - where you choose to connect your bank account
            instead of uploading statements, read-only transaction and balance history
          </li>
          <li>
            <strong>Payment processors and financial institutions</strong> - card volume and deposit
            verification, where you have authorized us to verify directly
          </li>
          <li>
            <strong>Referral partners and independent sales organizations</strong> - where a partner
            introduced you to us, the application information you gave them
          </li>
          <li>
            <strong>Public and commercial records</strong> - entity registrations, UCC filings, lien
            and judgment records, and fraud and identity verification databases
          </li>
        </ul>

        <h2>Why we use it</h2>
        <ul>
          <li>To evaluate your application and decide whether, and on what terms, to fund it</li>
          <li>To verify your identity and the accuracy of the financial information you gave us</li>
          <li>To detect, investigate and prevent fraud and other unlawful activity</li>
          <li>
            To fund, service, collect and reconcile any advance provided, including originating the
            remittances you authorize
          </li>
          <li>
            To communicate with you about your application, your account, and - where you have not
            opted out - other products we offer
          </li>
          <li>
            To meet legal, regulatory and audit obligations, including state commercial financing
            disclosure, registration and recordkeeping requirements, anti-money-laundering
            obligations, and the record retention required to make an electronic signature
            enforceable
          </li>
          <li>
            To maintain, secure and improve the site, and to measure which pages and sources bring
            businesses to us
          </li>
        </ul>
        <p>
          <strong>We do not use Social Security numbers, dates of birth, bank statements or bank
          connection data for advertising, and we do not use them to build profiles for any purpose
          other than the ones listed above.</strong>
        </p>

        <h2>Who we share it with</h2>
        <p>
          <strong>We do not sell your personal information, and we do not share it for
          cross-context behavioral advertising.</strong> We disclose it only in these circumstances:
        </p>
        <ul>
          <li>
            <strong>Service providers</strong> who work on our behalf under written contracts that
            limit them to our instructions - hosting and infrastructure providers, bank data
            aggregators, identity and fraud verification services, e-signature and document storage
            providers, payment processors and ACH originators, communications platforms, and
            analytics providers
          </li>
          <li>
            <strong>Funding partners</strong> where an advance is syndicated, participated or
            assigned, and prospective assignees conducting diligence under confidentiality
          </li>
          <li>
            <strong>Referral partners and independent sales organizations</strong>, limited to
            application status and funding outcome for the deals they introduced
          </li>
          <li>
            <strong>Credit reporting agencies and commercial data services</strong>, where we report
            or verify account performance
          </li>
          <li>
            <strong>Professional advisors</strong> - counsel, auditors and accountants - under a
            duty of confidentiality
          </li>
          <li>
            <strong>Regulators, courts and law enforcement</strong>, where required by law, subpoena
            or other legal process, or where necessary to establish or defend legal claims
          </li>
          <li>
            <strong>A successor</strong> in a merger, acquisition, financing or sale of assets, in
            which case this policy continues to govern the information transferred until the
            successor gives you notice of any change
          </li>
        </ul>

        <h2>Connecting your bank account</h2>
        <p>
          You may supply bank statements either by uploading them or by connecting your bank account
          through a third-party bank data aggregator. If you connect an account, you enter your
          banking credentials on the aggregator's screen, not ours. We never receive or store your
          online banking username or password. The aggregator gives us read-only access to
          transaction and balance history for the statement period we need - we cannot move money
          through that connection, and you can revoke the connection with the aggregator or with us
          at any time.
        </p>

        <h2>Cookies and analytics</h2>
        <p>
          We use a small number of cookies and similar technologies. <strong>Strictly necessary</strong>{' '}
          cookies keep the site working, hold your place in a part-completed application and protect
          forms against abuse; these cannot be switched off.{' '}
          <strong>Analytics</strong> cookies tell us, in aggregate, which pages are read and which
          sources bring businesses to us. We do not use advertising cookies that track you across
          other websites.
        </p>
        <p>
          Most browsers let you block or delete cookies in their settings. Blocking strictly
          necessary cookies will break the application form. We honor the Global Privacy Control
          (GPC) signal as an opt-out request where state law gives it effect.
        </p>

        <h2>How long we keep it</h2>
        <ul>
          <li>
            <strong>Applications that are declined or withdrawn</strong> - 25 months from the date of
            the decision. We apply this single conservative period rather than tracking shorter
            category-specific minimums.
          </li>
          <li>
            <strong>Applications that are abandoned before submission</strong> - 12 months from the
            last activity, then deleted.
          </li>
          <li>
            <strong>Funded files</strong> - for the life of the advance plus 7 years, covering the
            agreement, disclosures, statements and servicing history.
          </li>
          <li>
            <strong>Signature and authorization audit records</strong> - for the life of the
            agreement plus 7 years, retained in a form that accurately reproduces what was displayed
            and signed, as electronic signature law requires.
          </li>
          <li>
            <strong>Bank connection data</strong> - deleted within 90 days of a final decision on a
            declined application; retained with the funded file where an advance is made.
          </li>
          <li>
            <strong>Contact form and support correspondence</strong> - 24 months from the last
            message.
          </li>
          <li>
            <strong>Web analytics</strong> - 26 months, in aggregated form.
          </li>
          <li>
            <strong>Opt-out and suppression records</strong> - kept indefinitely, because deleting
            them is what would cause us to contact you again.
          </li>
        </ul>
        <p>
          Where a legal hold, open investigation, dispute or regulatory examination applies, we
          retain the affected records until it is resolved.
        </p>

        <h2>How we protect it</h2>
        <p>
          We maintain a written information security program with administrative, technical and
          physical safeguards appropriate to the sensitivity of the information we hold, consistent
          with the Safeguards Rule under the Gramm-Leach-Bliley Act. In practice that includes:
        </p>
        <ul>
          <li>Encryption of information in transit (TLS) and at rest</li>
          <li>
            Access limited to personnel with a business need, enforced by role-based permissions and
            multi-factor authentication
          </li>
          <li>Masking of Social Security numbers and account numbers in our interfaces</li>
          <li>Logging and monitoring of access to application files and documents</li>
          <li>Written security obligations imposed on every service provider that touches this data</li>
          <li>Periodic risk assessment, testing, and staff training</li>
          <li>
            An incident response plan, under which we notify affected individuals and regulators
            within the timeframes applicable law requires
          </li>
        </ul>
        <p>
          No system is perfectly secure. Please do not send Social Security numbers, account numbers
          or bank statements to us by ordinary email - use the application form, which is encrypted,
          or call us.
        </p>

        <h2>Your choices</h2>

        <h3>Marketing and contact preferences</h3>
        <p>
          You can stop marketing contact at any time. Reply <strong>STOP</strong> to any SMS
          (<strong>HELP</strong> for help), use the unsubscribe link in any marketing email, tell any
          representative you speak to, or contact us using the details below. We will continue to
          send messages necessary to service an active advance - those are transactional, not
          marketing, and cannot be opted out of while the advance is outstanding.
        </p>

        <h3>Your information</h3>
        <p>
          You may ask us for a copy of the personal information we hold about you, ask us to correct
          it if it is inaccurate, or ask us to delete it. We will honor the request unless we are
          required to keep the information - for example, records tied to a funded advance, a
          signature audit trail, or anything under a legal hold. If we cannot delete something, we
          will tell you which category it falls into and why.
        </p>

        <h3>Financial privacy</h3>
        <p>
          As a financial services provider we are subject to the Gramm-Leach-Bliley Act. We do not
          disclose nonpublic personal information about our applicants or clients to nonaffiliated
          third parties except as described in this policy and as permitted by law - which means
          there is no separate opt-out for you to exercise, because the sharing that would trigger
          one is sharing we do not do.
        </p>

        <h3>Credit report information</h3>
        <p>
          Credit reports obtained about an owner are used to evaluate the application. If an
          application is declined based in whole or in part on information in a consumer report, we
          will tell you and identify the reporting agency, so you can obtain a free copy and dispute
          anything inaccurate directly with them under the Fair Credit Reporting Act.
        </p>

        <h3>State privacy rights</h3>
        <p>
          Several states give residents rights to know what personal information is collected about
          them, to access or delete it, to correct it, to opt out of its sale or of targeted
          advertising, and not to be discriminated against for exercising those rights. California
          residents have those rights under the California Consumer Privacy Act as amended by the
          CPRA; residents of Colorado, Connecticut, Virginia, Utah, Texas and other states with
          comprehensive privacy statutes have comparable rights.
        </p>
        <p>
          Two limits are worth stating plainly. First, most information we collect through the
          application is subject to the Gramm-Leach-Bliley Act, and information covered by GLBA is
          exempt from these state statutes - the GLBA framework above governs it instead. Second,
          information about a business entity is not personal information. Where state rights do
          apply, we honor them regardless of which state you live in.
        </p>
        <p>
          <strong>To exercise a right</strong>, contact us using the details below with the subject
          line "Privacy request". We will verify your identity against information already in our
          records before acting, and respond within 45 days, extending once by a further 45 days
          where necessary and telling you if we do. An authorized agent may submit a request on your
          behalf with written permission we can verify. If we decline a request, you may appeal by
          replying to our response; we will answer an appeal within 45 days.
        </p>

        <h2>Children</h2>
        <p>
          This site is for business owners and is not directed to children. We do not knowingly
          collect information from anyone under 18. If you believe a minor has given us information,
          contact us and we will delete it.
        </p>

        <h2>Links to other sites</h2>
        <p>
          Our site links to third-party sites, including our client login portal and social media
          profiles. We do not control those sites and are not responsible for their privacy
          practices. Read their policies before giving them information.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy as our practices or the law change. The "last updated" date at
          the top of this page always reflects the current version. If a change materially affects
          how we use information you have already given us, we will tell you directly - by email or
          in your client portal - before it takes effect.
        </p>

        <h2>Contact us</h2>
        <p>
          Questions, requests and complaints about privacy go to the same place:
        </p>
        <p>
          {SITE.legalName}, {SITE.address.street}, {SITE.address.locality}, {SITE.address.region}{' '}
          {SITE.address.postalCode}. Phone {SITE.phone}. Fax {SITE.fax}. Email{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. You can also reach us through our{' '}
          <Link to="/contact">contact form</Link>.
        </p>
        <p>
          See also our <Link to="/legal/terms">terms of use</Link> and our{' '}
          <Link to="/legal/disclosures">disclosures</Link>.
        </p>
      </LegalPage>
    </>
  )
}

Component.displayName = 'Privacy'
