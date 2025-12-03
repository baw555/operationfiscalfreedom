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
      {/* Disclaimer Banner */}
      <div className="bg-white text-brand-red text-center py-2 px-4 font-bold text-sm uppercase tracking-wide border-b border-brand-red/20">
        test website, not finished and doesn't reflect final form
      </div>

      {/* Top Bar */}
      <div className="bg-brand-black text-[10px] sm:text-xs py-1.5 sm:py-2 px-2 sm:px-4 text-center text-white/80 uppercase tracking-wide sm:tracking-widest flex flex-col md:flex-row justify-center items-center gap-1 md:gap-8">
        <span className="hidden sm:inline">Veterans Helping Veterans Rise • Operation Fiscal Freedom</span>
        <span className="sm:hidden">Veterans Helping Veterans Rise</span>
        <span className="hidden md:inline text-brand-khaki">•</span>
        <span className="font-bold text-brand-khaki">Navy SEAL Owned Business</span>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-brand-navy/20 bg-brand-navy/95 backdrop-blur supports-[backdrop-filter]:bg-brand-navy/90 text-white">
        <div className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity cursor-pointer">
              <img 
                src={logoImage} 
                alt="OFF Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain bg-white rounded-full p-0.5 border-2 border-brand-green" 
              />
              <div className="flex flex-col">
                <span className="font-display text-sm sm:text-lg md:text-2xl leading-none tracking-wide">Operation</span>
                <span className="font-display text-sm sm:text-lg md:text-2xl leading-none text-brand-khaki tracking-wide">Fiscal Freedom</span>
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
          <div className="xl:hidden bg-brand-navy border-t border-white/10 p-4 flex flex-col gap-2 absolute w-full left-0 shadow-xl z-[100]">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="text-white font-bold uppercase tracking-wider hover:text-brand-khaki py-3 px-2 block cursor-pointer touch-manipulation min-h-[44px] flex items-center active:bg-white/10" 
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <Link 
              href="/join" 
              className="flex items-center justify-center w-full py-4 border-2 border-brand-khaki text-brand-khaki font-bold uppercase cursor-pointer touch-manipulation min-h-[48px] active:bg-brand-khaki/20" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Join Mission
            </Link>
            <Link 
              href="/login" 
              className="flex items-center justify-center w-full py-4 bg-brand-green text-white font-bold uppercase cursor-pointer touch-manipulation min-h-[48px] active:bg-brand-green/80" 
              onClick={() => setMobileMenuOpen(false)}
            >
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
      <footer className="bg-brand-black text-white pt-10 sm:pt-16 pb-6 sm:pb-8 border-t-4 border-brand-gold">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-brand-green" />
              <span className="font-display text-xl sm:text-3xl tracking-wide text-white">Operation Fiscal Freedom</span>
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
            <h4 className="font-display text-lg sm:text-xl text-brand-khaki mb-4 sm:mb-6">Platform</h4>
            <ul className="space-y-1 text-gray-400 text-sm sm:text-base">
              <li><Link href="/va-software" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-khaki">VA Rating Software</Link></li>
              <li><Link href="/gigs" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-khaki">Gig Marketplace</Link></li>
              <li><Link href="/businesses" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-khaki">Veteran Businesses</Link></li>
              <li><Link href="/resources" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-khaki">Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg sm:text-xl text-brand-khaki mb-4 sm:mb-6">Support</h4>
            <ul className="space-y-1 text-gray-400 text-sm sm:text-base">
              <li><Link href="/contact" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-khaki">Contact Us</Link></li>
              <li><Link href="/manual-help" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-khaki">Manual Claim Help</Link></li>
              <li><Link href="/affiliate" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-khaki">Become an Affiliate</Link></li>
              <li><Link href="/become-investor" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-khaki">Become an Investor</Link></li>
              <li><Link href="/join" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-khaki">Join the Mission</Link></li>
              <li><Link href="/login" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-khaki">Login</Link></li>
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
