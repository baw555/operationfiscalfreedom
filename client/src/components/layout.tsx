import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, Star, LogIn, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import logoImage from "@assets/Navigaor_USA_Logo_396x86_1767699671480.png";
import logoStacked from "@assets/NavStar-Stacked_(1)_1767702808393.png";

const animatedTextStyles = `
  @keyframes letterWave {
    0%, 40% { color: #DC2626; }
    60%, 100% { color: #E5E5E5; }
  }
  @keyframes veteransGlow {
    0%, 50% { opacity: 0.7; text-shadow: none; }
    60%, 90% { opacity: 1; text-shadow: 0 0 10px #D4AF37, 0 0 20px #D4AF37; }
    100% { opacity: 0.7; text-shadow: none; }
  }
  .animate-veterans {
    animation: veteransGlow 20s ease-in-out infinite;
    animation-delay: 10s;
  }
`;

function AnimatedNavigatorUSA({ variant = "topbar" }: { variant?: "topbar" | "navbar" }) {
  const letters = "NavigatorUSA".split("");
  const isNavbar = variant === "navbar";
  return (
    <span className={cn(
      "font-bold inline-flex",
      isNavbar ? "text-xl sm:text-2xl md:text-3xl tracking-tight" : "bg-brand-navy px-3 py-1 rounded"
    )}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className="inline-block"
          style={{
            animation: `letterWave 20s ease-in-out infinite`,
            animationDelay: `${index * 2}s`,
            color: '#DC2626'
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Vet-Biz-Owners", href: "/businesses" },
];

const finOpsSubItems = [
  { name: "Fin-Ops Overview", href: "/fin-ops" },
  { name: "Merchant Services", href: "/merchant-services" },
  { name: "MY LOCKER", href: "/my-locker" },
  { name: "Veteran Logistics", href: "/shipping" },
  { name: "Veteran Led Tax", href: "/veteran-led-tax" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [finOpsOpen, setFinOpsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      {/* Top Bar - INTENSE */}
      <style>{animatedTextStyles}</style>
      <div className="bg-brand-navy text-[10px] sm:text-xs py-2 sm:py-3 px-2 sm:px-4 text-center text-white uppercase tracking-wide sm:tracking-widest flex flex-col md:flex-row justify-center items-center gap-1 md:gap-8 border-b-2 border-brand-red">
        <span className="hidden sm:inline font-bold animate-veterans">Veterans' Family Resources</span>
        <span className="sm:hidden font-bold animate-veterans">Veterans' Family Resources</span>
        <span className="hidden md:inline text-brand-red text-lg">★</span>
        <AnimatedNavigatorUSA />
      </div>

      {/* Navigation - INTENSE */}
      <header className="sticky top-0 z-50 w-full border-b-4 border-brand-red bg-white shadow-lg">
        <div className="container mx-auto px-2 sm:px-4 h-16 sm:h-18 md:h-22 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity cursor-pointer">
              <img 
                src={logoImage} 
                alt="NavigatorUSA Logo" 
                className="h-10 sm:h-12 md:h-14 object-contain hidden sm:block" 
              />
              <img 
                src={logoStacked} 
                alt="NavigatorUSA Logo" 
                className="h-12 w-12 object-contain sm:hidden" 
              />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-6">
            <Link href="/" className={cn(
                "text-sm font-bold uppercase tracking-wider hover:text-brand-red transition-colors py-2 border-b-4 border-transparent cursor-pointer whitespace-nowrap",
                location === "/" ? "text-brand-red border-brand-red" : "text-brand-navy"
              )}>
                Home
            </Link>
            <Link href="/about" className={cn(
                "text-sm font-bold uppercase tracking-wider hover:text-brand-red transition-colors py-2 border-b-4 border-transparent cursor-pointer whitespace-nowrap",
                location === "/about" ? "text-brand-red border-brand-red" : "text-brand-navy"
              )}>
                About
            </Link>
            
            <div className="relative" onMouseEnter={() => setFinOpsOpen(true)} onMouseLeave={() => setFinOpsOpen(false)}>
              <button className={cn(
                  "text-sm font-bold uppercase tracking-wider hover:text-brand-red transition-colors py-2 border-b-4 border-transparent cursor-pointer whitespace-nowrap flex items-center gap-1",
                  location.startsWith("/fin-ops") || location.startsWith("/merchant") || location.startsWith("/my-locker") || location.startsWith("/shipping") || location.startsWith("/logistics") || location.startsWith("/best-practices") || location.startsWith("/veteran-led-tax") ? "text-brand-red border-brand-red" : "text-brand-navy"
                )}>
                  Fin-Ops <ChevronDown className={cn("w-4 h-4 transition-transform", finOpsOpen && "rotate-180")} />
              </button>
              {finOpsOpen && (
                <div className="absolute top-full left-0 bg-white border-2 border-brand-red rounded-lg shadow-xl py-2 min-w-[220px] z-50">
                  {finOpsSubItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      className={cn(
                        "block px-4 py-2 text-sm font-bold hover:bg-brand-red hover:text-white transition-colors cursor-pointer",
                        location === item.href ? "text-brand-red bg-brand-red/10" : "text-brand-navy"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/businesses" className={cn(
                "text-sm font-bold uppercase tracking-wider hover:text-brand-red transition-colors py-2 border-b-4 border-transparent cursor-pointer whitespace-nowrap",
                location === "/businesses" ? "text-brand-red border-brand-red" : "text-brand-navy"
              )}>
                Vet-Biz-Owners
            </Link>
            <Link href="/admin/login" className={cn(
                "text-sm font-bold uppercase tracking-wider hover:text-brand-red transition-colors py-2 border-b-4 border-transparent cursor-pointer whitespace-nowrap",
                location.startsWith("/admin") ? "text-brand-red border-brand-red" : "text-brand-navy"
              )}>
                Portal
            </Link>
          </nav>

          {/* CTA Buttons - INTENSE */}
          <div className="hidden md:flex items-center gap-3">
             <Link href="/join" className={cn(buttonVariants({ variant: "outline" }), "border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white font-bold border-2 cursor-pointer")}>
                Enlist
            </Link>
            <Link href="/login" className={cn(buttonVariants(), "bg-brand-red hover:bg-brand-red/90 text-white font-bold border-2 border-brand-red cursor-pointer shadow-lg")}>
                <LogIn className="mr-2 h-4 w-4" /> Deploy
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="xl:hidden p-2 text-brand-navy hover:text-brand-red"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu - INTENSE */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t-2 border-brand-red p-4 flex flex-col gap-2 absolute w-full left-0 shadow-xl z-[100]">
            <Link 
              href="/" 
              className="text-brand-navy font-bold uppercase tracking-wider hover:text-brand-red py-3 px-2 block cursor-pointer touch-manipulation min-h-[44px] flex items-center active:bg-brand-red/10 border-l-4 border-transparent hover:border-brand-red" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-brand-navy font-bold uppercase tracking-wider hover:text-brand-red py-3 px-2 block cursor-pointer touch-manipulation min-h-[44px] flex items-center active:bg-brand-red/10 border-l-4 border-transparent hover:border-brand-red" 
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            
            <div className="border-l-4 border-brand-red">
              <button 
                className="text-brand-red font-bold uppercase tracking-wider py-3 px-2 w-full text-left flex items-center justify-between touch-manipulation min-h-[44px]"
                onClick={() => setFinOpsOpen(!finOpsOpen)}
              >
                Fin-Ops <ChevronDown className={cn("w-4 h-4 transition-transform", finOpsOpen && "rotate-180")} />
              </button>
              {finOpsOpen && (
                <div className="pl-4 pb-2">
                  {finOpsSubItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      className="text-brand-navy font-semibold py-2 px-2 block cursor-pointer touch-manipulation min-h-[40px] flex items-center hover:text-brand-red active:bg-brand-red/10" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/businesses" 
              className="text-brand-navy font-bold uppercase tracking-wider hover:text-brand-red py-3 px-2 block cursor-pointer touch-manipulation min-h-[44px] flex items-center active:bg-brand-red/10 border-l-4 border-transparent hover:border-brand-red" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Vet-Biz-Owners
            </Link>
            <Link 
              href="/admin/login" 
              className="text-brand-navy font-bold uppercase tracking-wider hover:text-brand-red py-3 px-2 block cursor-pointer touch-manipulation min-h-[44px] flex items-center active:bg-brand-red/10 border-l-4 border-transparent hover:border-brand-red" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Portal
            </Link>
            <div className="h-px bg-brand-navy/20 my-2" />
            <Link 
              href="/join" 
              className="flex items-center justify-center w-full py-4 border-2 border-brand-navy text-brand-navy font-bold uppercase cursor-pointer touch-manipulation min-h-[48px] active:bg-brand-navy/10" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Enlist
            </Link>
            <Link 
              href="/login" 
              className="flex items-center justify-center w-full py-4 bg-brand-red text-white font-bold uppercase cursor-pointer touch-manipulation min-h-[48px] active:bg-brand-red/80 shadow-lg" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Deploy
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer - INTENSE */}
      <footer className="bg-brand-navy text-white pt-10 sm:pt-16 pb-6 sm:pb-8 border-t-4 border-brand-red">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <img src={logoStacked} alt="NavigatorUSA" className="h-16 w-16 object-contain" />
              <div>
                <span className="font-display text-xl sm:text-3xl tracking-wide text-white block">NavigatorUSA</span>
                <span className="text-brand-silver text-sm">Veterans' Family Resources</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Gear up for your family to face 2026 and beyond. Financial. Spiritual. Medical. Holistic.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg sm:text-xl text-brand-red mb-4 sm:mb-6">Platform</h4>
            <ul className="space-y-1 text-gray-300 text-sm sm:text-base">
              <li><Link href="/va-software" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">VA Rating Software</Link></li>
              <li><Link href="/fin-ops" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Fin-Ops Marketplace</Link></li>
              <li><Link href="/businesses" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Veteran Businesses</Link></li>
              <li><Link href="/resources" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg sm:text-xl text-brand-red mb-4 sm:mb-6">Support</h4>
            <ul className="space-y-1 text-gray-300 text-sm sm:text-base">
              <li><Link href="/contact" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Contact Us</Link></li>
              <li><Link href="/manual-help" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Manual Claim Help</Link></li>
              <li><Link href="/affiliate" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Become an Affiliate</Link></li>
              <li><Link href="/become-investor" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Become an Investor</Link></li>
              <li><Link href="/join" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Enlist</Link></li>
              <li><Link href="/login" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Deploy</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 pt-8 border-t border-white/20 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} NavigatorUSA. All rights reserved. Veterans' Family Resources.
        </div>
      </footer>
    </div>
  );
}
