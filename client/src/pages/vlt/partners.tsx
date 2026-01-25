import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Handshake, Users, Building, TrendingUp, ArrowRight } from "lucide-react";

export default function Partners() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Partner With Us
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Join our network of professionals serving veterans and businesses.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardContent className="p-6">
                  <Users className="w-10 h-10 text-brand-navy mb-4" />
                  <h3 className="text-xl font-bold text-brand-navy mb-2">Referral Partners</h3>
                  <p className="text-gray-600 mb-4">
                    Refer clients to us and earn competitive referral fees. 
                    Perfect for financial advisors, attorneys, and business consultants.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Building className="w-10 h-10 text-brand-navy mb-4" />
                  <h3 className="text-xl font-bold text-brand-navy mb-2">Strategic Partners</h3>
                  <p className="text-gray-600 mb-4">
                    Integrate our tax services into your offerings. 
                    White-label solutions for accounting firms and business service providers.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-display text-brand-navy mb-6">Why Partner With Us?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: Handshake, title: "Veteran Values", desc: "Work with a team that shares your commitment to service" },
                  { icon: TrendingUp, title: "Growth Opportunity", desc: "Expand your service offerings and revenue" },
                  { icon: Users, title: "Client Care", desc: "Know your referrals are in trusted hands" },
                  { icon: Building, title: "Professional Support", desc: "Dedicated partner success team" }
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <item.icon className="w-8 h-8 text-brand-navy flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-brand-navy">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Become a Partner</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can work together.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Contact Us <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
