import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function EITC() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy" data-testid="heading-eitc">Earned Income Tax Credit (EITC)</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Earned Income Tax Credit is a refundable tax credit for low-to-moderate income
          workers and families. It can significantly reduce your tax burden or provide a refund
          even if you don't owe any taxes.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Maximum Credit Amounts (2025)</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>No children:</strong> Up to $649</li>
          <li><strong>1 child:</strong> Up to $4,328</li>
          <li><strong>2 children:</strong> Up to $7,152</li>
          <li><strong>3+ children:</strong> Up to $8,046</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Income Limits (2025)</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Single/Head of Household with 3+ children: AGI under $59,899</li>
          <li>Married Filing Jointly with 3+ children: AGI under $68,675</li>
          <li>Investment income must be $11,950 or less</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Basic Requirements</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Must have earned income from employment or self-employment</li>
          <li>Valid Social Security number for you, spouse, and qualifying children</li>
          <li>Must file a tax return (even if not required)</li>
          <li>Cannot file as Married Filing Separately</li>
          <li>Must be a U.S. citizen or resident alien all year</li>
        </ul>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer" data-testid="button-check-eligibility">
            Check Your Eligibility
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
