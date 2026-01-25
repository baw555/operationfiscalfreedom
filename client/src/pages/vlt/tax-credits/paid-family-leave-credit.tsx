import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Heart, CheckCircle, ArrowRight, DollarSign, Users, Calendar } from "lucide-react";

export default function PaidFamilyLeaveCredit() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Paid Family Leave Credit
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Tax credits for employers offering paid family and medical leave.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: DollarSign, title: "12.5-25%", desc: "Of wages paid during leave" },
                { icon: Users, title: "Employee Benefit", desc: "Attract and retain talent" },
                { icon: Calendar, title: "Up to 12 Weeks", desc: "Qualifying leave period" }
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <item.icon className="w-10 h-10 text-brand-navy mx-auto mb-4" />
                  <h3 className="font-bold text-brand-navy mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm mb-12">
              <h2 className="text-2xl font-display text-brand-navy mb-6">Credit Requirements</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Written paid family leave policy",
                  "At least 2 weeks of paid leave",
                  "50% or more of regular wages",
                  "Available to all qualifying employees",
                  "Employees with less than 1 year tenure",
                  "Employees earning 60% or less of highly compensated threshold"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-navy text-white rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Credit Calculation</h3>
              <ul className="space-y-3 text-slate-300">
                <li><strong className="text-white">Base Credit:</strong> 12.5% of wages paid during leave (at 50% wage replacement)</li>
                <li><strong className="text-white">Maximum Credit:</strong> 25% of wages (at 100% wage replacement)</li>
                <li><strong className="text-white">Increase:</strong> Credit increases 0.25% for each % above 50% wage replacement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Claim Your PFML Credit</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            We'll help you set up a qualifying policy and claim credits.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Get PFML Help <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
