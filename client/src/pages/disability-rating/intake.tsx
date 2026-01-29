import { Layout } from "@/components/layout";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, DollarSign, Shield, ArrowRight, User, Phone, Mail, MapPin, FileCheck } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useScrollToTopOnChange } from "@/hooks/use-scroll-to-top";
import { TCPAConsent } from "@/components/tcpa-consent";

export default function DisabilityIntake() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [tcpaConsent, setTcpaConsent] = useState(false);
  useScrollToTopOnChange(submitted);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem("disabilityReferralCode", ref);
    } else {
      const stored = localStorage.getItem("disabilityReferralCode");
      if (stored) setReferralCode(stored);
    }
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    claimType: "",
    currentRating: "",
    soughtRating: "",
    conditions: "",
    militaryBranch: "",
    serviceYears: "",
    notes: "",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/disability-referrals", {
        ...data,
        referralCode,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      localStorage.removeItem("disabilityReferralCode");
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.claimType) {
      toast({
        title: "Required Field",
        description: "Please select a claim type.",
        variant: "destructive",
      });
      return;
    }
    if (!tcpaConsent) {
      toast({
        title: "Consent Required",
        description: "Please agree to the terms to continue.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-12">
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
              <h1 className="font-display text-4xl text-white mb-4">THANK YOU!</h1>
              <p className="text-xl text-gray-300 mb-4">
                Your information has been received. One of our partners may contact you 
                within 24-48 hours to discuss your disability claim options and determine if you may be eligible for assistance.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                You may opt out at any time by replying STOP to texts or clicking unsubscribe in emails.
              </p>
              <div className="bg-white/10 rounded-lg p-6 mb-8">
                <h3 className="font-display text-lg text-white mb-2">WHAT HAPPENS NEXT?</h3>
                <ul className="text-gray-300 text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 text-brand-red mt-0.5 flex-shrink-0" />
                    A specialist will review your case details
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 text-brand-red mt-0.5 flex-shrink-0" />
                    You'll receive a call to discuss your options
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 text-brand-red mt-0.5 flex-shrink-0" />
                    There is NO cost or obligation to you
                  </li>
                </ul>
              </div>
              <Button 
                onClick={() => navigate("/")} 
                className="bg-brand-red hover:bg-brand-red/90 text-white"
                data-testid="button-return-home"
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800">
        <div className="bg-gradient-to-r from-green-600 to-green-700 py-6 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <DollarSign className="w-8 h-8 text-white" />
              <h2 className="font-display text-2xl md:text-3xl text-white">NO UPFRONT FEES - EVER</h2>
            </div>
            <p className="text-white/90 text-lg max-w-3xl mx-auto">
              None of our attorneys or consulting companies charge upfront, if at all. 
              You only benefit - there's no cost to you.
            </p>
          </div>
        </div>

        <div className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-brand-red/20 px-4 py-2 rounded-full mb-4">
                <FileText className="w-5 h-5 text-brand-red" />
                <span className="text-brand-red font-bold uppercase tracking-wider text-sm">VA Disability Assistance</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
                GET STARTED TODAY
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Complete this form and our expert partners will reach out to help you 
                navigate the VA disability claim process at no cost to you.
              </p>
              {referralCode && (
                <p className="text-sm text-green-400 mt-4">
                  Referred by affiliate: {referralCode}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <Card className="bg-white/10 border-white/20 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5" /> Personal Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Tell us about yourself so we can assist you
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">First Name *</Label>
                    <Input
                      data-testid="input-first-name"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      placeholder="John"
                      required
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Last Name *</Label>
                    <Input
                      data-testid="input-last-name"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      placeholder="Doe"
                      required
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Email *</Label>
                    <Input
                      data-testid="input-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="john@example.com"
                      required
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Phone *</Label>
                    <Input
                      data-testid="input-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">City</Label>
                    <Input
                      data-testid="input-city"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="Your City"
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">State</Label>
                    <Input
                      data-testid="input-state"
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      placeholder="CA"
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Military Service
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your service information
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Branch of Service</Label>
                    <Select value={formData.militaryBranch} onValueChange={(v) => handleChange("militaryBranch", v)}>
                      <SelectTrigger data-testid="select-branch" className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="army">Army</SelectItem>
                        <SelectItem value="navy">Navy</SelectItem>
                        <SelectItem value="air_force">Air Force</SelectItem>
                        <SelectItem value="marines">Marines</SelectItem>
                        <SelectItem value="coast_guard">Coast Guard</SelectItem>
                        <SelectItem value="space_force">Space Force</SelectItem>
                        <SelectItem value="national_guard">National Guard</SelectItem>
                        <SelectItem value="reserves">Reserves</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Years of Service</Label>
                    <Input
                      data-testid="input-service-years"
                      value={formData.serviceYears}
                      onChange={(e) => handleChange("serviceYears", e.target.value)}
                      placeholder="e.g., 2010-2018"
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5" /> Claim Details
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Information about your disability claim
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-white">Type of Claim *</Label>
                    <Select value={formData.claimType} onValueChange={(v) => handleChange("claimType", v)}>
                      <SelectTrigger data-testid="select-claim-type" className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Select Claim Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="initial">Initial VA Disability Claim</SelectItem>
                        <SelectItem value="increase">Rating Increase</SelectItem>
                        <SelectItem value="denial">Denied Claim Appeal</SelectItem>
                        <SelectItem value="ssdi">SSDI Application</SelectItem>
                        <SelectItem value="widow">Widow/Widower Benefits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Current VA Rating (if any)</Label>
                    <Select value={formData.currentRating} onValueChange={(v) => handleChange("currentRating", v)}>
                      <SelectTrigger data-testid="select-current-rating" className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Select Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Rating Yet</SelectItem>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="30">30%</SelectItem>
                        <SelectItem value="40">40%</SelectItem>
                        <SelectItem value="50">50%</SelectItem>
                        <SelectItem value="60">60%</SelectItem>
                        <SelectItem value="70">70%</SelectItem>
                        <SelectItem value="80">80%</SelectItem>
                        <SelectItem value="90">90%</SelectItem>
                        <SelectItem value="100">100%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Sought Rating</Label>
                    <Select value={formData.soughtRating} onValueChange={(v) => handleChange("soughtRating", v)}>
                      <SelectTrigger data-testid="select-sought-rating" className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Goal Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Improvement</SelectItem>
                        <SelectItem value="30">30% or higher</SelectItem>
                        <SelectItem value="50">50% or higher</SelectItem>
                        <SelectItem value="70">70% or higher</SelectItem>
                        <SelectItem value="100">100%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-white">Conditions / Disabilities</Label>
                    <Textarea
                      data-testid="input-conditions"
                      value={formData.conditions}
                      onChange={(e) => handleChange("conditions", e.target.value)}
                      placeholder="List any service-connected conditions (PTSD, back injury, hearing loss, etc.)"
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-white">Additional Notes</Label>
                    <Textarea
                      data-testid="input-notes"
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      placeholder="Anything else you'd like us to know about your situation..."
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur">
                <CardContent className="pt-6">
                  <TCPAConsent checked={tcpaConsent} onCheckedChange={setTcpaConsent} />
                </CardContent>
              </Card>

              <div className="text-center">
                <Button
                  type="submit"
                  disabled={submitMutation.isPending || !tcpaConsent}
                  className="bg-brand-red hover:bg-brand-red/90 text-white text-lg px-12 py-6 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-submit-intake"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit My Information"}
                </Button>
                <p className="text-gray-400 text-sm mt-4">
                  Your information is secure and will only be shared with our vetted partners.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
