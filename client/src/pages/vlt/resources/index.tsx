import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, Shield, DollarSign, FileText, 
  Building, BookOpen, ArrowRight 
} from "lucide-react";

const resources = [
  {
    title: "IRS Notices",
    description: "Understanding and responding to IRS notices",
    icon: AlertTriangle,
    href: "/veteran-led-tax/resources/irs-notices",
    color: "amber"
  },
  {
    title: "Audit Representation",
    description: "Professional representation before the IRS",
    icon: Shield,
    href: "/veteran-led-tax/resources/audit-representation",
    color: "blue"
  },
  {
    title: "Wage Garnishments",
    description: "Stop garnishments and protect your paycheck",
    icon: DollarSign,
    href: "/veteran-led-tax/resources/wage-garnishments",
    color: "red"
  },
  {
    title: "Forms & Letters",
    description: "Common IRS forms and templates",
    icon: FileText,
    href: "/veteran-led-tax/resources/forms-and-letters",
    color: "slate"
  },
  {
    title: "Business Loans",
    description: "Funding resources for veteran businesses",
    icon: Building,
    href: "/veteran-led-tax/resources/business-loans",
    color: "green"
  },
  {
    title: "Guides",
    description: "Educational materials and best practices",
    icon: BookOpen,
    href: "/veteran-led-tax/resources/guides",
    color: "purple"
  }
];

const colorClasses: Record<string, { bg: string; icon: string }> = {
  amber: { bg: "bg-amber-50", icon: "text-amber-600" },
  blue: { bg: "bg-blue-50", icon: "text-blue-600" },
  red: { bg: "bg-red-50", icon: "text-red-600" },
  slate: { bg: "bg-slate-50", icon: "text-slate-600" },
  green: { bg: "bg-green-50", icon: "text-green-600" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600" }
};

export default function Resources() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Resources
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Educational content and tools to help you understand your tax situation.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => {
                const colors = colorClasses[resource.color];
                const Icon = resource.icon;
                return (
                  <Link key={resource.title} href={resource.href}>
                    <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", colors.bg)}>
                          <Icon className={cn("w-6 h-6", colors.icon)} />
                        </div>
                        <h3 className="font-bold text-brand-navy mb-2">{resource.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                        <span className="text-brand-red text-sm font-medium flex items-center gap-1">
                          View Resource <ArrowRight className="w-4 h-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Need Personal Assistance?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Our team is ready to help with your specific situation.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Start Your Intake
          </Link>
        </div>
      </section>
    </Layout>
  );
}
