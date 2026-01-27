import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Briefcase, Code, Wrench, Phone, PenTool, CreditCard, Palette, Truck, DollarSign, Users, TrendingUp, Gift, Store, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

export default function FinOps() {
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem('finops_referral', ref);
    } else {
      const storedRef = localStorage.getItem('finops_referral');
      if (storedRef) setReferralCode(storedRef);
    }
  }, []);

  const buildLink = (path: string) => {
    return referralCode ? `${path}?ref=${referralCode}` : path;
  };

  return (
    <Layout>
      {/* Refer & Earn Section */}
      <section className="bg-gradient-to-r from-brand-navy to-brand-navy/90 py-12 sm:py-16 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-5xl font-display mb-4">Refer & Earn</h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Earn commissions by referring clients to NavigatorUSA partner services. 
            Every referral is tracked and supports veteran programs.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Earn Commissions</h3>
              <p className="mt-2 text-gray-300">Get paid for every client you refer that closes</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">6-Level Deep Tracking</h3>
              <p className="mt-2 text-gray-300">Build a team and earn on 6 levels of referrals</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Real-Time Portal</h3>
              <p className="mt-2 text-gray-300">Track all your leads and commissions in your affiliate portal</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/veteran-led-tax/intake-refer">
              <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-bold h-12 sm:h-14 px-6 sm:px-8">
                Submit a Client Referral
              </Button>
            </Link>
            <Link href="/veteran-led-tax/affiliate">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 h-12 sm:h-14 px-6 sm:px-8">
                Affiliate Portal Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* NavigatorUSA Partner Services */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display text-brand-navy mb-4">NavigatorUSA Partner Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Exclusive partner opportunities where every signup supports veteran programs. All referrals are tracked for commission payments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <Link href={buildLink("/my-locker")}>
              <div className="p-6 sm:p-8 border-2 border-brand-gold rounded-xl hover:bg-brand-gold/5 cursor-pointer group transition-all hover:shadow-lg">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-gold rounded-lg flex items-center justify-center text-brand-navy mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Store size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2 text-center">MY LOCKER</h3>
                <p className="text-sm text-gray-600 text-center mb-3">FREE branded merchandise stores for businesses, teams, and organizations</p>
                <div className="flex items-center justify-center text-brand-gold font-bold text-sm">
                  <span>Get Started FREE</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href={buildLink("/merchant-services")}>
              <div className="p-6 sm:p-8 border-2 border-brand-red rounded-xl hover:bg-brand-red/5 cursor-pointer group transition-all hover:shadow-lg">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-red rounded-lg flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <CreditCard size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2 text-center">Merchant Processing</h3>
                <p className="text-sm text-gray-600 text-center mb-3">100% of commissions support veterans. EO 14117 compliant payment processing</p>
                <div className="flex items-center justify-center text-brand-red font-bold text-sm">
                  <span>Register Business</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href={buildLink("/vgift-cards")}>
              <div className="p-6 sm:p-8 border-2 border-brand-blue rounded-xl hover:bg-brand-blue/5 cursor-pointer group transition-all hover:shadow-lg">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-blue rounded-lg flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Gift size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2 text-center">vGift Cards</h3>
                <p className="text-sm text-gray-600 text-center mb-3">Virtual gift cards redeemable at 100+ brands. Every purchase supports veterans</p>
                <div className="flex items-center justify-center text-brand-blue font-bold text-sm">
                  <span>Shop vGift Cards</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-silver/20 py-12 sm:py-20 text-center border-y border-brand-silver/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-display text-brand-navy mb-4 sm:mb-6">More Financial Operations</h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-10 px-2">
            Access a marketplace of Fin-Ops opportunities built specifically for the discipline and reliability of veterans.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-8 sm:mb-12 text-center">Available Opportunities</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            <Link href="/shipping">
              <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 border-2 border-brand-blue rounded-lg hover:bg-brand-blue/5 cursor-pointer group transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-blue rounded flex items-center justify-center text-white shrink-0">
                  <Truck size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-blue text-sm sm:text-lg">Veteran Logistics</h3>
                  <p className="text-xs sm:text-sm text-gray-500">24% Monthly Commissions</p>
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
