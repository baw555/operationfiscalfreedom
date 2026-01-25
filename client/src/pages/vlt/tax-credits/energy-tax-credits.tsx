import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function EnergyTaxCredits() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12">
          Energy & Sustainability Tax Credits
        </h1>

        <p className="mt-4 max-w-3xl">
          Energy-related tax credits encourage investment in energy efficiency,
          renewable energy, and sustainability improvements across residential,
          commercial, and industrial properties.
        </p>

        <h2 className="text-xl font-semibold mt-8">Common Energy Credits</h2>
        <ul className="list-disc ml-6 mt-2 max-w-3xl">
          <li>Solar investment tax credits</li>
          <li>Energy-efficient building deductions</li>
          <li>Clean energy manufacturing credits</li>
          <li>Alternative fuel incentives</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Documentation Requirements</h2>
        <p className="mt-2 max-w-3xl">
          Energy credits often require engineering studies, cost segregation,
          installation records, and certification documentation.
        </p>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Review Energy Credit Eligibility
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
