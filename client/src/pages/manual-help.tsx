import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { UserCheck, FileSearch, AlertTriangle, XCircle } from "lucide-react";
import { Link } from "wouter";

export default function ManualHelp() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-display mb-6">Prefer A Human? We'll Handle Everything.</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Sometimes you need expert backup. Our specialists are ready to step in.
          </p>
          <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black h-14 px-8 text-lg font-bold">
            Get Manual Help
          </Button>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FileSearch, title: "Claims", desc: "Comprehensive review and filing assistance." },
              { icon: AlertTriangle, title: "Appeals", desc: "Strategic support for challenging decisions." },
              { icon: UserCheck, title: "Evidence", desc: "Professional gathering and organization." },
              { icon: XCircle, title: "Denials", desc: "Proven strategies to overturn unfair denials." },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-navy">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display text-brand-navy mb-8">Don't Leave Benefits On The Table</h2>
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-gray-200">
            <p className="text-gray-600 mb-6">
              "The difference between a 30% rating and a 100% rating can be millions of dollars over a lifetime. Don't fight the bureaucracy alone."
            </p>
            <Link href="/contact">
              <Button className="w-full bg-brand-navy text-white h-12">Contact A Specialist</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
