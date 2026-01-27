import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, Users, Building2, Briefcase, DollarSign, Heart, Car, Home, FileText } from "lucide-react";

export default function Insurance() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    userType: "",
    intentType: "",
    insuranceTypes: [] as string[],
    businessName: "",
    employeeCount: "",
    currentProvider: "",
    additionalInfo: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem('insurance_referral', ref);
    } else {
      const storedRef = localStorage.getItem('insurance_referral');
      if (storedRef) setReferralCode(storedRef);
    }
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData & { referralCode: string | null }) => {
      const response = await fetch("/api/insurance-intakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          insuranceTypes: data.insuranceTypes.join(","),
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Submission failed");
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({ title: "Request Submitted!", description: "We'll contact you within 24 hours." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.userType || !formData.intentType || formData.insuranceTypes.length === 0) {
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    submitMutation.mutate({ ...formData, referralCode });
  };

  const toggleInsuranceType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      insuranceTypes: prev.insuranceTypes.includes(type)
        ? prev.insuranceTypes.filter(t => t !== type)
        : [...prev.insuranceTypes, type]
    }));
  };

  const insuranceOptions = [
    { id: "life", label: "Life Insurance", icon: Heart },
    { id: "disability", label: "Disability Insurance", icon: Shield },
    { id: "health", label: "Health Insurance", icon: FileText },
    { id: "business", label: "Business Insurance", icon: Building2 },
    { id: "auto", label: "Auto Insurance", icon: Car },
    { id: "home", label: "Home Insurance", icon: Home },
  ];

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-brand-navy to-brand-navy/90 py-20">
          <div className="text-center text-white max-w-lg mx-auto px-4">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h1 className="text-4xl font-display mb-4">Request Received!</h1>
            <p className="text-xl text-gray-300 mb-6">
              Thank you for your interest in saving on insurance. Our team will contact you within 24 hours with your personalized quote.
            </p>
            <p className="text-sm text-gray-400">
              Average savings: 20-40% compared to traditional insurance agents
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-navy to-brand-navy/90 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-display mb-4">Save 20-40% on All Insurance</h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            NavigatorUSA's provider-direct insurance model eliminates middleman commissions, 
            passing the savings directly to you and your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>No Agent Commissions</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>34+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Enhanced Coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg text-brand-navy mb-2">Proven Cost Savings</h3>
              <p className="text-gray-600 text-sm">Our commissionless model has demonstrated annual savings exceeding $45,000 for medical practices alone.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-brand-navy mb-2">Tailored Solutions</h3>
              <p className="text-gray-600 text-sm">We craft custom financial strategies for consumers, business owners, and professionals.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg text-brand-navy mb-2">Enhanced Coverage</h3>
              <p className="text-gray-600 text-sm">Direct provider relationships mean better coverage terms and lower premiums.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-2">Get Your Free Quote</h2>
              <p className="text-gray-600">Tell us about your insurance needs and we'll show you how much you can save.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div>
                <Label className="text-brand-navy font-semibold mb-3 block">I am a... *</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "consumer", label: "Consumer", icon: Users },
                    { id: "business", label: "Business", icon: Building2 },
                    { id: "insurance_agent", label: "Insurance Agent", icon: Briefcase },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData({ ...formData, userType: id })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.userType === id
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      data-testid={`button-user-type-${id}`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${formData.userType === id ? "text-green-600" : "text-gray-400"}`} />
                      <span className={`text-sm font-medium ${formData.userType === id ? "text-green-600" : "text-gray-600"}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intent Type Selection */}
              <div>
                <Label className="text-brand-navy font-semibold mb-3 block">I want to... *</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "buy", label: "Buy Insurance" },
                    { id: "sell", label: "Sell Insurance" },
                    { id: "refer", label: "Refer Others" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData({ ...formData, intentType: id })}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        formData.intentType === id
                          ? "border-brand-navy bg-brand-navy text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                      data-testid={`button-intent-${id}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Insurance Types */}
              <div>
                <Label className="text-brand-navy font-semibold mb-3 block">Insurance Types (select all that apply) *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {insuranceOptions.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleInsuranceType(id)}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                        formData.insuranceTypes.includes(id)
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      data-testid={`button-insurance-${id}`}
                    >
                      <Icon className={`w-5 h-5 ${formData.insuranceTypes.includes(id) ? "text-green-600" : "text-gray-400"}`} />
                      <span className={`text-sm ${formData.insuranceTypes.includes(id) ? "text-green-600 font-medium" : "text-gray-600"}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-700">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-700">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1"
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-700">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              {/* Business-specific fields */}
              {formData.userType === "business" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName" className="text-gray-700">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="mt-1"
                      data-testid="input-business-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employeeCount" className="text-gray-700">Number of Employees</Label>
                    <Input
                      id="employeeCount"
                      value={formData.employeeCount}
                      onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                      className="mt-1"
                      placeholder="e.g., 10-50"
                      data-testid="input-employee-count"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="currentProvider" className="text-gray-700">Current Insurance Provider (if any)</Label>
                <Input
                  id="currentProvider"
                  value={formData.currentProvider}
                  onChange={(e) => setFormData({ ...formData, currentProvider: e.target.value })}
                  className="mt-1"
                  placeholder="e.g., State Farm, Allstate, etc."
                  data-testid="input-current-provider"
                />
              </div>

              <div>
                <Label htmlFor="additionalInfo" className="text-gray-700">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  className="mt-1"
                  rows={3}
                  placeholder="Tell us about your specific insurance needs or questions..."
                  data-testid="textarea-additional-info"
                />
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg"
                data-testid="button-submit-insurance"
              >
                {submitMutation.isPending ? "Submitting..." : "Get My Free Quote"}
              </Button>

              <p className="text-center text-xs text-gray-500">
                By submitting, you agree to be contacted about insurance options. Your information is secure and will never be sold.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* KeyArx Direct Carriers Section */}
      <section className="py-12 bg-brand-navy text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-display mb-3">Direct Provider Partnerships</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Through our KeyArx partnership, we work directly with 6 top-rated insurance carriers - eliminating middleman costs and passing savings to you.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* UNUM */}
            <div className="bg-white/10 rounded-xl p-5 backdrop-blur">
              <h3 className="font-bold text-lg text-brand-gold mb-2">UNUM</h3>
              <div className="text-sm space-y-1">
                <p><span className="text-gray-400">AM Best:</span> A (Excellent)</p>
                <p><span className="text-gray-400">Fitch:</span> A (Stable)</p>
                <p><span className="text-gray-400">Est:</span> 1848</p>
                <p className="text-xs text-gray-400 mt-2">First U.S. disability insurer (1939). 175+ years in business.</p>
              </div>
            </div>
            
            {/* Principal */}
            <div className="bg-white/10 rounded-xl p-5 backdrop-blur border border-brand-gold">
              <h3 className="font-bold text-lg text-brand-gold mb-2">Principal Financial</h3>
              <div className="text-sm space-y-1">
                <p><span className="text-gray-400">AM Best:</span> A+ (Superior)</p>
                <p><span className="text-gray-400">S&P:</span> A+</p>
                <p><span className="text-gray-400">Est:</span> 1879</p>
                <p className="text-xs text-gray-400 mt-2">Fortune 500. #11 JUST 100 list. 68M+ customers globally.</p>
              </div>
            </div>
            
            {/* Symetra */}
            <div className="bg-white/10 rounded-xl p-5 backdrop-blur">
              <h3 className="font-bold text-lg text-brand-gold mb-2">Symetra</h3>
              <div className="text-sm space-y-1">
                <p><span className="text-gray-400">AM Best:</span> A (Excellent)</p>
                <p><span className="text-gray-400">NAIC Index:</span> 0.18</p>
                <p><span className="text-gray-400">Est:</span> 1957</p>
                <p className="text-xs text-gray-400 mt-2">Below-average complaint ratio. Quick 18-min approvals.</p>
              </div>
            </div>
            
            {/* The Standard */}
            <div className="bg-white/10 rounded-xl p-5 backdrop-blur">
              <h3 className="font-bold text-lg text-brand-gold mb-2">The Standard</h3>
              <div className="text-sm space-y-1">
                <p><span className="text-gray-400">AM Best:</span> A (Excellent)</p>
                <p><span className="text-gray-400">Est:</span> 1906</p>
                <p className="text-xs text-gray-400 mt-2">Group disability & life specialist. 118+ years in business.</p>
              </div>
            </div>
            
            {/* Sun Life */}
            <div className="bg-white/10 rounded-xl p-5 backdrop-blur">
              <h3 className="font-bold text-lg text-brand-gold mb-2">Sun Life</h3>
              <div className="text-sm space-y-1">
                <p><span className="text-gray-400">AM Best:</span> A+ (Superior)</p>
                <p><span className="text-gray-400">Est:</span> 1865</p>
                <p className="text-xs text-gray-400 mt-2">Global leader. 159+ years. Strong dental & vision coverage.</p>
              </div>
            </div>
            
            {/* The Hartford */}
            <div className="bg-white/10 rounded-xl p-5 backdrop-blur">
              <h3 className="font-bold text-lg text-brand-gold mb-2">The Hartford</h3>
              <div className="text-sm space-y-1">
                <p><span className="text-gray-400">AM Best:</span> A+ (Superior)</p>
                <p><span className="text-gray-400">S&P:</span> AA-</p>
                <p><span className="text-gray-400">Est:</span> 1810</p>
                <p className="text-xs text-gray-400 mt-2">Oldest U.S. insurer. 215+ years. Fortune 500.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400">
              Partnership powered by <a href="https://keyarx.com" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">KeyArx Group</a> - 34+ years of provider-direct insurance expertise
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
