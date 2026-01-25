import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function TaxRecovery() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Tax Recovery</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          Tax recovery focuses on identifying and correcting overpaid taxes,
          missed credits, and filing errors through review by licensed professionals.
        </p>
        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-6 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Begin Intake
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
