import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Target, Users, Shield, Heart } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function About() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6">About The Mission</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
            Operation Fiscal Freedom exists to help veterans achieve financial stability, powerful opportunities, and decisive control over their futures.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-16 items-center mb-12 sm:mb-20">
            <div>
              <h2 className="text-2xl sm:text-4xl font-display text-brand-navy mb-4 sm:mb-6">Who We Are</h2>
              <p className="text-sm sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                We are a veteran-first organization dedicated to financial empowerment, navigating the VA system, income generation, and community-driven opportunity creation.
              </p>
              <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
                We believe that after serving your country, you shouldn't have to fight a war on the home front just to get the benefits and financial security you deserve.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-brand-green/10 p-4 sm:p-6 rounded-lg text-center">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-brand-green mx-auto mb-2 sm:mb-3" />
                <h3 className="font-bold text-brand-navy text-sm sm:text-base">Protection</h3>
              </div>
              <div className="bg-brand-navy/10 p-4 sm:p-6 rounded-lg text-center">
                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-brand-navy mx-auto mb-2 sm:mb-3" />
                <h3 className="font-bold text-brand-navy text-sm sm:text-base">Direction</h3>
              </div>
              <div className="bg-brand-gold/10 p-4 sm:p-6 rounded-lg text-center">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-brand-gold mx-auto mb-2 sm:mb-3" />
                <h3 className="font-bold text-brand-navy text-sm sm:text-base">Community</h3>
              </div>
              <div className="bg-red-500/10 p-4 sm:p-6 rounded-lg text-center">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 mx-auto mb-2 sm:mb-3" />
                <h3 className="font-bold text-brand-navy text-sm sm:text-base">Support</h3>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 sm:p-12 rounded-xl sm:rounded-2xl border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-display text-center text-brand-navy mb-8 sm:mb-12">How We Operate</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              {[
                "Clear Objectives",
                "Tools Built For Success",
                "Veteran-to-Veteran Support",
                "Data-Driven Strategy"
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="text-4xl sm:text-6xl font-display text-gray-200 absolute -top-4 sm:-top-8 left-0 right-0 -z-10">0{i + 1}</div>
                  <h3 className="text-sm sm:text-xl font-bold text-brand-navy relative z-10">{item}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-black py-12 sm:py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-display text-white mb-6 sm:mb-8">Join The Ranks</h2>
          <Link href="/join" className={cn(buttonVariants({ size: "lg" }), "bg-brand-green hover:bg-brand-green/90 text-white font-bold px-6 sm:px-8 h-12 sm:h-14 cursor-pointer w-full sm:w-auto")}>
              Start Your Mission
          </Link>
        </div>
      </section>
    </Layout>
  );
}
