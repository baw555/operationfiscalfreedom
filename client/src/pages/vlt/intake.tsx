import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Phone, Mail, MapPin } from "lucide-react";

export default function VLTIntake() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    service: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout>
        <section className="py-20 bg-gray-50 min-h-[60vh] flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-display text-brand-navy mb-4">Intake Received!</h1>
              <p className="text-gray-600 mb-8">
                Thank you for contacting Veteran Led Tax Solutions. Our team will review your information and reach out within 1-2 business days.
              </p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl font-display mb-4">
              Start Your Intake
            </h1>
            <p className="text-lg text-slate-300">
              Tell us about your situation and we'll connect you with the right service.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Intake Form</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="businessName">Business Name (if applicable)</Label>
                        <Input
                          id="businessName"
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="service">Service Needed *</Label>
                        <select
                          id="service"
                          required
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        >
                          <option value="">Select a service...</option>
                          <option value="tax-preparation">Tax Preparation</option>
                          <option value="tax-planning">Tax Planning</option>
                          <option value="tax-resolution">Tax Resolution</option>
                          <option value="tax-recovery">Tax Recovery</option>
                          <option value="payroll">Payroll Services</option>
                          <option value="sales-use-tax">Sales & Use Tax Defense</option>
                          <option value="tax-credits">Tax Credits & Incentives</option>
                          <option value="accounting">Outsourced Accounting</option>
                          <option value="cfo">Fractional CFO</option>
                          <option value="entity">Entity Structuring</option>
                          <option value="other">Other / Not Sure</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="message">Tell Us About Your Situation</Label>
                        <Textarea
                          id="message"
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Describe your current situation and how we can help..."
                        />
                      </div>

                      <button
                        type="submit"
                        className={cn(buttonVariants({ size: "lg" }), "w-full bg-brand-red hover:bg-brand-red/90")}
                      >
                        Submit Intake
                      </button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-brand-navy mb-4">Contact Info</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-brand-navy mt-0.5" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-gray-600 text-sm">Call for immediate assistance</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-brand-navy mt-0.5" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-gray-600 text-sm">support@veteranledtax.com</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-brand-navy mt-0.5" />
                        <div>
                          <p className="font-medium">Nationwide</p>
                          <p className="text-gray-600 text-sm">Remote-first • Secure intake</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-brand-navy text-white">
                  <CardContent className="pt-6">
                    <h3 className="font-bold mb-2">What Happens Next?</h3>
                    <ol className="text-sm text-slate-300 space-y-2">
                      <li>1. We review your intake</li>
                      <li>2. A team member reaches out</li>
                      <li>3. We triage your situation</li>
                      <li>4. Action plan delivered</li>
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
