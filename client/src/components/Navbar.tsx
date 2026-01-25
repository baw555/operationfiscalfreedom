import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="border-b p-4 flex gap-6 text-sm bg-white">
      <Link href="/veteran-led-tax">
        <span className="hover:text-brand-navy cursor-pointer">Home</span>
      </Link>
      <Link href="/veteran-led-tax/services/tax-recovery">
        <span className="hover:text-brand-navy cursor-pointer">Tax Recovery</span>
      </Link>
      <Link href="/veteran-led-tax/services/tax-resolution">
        <span className="hover:text-brand-navy cursor-pointer">Tax Resolution</span>
      </Link>
      <Link href="/veteran-led-tax/services/tax-credits">
        <span className="hover:text-brand-navy cursor-pointer">Tax Credits</span>
      </Link>
      <Link href="/veteran-led-tax/resources/irs-notices">
        <span className="hover:text-brand-navy cursor-pointer">IRS Notices</span>
      </Link>
      <Link href="/veteran-led-tax/intake">
        <span className="hover:text-brand-navy cursor-pointer">Intake</span>
      </Link>
    </nav>
  );
}
