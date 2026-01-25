import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function DisabledAccessCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12">
          Disabled Access Tax Credit
        </h1>

        <p className="mt-4 max-w-3xl">
          The Disabled Access Credit helps small businesses offset costs related
          to improving accessibility for individuals with disabilities.
        </p>

        <h2 className="text-xl font-semibold mt-8">Eligible Improvements</h2>
        <ul className="list-disc ml-6 mt-2 max-w-3xl">
          <li>Facility modifications</li>
          <li>Accessible signage</li>
          <li>Adaptive equipment</li>
          <li>Policy and training improvements</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Who May Qualify</h2>
        <p className="mt-2 max-w-3xl">
          Typically applies to small businesses meeting revenue and employee
          thresholds, subject to IRS rules.
        </p>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Check Accessibility Credit
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
