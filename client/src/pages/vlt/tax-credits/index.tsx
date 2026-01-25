import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function TaxCredits() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Tax Credits</h1>

        <ul className="mt-6 list-disc ml-6 space-y-2">
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/rd-tax-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">R&D Tax Credit</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/wotc">
              <span className="text-brand-navy hover:underline cursor-pointer">Work Opportunity Tax Credit</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/energy-tax-credits">
              <span className="text-brand-navy hover:underline cursor-pointer">Energy Tax Credits</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/paid-family-leave-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Paid Family Leave Credit</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/disabled-access-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Disabled Access Credit</span>
            </Link>
          </li>
        </ul>
      </Container>
      <Footer />
    </>
  );
}
