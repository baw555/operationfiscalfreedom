import { Layout } from "@/components/layout";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TCPAConsent } from "@/components/tcpa-consent";
import { Briefcase, Building2, CheckCircle, ArrowRight, Users, Star, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useScrollToTopOnChange } from "@/hooks/use-scroll-to-top";

const INDUSTRIES = [
  { id: "healthcare", label: "Healthcare & Medical" },
  { id: "technology", label: "Technology & IT" },
  { id: "construction", label: "Construction & Trades" },
  { id: "logistics", label: "Logistics & Transportation" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "security", label: "Security & Defense" },
  { id: "finance", label: "Finance & Banking" },
  { id: "insurance", label: "Insurance" },
  { id: "real_estate", label: "Real Estate" },
  { id: "retail", label: "Retail & Sales" },
  { id: "hospitality", label: "Hospitality & Food Service" },
  { id: "education", label: "Education & Training" },
  { id: "government", label: "Government & Public Sector" },
  { id: "nonprofit", label: "Non-Profit Organizations" },
  { id: "legal", label: "Legal Services" },
  { id: "marketing", label: "Marketing & Advertising" },
  { id: "energy", label: "Energy & Utilities" },
  { id: "agriculture", label: "Agriculture & Farming" },
];

const VETERAN_SERVICES = [
  { id: "va_disability", label: "VA Disability Rating Assistance" },
  { id: "ssdi", label: "SSDI Assistance" },
  { id: "private_doctor", label: "Private Doctor Referrals" },
  { id: "furniture", label: "Furniture Assistance ($3K-$10K)" },
  { id: "website_grant", label: "Free Website Grants" },
  { id: "startup_funding", label: "Startup Funding Grants (Up to $50K)" },
  { id: "investor_connections", label: "Investor Connections" },
  { id: "job_placement", label: "Job Placement Network" },
  { id: "insurance_savings", label: "Save 20-40% on All Insurances*" },
  { id: "merchant_services", label: "Merchant Services" },
  { id: "tax_services", label: "Tax Services" },
  { id: "payroll_services", label: "Payroll Services" },
];

