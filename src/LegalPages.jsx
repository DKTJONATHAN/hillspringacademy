import { Link } from "react-router-dom";
import { PageHead } from "./components.jsx";
import { SCHOOL } from "./data.js";

function LegalLayout({ title, intro, path, children, draft = false }) {
  return (
    <>
      <PageHead title={title} text={intro} path={path} />
      <section className="section privacy-page">
        <div className="wrap">
          <div className="privacy-intro">
            <div><span className="eyebrow">Hill Springs Academy</span><h2>{title}</h2></div>
            <p><strong>Last updated: 19 October 2026.</strong> {intro}</p>
          </div>
          {draft && (
            <div className="privacy-notice">
              <strong>Draft for school review:</strong> The school should approve this policy and
              confirm any fee-specific rules before treating it as its final contractual policy.
            </div>
          )}
          <div className="privacy-grid">{children}</div>
          <div className="privacy-footer-note">
            <strong>Questions?</strong>
            <p>Contact {SCHOOL.name} at <a href={`mailto:${SCHOOL.infoEmail}`}>{SCHOOL.infoEmail}</a> or <a href={`tel:${SCHOOL.phoneTel}`}>{SCHOOL.phone}</a>.</p>
            <div className="btns">
              <Link className="btn small" to="/contact">Contact the school</Link>
              <Link className="btn small ghost dark" to="/privacy">Privacy notice</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Clause({ number, title, children }) {
  return <article className="privacy-card"><span className="privacy-number">{number}</span><h3>{title}</h3>{children}</article>;
}

export function Terms() {
  return (
    <LegalLayout
      title="Terms of Service"
      path="/terms"
      intro="These terms govern use of the Hill Springs Academy website and online parent services."
    >
      <Clause number="01" title="About this website">
        <p>This website provides information about Hill Springs Academy, learning resources, school fees, admissions, parent accounts, applications, enquiries and school updates. It is operated for the school by its authorised representatives.</p>
      </Clause>
      <Clause number="02" title="Using the website">
        <p>You agree to use the website lawfully, provide accurate information, keep your login credentials confidential and not attempt to disrupt the service, bypass access controls, impersonate another person or access another user's records.</p>
        <p>We may temporarily restrict access to protect the school, users, children, data or the stability of the service.</p>
      </Clause>
      <Clause number="03" title="Parent accounts and applications">
        <p>Parent accounts are intended for parents or lawful guardians. You are responsible for ensuring that you have authority to submit a learner's information. Application submission does not guarantee admission. Admission decisions, placement, reporting dates and any conditions are confirmed by the school.</p>
        <p>Please notify the school if your contact details change or you suspect unauthorised use of your account.</p>
      </Clause>
      <Clause number="04" title="Children's information">
        <p>Only provide learner information that is relevant to the enquiry or admission process and that you are authorised to provide. Do not use the website to publish a child's information or image without the necessary authority and permissions.</p>
      </Clause>
      <Clause number="05" title="Website content and availability">
        <p>We aim to keep school information accurate and current, but web content, timetables, fee structures, learning resources and availability may change. Contact the school to confirm important admissions, fee or reporting details before making decisions or payments.</p>
        <p>We may update, suspend or discontinue parts of the website for maintenance, security, operational or legal reasons. Nothing in these terms excludes rights that cannot lawfully be excluded.</p>
      </Clause>
      <Clause number="06" title="Third-party services and links">
        <p>The website may use Supabase for accounts and data, Resend for email delivery, Cloudflare for hosting and security, Google Fonts, Google Maps and YouTube. Third-party services are subject to their own terms and privacy notices. External links do not mean that the school endorses every statement or service on those sites.</p>
      </Clause>
      <Clause number="07" title="Fees and payments">
        <p>The website publishes fee information but does not currently provide an online payment gateway. Confirm the current fee structure and approved payment instructions directly with the school before paying. These terms do not replace a written fee agreement, admission letter or school policy that applies to a learner.</p>
      </Clause>
      <Clause number="08" title="Privacy and account deletion">
        <p>Personal information is handled under our <Link to="/privacy" className="textlink">Privacy &amp; Data Protection Notice</Link>. Signed-in parent users can request account deletion from their account portal, or read the <Link to="/delete-account" className="textlink">account deletion instructions</Link>. Certain records may need to be retained where required by law or for legitimate school record-keeping.</p>
      </Clause>
      <Clause number="09" title="Liability and applicable law">
        <p>To the extent permitted by law, the school is not responsible for loss caused by factors outside its reasonable control, temporary internet or third-party outages, or a user's failure to protect their credentials. These terms do not exclude liability or consumer rights that cannot legally be excluded.</p>
        <p>These terms are governed by the laws of Kenya, subject to any mandatory protections that apply to a user in another jurisdiction.</p>
      </Clause>
      <Clause number="10" title="Changes and contact">
        <p>We may update these terms as the website or legal requirements change. The current version will be published here with its updated date. Contact <a href={`mailto:${SCHOOL.infoEmail}`}>{SCHOOL.infoEmail}</a> with questions.</p>
      </Clause>
    </LegalLayout>
  );
}

export function RefundPolicy() {
  return (
    <LegalLayout
      title="Refund Policy"
      path="/refund-policy"
      intro="How Hill Springs Academy handles requests relating to school fees and other payments."
      draft={true}
    >
      <Clause number="01" title="No online payment processing">
        <p>The website currently displays fee information but does not process payments or issue automatic online refunds. Payments should only be made using instructions confirmed directly by the school. Do not send card PINs, passwords or mobile-money PINs through website forms or email.</p>
      </Clause>
      <Clause number="02" title="Requesting a refund">
        <p>Send a written request to <a href={`mailto:${SCHOOL.admissionsEmail}`}>{SCHOOL.admissionsEmail}</a> or contact the school office. Include the payer's name, learner's name where relevant, payment date, amount, receipt or transaction reference, reason for the request and preferred contact details. Do not include passwords or PINs.</p>
        <p>The school may request reasonable evidence to verify the payment and the request. Acknowledgement of a request does not itself mean that a refund has been approved.</p>
      </Clause>
      <Clause number="03" title="Duplicate or mistaken payments">
        <p>Verified duplicate payments, overpayments or payments made to the school in error will be reviewed and, where appropriate, returned to the original payer or payment source, subject to verification, payment-provider requirements and applicable law.</p>
      </Clause>
      <Clause number="04" title="Admission charges and tuition fees">
        <p>Refund eligibility depends on the fee item, the published fee structure, the timing and circumstances of withdrawal, services or materials already provided, and any written admission or fee agreement. Application, admission, tuition, transport, meals, uniforms and other charges may be treated differently.</p>
        <p>Before paying, ask the school for written confirmation of the refund terms that apply to the specific charge. No blanket promise of a full refund is made by this draft policy. The school will assess each request fairly and consistently with its approved fee policy and applicable law.</p>
      </Clause>
      <Clause number="05" title="Decision and timing">
        <p>The school will review the available information and communicate its decision and, if approved, the expected method and timing. Actual receipt may depend on the bank or payment provider. If a refund is declined in whole or in part, the school should explain the basis for its decision.</p>
      </Clause>
      <Clause number="06" title="Questions or complaints">
        <p>Contact <a href={`mailto:${SCHOOL.infoEmail}`}>{SCHOOL.infoEmail}</a> or call <a href={`tel:${SCHOOL.phoneTel}`}>{SCHOOL.phone}</a>. This policy does not limit rights or remedies available under applicable Kenyan consumer-protection law.</p>
      </Clause>
    </LegalLayout>
  );
}

export function DeleteAccountHelp() {
  return (
    <LegalLayout
      title="Delete My Account"
      path="/delete-account"
      intro="How to delete a Hill Springs Academy parent account and its linked online submissions."
    >
      <Clause number="01" title="Delete from your signed-in account">
        <ol>
          <li>Open <Link className="textlink" to="/signup">the parent account portal</Link> and sign in.</li>
          <li>Scroll to <strong>Delete my parent account</strong>.</li>
          <li>Enter your current password and type <strong>DELETE</strong>.</li>
          <li>Choose <strong>Permanently delete my account</strong>.</li>
        </ol>
        <p>The password check is required to help prevent someone who has access to an unattended device from deleting your account.</p>
      </Clause>
      <Clause number="02" title="What will be deleted">
        <p>The flow deletes the parent login, online profile, linked online admission applications, enquiries and messages, outstanding account verification/reset codes, and the newsletter subscription associated with that email address.</p>
      </Clause>
      <Clause number="03" title="Important limits">
        <p>Deletion is permanent and cannot be undone. It does not cancel a learner's school enrolment or automatically settle fee balances. The school may separately retain records where required by law or legitimate school record-keeping obligations. Administrator accounts cannot be deleted through the parent portal.</p>
      </Clause>
      <Clause number="04" title="If you cannot sign in">
        <p>Email <a href={`mailto:${SCHOOL.infoEmail}`}>{SCHOOL.infoEmail}</a> with the subject <strong>Account deletion request</strong>. The school will verify your identity or parental/guardian authority before acting. Do not send your password or one-time verification code.</p>
      </Clause>
    </LegalLayout>
  );
}
