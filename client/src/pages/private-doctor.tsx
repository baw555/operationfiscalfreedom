import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Shield, CheckCircle, AlertTriangle, FileText, Stethoscope } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function PrivateDoctor() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    zip: "",
    branch: "",
    careType: "",
    situation: "",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/private-doctor-requests", {
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
        description: "We'll contact you within 24-48 hours with provider options.",
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.zip || !formData.branch || !formData.careType) {
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
        <section className="min-h-[60vh] bg-brand-red flex items-center justify-center py-12 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle className="text-brand-red w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-display text-white mb-4">Request Received!</h1>
            <p className="text-base sm:text-xl text-white/90 max-w-xl mx-auto mb-6 sm:mb-8 px-2">
              Our team will contact you within 24-48 hours with information about approved private healthcare providers in your area.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline" className="border-white text-white hover:bg-white hover:text-brand-red">
              Submit Another Request
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-gradient-to-b from-red-700 to-red-800 text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 border border-white/40 text-white mb-4 sm:mb-6">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">Don't Wait Months For Care</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6">VA Taking Too Long?</h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-red-200 mb-4 sm:mb-6">You Have The Right To See A Private Doctor</h2>
          <p className="text-base sm:text-xl text-red-100 max-w-3xl mx-auto px-2">
            Under the VA MISSION Act, veterans can access private healthcare when VA wait times exceed standards. 
            Stop waiting months for appointments — get the care you deserve now.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-display text-brand-navy mb-3 sm:mb-4">The VA MISSION Act: Your Rights</h2>
            <div className="w-16 sm:w-24 h-1 bg-brand-gold mx-auto mb-4 sm:mb-6" />
            <p className="text-sm sm:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              The VA Maintaining Internal Systems and Strengthening Integrated Outside Networks (MISSION) Act of 2018 
              expanded veterans' ability to receive care from private providers when the VA cannot meet certain access standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-16">
            {[
              { 
                icon: Clock, 
                title: "Wait Time Standards", 
                desc: "If VA can't schedule a primary care appointment within 20 days or specialty care within 28 days, you may be eligible for community care." 
              },
              { 
                icon: Shield, 
                title: "Drive Time Standards", 
                desc: "If the nearest VA facility is more than 30 minutes away for primary care or 60 minutes for specialty care, you can access private providers." 
              },
              { 
                icon: Stethoscope, 
                title: "Best Medical Interest", 
                desc: "Your VA provider can refer you to community care if it's in your best medical interest, even if other criteria aren't met." 
              },
              { 
                icon: FileText, 
                title: "Service Unavailable", 
                desc: "When the VA doesn't offer the specific service you need, community care is available to fill that gap." 
              },
              { 
                icon: CheckCircle, 
                title: "Quality of Care", 
                desc: "VA may authorize community care if it cannot provide care that meets quality standards for that particular service." 
              },
              { 
                icon: AlertTriangle, 
                title: "Grandfathered Options", 
                desc: "Veterans who were eligible under previous programs may still qualify under grandfathered eligibility criteria." 
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-navy/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 text-brand-navy">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            <div>
              <h2 className="text-2xl sm:text-4xl font-display mb-4 sm:mb-6">How We Help</h2>
              <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8">
                Navigating VA Community Care can be confusing. We connect you with verified private healthcare providers 
                who understand veteran needs and accept VA referrals.
              </p>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-red/20 flex items-center justify-center shrink-0">
                    <span className="text-brand-red font-bold text-sm sm:text-base">1</span>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white mb-1">Submit Your Information</h4>
                    <p className="text-sm sm:text-base text-gray-400">Tell us about your situation and healthcare needs.</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-red/20 flex items-center justify-center shrink-0">
                    <span className="text-brand-red font-bold text-sm sm:text-base">2</span>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white mb-1">We Find Providers</h4>
                    <p className="text-sm sm:text-base text-gray-400">We locate approved community care providers in your area.</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-red/20 flex items-center justify-center shrink-0">
                    <span className="text-brand-red font-bold text-sm sm:text-base">3</span>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white mb-1">Get Connected</h4>
                    <p className="text-sm sm:text-base text-gray-400">We provide you with provider information and guidance on next steps.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm sm:text-base text-gray-300 italic">
                  "I waited 4 months for a VA appointment. With the MISSION Act, I saw a private specialist in 2 weeks. 
                  Same quality care, no more waiting."
                </p>
                <p className="text-white font-bold mt-2 text-sm sm:text-base">— Army Veteran, Texas</p>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-8 rounded-xl shadow-xl">
              <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-4 sm:mb-6 text-center">Request Private Doctor Information</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-brand-navy text-sm">First Name *</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      required 
                      data-testid="input-first-name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-brand-navy text-sm">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      required 
                      data-testid="input-last-name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-brand-navy text-sm">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    data-testid="input-email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-brand-navy text-sm">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="(555) 123-4567" 
                    required 
                    data-testid="input-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip" className="text-brand-navy text-sm">ZIP Code *</Label>
                  <Input 
                    id="zip" 
                    placeholder="12345" 
                    required 
                    data-testid="input-zip"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-brand-navy text-sm">Branch of Service *</Label>
                  <select 
                    id="branch" 
                    className="w-full h-10 rounded-md border border-gray-300 bg-white text-brand-navy px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red" 
                    required 
                    data-testid="select-branch"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  >
                    <option value="">Select Branch</option>
                    <option value="army">Army</option>
                    <option value="navy">Navy</option>
                    <option value="marines">Marines</option>
                    <option value="airforce">Air Force</option>
                    <option value="coastguard">Coast Guard</option>
                    <option value="spaceforce">Space Force</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="careType" className="text-brand-navy text-sm">Type of Care Needed *</Label>
                  <select 
                    id="careType" 
                    className="w-full h-10 rounded-md border border-gray-300 bg-white text-brand-navy px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red" 
                    required 
                    data-testid="select-care-type"
                    value={formData.careType}
                    onChange={(e) => setFormData({ ...formData, careType: e.target.value })}
                  >
                    <option value="">Select Type</option>
                    <option value="primary">Primary Care</option>
                    <option value="specialty">Specialty Care</option>
                    <option value="mental">Mental Health</option>
                    <option value="dental">Dental</option>
                    <option value="vision">Vision</option>
                    <option value="physical">Physical Therapy</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="situation" className="text-brand-navy text-sm">Describe Your Situation</Label>
                  <Textarea 
                    id="situation" 
                    placeholder="How long have you been waiting? What care do you need?" 
                    className="min-h-[100px] sm:min-h-[120px]"
                    data-testid="textarea-situation"
                    value={formData.situation}
                    onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11 sm:h-12"
                  data-testid="button-submit"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Submitting..." : "Get Private Doctor Information"}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  We'll contact you within 24-48 hours with provider options in your area.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-display text-brand-navy mb-4 sm:mb-6">Important Information</h2>
          <div className="max-w-3xl mx-auto bg-white p-4 sm:p-8 rounded-xl border border-gray-200 text-left">
            <div className="space-y-4 text-sm sm:text-base text-gray-600">
              <p>
                <strong className="text-brand-navy">The VA MISSION Act</strong> was signed into law on June 6, 2018, and significantly expanded 
                veterans' options for receiving healthcare outside the VA system. It consolidated previous community care programs 
                (Veterans Choice Program, PC3, and others) into a single Community Care Network.
              </p>
              <p>
                <strong className="text-brand-navy">Eligibility:</strong> You must be enrolled in VA healthcare to be eligible for community care. 
                Your eligibility is determined based on wait times, drive times, service availability, and your VA provider's clinical recommendation.
              </p>
              <p>
                <strong className="text-brand-navy">No Additional Cost:</strong> When you receive approved community care, you pay the same copays 
                you would pay at a VA facility. The VA covers the cost of your care with community providers.
              </p>
              <p className="text-brand-navy font-bold">
                Don't suffer while waiting for VA appointments. You've earned better. Exercise your rights under the MISSION Act today.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
