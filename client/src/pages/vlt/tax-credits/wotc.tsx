import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Users, CheckCircle, ArrowRight, DollarSign, Award, FileCheck } from "lucide-react";

export default function WOTCCredit() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Work Opportunity Tax Credit
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Earn tax credits for hiring from eligible target groups.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: DollarSign, title: "Up to $9,600", desc: "Per eligible employee hired" },
                { icon: Award, title: "Veteran Bonus", desc: "Higher credits for veteran hires" },
                { icon: FileCheck, title: "Easy Process", desc: "Simple screening at hire" }
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <item.icon className="w-10 h-10 text-brand-navy mx-auto mb-4" />
                  <h3 className="font-bold text-brand-navy mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm mb-12">
              <h2 className="text-2xl font-display text-brand-navy mb-6">Eligible Target Groups</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Veterans (including disabled veterans)",
                  "Long-term unemployed (27+ weeks)",
                  "SNAP recipients",
                  "TANF recipients",
                  "Designated community residents",
                  "Vocational rehabilitation referrals",
                  "Ex-felons",
                  "SSI recipients",
                  "Summer youth employees",
                  "Long-term family assistance recipients"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-navy text-white rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Credit Amounts</h3>
              <div className="grid md:grid-cols-2 gap-4 text-slate-300">
                <div>
                  <p><strong className="text-white">Most Target Groups:</strong></p>
                  <p>40% of first $6,000 in wages = $2,400</p>
                </div>
                <div>
                  <p><strong className="text-white">Disabled Veterans:</strong></p>
                  <p>40% of first $24,000 in wages = $9,600</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Start Claiming WOTC</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            We'll set up screening and help you maximize hiring credits.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Get WOTC Help <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
