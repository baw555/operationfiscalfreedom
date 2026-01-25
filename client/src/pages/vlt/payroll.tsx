import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function Payroll() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12">Payroll Services</h1>

        <p className="mt-4 max-w-3xl">
          Payroll compliance involves wage reporting, withholding, and employment
          tax filings. Errors can result in penalties and enforcement actions.
        </p>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Payroll Intake
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
