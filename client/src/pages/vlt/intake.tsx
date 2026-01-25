import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface IntakeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceType: string;
  businessType: string;
  description: string;
  urgency: string;
  source: string;
}

export default function Intake() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<IntakeFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    serviceType: "",
    businessType: "",
    description: "",
    urgency: "standard",
    source: ""
  });

  const mutation = useMutation({
    mutationFn: async (data: IntakeFormData) => {
      const res = await fetch("/api/vlt-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <Container>
          <div className="mt-12 mb-12 text-center">
            <h1 className="text-3xl font-bold text-brand-navy">Thank You</h1>
            <p className="mt-4 text-lg text-gray-600">
              Your intake has been received. A team member will contact you within 1-2 business days.
            </p>
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
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Secure Intake</h1>
        <p className="mt-4 max-w-2xl text-gray-700">
          Submitting intake does not create a client relationship.
          Information is reviewed for routing to licensed professionals.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                data-testid="input-first-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                data-testid="input-last-name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                data-testid="input-email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                data-testid="input-phone"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Needed *</label>
            <select
              name="serviceType"
              required
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              data-testid="select-service-type"
            >
              <option value="">Select a service</option>
              <option value="tax_prep">Tax Preparation</option>
              <option value="tax_resolution">Tax Resolution / IRS Issues</option>
              <option value="payroll">Payroll Services</option>
              <option value="cfo">Fractional CFO</option>
              <option value="entity">Entity Structuring</option>
              <option value="credits">Tax Credits</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
            <select
              name="businessType"
              required
              value={formData.businessType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              data-testid="select-business-type"
            >
              <option value="">Select type</option>
              <option value="individual">Individual</option>
              <option value="sole_prop">Sole Proprietor</option>
              <option value="llc">LLC</option>
              <option value="s_corp">S-Corporation</option>
              <option value="c_corp">C-Corporation</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Describe Your Situation *</label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Briefly describe your tax situation or needs..."
              data-testid="textarea-description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              data-testid="select-urgency"
            >
              <option value="standard">Standard</option>
              <option value="urgent">Urgent (within 1 week)</option>
              <option value="critical">Critical (IRS deadline imminent)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              data-testid="select-source"
            >
              <option value="">Select</option>
              <option value="referral">Referral</option>
              <option value="google">Google Search</option>
              <option value="social">Social Media</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-brand-red text-white font-semibold py-3 rounded hover:bg-brand-red/90 disabled:opacity-50"
            data-testid="button-submit"
          >
            {mutation.isPending ? "Submitting..." : "Submit Intake"}
          </button>

          {mutation.isError && (
            <p className="text-red-600 text-sm">Failed to submit. Please try again.</p>
          )}
        </form>
      </Container>
      <Footer />
    </>
  );
}
