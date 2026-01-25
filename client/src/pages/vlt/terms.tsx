import { Layout } from "@/components/layout";

export default function Terms() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl font-display mb-4">
              Terms of Service
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-slate">
            <p className="text-sm text-gray-500">Last Updated: January 2026</p>

            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using the services of Veteran Led Tax Solutions, you agree to be 
              bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>

            <h2>Services</h2>
            <p>
              Veteran Led Tax Solutions provides tax preparation, planning, resolution, accounting, 
              and related financial services. The specific scope of services will be outlined in 
              your engagement letter.
            </p>

            <h2>Client Responsibilities</h2>
            <p>As a client, you agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Respond timely to requests for information</li>
              <li>Review all documents before signing</li>
              <li>Pay for services as agreed</li>
              <li>Notify us of any changes to your information</li>
            </ul>

            <h2>Our Responsibilities</h2>
            <p>We agree to:</p>
            <ul>
              <li>Provide services with professional competence</li>
              <li>Maintain confidentiality of your information</li>
              <li>Act in your best interest within legal boundaries</li>
              <li>Communicate clearly about services and fees</li>
            </ul>

            <h2>Fees and Payment</h2>
            <p>
              Fees for our services will be communicated before work begins. Payment terms will 
              be outlined in your engagement letter. We reserve the right to modify fees with 
              appropriate notice.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Veteran Led Tax Solutions shall not be 
              liable for indirect, incidental, or consequential damages arising from our services.
            </p>

            <h2>Dispute Resolution</h2>
            <p>
              Any disputes arising from these terms or our services shall be resolved through 
              good-faith negotiation. If necessary, disputes may be submitted to binding arbitration.
            </p>

            <h2>Termination</h2>
            <p>
              Either party may terminate the service relationship with written notice. You remain 
              responsible for fees for services rendered prior to termination.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We may modify these terms at any time. Continued use of our services constitutes 
              acceptance of modified terms.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these Terms should be directed to us through our intake form or 
              at support@veteranledtax.com.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
