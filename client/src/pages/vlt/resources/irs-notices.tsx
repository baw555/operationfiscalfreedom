import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function IRSNotices() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12">IRS Notices</h1>
        <p className="mt-4 max-w-3xl">
          IRS notices are formal communications that may involve balances due,
          enforcement actions, or discrepancies. Each notice has deadlines.
        </p>

        <ul className="list-disc ml-6 mt-6 space-y-2">
          <li>
            <Link href="/veteran-led-tax/resources/irs-notices/cp14">
              <span className="text-brand-navy hover:underline cursor-pointer">CP14 – Balance Due</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/resources/irs-notices/lt11">
              <span className="text-brand-navy hover:underline cursor-pointer">LT11 – Final Notice Before Levy</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/resources/irs-notices/cp504">
              <span className="text-brand-navy hover:underline cursor-pointer">CP504 – Intent to Levy</span>
            </Link>
          </li>
        </ul>
      </Container>
      <Footer />
    </>
  );
}
