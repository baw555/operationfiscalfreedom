import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Briefcase, Code, Truck, Wrench, Phone, PenTool, CreditCard } from "lucide-react";
import { Link } from "wouter";

export default function FinOps() {
  return (
    <Layout>
      <section className="bg-brand-silver/20 py-12 sm:py-20 text-center border-b border-brand-silver/30">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-display text-brand-navy mb-4 sm:mb-6">Financial Operations</h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-10 px-2">
            Access a marketplace of Fin-Ops opportunities built specifically for the discipline and reliability of veterans.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Button size="lg" className="bg-brand-navy hover:bg-brand-navy/90 text-white h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto">
              Explore Fin-Ops
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-brand-navy text-brand-navy h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto">
              Post A Fin-Op
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-8 sm:mb-12 text-center">Available Opportunities</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            <Link href="/merchant-services">
              <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 border-2 border-brand-red rounded-lg hover:bg-brand-red/5 cursor-pointer group transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-red rounded flex items-center justify-center text-white shrink-0">
                  <CreditCard size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-red text-sm sm:text-lg">Merchant Services</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Recurring Income</p>
                </div>
              </div>
            </Link>
            {[
              { icon: Briefcase, title: "Sales", count: "120+ Ops" },
              { icon: Phone, title: "Marketing", count: "85+ Ops" },
              { icon: Code, title: "Tech & IT", count: "45+ Ops" },
              { icon: Truck, title: "Delivery", count: "200+ Ops" },
              { icon: Wrench, title: "Construction", count: "150+ Ops" },
              { icon: PenTool, title: "Admin", count: "90+ Ops" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 border border-gray-200 rounded-lg hover:border-brand-red cursor-pointer group transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded flex items-center justify-center text-gray-600 group-hover:bg-brand-red group-hover:text-white transition-colors shrink-0">
                  <item.icon size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy text-sm sm:text-lg">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{item.count}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-16 p-6 sm:p-8 bg-brand-navy rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8 text-center md:text-left">
             <div>
               <h3 className="text-xl sm:text-2xl font-display mb-1 sm:mb-2">Veteran-Only Partner Fin-Ops</h3>
               <p className="text-sm sm:text-base text-gray-300">Exclusive high-paying contracts reserved for verified veterans.</p>
             </div>
             <Button className="bg-brand-gold text-brand-black font-bold hover:bg-brand-gold/90 px-6 sm:px-8 w-full md:w-auto">
               Verify Status to Access
             </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
