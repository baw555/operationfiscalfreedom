import { Layout } from "@/components/layout";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Building2, Shield, Calculator, CheckCircle, Briefcase, Users } from "lucide-react";
import { useScrollToTopOnChange } from "@/hooks/use-scroll-to-top";
import { TCPAConsent } from "@/components/tcpa-consent";
import { logConsent } from "@/lib/consent-logger";

export default function BusinessIntake() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    employeeCount: "",
    annualRevenue: "",
    serviceType: "",
    referralCode: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [tcpaConsent, setTcpaConsent] = useState(false);
  useScrollToTopOnChange(submitted);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/business-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: async (result) => {
      await logConsent({
        submissionType: "business_intake",
        submissionId: result.id,
        name: formData.contactName,
        email: formData.email,
        phone: formData.phone,
      });
      setSubmitted(true);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tcpaConsent) {
      return;
    }
    mutation.mutate(formData);
  };

  const services = [
    { id: "insurance", name: "Business Insurance", icon: Shield, desc: "Commercial insurance solutions" },
    { id: "tax", name: "Tax Services", icon: Calculator, desc: "Business tax preparation and planning" },
    { id: "payroll", name: "Payroll Services", icon: Users, desc: "Full-service payroll management" },
    { id: "consulting", name: "Business Consulting", icon: Briefcase, desc: "Strategic growth guidance" },
  ];

  if (submitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-brand-navy mb-4">Thank You</h2>
            <p className="text-gray-600">Your business inquiry has been submitted. A member of our B2B team may reach out within 24-48 hours. You may opt out of communications at any time by replying STOP to texts or clicking unsubscribe in emails.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Building2 className="w-8 h-8 text-brand-navy" />
              <h1 className="text-3xl font-bold text-brand-navy">Business Services Intake</h1>
            </div>
            <p className="text-gray-600">Select a service and provide your business details so we can tailor our solutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {services.map((svc) => (
              <button
                key={svc.id}
                type="button"
                onClick={() => setFormData({ ...formData, serviceType: svc.id })}
                className={`p-4 border rounded-lg text-left transition-all ${
                  formData.serviceType === svc.id
                    ? "border-brand-navy bg-blue-50"
                    : "border-gray-200 hover:border-brand-red"
                }`}
              >
                <div className="flex items-start gap-3">
                  <svc.icon className={`w-6 h-6 ${formData.serviceType === svc.id ? "text-brand-navy" : "text-gray-500"}`} />
                  <div>
                    <h3 className="font-bold">{svc.name}</h3>
                    <p className="text-sm text-gray-600">{svc.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Name *</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://"
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select...</option>
                  <option value="construction">Construction</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="professional_services">Professional Services</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="technology">Technology</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Number of Employees</label>
                <select
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select...</option>
                  <option value="1-5">1-5</option>
                  <option value="6-25">6-25</option>
                  <option value="26-100">26-100</option>
                  <option value="100+">100+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Annual Revenue</label>
                <select
                  name="annualRevenue"
                  value={formData.annualRevenue}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select...</option>
                  <option value="under_100k">Under $100K</option>
                  <option value="100k_500k">$100K - $500K</option>
                  <option value="500k_1m">$500K - $1M</option>
                  <option value="1m_5m">$1M - $5M</option>
                  <option value="5m_plus">$5M+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Referral Code (optional)</label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="If someone referred you, enter their code"
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded p-2"
                placeholder="Tell us about your business needs..."
              />
            </div>

            <TCPAConsent checked={tcpaConsent} onCheckedChange={setTcpaConsent} />

            <button
              type="submit"
              disabled={mutation.isPending || !formData.serviceType || !tcpaConsent}
              className="w-full bg-brand-navy text-white py-3 rounded font-bold hover:bg-brand-navy/90 disabled:bg-gray-400"
              data-testid="button-submit-business-intake"
            >
              {mutation.isPending ? "Submitting..." : "Submit Business Inquiry"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
