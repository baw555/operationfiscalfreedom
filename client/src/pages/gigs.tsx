import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Briefcase, Code, Truck, Wrench, Phone, PenTool } from "lucide-react";

export default function Gigs() {
  return (
    <Layout>
      <section className="bg-brand-khaki/20 py-20 text-center border-b border-brand-khaki/30">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-display text-brand-navy mb-6">Earn More. Live Free. Start Today.</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Access a marketplace of opportunities built specifically for the discipline and reliability of veterans.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-brand-navy hover:bg-brand-navy/90 text-white h-14 px-8">
              Explore Gigs
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-brand-navy text-brand-navy h-14 px-8">
              Post A Gig
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display text-brand-navy mb-12 text-center">Available Opportunities</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Briefcase, title: "Sales", count: "120+ Gigs" },
              { icon: Phone, title: "Marketing", count: "85+ Gigs" },
              { icon: Code, title: "Tech & IT", count: "45+ Gigs" },
              { icon: Truck, title: "Delivery", count: "200+ Gigs" },
              { icon: Wrench, title: "Construction", count: "150+ Gigs" },
              { icon: PenTool, title: "Admin", count: "90+ Gigs" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-6 border border-gray-200 rounded-lg hover:border-brand-green cursor-pointer group transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-600 group-hover:bg-brand-green group-hover:text-white transition-colors">
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.count}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-brand-navy rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
             <div>
               <h3 className="text-2xl font-display mb-2">Veteran-Only Partner Gigs</h3>
               <p className="text-gray-300">Exclusive high-paying contracts reserved for verified veterans.</p>
             </div>
             <Button className="bg-brand-gold text-brand-black font-bold hover:bg-brand-gold/90 px-8">
               Verify Status to Access
             </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
