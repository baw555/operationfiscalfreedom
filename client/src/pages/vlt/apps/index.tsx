import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Users, Award, FileCheck, ArrowRight, Smartphone } from "lucide-react";

const apps = [
  {
    title: "CRM",
    description: "Client relationship management for tax professionals",
    icon: Users,
    href: "/veteran-led-tax/apps/crm",
    color: "blue"
  },
  {
    title: "WOTC",
    description: "Work Opportunity Tax Credit processing and tracking",
    icon: Award,
    href: "/veteran-led-tax/apps/wotc",
    color: "green"
  },
  {
    title: "SmartFile",
    description: "Secure document management and filing system",
    icon: FileCheck,
    href: "/veteran-led-tax/apps/smartfile",
    color: "purple"
  }
];

const colorClasses: Record<string, { bg: string; icon: string }> = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600" },
  green: { bg: "bg-green-50", icon: "text-green-600" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600" }
};

export default function Apps() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Our Apps
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Technology tools that power our tax operations and client services.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {apps.map((app) => {
                const colors = colorClasses[app.color];
                const Icon = app.icon;
                return (
                  <Link key={app.title} href={app.href}>
                    <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", colors.bg)}>
                          <Icon className={cn("w-6 h-6", colors.icon)} />
                        </div>
                        <h3 className="font-bold text-brand-navy mb-2">{app.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{app.description}</p>
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
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Ready to Get Started?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Our technology makes tax services faster and more accurate.
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
