import { Layout } from "@/components/layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight, Shield, DollarSign, Users, BarChart, Award, Briefcase, Star, Heart, Stethoscope, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import logoStacked from "@assets/NavStar-Stacked_1767699657516.png";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section - INTENSE PATRIOTIC */}
      <section className="relative min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden bg-brand-navy">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy to-brand-red/30" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-red/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-brand-navy to-transparent" />
        </div>

        <div className="container relative z-10 px-3 sm:px-4 py-10 sm:py-20 text-center max-w-5xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8 animate-in fade-in zoom-in duration-1000">
            <img src={logoStacked} alt="NavigatorUSA" className="h-28 sm:h-36 md:h-44 object-contain drop-shadow-2xl" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-brand-red text-white mb-4 sm:mb-8 shadow-lg shadow-brand-red/30 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <span className="font-bold text-xs sm:text-sm tracking-wider uppercase">Veterans' Family Resources</span>
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-white mb-4 sm:mb-6 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Somebody, Something is Coming.
            <br />
            <span className="text-brand-red drop-shadow-lg">Will You Be Ready to Answer the Call?</span>
          </h1>

          <p className="text-xl sm:text-2xl md:text-4xl text-white mb-4 sm:mb-6 max-w-4xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 px-2 font-display">
            Gear Up For Your Family to Face 2026 and Beyond
          </p>
          
          {/* Four Pillars - INTENSE */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-500 flex items-center justify-center mb-2 shadow-lg shadow-green-500/30">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <span className="text-green-400 font-display text-lg sm:text-2xl md:text-3xl">Financial</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-brand-blue flex items-center justify-center mb-2 shadow-lg shadow-brand-blue/30">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <span className="text-brand-blue font-display text-lg sm:text-2xl md:text-3xl">Spiritual</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-brand-red flex items-center justify-center mb-2 shadow-lg shadow-brand-red/30">
                <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <span className="text-brand-red font-display text-lg sm:text-2xl md:text-3xl">Medical</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-brand-gold flex items-center justify-center mb-2 shadow-lg shadow-brand-gold/30">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-brand-navy" />
              </div>
              <span className="text-brand-gold font-display text-lg sm:text-2xl md:text-3xl">Holistic</span>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 w-full max-w-4xl mx-auto px-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <Link href="/va-software" className={cn(buttonVariants({ size: "lg" }), "bg-white hover:bg-gray-100 text-brand-navy border-2 border-white h-12 md:h-14 px-4 text-sm md:text-base w-full shadow-lg cursor-pointer font-bold")}>
                  Free VA Rating Tool
              </Link>
              <Link href="/gigs" className={cn(buttonVariants({ size: "lg" }), "bg-brand-blue hover:bg-brand-blue/90 text-white border-2 border-brand-blue h-12 md:h-14 px-4 text-sm md:text-base w-full cursor-pointer font-bold shadow-lg")}>
                  Find Gig Work
              </Link>
              <Link href="/apply-website" className={cn(buttonVariants({ size: "lg" }), "bg-brand-gold hover:bg-brand-gold/90 text-brand-navy border-2 border-brand-gold h-12 md:h-14 px-4 text-sm md:text-base w-full cursor-pointer font-bold shadow-lg")}>
                  Get Free Business Website
              </Link>
              <Link href="/apply-startup-grant" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-2 border-white text-white hover:bg-white hover:text-brand-navy h-12 md:h-14 px-4 text-sm md:text-base w-full cursor-pointer font-bold")}>
                  Apply for Startup Grant
              </Link>
              <Link href="/investors" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-2 border-brand-silver text-brand-silver hover:bg-brand-silver hover:text-brand-navy h-12 md:h-14 px-4 text-sm md:text-base w-full cursor-pointer font-bold")}>
                  Connect with Investors
              </Link>
              <Link href="/private-doctor" className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white border-2 border-brand-red h-12 md:h-14 px-4 text-sm md:text-base w-full cursor-pointer font-bold shadow-lg shadow-brand-red/30")}>
                  VA Too Slow? Private Doctor
              </Link>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm mt-4 text-center">
              For those who do not qualify for grants, investors may make offers
            </p>
            <div className="mt-4 md:mt-6 text-center">
              <Link href="/new-home-furniture" className={cn(buttonVariants({ size: "lg" }), "bg-green-500 hover:bg-green-600 text-white font-bold h-11 md:h-12 px-4 md:px-6 text-xs md:text-sm cursor-pointer w-full md:w-auto shadow-lg")}>
                Buying a New Home? Get Your Furniture Paid For
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do - INTENSE */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-brand-navy mb-3 sm:mb-4">Mission Objectives</h2>
            <div className="w-16 sm:w-24 h-1 bg-brand-red mx-auto mb-4 sm:mb-6" />
            <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              We provide a comprehensive ecosystem designed to lift veteran families up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: Shield, title: "VA Claims Support", desc: "Understand the system, appeal denied claims, and get the rating you deserve with our free software.", color: "brand-red" },
              { icon: Briefcase, title: "Immediate Gig Work", desc: "Access flexible, remote or local gig work opportunities tailored for veteran skillsets.", color: "brand-blue" },
              { icon: DollarSign, title: "Income Streams", desc: "Build multiple revenue streams through referrals and veteran-owned business connections.", color: "green-500" },
            ].map((item, i) => (
              <Card key={i} className={`border-t-4 border-t-${item.color} hover:shadow-2xl transition-all shadow-lg`}>
                <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6 text-center">
                  <div className={`w-14 h-14 sm:w-18 sm:h-18 bg-${item.color}/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-${item.color}`}>
                    <item.icon size={28} className="sm:w-9 sm:h-9" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-2 sm:mb-3">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Exist - INTENSE */}
      <section className="py-12 sm:py-20 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-brand-red/20 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-blue/20 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl mb-4 sm:mb-6">Why NavigatorUSA Exists</h2>
              <div className="w-16 h-1 bg-brand-red mb-6" />
              <div className="space-y-4 sm:space-y-6">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-brand-red flex items-center justify-center shrink-0 shadow-lg">
                    <Users className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 text-white">No Veteran Family Left Behind</h4>
                    <p className="text-sm sm:text-base text-gray-300">Because no veteran family should ever battle alone. The system is complex, but we make it navigable.</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-brand-blue flex items-center justify-center shrink-0 shadow-lg">
                    <BarChart className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 text-white">Financial Freedom</h4>
                    <p className="text-sm sm:text-base text-gray-300">Every veteran family deserves financial stability. We build pathways to achieve it.</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-green-500 flex items-center justify-center shrink-0 shadow-lg">
                    <Award className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 text-white">Continued Service</h4>
                    <p className="text-sm sm:text-base text-gray-300">Your service built this country — now it's our turn to serve you and your family.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-6 sm:p-8 rounded-xl border-2 border-brand-red/30 backdrop-blur-sm shadow-2xl">
              <div className="text-center space-y-4 sm:space-y-6">
                <h3 className="text-2xl sm:text-3xl font-display text-white">Join The Ranks</h3>
                <p className="text-sm sm:text-base text-gray-200">
                  Join over 150,000 veteran families who have taken control of their future.
                </p>
                <Link href="/join" className={cn(buttonVariants(), "w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold h-12 sm:h-14 text-lg cursor-pointer shadow-lg shadow-brand-red/30")}>
                    Get Started Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gig Work Callout - INTENSE */}
      <section className="py-12 sm:py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border-2 border-brand-navy/10">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 sm:p-12 flex flex-col justify-center order-2 md:order-1">
                <div className="inline-block px-3 py-1.5 rounded bg-brand-red text-white font-bold text-xs uppercase tracking-wider mb-3 sm:mb-4 w-fit">
                  Immediate Income
                </div>
                <h2 className="text-2xl sm:text-4xl font-display text-brand-navy mb-4 sm:mb-6">Gig Work For Veterans</h2>
                <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8">
                  Earn real money today. Flexible, remote, or local opportunities for every skill level. 
                  From sales and marketing to construction and logistics.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <li className="flex items-center gap-2 text-brand-navy font-medium text-sm sm:text-base">
                    <Check className="text-brand-red h-5 w-5 sm:h-6 sm:w-6" /> Flexible Schedule
                  </li>
                  <li className="flex items-center gap-2 text-brand-navy font-medium text-sm sm:text-base">
                    <Check className="text-brand-red h-5 w-5 sm:h-6 sm:w-6" /> Remote Options
                  </li>
                  <li className="flex items-center gap-2 text-brand-navy font-medium text-sm sm:text-base">
                    <Check className="text-brand-red h-5 w-5 sm:h-6 sm:w-6" /> Veteran-Preferred Hiring
                  </li>
                </ul>
                <Link href="/gigs" className={cn(buttonVariants(), "bg-brand-navy hover:bg-brand-navy/90 text-white self-start px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base cursor-pointer font-bold shadow-lg")}>
                    Start Earning <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="bg-brand-navy relative h-48 sm:h-64 md:h-auto order-1 md:order-2">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/40 via-brand-navy to-brand-blue/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Briefcase className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 opacity-80" />
                    <p className="font-display text-2xl sm:text-3xl">Work Your Way</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - INTENSE */}
      <section className="py-12 sm:py-24 bg-brand-red text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red via-brand-red to-brand-navy/30" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-display mb-4 sm:mb-6 drop-shadow-lg">Ready To Take Command?</h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-10 max-w-2xl mx-auto text-white/95 px-2">
            Download the free software, find gigs, and start building your family's future today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Link href="/va-software" className={cn(buttonVariants({ size: "lg" }), "bg-white text-brand-red hover:bg-gray-100 font-bold px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-lg cursor-pointer w-full sm:w-auto shadow-lg")}>
                Download Free Tool
            </Link>
            <Link href="/income" className={cn(buttonVariants({ size: "lg" }), "bg-brand-navy hover:bg-brand-navy/90 text-white font-bold px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-lg cursor-pointer w-full sm:w-auto shadow-lg border-2 border-white/20")}>
                Start Building Income
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
