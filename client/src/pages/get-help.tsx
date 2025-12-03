import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Shield, Clock, HeartHandshake } from "lucide-react";
import { useLocation } from "wouter";

const helpTypes = [
  { value: "disability_denial", label: "Disability Rating Denial" },
  { value: "appeal", label: "VA Claim Appeal" },
  { value: "low_rating", label: "Low VA Rating" },
  { value: "exam_issues", label: "C&P Exam Issues" },
  { value: "service_connection", label: "Service-Connection Dispute" },
  { value: "other", label: "Other" },
];

export default function GetHelp() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    helpType: "",
    otherHelpType: "",
    description: "",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/help-requests", {
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
        description: "A veteran advocate will contact you soon.",
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
    submitMutation.mutate(formData);
  };

  if (submitted) {
    return (
      <Layout>
        <section className="bg-brand-navy text-white py-20 text-center">
          <div className="container mx-auto px-4">
            <CheckCircle className="h-20 w-20 text-brand-green mx-auto mb-6" />
            <h1 className="text-5xl font-display mb-6">Help Request Received!</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Your request has been submitted. One of our veteran advocates will review your case and 
              contact you within 24-48 hours. We're here to help you get the rating you deserve.
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
          <h1 className="text-5xl font-display mb-6">Get Help With Your VA Claim</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Struggling with your disability rating or VA claim? Our veteran advocates are here to help you 
            navigate the system and get the benefits you deserve.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Shield className="h-12 w-12 text-brand-navy mx-auto mb-4" />
              <h3 className="font-display text-xl text-brand-navy mb-2">Expert Guidance</h3>
              <p className="text-gray-600 text-sm">Veterans helping veterans navigate the VA system</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Clock className="h-12 w-12 text-brand-green mx-auto mb-4" />
              <h3 className="font-display text-xl text-brand-navy mb-2">Fast Response</h3>
              <p className="text-gray-600 text-sm">Get a response within 24-48 hours</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <HeartHandshake className="h-12 w-12 text-brand-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-brand-navy mb-2">Free Support</h3>
              <p className="text-gray-600 text-sm">No cost for initial consultation</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="font-display text-3xl text-brand-navy mb-6 text-center">Request Help</h2>
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
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
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
              <Button 
                type="submit"
                className="w-full bg-brand-navy text-white font-bold h-12"
                disabled={submitMutation.isPending}
                data-testid="button-submit-request"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Help Request"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
