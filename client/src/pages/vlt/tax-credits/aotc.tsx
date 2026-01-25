import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function AOTC() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">American Opportunity Tax Credit (AOTC)</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The American Opportunity Tax Credit helps offset higher education costs for the first
          four years of college. It's partially refundable, meaning you can get money back
          even if you owe no tax.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Amount</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Maximum:</strong> $2,500 per eligible student per year</li>
          <li>100% of first $2,000 in qualified expenses</li>
          <li>25% of next $2,000 in qualified expenses</li>
          <li><strong>Refundable:</strong> Up to 40% ($1,000) is refundable</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Eligible Students</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Pursuing degree or recognized credential</li>
          <li>Enrolled at least half-time for one academic period</li>
          <li>In first four years of higher education</li>
          <li>No felony drug conviction</li>
          <li>Haven't claimed AOTC for more than 4 tax years</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Income Limits</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Single:</strong> Full credit MAGI up to $80,000; phaseout to $90,000</li>
          <li><strong>Married Filing Jointly:</strong> Full credit MAGI up to $160,000; phaseout to $180,000</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Qualified Expenses</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Tuition and required enrollment fees</li>
          <li>Books, supplies, and equipment</li>
          <li>Not: room and board, transportation, insurance</li>
        </ul>

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
