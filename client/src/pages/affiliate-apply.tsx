import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Users, DollarSign, Rocket } from "lucide-react";
import { TCPAConsent } from "@/components/tcpa-consent";

export default function AffiliateApply() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
  });
  const [tcpaConsent, setTcpaConsent] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/affiliate-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit application");
      }
      return response.json();
    },
    onSuccess: async (data) => {
      console.log("Signup successful, user:", data);
      toast({
        title: "Account Created!",
        description: "Redirecting you to sign the agreement...",
      });
      
      // Invalidate any cached auth state
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      // Redirect to NDA signing page
      window.location.href = "/affiliate/nda";
    },
    onError: (error: Error) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.companyName || !formData.phone || !formData.email || !formData.password || !formData.description) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
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

  return (
    <Layout>
      <section className="bg-brand-navy text-white py-12 sm:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl sm:text-5xl font-display mb-4 sm:mb-6">Become an Affiliate Partner</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto px-2">
            Join our network of veteran advocates helping fellow service members achieve financial freedom.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <Users className="h-8 w-8 sm:h-12 sm:w-12 text-brand-navy mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-brand-navy mb-1 sm:mb-2">Access Network</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Connect with veterans in our growing community</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <DollarSign className="h-8 w-8 sm:h-12 sm:w-12 text-brand-red mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-brand-navy mb-1 sm:mb-2">Earn Commission</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Competitive rates for veteran referrals</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <Rocket className="h-8 w-8 sm:h-12 sm:w-12 text-brand-gold mx-auto mb-3 sm:mb-4" />
              <h3 className="font-display text-lg sm:text-xl text-brand-navy mb-1 sm:mb-2">Grow Together</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Training, resources, and support provided</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-navy mb-4 sm:mb-6 text-center">Affiliate Application</h2>
            <form onSubmit={handleSubmit} method="post" action="#" className="space-y-6">
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
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input 
                  id="companyName" 
                  placeholder="Your Business LLC"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  data-testid="input-company-name"
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
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Create Password *</Label>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    data-testid="input-password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    data-testid="input-confirm-password"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Describe Everything You Need *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Tell us about your business, your experience with veterans, and how you'd like to partner with us..."
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
                data-testid="button-submit-application"
              >
                {submitMutation.isPending ? "Creating Account..." : "Create Account & Continue"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
