import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Beaker, CheckCircle, ArrowRight, DollarSign, FileCheck, Building } from "lucide-react";

export default function RDTaxCredit() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              R&D Tax Credit
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Research and Development credits for innovative businesses.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: DollarSign, title: "Dollar-for-Dollar", desc: "Direct reduction of tax liability" },
                { icon: Building, title: "All Industries", desc: "Manufacturing, software, engineering & more" },
                { icon: FileCheck, title: "Retroactive", desc: "Claim credits for prior years" }
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <item.icon className="w-10 h-10 text-brand-navy mx-auto mb-4" />
                  <h3 className="font-bold text-brand-navy mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm mb-12">
              <h2 className="text-2xl font-display text-brand-navy mb-6">Qualifying Activities</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Developing new products or processes",
                  "Improving existing products",
                  "Creating prototypes and models",
                  "Software development",
                  "Engineering and design work",
                  "Testing and experimentation",
                  "Patent development",
                  "Manufacturing process improvements"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-navy text-white rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">The Four-Part Test</h3>
              <ol className="space-y-3 text-slate-300">
                <li>1. <strong className="text-white">Technological in Nature</strong> — Relies on hard sciences</li>
                <li>2. <strong className="text-white">Permitted Purpose</strong> — New or improved function, performance, reliability, or quality</li>
                <li>3. <strong className="text-white">Elimination of Uncertainty</strong> — Addresses capability, method, or design uncertainty</li>
                <li>4. <strong className="text-white">Process of Experimentation</strong> — Systematic evaluation of alternatives</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Claim Your R&D Credits</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            We'll analyze your activities and help you maximize your R&D credit.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Get R&D Analysis <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
