import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function NewMarketsCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">New Markets Tax Credit</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The New Markets Tax Credit (NMTC) program incentivizes investment in low-income
          communities by providing a tax credit to investors who make qualified equity investments.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Amount</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>39% of the investment claimed over 7 years</li>
          <li>5% annually for the first 3 years</li>
          <li>6% annually for the remaining 4 years</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Eligible Investments</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Investment in Community Development Entities (CDEs)</li>
          <li>Funds used for qualified low-income community investments</li>
          <li>Business loans and investments in low-income census tracts</li>
          <li>Real estate projects in underserved areas</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Recent Changes</h2>
        <p className="mt-3 text-gray-700">
          The One Big Beautiful Bill made the NMTC permanent in 2025, providing long-term
          certainty for investors in low-income community development projects.
        </p>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Learn More About Qualifying
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
