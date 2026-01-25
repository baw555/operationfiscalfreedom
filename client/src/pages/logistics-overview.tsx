import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Truck, Package, Ship, Plane, DollarSign, CheckCircle, ArrowRight, BarChart, FileText, Users } from "lucide-react";

export default function LogisticsOverview() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-blue/20 border border-brand-blue/40 text-brand-blue mb-4 sm:mb-6">
            <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">Full Overview</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6" data-testid="text-page-title">Navigator USA: Veteran Logistics</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-2 italic" data-testid="text-page-description">
            Logistics: What the military does best.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6 text-center">About Navigator USA: Veteran Logistics</h2>
            
            <div className="space-y-4 text-gray-700">
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-1" />
                <p>Leveraging over 50 years of logistics intelligence and data analytics, Navigator USA: Veteran Logistics provides Contract Optimization, Audit, and Data Analysis services to a diverse range of shippers.</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-1" />
                <p>Our mission is to help shippers uncover significant, sustainable savings that consistently outperform what can be achieved through internal efforts.</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-1" />
                <p>We specialize in Parcel, North American Domestic Freight, and International Ocean/Air Freight - delivering strategic, data-driven solutions that enhance visibility, reduce costs, and improve operational efficiency across all modes.</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-1" />
                <p>Our ideal client is an organization that pays its own freight invoices and manages relationships with logistics providers.</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-1" />
                <p><strong>Industries Served</strong> – Our client base spans a broad range of industries and revenue sizes. We are ideally positioned for most sectors, with the exception of highly regulated industries such as firearms, explosives, and tobacco, where limited optimization opportunities exist due to strict freight regulations.</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-1" />
                <p><strong>Client Size & Spend</strong> – Our clients vary greatly in gross revenue, shipping typically represents 3%–10% of gross revenue, and in some cases significantly higher. Our services are designed to deliver measurable savings regardless of company size or spend profile.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-8 h-8 text-brand-red" />
              <h2 className="text-2xl sm:text-3xl font-display text-brand-navy">Small Package (Parcel) Optimization</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-brand-navy mb-2">Data Pool Benchmarking</h4>
                <p>We utilize our proprietary $5B+ annual parcel data pool to benchmark shippers' parcel pricing against best-in-class peer contracts with similar shipping profiles.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-brand-navy mb-2">Pricing Review</h4>
                <p>We evaluate the lanes, rates, minimum charges, dimensional weight provision, accessorial fees, incentives, increases, contract terms, and contract conditions.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-brand-navy mb-2">Identify Savings</h4>
                <p>We identify true service level and accessorial expenditures, highlighting areas for contractual improvements and meaningful cost savings.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-brand-navy mb-2">Detailed Savings</h4>
                <p>Savings by service-levels, weight-breaks, and accessorial fees are provided to the client after our service agreement is executed.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-brand-navy mb-2">Parcel Contract Optimization & Negotiation</h4>
                <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
                  <li>We provide strategic behind-the-scenes support for direct carrier negotiations with UPS and FedEx, in compliance with carrier rules implemented in 2010. For all other parcel carriers, we can negotiate directly on behalf of the shipper.</li>
                  <li>Direct carrier negotiations typically complete in 50–65 days.</li>
                  <li>We also offer exclusive parcel pricing programs with UPS, FedEx, DHL, and other parcel carriers that eliminate the need for direct negotiations—we manage all rate discussions, contract setup, and implementation on the shipper's behalf.</li>
                  <li>Non-direct negotiations are typically completed in 4 to 6 weeks.</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-brand-navy mb-2">Validation & Reporting</h4>
                <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
                  <li>We re-rate every shipment by tracking number to verify savings, validate net charges, and identify potential billing discrepancies.</li>
                  <li>Each shipment is rated against the list rate and fuel surcharge in effect at the time of shipment.</li>
                  <li>Prior discounts (the baseline) are compared to new discounts to calculate the true dollar savings per shipment.</li>
                  <li>We maintain corrected shipment data to ensure full transparency and audit accuracy.</li>
                  <li>Detailed savings results and analytics are delivered through Excel reports and Tableau.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="w-8 h-8 text-brand-blue" />
              <h2 className="text-2xl sm:text-3xl font-display text-brand-navy">North American Domestic Freight Optimization</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-brand-navy mb-2">Data Pool Benchmarking</h4>
                <p>We utilize our proprietary $3B+ annual domestic freight data pool to benchmark the shippers' freight pricing against best-in-class peer contracts with similar shipping profiles.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-brand-navy mb-2">Pricing Review</h4>
                <p>We evaluate lanes, rates, minimum charges, density, freight class/NMFC codes, tariffs, rate ponies, accessorial fees, incentives, increases, contract terms, and conditions.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-brand-navy mb-2">Identify Savings</h4>
                <p>We identify true service level and accessorial expenditures by addressing freight pricing variability to show an apple to apples benchmark, highlighting areas for contractual improvements and meaningful cost savings.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-brand-navy mb-2">Detailed Savings</h4>
                <p>Service-level, weight-break, discount, and accessorial fee savings details are provided to the client after our service agreement is executed.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-brand-navy mb-2">RFP Administration & Negotiations</h4>
                <p>With a Letter of Authorization, we administer the RFP, directly negotiate pricing/services, and obtain proposals for the client's review and implementation.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-brand-navy mb-2">Structured RFP Process</h4>
                <p>We prepare and submit the detailed RFP packet to a mutually agreed participant list, providing customized shipment data and a uniform pricing template for consistent evaluation.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-brand-navy mb-2">Carrier Bid Evaluation</h4>
                <p>We use all bids to re-rate historical shipments for a transparent comparison and accurate projected savings.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-brand-navy mb-2">Validation & Reporting</h4>
                <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
                  <li>We validate the correct rates and net cost are applied correctly to each shipment and/or Pro number based on the agreed carrier contracts and pricing negotiated.</li>
                  <li>We provide reporting that includes service mode optimization, exception tracking, and key performance indicators to identify further cost savings and performance improvement opportunities.</li>
                </ul>
              </div>
              <div className="bg-brand-navy/5 p-4 rounded-lg border-l-4 border-brand-blue">
                <p className="text-sm italic">Similar process would apply for exclusive international ocean and air freight optimization and negotiation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-brand-navy text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-brand-gold" />
              <h2 className="text-2xl sm:text-3xl font-display">Referral Partner Program Overview</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-bold text-brand-gold mb-2">Commissions</h4>
                <p className="text-gray-200">Our Referral Partner Program compensates partners for introducing new clients. Partners earn <strong className="text-brand-gold">24% of gross revenue</strong> for referred engagements and <strong className="text-brand-gold">10% of net revenue</strong> for Audit services.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-bold text-brand-gold mb-2">Ongoing Commission Eligibility</h4>
                <p className="text-gray-200">Commissions are paid for the full duration of the client relationship while the account remains active and under billing.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-bold text-brand-gold mb-2">Revenue Structure</h4>
                <p className="text-gray-200">A significant portion of gross revenue is derived from gain-share performance models, aligning our success directly with client savings. We also offer services on a traditional fee basis and occasionally a hybrid gain-share/fee structure, depending on the engagement.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-bold text-brand-gold mb-2">Direct Carrier Negotiations</h4>
                <p className="text-gray-200">For parcel and domestic freight clients under direct carrier agreements, contracts typically have a 24-month term, during which referral commissions are paid monthly.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-bold text-brand-gold mb-2">Reseller-Based Negotiations</h4>
                <p className="text-gray-200">For parcel shippers using our partnered reseller programs, contracts remain active as long as the client utilizes the service, allowing Referral Partners to earn commissions for an extended duration beyond the typical contract term.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-bold text-brand-gold mb-2">Transparency & Tracking</h4>
                <p className="text-gray-200">We have established a referral tracking system for associations and their individual representatives. This system enables each Referral Partner to submit opportunities using a unique rep_id, ensuring full visibility and transparency for all referred opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-8 text-center">Case Studies & ROI Examples</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-t-4 border-t-brand-red">
                <CardContent className="pt-6">
                  <h4 className="font-bold text-brand-navy mb-3">Parts Supplier</h4>
                  <p className="text-xs text-gray-500 mb-3">Parcel Optimization via Reseller-Based Negotiation</p>
                  <div className="space-y-2 text-sm">
                    <p>12-Month FedEx Spend: <strong>$138,000</strong></p>
                    <p>Negotiated Savings: <strong className="text-brand-red">42% ($57,960/year)</strong></p>
                    <p>Gain Share to Client: 39% ($22,604/year)</p>
                    <p className="text-lg font-bold text-brand-red pt-2">Partner: $452/month</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-brand-blue">
                <CardContent className="pt-6">
                  <h4 className="font-bold text-brand-navy mb-3">Textiles Company</h4>
                  <p className="text-xs text-gray-500 mb-3">Parcel Optimization via Reseller-Based Negotiation</p>
                  <div className="space-y-2 text-sm">
                    <p>12-Month UPS Spend: <strong>$150,000</strong></p>
                    <p>Negotiated Savings: <strong className="text-brand-blue">31% ($46,500/year)</strong></p>
                    <p>Gain Share to Client: 35% ($16,275/year)</p>
                    <p className="text-lg font-bold text-brand-blue pt-2">Partner: $325/month</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-brand-gold">
                <CardContent className="pt-6">
                  <h4 className="font-bold text-brand-navy mb-3">Retailer</h4>
                  <p className="text-xs text-gray-500 mb-3">Domestic Freight Optimization via Administered RFP</p>
                  <div className="space-y-2 text-sm">
                    <p>12-Month Freight Spend: <strong>$1,200,000</strong></p>
                    <p>Negotiated Savings: <strong className="text-brand-gold">36% ($432,000/year)</strong></p>
                    <p>Gain Share to Client: 20% ($86,400/year)</p>
                    <p className="text-lg font-bold text-brand-gold pt-2">Partner: $1,728/month</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-brand-red">
                <CardContent className="pt-6">
                  <h4 className="font-bold text-brand-navy mb-3">Electric Component Manufacturer</h4>
                  <p className="text-xs text-gray-500 mb-3">Domestic Freight Optimization via Administered RFP</p>
                  <div className="space-y-2 text-sm">
                    <p>12-Month Freight Spend: <strong>$400,000</strong></p>
                    <p>Negotiated Savings: <strong className="text-brand-red">13% ($52,000/year)</strong></p>
                    <p>Gain Share to Client: 28% ($14,560/year)</p>
                    <p className="text-lg font-bold text-brand-red pt-2">Partner: $291/month</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-brand-blue">
                <CardContent className="pt-6">
                  <h4 className="font-bold text-brand-navy mb-3">Home Furnishings Company</h4>
                  <p className="text-xs text-gray-500 mb-3">Parcel Optimization via Reseller-Based Negotiation</p>
                  <div className="space-y-2 text-sm">
                    <p>12-Month FedEx Spend: <strong>$500,000</strong></p>
                    <p>Negotiated Savings: <strong className="text-brand-blue">19% ($95,000/year)</strong></p>
                    <p>Gain Share to Client: 25% ($23,750/year)</p>
                    <p className="text-lg font-bold text-brand-blue pt-2">Partner: $475/month</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-brand-gold">
                <CardContent className="pt-6">
                  <h4 className="font-bold text-brand-navy mb-3">Apparel Manufacturer</h4>
                  <p className="text-xs text-gray-500 mb-3">Parcel Optimization via Direct Carrier Negotiation</p>
                  <div className="space-y-2 text-sm">
                    <p>12-Month UPS Spend: <strong>$5,000,000</strong></p>
                    <p>Negotiated Savings: <strong className="text-brand-gold">26% ($1,300,000/year)</strong></p>
                    <p>Gain Share to Client: 32% ($416,000/year)</p>
                    <p className="text-lg font-bold text-brand-gold pt-2">Partner: $8,320/month</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-brand-red md:col-span-2 lg:col-span-1">
                <CardContent className="pt-6">
                  <h4 className="font-bold text-brand-navy mb-3">Equipment Manufacturer</h4>
                  <p className="text-xs text-gray-500 mb-3">Domestic Freight Optimization via Administered RFP</p>
                  <div className="space-y-2 text-sm">
                    <p>12-Month Freight Spend: <strong>$20,000,000</strong></p>
                    <p>Negotiated Savings: <strong className="text-brand-red">15% ($3,000,000/year)</strong></p>
                    <p>Fee to Client: $200,000</p>
                    <p className="text-lg font-bold text-brand-red pt-2">Partner: $4,000/month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-brand-navy text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-display mb-4 sm:mb-6">Ready to Start Earning?</h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8">
            Become a Referral Partner and earn 24% monthly commissions for the life of every client relationship.
          </p>
          <Link 
            href="/contact" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-6 sm:px-10 h-12 sm:h-14 cursor-pointer")}
            data-testid="link-get-started"
          >
            Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
