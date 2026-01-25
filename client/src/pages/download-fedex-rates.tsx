import { useEffect } from "react";

export default function DownloadFedExRates() {
  useEffect(() => {
    document.title = "FedEx Fee & Surcharge Rates Comparison - Navigator USA: Veteran Logistics";
  }, []);

  const rates2026vs2025 = [
    { accessorial: "Add'l Handling - Packaging - Zone 2", rate2026: "$26.50", rate2025: "$25.00", increase: "6.0%" },
    { accessorial: "Add'l Handling - Packaging - Zone 3-4", rate2026: "$30.75", rate2025: "$29.00", increase: "6.0%" },
    { accessorial: "Add'l Handling - Packaging - Zone 5-6", rate2026: "$33.00", rate2025: "$30.50", increase: "8.2%" },
    { accessorial: "Add'l Handling - Packaging - Zone 7+", rate2026: "$33.75", rate2025: "$31.50", increase: "7.1%" },
    { accessorial: "Add'l Handling - Dimensions - Zone 2", rate2026: "$29.50", rate2025: "$28.00", increase: "5.4%" },
    { accessorial: "Add'l Handling - Dimensions - Zone 3-4", rate2026: "$32.75", rate2025: "$31.00", increase: "5.6%" },
    { accessorial: "Add'l Handling - Dimensions - Zone 5-6", rate2026: "$38.50", rate2025: "$34.00", increase: "13.2%" },
    { accessorial: "Add'l Handling - Weight - Zone 2", rate2026: "$26.50", rate2025: "$25.00", increase: "6.0%" },
    { accessorial: "Add'l Handling - Weight - Zone 3-4", rate2026: "$30.75", rate2025: "$29.00", increase: "6.0%" },
    { accessorial: "Oversize Charge - Zone 2", rate2026: "$115.00", rate2025: "$110.00", increase: "4.5%" },
    { accessorial: "Oversize Charge - Zone 3-4", rate2026: "$125.00", rate2025: "$120.00", increase: "4.2%" },
    { accessorial: "Residential Delivery - Ground", rate2026: "$5.65", rate2025: "$5.35", increase: "5.6%" },
    { accessorial: "Residential Delivery - Express", rate2026: "$5.95", rate2025: "$5.60", increase: "6.3%" },
    { accessorial: "Delivery Area Surcharge - Residential", rate2026: "$4.75", rate2025: "$4.50", increase: "5.6%" },
    { accessorial: "Delivery Area Surcharge - Extended", rate2026: "$5.50", rate2025: "$5.25", increase: "4.8%" },
    { accessorial: "Address Correction - Ground", rate2026: "$21.00", rate2025: "$20.00", increase: "5.0%" },
  ];

  return (
    <div className="bg-white min-h-screen p-8 max-w-5xl mx-auto print:p-4">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          table { font-size: 10px; }
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

      <h2 className="text-2xl font-bold text-brand-navy mb-2">FedEx Fee & Surcharge Rate Increase Comparison</h2>
      <p className="text-gray-600 mb-6">2026 vs. 2025 Rates</p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-navy text-white">
              <th className="border border-gray-300 px-3 py-2 text-left">Accessorial</th>
              <th className="border border-gray-300 px-3 py-2 text-right">2026 Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-right">2025 Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-right">% Increase</th>
            </tr>
          </thead>
          <tbody>
            {rates2026vs2025.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="border border-gray-300 px-3 py-2">{row.accessorial}</td>
                <td className="border border-gray-300 px-3 py-2 text-right font-mono">{row.rate2026}</td>
                <td className="border border-gray-300 px-3 py-2 text-right font-mono">{row.rate2025}</td>
                <td className="border border-gray-300 px-3 py-2 text-right font-bold text-brand-red">{row.increase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-brand-gold/10 p-4 rounded-lg border-l-4 border-brand-gold">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> This comparison chart represents key accessorial and surcharge changes. Actual rates may vary based on your specific contract terms. Contact Navigator USA: Veteran Logistics for a personalized rate analysis.
        </p>
      </div>

      <div className="border-t-2 border-brand-navy pt-6 mt-8">
        <p className="text-sm font-bold text-brand-navy">Request Your Free Rate Analysis at NavigatorUSA.com</p>
      </div>
    </div>
  );
}
