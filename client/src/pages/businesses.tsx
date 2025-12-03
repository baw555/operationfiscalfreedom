import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Users } from "lucide-react";

export default function Businesses() {
  return (
    <Layout>
      <section className="bg-brand-black text-white py-12 sm:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-display mb-4 sm:mb-6">Hire Veterans. Grow Your Company.</h1>
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-10 px-2">
            Join the largest network of veteran-owned businesses. Hire reliable talent and find new partners.
          </p>
          <Button size="lg" className="bg-brand-green hover:bg-brand-green/90 text-white h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-lg w-full sm:w-auto">
            List Your Business
          </Button>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-center">
            <div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-navy/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-brand-navy">
                <Users size={24} className="sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-2 sm:mb-3">Access Talent</h3>
              <p className="text-sm sm:text-base text-gray-600">Connect with disciplined, skilled veterans ready to work.</p>
            </div>
            <div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-navy/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-brand-navy">
                <Building2 size={24} className="sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-2 sm:mb-3">B2B Network</h3>
              <p className="text-sm sm:text-base text-gray-600">Find other veteran-owned suppliers and partners.</p>
            </div>
            <div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-navy/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-brand-navy">
                <TrendingUp size={24} className="sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-2 sm:mb-3">Scale Faster</h3>
              <p className="text-sm sm:text-base text-gray-600">Leverage the community to grow your operations.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
