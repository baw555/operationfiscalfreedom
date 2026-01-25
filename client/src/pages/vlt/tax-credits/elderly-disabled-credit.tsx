import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function ElderlyDisabledCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Credit for the Elderly or Disabled</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          This tax credit is designed to help seniors and people with permanent disabilities
          who have low-to-moderate income. While the credit is small, it can provide meaningful
          tax relief for qualifying individuals.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Amount</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>15% of the initial amount minus nontaxable benefits and excess AGI</li>
          <li>Maximum credit typically ranges from $3,750 to $7,500 base</li>
          <li>Actual credit usually $200-$600 after limitations</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Eligibility Requirements</h2>
        <p className="mt-3 text-gray-700 font-medium">You must be either:</p>
        <ul className="mt-2 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Age 65 or older</strong> by end of tax year, OR</li>
          <li><strong>Permanently and totally disabled</strong> with taxable disability income</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Income Limits</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Single:</strong> AGI less than $17,500</li>
          <li><strong>Married Filing Jointly (one qualifies):</strong> AGI less than $20,000</li>
          <li><strong>Married Filing Jointly (both qualify):</strong> AGI less than $25,000</li>
          <li>Nontaxable Social Security must also be below limits</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">How to Claim</h2>
        <p className="mt-3 text-gray-700">
          Use Schedule R (Form 1040) to calculate and claim this credit. If you're permanently
          disabled, you'll need a physician's statement unless you filed one in a prior year.
        </p>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Check Your Eligibility
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
