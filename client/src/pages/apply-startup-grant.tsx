import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Banknote, CheckCircle, DollarSign, Rocket, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useScrollToTopOnChange } from "@/hooks/use-scroll-to-top";
import { TCPAConsent } from "@/components/tcpa-consent";
import { logConsent } from "@/lib/consent-logger";

export default function ApplyStartupGrant() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [tcpaConsent, setTcpaConsent] = useState(false);
  useScrollToTopOnChange(submitted);
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
    onSuccess: async (result) => {
      await logConsent({
        submissionType: "startup_grant",
        submissionId: result.id,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
      });
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We'll review your grant application and contact you soon. You may opt out at any time by replying STOP to texts or clicking unsubscribe in emails.",
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
    
    const required = ['firstName', 'lastName', 'email', 'phone', 'branch', 'serviceStatus', 'businessName', 'industry', 'businessDescription', 'fundingNeeds', 'grantAmount'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!agreed) {
      toast({
        title: "Certification Required",
        description: "Please certify your veteran status.",
        variant: "destructive",
      });
      return;
    }

    if (!tcpaConsent) {
      toast({
        title: "Consent Required",
        description: "Please agree to the TCPA consent to continue.",
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
            <h1 className="text-3xl sm:text-5xl font-display mb-4 sm:mb-6" data-testid="text-success-title">Grant Application Received!</h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-2" data-testid="text-success-message">
              Thank you for applying for our Veteran Business Startup Grant. You may be eligible for funding assistance. Our team will review your application 
              and contact you within 3-5 business days to discuss next steps. You may opt out at any time by replying STOP to texts or clicking unsubscribe in emails.
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
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-silver/20 border border-brand-silver/40 text-white mb-4 sm:mb-6">
            <Banknote className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">Veteran Startup Grant Program</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-display mb-4 sm:mb-6" data-testid="text-page-title">Apply for Business Startup Grant</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto px-2" data-testid="text-page-description">
            We provide funding assistance to help veteran-owned startups get off the ground. Apply below to be considered for our grant program.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <DollarSign className="h-8 w-8 sm:h-12 sm:w-12 text-brand-red mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-brand-navy mb-1 sm:mb-2">Seed Funding</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Grants up to $50,000 for qualifying businesses</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <Rocket className="h-8 w-8 sm:h-12 sm:w-12 text-brand-navy mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-brand-navy mb-1 sm:mb-2">No Repayment</h3>
              <p className="text-gray-600 text-xs sm:text-sm">This is a grant, not a loan — no repayment required</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 text-brand-gold mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-brand-navy mb-1 sm:mb-2">Mentorship</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Access to business mentors and resources</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white p-4 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200">
            <div className="mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4">Startup Grant Application</h2>
              <p className="text-sm sm:text-base text-gray-600">
                Complete the form below to apply for our veteran business startup grant. All fields are required.
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
                  <Label htmlFor="branch">Branch of Service *</Label>
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Service Status *</Label>
                  <Select value={formData.serviceStatus} onValueChange={(v) => setFormData({ ...formData, serviceStatus: v })}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veteran">Veteran</SelectItem>
                      <SelectItem value="active">Active Duty</SelectItem>
                      <SelectItem value="reserve">Reserve / Guard</SelectItem>
                      <SelectItem value="spouse">Military Spouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Proposed Business Name *</Label>
                <Input 
                  id="businessName" 
                  placeholder="e.g. Tactical Logistics Solutions"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  data-testid="input-business-name"
                />
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

              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description *</Label>
                <Textarea 
                  id="businessDescription" 
                  placeholder="Describe your business idea, your target market, and what makes it unique..." 
                  className="min-h-[150px]"
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                  data-testid="input-business-description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundingNeeds">How Will You Use the Grant Funds? *</Label>
                <Textarea 
                  id="fundingNeeds" 
                  placeholder="Describe specifically how the grant funds will be used (e.g., equipment, inventory, marketing, licenses...)" 
                  className="min-h-[100px]"
                  value={formData.fundingNeeds}
                  onChange={(e) => setFormData({ ...formData, fundingNeeds: e.target.value })}
                  data-testid="input-funding-needs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grantAmount">Requested Grant Amount *</Label>
                <Select value={formData.grantAmount} onValueChange={(v) => setFormData({ ...formData, grantAmount: v })}>
                  <SelectTrigger data-testid="select-grant-amount">
                    <SelectValue placeholder="Select Amount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5000">$5,000</SelectItem>
                    <SelectItem value="10000">$10,000</SelectItem>
                    <SelectItem value="25000">$25,000</SelectItem>
                    <SelectItem value="35000">$35,000</SelectItem>
                    <SelectItem value="50000">$50,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-brand-red/5 border border-brand-green/20 p-6 rounded-lg space-y-4">
                <h3 className="font-bold text-brand-navy flex items-center gap-2">
                  <CheckCircle className="text-brand-red w-5 h-5" />
                  What's Included in the Grant Program:
                </h3>
                <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-red" /> Direct Financial Support</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-red" /> Business Mentorship</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-red" /> Networking Opportunities</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-red" /> Resource Library Access</li>
                </ul>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  data-testid="checkbox-terms"
                />
                <Label htmlFor="terms" className="text-sm font-normal text-gray-600 leading-tight">
                  I certify that I am a U.S. military veteran, active service member, or military spouse and that this business is/will be at least 51% veteran-owned.
                </Label>
              </div>

              <TCPAConsent checked={tcpaConsent} onCheckedChange={setTcpaConsent} />

              <Button 
                type="submit"
                className="w-full bg-brand-red hover:bg-brand-red/90 text-brand-navy font-bold h-14 text-lg shadow-lg"
                disabled={submitMutation.isPending || !tcpaConsent}
                data-testid="button-submit-application"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Grant Application"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
