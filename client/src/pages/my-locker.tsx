import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Palette, ShoppingBag, DollarSign, Printer, CheckCircle, ArrowRight, Users, Package } from "lucide-react";

export default function MyLocker() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold mb-4 sm:mb-6">
            <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">Income Opportunity</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6" data-testid="text-page-title">Design - MY LOCKER</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-2" data-testid="text-page-description">
            Become an affiliate reseller for print-on-demand shops. FREE online ecommerce shops for any business, organization, team or group - ready in 72 hours.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-4">Welcome to Navigator USA</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              If you're looking to support Veterans directly, you've come to the right place. Through our network of vendor partners, we provide Veterans a turnkey approach to opportunities that provide the flexibility, freedom and options to support themselves, their families, and the businesses and organizations they care about.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12">
            <Card className="border-t-4 border-t-brand-red shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-red/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-brand-red" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Veteran-Created Shops</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Browse our directory and collection of veteran-created online shops provided by our Print-On-Demand eCommerce partner, Imaginate POD. A portion of every sale from every shop goes to support Veteran-related causes through Navigator USA.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-blue shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <Package className="w-7 h-7 sm:w-8 sm:h-8 text-brand-blue" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Hundreds of Products</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  In every shop you'll find hundreds of options across apparel, swag, hard goods and more! Mugs, hats, t-shirts, hoodies, and dozens of items for special events, causes, or teams. Every order is printed, packaged and shipped in the USA.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto bg-brand-navy/5 p-6 sm:p-10 rounded-xl mb-12">
            <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-4 text-center">What is DIGISOFT®?</h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              DIGISOFT® is the next generation digital print technology the world has been waiting for. Engineered to deliver exceptionally high-quality prints on even the toughest fabrics, DIGISOFT® is on-demand printing as it was always intended – vibrant, full-spectrum color, and detailed.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              DIGISOFT® prints are known for a sharp, consistent, true-to-color look with a soft, wearable feel, and impressive longevity on any fabric.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Equal parts DTG (Direct-to-Garment) and DTF (Direct-to-Film) print processes, DIGISOFT® combines the best qualities of each without their limitations. The result is a product that's visually-stunning, durable, surprisingly versatile, and objectively superior.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6 sm:mb-8 text-center">Become an Affiliate Reseller</h2>
            
            <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg border-l-4 border-brand-red mb-8">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
                Through our partnership with Imaginate POD, you will be able to have a <strong className="text-brand-red">FREE</strong> fully functional online shop ready to go for any business, organization, team or group within 72 hours.
              </p>
              
              <h4 className="font-display text-lg text-brand-navy mb-4">How It Works:</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                  <p className="text-sm sm:text-base text-gray-700">Submit your request through our online application form to become an affiliate partner with Navigator USA.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                  <p className="text-sm sm:text-base text-gray-700">Collect a high-resolution, print-ready logo or image from businesses, teams, churches or any organization that wants a FREE online shop.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                  <p className="text-sm sm:text-base text-gray-700">Submit your design file(s) to Navigator USA. Within 72 hours, the shop will be ready with a unique web link.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold shrink-0">4</div>
                  <p className="text-sm sm:text-base text-gray-700">We provide a printable flyer and email template for your client to promote their new shop!</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-navy/5 p-6 sm:p-8 rounded-xl">
              <h4 className="font-display text-lg text-brand-navy mb-4 text-center">We Handle Everything</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                  <span className="text-sm text-gray-700">Shop Creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                  <span className="text-sm text-gray-700">Order Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                  <span className="text-sm text-gray-700">Fulfillment & Printing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                  <span className="text-sm text-gray-700">Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                  <span className="text-sm text-gray-700">Customer Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                  <span className="text-sm text-gray-700">USA Made</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6 text-center">Design Guidelines</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-lg">
                <h4 className="font-bold text-brand-navy mb-2">Artwork Specifications</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Dimensions: 11" x 13"</li>
                  <li>• Resolution: 300 DPI</li>
                  <li>• File Type: PNG with transparent background</li>
                  <li>• Colors: sRGB color profile</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg">
                <h4 className="font-bold text-brand-navy mb-2">Default Print Sizes</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Adult Shirt: 11" x 13"</li>
                  <li>• Youth Shirt: 9" x 11"</li>
                  <li>• Adult Hoodie: 11" x 11"</li>
                  <li>• Tote Bags: 11.41" x 13"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-brand-navy text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-display mb-4 sm:mb-6">Ready to Get Started?</h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8">
            Submit your application to become an affiliate reseller for Navigator USA's print-on-demand eCommerce solution today!
          </p>
          <Link 
            href="/contact" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-6 sm:px-10 h-12 sm:h-14 cursor-pointer")}
            data-testid="link-apply-now"
          >
            Click Here to Apply <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
