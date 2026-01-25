import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Shield, Scale, DollarSign, Flag, CheckCircle, ArrowRight } from "lucide-react";

export default function MerchantServices() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red mb-4 sm:mb-6">
            <Flag className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">Income Opportunity</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6" data-testid="text-page-title">Merchant Services</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-2" data-testid="text-page-description">
            Help American businesses comply with Executive Order 14117 while earning recurring monthly commissions.
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
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Patriotism</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Executive Order 14117, supported by President Trump, affects all 36 million U.S. businesses that process credit and debit cards. As a result, every American business now serves as a data sentry, responsible for protecting customer financial and personal information.
                </p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-4">
                  Our service ensures that if customer data is ever shared—even indirectly—it is rendered fully anonymous, preventing access by foreign adversaries such as China or Iran.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-blue shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <Scale className="w-7 h-7 sm:w-8 sm:h-8 text-brand-blue" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Compliance</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Our platform helps merchants avoid criminal liability, civil fines, and lawsuit exposure by switching to the only credit card processing system that removes all personal customer data from receipts.
                </p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-4">
                  And we do it while matching or beating their current processing rates.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-gold shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-brand-gold" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Monthly Earnings</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  When a business switches to our service, you earn monthly commissions tied to total transaction volume.
                </p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-4">
                  Build recurring, residual income by offering a critical compliance solution to businesses of every size.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-xl sm:rounded-2xl shadow-lg border-l-4 border-brand-red">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6">Why This Matters</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-gray-700">36 million U.S. businesses are affected by Executive Order 14117</p>
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
                <p className="text-sm sm:text-base text-gray-700">You earn recurring monthly income from every merchant you sign up</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-brand-navy text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-display mb-4 sm:mb-6">Ready to Start Earning?</h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8">
            Join the mission to protect American businesses and build your recurring income stream.
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
