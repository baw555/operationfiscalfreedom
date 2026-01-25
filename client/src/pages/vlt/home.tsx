import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function VLTHome() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-4xl font-bold mt-12 text-brand-navy">
          Veteran Led Tax Solutions
        </h1>
        <p className="text-gold-500 font-semibold mt-2">
          Under our Commanding Officer, a Highly Decorated Air Force Veteran
        </p>

        <p className="mt-6 max-w-3xl text-gray-700">
          Veteran Led Tax Solutions is a Financial Operations & Intake Platform
          designed to help individuals and businesses understand tax issues,
          identify opportunities, and connect with licensed CPAs and tax attorneys.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link href="/veteran-led-tax/services/tax-recovery">
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-lg font-bold text-brand-navy">Tax Recovery</h3>
              <p className="text-sm text-gray-600 mt-2">Review overpayments and amendment opportunities</p>
            </div>
          </Link>
          <Link href="/veteran-led-tax/services/tax-resolution">
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-lg font-bold text-brand-navy">Tax Resolution</h3>
              <p className="text-sm text-gray-600 mt-2">Back taxes, notices, audits, and disputes</p>
            </div>
          </Link>
          <Link href="/veteran-led-tax/services/tax-credits">
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-lg font-bold text-brand-navy">Tax Credits</h3>
              <p className="text-sm text-gray-600 mt-2">R&D, WOTC, Energy, and more tax credits</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Link href="/veteran-led-tax/services/tax-preparation">
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-lg font-bold text-brand-navy">Tax Preparation</h3>
              <p className="text-sm text-gray-600 mt-2">Streamlined intake and filing workflows</p>
            </div>
          </Link>
          <Link href="/veteran-led-tax/services/tax-planning">
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-lg font-bold text-brand-navy">Tax Planning</h3>
              <p className="text-sm text-gray-600 mt-2">Proactive strategies to reduce taxes</p>
            </div>
          </Link>
          <Link href="/veteran-led-tax/intake">
            <div className="block p-6 bg-brand-red text-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-lg font-bold">Start Intake</h3>
              <p className="text-sm text-white/80 mt-2">Begin your tax consultation today</p>
            </div>
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/veteran-led-tax/resources/irs-notices">
              <div className="block p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <h3 className="font-semibold text-brand-navy">IRS Notices</h3>
                <p className="text-sm text-gray-600">Understanding what the IRS is telling you</p>
              </div>
            </Link>
            <Link href="/veteran-led-tax/resources/audit-representation">
              <div className="block p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <h3 className="font-semibold text-brand-navy">Audit Representation</h3>
                <p className="text-sm text-gray-600">Professional representation before the IRS</p>
              </div>
            </Link>
          </div>
        </div>

        </Container>
      <Footer />
    </>
  );
}
