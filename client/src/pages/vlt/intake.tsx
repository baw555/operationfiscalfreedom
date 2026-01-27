import { useState, useEffect } from "react";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function VLTIntake() {
  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setReferralCode(ref);
  }, []);

  async function submit(e: any) {
    e.preventDefault();
    const form = new FormData(e.target);
    const data: any = Object.fromEntries(form);
    
    if (referralCode) {
      data.referralCode = referralCode;
    }

    const res = await fetch("/api/vlt-intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    setStatus(json.routedTo);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <Container>
          <div className="mt-12 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-brand-navy">Thank You!</h1>
            <p className="mt-4 text-gray-700">
              Your intake has been received and routed to our <strong>{status}</strong> team.
            </p>
            <p className="mt-2 text-gray-600">
              A specialist will contact you within 24-48 hours to discuss your tax situation.
            </p>
            <Link href="/veteran-led-tax">
              <span className="inline-block mt-6 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
                Return Home
              </span>
            </Link>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy" data-testid="heading-intake">Secure Tax Intake</h1>
        <p className="mt-2 text-gray-600">Tell us about your tax situation and we'll connect you with the right specialist.</p>

        {referralCode && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            Referred by partner: <span className="font-mono">{referralCode}</span>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input 
              name="name" 
              required 
              placeholder="John Smith" 
              className="border p-3 w-full rounded"
              data-testid="input-name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="john@example.com" 
              className="border p-3 w-full rounded"
              data-testid="input-email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input 
              name="phone" 
              type="tel" 
              placeholder="(555) 123-4567" 
              className="border p-3 w-full rounded"
              data-testid="input-phone"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">What do you need help with? *</label>
            <select 
              name="issue" 
              required 
              className="border border-gray-300 bg-white text-brand-navy p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-brand-red"
              data-testid="select-issue"
            >
              <option value="">Select an issue...</option>
              <option value="credits">Tax Credits (R&D, WOTC, FICA, etc.)</option>
              <option value="resolution">Tax Resolution (IRS Problems)</option>
              <option value="preparation">Tax Preparation</option>
              <option value="planning">Tax Planning</option>
              <option value="payroll">Payroll Services</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Business Type</label>
            <select 
              name="businessType" 
              className="border border-gray-300 bg-white text-brand-navy p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-brand-red"
              data-testid="select-business-type"
            >
              <option value="">Select business type...</option>
              <option value="individual">Individual / Personal</option>
              <option value="sole_prop">Sole Proprietorship</option>
              <option value="llc">LLC</option>
              <option value="s_corp">S Corporation</option>
              <option value="c_corp">C Corporation</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Additional Details</label>
            <textarea 
              name="issueDetails" 
              rows={3} 
              placeholder="Tell us more about your situation..."
              className="border p-3 w-full rounded"
              data-testid="textarea-details"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90"
            data-testid="button-submit"
          >
            Submit Intake
          </button>

          <p className="text-xs text-gray-500 text-center">
            Your information is secure and will only be shared with our tax specialists.
          </p>
        </form>
      </Container>
      <Footer />
    </>
  );
}
