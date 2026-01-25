import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function DependentCareCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Child and Dependent Care Credit</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Child and Dependent Care Credit helps working parents offset the cost of childcare
          or care for a disabled dependent that allows them to work or look for work.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Amount</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Expense limits:</strong> $3,000 for one qualifying person; $6,000 for two or more</li>
          <li><strong>Credit percentage:</strong> 20% to 35% of expenses, based on AGI</li>
          <li><strong>Maximum credit:</strong> $1,050 (one dependent) or $2,100 (two or more)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Percentage by Income</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>AGI up to $15,000:</strong> 35% credit rate</li>
          <li><strong>AGI $15,001 - $43,000:</strong> Decreases by 1% per $2,000</li>
          <li><strong>AGI over $43,000:</strong> 20% credit rate (minimum)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Qualifying Persons</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Child under age 13 whom you claim as a dependent</li>
          <li>Spouse who is physically or mentally unable to care for themselves</li>
          <li>Any dependent who is physically or mentally incapable of self-care</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Work Requirement</h2>
        <p className="mt-3 text-gray-700">
          You must have earned income, and if married, both spouses must work (or one must be
          a full-time student or disabled). Expenses cannot exceed your earned income
          (or spouse's, if lower).
        </p>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Calculate Your Credit
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