export default function JobPlacement() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [intakeType, setIntakeType] = useState<"job_seeker" | "business_referral" | "business_services">("job_seeker");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [referralCode, setReferralCode] = useState<string>("");
  const [tcpaConsent, setTcpaConsent] = useState(false);
  useScrollToTopOnChange(submitted);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref") || localStorage.getItem("referralCode") || "";
    setReferralCode(refCode);
    if (refCode && !localStorage.getItem("referralCode")) {
      localStorage.setItem("referralCode", refCode);
    }
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/job-placement-intakes", data);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We'll be in touch with opportunities soon. You may opt out at any time by replying STOP to texts or clicking unsubscribe in emails.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (intakeType === "business_services") {
      if (selectedServices.length === 0) {
        toast({
          title: "Select Services",
          description: "Please select at least one service you're interested in.",
          variant: "destructive",
        });
        return;
      }
    } else if (selectedIndustries.length === 0) {
      toast({
        title: "Select Industries",
        description: "Please select at least one industry you're interested in.",
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

    const data = {
      intakeType,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      isVeteran: formData.get("isVeteran") as string,
      branchOfService: formData.get("branchOfService") as string,
      industriesSelected: intakeType === "business_services" ? JSON.stringify(selectedServices) : JSON.stringify(selectedIndustries),
      businessName: formData.get("businessName") as string,
      businessType: formData.get("businessType") as string,
      businessWebsite: formData.get("businessWebsite") as string,
      hiringNeeds: formData.get("hiringNeeds") as string,
      experience: formData.get("experience") as string,
      preferredLocation: formData.get("preferredLocation") as string,
      additionalNotes: formData.get("additionalNotes") as string,
      referralCode: referralCode || null,
    };

    submitMutation.mutate(data);
  };

  const toggleIndustry = (industryId: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industryId)
        ? prev.filter((id) => id !== industryId)
        : [...prev, industryId]
    );
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 max-w-lg text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 data-testid="text-success-title" className="font-display text-3xl text-white mb-4">APPLICATION SUBMITTED!</h1>
            <p data-testid="text-success-message" className="text-gray-300 mb-6">
              {intakeType === "job_seeker" 
                ? "Thank you for your interest in job placement. You may be eligible for opportunities in your selected industries. We'll review your application and be in touch. You may opt out at any time by replying STOP to texts or clicking unsubscribe in emails."
                : intakeType === "business_referral"
                ? "Thank you for referring your business! We'll be in touch to discuss how we may be able to help with your hiring needs. You may opt out at any time by replying STOP to texts or clicking unsubscribe in emails."
                : "Thank you for your interest in our veteran services! We'll be in touch to discuss how we may be able to help your business. You may opt out at any time by replying STOP to texts or clicking unsubscribe in emails."
              }
            </p>
            <a href="/" className="inline-block">
              <Button data-testid="button-return-home" className="bg-brand-red hover:bg-brand-red/90 text-white">
                Return Home
              </Button>
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Patriotic Banner */}
      <div className="h-2 bg-gradient-to-r from-brand-red via-white to-brand-navy"></div>
      
      <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-red to-brand-navy">
        {/* Hero Section */}
        <div className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Briefcase className="w-5 h-5 text-white" />
              <span className="text-white font-bold uppercase tracking-wider text-sm">Career Opportunities</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              JOB PLACEMENT NETWORK
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Connect with veteran-friendly employers across multiple industries. 
              Whether you're looking for your next career move or want to refer your business to hire veterans.
            </p>
          </div>
        </div>

        {/* Type Selection */}
        <div className="py-8 px-4 bg-brand-navy">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-2xl text-white text-center mb-8">HOW CAN WE HELP YOU?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                data-testid="button-job-seeker"
                onClick={() => setIntakeType("job_seeker")}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  intakeType === "job_seeker"
                    ? "border-white bg-brand-red"
                    : "border-white/20 bg-brand-red/80 hover:border-white/40"
                }`}
              >
                <Users className="w-10 h-10 text-white mb-4" />
                <h3 className="font-display text-xl text-white mb-2">I'M LOOKING FOR A JOB</h3>
                <p className="text-white/80 text-sm">
                  Find opportunities in industries that match your skills and experience.
                </p>
              </button>
              
              <button
                data-testid="button-business-referral"
                onClick={() => setIntakeType("business_referral")}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  intakeType === "business_referral"
                    ? "border-brand-navy bg-white"
                    : "border-gray-200 bg-white/90 hover:border-brand-navy"
                }`}
              >
                <Building2 className={`w-10 h-10 mb-4 ${intakeType === "business_referral" ? "text-brand-navy" : "text-brand-navy/70"}`} />
                <h3 className="font-display text-xl text-brand-navy mb-2">I WANT TO REFER MY BUSINESS</h3>
                <p className="text-brand-navy/70 text-sm">
                  Connect your business with our network to hire qualified veterans.
                </p>
              </button>

              <button
                data-testid="button-business-services"
                onClick={() => setIntakeType("business_services")}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  intakeType === "business_services"
                    ? "border-white bg-brand-navy"
                    : "border-white/20 bg-brand-navy/80 hover:border-white/40"
                }`}
              >
                <Shield className="w-10 h-10 text-white mb-4" />
                <h3 className="font-display text-xl text-white mb-2">I WANT TO UTILIZE VETERAN SERVICES</h3>
                <p className="text-white/80 text-sm">
                  Access our full suite of veteran-focused services for your business.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal/Contact Info */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                <h3 className="font-display text-xl text-white mb-6">
                  {intakeType === "job_seeker" ? "YOUR INFORMATION" : "CONTACT INFORMATION"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-white">First Name *</Label>
                    <Input
                      data-testid="input-firstName"
                      id="firstName"
                      name="firstName"
                      required
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                    <Input
                      data-testid="input-lastName"
                      id="lastName"
                      name="lastName"
                      required
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">Email *</Label>
                    <Input
                      data-testid="input-email"
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">Phone *</Label>
                    <Input
                      data-testid="input-phone"
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {intakeType === "job_seeker" && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-white mb-3 block">Are you a veteran?</Label>
                      <RadioGroup defaultValue="yes" name="isVeteran" className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem data-testid="radio-veteran-yes" value="yes" id="vet-yes" className="border-white/40" />
                          <Label htmlFor="vet-yes" className="text-gray-300">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem data-testid="radio-veteran-no" value="no" id="vet-no" className="border-white/40" />
                          <Label htmlFor="vet-no" className="text-gray-300">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="branchOfService" className="text-white">Branch of Service</Label>
                      <Input
                        data-testid="input-branchOfService"
                        id="branchOfService"
                        name="branchOfService"
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="e.g., Army, Navy, Air Force"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Business Info (for referrals) */}
              {(intakeType === "business_referral" || intakeType === "business_services") && (
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                  <h3 className="font-display text-xl text-white mb-6">BUSINESS INFORMATION</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="businessName" className="text-white">Business Name *</Label>
                      <Input
                        data-testid="input-businessName"
                        id="businessName"
                        name="businessName"
                        required={intakeType === "business_referral" || intakeType === "business_services"}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="ABC Company"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType" className="text-white">Business Type</Label>
                      <Input
                        data-testid="input-businessType"
                        id="businessType"
                        name="businessType"
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="e.g., LLC, Corporation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessWebsite" className="text-white">Website</Label>
                      <Input
                        data-testid="input-businessWebsite"
                        id="businessWebsite"
                        name="businessWebsite"
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hiringNeeds" className="text-white">Current Hiring Needs</Label>
                      <Input
                        data-testid="input-hiringNeeds"
                        id="hiringNeeds"
                        name="hiringNeeds"
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="e.g., 5 positions"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Industry Selection (for job_seeker and business_referral) */}
              {intakeType !== "business_services" && (
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                  <h3 className="font-display text-xl text-white mb-2">
                    {intakeType === "job_seeker" 
                      ? "SELECT INDUSTRIES YOU WANT TO ENTER"
                      : "SELECT YOUR BUSINESS INDUSTRIES"
                    }
                  </h3>
                  <p className="text-gray-400 mb-6">Select all that apply *</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {INDUSTRIES.map((industry) => (
                      <label
                        key={industry.id}
                        data-testid={`label-industry-${industry.id}`}
                        className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                          selectedIndustries.includes(industry.id)
                            ? "bg-blue-500/30 border-2 border-blue-500"
                            : "bg-white/5 border-2 border-transparent hover:border-white/20"
                        }`}
                      >
                        <Checkbox
                          data-testid={`checkbox-industry-${industry.id}`}
                          checked={selectedIndustries.includes(industry.id)}
                          onCheckedChange={() => toggleIndustry(industry.id)}
                          className="border-white/40"
                        />
                        <span className="text-gray-200 text-sm">{industry.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Services Selection (for business_services) */}
              {intakeType === "business_services" && (
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                  <h3 className="font-display text-xl text-white mb-2">
                    SELECT SERVICES YOU'RE INTERESTED IN
                  </h3>
                  <p className="text-gray-400 mb-6">Select all that apply *</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {VETERAN_SERVICES.map((service) => (
                      <label
                        key={service.id}
                        data-testid={`label-service-${service.id}`}
                        className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                          selectedServices.includes(service.id)
                            ? "bg-green-500/30 border-2 border-green-500"
                            : "bg-white/5 border-2 border-transparent hover:border-white/20"
                        } ${service.id === "insurance_savings" ? "border-brand-gold/50 bg-brand-gold/10" : ""}`}
                      >
                        <Checkbox
                          data-testid={`checkbox-service-${service.id}`}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => toggleService(service.id)}
                          className="border-white/40"
                        />
                        <span className={`text-sm ${service.id === "insurance_savings" ? "text-brand-gold font-bold" : "text-gray-200"}`}>
                          {service.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-4">* Insurance savings vary by provider and coverage type</p>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                <h3 className="font-display text-xl text-white mb-6">ADDITIONAL INFORMATION</h3>
                <div className="space-y-6">
                  {intakeType === "job_seeker" && (
                    <>
                      <div>
                        <Label htmlFor="experience" className="text-white">Your Experience & Skills</Label>
                        <Textarea
                          data-testid="input-experience"
                          id="experience"
                          name="experience"
                          className="bg-white/10 border-white/20 text-white min-h-[100px]"
                          placeholder="Describe your work experience, skills, and what you're looking for..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="preferredLocation" className="text-white">Preferred Location</Label>
                        <Input
                          data-testid="input-preferredLocation"
                          id="preferredLocation"
                          name="preferredLocation"
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="e.g., Remote, Dallas TX, Nationwide"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <Label htmlFor="additionalNotes" className="text-white">
                      {intakeType === "job_seeker" 
                        ? "Anything Else We Should Know?" 
                        : intakeType === "business_referral"
                        ? "Tell Us About Your Hiring Needs"
                        : "Tell Us About Your Business Needs"
                      }
                    </Label>
                    <Textarea
                      data-testid="input-additionalNotes"
                      id="additionalNotes"
                      name="additionalNotes"
                      className="bg-white/10 border-white/20 text-white min-h-[100px]"
                      placeholder={
                        intakeType === "job_seeker"
                          ? "Any additional information..."
                          : intakeType === "business_referral"
                          ? "Describe the types of positions you're looking to fill..."
                          : "Tell us about your business and how we can help..."
                      }
                    />
                  </div>
                </div>
              </div>

              {/* TCPA Consent */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                <TCPAConsent 
                  checked={tcpaConsent} 
                  onCheckedChange={setTcpaConsent} 
                />
              </div>

              {/* Submit */}
              <div className="text-center">
                <Button
                  data-testid="button-submit"
                  type="submit"
                  disabled={submitMutation.isPending || !tcpaConsent}
                  className="bg-brand-red hover:bg-brand-red/90 text-white text-xl px-12 py-6 h-auto"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit Application"}
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl text-white text-center mb-12">WHY JOIN OUR NETWORK?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <Star className="w-12 h-12 text-brand-gold mx-auto mb-4" />
                <h3 className="font-display text-xl text-white mb-3">VETERAN-FOCUSED</h3>
                <p className="text-gray-300 text-sm">
                  Our network prioritizes businesses that value veteran experience and military skills.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <Briefcase className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="font-display text-xl text-white mb-3">MULTIPLE INDUSTRIES</h3>
                <p className="text-gray-300 text-sm">
                  Access opportunities across 18+ industries from healthcare to technology to trades.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="font-display text-xl text-white mb-3">FREE SERVICE</h3>
                <p className="text-gray-300 text-sm">
                  No cost to job seekers. Businesses get access to qualified veteran candidates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
