import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail, Globe, ArrowRight } from "lucide-react";

export default function Locations() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Locations
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Serving veterans and businesses nationwide with remote-first tax services.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-sm mb-12">
              <div className="flex items-start gap-4 mb-6">
                <Globe className="w-8 h-8 text-brand-navy flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-display text-brand-navy mb-2">Nationwide Service</h2>
                  <p className="text-gray-600">
                    We serve clients in all 50 states through our secure, remote-first platform. 
                    No matter where you're located, you can access our full range of tax services.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-brand-navy flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-brand-navy">Phone Support</p>
                    <p className="text-sm text-gray-600">Available for consultations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand-navy flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-brand-navy">Email</p>
                    <p className="text-sm text-gray-600">support@veteranledtax.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-navy flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-brand-navy">Remote-First</p>
                    <p className="text-sm text-gray-600">Secure virtual meetings</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-navy text-white rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Why Remote-First?</h3>
              <ul className="space-y-3 text-slate-300">
                <li>• <strong className="text-white">Convenience</strong> — Work with us from anywhere, anytime</li>
                <li>• <strong className="text-white">Security</strong> — Bank-level encryption for all documents</li>
                <li>• <strong className="text-white">Efficiency</strong> — No travel time, faster turnaround</li>
                <li>• <strong className="text-white">Accessibility</strong> — Serve more veterans nationwide</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Ready to Get Started?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Begin your intake from anywhere in the country.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Start Your Intake <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
