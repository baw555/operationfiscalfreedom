import { useEffect } from "react";

export default function DownloadFreightChecklist() {
  useEffect(() => {
    document.title = "Freight Invoice Audit Checklist - Navigator USA: Veteran Logistics";
  }, []);

  return (
    <div className="bg-white min-h-screen p-8 max-w-4xl mx-auto print:p-4">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
        }
      `}</style>
      
      <div className="no-print mb-6 flex gap-4">
        <button 
          onClick={() => window.print()} 
          className="bg-brand-red text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-red/90"
        >
          Download / Print PDF
        </button>
        <button 
          onClick={() => window.history.back()} 
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>

      <div className="border-b-4 border-brand-red pb-4 mb-8">
        <h1 className="text-3xl font-bold text-brand-navy">Navigator USA: Veteran Logistics</h1>
        <p className="text-brand-red font-semibold italic">Logistics: What the military does best.</p>
      </div>

      <h2 className="text-2xl font-bold text-brand-navy mb-2">Freight Invoice Audit Checklist</h2>
      <p className="text-gray-600 mb-6">The most common billing mistakes aren't obvious — until you know what to look for. Use this checklist to identify hidden charges, detect billing errors, and manage your freight spend effectively.</p>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Invoice Accuracy</h3>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Confirm that weights, dimensions, and freight classes are billed correctly</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Match source documents to the freight invoice</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Determine charge responsibility: Are these costs your responsibility, or should the shipper, consignee, or third-party be paying?</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Catch duplicate charges by matching carrier invoice numbers and your internal shipment IDs</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Validate accessorials (e.g., liftgate, detention, reconsignment) to ensure services were rendered</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Match invoice totals to the expected shipment costs per your carrier contract or pricing agreement</span>
          </label>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Contract Compliance</h3>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Cross-check rates against your negotiated carrier agreements</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Review minimums, surcharges, and discounts for compliance</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Confirm that incentives and volume-based pricing are applied correctly</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Flag discrepancies and review them with carrier reps during QBRs</span>
          </label>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Classification & Service Validation</h3>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Confirm NMFC freight classifications are accurate</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>New product? New lane? Double-check that your classification updates are reflected correctly</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Review billed service levels (e.g., expedited vs. standard)</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Flag missed guaranteed deliveries</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>File for refunds per your carrier contracts' claim timeframes</span>
          </label>
        </div>
        <p className="text-sm text-brand-gold mt-3 italic">Filing deadlines vary by carrier and mode — make sure your team knows the window.</p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Fuel & Accessorial Fees</h3>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Compare fuel surcharges to published or contracted fuel indices</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Audit accessorials for frequency, reason codes, and accuracy</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Identify repeat offenders like detention, reweigh, or redelivery charges</span>
          </label>
        </div>
        <p className="text-sm text-brand-blue mt-3 italic">Many fuel surcharges change weekly. Is your team monitoring updates regularly?</p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Mode & Routing Efficiency</h3>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Confirm correct mode (LTL, TL) was used for each shipment</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Flag avoidable premium or expedited services</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Recommend cost-saving alternatives for future routing</span>
          </label>
        </div>
        <p className="text-sm text-brand-red mt-3 italic">Proactively prevent excess costs — don't just react to them.</p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Dispute Resolution</h3>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Track billing discrepancies and submit claims within required timeframes</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Maintain a log of disputed charges, resolution status, and recovery amounts</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Monitor problematic carriers and evaluate whether they should remain in your routing guide</span>
          </label>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Reporting & Spend Visibility</h3>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Review savings summaries and exception reports regularly</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Share audit reports with finance — savings data supports cash flow goals</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Benchmark carrier performance across lanes, regions, service types, and invoicing accuracy</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Use audit insights to strengthen negotiation strategy or justify vendor changes</span>
          </label>
        </div>
      </section>

      <div className="page-break"></div>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Top Cost Drivers to Watch in 2025-2026</h3>
        <p className="text-sm text-gray-600 mb-4">It's not just the Base Rate. It's the line-haul charge, discounts, accessorial, and ever-increasing surcharge fees that are impacting your company's bottom line.</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>• Dimensional Weight Charges</div>
          <div>• Appointment Required</div>
          <div>• Lift Gate Services</div>
          <div>• Single Shipment Fee</div>
          <div>• Residential Delivery/Pick-up</div>
          <div>• Density Minimum Charge</div>
          <div>• Limited Area Pickup</div>
          <div>• Declared Value Coverage</div>
          <div>• Congested/Limited Access Delivery</div>
          <div>• Signature Required Fees</div>
          <div>• Re-Weigh and Weight Verification</div>
          <div>• Date Certain Delivery</div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Lightweight Freight & Oversized Shipments</h3>
        <p className="text-sm text-gray-500 mb-3">Shipping costs are quietly crushing margins, especially for large, lightweight, and oversized freight.</p>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Flag shipments hit with dimensional weight pricing</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Evaluate packaging and mode to avoid oversized thresholds</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Identify a more appropriate mode to be used for these shipments in the future</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Track cumulative surcharges over time — even small fees kill margins</span>
          </label>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Cold Storage & Temperature-Controlled Freight</h3>
        <p className="text-sm text-gray-500 mb-3">Cold chain shipping has zero room for error, especially when it pertains to overall cost.</p>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Ensure refrigeration/accessorials are clearly spelled out in your contract</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Confirm service levels match perishability or shelf life requirements</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Track spoilage claims, delivery delays, and temperature deviations</span>
          </label>
        </div>
      </section>

      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <h4 className="font-bold text-brand-navy mb-2">Tips for Smarter Audits</h4>
        <ul className="text-sm space-y-2">
          <li><strong>Know your claim windows:</strong> Each carrier and mode has different deadlines. Don't leave money on the table.</li>
          <li><strong>Use this checklist as a working tool</strong> — and a review agenda with your carrier reps during quarterly business reviews.</li>
          <li><strong>The details matter:</strong> Freight audits aren't just about refunds — they're about fixing broken processes and protecting your margins long-term.</li>
        </ul>
      </div>

      <div className="border-t-2 border-brand-navy pt-6 mt-8">
        <p className="text-sm text-gray-600 mb-4">
          <strong>Feeling overwhelmed?</strong> You're not alone! Freight Audits are complex and require specialized analysis. At Navigator USA: Veteran Logistics, we don't just recover savings, we deliver clarity. With 50 years of experience and over $9B in freight spend analyzed, we know where the waste hides and how to stop it.
        </p>
        <p className="text-sm font-bold text-brand-navy">Request Your Risk-Free Assessment at NavigatorUSA.com</p>
      </div>
    </div>
  );
}
