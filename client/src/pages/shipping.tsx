import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Truck, DollarSign, TrendingUp, Shield, CheckCircle, ArrowRight, BarChart, Package, Download, FileText } from "lucide-react";

export default function Shipping() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-blue/20 border border-brand-blue/40 text-brand-blue mb-4 sm:mb-6">
            <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">Income Opportunity</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6" data-testid="text-page-title">Shipping Optimization</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-2" data-testid="text-page-description">
            Help businesses reduce their FedEx and UPS shipping costs by 15-42%. Earn 24% monthly commissions on every referral.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-4">About ICC Logistics</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Leveraging over 50 years of logistics intelligence and data analytics, ICC provides Contract Optimization, Audit, and Data Analysis services to help shippers uncover significant, sustainable savings that consistently outperform what can be achieved through internal efforts.
            </p>
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
                  ICC utilizes a proprietary <strong>$5B+ annual parcel data pool</strong> to benchmark pricing against best-in-class peer contracts. They identify true costs and negotiate significant savings.
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
                  Earn <strong className="text-brand-gold">24% of ICC's gross revenue</strong> for every referred engagement. Commissions are paid monthly for the full duration of the client relationship.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6 text-center">What ICC Offers</h2>
            
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
                Any organization that pays its own freight invoices and manages relationships with logistics providers. ICC's client base spans a broad range of industries and revenue sizes. Shipping typically represents 3%–10% of gross revenue.
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <a 
                href="/resources/FedEx_List_Rates_2026_vs_2025.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-orange-500 group"
                data-testid="link-download-fedex-rates-2026"
              >
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-orange-500/20 transition-colors">
                  <FileText className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-brand-navy text-sm truncate">FedEx List Rates</h4>
                  <p className="text-xs text-gray-500">2026 vs 2025</p>
                </div>
                <Download className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors shrink-0" />
              </a>

              <a 
                href="/resources/FedEx_List_Rates_2025_vs_2020.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-orange-500 group"
                data-testid="link-download-fedex-rates-5year"
              >
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-orange-500/20 transition-colors">
                  <FileText className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-brand-navy text-sm truncate">FedEx 5-Year Look Back</h4>
                  <p className="text-xs text-gray-500">2025 vs 2020</p>
                </div>
                <Download className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors shrink-0" />
              </a>

              <a 
                href="/resources/FedEx_Fee_Surcharge_Rates_2026_vs_2025.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-orange-500 group"
                data-testid="link-download-fedex-fees-2026"
              >
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-orange-500/20 transition-colors">
                  <FileText className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-brand-navy text-sm truncate">FedEx Fees & Surcharges</h4>
                  <p className="text-xs text-gray-500">2026 vs 2025</p>
                </div>
                <Download className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors shrink-0" />
              </a>

              <a 
                href="/resources/FedEx_Fee_Surcharge_Rates_2025_vs_2020.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-orange-500 group"
                data-testid="link-download-fedex-fees-5year"
              >
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-orange-500/20 transition-colors">
                  <FileText className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-brand-navy text-sm truncate">FedEx Fees 5-Year</h4>
                  <p className="text-xs text-gray-500">2025 vs 2020</p>
                </div>
                <Download className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors shrink-0" />
              </a>

              <a 
                href="/resources/UPS_Fee_Surcharge_Rates_2025_vs_2020.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-amber-700 group"
                data-testid="link-download-ups-fees"
              >
                <div className="w-12 h-12 bg-amber-700/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-amber-700/20 transition-colors">
                  <FileText className="w-6 h-6 text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-brand-navy text-sm truncate">UPS Fees & Surcharges</h4>
                  <p className="text-xs text-gray-500">2025 vs 2020</p>
                </div>
                <Download className="w-5 h-5 text-gray-400 group-hover:text-amber-700 transition-colors shrink-0" />
              </a>

              <a 
                href="/resources/ICC_Rate_Increase_Playbook_2025.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-brand-blue group"
                data-testid="link-download-playbook"
              >
                <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-blue/20 transition-colors">
                  <FileText className="w-6 h-6 text-brand-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-brand-navy text-sm truncate">ICC Rate Increase Playbook</h4>
                  <p className="text-xs text-gray-500">2025 Strategies</p>
                </div>
                <Download className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors shrink-0" />
              </a>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6">
              All rate charts courtesy of ICC Logistics Services, Inc.
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
