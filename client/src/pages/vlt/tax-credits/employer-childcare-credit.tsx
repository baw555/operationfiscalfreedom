import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function EmployerChildcareCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Employer-Provided Childcare Credit</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Employer-Provided Childcare Credit (Form 8882) provides a tax credit for businesses that
          establish childcare facilities or contract with childcare providers for their employees.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Amount</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>40% of qualified childcare facility expenditures (50% for small businesses)</li>
          <li>Maximum credit: $500,000 ($600,000 for small businesses as of 2026)</li>
          <li>Additional 10% credit for childcare resource and referral services</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Qualifying Expenditures</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Acquiring, constructing, or rehabilitating childcare facilities</li>
          <li>Operating childcare facilities</li>
          <li>Contracting with licensed childcare providers</li>
          <li>Resource and referral services</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Recent Changes</h2>
        <p className="mt-3 text-gray-700">
          The One Big Beautiful Bill (OBBBA) enhanced this credit significantly starting in 2026,
          increasing both the credit percentage and maximum amounts for qualifying small businesses.
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
