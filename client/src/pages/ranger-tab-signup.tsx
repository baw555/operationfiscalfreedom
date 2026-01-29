import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, FileText, Shield, Zap, Star } from "lucide-react";

export default function RangerTabSignup() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    business: "",
    address: "",
    initials: "",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/ranger-tab-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit application");
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We'll be in touch soon to set up your Ranger Tab.",
      });
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
    if (!formData.name || !formData.phone || !formData.email || !formData.business || !formData.address || !formData.initials) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate(formData);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-brand-navy via-brand-blue/20 to-brand-navy flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-brand-gold/30 bg-white/95 backdrop-blur">
            <CardContent className="pt-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-display text-brand-navy mb-4">Application Received!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in Ranger Tab. Our team will review your application and contact you shortly to set up your personalized contract management portal.
              </p>
              <Button
                onClick={() => window.location.href = "/"}
                className="bg-brand-navy hover:bg-brand-navy/90"
                data-testid="button-return-home"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-navy via-brand-blue/20 to-brand-navy">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-8 h-8 text-brand-gold fill-current" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display text-white">RANGER TAB</h1>
              <Star className="w-8 h-8 text-brand-gold fill-current" />
            </div>
            <p className="text-xl sm:text-2xl text-brand-gold font-display mb-4">
              YOUR OWN CONTRACT SIGNING PORTAL
            </p>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Stop paying document management fees. Get your own branded portal for sending, signing, and managing contracts - all for free.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="pb-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-white/10 border-brand-gold/30 text-center">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-7 h-7 text-brand-gold" />
                  </div>
                  <h3 className="text-white font-display text-xl mb-2">Custom Templates</h3>
                  <p className="text-white/70 text-sm">Create your own contract templates with dynamic auto-fill fields</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-brand-gold/30 text-center">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-7 h-7 text-brand-gold" />
                  </div>
                  <h3 className="text-white font-display text-xl mb-2">Instant Signing</h3>
                  <p className="text-white/70 text-sm">Send contracts via email with tokenized signing links</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-brand-gold/30 text-center">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-7 h-7 text-brand-gold" />
                  </div>
                  <h3 className="text-white font-display text-xl mb-2">Secure PDFs</h3>
                  <p className="text-white/70 text-sm">Professional PDF generation with embedded signatures</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Signup Form */}
        <section className="pb-16 px-4">
          <div className="container mx-auto max-w-xl">
            <Card className="border-brand-gold/30 bg-white/95 backdrop-blur shadow-2xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-display text-brand-navy">
                  Get Your Ranger Tab
                </CardTitle>
                <p className="text-gray-600">Fill out the form below to apply</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Smith"
                      className="text-brand-navy"
                      data-testid="input-ranger-name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="text-brand-navy"
                        data-testid="input-ranger-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="text-brand-navy"
                        data-testid="input-ranger-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business">Business Name *</Label>
                    <Input
                      id="business"
                      value={formData.business}
                      onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                      placeholder="Your Company LLC"
                      className="text-brand-navy"
                      data-testid="input-ranger-business"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Main St, City, State 12345"
                      className="text-brand-navy"
                      data-testid="input-ranger-address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="initials">Your Initials *</Label>
                    <Input
                      id="initials"
                      value={formData.initials}
                      onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase().slice(0, 4) })}
                      placeholder="JS"
                      maxLength={4}
                      className="text-brand-navy w-24"
                      data-testid="input-ranger-initials"
                    />
                    <p className="text-xs text-gray-500">Used for contract acknowledgments</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-display bg-brand-gold hover:bg-brand-gold/90 text-brand-navy shadow-lg"
                    disabled={submitMutation.isPending}
                    data-testid="button-submit-ranger"
                  >
                    {submitMutation.isPending ? "Submitting..." : "Apply for Ranger Tab"}
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    By submitting, you agree to be contacted about your Ranger Tab application.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
