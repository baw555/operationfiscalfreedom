import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function PensionStartupCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Small Employer Pension Start-Up Credit</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Small Employer Pension Plan Start-Up Credit (Form 8881) helps small businesses offset
          the costs of setting up retirement plans for their employees.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Amount</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>50% of qualified start-up costs</li>
          <li>Maximum credit: $5,000 per year</li>
          <li>Available for first 3 years of the plan</li>
          <li>Additional $500 credit per year for auto-enrollment feature</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Eligibility Requirements</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>100 or fewer employees earning $5,000+ in prior year</li>
          <li>At least one plan participant who is a non-highly compensated employee</li>
          <li>Did not maintain a qualified plan in the 3 prior years</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Qualifying Costs</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Plan setup and administration fees</li>
          <li>Employee education about the plan</li>
          <li>401(k), SIMPLE IRA, SEP IRA establishment costs</li>
        </ul>

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
