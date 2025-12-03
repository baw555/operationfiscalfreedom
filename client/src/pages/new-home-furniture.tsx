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
import { Home, CheckCircle, DollarSign, Sofa, Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function NewHomeFurniture() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    branch: "",
    serviceStatus: "",
    homeStatus: "",
    expectedCloseDate: "",
    homeLocation: "",
    additionalInfo: "",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/furniture-assistance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit request");
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Request Submitted!",
        description: "We'll connect you with our partner non-profits soon.",
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
    
    const required = ['firstName', 'lastName', 'email', 'phone', 'branch', 'serviceStatus', 'homeStatus'];
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

    submitMutation.mutate(formData);
  };

  if (submitted) {
    return (
      <Layout>
        <section className="bg-brand-navy text-white py-20 text-center">
          <div className="container mx-auto px-4">
            <CheckCircle className="h-20 w-20 text-brand-green mx-auto mb-6" />
            <h1 className="text-5xl font-display mb-6" data-testid="text-success-title">Request Received!</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8" data-testid="text-success-message">
              Thank you for your interest in our Furniture Assistance Program. A representative from one of our 
              partner non-profits will contact you within 3-5 business days to discuss your eligibility and next steps.
            </p>
            <Button 
              onClick={() => setLocation("/")}
              className="bg-brand-green hover:bg-brand-green/90 text-white font-bold px-8 py-6 text-lg"
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
      <section className="bg-brand-navy text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold mb-6">
            <Sofa className="w-4 h-4" />
            <span className="font-bold text-sm uppercase tracking-wider">Veteran Homeowner Program</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display mb-6" data-testid="text-page-title">Get Your Furniture Paid For</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto" data-testid="text-page-description">
            Veterans purchasing a new home can receive $3,000 - $10,000 in cash assistance from our partner non-profits to furnish their new home.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <DollarSign className="h-12 w-12 text-brand-green mx-auto mb-4" />
              <h3 className="font-display text-xl text-brand-navy mb-2">$3,000 - $10,000</h3>
              <p className="text-gray-600 text-sm">Cash assistance based on need and eligibility</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Home className="h-12 w-12 text-brand-navy mx-auto mb-4" />
              <h3 className="font-display text-xl text-brand-navy mb-2">New Homeowners</h3>
              <p className="text-gray-600 text-sm">For veterans purchasing or recently purchased a home</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Heart className="h-12 w-12 text-brand-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-brand-navy mb-2">Partner Non-Profits</h3>
              <p className="text-gray-600 text-sm">Connected with trusted organizations dedicated to veterans</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-display text-brand-navy mb-6 text-center">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-10 h-10 bg-brand-green text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">1</div>
                <p className="text-sm text-gray-600">Submit your information below</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-brand-green text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">2</div>
                <p className="text-sm text-gray-600">Partner non-profit reviews your request</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-brand-green text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">3</div>
                <p className="text-sm text-gray-600">Verify home purchase documentation</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-brand-green text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">4</div>
                <p className="text-sm text-gray-600">Receive furniture assistance funds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
            <div className="mb-10">
              <h2 className="text-2xl font-display text-brand-navy mb-4">Request Information</h2>
              <p className="text-gray-600">
                Complete the form below to be connected with our partner non-profits who provide furniture assistance to veteran homeowners.
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
                <Label htmlFor="homeStatus">Home Purchase Status *</Label>
                <Select value={formData.homeStatus} onValueChange={(v) => setFormData({ ...formData, homeStatus: v })}>
                  <SelectTrigger data-testid="select-home-status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="looking">Currently Looking / Pre-Approved</SelectItem>
                    <SelectItem value="under-contract">Under Contract</SelectItem>
                    <SelectItem value="closing-30">Closing Within 30 Days</SelectItem>
                    <SelectItem value="closed-recently">Closed Within Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="expectedCloseDate">Expected/Actual Close Date</Label>
                  <Input 
                    id="expectedCloseDate" 
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                    data-testid="input-close-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeLocation">Home Location (City, State)</Label>
                  <Input 
                    id="homeLocation" 
                    placeholder="e.g. San Diego, CA"
                    value={formData.homeLocation}
                    onChange={(e) => setFormData({ ...formData, homeLocation: e.target.value })}
                    data-testid="input-home-location"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea 
                  id="additionalInfo" 
                  placeholder="Share any additional details about your situation or furniture needs..." 
                  className="min-h-[100px]"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  data-testid="input-additional-info"
                />
              </div>

              <div className="bg-brand-green/5 border border-brand-green/20 p-6 rounded-lg space-y-4">
                <h3 className="font-bold text-brand-navy flex items-center gap-2">
                  <CheckCircle className="text-brand-green w-5 h-5" />
                  Program Eligibility:
                </h3>
                <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-green" /> U.S. Military Veteran or Active Duty</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-green" /> Purchasing or Recently Purchased Home</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-green" /> Valid DD-214 or Military ID</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-green" /> Home Purchase Documentation</li>
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
                  I certify that I am a U.S. military veteran, active service member, or military spouse and I am currently purchasing or have recently purchased a home.
                </Label>
              </div>

              <Button 
                type="submit"
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-bold h-14 text-lg shadow-lg"
                disabled={submitMutation.isPending}
                data-testid="button-submit-request"
              >
                {submitMutation.isPending ? "Submitting..." : "Request Information"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
