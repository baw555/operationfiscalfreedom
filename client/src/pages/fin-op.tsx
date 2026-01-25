import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { 
  FileText, Calculator, Shield, TrendingUp, BookOpen, 
  DollarSign, Building, ClipboardCheck, PlayCircle, 
  CheckCircle, ArrowRight, Phone, Users, Briefcase
} from "lucide-react";

const programs = [
  {
    category: "Tax & Compliance",
    items: [
      {
        title: "Tax Preparation",
        description: "Streamlined intake, secure docs, and predictable filing workflows for individuals and businesses.",
        icon: FileText,
        color: "blue"
      },
      {
        title: "Tax Planning",
        description: "Proactive planning: reduce taxes legally with clear strategy and pre-year-end execution.",
        icon: Calculator,
        color: "green"
      },
      {
        title: "Tax Resolution",
        description: "Back taxes, notices, audits, and disputes—triage + action plan, then execute the pathway.",
        icon: Shield,
        color: "red"
      },
      {
        title: "Tax Recovery",
        description: "Review overpayments and amendment opportunities where appropriate—built around documentation.",
        icon: DollarSign,
        color: "amber"
      }
    ]
  },
  {
    category: "Business Ops",
    items: [
      {
        title: "Bookkeeping / Reporting",
        description: "Clean books, clean decisions—monthly close, reports, and financial hygiene.",
        icon: BookOpen,
        color: "purple"
      },
      {
        title: "Profit Optimization",
        description: "Improve margins with KPI discipline, expense controls, and operational execution support.",
        icon: TrendingUp,
        color: "emerald"
      },
      {
        title: "Fractional CFO",
        description: "Budgeting, forecasting, control systems, and accountability cadence.",
        icon: Briefcase,
        color: "indigo"
      }
    ]
  },
  {
    category: "Structure",
    items: [
      {
        title: "Entity Structuring",
        description: "Choose and set up the right business structure for tax efficiency and liability protection.",
        icon: Building,
        color: "slate"
      },
      {
        title: "Controls & Documentation",
        description: "Build internal controls and documentation systems that hold up under scrutiny.",
        icon: ClipboardCheck,
        color: "teal"
      },
      {
        title: "Financial Playbooks",
        description: "Standard operating procedures for financial operations and decision-making.",
        icon: PlayCircle,
        color: "orange"
      }
    ]
  }
];

const resources = [
  { label: "IRS Notices 101", href: "#" },
  { label: "Audit Readiness Checklist", href: "#" },
  { label: "Business Close Process", href: "#" },
  { label: "Cashflow Weekly Rhythm", href: "#" },
  { label: "Entity Structuring Basics", href: "#" },
  { label: "Video Library", href: "#" }
];

const stats = [
  { label: "Approach", value: "Ops-first" },
  { label: "Workflow", value: "Documented" },
  { label: "Support", value: "Human-backed" }
];

const colorClasses: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-700", icon: "text-blue-600" },
  green: { bg: "bg-green-50", border: "border-green-500", text: "text-green-700", icon: "text-green-600" },
  red: { bg: "bg-red-50", border: "border-red-500", text: "text-red-700", icon: "text-red-600" },
  amber: { bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-700", icon: "text-amber-600" },
  purple: { bg: "bg-purple-50", border: "border-purple-500", text: "text-purple-700", icon: "text-purple-600" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-500", text: "text-emerald-700", icon: "text-emerald-600" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-500", text: "text-indigo-700", icon: "text-indigo-600" },
  slate: { bg: "bg-slate-50", border: "border-slate-500", text: "text-slate-700", icon: "text-slate-600" },
  teal: { bg: "bg-teal-50", border: "border-teal-500", text: "text-teal-700", icon: "text-teal-600" },
  orange: { bg: "bg-orange-50", border: "border-orange-500", text: "text-orange-700", icon: "text-orange-600" }
};

export default function FinOp() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Build a calmer financial system — and run it like ops.
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Fin-Op is a structured intake + execution pipeline for tax, compliance, cashflow, and business reporting. 
              Clear steps, clean documentation, fast follow-through.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/contact" 
                className={cn(buttonVariants({ size: "lg" }), "bg-white text-slate-900 hover:bg-slate-100 font-bold px-8")}
                data-testid="link-finop-intake"
              >
                Start Fin-Op Intake
              </Link>
              <a 
                href="#programs" 
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white text-white hover:bg-white/10 font-bold px-8")}
                data-testid="link-explore-programs"
              >
                Explore Programs
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="programs" className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-3">Fin-Op Programs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive financial operations support across tax, compliance, and business management.
            </p>
          </div>

          {programs.map((category) => (
            <div key={category.category} className="mb-12">
              <h3 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-brand-red rounded"></span>
                {category.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.items.map((item) => {
                  const colors = colorClasses[item.color];
                  const Icon = item.icon;
                  return (
                    <Card 
                      key={item.title} 
                      className={cn("border-l-4 hover:shadow-lg transition-shadow", colors.border)}
                      data-testid={`card-program-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <CardContent className="p-6">
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", colors.bg)}>
                          <Icon className={cn("w-6 h-6", colors.icon)} />
                        </div>
                        <h4 className="font-bold text-brand-navy mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-4">
                  Fiscal clarity. Operational execution.
                </h2>
                <p className="text-gray-600 mb-6">
                  Fin-Op isn't just about doing your taxes—it's about building a financial operating system 
                  that runs smoothly, stays compliant, and gives you clarity on where you stand.
                </p>
                <ul className="space-y-3">
                  {[
                    "Structured intake process for every engagement",
                    "Clear documentation at every step",
                    "Human-backed support with fast response",
                    "Ops-first mindset for sustainable systems"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-900 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-6">Ready to Start?</h3>
                <p className="text-slate-300 mb-6">
                  Begin with a Fin-Op intake call. We'll triage your situation and build a clear action plan.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-brand-gold" />
                    <span>Fin-Op Support — Ticket + Call Back</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-brand-gold" />
                    <span>Nationwide • Remote-first • Secure Intake</span>
                  </div>
                </div>
                <Link 
                  href="/contact" 
                  className={cn(buttonVariants(), "w-full mt-6 bg-white text-slate-900 hover:bg-slate-100 font-bold")}
                  data-testid="link-finop-contact"
                >
                  Start Fin-Op Intake <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="resources" className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-3">Fin-Op Resources</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Educational content to help you understand your financial situation and make better decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {resources.map((resource) => (
              <a 
                key={resource.label}
                href={resource.href}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:border-brand-navy hover:shadow-md transition-all text-center"
                data-testid={`link-resource-${resource.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <FileText className="w-8 h-8 text-brand-navy mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">{resource.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">
            Veteran Led Tax
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Tax planning, prep, recovery, resolution. A Navigator USA financial operations partner.
          </p>
          <Link 
            href="/contact" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
            data-testid="link-finop-cta-bottom"
          >
            Begin Your Fin-Op Journey
          </Link>
        </div>
      </section>
    </Layout>
  );
}
