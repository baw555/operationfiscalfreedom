import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function PremiumTaxCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Premium Tax Credit (Healthcare)</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Premium Tax Credit helps eligible individuals and families afford health insurance
          purchased through the Health Insurance Marketplace. It can be taken in advance to
          lower monthly premiums or claimed when filing your tax return.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">How It Works</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Advance payments:</strong> Paid directly to your insurance company monthly</li>
          <li><strong>Refundable credit:</strong> Claim when filing if you paid full premiums</li>
          <li>Based on estimated income and household size</li>
          <li>Reconciled on Form 8962 when you file taxes</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Eligibility Requirements</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Purchase coverage through the Marketplace</li>
          <li>Household income between 100% and 400% of federal poverty level</li>
          <li>Not eligible for coverage through employer or government programs</li>
          <li>Cannot be claimed as a dependent on another person's return</li>
          <li>If married, must file jointly</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Income Guidelines (2025)</h2>
        <p className="mt-3 text-gray-700">
          For a family of 4, household income must generally be between approximately
          $31,200 (100% FPL) and $124,800 (400% FPL) to qualify for the credit.
        </p>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Important Considerations</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Report income changes to the Marketplace during the year</li>
          <li>Repayment may be required if advance payments exceeded actual credit</li>
          <li>Credit amount varies based on benchmark plan in your area</li>
        </ul>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Get Help With Healthcare Credits
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
