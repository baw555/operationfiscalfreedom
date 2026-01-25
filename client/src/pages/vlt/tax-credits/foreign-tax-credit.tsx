import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function ForeignTaxCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Foreign Tax Credit</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Foreign Tax Credit prevents double taxation by allowing you to claim a credit
          for income taxes paid to foreign countries. This is particularly valuable for
          Americans working abroad or with foreign investments.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">How It Works</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Dollar-for-dollar credit against U.S. taxes</li>
          <li>Credit limited to U.S. tax on foreign income</li>
          <li>Excess credits can be carried back 1 year or forward 10 years</li>
          <li>Must choose between credit or deduction (credit usually better)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Qualifying Taxes</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Income tax paid to foreign countries</li>
          <li>Taxes paid to U.S. possessions</li>
          <li>Taxes on wages, dividends, interest, and royalties</li>
          <li>Taxes withheld by foreign countries</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Simplified Method</h2>
        <p className="mt-3 text-gray-700">
          If your foreign taxes are $300 or less ($600 married filing jointly), and all foreign
          income is passive (like dividends), you can claim the credit directly on Form 1040
          without filing Form 1116.
        </p>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Limitation</h2>
        <p className="mt-3 text-gray-700">
          The credit is limited by the ratio of foreign income to total income. If your
          foreign tax rate is higher than the U.S. rate, you may have excess credits to
          carry to other years.
        </p>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Get Help With Foreign Taxes
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
