import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, TrendingUp, Users, Shield, DollarSign } from "lucide-react";
import { useLocation } from "wouter";
import { useScrollToTopOnChange } from "@/hooks/use-scroll-to-top";
import { TCPAConsent } from "@/components/tcpa-consent";

export default function BecomeInvestor() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [tcpaConsent, setTcpaConsent] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    investmentInterest: "",
    investmentRange: "",
    message: "",
  });
  useScrollToTopOnChange(submitted);

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/investor-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit");
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Information Submitted!",
        description: "Our team will contact you to discuss investment opportunities.",
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.investmentInterest || !formData.investmentRange) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    if (!tcpaConsent) {
      toast({
        title: "Consent Required",
        description: "Please agree to the terms before submitting.",
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
            <h1 className="text-3xl sm:text-5xl font-display mb-4 sm:mb-6">Thank You!</h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
              We've received your investment inquiry. Our team will review your information 
              and reach out within 24-48 hours to discuss how you can partner with 
              NavigatorUSA.
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
          <h1 className="text-2xl sm:text-5xl font-display mb-4 sm:mb-6">Become an Investor</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto px-2">
            Partner with a Navy SEAL-operated organization dedicated to veteran success. 
            Invest in the future of veteran families while earning returns.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 max-w-5xl mx-auto mb-8 sm:mb-12">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <Shield className="h-8 w-8 sm:h-12 sm:w-12 text-brand-navy mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-brand-navy mb-1 sm:mb-2">Veteran-Led</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Navy SEAL-operated business with proven leadership</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <Users className="h-8 w-8 sm:h-12 sm:w-12 text-brand-red mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-brand-navy mb-1 sm:mb-2">Growing Network</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Established network of an active veteran community</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 text-brand-gold mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-brand-navy mb-1 sm:mb-2">Growth Potential</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Expanding platform with multiple revenue streams</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <DollarSign className="h-8 w-8 sm:h-12 sm:w-12 text-brand-navy mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-brand-navy mb-1 sm:mb-2">Impact Investment</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Make a difference while earning returns</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-navy mb-4 sm:mb-6 text-center">Investment Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    data-testid="input-first-name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    data-testid="input-last-name"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name (Optional)</Label>
                <Input 
                  id="companyName" 
                  placeholder="Your Investment Firm or Company"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  data-testid="input-company-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="investmentInterest">Investment Interest *</Label>
                <Select 
                  value={formData.investmentInterest} 
                  onValueChange={(value) => setFormData({ ...formData, investmentInterest: value })}
                >
                  <SelectTrigger data-testid="select-investment-interest">
                    <SelectValue placeholder="Select your interest area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platform_equity">Platform Equity Investment</SelectItem>
                    <SelectItem value="veteran_business_fund">Veteran Business Fund</SelectItem>
                    <SelectItem value="grant_program">Grant Program Sponsor</SelectItem>
                    <SelectItem value="real_estate">Veteran Real Estate Projects</SelectItem>
                    <SelectItem value="technology">Technology Development</SelectItem>
                    <SelectItem value="multiple">Multiple Areas</SelectItem>
                    <SelectItem value="other">Other / Open to Discussion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="investmentRange">Investment Range *</Label>
                <Select 
                  value={formData.investmentRange} 
                  onValueChange={(value) => setFormData({ ...formData, investmentRange: value })}
                >
                  <SelectTrigger data-testid="select-investment-range">
                    <SelectValue placeholder="Select investment range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_25k">Under $25,000</SelectItem>
                    <SelectItem value="25k_50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k_100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="100k_250k">$100,000 - $250,000</SelectItem>
                    <SelectItem value="250k_500k">$250,000 - $500,000</SelectItem>
                    <SelectItem value="500k_1m">$500,000 - $1,000,000</SelectItem>
                    <SelectItem value="over_1m">Over $1,000,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Additional Information (Optional)</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us about your investment experience, timeline, and any specific questions you have..."
                  className="min-h-[120px]"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  data-testid="input-message"
                />
              </div>
              <TCPAConsent checked={tcpaConsent} onCheckedChange={setTcpaConsent} />
              <Button 
                type="submit"
                className="w-full bg-brand-navy text-white font-bold h-12"
                disabled={submitMutation.isPending || !tcpaConsent}
                data-testid="button-submit-investor"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Investment Inquiry"}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Your information is confidential. We'll reach out within 24-48 hours to schedule a call.
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
