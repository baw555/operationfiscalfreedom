import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function LifetimeLearningCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Lifetime Learning Credit</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Lifetime Learning Credit helps pay for undergraduate, graduate, and professional
          degree courses, as well as courses to acquire or improve job skills. Unlike AOTC,
          there's no limit on the number of years you can claim it.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Amount</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Maximum:</strong> $2,000 per tax return (not per student)</li>
          <li>20% of first $10,000 in qualified education expenses</li>
          <li>Nonrefundable credit</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Key Benefits</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>No limit on years you can claim the credit</li>
          <li>Available for graduate school and professional degrees</li>
          <li>Courses to improve job skills qualify</li>
          <li>No minimum enrollment requirement</li>
          <li>No degree program requirement</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Income Limits</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Single:</strong> Full credit MAGI up to $80,000; phaseout to $90,000</li>
          <li><strong>Married Filing Jointly:</strong> Full credit MAGI up to $160,000; phaseout to $180,000</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">AOTC vs. Lifetime Learning</h2>
        <p className="mt-3 text-gray-700">
          You cannot claim both credits for the same student in the same year. AOTC is generally
          better for undergraduates (higher credit, partially refundable), while Lifetime Learning
          is better for graduate students and those taking occasional courses.
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
