import { Layout } from "@/components/layout";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Brain, Dna, Heart, Sparkles, Compass, CheckCircle, ArrowRight, Stethoscope, Users, Activity } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { Link, useRoute, useLocation } from "wouter";
import { useScrollToTopOnChange } from "@/hooks/use-scroll-to-top";

const CATEGORIES = [
  { id: "ptsd", label: "PTSD Treatments", icon: Brain, description: "Combat trauma, anxiety, depression therapies", color: "purple" },
  { id: "exosomes", label: "Exosome Therapy", icon: Dna, description: "Regenerative medicine and cellular healing", color: "blue" },
  { id: "less_invasive", label: "Less Invasive Options", icon: Heart, description: "Non-surgical alternatives and natural therapies", color: "green" },
  { id: "new_treatments", label: "New Treatments", icon: Sparkles, description: "Cutting-edge and emerging therapies", color: "yellow" },
  { id: "guidance", label: "Treatment Guidance", icon: Compass, description: "Navigation and treatment planning support", color: "red" },
];

export default function HealthcarePage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [isOfferingServices, setIsOfferingServices] = useState(false);
  const [referralCode, setReferralCode] = useState<string>("");
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
      return apiRequest("POST", "/api/healthcare-intakes", data);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Request Submitted!",
        description: "We'll connect you with the right resources soon.",
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
    
    if (!category) {
      toast({
        title: "Select Category",
        description: "Please select a treatment category.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      category,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      branchOfService: formData.get("branchOfService") as string,
      yearsOfService: formData.get("yearsOfService") as string,
      currentVaRating: formData.get("currentVaRating") as string,
      currentConditions: formData.get("currentConditions") as string,
      treatmentHistory: formData.get("treatmentHistory") as string,
      treatmentGoals: formData.get("treatmentGoals") as string,
      preferredLocation: formData.get("preferredLocation") as string,
      insuranceType: formData.get("insuranceType") as string,
      additionalNotes: formData.get("additionalNotes") as string,
      isOfferingServices,
      providerType: isOfferingServices ? formData.get("providerType") as string : null,
      providerCredentials: isOfferingServices ? formData.get("providerCredentials") as string : null,
      referralCode: referralCode || null,
    };

    submitMutation.mutate(data);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 max-w-lg text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 data-testid="text-success-title" className="font-display text-3xl text-white mb-4">REQUEST SUBMITTED!</h1>
            <p data-testid="text-success-message" className="text-gray-300 mb-6">
              {isOfferingServices 
                ? "Thank you for offering to provide medical services to veterans. Our team will review your application and connect you with veterans in need."
                : "Thank you for reaching out. Our healthcare navigation team will review your request and connect you with appropriate treatment options and providers."}
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
      
      <div className="min-h-screen bg-gradient-to-br from-brand-red via-brand-navy to-brand-navy">
        {/* Sticky Service Selector */}
        <div className="sticky top-0 z-50 bg-brand-navy/95 backdrop-blur border-b border-white/10 py-4 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-green-400" />
              <h2 className="font-display text-xl text-white">HEALTHCARE SERVICES</h2>
            </div>
            <div className="w-full sm:w-80">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-healthcare-service">
                  <SelectValue placeholder="Select a treatment category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} data-testid={`option-${cat.id}`}>
                      <div className="flex flex-col">
                        <span className="font-semibold">{cat.label}</span>
                        <span className="text-xs text-gray-500">{cat.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Stethoscope className="w-5 h-5 text-white" />
              <span className="text-white font-bold uppercase tracking-wider text-sm">Veteran Healthcare</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              HEALTHCARE NAVIGATION
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Connecting veterans with cutting-edge treatments and healthcare solutions. 
              From PTSD therapies to regenerative medicine, we help you find the right path to healing.
            </p>
          </div>
        </div>

        {/* Category Selection */}
        <div className="py-8 px-4 bg-black/20">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-2xl text-white text-center mb-8">SELECT TREATMENT CATEGORY</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const colorClasses = {
                  purple: category === cat.id ? "border-purple-500 bg-purple-500/20" : "border-white/20 bg-white/5 hover:border-purple-400",
                  blue: category === cat.id ? "border-blue-500 bg-blue-500/20" : "border-white/20 bg-white/5 hover:border-blue-400",
                  green: category === cat.id ? "border-green-500 bg-green-500/20" : "border-white/20 bg-white/5 hover:border-green-400",
                  yellow: category === cat.id ? "border-yellow-500 bg-yellow-500/20" : "border-white/20 bg-white/5 hover:border-yellow-400",
                  red: category === cat.id ? "border-brand-red bg-brand-red/20" : "border-white/20 bg-white/5 hover:border-brand-red",
                };
                const iconColors = {
                  purple: category === cat.id ? "text-purple-400" : "text-gray-400",
                  blue: category === cat.id ? "text-blue-400" : "text-gray-400",
                  green: category === cat.id ? "text-green-400" : "text-gray-400",
                  yellow: category === cat.id ? "text-yellow-400" : "text-gray-400",
                  red: category === cat.id ? "text-brand-red" : "text-gray-400",
                };
                return (
                  <button
                    key={cat.id}
                    data-testid={`button-category-${cat.id}`}
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${colorClasses[cat.color as keyof typeof colorClasses]}`}
                  >
                    <IconComponent className={`w-10 h-10 mx-auto mb-3 ${iconColors[cat.color as keyof typeof iconColors]}`} />
                    <h3 className="font-display text-sm text-white mb-1">{cat.label}</h3>
                    <p className="text-gray-400 text-xs">{cat.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Service Type Toggle */}
        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
              <h3 className="font-display text-xl text-white mb-4 text-center">ARE YOU A MEDICAL PROVIDER?</h3>
              <div className="flex justify-center gap-4">
                <button
                  data-testid="button-seeking-treatment"
                  onClick={() => setIsOfferingServices(false)}
                  className={`px-6 py-3 rounded-lg font-bold transition-all ${
                    !isOfferingServices ? "bg-brand-red text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <Users className="w-5 h-5 inline mr-2" />
                  I'm Seeking Treatment
                </button>
                <button
                  data-testid="button-offering-services"
                  onClick={() => setIsOfferingServices(true)}
                  className={`px-6 py-3 rounded-lg font-bold transition-all ${
                    isOfferingServices ? "bg-green-600 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <Stethoscope className="w-5 h-5 inline mr-2" />
                  I Offer Medical Services
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Info */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                <h3 className="font-display text-xl text-white mb-6">YOUR INFORMATION</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-white">First Name *</Label>
                    <Input data-testid="input-firstName" id="firstName" name="firstName" required className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                    <Input data-testid="input-lastName" id="lastName" name="lastName" required className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">Email *</Label>
                    <Input data-testid="input-email" id="email" name="email" type="email" required className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">Phone *</Label>
                    <Input data-testid="input-phone" id="phone" name="phone" type="tel" required className="bg-white/10 border-white/20 text-white" />
                  </div>
                </div>
              </div>

              {/* Veteran Info - Only for those seeking treatment */}
              {!isOfferingServices && (
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                  <h3 className="font-display text-xl text-white mb-6">VETERAN INFORMATION</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="branchOfService" className="text-white">Branch of Service</Label>
                      <Input data-testid="input-branchOfService" id="branchOfService" name="branchOfService" className="bg-white/10 border-white/20 text-white" placeholder="Army, Navy, etc." />
                    </div>
                    <div>
                      <Label htmlFor="yearsOfService" className="text-white">Years of Service</Label>
                      <Input data-testid="input-yearsOfService" id="yearsOfService" name="yearsOfService" className="bg-white/10 border-white/20 text-white" placeholder="e.g., 8 years" />
                    </div>
                    <div>
                      <Label htmlFor="currentVaRating" className="text-white">Current VA Rating</Label>
                      <Input data-testid="input-currentVaRating" id="currentVaRating" name="currentVaRating" className="bg-white/10 border-white/20 text-white" placeholder="e.g., 70%" />
                    </div>
                  </div>
                </div>
              )}

              {/* Healthcare Needs - Only for those seeking treatment */}
              {!isOfferingServices && (
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                  <h3 className="font-display text-xl text-white mb-6">HEALTHCARE NEEDS</h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="currentConditions" className="text-white">Current Conditions or Symptoms</Label>
                      <Textarea data-testid="input-currentConditions" id="currentConditions" name="currentConditions" className="bg-white/10 border-white/20 text-white min-h-[80px]" placeholder="Describe what you're experiencing..." />
                    </div>
                    <div>
                      <Label htmlFor="treatmentHistory" className="text-white">Previous Treatment History</Label>
                      <Textarea data-testid="input-treatmentHistory" id="treatmentHistory" name="treatmentHistory" className="bg-white/10 border-white/20 text-white min-h-[80px]" placeholder="What treatments have you tried?" />
                    </div>
                    <div>
                      <Label htmlFor="treatmentGoals" className="text-white">Treatment Goals</Label>
                      <Textarea data-testid="input-treatmentGoals" id="treatmentGoals" name="treatmentGoals" className="bg-white/10 border-white/20 text-white min-h-[80px]" placeholder="What outcomes are you hoping for?" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="preferredLocation" className="text-white">Preferred Location</Label>
                        <Input data-testid="input-preferredLocation" id="preferredLocation" name="preferredLocation" className="bg-white/10 border-white/20 text-white" placeholder="City, State or 'Remote'" />
                      </div>
                      <div>
                        <Label htmlFor="insuranceType" className="text-white">Insurance Type</Label>
                        <Input data-testid="input-insuranceType" id="insuranceType" name="insuranceType" className="bg-white/10 border-white/20 text-white" placeholder="VA, Tricare, Private, etc." />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Provider Info - Only for those offering services */}
              {isOfferingServices && (
                <div className="bg-green-500/10 backdrop-blur border border-green-500/30 rounded-xl p-8">
                  <h3 className="font-display text-xl text-white mb-6">PROVIDER INFORMATION</h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="providerType" className="text-white">Provider Type *</Label>
                      <Input data-testid="input-providerType" id="providerType" name="providerType" required className="bg-white/10 border-white/20 text-white" placeholder="MD, DO, NP, Therapist, etc." />
                    </div>
                    <div>
                      <Label htmlFor="providerCredentials" className="text-white">Credentials & Specializations</Label>
                      <Textarea data-testid="input-providerCredentials" id="providerCredentials" name="providerCredentials" className="bg-white/10 border-white/20 text-white min-h-[100px]" placeholder="List your licenses, certifications, and areas of expertise..." />
                    </div>
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                      <p className="text-green-300 text-sm">
                        <strong>Note:</strong> By submitting this form, you are expressing interest in providing healthcare services to veterans through our network. 
                        Our team will review your credentials and contact you about partnership opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                <h3 className="font-display text-xl text-white mb-6">ADDITIONAL INFORMATION</h3>
                <div>
                  <Label htmlFor="additionalNotes" className="text-white">Anything else we should know?</Label>
                  <Textarea data-testid="input-additionalNotes" id="additionalNotes" name="additionalNotes" className="bg-white/10 border-white/20 text-white min-h-[100px]" placeholder="Any other details, questions, or concerns..." />
                </div>
              </div>

              {/* Submit */}
              <div className="text-center">
                <Button
                  data-testid="button-submit"
                  type="submit"
                  disabled={submitMutation.isPending}
                  className={`text-xl px-12 py-6 h-auto ${isOfferingServices ? "bg-green-600 hover:bg-green-700" : "bg-brand-red hover:bg-brand-red/90"} text-white`}
                >
                  {submitMutation.isPending ? "Submitting..." : isOfferingServices ? "Apply to Provide Services" : "Request Healthcare Guidance"}
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Join Vet Professionals CTA */}
        <div className="py-16 px-4 bg-brand-navy">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl text-white mb-6">MEDICAL PROFESSIONALS</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Are you a healthcare provider looking to serve veterans? Join our Vet Professionals network 
              to connect with veterans who need your expertise.
            </p>
            <Link href="/vet-professionals">
              <Button data-testid="button-join-network" className="bg-brand-red hover:bg-brand-red/90 text-white text-lg px-8 py-4 h-auto">
                <Stethoscope className="w-5 h-5 mr-2" />
                Join Vet Professionals Network
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
