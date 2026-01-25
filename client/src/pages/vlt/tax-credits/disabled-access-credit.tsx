import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Accessibility, CheckCircle, ArrowRight, DollarSign, Building, Users } from "lucide-react";

export default function DisabledAccessCredit() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Disabled Access Credit
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Tax credits for small businesses improving accessibility.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: DollarSign, title: "Up to $5,000", desc: "Annual tax credit" },
                { icon: Building, title: "Small Business", desc: "For qualifying small businesses" },
                { icon: Users, title: "ADA Compliance", desc: "Support accessibility improvements" }
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <item.icon className="w-10 h-10 text-brand-navy mx-auto mb-4" />
                  <h3 className="font-bold text-brand-navy mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm mb-12">
              <h2 className="text-2xl font-display text-brand-navy mb-6">Qualifying Expenses</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Removing architectural barriers",
                  "Providing accessible formats (Braille, audio)",
                  "Acquiring adaptive equipment",
                  "Providing qualified interpreters",
                  "Making vehicles accessible",
                  "Modifying equipment for accessibility"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-navy text-white rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Eligibility Requirements</h3>
              <ul className="space-y-3 text-slate-300">
                <li><strong className="text-white">Revenue:</strong> $1 million or less in prior year, OR</li>
                <li><strong className="text-white">Employees:</strong> 30 or fewer full-time employees</li>
                <li><strong className="text-white">Credit:</strong> 50% of eligible expenses between $250 and $10,250</li>
                <li><strong className="text-white">Maximum:</strong> $5,000 annual credit</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Claim Your Access Credit</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            We'll help you identify qualifying improvements and claim credits.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Get Access Credit Help <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
