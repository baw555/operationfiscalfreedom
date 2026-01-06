import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { TrendingUp, CheckCircle, Handshake, PiggyBank, Target } from "lucide-react";
import { useLocation } from "wouter";

export default function Investors() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    branch: "",
    serviceStatus: "",
    businessName: "",
    industry: "",
    businessDescription: "",
    fundingNeeds: "",
    grantAmount: "",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/startup-grants", {
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
        description: "An investor will review your pitch and reach out soon.",
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
    
    const required = ['firstName', 'lastName', 'email', 'phone', 'businessName', 'businessDescription', 'fundingNeeds', 'grantAmount'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
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
        <section className="bg-brand-navy text-white py-12 sm:py-20 text-center">
          <div className="container mx-auto px-4">
            <CheckCircle className="h-14 w-14 sm:h-20 sm:w-20 text-brand-red mx-auto mb-4 sm:mb-6" />
            <h1 className="text-3xl sm:text-5xl font-display mb-4 sm:mb-6" data-testid="text-success-title">Investor Pitch Received!</h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-2" data-testid="text-success-message">
              Thank you for submitting your business pitch. Our investor network will review your proposal 
              and reach out if there's interest. This typically takes 5-7 business days.
            </p>
            <Button 
              onClick={() => setLocation("/")}
              className="bg-brand-red hover:bg-brand-red/90 text-white font-bold px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-lg"
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
      <section className="bg-brand-navy text-white py-12 sm:py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 border border-white/20 text-white mb-4 sm:mb-6">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">Investor Network</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-display mb-4 sm:mb-6" data-testid="text-page-title">Connect With Investors</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto px-2" data-testid="text-page-description">
            For those who do not qualify for grants, investors may make offers. Submit your business pitch to our investor network.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <Handshake className="h-8 w-8 sm:h-12 sm:w-12 text-brand-navy mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-brand-navy mb-1 sm:mb-2">Direct Access</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Connect directly with investors interested in veteran businesses</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <PiggyBank className="h-8 w-8 sm:h-12 sm:w-12 text-brand-red mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-brand-navy mb-1 sm:mb-2">Flexible Funding</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Various investment options from equity to revenue-share</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <Target className="h-8 w-8 sm:h-12 sm:w-12 text-brand-gold mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-brand-navy mb-1 sm:mb-2">Veteran-Focused</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Investors specifically looking to support veteran ventures</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white p-4 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200">
            <div className="mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4">Submit Your Business Pitch</h2>
              <p className="text-sm sm:text-base text-gray-600">
                Complete the form below to submit your business to our investor network. Investors will review and reach out directly if interested.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    data-testid="input-first-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch of Service (if applicable)</Label>
                  <Select value={formData.branch} onValueChange={(v) => setFormData({ ...formData, branch: v })}>
                    <SelectTrigger data-testid="select-branch">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="army">Army</SelectItem>
                      <SelectItem value="navy">Navy</SelectItem>
                      <SelectItem value="marines">Marines</SelectItem>
                      <SelectItem value="air-force">Air Force</SelectItem>
                      <SelectItem value="coast-guard">Coast Guard</SelectItem>
                      <SelectItem value="space-force">Space Force</SelectItem>
                      <SelectItem value="none">Not a Veteran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(v) => setFormData({ ...formData, industry: v })}>
                    <SelectTrigger data-testid="select-industry">
                      <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="services">Professional Services</SelectItem>
                      <SelectItem value="retail">Retail / E-commerce</SelectItem>
                      <SelectItem value="construction">Construction / Trades</SelectItem>
                      <SelectItem value="tech">Technology / Software</SelectItem>
                      <SelectItem value="logistics">Logistics / Transport</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input 
                  id="businessName" 
                  placeholder="e.g. Tactical Logistics Solutions"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  data-testid="input-business-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description & Value Proposition *</Label>
                <Textarea 
                  id="businessDescription" 
                  placeholder="Describe your business, your target market, competitive advantage, and why investors should be interested..." 
                  className="min-h-[150px]"
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                  data-testid="input-business-description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundingNeeds">How Will Investment Funds Be Used? *</Label>
                <Textarea 
                  id="fundingNeeds" 
                  placeholder="Describe your funding needs and how investment will accelerate your business growth..." 
                  className="min-h-[100px]"
                  value={formData.fundingNeeds}
                  onChange={(e) => setFormData({ ...formData, fundingNeeds: e.target.value })}
                  data-testid="input-funding-needs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grantAmount">Investment Amount Seeking *</Label>
                <Select value={formData.grantAmount} onValueChange={(v) => setFormData({ ...formData, grantAmount: v })}>
                  <SelectTrigger data-testid="select-investment-amount">
                    <SelectValue placeholder="Select Amount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25000">$25,000 - $50,000</SelectItem>
                    <SelectItem value="75000">$50,000 - $100,000</SelectItem>
                    <SelectItem value="150000">$100,000 - $250,000</SelectItem>
                    <SelectItem value="500000">$250,000 - $500,000</SelectItem>
                    <SelectItem value="1000000">$500,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-brand-navy/5 border border-brand-navy/20 p-6 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> By submitting this form, you agree to have your business information shared with our network of investors. 
                  Investors will reach out directly if interested. There is no guarantee of funding.
                </p>
              </div>

              <Button 
                type="submit"
                className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white font-bold h-14 text-lg shadow-lg"
                disabled={submitMutation.isPending}
                data-testid="button-submit-pitch"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit to Investors"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
