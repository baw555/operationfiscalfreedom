import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, CheckCircle, Handshake, Target, Building2 } from "lucide-react";

export default function BusinessDevelopment() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    industry: "",
    serviceInterest: "",
    businessSize: "",
    description: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem('business_dev_referral', ref);
    } else {
      const storedRef = localStorage.getItem('business_dev_referral');
      if (storedRef) setReferralCode(storedRef);
    }
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData & { referralCode: string | null }) => {
      const response = await fetch("/api/business-dev-intakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Submission failed");
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({ title: "Inquiry Submitted!", description: "We'll contact you within 24-48 hours." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.industry || !formData.serviceInterest) {
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    submitMutation.mutate({ ...formData, referralCode });
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-brand-navy to-brand-navy/90 py-20">
          <div className="text-center text-white max-w-lg mx-auto px-4">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h1 className="text-4xl font-display mb-4">Inquiry Received!</h1>
            <p className="text-xl text-gray-300 mb-6">
              Thank you for your business development inquiry. Our team will contact you within 24-48 hours.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Patriotic Banner */}
      <div className="h-2 bg-gradient-to-r from-brand-red via-white to-brand-navy"></div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-red via-brand-navy to-brand-navy text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M30 30l15-15v30l-15-15zm-15 0l15 15H0l15-15z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="w-12 h-12" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-display mb-4">Business Development</h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-6">
            Strategic consulting, partnerships, vendor relations, and lead generation services 
            designed to accelerate your business growth.
          </p>
        </div>
      </section>

      {/* Service Options - Red White Blue cards */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-brand-navy p-6 rounded-xl shadow-lg text-center">
              <Handshake className="w-10 h-10 text-white mx-auto mb-3" />
              <h3 className="font-bold text-lg text-white mb-2">Partnerships</h3>
              <p className="text-white/80 text-sm">Strategic partnerships and joint ventures to expand market reach</p>
            </div>
            <div className="bg-brand-red p-6 rounded-xl shadow-lg text-center">
              <Target className="w-10 h-10 text-white mx-auto mb-3" />
              <h3 className="font-bold text-lg text-white mb-2">Lead Generation</h3>
              <p className="text-white/80 text-sm">Qualified lead generation and sales pipeline development</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 text-center">
              <Building2 className="w-10 h-10 text-brand-navy mx-auto mb-3" />
              <h3 className="font-bold text-lg text-brand-navy mb-2">Consulting</h3>
              <p className="text-gray-600 text-sm">Expert business consulting and growth strategy development</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-2">Submit Your Inquiry</h2>
              <p className="text-gray-600">Tell us about your business development needs and goals.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Interest */}
              <div>
                <Label className="text-brand-navy font-semibold mb-3 block">What service are you interested in? *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "consulting", label: "Consulting" },
                    { id: "partnerships", label: "Partnerships" },
                    { id: "vendor_relations", label: "Vendor Relations" },
                    { id: "lead_gen", label: "Lead Generation" },
                    { id: "market_expansion", label: "Market Expansion" },
                    { id: "other", label: "Other" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceInterest: id })}
                      className={`p-3 rounded-lg border-2 transition-all text-sm ${
                        formData.serviceInterest === id
                          ? "border-brand-navy bg-brand-navy text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                      data-testid={`button-service-${id}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div>
                <Label className="text-brand-navy font-semibold mb-3 block">Your Industry *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "healthcare", label: "Healthcare" },
                    { id: "technology", label: "Technology" },
                    { id: "finance", label: "Finance" },
                    { id: "manufacturing", label: "Manufacturing" },
                    { id: "retail", label: "Retail" },
                    { id: "other", label: "Other" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData({ ...formData, industry: id })}
                      className={`p-3 rounded-lg border-2 transition-all text-sm ${
                        formData.industry === id
                          ? "border-brand-red bg-brand-red/10 text-brand-red"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                      data-testid={`button-industry-${id}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Size */}
              <div>
                <Label className="text-brand-navy font-semibold mb-3 block">Business Size</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "small", label: "Small (1-50)" },
                    { id: "medium", label: "Medium (51-500)" },
                    { id: "enterprise", label: "Enterprise (500+)" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData({ ...formData, businessSize: id })}
                      className={`p-3 rounded-lg border-2 transition-all text-sm ${
                        formData.businessSize === id
                          ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                      data-testid={`button-size-${id}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-700">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-700">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1"
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-700">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="companyName" className="text-gray-700">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="mt-1"
                  data-testid="input-company-name"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-700">Describe your business goals</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                  rows={4}
                  placeholder="Tell us about your business, goals, challenges, and what you're looking to achieve..."
                  data-testid="textarea-description"
                />
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white font-bold h-12 text-lg"
                data-testid="button-submit-business-dev"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Inquiry"}
              </Button>

              <p className="text-center text-xs text-gray-500">
                Your information is secure and will only be used to connect you with relevant business development opportunities.
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
