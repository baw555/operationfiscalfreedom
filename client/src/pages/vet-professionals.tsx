import { Layout } from "@/components/layout";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Scale, Shield, Calculator, Stethoscope, CheckCircle, ArrowRight, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const PROFESSION_TYPES = [
  { id: "attorneys", label: "Attorneys", icon: Scale, description: "Legal professionals serving veterans" },
  { id: "insurance", label: "Insurance", icon: Shield, description: "Insurance agents and brokers" },
  { id: "cpa", label: "CPA", icon: Calculator, description: "Certified Public Accountants" },
  { id: "medical", label: "Medical", icon: Stethoscope, description: "Medical professionals" },
];

export default function VetProfessionals() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [professionType, setProfessionType] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");

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
      return apiRequest("POST", "/api/vet-professional-intakes", data);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and be in touch soon.",
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
    
    if (!professionType) {
      toast({
        title: "Select Profession",
        description: "Please select your profession type.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      professionType,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      isVeteran: formData.get("isVeteran") as string,
      branchOfService: formData.get("branchOfService") as string,
      businessName: formData.get("businessName") as string,
      businessType: formData.get("businessType") as string,
      licenseNumber: formData.get("licenseNumber") as string,
      yearsExperience: formData.get("yearsExperience") as string,
      specializations: formData.get("specializations") as string,
      serviceArea: formData.get("serviceArea") as string,
      additionalNotes: formData.get("additionalNotes") as string,
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
            <h1 data-testid="text-success-title" className="font-display text-3xl text-white mb-4">APPLICATION SUBMITTED!</h1>
            <p data-testid="text-success-message" className="text-gray-300 mb-6">
              Thank you for joining our Vet Professionals network. We'll review your application and connect you with veteran clients in need of your services.
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
        {/* Hero Section */}
        <div className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Users className="w-5 h-5 text-white" />
              <span className="text-white font-bold uppercase tracking-wider text-sm">Professional Network</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              VET PROFESSIONALS
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Join our network of veteran-focused professionals. Connect with veterans who need your expertise 
              and grow your practice while serving those who served.
            </p>
          </div>
        </div>

        {/* Profession Selection */}
        <div className="py-8 px-4 bg-brand-navy">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-2xl text-white text-center mb-8">SELECT YOUR PROFESSION</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROFESSION_TYPES.map((profession, index) => {
                const IconComponent = profession.icon;
                const colors = ['bg-brand-red', 'bg-white', 'bg-brand-navy border-white', 'bg-brand-red'];
                const textColors = ['text-white', 'text-brand-navy', 'text-white', 'text-white'];
                const descColors = ['text-white/80', 'text-brand-navy/70', 'text-white/80', 'text-white/80'];
                const iconColors = ['text-white', 'text-brand-navy', 'text-white', 'text-white'];
                return (
                  <button
                    key={profession.id}
                    data-testid={`button-profession-${profession.id}`}
                    onClick={() => setProfessionType(profession.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-center ${
                      professionType === profession.id
                        ? `${colors[index % 4]} border-white shadow-lg`
                        : `${colors[index % 4]} border-transparent hover:border-white/40 opacity-80 hover:opacity-100`
                    }`}
                  >
                    <IconComponent className={`w-12 h-12 mx-auto mb-4 ${iconColors[index % 4]}`} />
                    <h3 className={`font-display text-lg mb-2 ${textColors[index % 4]}`}>{profession.label}</h3>
                    <p className={`text-xs ${descColors[index % 4]}`}>{profession.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Info */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                <h3 className="font-display text-xl text-white mb-6">YOUR INFORMATION</h3>
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

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-3 block">Are you a veteran?</Label>
                    <RadioGroup defaultValue="no" name="isVeteran" className="flex gap-4">
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
                    <Label htmlFor="branchOfService" className="text-white">Branch of Service (if applicable)</Label>
                    <Input
                      data-testid="input-branchOfService"
                      id="branchOfService"
                      name="branchOfService"
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="e.g., Army, Navy, Air Force"
                    />
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                <h3 className="font-display text-xl text-white mb-6">PROFESSIONAL INFORMATION</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessName" className="text-white">Business/Practice Name</Label>
                    <Input
                      data-testid="input-businessName"
                      id="businessName"
                      name="businessName"
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Law Office of John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType" className="text-white">Business Type</Label>
                    <Input
                      data-testid="input-businessType"
                      id="businessType"
                      name="businessType"
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="e.g., Solo Practice, LLC, Partnership"
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseNumber" className="text-white">License/Bar Number</Label>
                    <Input
                      data-testid="input-licenseNumber"
                      id="licenseNumber"
                      name="licenseNumber"
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Your professional license number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearsExperience" className="text-white">Years of Experience</Label>
                    <Input
                      data-testid="input-yearsExperience"
                      id="yearsExperience"
                      name="yearsExperience"
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="e.g., 10"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="specializations" className="text-white">Specializations</Label>
                    <Input
                      data-testid="input-specializations"
                      id="specializations"
                      name="specializations"
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="e.g., VA Claims, Personal Injury, Tax Law"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="serviceArea" className="text-white">Service Area</Label>
                    <Input
                      data-testid="input-serviceArea"
                      id="serviceArea"
                      name="serviceArea"
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="e.g., Nationwide, Texas, Dallas Metro Area"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                <h3 className="font-display text-xl text-white mb-6">ADDITIONAL INFORMATION</h3>
                <div>
                  <Label htmlFor="additionalNotes" className="text-white">Tell us about your experience serving veterans</Label>
                  <Textarea
                    data-testid="input-additionalNotes"
                    id="additionalNotes"
                    name="additionalNotes"
                    className="bg-white/10 border-white/20 text-white min-h-[120px]"
                    placeholder="Describe your experience working with veterans, any special programs you offer, or why you want to join our network..."
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="text-center">
                <Button
                  data-testid="button-submit"
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="bg-brand-red hover:bg-brand-red/90 text-white text-xl px-12 py-6 h-auto"
                >
                  {submitMutation.isPending ? "Submitting..." : "Join Network"}
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-16 px-4 bg-brand-navy">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl text-white text-center mb-12">WHY JOIN OUR NETWORK?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-brand-red rounded-xl p-6 text-center">
                <Users className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="font-display text-xl text-white mb-3">VETERAN CLIENTS</h3>
                <p className="text-white/80 text-sm">
                  Connect with veterans and their families who need your professional services.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <Shield className="w-12 h-12 text-brand-navy mx-auto mb-4" />
                <h3 className="font-display text-xl text-brand-navy mb-3">TRUSTED NETWORK</h3>
                <p className="text-brand-navy/70 text-sm">
                  Be part of a vetted network of professionals dedicated to serving veterans.
                </p>
              </div>
              <div className="bg-brand-navy border-2 border-white rounded-xl p-6 text-center">
                <Scale className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="font-display text-xl text-white mb-3">GROW YOUR PRACTICE</h3>
                <p className="text-white/80 text-sm">
                  Expand your client base while making a meaningful impact in veterans' lives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
