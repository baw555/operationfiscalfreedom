import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function ChildTaxCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy" data-testid="heading-child-tax-credit">Child Tax Credit</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Child Tax Credit helps families with qualifying children reduce their federal income
          tax liability. Recent legislation has enhanced this credit significantly.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Amount (2025-2026)</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Per child:</strong> $2,200 (increased from $2,000)</li>
          <li><strong>Refundable portion:</strong> Up to $1,700 (Additional Child Tax Credit)</li>
          <li><strong>Credit for Other Dependents:</strong> $500 per qualifying dependent</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Qualifying Child Requirements</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Under age 17 at the end of the tax year</li>
          <li>U.S. citizen, national, or resident alien</li>
          <li>Valid Social Security number</li>
          <li>Related to you (child, stepchild, foster child, sibling, etc.)</li>
          <li>Lived with you for more than half the year</li>
          <li>Didn't provide more than half of their own support</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Income Phaseout</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Married Filing Jointly:</strong> Begins at $400,000 MAGI</li>
          <li><strong>All other filers:</strong> Begins at $200,000 MAGI</li>
          <li>Credit reduced by $50 for each $1,000 over the threshold</li>
        </ul>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer" data-testid="button-calculate-credit">
            Calculate Your Credit
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
