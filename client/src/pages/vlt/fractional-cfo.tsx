import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Briefcase, CheckCircle, ArrowRight, Target, LineChart, Users } from "lucide-react";

export default function FractionalCFO() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Fractional CFO
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Executive-level financial leadership—budgeting, forecasting, control systems, and accountability cadence.
            </p>
            <Link 
              href="/veteran-led-tax/intake" 
              className={cn(buttonVariants({ size: "lg" }), "bg-white text-slate-900 hover:bg-slate-100 font-bold px-8")}
            >
              Explore CFO Services <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: Target, title: "Strategic Planning", desc: "Financial roadmaps aligned with goals" },
                { icon: LineChart, title: "Performance Metrics", desc: "KPIs that drive accountability" },
                { icon: Users, title: "Leadership Support", desc: "Partner in your executive decisions" }
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <item.icon className="w-10 h-10 text-brand-navy mx-auto mb-4" />
                  <h3 className="font-bold text-brand-navy mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-display text-brand-navy mb-6">CFO Services Include</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Financial Strategy Development",
                  "Budgeting & Forecasting",
                  "Cash Flow Management",
                  "KPI Dashboard Creation",
                  "Monthly Financial Reviews",
                  "Board & Investor Reporting",
                  "Fundraising Support",
                  "Financial Systems Implementation"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">CFO Expertise, On Your Terms</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Get the financial leadership you need without the full-time commitment.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Schedule CFO Consultation
          </Link>
        </div>
      </section>
    </Layout>
  );
}
