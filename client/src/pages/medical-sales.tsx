import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { HeartPulse, CheckCircle, ShoppingCart, Users, Package } from "lucide-react";
import { useScrollToTopOnChange } from "@/hooks/use-scroll-to-top";

export default function MedicalSales() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  useScrollToTopOnChange(submitted);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    roleType: "",
    productCategory: "",
    description: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem('medical_sales_referral', ref);
    } else {
      const storedRef = localStorage.getItem('medical_sales_referral');
      if (storedRef) setReferralCode(storedRef);
    }
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData & { referralCode: string | null }) => {
      const response = await fetch("/api/medical-sales-intakes", {
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.roleType || !formData.productCategory) {
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
              Thank you for your interest in medical sales opportunities. Our team will contact you within 24-48 hours.
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
      <section className="bg-gradient-to-br from-brand-navy via-brand-red to-brand-navy text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HeartPulse className="w-12 h-12" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-display mb-4">Medical Sales Opportunities</h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-6">
            Connect with medical device, equipment, pharmaceutical, and supply sales opportunities. 
            Whether you're looking to buy, sell, or refer - we have connections.
          </p>
        </div>
      </section>

      {/* Role Options - Red White Blue cards */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-brand-red p-6 rounded-xl shadow-lg text-center">
              <ShoppingCart className="w-10 h-10 text-white mx-auto mb-3" />
              <h3 className="font-bold text-lg text-white mb-2">Buyers</h3>
              <p className="text-white/80 text-sm">Looking for medical equipment, devices, or supplies at competitive prices</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 text-center">
              <Package className="w-10 h-10 text-brand-navy mx-auto mb-3" />
              <h3 className="font-bold text-lg text-brand-navy mb-2">Sellers</h3>
              <p className="text-gray-600 text-sm">Have medical products to sell and need qualified buyer connections</p>
            </div>
            <div className="bg-brand-navy p-6 rounded-xl shadow-lg text-center">
              <Users className="w-10 h-10 text-white mx-auto mb-3" />
              <h3 className="font-bold text-lg text-white mb-2">Referrers</h3>
              <p className="text-white/80 text-sm">Know someone in the medical industry who could benefit from our network</p>
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
              <p className="text-gray-600">Tell us about your medical sales needs and we'll connect you with the right resources.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Type */}
              <div>
                <Label className="text-brand-navy font-semibold mb-3 block">I am a... *</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "buyer", label: "Buyer" },
                    { id: "seller", label: "Seller" },
                    { id: "referrer", label: "Referrer" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData({ ...formData, roleType: id })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.roleType === id
                          ? "border-brand-red bg-brand-red/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      data-testid={`button-role-${id}`}
                    >
                      <span className={`font-medium ${formData.roleType === id ? "text-brand-red" : "text-gray-600"}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Category */}
              <div>
                <Label className="text-brand-navy font-semibold mb-3 block">Product Category *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "medical_devices", label: "Medical Devices" },
                    { id: "pharmaceuticals", label: "Pharmaceuticals" },
                    { id: "equipment", label: "Equipment" },
                    { id: "supplies", label: "Supplies" },
                    { id: "diagnostics", label: "Diagnostics" },
                    { id: "other", label: "Other" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData({ ...formData, productCategory: id })}
                      className={`p-3 rounded-lg border-2 transition-all text-sm ${
                        formData.productCategory === id
                          ? "border-brand-navy bg-brand-navy text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                      data-testid={`button-category-${id}`}
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
                <Label htmlFor="description" className="text-gray-700">Tell us more about your needs</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                  rows={4}
                  placeholder="Describe what you're looking for, specific products, quantities, timeline, etc."
                  data-testid="textarea-description"
                />
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold h-12 text-lg"
                data-testid="button-submit-medical-sales"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Inquiry"}
              </Button>

              <p className="text-center text-xs text-gray-500">
                Your information is secure and will only be used to connect you with relevant opportunities.
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
