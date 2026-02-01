import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, Star, LogIn, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import logoImage from "@assets/Navigaor_USA_Logo_396x86_1767699671480.png";
import logoStacked from "@assets/NavStar-Stacked_(2)_1769496493964.png";
import { RangerTabSVG } from "@/components/ranger-tab-svg";

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
];

const businessSubItems = [
  { name: "Business Overview", href: "/businesses" },
  { name: "Veteran Logistics", href: "/shipping" },
  { name: "Cost Savings / Services", href: "/job-placement" },
  { name: "Insurance Savings", href: "/insurance" },
  { name: "Tax Solutions", href: "/veteran-led-tax" },
];

const aboutSubItems = [
  { name: "About", href: "/about" },
  { name: "Mission Act Health", href: "/private-doctor" },
  { name: "Refer & Earn", href: "/fin-ops" },
];

const disabilityRatingSubItems = [
  { name: "Disability Benefits", href: "/disability-rating" },
  { name: "Healthcare Services", href: "/healthcare" },
];

const finOpsSubItems = [
  { name: "Fin-Ops Hub", href: "/fin-ops" },
  { name: "Veteran Logistics", href: "/shipping" },
  { name: "Insurance Savings", href: "/insurance" },
  { name: "Veteran Led Tax Solutions", href: "/veteran-led-tax" },
];

const freeVetSoftwareSubItems = [
  { name: "Operator AI", href: "/operator-ai" },
  { name: "Video & Music Gen", href: "/naval-intelligence" },
  { name: "RANGER: Free Document Signature", href: "/document-signature" },
];


