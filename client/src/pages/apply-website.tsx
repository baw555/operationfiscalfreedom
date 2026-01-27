import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Rocket, CheckCircle2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useScrollToTopOnChange } from "@/hooks/use-scroll-to-top";

export default function ApplyWebsite() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [certified, setCertified] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    branch: "",
    serviceStatus: "",
    businessName: "",
    industry: "",
    description: "",
    websiteNeeds: "",
  });
  useScrollToTopOnChange(submitted);

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/website-applications", {
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
        description: "We'll review your application and get back to you within 24-48 hours.",
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.branch || !formData.serviceStatus || !formData.businessName || !formData.industry || !formData.description) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    if (!certified) {
      toast({
        title: "Certification Required",
        description: "Please certify that you are a veteran or active service member.",
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
            <h1 className="text-3xl sm:text-5xl font-display mb-4 sm:mb-6">Application Received!</h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
              Thank you for applying for our free website grant! Our team will review your application 
              and contact you within 24-48 hours. Approved websites are typically delivered within 24 hours of approval.
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold mb-6">
            <Rocket className="w-4 h-4" />
            <span className="font-bold text-sm uppercase tracking-wider">Veteran Entrepreneurship Program</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-display mb-4 sm:mb-6">Launch Your Veteran-Owned Business</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto px-2">
            We build fully functional, professional websites for veteran-owned startups — completely free of charge. Apply below to get started.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white p-4 sm:p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
            <div className="mb-8 sm:mb-10">
              <div className="bg-brand-red/10 border border-brand-red/20 p-4 rounded-lg text-center mb-6 sm:mb-8">
                 <p className="text-brand-red font-bold italic uppercase text-base sm:text-lg">
                    "Get a fully functional website like this one completed within 24 hours of approval"
                  </p>
              </div>
              <h2 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4">Business Application</h2>
              <p className="text-sm sm:text-base text-gray-600">
                Tell us about your business idea. We select promising veteran-led ventures to support with free technical infrastructure.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Jane" 
                    data-testid="input-first-name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    data-testid="input-last-name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="jane@example.com" 
                    data-testid="input-email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="(555) 123-4567" 
                    data-testid="input-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch of Service *</Label>
                  <Select 
                    value={formData.branch} 
                    onValueChange={(value) => setFormData({ ...formData, branch: value })}
                  >
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
                  <Select 
                    value={formData.serviceStatus} 
                    onValueChange={(value) => setFormData({ ...formData, serviceStatus: value })}
                  >
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
                  data-testid="input-business-name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select 
                  value={formData.industry} 
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger data-testid="select-industry">
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="services">Professional Services</SelectItem>
                    <SelectItem value="retail">Retail / E-commerce</SelectItem>
                    <SelectItem value="construction">Construction / Trades</SelectItem>
                    <SelectItem value="tech">Technology / Software</SelectItem>
                    <SelectItem value="logistics">Logistics / Transport</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your business idea, your target market, and what makes it unique..." 
                  className="min-h-[120px] sm:min-h-[150px]"
                  data-testid="textarea-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="needs">Website Needs (Optional)</Label>
                <Textarea 
                  id="needs" 
                  placeholder="What features do you need? (e.g. Booking system, Online store, Portfolio, Blog...)" 
                  className="min-h-[80px] sm:min-h-[100px]"
                  data-testid="textarea-needs"
                  value={formData.websiteNeeds}
                  onChange={(e) => setFormData({ ...formData, websiteNeeds: e.target.value })}
                />
              </div>

              <div className="bg-brand-red/5 border border-brand-green/20 p-4 sm:p-6 rounded-lg space-y-4">
                <h3 className="font-bold text-brand-navy flex items-center gap-2">
                  <CheckCircle2 className="text-brand-red w-5 h-5" />
                  What's Included in the Grant:
                </h3>
                <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-red" /> Custom Design & Development</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-red" /> Mobile Responsive Layout</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-red" /> SEO Optimization Setup</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-red" /> Hosting & Domain Setup Help</li>
                </ul>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={certified}
                  onCheckedChange={(checked) => setCertified(checked as boolean)}
                  data-testid="checkbox-certification"
                />
                <Label htmlFor="terms" className="text-sm font-normal text-gray-600 leading-tight">
                  I certify that I am a U.S. military veteran or active service member and that this business is/will be at least 51% veteran-owned.
                </Label>
              </div>

              <Button 
                type="submit"
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black font-bold h-12 sm:h-14 text-base sm:text-lg shadow-lg"
                data-testid="button-submit-application"
                disabled={submitMutation.isPending}
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
