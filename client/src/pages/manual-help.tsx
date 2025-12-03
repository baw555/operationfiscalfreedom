import { Layout } from "@/components/layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserCheck, FileSearch, AlertTriangle, XCircle } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function ManualHelp() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6">Prefer A Human? We'll Handle Everything.</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-10 px-2">
            Sometimes you need expert backup. Our specialists are ready to step in.
          </p>
          <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-lg font-bold w-full sm:w-auto">
            Get Manual Help
          </Button>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[
              { icon: FileSearch, title: "Claims", desc: "Comprehensive review and filing assistance." },
              { icon: AlertTriangle, title: "Appeals", desc: "Strategic support for challenging decisions." },
              { icon: UserCheck, title: "Evidence", desc: "Professional gathering and organization." },
              { icon: XCircle, title: "Denials", desc: "Proven strategies to overturn unfair denials." },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 sm:p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-brand-navy">
                  <item.icon size={20} className="sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-xs sm:text-base text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6 sm:mb-8">Don't Leave Benefits On The Table</h2>
          <div className="max-w-2xl mx-auto bg-white p-4 sm:p-8 rounded-xl border border-gray-200">
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              "The difference between a 30% rating and a 100% rating can be millions of dollars over a lifetime. Don't fight the bureaucracy alone."
            </p>
            <Link href="/contact" className={cn(buttonVariants(), "w-full bg-brand-navy text-white h-11 sm:h-12 cursor-pointer")}>
              Contact A Specialist
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
