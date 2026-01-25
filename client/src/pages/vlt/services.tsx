import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { 
  FileText, Calculator, Shield, DollarSign, Users, Scale,
  Award, BookOpen, Briefcase, Building, ArrowRight
} from "lucide-react";

const services = [
  {
    title: "Tax Preparation",
    description: "Streamlined intake, secure docs, and predictable filing workflows.",
    icon: FileText,
    href: "/veteran-led-tax/services/tax-preparation",
    color: "blue"
  },
  {
    title: "Tax Planning",
    description: "Proactive planning to reduce taxes legally with clear strategy.",
    icon: Calculator,
    href: "/veteran-led-tax/services/tax-planning",
    color: "green"
  },
  {
    title: "Tax Resolution",
    description: "Back taxes, notices, audits, and disputes—triage and execute.",
    icon: Shield,
    href: "/veteran-led-tax/services/tax-resolution",
    color: "red"
  },
  {
    title: "Tax Recovery",
    description: "Review overpayments and amendment opportunities.",
    icon: DollarSign,
    href: "/veteran-led-tax/services/tax-recovery",
    color: "amber"
  },
  {
    title: "Payroll",
    description: "Reliable payroll processing, tax deposits, and compliance.",
    icon: Users,
    href: "/veteran-led-tax/services/payroll",
    color: "purple"
  },
  {
    title: "Sales & Use Tax Defense",
    description: "Navigate state sales tax audits and disputes.",
    icon: Scale,
    href: "/veteran-led-tax/services/sales-use-tax-defense",
    color: "slate"
  },
  {
    title: "Tax Credits & Incentives",
    description: "Maximize savings with federal and state tax credits.",
    icon: Award,
    href: "/veteran-led-tax/services/tax-credits-incentives",
    color: "emerald"
  },
  {
    title: "Outsourced Accounting",
    description: "Clean books, clear decisions—monthly close and reports.",
    icon: BookOpen,
    href: "/veteran-led-tax/services/outsourced-accounting",
    color: "indigo"
  },
  {
    title: "Fractional CFO",
    description: "Executive-level financial leadership on your terms.",
    icon: Briefcase,
    href: "/veteran-led-tax/services/fractional-cfo",
    color: "teal"
  },
  {
    title: "Entity Structuring",
    description: "Choose and set up the right business structure.",
    icon: Building,
    href: "/veteran-led-tax/services/entity-structuring",
    color: "orange"
  }
];

const colorClasses: Record<string, { bg: string; border: string; icon: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-500", icon: "text-blue-600" },
  green: { bg: "bg-green-50", border: "border-green-500", icon: "text-green-600" },
  red: { bg: "bg-red-50", border: "border-red-500", icon: "text-red-600" },
  amber: { bg: "bg-amber-50", border: "border-amber-500", icon: "text-amber-600" },
  purple: { bg: "bg-purple-50", border: "border-purple-500", icon: "text-purple-600" },
  slate: { bg: "bg-slate-50", border: "border-slate-500", icon: "text-slate-600" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-500", icon: "text-emerald-600" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-500", icon: "text-indigo-600" },
  teal: { bg: "bg-teal-50", border: "border-teal-500", icon: "text-teal-600" },
  orange: { bg: "bg-orange-50", border: "border-orange-500", icon: "text-orange-600" }
};

export default function Services() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Our Services
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Comprehensive tax and financial services with military precision and veteran-led expertise.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const colors = colorClasses[service.color];
                const Icon = service.icon;
                return (
                  <Link key={service.title} href={service.href}>
                    <Card className={cn("border-l-4 hover:shadow-lg transition-all cursor-pointer h-full", colors.border)}>
                      <CardContent className="p-6">
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", colors.bg)}>
                          <Icon className={cn("w-6 h-6", colors.icon)} />
                        </div>
                        <h3 className="font-bold text-brand-navy mb-2">{service.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{service.description}</p>
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
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Not Sure What You Need?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Start with an intake and we'll help you identify the right services for your situation.
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
