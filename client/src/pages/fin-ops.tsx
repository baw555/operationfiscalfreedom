import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, Gift, Store, ExternalLink, Shield, FileText, Calculator, Building2, HeartPulse, Briefcase, Receipt, Landmark, PiggyBank } from "lucide-react";
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
      {/* Trust Banner - Red White Blue Theme */}
      <div className="bg-brand-red text-white py-4 px-4">
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
              <span className="font-bold text-sm sm:text-base">NOT AN MLM - REAL SERVICES</span>
            </div>
          </div>
        </div>
      </div>

      {/* Join the Ranks Banner - Blue */}
      <div className="bg-brand-navy text-white py-3 px-4">
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

      {/* Hero Section - Patriotic Gradient */}
      <section className="bg-gradient-to-b from-brand-navy via-brand-navy to-brand-red/20 py-12 sm:py-16 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-5xl font-display mb-4">Financial Operations</h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Earn commissions by referring clients to NavigatorUSA partner services. 
            Every referral is tracked and supports veteran programs.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur border border-white/20">
              <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Earn Commissions</h3>
              <p className="mt-2 text-gray-300">Get paid for every client you refer that closes</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur border border-white/20">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-brand-navy" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">6-Level Deep Tracking</h3>
              <p className="mt-2 text-gray-300">Build a team and earn on 6 levels of referrals</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur border border-white/20">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Real-Time Portal</h3>
              <p className="mt-2 text-gray-300">Track all your leads and commissions in your affiliate portal</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/veteran-led-tax/intake-refer">
              <Button size="lg" className="bg-brand-red hover:bg-brand-red/90 text-white font-bold h-12 sm:h-14 px-6 sm:px-8">
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

      {/* Available Services Section - Red/White/Blue Cards */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display text-brand-navy mb-4">Available Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive financial and business services for veterans and their families. All referrals are tracked for commission payments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Insurance */}
            <Link href={buildLink("/insurance")} data-testid="link-insurance">
              <div className="p-6 border-2 border-brand-red rounded-xl hover:bg-brand-red/5 cursor-pointer group transition-all hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-brand-red rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <Shield size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2">Insurance Savings</h3>
                <p className="text-sm text-gray-600 mb-3">Save 20-40% on life, disability, health, and business insurance through provider-direct model</p>
                <div className="flex items-center text-brand-red font-bold text-sm">
                  <span>Get Quote</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Tax Preparation */}
            <Link href={buildLink("/veteran-led-tax/services/tax-preparation")} data-testid="link-tax-prep">
              <div className="p-6 border-2 border-brand-navy rounded-xl hover:bg-brand-navy/5 cursor-pointer group transition-all hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-brand-navy rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <FileText size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2">Tax Preparation</h3>
                <p className="text-sm text-gray-600 mb-3">Professional tax preparation for individuals and businesses by veteran-led CPAs</p>
                <div className="flex items-center text-brand-navy font-bold text-sm">
                  <span>Learn More</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Tax Planning */}
            <Link href={buildLink("/veteran-led-tax/services/tax-planning")} data-testid="link-tax-planning">
              <div className="p-6 border-2 border-brand-blue rounded-xl hover:bg-brand-blue/5 cursor-pointer group transition-all hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-brand-blue rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <Calculator size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2">Tax Planning</h3>
                <p className="text-sm text-gray-600 mb-3">Strategic tax planning to minimize liability and maximize savings year-round</p>
                <div className="flex items-center text-brand-blue font-bold text-sm">
                  <span>Learn More</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Tax Resolution */}
            <Link href={buildLink("/veteran-led-tax/services/tax-resolution")} data-testid="link-tax-resolution">
              <div className="p-6 border-2 border-brand-red rounded-xl hover:bg-brand-red/5 cursor-pointer group transition-all hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-brand-red rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <Landmark size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2">Tax Resolution</h3>
                <p className="text-sm text-gray-600 mb-3">IRS problem resolution including audits, liens, levies, and payment plans</p>
                <div className="flex items-center text-brand-red font-bold text-sm">
                  <span>Get Help</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Payroll Services */}
            <Link href={buildLink("/veteran-led-tax/services/payroll")} data-testid="link-payroll">
              <div className="p-6 border-2 border-brand-navy rounded-xl hover:bg-brand-navy/5 cursor-pointer group transition-all hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-brand-navy rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <Receipt size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2">Payroll Services</h3>
                <p className="text-sm text-gray-600 mb-3">Full-service payroll processing, tax filings, and compliance management</p>
                <div className="flex items-center text-brand-navy font-bold text-sm">
                  <span>Learn More</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Tax Credits */}
            <Link href={buildLink("/veteran-led-tax/services/tax-credits")} data-testid="link-tax-credits">
              <div className="p-6 border-2 border-brand-blue rounded-xl hover:bg-brand-blue/5 cursor-pointer group transition-all hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-brand-blue rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <PiggyBank size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2">Tax Credits & Incentives</h3>
                <p className="text-sm text-gray-600 mb-3">R&D credits, WOTC, utility credits, and other business incentives</p>
                <div className="flex items-center text-brand-blue font-bold text-sm">
                  <span>Learn More</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Medical Sales */}
            <Link href={buildLink("/medical-sales")} data-testid="link-medical-sales">
              <div className="p-6 border-2 border-brand-red rounded-xl hover:bg-brand-red/5 cursor-pointer group transition-all hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-brand-red rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <HeartPulse size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2">Medical Sales</h3>
                <p className="text-sm text-gray-600 mb-3">Connect with medical device, equipment, and pharmaceutical sales opportunities</p>
                <div className="flex items-center text-brand-red font-bold text-sm">
                  <span>Submit Inquiry</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Business Development */}
            <Link href={buildLink("/business-development")} data-testid="link-business-dev">
              <div className="p-6 border-2 border-brand-navy rounded-xl hover:bg-brand-navy/5 cursor-pointer group transition-all hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-brand-navy rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2">Business Development</h3>
                <p className="text-sm text-gray-600 mb-3">Consulting, partnerships, vendor relations, and lead generation services</p>
                <div className="flex items-center text-brand-navy font-bold text-sm">
                  <span>Submit Inquiry</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Outsourced Accounting */}
            <Link href={buildLink("/veteran-led-tax/services/outsourced-accounting")} data-testid="link-accounting">
              <div className="p-6 border-2 border-brand-blue rounded-xl hover:bg-brand-blue/5 cursor-pointer group transition-all hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-brand-blue rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <Building2 size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2">Outsourced Accounting</h3>
                <p className="text-sm text-gray-600 mb-3">Complete bookkeeping, financial reporting, and CFO services</p>
                <div className="flex items-center text-brand-blue font-bold text-sm">
                  <span>Learn More</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Partner Services Section */}
      <section className="py-12 sm:py-16 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-4">Partner Referral Programs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Exclusive partner opportunities where every signup supports veteran programs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link href={buildLink("/my-locker")} data-testid="link-my-locker">
              <div className="p-6 sm:p-8 border-2 border-brand-gold rounded-xl hover:bg-brand-gold/5 cursor-pointer group transition-all hover:shadow-lg bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-gold rounded-lg flex items-center justify-center text-brand-navy group-hover:scale-110 transition-transform">
                    <Store size={28} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-brand-navy mb-1">MY LOCKER</h3>
                    <p className="text-sm text-gray-600">FREE branded merchandise stores for businesses</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href={buildLink("/vgift-cards")} data-testid="link-vgift">
              <div className="p-6 sm:p-8 border-2 border-brand-blue rounded-xl hover:bg-brand-blue/5 cursor-pointer group transition-all hover:shadow-lg bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-blue rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Gift size={28} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-brand-navy mb-1">vGift Cards</h3>
                    <p className="text-sm text-gray-600">Virtual gift cards redeemable at 100+ brands</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-navy py-12">
        <div className="container mx-auto px-4">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-brand-red to-brand-red/80 rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8 text-center md:text-left max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl sm:text-2xl font-display mb-1 sm:mb-2">Ready to Start Earning?</h3>
              <p className="text-sm sm:text-base text-white/90">Join NavigatorUSA and start referring clients today.</p>
            </div>
            <Link href="/affiliate">
              <Button className="bg-white text-brand-red font-bold hover:bg-gray-100 px-6 sm:px-8 w-full md:w-auto">
                Become an Affiliate
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
