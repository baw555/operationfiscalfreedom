import { Layout } from "@/components/layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Shield, Scale, DollarSign, Flag, CheckCircle, ArrowRight, CreditCard, ExternalLink, Play } from "lucide-react";
import { useState, useEffect } from "react";

export default function MerchantServices() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchVimeoThumbnail = async () => {
      try {
        const response = await fetch('https://vimeo.com/api/oembed.json?url=https://vimeo.com/1159350744');
        const data = await response.json();
        if (data.thumbnail_url) {
          const largeThumbnail = data.thumbnail_url.replace(/_\d+x\d+/, '_1280x720');
          setVideoThumbnail(largeThumbnail);
        }
      } catch (error) {
        console.error('Error fetching Vimeo thumbnail:', error);
      }
    };
    fetchVimeoThumbnail();
  }, []);

  const handlePartnerClick = async () => {
    setIsRedirecting(true);
    try {
      const response = await fetch('/api/finops/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerType: 'merchant_services',
          referralCode: referralCode
        })
      });
      
      const data = await response.json();
      if (data.redirectUrl) {
        window.open(data.redirectUrl, '_blank');
      }
    } catch (error) {
      console.error('Error tracking click:', error);
      window.open('https://staging.fluidfintec.com/merchant-signup', '_blank');
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <Layout>
      <section className="bg-brand-navy text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red mb-4 sm:mb-6">
            <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">NavigatorUSA Partner</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6" data-testid="text-page-title">Merchant Processing</h1>
          <p className="text-xl sm:text-2xl text-brand-gold font-bold mb-2">100% of Commissions Support Veterans</p>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-2" data-testid="text-page-description">
            Help American businesses comply with Executive Order 14117 while supporting NavigatorUSA's veteran programs. Every merchant you sign up contributes to veteran causes.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <Card className="border-t-4 border-t-brand-red shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-red/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <Flag className="w-7 h-7 sm:w-8 sm:h-8 text-brand-red" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Patriotic Mission</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Executive Order 14117 affects all 36 million U.S. businesses. Our service ensures customer data is protected from foreign adversaries like China and Iran. Every American business becomes a data sentry.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-blue shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <Scale className="w-7 h-7 sm:w-8 sm:h-8 text-brand-blue" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Compliance Solution</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Help merchants avoid criminal liability and civil fines. Our platform removes all personal customer data from receipts while matching or beating their current processing rates.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-gold shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-brand-gold" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Support Veterans</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  <strong className="text-brand-red">100% of commissions</strong> from merchant signups go directly to NavigatorUSA veteran programs. Build recurring impact while helping businesses stay compliant.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6 sm:mb-8 text-center">Learn More About This Opportunity</h2>
            
            <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg mb-8">
              <div className="aspect-video bg-brand-navy/10 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden">
                {showVideo ? (
                  <iframe 
                    src="https://player.vimeo.com/video/1159350744?autoplay=1" 
                    className="w-full h-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title="Merchant Services Overview"
                    loading="lazy"
                  />
                ) : (
                  <div 
                    className="w-full h-full relative cursor-pointer group"
                    onClick={() => setShowVideo(true)}
                  >
                    {videoThumbnail ? (
                      <img 
                        src={videoThumbnail} 
                        alt="Video thumbnail" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-navy/20 to-brand-navy/40" />
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                          <Play className="w-10 h-10 text-brand-navy ml-1" />
                        </div>
                        <h3 className="text-xl font-display text-white mb-2 drop-shadow-lg">Overview Video</h3>
                        <p className="text-white/90 text-sm drop-shadow">Click to play</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg border-l-4 border-brand-red">
              <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6">Why Businesses Need This</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-gray-700">36 million U.S. businesses affected by Executive Order 14117</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-gray-700">Businesses face criminal liability and civil fines for non-compliance</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-gray-700">Our solution matches or beats current processing rates</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-gray-700">Every signup supports veteran programs through NavigatorUSA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-brand-navy text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-display mb-4 sm:mb-6">Register a Business Today</h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8">
            Help American businesses stay compliant while supporting NavigatorUSA's veteran programs.
          </p>
          <Button 
            onClick={handlePartnerClick}
            disabled={isRedirecting}
            size="lg"
            className="bg-brand-red hover:bg-brand-red/90 text-white font-bold px-6 sm:px-10 h-12 sm:h-14"
            data-testid="link-register-business"
          >
            {isRedirecting ? 'Opening...' : 'Register Your Business'} <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </Layout>
  );
}
