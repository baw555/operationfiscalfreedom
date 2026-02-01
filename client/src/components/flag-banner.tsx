import { Star } from "lucide-react";

export function FlagBanner() {
  const insuranceCarriers = "MUTUAL OF OMAHA • PRUDENTIAL • TRANSAMERICA • NATIONWIDE • GUARDIAN • PRINCIPAL • CIGNA • AETNA • METLIFE • LINCOLN FINANCIAL • JOHN HANCOCK • AMERITAS • UNUM • STANDARD • AFLAC • STATE FARM • ALLSTATE • TRAVELERS • LIBERTY MUTUAL • HARTFORD";
  
  return (
    <div className="w-full max-w-6xl mx-auto my-6 sm:my-8 px-4">
      {/* Fortune 500 Style Scrolling Insurance Carriers Bar */}
      <div className="relative overflow-hidden rounded-lg shadow-2xl">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold z-10" />
        
        {/* Main marquee container */}
        <div className="relative bg-gradient-to-r from-brand-navy via-[#0d1f3c] to-brand-navy border-y-4 border-brand-gold">
          {/* Decorative stars on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-brand-navy to-transparent z-10 flex items-center justify-start pl-3">
            <Star className="w-6 h-6 text-brand-gold fill-brand-gold animate-pulse" />
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-brand-navy to-transparent z-10 flex items-center justify-end pr-3">
            <Star className="w-6 h-6 text-brand-gold fill-brand-gold animate-pulse" />
          </div>
          
          {/* Scrolling marquee */}
          <div className="py-4 sm:py-5 overflow-hidden">
            <div className="marquee-container flex whitespace-nowrap">
              <div className="marquee-content animate-marquee flex items-center">
                <span className="text-white font-display text-sm sm:text-base md:text-lg lg:text-xl tracking-wider px-8">
                  {insuranceCarriers}
                </span>
                <span className="text-brand-gold mx-4">★</span>
                <span className="text-white font-display text-sm sm:text-base md:text-lg lg:text-xl tracking-wider px-8">
                  {insuranceCarriers}
                </span>
                <span className="text-brand-gold mx-4">★</span>
              </div>
              <div className="marquee-content animate-marquee flex items-center" aria-hidden="true">
                <span className="text-white font-display text-sm sm:text-base md:text-lg lg:text-xl tracking-wider px-8">
                  {insuranceCarriers}
                </span>
                <span className="text-brand-gold mx-4">★</span>
                <span className="text-white font-display text-sm sm:text-base md:text-lg lg:text-xl tracking-wider px-8">
                  {insuranceCarriers}
                </span>
                <span className="text-brand-gold mx-4">★</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold z-10" />
        
        {/* Subtle inner glow */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 via-transparent to-white/5" />
      </div>

      {/* CSS for marquee animation */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        
        .marquee-container:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
