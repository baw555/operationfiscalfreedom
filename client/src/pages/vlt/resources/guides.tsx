import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { BookOpen, FileText, ArrowRight } from "lucide-react";

const guides = [
  { 
    title: "Tax Planning Essentials", 
    description: "Key strategies for reducing your tax burden legally",
    category: "Planning"
  },
  { 
    title: "Small Business Tax Guide", 
    description: "Everything small business owners need to know about taxes",
    category: "Business"
  },
  { 
    title: "IRS Audit Survival Guide", 
    description: "What to expect and how to prepare for an IRS audit",
    category: "Resolution"
  },
  { 
    title: "Quarterly Tax Deadlines", 
    description: "Important dates every business owner should know",
    category: "Compliance"
  },
  { 
    title: "Entity Selection Guide", 
    description: "Choosing the right business structure",
    category: "Business"
  },
  { 
    title: "Year-End Tax Checklist", 
    description: "Tasks to complete before December 31st",
    category: "Planning"
  },
  { 
    title: "Recordkeeping Best Practices", 
    description: "How to organize documents for tax compliance",
    category: "Compliance"
  },
  { 
    title: "Veteran Business Owner Guide", 
    description: "Special tax benefits and programs for veterans",
    category: "Veterans"
  }
];

export default function Guides() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions Resources
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Guides & Resources
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Educational materials to help you understand taxes and make better decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {guides.map((guide) => (
                <Card key={guide.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-brand-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-brand-navy" />
                      </div>
                      <div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {guide.category}
                        </span>
                        <h3 className="font-bold text-brand-navy mt-2 mb-1">{guide.title}</h3>
                        <p className="text-sm text-gray-600">{guide.description}</p>
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
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Need Personalized Guidance?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Our team can provide tailored advice for your specific situation.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Get Expert Help <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
