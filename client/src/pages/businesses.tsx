import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Users, ChevronDown, ChevronUp, Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

type LeadFormData = {
  businessName: string;
  contactName: string;
  position: string;
  phone: string;
  email: string;
  comment: string;
};

const initialFormData: LeadFormData = {
  businessName: "",
  contactName: "",
  position: "",
  phone: "",
  email: "",
  comment: "",
};

function LeadDropdownForm({ 
  leadType, 
  isOpen, 
  onToggle 
}: { 
  leadType: "access_talent" | "utilize_service" | "promote_network";
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: LeadFormData & { leadType: string }) => {
      const res = await fetch("/api/business-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      setFormData(initialFormData);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({ ...formData, leadType });
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-4 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h4 className="text-lg font-bold text-green-800 mb-2">Thank You!</h4>
        <p className="text-green-700">Your information has been submitted. A representative will contact you shortly.</p>
        <Button 
          onClick={() => setSubmitted(false)} 
          variant="outline" 
          className="mt-4"
          data-testid={`button-submit-another-${leadType}`}
        >
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-brand-navy text-white rounded-lg hover:bg-brand-navy/90 transition-colors font-medium"
        data-testid={`button-toggle-${leadType}`}
      >
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        {isOpen ? "Close Form" : "Get Started"}
      </button>
      
      {isOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border rounded-lg p-4 mt-3 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brand-navy focus:border-transparent"
              placeholder="Your Company Name"
              data-testid={`input-business-name-${leadType}`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
              <input
                type="text"
                required
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                placeholder="Your Full Name"
                data-testid={`input-contact-name-${leadType}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                placeholder="Your Title/Position"
                data-testid={`input-position-${leadType}`}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                placeholder="(555) 555-5555"
                data-testid={`input-phone-${leadType}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                placeholder="email@company.com"
                data-testid={`input-email-${leadType}`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brand-navy focus:border-transparent"
              placeholder="Tell us more about your needs..."
              data-testid={`input-comment-${leadType}`}
            />
          </div>
          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full bg-brand-red hover:bg-brand-red/90 text-white"
            data-testid={`button-submit-${leadType}`}
          >
            {submitMutation.isPending ? (
              "Submitting..."
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Submit
              </>
            )}
          </Button>
          {submitMutation.isError && (
            <p className="text-red-600 text-sm text-center">Failed to submit. Please try again.</p>
          )}
        </form>
      )}
    </div>
  );
}

export default function Businesses() {
  const [openForm, setOpenForm] = useState<"access_talent" | "utilize_service" | "promote_network" | null>(null);

  return (
    <Layout>
      <section className="bg-brand-black text-white py-12 sm:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-display mb-4 sm:mb-6">Hire Veterans. Grow Your Company.</h1>
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-10 px-2">
            Join the largest network of veteran-owned businesses. Hire reliable talent and find new partners.
          </p>
          <Button size="lg" className="bg-brand-red hover:bg-brand-red/90 text-white h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-lg w-full sm:w-auto">
            List Your Business
          </Button>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-navy/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-brand-navy">
                <Users size={24} className="sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-2 sm:mb-3">Access Talent</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">Connect with disciplined, skilled veterans ready to work.</p>
              <LeadDropdownForm 
                leadType="access_talent" 
                isOpen={openForm === "access_talent"} 
                onToggle={() => setOpenForm(openForm === "access_talent" ? null : "access_talent")} 
              />
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-navy/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-brand-navy">
                <Building2 size={24} className="sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-2 sm:mb-3">Utilize a Service</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">Partial proceeds benefit veteran education and healthcare.</p>
              <LeadDropdownForm 
                leadType="utilize_service" 
                isOpen={openForm === "utilize_service"} 
                onToggle={() => setOpenForm(openForm === "utilize_service" ? null : "utilize_service")} 
              />
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-navy/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-brand-navy">
                <TrendingUp size={24} className="sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-2 sm:mb-3">Promote to Your Network</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">Share this opportunity with your clients and partners.</p>
              <LeadDropdownForm 
                leadType="promote_network" 
                isOpen={openForm === "promote_network"} 
                onToggle={() => setOpenForm(openForm === "promote_network" ? null : "promote_network")} 
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
