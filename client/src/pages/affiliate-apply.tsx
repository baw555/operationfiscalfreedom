import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Users, DollarSign, Rocket } from "lucide-react";
import { useLocation } from "wouter";

export default function AffiliateApply() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    phone: "",
    email: "",
    description: "",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/affiliate-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit application");
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.companyName || !formData.phone || !formData.email || !formData.description) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate(formData);
  };

  if (submitted) {
    return (
      <Layout>
        <section className="bg-brand-navy text-white py-20 text-center">
          <div className="container mx-auto px-4">
            <CheckCircle className="h-20 w-20 text-brand-green mx-auto mb-6" />
            <h1 className="text-5xl font-display mb-6">Application Received!</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Thank you for your interest in becoming an Operation Fiscal Freedom affiliate. 
              Our team will review your application and contact you within 24-48 hours.
            </p>
            <Button 
              onClick={() => setLocation("/")}
              className="bg-brand-green hover:bg-brand-green/90 text-white font-bold px-8 py-6 text-lg"
              data-testid="button-return-home"
            >
              Return to Home
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-brand-navy text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-display mb-6">Become an Affiliate Partner</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join our network of veteran advocates helping fellow service members achieve financial freedom.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Users className="h-12 w-12 text-brand-navy mx-auto mb-4" />
              <h3 className="font-display text-xl text-brand-navy mb-2">Access Network</h3>
              <p className="text-gray-600 text-sm">Connect with 150,000+ veterans in our community</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <DollarSign className="h-12 w-12 text-brand-green mx-auto mb-4" />
              <h3 className="font-display text-xl text-brand-navy mb-2">Earn Commission</h3>
              <p className="text-gray-600 text-sm">Competitive rates for veteran referrals</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Rocket className="h-12 w-12 text-brand-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-brand-navy mb-2">Grow Together</h3>
              <p className="text-gray-600 text-sm">Training, resources, and support provided</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="font-display text-3xl text-brand-navy mb-6 text-center">Affiliate Application</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name" 
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="input-name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input 
                  id="companyName" 
                  placeholder="Your Business LLC"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  data-testid="input-company-name"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    data-testid="input-phone"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-email"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Describe Everything You Need *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Tell us about your business, your experience with veterans, and how you'd like to partner with us..."
                  className="min-h-[150px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  data-testid="input-description"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-brand-navy text-white font-bold h-12"
                disabled={submitMutation.isPending}
                data-testid="button-submit-application"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
