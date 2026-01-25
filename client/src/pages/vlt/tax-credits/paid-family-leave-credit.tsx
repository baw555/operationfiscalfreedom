import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function PaidFamilyLeaveCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12">
          Paid Family & Medical Leave Tax Credit
        </h1>

        <p className="mt-4 max-w-3xl">
          The Paid Family and Medical Leave Credit provides incentives to employers
          who voluntarily offer qualifying paid leave benefits to employees.
        </p>

        <h2 className="text-xl font-semibold mt-8">Eligibility Factors</h2>
        <ul className="list-disc ml-6 mt-2 max-w-3xl">
          <li>Written leave policy</li>
          <li>Minimum leave duration requirements</li>
          <li>Wage replacement thresholds</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Why Review Matters</h2>
        <p className="mt-2 max-w-3xl">
          Many employers offer leave benefits without realizing a credit may apply.
          Proper review determines eligibility and compliance.
        </p>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Evaluate Paid Leave Credit
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
