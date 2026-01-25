import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { FileText, Download, ArrowRight } from "lucide-react";

const forms = [
  { name: "Form 1040", description: "U.S. Individual Income Tax Return", category: "Individual" },
  { name: "Form 1040-X", description: "Amended U.S. Individual Income Tax Return", category: "Individual" },
  { name: "Form 4868", description: "Application for Automatic Extension", category: "Individual" },
  { name: "Form 1120", description: "U.S. Corporation Income Tax Return", category: "Business" },
  { name: "Form 1120-S", description: "U.S. Income Tax Return for S Corporation", category: "Business" },
  { name: "Form 1065", description: "U.S. Return of Partnership Income", category: "Business" },
  { name: "Form 941", description: "Employer's Quarterly Federal Tax Return", category: "Payroll" },
  { name: "Form 940", description: "Employer's Annual Federal Unemployment Tax Return", category: "Payroll" },
  { name: "Form 9465", description: "Installment Agreement Request", category: "Resolution" },
  { name: "Form 656", description: "Offer in Compromise", category: "Resolution" },
  { name: "Form 843", description: "Claim for Refund and Request for Abatement", category: "Resolution" },
  { name: "Form 2848", description: "Power of Attorney and Declaration of Representative", category: "Authorization" }
];

export default function FormsAndLetters() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions Resources
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Forms & Letters
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Common IRS forms and resources for tax filing and resolution.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map((form) => (
                <Card key={form.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-brand-navy flex-shrink-0 mt-1" />
                      <div>
                        <span className="font-bold text-brand-navy">{form.name}</span>
                        <p className="text-sm text-gray-600">{form.description}</p>
                        <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-2">
                          {form.category}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-display text-brand-navy mb-4">Need Help With Forms?</h2>
              <p className="text-gray-600 mb-6">
                Don't struggle with complex IRS forms alone. Our team can help you complete 
                and file the right forms for your situation, ensuring accuracy and compliance.
              </p>
              <Link 
                href="/veteran-led-tax/intake" 
                className={cn(buttonVariants(), "bg-brand-red hover:bg-brand-red/90")}
              >
                Get Filing Help <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
