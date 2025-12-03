import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Rocket, CheckCircle2 } from "lucide-react";

export default function ApplyWebsite() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold mb-6">
            <Rocket className="w-4 h-4" />
            <span className="font-bold text-sm uppercase tracking-wider">Veteran Entrepreneurship Program</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display mb-6">Launch Your Veteran-Owned Business</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We build fully functional, professional websites for veteran-owned startups — completely free of charge. Apply below to get started.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
            <div className="mb-10">
              <h2 className="text-2xl font-display text-brand-navy mb-4">Business Application</h2>
              <p className="text-gray-600">
                Tell us about your business idea. We select promising veteran-led ventures to support with free technical infrastructure.
              </p>
            </div>

            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="jane@example.com" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch of Service</Label>
                  <Select>
                    <SelectTrigger>
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
                  <Label htmlFor="status">Service Status</Label>
                  <Select>
                    <SelectTrigger>
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
                <Label htmlFor="businessName">Proposed Business Name</Label>
                <Input id="businessName" placeholder="e.g. Tactical Logistics Solutions" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="services">Professional Services</SelectItem>
                    <SelectItem value="retail">Retail / E-commerce</SelectItem>
                    <SelectItem value="construction">Construction / Trades</SelectItem>
                    <SelectItem value="tech">Technology / Software</SelectItem>
                    <SelectItem value="logistics">Logistics / Transport</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your business idea, your target market, and what makes it unique..." 
                  className="min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="needs">Website Needs</Label>
                <Textarea 
                  id="needs" 
                  placeholder="What features do you need? (e.g. Booking system, Online store, Portfolio, Blog...)" 
                  className="min-h-[100px]"
                />
              </div>

              <div className="bg-brand-green/5 border border-brand-green/20 p-6 rounded-lg space-y-4">
                <h3 className="font-bold text-brand-navy flex items-center gap-2">
                  <CheckCircle2 className="text-brand-green w-5 h-5" />
                  What's Included in the Grant:
                </h3>
                <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-green" /> Custom Design & Development</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-green" /> Mobile Responsive Layout</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-green" /> SEO Optimization Setup</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-green" /> Hosting & Domain Setup Help</li>
                </ul>
                <div className="mt-4 pt-4 border-t border-brand-green/20 text-center">
                  <p className="text-brand-green font-bold italic">
                    "If accepted, you could have a website like this completed the same day"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm font-normal text-gray-600 leading-tight">
                  I certify that I am a U.S. military veteran or active service member and that this business is/will be at least 51% veteran-owned.
                </Label>
              </div>

              <Button className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black font-bold h-14 text-lg shadow-lg">
                Submit Application
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