export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [disabilityOpen, setDisabilityOpen] = useState(false);
  const [finOpsOpen, setFinOpsOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileDisabilityOpen, setMobileDisabilityOpen] = useState(false);
  const [mobileFinOpsOpen, setMobileFinOpsOpen] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);
  const [mobileBusinessOpen, setMobileBusinessOpen] = useState(false);
  const [freeVetSoftwareOpen, setFreeVetSoftwareOpen] = useState(false);
  const [mobileFreeVetSoftwareOpen, setMobileFreeVetSoftwareOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      {/* Top Bar - INTENSE */}
      <style>{animatedTextStyles}</style>
      <div className="bg-brand-navy text-[10px] sm:text-xs py-2 sm:py-3 px-2 sm:px-4 text-center text-white uppercase tracking-wide sm:tracking-widest flex flex-col md:flex-row justify-center items-center gap-1 md:gap-8 border-b-2 border-brand-red">
        <div className="flex flex-col items-center font-bold animate-veterans">
          <span>YOU FOUGHT FOR US</span>
          <span>WE FIGHT FOR YOU.</span>
        </div>
        <span className="hidden md:inline text-brand-red text-lg">★</span>
        <div className="flex flex-col items-center">
          <AnimatedNavigatorUSA />
          <span className="text-[8px] sm:text-[10px] text-brand-gold tracking-widest mt-0.5">TIER ONE VETERAN ECOSYSTEM FOR VETERAN FAMILIES</span>
        </div>
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
            
            <div className="relative" onMouseEnter={() => setAboutOpen(true)} onMouseLeave={() => setAboutOpen(false)}>
              <button className={cn(
                  "text-sm font-bold uppercase tracking-wider hover:text-blue-600 transition-colors py-2 border-b-4 border-transparent cursor-pointer whitespace-nowrap flex items-center gap-1",
                  location === "/about" || location === "/private-doctor" || location.includes("/finops-refer") ? "text-blue-600 border-blue-500" : "text-brand-navy"
                )}>
                  About <ChevronDown className={cn("w-4 h-4 transition-transform", aboutOpen && "rotate-180")} />
              </button>
              {aboutOpen && (
                <div className="absolute top-full left-0 bg-gradient-to-br from-blue-900 to-blue-950 border-2 border-blue-500 rounded-lg shadow-xl py-2 min-w-[220px] z-50">
                  {aboutSubItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      className={cn(
                        "block px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer",
                        location === item.href ? "text-blue-300 bg-blue-800" : "text-white"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* VA Rating / Health Dropdown */}
            <div className="relative" onMouseEnter={() => setDisabilityOpen(true)} onMouseLeave={() => setDisabilityOpen(false)}>
              <button className={cn(
                  "text-sm font-bold uppercase tracking-wider hover:text-blue-600 transition-colors py-2 border-b-4 border-transparent cursor-pointer whitespace-nowrap flex items-center gap-1",
                  location.startsWith("/disability-rating") ? "text-blue-600 border-blue-500" : "text-brand-navy"
                )}>
                  VA Rating / Health <ChevronDown className={cn("w-4 h-4 transition-transform", disabilityOpen && "rotate-180")} />
              </button>
              {disabilityOpen && (
                <div className="absolute top-full left-0 bg-gradient-to-br from-blue-900 to-blue-950 border-2 border-blue-500 rounded-lg shadow-xl py-2 min-w-[220px] z-50">
                  {disabilityRatingSubItems.map((item: any) => (
                    item.header ? (
                      <div key={item.href} className="px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-300 bg-blue-800 border-t border-b border-blue-700 mt-2">
                        {item.name}
                      </div>
                    ) : (
                      <Link 
                        key={item.href} 
                        href={item.href} 
                        className={cn(
                          "block px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer",
                          location === item.href ? "text-blue-300 bg-blue-800" : "text-white"
                        )}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative" onMouseEnter={() => setFinOpsOpen(true)} onMouseLeave={() => setFinOpsOpen(false)}>
              <button className={cn(
                  "text-sm font-bold uppercase tracking-wider hover:text-blue-600 transition-colors py-2 border-b-4 border-transparent cursor-pointer whitespace-nowrap flex items-center gap-1",
                  location.startsWith("/fin-ops") || location.startsWith("/merchant") || location.startsWith("/my-locker") || location.startsWith("/shipping") || location.startsWith("/logistics") || location.startsWith("/best-practices") || location.startsWith("/veteran-led-tax") ? "text-blue-600 border-blue-500" : "text-brand-navy"
                )}>
                  Fin-Ops <ChevronDown className={cn("w-4 h-4 transition-transform", finOpsOpen && "rotate-180")} />
              </button>
              {finOpsOpen && (
                <div className="absolute top-full left-0 bg-gradient-to-br from-blue-900 to-blue-950 border-2 border-blue-500 rounded-lg shadow-xl py-2 min-w-[220px] z-50">
                  {finOpsSubItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      className={cn(
                        "block px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer",
                        location === item.href ? "text-blue-300 bg-blue-800" : "text-white"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={() => setBusinessOpen(true)} onMouseLeave={() => setBusinessOpen(false)}>
              <button className={cn(
                  "text-sm font-bold uppercase tracking-wider hover:text-blue-600 transition-colors py-2 border-b-4 border-transparent cursor-pointer whitespace-nowrap flex items-center gap-1",
                  location === "/businesses" || location === "/job-placement" ? "text-blue-600 border-blue-500" : "text-brand-navy"
                )}>
                  Business <ChevronDown className={cn("w-4 h-4 transition-transform", businessOpen && "rotate-180")} />
              </button>
              {businessOpen && (
                <div className="absolute top-full left-0 bg-gradient-to-br from-blue-900 to-blue-950 border-2 border-blue-500 rounded-lg shadow-xl py-2 min-w-[220px] z-50">
                  {businessSubItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      className={cn(
                        "block px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer",
                        location === item.href ? "text-blue-300 bg-blue-800" : "text-white"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Nav Perks - AI Suite Dropdown */}
            <div className="relative" onMouseEnter={() => setFreeVetSoftwareOpen(true)} onMouseLeave={() => setFreeVetSoftwareOpen(false)}>
              <button className={cn(
                  "text-sm font-bold uppercase tracking-wider hover:text-blue-600 transition-colors py-2 border-b-4 border-transparent cursor-pointer whitespace-nowrap flex items-center gap-1",
                  location === "/operator-ai" || location === "/naval-intelligence" || location === "/document-signature" ? "text-blue-600 border-blue-500" : "text-brand-navy"
                )} data-testid="nav-free-vet-software">
                  Nav Perks <ChevronDown className={cn("w-4 h-4 transition-transform", freeVetSoftwareOpen && "rotate-180")} />
              </button>
              {freeVetSoftwareOpen && (
                <div className="absolute top-full left-0 bg-gradient-to-br from-blue-900 to-blue-950 border-2 border-blue-500 rounded-lg shadow-xl py-2 min-w-[220px] z-50">
                  {freeVetSoftwareSubItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      className={cn(
                        "block px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer",
                        location === item.href ? "text-blue-300 bg-blue-800" : "text-white"
                      )}
                      data-testid={`nav-${item.href.replace('/', '')}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Login Link */}
            <Link 
              href="/login"
              className={cn(
                "text-sm font-bold uppercase tracking-wider hover:text-blue-600 transition-colors py-2 border-b-4 cursor-pointer whitespace-nowrap",
                location === "/login" ? "text-blue-600 border-blue-500" : "text-brand-navy border-transparent"
              )} 
              data-testid="nav-login"
            >
              Login
            </Link>
          </nav>

          {/* Payzium link only when on Payzium pages */}
          <div className="hidden md:flex items-center gap-3">
            {location.toLowerCase().startsWith("/payzium") && (
              <Link href="/Payzium" className={cn(buttonVariants(), "bg-purple-600 hover:bg-purple-700 text-white font-bold border-2 border-purple-600 cursor-pointer shadow-lg")}>
                  Payzium
              </Link>
            )}
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
            
            <div className={cn("border-l-4", mobileAboutOpen ? "border-brand-red" : "border-transparent")}>
              <button 
                className={cn(
                  "font-bold uppercase tracking-wider py-3 px-2 w-full text-left flex items-center justify-between touch-manipulation min-h-[44px]",
                  mobileAboutOpen ? "text-brand-red" : "text-brand-navy"
                )}
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              >
                About <ChevronDown className={cn("w-4 h-4 transition-transform", mobileAboutOpen && "rotate-180")} />
              </button>
              {mobileAboutOpen && (
                <div className="pl-4 pb-2 bg-gray-50 rounded">
                  {aboutSubItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      className="text-brand-navy font-semibold py-3 px-3 block cursor-pointer touch-manipulation min-h-[44px] flex items-center hover:text-brand-red active:bg-brand-red/10 border-b border-gray-200 last:border-0" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile VA Rating / Health Dropdown */}
            <div className={cn("border-l-4", mobileDisabilityOpen ? "border-brand-red" : "border-transparent")}>
              <button 
                className={cn(
                  "font-bold uppercase tracking-wider py-3 px-2 w-full text-left flex items-center justify-between touch-manipulation min-h-[44px]",
                  mobileDisabilityOpen ? "text-brand-red" : "text-brand-navy"
                )}
                onClick={() => setMobileDisabilityOpen(!mobileDisabilityOpen)}
              >
                VA Rating / Health <ChevronDown className={cn("w-4 h-4 transition-transform", mobileDisabilityOpen && "rotate-180")} />
              </button>
              {mobileDisabilityOpen && (
                <div className="pl-4 pb-2 bg-gray-50 rounded">
                  {disabilityRatingSubItems.map((item: any) => (
                    item.header ? (
                      <div key={item.href} className="py-2 px-3 text-xs font-black uppercase tracking-wider text-brand-red bg-gray-200 mt-2">
                        {item.name}
                      </div>
                    ) : (
                      <Link 
                        key={item.href} 
                        href={item.href} 
                        className="text-brand-navy font-semibold py-3 px-3 block cursor-pointer touch-manipulation min-h-[44px] flex items-center hover:text-brand-red active:bg-brand-red/10 border-b border-gray-200 last:border-0" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>
            
            <div className={cn("border-l-4", mobileFinOpsOpen ? "border-brand-red" : "border-transparent")}>
              <button 
                className={cn(
                  "font-bold uppercase tracking-wider py-3 px-2 w-full text-left flex items-center justify-between touch-manipulation min-h-[44px]",
                  mobileFinOpsOpen ? "text-brand-red" : "text-brand-navy"
                )}
                onClick={() => setMobileFinOpsOpen(!mobileFinOpsOpen)}
              >
                Fin-Ops <ChevronDown className={cn("w-4 h-4 transition-transform", mobileFinOpsOpen && "rotate-180")} />
              </button>
              {mobileFinOpsOpen && (
                <div className="pl-4 pb-2 bg-gray-50 rounded">
                  {finOpsSubItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      className="text-brand-navy font-semibold py-3 px-3 block cursor-pointer touch-manipulation min-h-[44px] flex items-center hover:text-brand-red active:bg-brand-red/10 border-b border-gray-200 last:border-0" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className={cn("border-l-4", mobileBusinessOpen ? "border-brand-red" : "border-transparent")}>
              <button 
                className="w-full text-left text-brand-navy font-bold uppercase tracking-wider hover:text-brand-red py-3 px-2 cursor-pointer touch-manipulation min-h-[44px] flex items-center justify-between active:bg-brand-red/10" 
                onClick={() => setMobileBusinessOpen(!mobileBusinessOpen)}
              >
                Business <ChevronDown className={cn("w-4 h-4 transition-transform", mobileBusinessOpen && "rotate-180")} />
              </button>
              {mobileBusinessOpen && (
                <div className="pl-4 pb-2 bg-gray-50 rounded">
                  {businessSubItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      className="text-brand-navy font-semibold py-3 px-3 block cursor-pointer touch-manipulation min-h-[44px] flex items-center hover:text-brand-red active:bg-brand-red/10 border-b border-gray-200 last:border-0" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="h-px bg-brand-navy/20 my-2" />

            {/* Mobile Nav Perks Dropdown */}
            <div className={cn("border-l-4", mobileFreeVetSoftwareOpen ? "border-blue-500" : "border-transparent")}>
              <button 
                className={cn(
                  "font-bold uppercase tracking-wider py-3 px-2 w-full text-left flex items-center justify-between touch-manipulation min-h-[44px]",
                  mobileFreeVetSoftwareOpen ? "text-blue-600" : "text-brand-navy"
                )}
                onClick={() => setMobileFreeVetSoftwareOpen(!mobileFreeVetSoftwareOpen)}
                data-testid="nav-mobile-free-vet-software"
              >
                Nav Perks <ChevronDown className={cn("w-4 h-4 transition-transform", mobileFreeVetSoftwareOpen && "rotate-180")} />
              </button>
              {mobileFreeVetSoftwareOpen && (
                <div className="pl-4 pb-2 bg-gradient-to-br from-blue-900 to-blue-950 rounded">
                  {freeVetSoftwareSubItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      className="text-white font-semibold py-3 px-3 block cursor-pointer touch-manipulation min-h-[44px] flex items-center hover:text-blue-300 active:bg-blue-800 border-b border-blue-700 last:border-0" 
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`nav-mobile-${item.href.replace('/', '')}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Login Link */}
            <div className={cn("border-l-4", location === "/login" ? "border-blue-500" : "border-transparent")}>
              <Link 
                href="/login"
                className={cn(
                  "font-bold uppercase tracking-wider py-3 px-2 w-full text-left flex items-center touch-manipulation min-h-[44px]",
                  location === "/login" ? "text-blue-600" : "text-brand-navy"
                )}
                onClick={() => setMobileMenuOpen(false)}
                data-testid="nav-mobile-login"
              >
                Login
              </Link>
            </div>
            {location.toLowerCase().startsWith("/payzium") && (
              <Link 
                href="/Payzium" 
                className="flex items-center justify-center w-full py-4 bg-purple-600 text-white font-bold uppercase cursor-pointer touch-manipulation min-h-[48px] active:bg-purple-700 shadow-lg" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Payzium
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 page-fade-in">
        {children}
      </main>

      {/* Footer - INTENSE */}
      <footer className="bg-brand-navy text-white pt-10 sm:pt-16 pb-36 sm:pb-40 md:pb-44 border-t-4 border-brand-red relative">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-12 mb-8 sm:mb-12">
          <div className="col-span-1 sm:col-span-2">
            <h3 className="font-display text-2xl sm:text-3xl text-white mb-4">Gear Up For Your Family</h3>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Face 2026 and beyond with confidence. Financial. Spiritual. Medical. Holistic.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg sm:text-xl text-brand-red mb-4 sm:mb-6">Platform</h4>
            <ul className="space-y-1 text-gray-300 text-sm sm:text-base">
              <li><Link href="/get-help" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Free VA Rating Assistance</Link></li>
              <li><Link href="/fin-ops" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Fin-Ops Marketplace</Link></li>
              <li><Link href="/businesses" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Veteran Businesses</Link></li>
              <li><Link href="/resources" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg sm:text-xl text-brand-red mb-4 sm:mb-6">Support</h4>
            <ul className="space-y-1 text-gray-300 text-sm sm:text-base">
              <li><Link href="/contact" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Contact Us</Link></li>
              <li><Link href="/affiliate" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Enlist</Link></li>
              <li><Link href="/login" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Deploy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg sm:text-xl text-brand-red mb-4 sm:mb-6">Legal</h4>
            <ul className="space-y-1 text-gray-300 text-sm sm:text-base">
              <li><Link href="/privacy-policy" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Privacy Policy</Link></li>
              <li><Link href="/terms-of-use" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Terms of Use</Link></li>
              <li><Link href="/affiliated-partners" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Affiliated Partners</Link></li>
              <li><Link href="/do-not-sell" className="hover:text-white cursor-pointer touch-manipulation inline-block py-2 min-h-[44px] active:text-brand-red">Do Not Sell My Info</Link></li>
            </ul>
          </div>
        </div>

        {/* Operator Disclosure */}
        <div className="container mx-auto px-4 py-4 border-t border-white/10 mb-4">
          <p className="text-center text-gray-400 text-xs max-w-3xl mx-auto">
            Operation Fiscal Freedom is an initiative operated by NavigatorUSA, a 501(c)(3) nonprofit organization. 
            NavigatorUSA shares data with affiliated or mission-aligned partners to respond to your requests. 
            NavigatorUSA does not sell your personal information. <Link href="/privacy-policy" className="text-brand-red hover:text-white underline">Learn more</Link>.
          </p>
        </div>
        <div className="container mx-auto px-4 pt-8 border-t border-white/20">
          {/* 501(c)(3) Validation - Elaborate clickable section */}
          <div className="text-center mb-6">
            <Link href="/transparency" className="group block max-w-2xl mx-auto bg-gradient-to-r from-green-900/40 via-green-800/30 to-green-900/40 hover:from-green-800/50 hover:via-green-700/40 hover:to-green-800/50 border border-green-500/30 hover:border-green-400/50 rounded-xl p-6 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-green-500/20">
              <div className="flex items-center justify-center gap-3 mb-3">
                <svg className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-400 font-display text-xl tracking-wide">IRS VERIFIED</span>
                <svg className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-white font-display text-2xl mb-2">501(c)(3) Non-Profit Organization</h3>
              <p className="text-gray-300 text-sm mb-3">
                Navigator USA Corp | Public Charity Status: 170(b)(1)(A)(vi)
              </p>
              <p className="text-gray-400 text-xs mb-4">
                Your donations are tax-deductible to the fullest extent permitted by law.
              </p>
              <div className="inline-flex items-center gap-2 bg-white/10 group-hover:bg-white/20 rounded-full px-5 py-2 text-white font-medium transition-colors">
                <span>CLICK HERE TO VERIFY OUR STATUS</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
        {/* Large Logo - Absolutely positioned bottom left */}
        <img 
          src={logoStacked} 
          alt="NavigatorUSA" 
          className="absolute bottom-4 left-4 h-28 sm:h-32 md:h-36 lg:h-40 w-auto object-contain" 
        />
        {/* Copyright - Absolutely positioned bottom right */}
        <div className="absolute bottom-4 right-4 text-right text-gray-400 text-sm">
          © {new Date().getFullYear()} NavigatorUSA. All rights reserved.<br />
          <span className="text-xs">Veterans' Family Resources.</span>
        </div>
      </footer>
    </div>
  );
}
