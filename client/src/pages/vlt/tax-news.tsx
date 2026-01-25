import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Newspaper, ArrowRight, Calendar } from "lucide-react";

const articles = [
  { 
    title: "2026 Tax Brackets and Standard Deductions", 
    date: "January 2026", 
    category: "Tax Updates",
    excerpt: "Key changes to tax brackets and deductions for the new year."
  },
  { 
    title: "IRS Announces Extended Filing Season", 
    date: "January 2026", 
    category: "IRS News",
    excerpt: "Important dates and deadlines for the upcoming tax season."
  },
  { 
    title: "New Business Deduction Limits", 
    date: "December 2025", 
    category: "Business",
    excerpt: "Changes to Section 179 and bonus depreciation rules."
  },
  { 
    title: "Retirement Contribution Limits Increase", 
    date: "December 2025", 
    category: "Retirement",
    excerpt: "Updated 401(k) and IRA contribution limits for 2026."
  },
  { 
    title: "Energy Tax Credits Extended", 
    date: "November 2025", 
    category: "Credits",
    excerpt: "Clean energy incentives continue for homeowners and businesses."
  },
  { 
    title: "Estate Tax Exemption Update", 
    date: "November 2025", 
    category: "Estate Planning",
    excerpt: "New exemption amounts and planning considerations."
  }
];

export default function TaxNews() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Tax News
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Stay informed with the latest tax law changes and IRS updates.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {articles.map((article) => (
                <Card key={article.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-brand-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Newspaper className="w-6 h-6 text-brand-navy" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {article.category}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {article.date}
                          </span>
                        </div>
                        <h3 className="font-bold text-brand-navy mb-2">{article.title}</h3>
                        <p className="text-sm text-gray-600">{article.excerpt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Questions About Tax Changes?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Let us help you understand how new laws affect your situation.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Get Expert Guidance
          </Link>
        </div>
      </section>
    </Layout>
  );
}
