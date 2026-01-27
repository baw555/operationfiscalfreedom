import { Layout } from "@/components/layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Gift, CreditCard, DollarSign, CheckCircle, ArrowRight, ExternalLink, ShoppingBag, Users, Heart } from "lucide-react";
import { useState, useEffect } from "react";

const POPULAR_BRANDS = [
  'Amazon', 'Target', 'Walmart', 'Starbucks', 'Home Depot', 'Lowes',
  'Best Buy', 'Nike', 'Uber Eats', 'DoorDash', 'Netflix', 'Spotify',
  'Apple', 'Google Play', 'Xbox', 'PlayStation', 'Visa', 'Mastercard',
  'AMC Theatres', 'Applebees', 'Olive Garden', 'Cracker Barrel',
  'Barnes & Noble', 'Bass Pro Shops', 'CVS', 'Dominos', 'Boston Market'
];

export default function VGiftCards() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

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
          partnerType: 'vgift_cards',
          referralCode: referralCode
        })
      });
      
      const data = await response.json();
      if (data.redirectUrl) {
        window.open(data.redirectUrl, '_blank');
      }
    } catch (error) {
      console.error('Error tracking click:', error);
      window.open('https://ptogiftcardprogram.com/navigator-usa-virtual-gift-cards/?group=', '_blank');
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <Layout>
      <section className="bg-brand-navy text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold mb-4 sm:mb-6">
            <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">NavigatorUSA Partner</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6" data-testid="text-page-title">NavigatorUSA vGift Cards</h1>
          <p className="text-xl sm:text-2xl text-brand-gold font-bold mb-2">Virtual Gift Cards That Support Veterans</p>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-2" data-testid="text-page-description">
            Purchase a NavigatorUSA vGift Card and let the recipient choose from 100+ major brands. Every purchase supports veteran programs.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-4">How vGift Works</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              vGift is a digital gift card that can be redeemed for any of our 100+ partner brands. The perfect gift when you're not sure what someone wants!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12">
            <Card className="border-t-4 border-t-brand-red shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-red/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <CreditCard className="w-7 h-7 sm:w-8 sm:h-8 text-brand-red" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Purchase a vGift</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">
                  Buy a NavigatorUSA vGift Card from $5 to $100. Add a personal message and send it instantly via email.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-blue shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-brand-blue" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Recipient Chooses</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">
                  The recipient clicks a unique link and chooses from 100+ nationally branded gift cards. They pick what they want!
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-gold shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-brand-gold" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Support Veterans</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">
                  Every vGift Card purchased through NavigatorUSA helps support veteran programs and families.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto bg-brand-navy/5 p-6 sm:p-10 rounded-xl">
            <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-6 text-center">Popular Brands Available</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3">
              {POPULAR_BRANDS.slice(0, 21).map((brand) => (
                <div key={brand} className="p-2 bg-white rounded-lg shadow-sm text-center">
                  <span className="text-xs font-medium text-gray-700">{brand}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">
              Plus many more! Over 100 nationally recognized brands to choose from.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6 sm:mb-8 text-center">Why Choose NavigatorUSA vGift Cards?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-display text-lg text-brand-navy mb-4">For Gift Givers</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                    <span className="text-sm text-gray-700">Never pick the "wrong" gift again</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                    <span className="text-sm text-gray-700">Instant delivery via email</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                    <span className="text-sm text-gray-700">Add personalized messages</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                    <span className="text-sm text-gray-700">Support veteran causes</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-display text-lg text-brand-navy mb-4">For Recipients</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                    <span className="text-sm text-gray-700">Choose from 100+ brands</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                    <span className="text-sm text-gray-700">No expiration dates</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                    <span className="text-sm text-gray-700">Easy online redemption</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                    <span className="text-sm text-gray-700">Get exactly what you want</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-brand-navy text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-display mb-4 sm:mb-6">Send a vGift Card Today!</h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8">
            The perfect gift for any occasion - birthdays, holidays, thank yous, or just because. Every purchase supports NavigatorUSA's veteran programs.
          </p>
          <Button 
            onClick={handlePartnerClick}
            disabled={isRedirecting}
            size="lg"
            className="bg-brand-red hover:bg-brand-red/90 text-white font-bold px-6 sm:px-10 h-12 sm:h-14"
            data-testid="link-shop-vgift"
          >
            {isRedirecting ? 'Opening...' : 'Shop vGift Cards'} <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </Layout>
  );
}
