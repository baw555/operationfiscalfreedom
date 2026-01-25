import { Layout } from "@/components/layout";

export default function Privacy() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl font-display mb-4">
              Privacy Policy
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-slate">
            <p className="text-sm text-gray-500">Last Updated: January 2026</p>

            <h2>Introduction</h2>
            <p>
              Veteran Led Tax Solutions ("we," "our," or "us") is committed to protecting your 
              privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you use our services.
            </p>

            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect personal information that you provide, including:</p>
            <ul>
              <li>Name, address, phone number, and email address</li>
              <li>Social Security Number and tax identification numbers</li>
              <li>Financial information and tax documents</li>
              <li>Employment and income information</li>
              <li>Business information for business clients</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>
              When you access our website or services, we may automatically collect certain 
              information including your IP address, browser type, and usage data.
            </p>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide tax preparation and related services</li>
              <li>Communicate with you about your account and services</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Improve our services and develop new features</li>
              <li>Protect against fraud and unauthorized access</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Government agencies as required by law (e.g., IRS, state tax authorities)</li>
              <li>Service providers who assist in our operations</li>
              <li>Professional advisors as needed</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your 
              personal information, including encryption, access controls, and secure storage.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us through 
              our intake form or at support@veteranledtax.com.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
