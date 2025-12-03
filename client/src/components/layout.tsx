import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, Shield, LogIn } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import logoImage from "@assets/generated_images/operation_fiscal_freedom_logo.png";

const navItems = [
  { name: "About", href: "/about" },
  { name: "Software", href: "/va-software" },
  { name: "Manual Help", href: "/manual-help" },
  { name: "Gigs", href: "/gigs" },
  { name: "Businesses", href: "/businesses" },
  { name: "Income", href: "/income" },
  { name: "Resources", href: "/resources" },
  { name: "Success", href: "/success" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      {/* Top Bar */}
      <div className="bg-brand-black text-xs py-2 px-4 text-center text-white/80 uppercase tracking-widest flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8">
        <span>Veterans Helping Veterans Rise • Operation Fiscal Freedom</span>
        <span className="hidden md:inline text-brand-khaki">•</span>
        <span className="font-bold text-brand-khaki">Navy SEAL Owned Business</span>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-brand-navy/20 bg-brand-navy/95 backdrop-blur supports-[backdrop-filter]:bg-brand-navy/90 text-white">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer">
              <img 
                src={logoImage} 
                alt="OFF Logo" 
                className="h-12 w-12 object-contain bg-white rounded-full p-0.5 border-2 border-brand-green" 
              />
              <div className="flex flex-col">
                <span className="font-display text-2xl leading-none tracking-wide">Operation</span>
                <span className="font-display text-2xl leading-none text-brand-khaki tracking-wide">Fiscal Freedom</span>
              </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={cn(
                  "text-sm font-bold uppercase tracking-wider hover:text-brand-khaki transition-colors py-2 border-b-2 border-transparent cursor-pointer whitespace-nowrap",
                  location === item.href ? "text-brand-khaki border-brand-khaki" : "text-gray-300"
                )}>
                  {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
             <Link href="/join" className={cn(buttonVariants({ variant: "outline" }), "border-brand-khaki text-brand-khaki hover:bg-brand-khaki hover:text-brand-navy font-bold border-2 cursor-pointer")}>
                Join Mission
            </Link>
            <Link href="/login" className={cn(buttonVariants(), "bg-brand-green hover:bg-brand-green/90 text-white font-bold border-2 border-transparent cursor-pointer")}>
                <LogIn className="mr-2 h-4 w-4" /> Login
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="xl:hidden p-2 text-white hover:text-brand-khaki"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-brand-navy border-t border-white/10 p-4 flex flex-col gap-4 absolute w-full shadow-xl">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-white font-bold uppercase tracking-wider hover:text-brand-khaki py-2 block cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                  {item.name}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <Link href="/join" className="block w-full text-center py-3 border-2 border-brand-khaki text-brand-khaki font-bold uppercase cursor-pointer">
                Join Mission
            </Link>
            <Link href="/login" className="block w-full text-center py-3 bg-brand-green text-white font-bold uppercase cursor-pointer">
                Login
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-black text-white pt-16 pb-8 border-t-4 border-brand-gold">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-brand-green" />
              <span className="font-display text-3xl tracking-wide text-white">Operation Fiscal Freedom</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Veterans Helping Veterans Rise. We provide the tools, community, and opportunities for financial independence.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center hover:bg-brand-green transition-colors cursor-pointer">X</div>
              <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center hover:bg-brand-green transition-colors cursor-pointer">In</div>
              <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center hover:bg-brand-green transition-colors cursor-pointer">Fb</div>
            </div>
          </div>

          <div>
            <h4 className="font-display text-xl text-brand-khaki mb-6">Platform</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/va-software" className="hover:text-white cursor-pointer">VA Rating Software</Link></li>
              <li><Link href="/gigs" className="hover:text-white cursor-pointer">Gig Marketplace</Link></li>
              <li><Link href="/businesses" className="hover:text-white cursor-pointer">Veteran Businesses</Link></li>
              <li><Link href="/resources" className="hover:text-white cursor-pointer">Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl text-brand-khaki mb-6">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/contact" className="hover:text-white cursor-pointer">Contact Us</Link></li>
              <li><Link href="/manual-help" className="hover:text-white cursor-pointer">Manual Claim Help</Link></li>
              <li><Link href="/join" className="hover:text-white cursor-pointer">Join the Mission</Link></li>
              <li><Link href="/login" className="hover:text-white cursor-pointer">Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Operation Fiscal Freedom. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
