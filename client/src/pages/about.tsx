import { Layout } from "@/components/layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Shield, Heart } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function About() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-display mb-6">About The Mission</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Operation Fiscal Freedom exists to help veterans achieve financial stability, powerful opportunities, and decisive control over their futures.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="text-4xl font-display text-brand-navy mb-6">Who We Are</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We are a veteran-first organization dedicated to financial empowerment, navigating the VA system, income generation, and community-driven opportunity creation.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We believe that after serving your country, you shouldn't have to fight a war on the home front just to get the benefits and financial security you deserve.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-green/10 p-6 rounded-lg text-center">
                <Shield className="w-10 h-10 text-brand-green mx-auto mb-3" />
                <h3 className="font-bold text-brand-navy">Protection</h3>
              </div>
              <div className="bg-brand-navy/10 p-6 rounded-lg text-center mt-8">
                <Target className="w-10 h-10 text-brand-navy mx-auto mb-3" />
                <h3 className="font-bold text-brand-navy">Direction</h3>
              </div>
              <div className="bg-brand-gold/10 p-6 rounded-lg text-center">
                <Users className="w-10 h-10 text-brand-gold mx-auto mb-3" />
                <h3 className="font-bold text-brand-navy">Community</h3>
              </div>
              <div className="bg-brand-red/10 p-6 rounded-lg text-center mt-8">
                <Heart className="w-10 h-10 text-brand-red mx-auto mb-3" />
                <h3 className="font-bold text-brand-navy">Support</h3>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-12 rounded-2xl border border-gray-200">
            <h2 className="text-3xl font-display text-center text-brand-navy mb-12">How We Operate</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                "Clear Objectives",
                "Tools Built For Success",
                "Veteran-to-Veteran Support",
                "Data-Driven Strategy"
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="text-6xl font-display text-gray-200 absolute -top-8 left-0 right-0 -z-10">0{i + 1}</div>
                  <h3 className="text-xl font-bold text-brand-navy relative z-10">{item}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-black py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display text-white mb-8">Join The Ranks</h2>
          <Link href="/join" className={cn(buttonVariants({ size: "lg" }), "bg-brand-green hover:bg-brand-green/90 text-white font-bold px-8 h-14 cursor-pointer")}>
              Start Your Mission
          </Link>
        </div>
      </section>
    </Layout>
  );
}
