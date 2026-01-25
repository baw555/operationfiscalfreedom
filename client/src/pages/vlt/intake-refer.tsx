import { useState, useEffect } from "react";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function VLTIntakeRefer() {
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
    
    data.leadType = "affiliate_referral";
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
            <h1 className="text-3xl font-bold text-brand-navy">Referral Submitted!</h1>
            <p className="mt-4 text-gray-700">
              Your client referral has been received and routed to our <strong>{status}</strong> team.
            </p>
            <p className="mt-2 text-gray-600">
              We'll reach out to your referral within 24-48 hours and keep you updated on the status.
            </p>
            <div className="mt-6 flex gap-4 justify-center">
              <Link href="/veteran-led-tax/finops-refer">
                <span className="inline-block px-6 py-3 bg-brand-navy text-white font-semibold rounded hover:bg-brand-navy/90 cursor-pointer">
                  Submit Another Referral
                </span>
              </Link>
              <Link href="/veteran-led-tax/affiliate">
                <span className="inline-block px-6 py-3 border-2 border-brand-navy text-brand-navy font-semibold rounded hover:bg-gray-50 cursor-pointer">
                  View My Portal
                </span>
              </Link>
            </div>
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
        <h1 className="text-3xl font-bold mt-12 text-brand-navy" data-testid="heading-intake-refer">Submit a Client Referral</h1>
        <p className="mt-2 text-gray-600">
          Refer a client or prospect to earn commissions. We'll handle the rest and keep you updated.
        </p>

        {referralCode && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            Your affiliate code: <span className="font-mono font-bold">{referralCode}</span>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-6 max-w-xl">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-brand-navy">Your Information (Referrer)</h3>
            <div className="mt-3 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name *</label>
                <input name="referrerName" required placeholder="Your full name" className="border p-3 w-full rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Email *</label>
                <input name="referrerEmail" type="email" required placeholder="you@email.com" className="border p-3 w-full rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Phone</label>
                <input name="referrerPhone" type="tel" placeholder="(555) 123-4567" className="border p-3 w-full rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Affiliate Code</label>
                <input 
                  name="referralCode" 
                  placeholder="VLT..." 
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="border p-3 w-full rounded font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-brand-navy">Client Information (Who You're Referring)</h3>
            <div className="mt-3 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Client Name *</label>
                  <input name="name" required placeholder="Client's full name" className="border p-3 w-full rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Client Email *</label>
                  <input name="email" type="email" required placeholder="client@email.com" className="border p-3 w-full rounded" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Client Phone</label>
                  <input name="phone" type="tel" placeholder="(555) 123-4567" className="border p-3 w-full rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Business Name</label>
                  <input name="businessName" placeholder="Client's business name" className="border p-3 w-full rounded" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">What service does your client need? *</label>
            <select name="issue" required className="border p-3 w-full rounded">
              <option value="">Select a service...</option>
              <option value="credits">Tax Credits (R&D, WOTC, FICA, etc.)</option>
              <option value="resolution">Tax Resolution (IRS Problems)</option>
              <option value="preparation">Tax Preparation</option>
              <option value="planning">Tax Planning</option>
              <option value="payroll">Payroll Services</option>
              <option value="bookkeeping">Bookkeeping</option>
              <option value="cfo">Fractional CFO</option>
              <option value="entity">Entity Structuring</option>
              <option value="other">Other / Not Sure</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Client's Business Type</label>
            <select name="businessType" className="border p-3 w-full rounded">
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
            <label className="block text-sm font-medium mb-1">Additional Details About This Referral</label>
            <textarea 
              name="issueDetails" 
              rows={3} 
              placeholder="Any additional context about your client's situation..."
              className="border p-3 w-full rounded"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90"
            data-testid="button-submit-referral"
          >
            Submit Client Referral
          </button>
        </form>
      </Container>
      <Footer />
    </>
  );
}
