import { useEffect } from "react";

export default function DownloadRatePlaybook() {
  useEffect(() => {
    document.title = "2025 FedEx & UPS Rate Increase Playbook - Navigator USA: Veteran Logistics";
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

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-brand-navy mb-4">2025 FedEx and UPS Rate Increase Playbook</h2>
        <p className="text-xl text-gray-600">Key Insights and Cost-Saving Strategies</p>
      </div>

      <section className="mb-10">
        <h3 className="text-2xl font-bold text-brand-navy mb-4 border-b-2 border-brand-red pb-2">Executive Summary</h3>
        <p className="text-gray-700 mb-4">
          Navigating the 2025 FedEx and UPS rate and surcharge increases requires businesses to rethink their logistics strategies. General Rate Increases (GRIs) of 5.9% conceal hidden complexities, including residential delivery surcharges, accessorial fees, and zone reclassifications. These changes can erode profits, disrupt operations, and challenge competitiveness.
        </p>
        <p className="text-gray-700 mb-4">
          This playbook outlines the wide-reaching implications of these Parcel Carrier increases for businesses across industries and provides proactive strategies to mitigate cost pressures. Navigator USA: Veteran Logistics has identified critical areas for cost control, including shipping audits, packaging optimization, and adjustments to distribution models to address rising expenses.
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-bold text-brand-navy mb-4">Key Takeaways Include:</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-brand-red font-bold">•</span>
            A detailed breakdown of the 2025 rate and surcharge increases by FedEx and UPS
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-red font-bold">•</span>
            Insights into the operational and financial impacts of hidden costs
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-red font-bold">•</span>
            Actionable strategies to reduce expenses, such as leveraging regional carriers, optimizing fulfillment networks, and renegotiating contracts
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-red font-bold">•</span>
            Visual data comparisons to quantify the changes and illustrate opportunities for savings
          </li>
        </ul>
      </section>

      <div className="page-break"></div>

      <section className="mb-10">
        <h3 className="text-2xl font-bold text-brand-navy mb-4 border-b-2 border-brand-red pb-2">Understanding the 2025 Rate Increases</h3>
        <p className="text-gray-700 mb-4">
          In 2025, businesses are navigating an increasingly complex logistics landscape. The latest rate and surcharge increases from FedEx and UPS extend far beyond the 5.9% General Rate Increases (GRIs), including hidden costs such as residential delivery surcharges, accessorial fees, and zone reclassifications.
        </p>
        <div className="bg-brand-gold/10 p-4 rounded-lg border-l-4 border-brand-gold mb-6">
          <p className="font-bold text-brand-navy">Parcel shipping costs have already risen by over 35% since 2020, driven by annual rate increases and surcharges.</p>
        </div>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-bold text-brand-navy mb-4">FedEx 2025 Rate Increases</h3>
        <p className="text-gray-700 mb-4">FedEx's announced rate increases apply to services such as FedEx Express, FedEx Ground, and FedEx Home Delivery, effective January 6, 2025. While the headline GRI is 5.9%, the following factors must be considered:</p>
        <ul className="space-y-2 text-gray-700 mb-6">
          <li className="flex items-start gap-2">
            <span className="text-brand-red font-bold">•</span>
            Ground service shows a cell by cell increase varying between <strong>4.4% to 7.2%</strong> depending on weight and zone
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-red font-bold">•</span>
            Air products shows increases varying from as low as <strong>3% to over 7.5%</strong>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-red font-bold">•</span>
            Additional Handling and Oversize packages increased by <strong>more than 25%</strong> across the board
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-red font-bold">•</span>
            On February 10, 2025, FedEx is increasing Fuel Surcharges for Ground by <strong>1.75%</strong>, and Express by <strong>1.0%</strong>
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-bold text-brand-navy mb-4">UPS 2025 Rate Increases</h3>
        <p className="text-gray-700 mb-4">UPS's rate adjustments took effect December 23, 2024, impacting UPS Ground, UPS Air, and international services. Beyond the average GRI of 5.9%, UPS has introduced:</p>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-brand-red font-bold">•</span>
            <strong>New Surcharges for Large Packages:</strong> The Large Package Surcharge has been restructured with increases targeted at shipments exceeding specified dimensions
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-red font-bold">•</span>
            <strong>Additional Handling Surcharge:</strong> Companies shipping packages qualifying for this surcharge face significant cost increases
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-red font-bold">•</span>
            <strong>SurePost Changes:</strong> UPS announced major changes to their SurePost service affecting final mile delivery
          </li>
        </ul>
      </section>

      <div className="page-break"></div>

      <section className="mb-10">
        <h3 className="text-2xl font-bold text-brand-navy mb-4 border-b-2 border-brand-red pb-2">Practical Strategies for Shippers</h3>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-brand-navy mb-2">1. Conduct a Comprehensive Shipping Audit</h4>
            <p className="text-sm text-gray-700">Review your current shipping data to identify inefficiencies, billing errors, and opportunities for cost savings. Work with logistics experts to analyze your spend patterns.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-brand-navy mb-2">2. Optimize Packaging</h4>
            <p className="text-sm text-gray-700">Reduce dimensional weight charges by using right-sized packaging. Even small reductions in package dimensions can yield significant savings at scale.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-brand-navy mb-2">3. Leverage Regional Carriers</h4>
            <p className="text-sm text-gray-700">Consider regional carriers for specific lanes where they offer competitive rates. Diversifying your carrier mix can reduce reliance on FedEx and UPS.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-brand-navy mb-2">4. Renegotiate Contracts</h4>
            <p className="text-sm text-gray-700">Use the 2025 rate increases as leverage to renegotiate your carrier agreements. Focus on minimums, accessorial caps, and performance guarantees.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-brand-navy mb-2">5. Implement Zone Skipping</h4>
            <p className="text-sm text-gray-700">Consolidate shipments to reduce the number of zones traversed. This strategy can significantly reduce per-package costs for high-volume shippers.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-brand-navy mb-2">6. Review Accessorial Charges</h4>
            <p className="text-sm text-gray-700">Identify and minimize accessorial fees such as residential delivery, address correction, and additional handling charges through process improvements.</p>
          </div>
        </div>
      </section>

      <section className="mb-10 bg-brand-navy text-white p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Take Control of Your Shipping Strategy</h3>
        <p className="mb-4">
          Navigator USA: Veteran Logistics specializes in uncovering hidden costs and delivering actionable solutions to help businesses thrive in the face of rising expenses. With over 50 years of experience and more than $9 billion in freight spend analyzed, we know where the waste hides and how to stop it.
        </p>
        <p className="font-bold text-brand-gold">
          Request your free logistics assessment at NavigatorUSA.com
        </p>
      </section>
    </div>
  );
}
