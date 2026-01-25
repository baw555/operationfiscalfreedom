import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Truck, DollarSign, TrendingUp, Shield, CheckCircle, ArrowRight, BarChart, Package, Download, FileText, Plane, Ship } from "lucide-react";

export default function Shipping() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white py-12 sm:py-20 relative overflow-hidden min-h-[280px] sm:min-h-[320px]">
        <style>{`
          @keyframes moveRight {
            0% { transform: translateX(-150px); opacity: 1; }
            100% { transform: translateX(calc(100vw + 150px)); opacity: 1; }
          }
          @keyframes glisten {
            0%, 100% { background-position: -200% center; }
            50% { background-position: 200% center; }
          }
          @keyframes glistenAlt {
            0%, 100% { background-position: -200% center; }
            50% { background-position: 200% center; }
          }
          .animate-truck {
            animation: moveRight 10s linear infinite;
          }
          .animate-plane {
            animation: moveRight 10s linear infinite;
            animation-delay: 3s;
          }
          .animate-ship {
            animation: moveRight 10s linear infinite;
            animation-delay: 6s;
          }
          .glisten-text {
            background: linear-gradient(
              90deg,
              #D4AF37 0%,
              #D4AF37 40%,
              #FFFFFF 50%,
              #D4AF37 60%,
              #D4AF37 100%
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: glisten 20s ease-in-out infinite;
          }
          .glisten-logo {
            background: linear-gradient(
              90deg,
              #1a365d 0%,
              #1a365d 40%,
              #D4AF37 50%,
              #1a365d 60%,
              #1a365d 100%
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: glistenAlt 20s ease-in-out infinite;
            animation-delay: 10s;
          }
        `}</style>
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-plane absolute top-[15%] left-0 text-brand-red/60">
            <Plane className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
          <div className="animate-truck absolute top-[45%] left-0 text-white/60">
            <Truck className="w-10 h-10 sm:w-14 sm:h-14" />
          </div>
          <div className="animate-ship absolute top-[75%] left-0 text-brand-blue/60">
            <Ship className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-blue/20 border border-brand-blue/40 text-brand-blue mb-4 sm:mb-6">
            <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">Income Opportunity</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-2 sm:mb-4" data-testid="text-page-title">Shipping Optimization</h1>
          <p className="text-lg sm:text-2xl font-bold tracking-widest mb-4 sm:mb-6 glisten-text">VETERAN LOGISTICS</p>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-2" data-testid="text-page-description">
            Help businesses reduce their FedEx and UPS shipping costs by 15-42%. Earn 24% monthly commissions on every referral.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-display mb-4 glisten-logo">Navigator USA: Veteran Logistics</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-2 font-semibold italic">
              Logistics: What the military does best.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
              Leveraging over 50 years of logistics intelligence and data analytics, we provide Contract Optimization, Audit, and Data Analysis services to help shippers uncover significant, sustainable savings that consistently outperform what can be achieved through internal efforts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/logistics-overview"
                className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
                data-testid="link-full-overview"
              >
                CLICK HERE FOR FULL OVERVIEW <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/best-practices"
                className={cn(buttonVariants({ size: "lg" }), "bg-brand-blue hover:bg-brand-blue/90 text-white font-bold px-8")}
                data-testid="link-best-practices"
              >
                CLICK HERE FOR BEST PRACTICES FREIGHT & PARCEL <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12">
            <Card className="border-t-4 border-t-brand-red shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-red/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-brand-red" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">The Problem</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Parcel shipping costs have risen by over <strong className="text-brand-red">35% since 2020</strong>. FedEx and UPS announce 5.9% General Rate Increases annually, but hidden surcharges push actual increases much higher.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-blue shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <BarChart className="w-7 h-7 sm:w-8 sm:h-8 text-brand-blue" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">The Solution</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  We utilize a proprietary <strong>$5B+ annual parcel data pool</strong> to benchmark pricing against best-in-class peer contracts. We identify true costs and negotiate significant savings.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-gold shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-brand-gold" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Your Earnings</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Earn <strong className="text-brand-gold">24% of gross revenue</strong> for every referred engagement. Commissions are paid monthly for the full duration of the client relationship.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6 sm:mb-8 text-center">Real Earnings Examples</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border-l-4 border-brand-red">
                <h4 className="font-bold text-brand-navy mb-2">Parts Supplier</h4>
                <p className="text-sm text-gray-600 mb-2">$138,000 FedEx spend → 42% savings</p>
                <p className="text-lg font-bold text-brand-red">$452/month commission</p>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border-l-4 border-brand-blue">
                <h4 className="font-bold text-brand-navy mb-2">Textiles Company</h4>
                <p className="text-sm text-gray-600 mb-2">$150,000 UPS spend → 31% savings</p>
                <p className="text-lg font-bold text-brand-blue">$325/month commission</p>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border-l-4 border-brand-gold">
                <h4 className="font-bold text-brand-navy mb-2">Retailer</h4>
                <p className="text-sm text-gray-600 mb-2">$1.2M freight spend → 36% savings</p>
                <p className="text-lg font-bold text-brand-gold">$1,728/month commission</p>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border-l-4 border-brand-red">
                <h4 className="font-bold text-brand-navy mb-2">Apparel Manufacturer</h4>
                <p className="text-sm text-gray-600 mb-2">$5M UPS spend → 26% savings</p>
                <p className="text-lg font-bold text-brand-red">$8,320/month commission</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6 text-center">What We Offer</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-navy text-sm">Small Package (Parcel) Optimization</h4>
                  <p className="text-xs text-gray-600">UPS, FedEx, DHL contract negotiation</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-navy text-sm">Domestic Freight Optimization</h4>
                  <p className="text-xs text-gray-600">LTL and FTL rate negotiation</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-navy text-sm">International Ocean/Air Freight</h4>
                  <p className="text-xs text-gray-600">Global shipping optimization</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-navy text-sm">Audit & Data Analysis</h4>
                  <p className="text-xs text-gray-600">Identify billing discrepancies</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-brand-navy/5 rounded-xl">
              <h4 className="font-display text-lg text-brand-navy mb-3">Ideal Clients</h4>
              <p className="text-sm text-gray-700">
                Any organization that pays its own freight invoices and manages relationships with logistics providers. Our client base spans a broad range of industries and revenue sizes. Shipping typically represents 3%–10% of gross revenue.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-3 text-center">Rate Increase Resources</h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Download these rate comparison charts to share with prospects and demonstrate the dramatic shipping cost increases.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <a 
                href="/resources/FedEx_List_Rates_2026_vs_2025.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
                data-testid="link-download-fedex-rates-2026"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img 
                    src="/resources/preview-fedex-rates-2026.png" 
                    alt="FedEx List Rates 2026 vs 2025 Preview" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 border-t-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-brand-navy text-sm">FedEx List Rates</h4>
                      <p className="text-xs text-gray-500">2026 vs 2025</p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                </div>
              </a>

              <a 
                href="/resources/FedEx_List_Rates_2025_vs_2020.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
                data-testid="link-download-fedex-rates-5year"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img 
                    src="/resources/preview-fedex-rates-5year.png" 
                    alt="FedEx 5-Year Look Back Preview" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 border-t-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-brand-navy text-sm">FedEx 5-Year Look Back</h4>
                      <p className="text-xs text-gray-500">2025 vs 2020</p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                </div>
              </a>

              <a 
                href="/resources/FedEx_Fee_Surcharge_Rates_2026_vs_2025.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
                data-testid="link-download-fedex-fees-2026"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img 
                    src="/resources/preview-fedex-fees-2026.png" 
                    alt="FedEx Fees & Surcharges 2026 Preview" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 border-t-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-brand-navy text-sm">FedEx Fees & Surcharges</h4>
                      <p className="text-xs text-gray-500">2026 vs 2025</p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                </div>
              </a>

              <a 
                href="/resources/FedEx_Fee_Surcharge_Rates_2025_vs_2020.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
                data-testid="link-download-fedex-fees-5year"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img 
                    src="/resources/preview-fedex-fees-5year.png" 
                    alt="FedEx Fees 5-Year Preview" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 border-t-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-brand-navy text-sm">FedEx Fees 5-Year</h4>
                      <p className="text-xs text-gray-500">2025 vs 2020</p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                </div>
              </a>

              <a 
                href="/resources/UPS_Fee_Surcharge_Rates_2025_vs_2020.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
                data-testid="link-download-ups-fees"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img 
                    src="/resources/preview-ups-fees.png" 
                    alt="UPS Fees & Surcharges Preview" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 border-t-4 border-amber-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-brand-navy text-sm">UPS Fees & Surcharges</h4>
                      <p className="text-xs text-gray-500">2025 vs 2020</p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-amber-700 transition-colors" />
                  </div>
                </div>
              </a>

              <a 
                href="/resources/ICC_Rate_Increase_Playbook_2025.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
                data-testid="link-download-playbook"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img 
                    src="/resources/preview-playbook.png" 
                    alt="Rate Increase Playbook Preview" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 border-t-4 border-brand-blue">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-brand-navy text-sm">Rate Increase Playbook</h4>
                      <p className="text-xs text-gray-500">2025 Strategies</p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors" />
                  </div>
                </div>
              </a>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6">
              All rate charts courtesy of Navigator USA.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-brand-navy text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-display mb-4 sm:mb-6">Ready to Start Earning?</h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8">
            Refer businesses with shipping expenses and earn 24% monthly commissions for the life of the relationship.
          </p>
          <Link 
            href="/contact" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-6 sm:px-10 h-12 sm:h-14 cursor-pointer")}
            data-testid="link-learn-more"
          >
            Click Here to Learn More <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
