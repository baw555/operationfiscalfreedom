import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { DollarSign, Share2, Briefcase, Home } from "lucide-react";

export default function Income() {
  return (
    <Layout>
      <section className="bg-brand-red text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-display mb-6">Multiple Income Streams</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Don't rely on a single paycheck. Build a fortress of financial security.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 max-w-4xl mx-auto">
            {[
              { 
                title: "Fin-Ops Completion", 
                desc: "Earn directly by completing Financial Operations in our marketplace.",
                icon: Briefcase,
                color: "text-brand-red"
              },
              { 
                title: "Introduced Opportunities", 
                desc: "Earn commissions by connecting businesses and veterans.",
                icon: Share2,
                color: "text-brand-blue"
              },
              { 
                title: "Downstream Revenue", 
                desc: "When a veteran you referred earns, you earn a percentage.",
                icon: DollarSign,
                color: "text-brand-gold"
              },
              { 
                title: "Home Purchase Benefits", 
                desc: "Access $3k-$10k in donor benefits during home purchases.",
                icon: Home,
                color: "text-brand-red"
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 p-8 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-display text-brand-navy mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Button size="lg" className="bg-brand-navy text-white h-14 px-10">
              Start Building Income
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
