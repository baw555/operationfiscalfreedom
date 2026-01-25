import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Award, Beaker, Zap, Users, Heart, Accessibility, ArrowRight } from "lucide-react";

const credits = [
  {
    title: "R&D Tax Credit",
    description: "Research and development credits for innovative businesses",
    icon: Beaker,
    href: "/veteran-led-tax/services/tax-credits/rd-tax-credit",
    color: "blue"
  },
  {
    title: "WOTC",
    description: "Work Opportunity Tax Credit for hiring eligible employees",
    icon: Users,
    href: "/veteran-led-tax/services/tax-credits/wotc",
    color: "green"
  },
  {
    title: "Energy Tax Credits",
    description: "Clean energy incentives for homes and businesses",
    icon: Zap,
    href: "/veteran-led-tax/services/tax-credits/energy-tax-credits",
    color: "amber"
  },
  {
    title: "Paid Family Leave Credit",
    description: "Credits for employers offering paid family leave",
    icon: Heart,
    href: "/veteran-led-tax/services/tax-credits/paid-family-leave-credit",
    color: "pink"
  },
  {
    title: "Disabled Access Credit",
    description: "Credits for small businesses improving accessibility",
    icon: Accessibility,
    href: "/veteran-led-tax/services/tax-credits/disabled-access-credit",
    color: "purple"
  }
];

const colorClasses: Record<string, { bg: string; icon: string }> = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600" },
  green: { bg: "bg-green-50", icon: "text-green-600" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600" },
  pink: { bg: "bg-pink-50", icon: "text-pink-600" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600" }
};

export default function TaxCredits() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Tax Credits & Incentives
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Maximize your savings with federal and state tax credit programs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {credits.map((credit) => {
                const colors = colorClasses[credit.color];
                const Icon = credit.icon;
                return (
                  <Link key={credit.title} href={credit.href}>
                    <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", colors.bg)}>
                          <Icon className={cn("w-6 h-6", colors.icon)} />
                        </div>
                        <h3 className="font-bold text-brand-navy mb-2">{credit.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{credit.description}</p>
                        <span className="text-brand-red text-sm font-medium flex items-center gap-1">
                          Learn More <ArrowRight className="w-4 h-4" />
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
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Don't Leave Money on the Table</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Many businesses miss out on valuable tax credits. Let us help you claim what you've earned.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Get Credit Analysis
          </Link>
        </div>
      </section>
    </Layout>
  );
}
