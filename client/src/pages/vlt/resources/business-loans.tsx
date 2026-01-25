import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { DollarSign, Building, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

const loanTypes = [
  { name: "SBA 7(a) Loans", description: "Most common SBA loan for general business purposes", amount: "Up to $5M" },
  { name: "SBA 504 Loans", description: "For major fixed assets like real estate and equipment", amount: "Up to $5.5M" },
  { name: "SBA Microloans", description: "Smaller loans for startups and small businesses", amount: "Up to $50K" },
  { name: "Business Lines of Credit", description: "Flexible access to funds as needed", amount: "Varies" },
  { name: "Equipment Financing", description: "Loans secured by business equipment", amount: "Based on equipment value" },
  { name: "Working Capital Loans", description: "Short-term funding for day-to-day operations", amount: "Varies" }
];

export default function BusinessLoans() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions Resources
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Business Loan Resources
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Funding options to grow your veteran-owned business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: DollarSign, title: "Competitive Rates", desc: "Access to favorable loan terms" },
                { icon: Building, title: "Veteran Programs", desc: "Special programs for veteran-owned businesses" },
                { icon: TrendingUp, title: "Growth Capital", desc: "Fund expansion and opportunities" }
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <item.icon className="w-10 h-10 text-brand-navy mx-auto mb-4" />
                  <h3 className="font-bold text-brand-navy mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-display text-brand-navy mb-6">Loan Types</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {loanTypes.map((loan) => (
                <Card key={loan.name}>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-brand-navy mb-2">{loan.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{loan.description}</p>
                    <span className="inline-block text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                      {loan.amount}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-display text-brand-navy mb-6">Getting Loan-Ready</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Clean, up-to-date financial statements",
                  "Strong business credit history",
                  "Clear business plan",
                  "Tax returns current and filed",
                  "No outstanding tax liens",
                  "Proper entity structure"
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
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Get Loan-Ready</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            We'll help you get your financials in order for successful loan applications.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Start Financial Prep <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
