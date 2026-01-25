import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function IndianEmploymentCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Indian Employment Credit</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Indian Employment Credit (Form 8845) encourages businesses to hire and retain
          qualified Native American employees who work and live on or near an Indian reservation.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Amount</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>20% of excess of qualified wages and health insurance costs over base amount</li>
          <li>Maximum qualified wages: $20,000 per employee</li>
          <li>Credit reduces as wages increase above threshold</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Qualifying Employees</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Enrolled member of an Indian tribe or spouse of enrolled member</li>
          <li>Performs substantially all services on an Indian reservation</li>
          <li>Principal residence is on or near the reservation</li>
          <li>Not a 5% or more owner of the business</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Qualifying Reservations</h2>
        <p className="mt-3 text-gray-700">
          The credit applies to employees working on any Indian reservation as defined by the
          Indian Financing Act, including all federally recognized tribal lands.
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
