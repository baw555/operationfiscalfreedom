import { useEffect } from "react";

export default function DownloadParcelChecklist() {
  useEffect(() => {
    document.title = "Parcel Audit Checklist - Navigator USA: Veteran Logistics";
  }, []);

  return (
    <div className="bg-white min-h-screen p-8 max-w-4xl mx-auto print:p-4">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
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

      <h2 className="text-2xl font-bold text-brand-navy mb-2">Parcel Audit Checklist</h2>
      <p className="text-gray-600 mb-6">Ensure You're Not Overpaying - Use this checklist to identify hidden fees, missed refunds, and billing discrepancies in your UPS, FedEx, and DHL invoices.</p>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Invoice Basics</h3>
        <p className="text-sm text-gray-500 mb-3">Make sure you have all relevant documents before beginning your audit.</p>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Downloaded weekly/monthly invoices from all carriers (UPS, FedEx, DHL, etc.)</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Detailed tracking data for each shipment</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Your current carrier contracts and rate agreements</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Fuel surcharge tables and DIM weight formulas (from carriers)</span>
          </label>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Late Delivery & Service Failure Review</h3>
        <p className="text-sm text-gray-500 mb-3">Check for shipments that may qualify for refunds based on missed guarantees.</p>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Audit delivery times against service guarantees (Ground, Express, Overnight)</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Flag any shipments delivered late without weather exceptions</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Submit refund claims before carrier deadline (typically 15 days)</span>
          </label>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Duplicate & Billing Error Detection</h3>
        <p className="text-sm text-gray-500 mb-3">These are some of the most common and costly invoice issues.</p>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Identify duplicate tracking numbers across multiple invoices</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Verify billed services match services requested</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Review accessorial charges (e.g., address corrections, residential surcharges)</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Audit fuel surcharges for accuracy and proper application</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Compare DIM weight vs. actual weight charges</span>
          </label>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Contract & Rate Compliance</h3>
        <p className="text-sm text-gray-500 mb-3">Ensure your invoices match your negotiated terms.</p>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Compare billed rates with contracted rates for each service level</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Audit discounts, minimums, and surcharge waivers</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Confirm correct zones, weight breaks, and service levels are applied</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Check for contract violations (e.g., rate increases without notice)</span>
          </label>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Data & Trend Analysis</h3>
        <p className="text-sm text-gray-500 mb-3">Beyond invoice errors, this reveals deeper savings opportunities.</p>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Track refund trends by carrier, service, and surcharge</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Identify which surcharges appear most frequently</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Benchmark your current rates and contract terms against industry norms</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Leverage insights for stronger contract negotiation and long-term savings strategy</span>
          </label>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand-navy mb-3 border-b border-gray-300 pb-2">Long-Term Parcel Cost Management</h3>
        <p className="text-sm text-gray-500 mb-3">Audit results should feed into your cost reduction strategy.</p>
        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Create a savings impact summary report</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Document recurring billing issues by carrier</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Build a dispute/claims log</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Review annually for process improvements</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span>Re-negotiate contracts based on audit insights</span>
          </label>
        </div>
      </section>

      <div className="border-t-2 border-brand-navy pt-6 mt-8">
        <p className="text-sm text-gray-600 mb-4">
          <strong>Need Help?</strong> If this checklist feels overwhelming, Navigator USA: Veteran Logistics experts can handle it for you — no tech integration needed.
        </p>
        <p className="text-sm font-bold text-brand-navy">Request a Free Logistics Assessment at NavigatorUSA.com</p>
      </div>
    </div>
  );
}
