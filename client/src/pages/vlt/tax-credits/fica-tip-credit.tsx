import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function FICATipCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">FICA Tip Credit</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The FICA Tip Credit (Form 8846) allows food and beverage establishments to claim a credit
          for Social Security and Medicare taxes paid on employee tips that exceed minimum wage.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Amount</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Equal to employer's share of FICA taxes (7.65%) on tip income</li>
          <li>Only on tips exceeding the amount needed to bring wages to minimum wage</li>
          <li>No limit on the credit amount</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Eligible Businesses</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Restaurants and bars</li>
          <li>Hotels and resorts (food service)</li>
          <li>Catering companies</li>
          <li>Beauty services (expanded in 2025)</li>
          <li>Any business where tipping is customary</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Recent Changes</h2>
        <p className="mt-3 text-gray-700">
          The 2025 tax law expanded eligibility to include beauty service professionals
          such as hair stylists, barbers, and nail technicians.
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
