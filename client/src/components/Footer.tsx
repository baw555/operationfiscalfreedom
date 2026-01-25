import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t mt-24 p-6 text-xs text-gray-500">
      © {new Date().getFullYear()} Veteran Led Tax Solutions ·
      <Link href="/veteran-led-tax/disclosures">
        <span className="ml-2 hover:text-brand-navy cursor-pointer">Disclosures</span>
      </Link>
    </footer>
  );
}
