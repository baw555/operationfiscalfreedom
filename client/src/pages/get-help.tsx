import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Shield, Clock, HeartHandshake, Users } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useScrollToTopOnChange } from "@/hooks/use-scroll-to-top";
import { TCPAConsent } from "@/components/tcpa-consent";
import { logConsent } from "@/lib/consent-logger";

const helpTypes = [
  { value: "disability_denial", label: "Disability Rating Denial" },
  { value: "appeal", label: "VA Claim Appeal" },
  { value: "low_rating", label: "Low VA Rating" },
  { value: "exam_issues", label: "C&P Exam Issues" },
  { value: "service_connection", label: "Service-Connection Dispute" },
  { value: "other", label: "Other" },
];

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export default function GetHelp() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [tcpaConsent, setTcpaConsent] = useState(false);
  useScrollToTopOnChange(submitted);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    helpType: "",
    otherHelpType: "",
    description: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refFromUrl = params.get('ref');
    
    if (refFromUrl) {
      setCookie('nav_ref', refFromUrl, 30);
      setReferralCode(refFromUrl);
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      const savedRef = getCookie('nav_ref');
      if (savedRef) {
        setReferralCode(savedRef);
      }
    }
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData & { referralCode?: string | null }) => {
      const response = await fetch("/api/help-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, referralCode }),
      });
      if (!response.ok) throw new Error("Failed to submit request");
      return response.json();
    },
    onSuccess: async (result) => {
      await logConsent({
        submissionType: "help_request",
        submissionId: result.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      setSubmitted(true);
      toast({
        title: "Request Received",
        description: "A veteran advocate may contact you regarding your case. You may opt out of communications at any time by replying STOP to texts or clicking unsubscribe in emails.",
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
    if (!formData.name || !formData.phone || !formData.email || !formData.helpType || !formData.description) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    if (formData.helpType === "other" && !formData.otherHelpType) {
      toast({
        title: "Missing Fields",
        description: "Please specify what type of help you need.",
        variant: "destructive",
      });
      return;
    }
    if (!tcpaConsent) {
      toast({
        title: "Consent Required",
        description: "Please agree to the terms and consent to be contacted.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate({ ...formData, referralCode });
  };

  if (submitted) {
    return (
      <Layout>
        <section className="bg-brand-navy text-white py-12 sm:py-20 text-center">
          <div className="container mx-auto px-4">
            <CheckCircle className="h-14 w-14 sm:h-20 sm:w-20 text-brand-red mx-auto mb-4 sm:mb-6" />
            <h1 className="text-3xl sm:text-5xl font-display mb-4 sm:mb-6">Help Request Received</h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
              Your request has been submitted. One of our veteran advocates may review your case and 
              contact you within 24-48 hours. You may be eligible for assistance with your VA claim. You may opt out of communications at any time by replying STOP to texts or clicking unsubscribe in emails.
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
      {/* Patriotic Banner */}
      <div className="h-2 bg-gradient-to-r from-brand-red via-white to-brand-navy"></div>
      
      <section className="bg-gradient-to-br from-brand-red via-brand-navy to-brand-navy text-white py-12 sm:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-2xl sm:text-5xl font-display mb-4 sm:mb-6">Free VA Rating Assistance</h1>
          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto px-2">
            Struggling with your disability rating or VA claim? Our veteran advocates are here to help you 
            navigate the system and may help you access benefits you may be eligible for - at no cost to you.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="bg-brand-red p-4 sm:p-6 rounded-xl shadow-md text-center">
              <Shield className="h-8 w-8 sm:h-12 sm:w-12 text-white mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-white mb-1 sm:mb-2">Expert Guidance</h3>
              <p className="text-white/80 text-xs sm:text-sm">Veterans helping veterans navigate the VA system</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center border-2 border-brand-navy/20">
              <Clock className="h-8 w-8 sm:h-12 sm:w-12 text-brand-navy mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-brand-navy mb-1 sm:mb-2">Fast Response</h3>
              <p className="text-brand-navy/70 text-xs sm:text-sm">Get a response within 24-48 hours</p>
            </div>
            <div className="bg-brand-navy p-4 sm:p-6 rounded-xl shadow-md text-center">
              <HeartHandshake className="h-8 w-8 sm:h-12 sm:w-12 text-white mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-white mb-1 sm:mb-2">100% Free</h3>
              <p className="text-white/80 text-xs sm:text-sm">No cost for assistance - ever</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-navy mb-4 sm:mb-6 text-center">Request Free Assistance</h2>
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
                <Label htmlFor="helpType">Type of Help Needed *</Label>
                <select 
                  id="helpType"
                  className="w-full h-10 rounded-md border border-gray-300 bg-white text-brand-navy px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                  value={formData.helpType}
                  onChange={(e) => setFormData({ ...formData, helpType: e.target.value })}
                  data-testid="select-help-type"
                  required
                >
                  <option value="">Select an option...</option>
                  {helpTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              {formData.helpType === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="otherHelpType">Please Specify *</Label>
                  <Input 
                    id="otherHelpType" 
                    placeholder="Describe the type of help you need"
                    value={formData.otherHelpType}
                    onChange={(e) => setFormData({ ...formData, otherHelpType: e.target.value })}
                    data-testid="input-other-help-type"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="description">Describe Your Situation *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Please provide details about your VA claim or disability rating issue. Include any relevant information like current rating, denial reasons, or specific concerns..."
                  className="min-h-[150px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  data-testid="input-description"
                  required
                />
              </div>
              <TCPAConsent 
                checked={tcpaConsent} 
                onCheckedChange={setTcpaConsent} 
              />
              <Button 
                type="submit"
                className="w-full bg-brand-navy text-white font-bold h-12"
                disabled={submitMutation.isPending || !tcpaConsent}
                data-testid="button-submit-request"
              >
                {submitMutation.isPending ? "Submitting..." : "Get Free Help Now"}
              </Button>
            </form>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Want to help fellow veterans?</p>
            <Link href="/affiliate">
              <Button variant="outline" className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white">
                <Users className="w-4 h-4 mr-2" />
                Become an Affiliate
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
