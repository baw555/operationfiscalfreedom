import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Truck, Package, CheckSquare, AlertTriangle, FileText, ArrowRight, Phone } from "lucide-react";

export default function BestPractices() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-blue/20 border border-brand-blue/40 text-brand-blue mb-4 sm:mb-6">
            <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">Best Practices</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6" data-testid="text-page-title">Freight & Parcel Best Practices</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-2" data-testid="text-page-description">
            Checklists and strategies to identify hidden fees, missed refunds, and billing discrepancies in your shipping invoices.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl sm:text-3xl font-display text-brand-navy">Parcel Audit Checklist</h2>
            </div>
            <p className="text-gray-600 mb-8">Use this checklist to identify hidden fees, missed refunds, and billing discrepancies in your UPS, FedEx, and DHL invoices.</p>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-brand-navy text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-red" />
                  Invoice Basics
                </h3>
                <p className="text-sm text-gray-500 mb-4">Make sure you have all relevant documents before beginning your audit.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Downloaded weekly/monthly invoices from all carriers (UPS, FedEx, DHL, etc.)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Detailed tracking data for each shipment</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Your current carrier contracts and rate agreements</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Fuel surcharge tables and DIM weight formulas (from carriers)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-brand-navy text-lg mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-brand-gold" />
                  Late Delivery & Service Failure Review
                </h3>
                <p className="text-sm text-gray-500 mb-4">Check for shipments that may qualify for refunds based on missed guarantees.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Audit delivery times against service guarantees (Ground, Express, Overnight)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Flag any shipments delivered late without weather exceptions</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Submit refund claims before carrier deadline (typically 15 days)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-brand-navy text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-blue" />
                  Duplicate & Billing Error Detection
                </h3>
                <p className="text-sm text-gray-500 mb-4">These are some of the most common and costly invoice issues.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Identify duplicate tracking numbers across multiple invoices</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Verify billed services match services requested</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Review accessorial charges (e.g., address corrections, residential surcharges)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Audit fuel surcharges for accuracy and proper application</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Compare DIM weight vs. actual weight charges</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-brand-navy text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-red" />
                  Contract & Rate Compliance
                </h3>
                <p className="text-sm text-gray-500 mb-4">Ensure your invoices match your negotiated terms.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Compare billed rates with contracted rates for each service level</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Audit discounts, minimums, and surcharge waivers</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Confirm correct zones, weight breaks, and service levels are applied</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Check for contract violations (e.g., rate increases without notice)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-brand-navy text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-gold" />
                  Data & Trend Analysis
                </h3>
                <p className="text-sm text-gray-500 mb-4">Beyond invoice errors, this reveals deeper savings opportunities.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Track refund trends by carrier, service, and surcharge</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Identify which surcharges appear most frequently</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Benchmark your current rates and contract terms against industry norms</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Leverage insights for stronger contract negotiation and long-term savings strategy</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-brand-navy text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-blue" />
                  Long-Term Parcel Cost Management
                </h3>
                <p className="text-sm text-gray-500 mb-4">Audit results should feed into your cost reduction strategy.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Create a savings impact summary report</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Document recurring billing issues by carrier</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Build a dispute/claims log</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Review annually for process improvements</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>Re-negotiate contracts based on audit insights</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="w-8 h-8 text-brand-blue" />
              <h2 className="text-2xl sm:text-3xl font-display text-brand-navy">Freight Invoice Audit Checklist</h2>
            </div>
            <p className="text-gray-600 mb-8">The most common billing mistakes aren't obvious — until you know what to look for. Use this checklist to identify hidden charges, detect billing errors, and manage your freight spend effectively.</p>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-brand-navy text-lg mb-4">Invoice Accuracy</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Confirm that weights, dimensions, and freight classes are billed correctly</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Match source documents to the freight invoice</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Determine charge responsibility: Are these costs your responsibility, or should the shipper, consignee, or third-party be paying?</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Catch duplicate charges by matching carrier invoice numbers and your internal shipment IDs</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Validate accessorials (e.g., liftgate, detention, reconsignment) to ensure services were rendered</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Match invoice totals to the expected shipment costs per your carrier contract or pricing agreement</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-brand-navy text-lg mb-4">Contract Compliance</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Cross-check rates against your negotiated carrier agreements</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Review minimums, surcharges, and discounts for compliance</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Confirm that incentives and volume-based pricing are applied correctly</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Flag discrepancies and review them with carrier reps during QBRs</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-brand-navy text-lg mb-4">Classification & Service Validation</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Confirm NMFC freight classifications are accurate</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>New product? New lane? Double-check that your classification updates are reflected correctly</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Review billed service levels (e.g., expedited vs. standard)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Flag missed guaranteed deliveries</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>File for refunds per your carrier contracts' claim timeframes</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-brand-gold/10 rounded-lg border-l-4 border-brand-gold">
                  <p className="text-sm text-gray-700 italic">Filing deadlines vary by carrier and mode — make sure your team knows the window.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-brand-navy text-lg mb-4">Fuel & Accessorial Fees</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Compare fuel surcharges to published or contracted fuel indices</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Audit accessorials for frequency, reason codes, and accuracy</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Identify repeat offenders like detention, reweigh, or redelivery charges</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-brand-blue/10 rounded-lg border-l-4 border-brand-blue">
                  <p className="text-sm text-gray-700 italic">Many fuel surcharges change weekly. Is your team monitoring updates regularly?</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-brand-navy text-lg mb-4">Mode & Routing Efficiency</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Confirm correct mode (LTL, TL) was used for each shipment</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Flag avoidable premium or expedited services</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Recommend cost-saving alternatives for future routing</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-brand-red/10 rounded-lg border-l-4 border-brand-red">
                  <p className="text-sm text-gray-700 italic">Proactively prevent excess costs — don't just react to them.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-brand-navy text-lg mb-4">Dispute Resolution</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Track billing discrepancies and submit claims within required timeframes</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Maintain a log of disputed charges, resolution status, and recovery amounts</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Monitor problematic carriers and evaluate whether they should remain in your routing guide</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-brand-navy text-lg mb-4">Reporting & Spend Visibility</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Review savings summaries and exception reports regularly</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Share audit reports with finance — savings data supports cash flow goals</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Benchmark carrier performance across lanes, regions, service types, and invoicing accuracy</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Use audit insights to strengthen negotiation strategy or justify vendor changes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6 text-center">Top Cost Drivers to Watch in 2025-2026</h2>
            <p className="text-gray-600 text-center mb-8">It's not just the Base Rate. It's the line-haul charge, discounts, accessorial, and ever-increasing surcharge fees that are impacting your company's bottom line.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "Dimensional Weight Charges",
                "Appointment Required",
                "Lift Gate Services",
                "Single Shipment Fee",
                "Residential Delivery/Pick-up",
                "Density Minimum Charge",
                "Limited Area Pickup",
                "Declared Value Coverage",
                "Congested/Limited Access Delivery",
                "Signature Required Fees",
                "Re-Weigh and Weight Verification",
                "Date Certain Delivery"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm">
                  <AlertTriangle className="w-4 h-4 text-brand-gold shrink-0" />
                  <span className="text-brand-navy font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6">Lightweight Freight & Oversized Shipments</h2>
            <p className="text-gray-600 mb-6">Shipping costs are quietly crushing margins, especially for large, lightweight, and oversized freight.</p>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <ul className="space-y-2">
                <li className="flex items-start gap-3 text-sm">
                  <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                  <span>Flag shipments hit with dimensional weight pricing</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                  <span>Evaluate packaging and mode to avoid oversized thresholds</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                  <span>Identify a more appropriate mode to be used for these shipments in the future</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                  <span>Analyze package sizes to identify rate increase triggers, such as density-based classifications</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                  <span>Review charges for Date Certain Delivery, Declared Value, and Signature Requirements</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                  <span>Track cumulative surcharges over time — even small fees kill margins</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckSquare className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                  <span>Benchmark base rates against your pricing agreements</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6">Cold Storage & Temperature-Controlled Freight</h2>
            <p className="text-gray-600 mb-6">Cold chain shipping has zero room for error, especially when it pertains to overall cost.</p>
            
            <div className="bg-brand-blue/5 p-6 rounded-xl border-l-4 border-brand-blue">
              <ul className="space-y-2">
                <li className="flex items-start gap-3 text-sm">
                  <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <span>Ensure refrigeration/accessorials are clearly spelled out in your contract</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <span>Confirm service levels match perishability or shelf life requirements</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <span>Audit for temperature-related surcharges and compliance</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <span>Track spoilage claims, delivery delays, and temperature deviations</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <span>Verify that cold chain carriers meet SLAs for transit, trailer type, and handling time</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <span>Benchmark rates against food, pharma, and grocery peers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-brand-navy text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display mb-6 text-center">Tips for Smarter Audits</h2>
            
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-lg">
                <p><strong className="text-brand-gold">Know your claim windows:</strong> Each carrier and mode has different deadlines. Don't leave money on the table.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <p><strong className="text-brand-gold">Use this checklist as a working tool</strong> — and a review agenda with your carrier reps during quarterly business reviews.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <p><strong className="text-brand-gold">The details matter:</strong> Freight audits aren't just about refunds — they're about fixing broken processes and protecting your margins long-term.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-brand-red text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-display mb-4 sm:mb-6">Feeling Overwhelmed?</h2>
          <p className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto mb-6 sm:mb-8">
            You're not alone! Freight Audits are complex and require specialized analysis. At Navigator USA: Veteran Logistics, we don't just recover savings, we deliver clarity. With 50 years of experience and over $9B in freight spend analyzed, we know where the waste hides and how to stop it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className={cn(buttonVariants({ size: "lg" }), "bg-white text-brand-red hover:bg-white/90 font-bold px-6 sm:px-10 h-12 sm:h-14 cursor-pointer")}
              data-testid="link-assessment"
            >
              Request Your Risk-Free Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
