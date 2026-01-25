import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { FileText, CheckCircle, ArrowRight, Clock, Shield, Users } from "lucide-react";

export default function TaxPreparation() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Tax Preparation
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Streamlined intake, secure document handling, and predictable filing workflows for individuals and businesses.
            </p>
            <Link 
              href="/veteran-led-tax/intake" 
              className={cn(buttonVariants({ size: "lg" }), "bg-white text-slate-900 hover:bg-slate-100 font-bold px-8")}
            >
              Start Your Tax Prep <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: Clock, title: "Fast Turnaround", desc: "Efficient processing with clear timelines" },
                { icon: Shield, title: "Secure & Compliant", desc: "Your data protected at every step" },
                { icon: Users, title: "Personal Support", desc: "Real humans answering your questions" }
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <item.icon className="w-10 h-10 text-brand-navy mx-auto mb-4" />
                  <h3 className="font-bold text-brand-navy mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-display text-brand-navy mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Individual 1040 Returns",
                  "Business Returns (1120, 1120-S, 1065)",
                  "Partnership & S-Corp Filings",
                  "Self-Employment Tax",
                  "Rental Property Income",
                  "Investment Income Reporting",
                  "Multi-State Filing",
                  "Prior Year Returns"
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
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Ready to File?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Start your secure intake process today. We'll handle the rest.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Begin Tax Preparation
          </Link>
        </div>
      </section>
    </Layout>
  );
}
