import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function AdoptionCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Adoption Tax Credit</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Adoption Tax Credit helps offset the significant costs of adopting a child.
          This nonrefundable credit can be carried forward for up to 5 years if you can't
          use it all in one year.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Amount (2025)</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Maximum credit:</strong> $17,280 per child</li>
          <li>Indexed for inflation annually</li>
          <li>Special needs adoption: Full credit regardless of expenses</li>
          <li>Unused credit can carry forward for 5 years</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Qualified Expenses</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Adoption fees</li>
          <li>Court costs and attorney fees</li>
          <li>Travel expenses (including meals and lodging)</li>
          <li>Re-adoption expenses for foreign adoptions</li>
          <li>Other expenses directly related to adoption</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Income Phaseout (2025)</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Phaseout begins:</strong> MAGI of $259,190</li>
          <li><strong>Phaseout complete:</strong> MAGI of $299,190</li>
          <li>Credit completely unavailable above phaseout range</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Special Needs Adoption</h2>
        <p className="mt-3 text-gray-700">
          For children with special needs, you can claim the full credit amount even if your
          actual expenses are less. The child must be a U.S. citizen or resident and the
          state must determine the child has special needs.
        </p>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Calculate Your Credit
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
