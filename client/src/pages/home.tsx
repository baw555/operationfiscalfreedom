import { Layout } from "@/components/layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight, Shield, DollarSign, Users, BarChart, Award, Briefcase } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import heroBg from "@assets/generated_images/hero_background_veterans.png";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-brand-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Veterans standing together" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent" />
        </div>

        <div className="container relative z-10 px-4 py-20 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/20 border border-brand-green/40 text-brand-green mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            <span className="font-ui font-bold text-sm tracking-wider uppercase text-white">Mission Active</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-white mb-6 leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Operation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">Fiscal Freedom</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Veterans Helping Veterans Achieve Financial Independence.
            <br />
            <span className="text-brand-khaki text-lg mt-2 block">Get your free VA rating software, access gig work, and earn referral income.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link href="/va-software" className={cn(buttonVariants({ size: "lg" }), "bg-brand-green hover:bg-brand-green/90 text-white border-2 border-brand-green h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-brand-green/20 cursor-pointer")}>
                Get Free VA Rating Tool
            </Link>
            <Link href="/gigs" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-2 border-white text-brand-navy hover:bg-white hover:text-brand-navy h-14 px-8 text-lg w-full sm:w-auto cursor-pointer")}>
                Find Gig Work
            </Link>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-brand-navy mb-4">Mission Objectives</h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto mb-6" />
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide a comprehensive ecosystem designed to lift veterans up financially.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "VA Claims Support", desc: "Understand the system, appeal denied claims, and get the rating you deserve with our free software." },
              { icon: Briefcase, title: "Immediate Gig Work", desc: "Access flexible, remote or local gig work opportunities tailored for veteran skillsets." },
              { icon: DollarSign, title: "Income Streams", desc: "Build multiple revenue streams through referrals and veteran-owned business connections." },
            ].map((item, i) => (
              <Card key={i} className="border-t-4 border-t-brand-navy hover:border-t-brand-green transition-colors shadow-lg">
                <CardContent className="pt-8 pb-8 px-6 text-center">
                  <div className="w-16 h-16 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-navy">
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-display text-brand-navy mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Exist - Dark/Tactical */}
      <section className="py-20 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl mb-6">Why We Exist</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded bg-brand-green/20 flex items-center justify-center shrink-0 border border-brand-green/40">
                    <Users className="text-brand-green" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-brand-khaki">No Veteran Left Behind</h4>
                    <p className="text-gray-300">Because no veteran should ever battle the VA alone. The system is complex, but we make it navigable.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded bg-brand-green/20 flex items-center justify-center shrink-0 border border-brand-green/40">
                    <BarChart className="text-brand-green" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-brand-khaki">Financial Freedom</h4>
                    <p className="text-gray-300">Every veteran deserves financial stability. We build pathways to achieve it.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded bg-brand-green/20 flex items-center justify-center shrink-0 border border-brand-green/40">
                    <Award className="text-brand-green" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-brand-khaki">Continued Service</h4>
                    <p className="text-gray-300">Your service built this country — now it's our turn to serve you.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 p-8 rounded-lg border border-white/10 backdrop-blur-sm">
              <div className="text-center space-y-6">
                <h3 className="text-3xl font-display text-white">Join The Ranks</h3>
                <p className="text-gray-300">
                  Join over 10,000 veterans who have taken control of their financial future.
                </p>
                <Link href="/join" className={cn(buttonVariants(), "w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black font-bold h-12 cursor-pointer")}>
                    Get Started Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gig Work Callout */}
      <section className="py-20 bg-brand-khaki/20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-2">
              <div className="p-12 flex flex-col justify-center">
                <div className="inline-block px-3 py-1 rounded bg-brand-navy/10 text-brand-navy font-bold text-xs uppercase tracking-wider mb-4 w-fit">
                  Immediate Income
                </div>
                <h2 className="text-4xl font-display text-brand-navy mb-6">Gig Work For Veterans</h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Earn real money today. Flexible, remote, or local opportunities for every skill level. 
                  From sales and marketing to construction and logistics.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-brand-navy font-medium">
                    <Check className="text-brand-green h-5 w-5" /> Flexible Schedule
                  </li>
                  <li className="flex items-center gap-2 text-brand-navy font-medium">
                    <Check className="text-brand-green h-5 w-5" /> Remote Options
                  </li>
                  <li className="flex items-center gap-2 text-brand-navy font-medium">
                    <Check className="text-brand-green h-5 w-5" /> Veteran-Preferred Hiring
                  </li>
                </ul>
                <Link href="/gigs" className={cn(buttonVariants(), "bg-brand-navy hover:bg-brand-navy/90 text-white self-start px-8 h-12 cursor-pointer")}>
                    Start Earning <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="bg-gray-200 relative h-64 md:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1000&auto=format&fit=crop" 
                  alt="Veterans working" 
                  className="absolute inset-0 w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-brand-navy/20 mix-blend-multiply" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-green text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-display mb-6">Ready To Take Command?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90">
            Download the free software, find gigs, and start building your financial freedom today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/va-software" className={cn(buttonVariants({ size: "lg" }), "bg-white text-brand-green hover:bg-gray-100 font-bold px-8 h-14 text-lg cursor-pointer")}>
                Download Free Tool
            </Link>
            <Link href="/income" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-2 border-white text-white hover:bg-brand-green/80 px-8 h-14 text-lg cursor-pointer")}>
                Start Building Income
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
