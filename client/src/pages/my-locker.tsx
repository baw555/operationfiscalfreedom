import { Layout } from "@/components/layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Palette, ShoppingBag, DollarSign, Printer, CheckCircle, ArrowRight, Users, Package, ExternalLink, Store } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function MyLocker() {
  const [location] = useLocation();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { toast } = useToast();

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

  const handlePartnerClick = async () => {
    setIsRedirecting(true);
    try {
      const response = await fetch('/api/finops/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerType: 'my_locker',
          referralCode: referralCode
        })
      });
      
      const data = await response.json();
      if (data.redirectUrl) {
        window.open(data.redirectUrl, '_blank');
      }
    } catch (error) {
      console.error('Error tracking click:', error);
      window.open('https://www.moq1.com/imaginate-pod/navigatorusa', '_blank');
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <Layout>
      <section className="bg-brand-navy text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold mb-4 sm:mb-6">
            <Store className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">NavigatorUSA Partner</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6" data-testid="text-page-title">MY LOCKER</h1>
          <p className="text-xl sm:text-2xl text-brand-gold font-bold mb-2">FREE Online Stores for Businesses</p>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-2" data-testid="text-page-description">
            Get a fully-functional ecommerce store ready in 72 hours. Print-on-demand merchandise for any business, organization, team or group - 100% FREE through NavigatorUSA.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-4">NavigatorUSA Partner Benefit</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Through our exclusive partnership, we provide veterans and businesses a turnkey approach to launch their own branded merchandise store. Every purchase supports veteran programs through NavigatorUSA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12">
            <Card className="border-t-4 border-t-brand-red shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-red/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-brand-red" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">For Business Owners</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Get your own FREE branded merchandise store! Perfect for businesses, churches, civic organizations, local teams, and associations. Your store will be ready in just 72 hours with hundreds of products.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-blue shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-brand-blue" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Earn as an Affiliate</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Generate income by helping businesses get their FREE store! Sell this service to local businesses, associations, churches, and teams. Earn commissions on every sale from stores you help create.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto bg-brand-red/5 border-2 border-brand-red p-6 sm:p-10 rounded-xl mb-12">
            <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-4 text-center">See a Sample NavigatorUSA Store</h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6 text-center">
              View our official NavigatorUSA merchandise store to see what your business store could look like!
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={handlePartnerClick}
                disabled={isRedirecting}
                size="lg"
                className="bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8"
                data-testid="button-view-sample-store"
              >
                {isRedirecting ? 'Opening...' : 'View Sample Store'} <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-brand-navy/5 p-6 sm:p-10 rounded-xl">
            <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-4 text-center">Hundreds of Products Available</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
              {['T-Shirts', 'Hoodies', 'Mugs', 'Hats', 'Tote Bags', 'Stickers'].map((item) => (
                <div key={item} className="p-3 bg-white rounded-lg shadow-sm">
                  <Package className="w-6 h-6 mx-auto mb-2 text-brand-navy" />
                  <span className="text-xs font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">
              Plus dozens more! All printed, packaged, and shipped in the USA.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6 sm:mb-8 text-center">How It Works</h2>
            
            <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg border-l-4 border-brand-red mb-8">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                  <p className="text-sm sm:text-base text-gray-700">Click the button below to start your FREE store application through NavigatorUSA.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                  <p className="text-sm sm:text-base text-gray-700">Provide your logo or design (high-resolution, print-ready PNG with transparent background).</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                  <p className="text-sm sm:text-base text-gray-700">Within 72 hours, your branded store will be live with a unique web link!</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold shrink-0">4</div>
                  <p className="text-sm sm:text-base text-gray-700">Share your store link - we handle printing, fulfillment, and customer service!</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-navy/5 p-6 sm:p-8 rounded-xl">
              <h4 className="font-display text-lg text-brand-navy mb-4 text-center">NavigatorUSA Handles Everything</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  'Store Creation',
                  'Order Management', 
                  'Printing & Fulfillment',
                  'Shipping',
                  'Customer Service',
                  'USA Made'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-brand-navy text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-display mb-4 sm:mb-6">Get Your FREE Store Today!</h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8">
            Join NavigatorUSA's partner program and get a fully-functional merchandise store at no cost. 100% of proceeds support veteran programs.
          </p>
          <Button 
            onClick={handlePartnerClick}
            disabled={isRedirecting}
            size="lg"
            className="bg-brand-red hover:bg-brand-red/90 text-white font-bold px-6 sm:px-10 h-12 sm:h-14"
            data-testid="link-get-started"
          >
            {isRedirecting ? 'Opening...' : 'Get Started - FREE'} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </Layout>
  );
}
