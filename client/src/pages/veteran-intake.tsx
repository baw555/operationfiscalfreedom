import { Layout } from "@/components/layout";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Shield, Heart, Activity, DollarSign, CheckCircle } from "lucide-react";
import { useScrollToTopOnChange } from "@/hooks/use-scroll-to-top";
import { TCPAConsent } from "@/components/tcpa-consent";

export default function VeteranIntake() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    branchOfService: "",
    dischargeStatus: "",
    programType: "",
    currentVARating: "",
    targetVARating: "",
    referralCode: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [tcpaConsent, setTcpaConsent] = useState(false);
  useScrollToTopOnChange(submitted);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/veteran-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: () => setSubmitted(true),
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

  const programs = [
    { id: "disability", name: "VA Disability Assistance", icon: Shield, desc: "Help increasing your VA rating" },
    { id: "holistic", name: "Holistic Health Education", icon: Heart, desc: "Natural wellness and lifestyle support" },
    { id: "healthcare", name: "Private Healthcare Options", icon: Activity, desc: "Faster access to medical care" },
    { id: "financial", name: "Financial Planning", icon: DollarSign, desc: "Veteran-focused financial guidance" },
  ];

  if (submitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-brand-navy mb-4">Thank You</h2>
            <p className="text-gray-600">Your intake form has been submitted. A member of our team may reach out within 24-48 hours. You may be eligible for assistance based on the information provided. You may opt out of communications at any time by replying STOP to texts or clicking unsubscribe in emails.</p>
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
            <h1 className="text-3xl font-bold text-brand-navy mb-2">Veteran Services Intake</h1>
            <p className="text-gray-600">Select a program and tell us about yourself so we can best assist you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {programs.map((prog) => (
              <button
                key={prog.id}
                type="button"
                onClick={() => setFormData({ ...formData, programType: prog.id })}
                className={`p-4 border rounded-lg text-left transition-all ${
                  formData.programType === prog.id
                    ? "border-brand-red bg-red-50"
                    : "border-gray-200 hover:border-brand-navy"
                }`}
              >
                <div className="flex items-start gap-3">
                  <prog.icon className={`w-6 h-6 ${formData.programType === prog.id ? "text-brand-red" : "text-gray-500"}`} />
                  <div>
                    <h3 className="font-bold">{prog.name}</h3>
                    <p className="text-sm text-gray-600">{prog.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
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
                <label className="block text-sm font-medium mb-1">Branch of Service</label>
                <select
                  name="branchOfService"
                  value={formData.branchOfService}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select...</option>
                  <option value="army">Army</option>
                  <option value="navy">Navy</option>
                  <option value="air_force">Air Force</option>
                  <option value="marines">Marines</option>
                  <option value="coast_guard">Coast Guard</option>
                  <option value="space_force">Space Force</option>
                  <option value="national_guard">National Guard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discharge Status</label>
                <select
                  name="dischargeStatus"
                  value={formData.dischargeStatus}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select...</option>
                  <option value="honorable">Honorable</option>
                  <option value="general">General</option>
                  <option value="other_than_honorable">Other Than Honorable</option>
                  <option value="active_duty">Still Active Duty</option>
                </select>
              </div>
            </div>

            {formData.programType === "disability" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current VA Rating %</label>
                  <input
                    type="text"
                    name="currentVARating"
                    value={formData.currentVARating}
                    onChange={handleChange}
                    placeholder="e.g., 70"
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target VA Rating %</label>
                  <input
                    type="text"
                    name="targetVARating"
                    value={formData.targetVARating}
                    onChange={handleChange}
                    placeholder="e.g., 100"
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
            )}

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
                placeholder="Tell us about your situation..."
              />
            </div>

            <TCPAConsent checked={tcpaConsent} onCheckedChange={setTcpaConsent} />

            <button
              type="submit"
              disabled={mutation.isPending || !formData.programType || !tcpaConsent}
              className="w-full bg-brand-red text-white py-3 rounded font-bold hover:bg-brand-red/90 disabled:bg-gray-400"
              data-testid="button-submit-veteran-intake"
            >
              {mutation.isPending ? "Submitting..." : "Submit Intake Form"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
