import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Users } from "lucide-react";

export default function Businesses() {
  return (
    <Layout>
      <section className="bg-brand-black text-white py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-display mb-6">Hire Veterans. Grow Your Company.</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Join the largest network of veteran-owned businesses. Hire reliable talent and find new partners.
          </p>
          <Button size="lg" className="bg-brand-green hover:bg-brand-green/90 text-white h-14 px-10 text-lg">
            List Your Business
          </Button>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-16 h-16 bg-brand-navy/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-navy">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-display text-brand-navy mb-3">Access Talent</h3>
              <p className="text-gray-600">Connect with disciplined, skilled veterans ready to work.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-brand-navy/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-navy">
                <Building2 size={32} />
              </div>
              <h3 className="text-2xl font-display text-brand-navy mb-3">B2B Network</h3>
              <p className="text-gray-600">Find other veteran-owned suppliers and partners.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-brand-navy/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-navy">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-2xl font-display text-brand-navy mb-3">Scale Faster</h3>
              <p className="text-gray-600">Leverage the community to grow your operations.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
