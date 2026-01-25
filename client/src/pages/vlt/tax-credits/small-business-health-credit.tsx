import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function SmallBusinessHealthCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Small Business Health Care Tax Credit</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Small Business Health Care Tax Credit (Form 8941) helps small businesses and tax-exempt
          organizations afford the cost of providing health insurance coverage to their employees.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Amount</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Up to 50% of premiums paid (35% for tax-exempt organizations)</li>
          <li>Available for 2 consecutive tax years</li>
          <li>Employer must pay at least 50% of employee-only premiums</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Eligibility Requirements</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Fewer than 25 full-time equivalent (FTE) employees</li>
          <li>Average annual wages less than $66,600 (2026)</li>
          <li>Coverage purchased through SHOP Marketplace</li>
          <li>Must pay at least 50% of employee premium costs</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Maximum Credit Eligibility</h2>
        <p className="mt-3 text-gray-700">
          Maximum credit available for employers with 10 or fewer FTEs and average wages of
          $31,900 or less. Credit phases out as these numbers increase.
        </p>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            See If You Qualify
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
