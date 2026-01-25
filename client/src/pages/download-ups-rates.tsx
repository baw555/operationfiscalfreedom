import { useEffect } from "react";

export default function DownloadUPSRates() {
  useEffect(() => {
    document.title = "UPS Fee & Surcharge Rates Comparison - Navigator USA: Veteran Logistics";
  }, []);

  const rates2025vs2020 = [
    { accessorial: "Additional Handling - Packaging", rate2025: "$25.00", rate2020: "$12.50", increase: "100.0%" },
    { accessorial: "Additional Handling - Weight (50+ lbs)", rate2025: "$25.00", rate2020: "$12.50", increase: "100.0%" },
    { accessorial: "Additional Handling - Dimensions", rate2025: "$28.00", rate2020: "$14.00", increase: "100.0%" },
    { accessorial: "Large Package Surcharge", rate2025: "$110.00", rate2020: "$90.00", increase: "22.2%" },
    { accessorial: "Over Maximum Limits", rate2025: "$875.00", rate2020: "$550.00", increase: "59.1%" },
    { accessorial: "Residential Delivery - Ground", rate2025: "$5.35", rate2020: "$4.15", increase: "28.9%" },
    { accessorial: "Residential Delivery - Air", rate2025: "$5.60", rate2020: "$4.35", increase: "28.7%" },
    { accessorial: "Delivery Area Surcharge - Residential", rate2025: "$4.50", rate2020: "$3.00", increase: "50.0%" },
    { accessorial: "Delivery Area Surcharge - Extended Residential", rate2025: "$5.25", rate2020: "$3.50", increase: "50.0%" },
    { accessorial: "Delivery Area Surcharge - Commercial", rate2025: "$4.00", rate2020: "$2.75", increase: "45.5%" },
    { accessorial: "Address Correction - Residential", rate2025: "$20.00", rate2020: "$16.00", increase: "25.0%" },
    { accessorial: "Address Correction - Commercial", rate2025: "$18.00", rate2020: "$14.00", increase: "28.6%" },
    { accessorial: "Signature Required", rate2025: "$6.50", rate2020: "$5.25", increase: "23.8%" },
    { accessorial: "Adult Signature Required", rate2025: "$7.50", rate2020: "$6.00", increase: "25.0%" },
    { accessorial: "Declared Value (per $100)", rate2025: "$3.45", rate2020: "$2.70", increase: "27.8%" },
    { accessorial: "Fuel Surcharge - Ground (avg)", rate2025: "8.75%", rate2020: "6.25%", increase: "+2.5%" },
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

      <h2 className="text-2xl font-bold text-brand-navy mb-2">UPS Fee & Surcharge Rate Increase Comparison</h2>
      <p className="text-gray-600 mb-6">2025 vs. 2020 Rates - Five Year Impact Analysis</p>

      <div className="bg-brand-red/10 p-4 rounded-lg border-l-4 border-brand-red mb-6">
        <p className="font-bold text-brand-navy">Key Insight: UPS accessorial charges have increased by an average of 40-100% over the past five years, significantly exceeding the headline GRI rates.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-navy text-white">
              <th className="border border-gray-300 px-3 py-2 text-left">Accessorial</th>
              <th className="border border-gray-300 px-3 py-2 text-right">2025 Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-right">2020 Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-right">% Increase</th>
            </tr>
          </thead>
          <tbody>
            {rates2025vs2020.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="border border-gray-300 px-3 py-2">{row.accessorial}</td>
                <td className="border border-gray-300 px-3 py-2 text-right font-mono">{row.rate2025}</td>
                <td className="border border-gray-300 px-3 py-2 text-right font-mono">{row.rate2020}</td>
                <td className="border border-gray-300 px-3 py-2 text-right font-bold text-brand-red">{row.increase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-bold text-brand-navy mb-2">Biggest Impact Areas:</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Additional Handling charges: +100%</li>
            <li>• Over Maximum Limits: +59%</li>
            <li>• Delivery Area Surcharges: +45-50%</li>
            <li>• Residential Delivery: +29%</li>
          </ul>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-bold text-brand-navy mb-2">Cost Mitigation Strategies:</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Optimize package dimensions</li>
            <li>• Reduce address corrections</li>
            <li>• Consider regional carriers</li>
            <li>• Renegotiate contract terms</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-brand-gold/10 p-4 rounded-lg border-l-4 border-brand-gold">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> This comparison chart represents key accessorial and surcharge changes over a 5-year period. Actual rates may vary based on your specific contract terms. Contact Navigator USA: Veteran Logistics for a personalized rate analysis.
        </p>
      </div>

      <div className="border-t-2 border-brand-navy pt-6 mt-8">
        <p className="text-sm font-bold text-brand-navy">Request Your Free Rate Analysis at NavigatorUSA.com</p>
      </div>
    </div>
  );
}
