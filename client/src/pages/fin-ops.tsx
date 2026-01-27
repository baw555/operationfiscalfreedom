import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, Gift, Store, ExternalLink, Shield } from "lucide-react";
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
      {/* Trust Banner - No MLM, No Fees */}
      <div className="bg-green-600 text-white py-4 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-sm sm:text-base">100% FREE TO JOIN</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-sm sm:text-base">WE NEVER ASK FOR MONEY UPFRONT</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-sm sm:text-base">NOT AN MLM - REAL SERVICES, REAL COMMISSIONS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Join the Ranks Banner */}
      <div className="bg-brand-red text-white py-3 px-4">
        <div className="container mx-auto text-center">
          <p className="text-lg sm:text-xl font-bold">
            <span className="font-display tracking-wide">JOIN THE RANKS</span>
            <span className="mx-2 sm:mx-4">-</span>
            <span className="font-normal">Over 100,000 veterans a week are introduced to our ranks</span>
            <span className="mx-2 sm:mx-4">-</span>
            <Link href="/affiliate" className="underline hover:text-white/80 font-bold">JOIN NOW</Link>
          </p>
        </div>
      </div>

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

            <Link href={buildLink("/insurance")}>
              <div className="p-6 sm:p-8 border-2 border-green-600 rounded-xl hover:bg-green-50 cursor-pointer group transition-all hover:shadow-lg md:col-span-3">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Shield size={28} />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h3 className="font-display text-xl sm:text-2xl text-brand-navy mb-2">Save 20-40% on All Insurance</h3>
                    <p className="text-sm text-gray-600 mb-2">Provider-direct insurance model eliminates middleman costs. Life, disability, health, business, and more.</p>
                    <p className="text-xs text-green-700 font-semibold">No commissions to agents = More savings for you</p>
                  </div>
                  <div className="flex items-center justify-center text-green-600 font-bold text-sm whitespace-nowrap">
                    <span>Get Your Quote</span>
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  );
}
