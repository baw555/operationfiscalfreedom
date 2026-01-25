import { Layout } from "@/components/layout";

export default function Disclosures() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl font-display mb-4">
              Disclosures
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-slate">
            <h2>Important Disclosures</h2>
            <p>
              Veteran Led Tax Solutions provides tax preparation, planning, resolution, and related 
              financial services. The following disclosures apply to our services:
            </p>

            <h3>Tax Services</h3>
            <p>
              Our tax services are provided by qualified tax professionals. Results may vary based 
              on individual circumstances. Past performance or outcomes do not guarantee future results.
            </p>

            <h3>No Legal Advice</h3>
            <p>
              Information provided by Veteran Led Tax Solutions is for informational purposes only 
              and does not constitute legal advice. For legal matters, consult a licensed attorney.
            </p>

            <h3>IRS Circular 230 Disclosure</h3>
            <p>
              To ensure compliance with requirements imposed by the IRS, we inform you that any U.S. 
              federal tax advice contained in this communication (including any attachments) is not 
              intended or written to be used, and cannot be used, for the purpose of (i) avoiding 
              penalties under the Internal Revenue Code or (ii) promoting, marketing or recommending 
              to another party any transaction or matter addressed herein.
            </p>

            <h3>Accuracy</h3>
            <p>
              While we strive for accuracy in all our communications and services, tax laws are 
              complex and subject to change. We recommend consulting with our team for the most 
              current information applicable to your situation.
            </p>

            <h3>Confidentiality</h3>
            <p>
              Client information is kept confidential in accordance with applicable laws and 
              professional standards. See our Privacy Policy for details.
            </p>

            <h3>Contact</h3>
            <p>
              If you have questions about these disclosures, please contact us through our intake form.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
