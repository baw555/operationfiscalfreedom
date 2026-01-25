import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function RDTaxCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">R&D Tax Credit</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Research & Development Tax Credit rewards businesses that invest in
          innovation, development, and process improvement under IRC §41.
        </p>
        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-6 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            See If You Qualify
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
