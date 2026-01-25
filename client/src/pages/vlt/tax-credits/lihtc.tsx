import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function LIHTC() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Low-Income Housing Tax Credit (LIHTC)</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Low-Income Housing Tax Credit is the most significant federal program for encouraging
          investment in affordable rental housing. It provides dollar-for-dollar tax credits to
          developers and investors in qualified low-income housing projects.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Types</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>9% Credit:</strong> For new construction and substantial rehabilitation without federal subsidies</li>
          <li><strong>4% Credit:</strong> For acquisition of existing buildings and projects with tax-exempt bond financing</li>
          <li>Credits claimed annually over 10 years</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Project Requirements</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>At least 20% of units for households at 50% of area median income, OR</li>
          <li>At least 40% of units for households at 60% of area median income</li>
          <li>Rent restrictions for qualifying units</li>
          <li>15-year compliance period</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">How It Works</h2>
        <p className="mt-3 text-gray-700">
          State housing agencies allocate credits to developers, who then sell them to investors
          to raise equity for their projects. This reduces the debt burden and allows for lower rents.
        </p>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Learn More About LIHTC
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
