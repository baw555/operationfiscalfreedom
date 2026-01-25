import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function RehabilitationCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Rehabilitation Tax Credit (Historic Buildings)</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Rehabilitation Tax Credit (Form 3468) encourages preservation and renovation of
          historic and older buildings by providing a tax credit for qualified rehabilitation expenditures.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Amount</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>20% of qualified rehabilitation expenditures for certified historic structures</li>
          <li>Credit claimed ratably over 5 years</li>
          <li>No maximum credit limit</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Qualifying Buildings</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Listed on the National Register of Historic Places</li>
          <li>Located in a registered historic district</li>
          <li>Building must be substantially rehabilitated</li>
          <li>Rehabilitation must be certified by the National Park Service</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Eligible Expenditures</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Structural modifications and repairs</li>
          <li>Building systems (plumbing, electrical, HVAC)</li>
          <li>Interior finish work</li>
          <li>Architectural and engineering fees</li>
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
