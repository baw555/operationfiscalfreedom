import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Zap, CheckCircle, ArrowRight, Sun, Home, Building } from "lucide-react";

export default function EnergyTaxCredits() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Energy Tax Credits
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Clean energy incentives for homes and businesses.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: Sun, title: "Solar Credits", desc: "Up to 30% of installation costs" },
                { icon: Home, title: "Home Improvements", desc: "Energy-efficient upgrades" },
                { icon: Building, title: "Commercial", desc: "Business energy investments" }
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <item.icon className="w-10 h-10 text-brand-navy mx-auto mb-4" />
                  <h3 className="font-bold text-brand-navy mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm mb-12">
              <h2 className="text-2xl font-display text-brand-navy mb-6">Qualifying Improvements</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Solar panels and solar water heaters",
                  "Wind turbines",
                  "Geothermal heat pumps",
                  "Battery storage systems",
                  "Energy-efficient windows and doors",
                  "Insulation and air sealing",
                  "Heat pumps and HVAC systems",
                  "Electric vehicle chargers"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-navy text-white rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Key Credits</h3>
              <ul className="space-y-3 text-slate-300">
                <li><strong className="text-white">Residential Clean Energy Credit:</strong> 30% of costs for solar, wind, geothermal, and battery storage</li>
                <li><strong className="text-white">Energy Efficient Home Improvement Credit:</strong> Up to $3,200/year for qualifying upgrades</li>
                <li><strong className="text-white">Commercial Clean Energy:</strong> Investment and production tax credits for businesses</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Claim Your Energy Credits</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            We'll help you identify and claim all available energy incentives.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Get Energy Credit Help <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
