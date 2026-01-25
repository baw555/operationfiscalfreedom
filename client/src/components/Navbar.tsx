import { Link } from "wouter";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <nav className="border-b p-4 flex gap-6 text-sm bg-white relative">
      <Link href="/veteran-led-tax">
        <span className="hover:text-brand-navy cursor-pointer">Home</span>
      </Link>
      
      <div 
        className="relative"
        onMouseEnter={() => setAboutOpen(true)}
        onMouseLeave={() => setAboutOpen(false)}
      >
        <span className="hover:text-brand-navy cursor-pointer flex items-center gap-1">
          About <ChevronDown size={14} />
        </span>
        {aboutOpen && (
          <div className="absolute top-full left-0 bg-white border rounded shadow-lg py-2 min-w-[180px] z-50">
            <Link href="/veteran-led-tax/our-legacy">
              <span className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">About</span>
            </Link>
            <Link href="/private-doctor">
              <span className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Mission Act Health</span>
            </Link>
            <Link href="/veteran-led-tax/finops-refer">
              <span className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Refer & Earn</span>
            </Link>
          </div>
        )}
      </div>

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
