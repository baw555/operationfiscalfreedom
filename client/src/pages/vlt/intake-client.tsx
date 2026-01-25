import { useState, useEffect } from "react";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function VLTIntakeClient() {
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
    
    data.leadType = "direct_client";
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
            <h1 className="text-3xl font-bold text-brand-navy">Request Received!</h1>
            <p className="mt-4 text-gray-700">
              Your consultation request has been submitted to our <strong>{status}</strong> team.
            </p>
            <p className="mt-2 text-gray-600">
              A tax specialist will contact you within 24-48 hours to discuss your needs.
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
        <h1 className="text-3xl font-bold mt-12 text-brand-navy" data-testid="heading-intake-client">Request a Free Consultation</h1>
        <p className="mt-2 text-gray-600">
          Tell us about your business and tax needs. Our veteran-led team will review your situation and reach out to help.
        </p>

        {referralCode && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            Referred by partner: <span className="font-mono">{referralCode}</span>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4 max-w-xl">
          <div className="grid md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input 
                name="phone" 
                type="tel" 
                placeholder="(555) 123-4567" 
                className="border p-3 w-full rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <input 
                name="businessName" 
                placeholder="Your business name" 
                className="border p-3 w-full rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">What do you need help with? *</label>
            <select 
              name="issue" 
              required 
              className="border p-3 w-full rounded"
              data-testid="select-issue"
            >
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
            <label className="block text-sm font-medium mb-1">Business Type</label>
            <select 
              name="businessType" 
              className="border p-3 w-full rounded"
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
            <label className="block text-sm font-medium mb-1">Estimated Annual Revenue</label>
            <select name="annualRevenue" className="border p-3 w-full rounded">
              <option value="">Select range...</option>
              <option value="under_100k">Under $100,000</option>
              <option value="100k_500k">$100,000 - $500,000</option>
              <option value="500k_1m">$500,000 - $1 Million</option>
              <option value="1m_5m">$1 Million - $5 Million</option>
              <option value="5m_plus">$5 Million+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tell us about your situation</label>
            <textarea 
              name="issueDetails" 
              rows={4} 
              placeholder="Describe your tax or financial needs, any current challenges, and what you're hoping to achieve..."
              className="border p-3 w-full rounded"
              data-testid="textarea-details"
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <label className="flex items-start gap-3">
              <input type="checkbox" name="isVeteran" value="yes" className="mt-1" />
              <span className="text-sm text-gray-700">
                <strong>I am a veteran or veteran family member.</strong> We prioritize serving those who have served.
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90"
            data-testid="button-submit"
          >
            Request Free Consultation
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
