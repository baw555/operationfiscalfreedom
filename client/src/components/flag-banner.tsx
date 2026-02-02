import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, Star, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function FlagBanner() {
  const [showLockedDialog, setShowLockedDialog] = useState(false);
  
  const marqueeText = "GROWING # OF WAYS TO EARN $$$ • VETERANS GET FREE LINEMAN SCHOOL, TOOLS & OTHER WORK PROGRAMS • SAVE 20-40% ON ALL BUSINESS + PERSONAL INSURANCE - DIRECT TO INSURERS & 70 CARRIERS • REFER & EARN $$$ • GET NO-OUT-OF-POCKET VA DISABILITY RATINGS w/ BEST LAW FIRMS IN US • SPECIALIZED TAX CREDITS FOR BUSINESS • WORK • WORK • WORK • FREE DOCUMENT SIGNING SOFTWARE • GENERATIVE AI • OPERATOR AI (CENSORLESS - PRIVATE)";

  const freeServicesAnimationStyles = `
    @keyframes patrioticGlow {
      0%, 100% { 
        box-shadow: 0 0 20px rgba(220, 38, 38, 0.8), 0 0 40px rgba(220, 38, 38, 0.6), 0 0 60px rgba(220, 38, 38, 0.4), inset 0 0 20px rgba(220, 38, 38, 0.2);
        border-color: #dc2626;
        background: linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #dc2626 100%);
      }
      33% { 
        box-shadow: 0 0 25px rgba(255, 255, 255, 1), 0 0 50px rgba(255, 255, 255, 0.8), 0 0 75px rgba(255, 255, 255, 0.5), inset 0 0 25px rgba(255, 255, 255, 0.3);
        border-color: #ffffff;
        background: linear-gradient(135deg, #ffffff 0%, #e5e5e5 50%, #ffffff 100%);
      }
      66% { 
        box-shadow: 0 0 20px rgba(37, 99, 235, 0.8), 0 0 40px rgba(37, 99, 235, 0.6), 0 0 60px rgba(37, 99, 235, 0.4), inset 0 0 20px rgba(37, 99, 235, 0.2);
        border-color: #2563eb;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #2563eb 100%);
      }
    }
    @keyframes patrioticText {
      0%, 100% { color: #ffffff; text-shadow: 0 0 10px rgba(255,255,255,0.8); }
      33% { color: #1a365d; text-shadow: 0 0 10px rgba(0,0,0,0.3); }
      66% { color: #ffffff; text-shadow: 0 0 10px rgba(255,255,255,0.8); }
    }
    @keyframes starPulse {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(234, 179, 8, 1)); transform: scale(1); }
      50% { filter: drop-shadow(0 0 15px rgba(234, 179, 8, 1)); transform: scale(1.2); }
    }
    .free-services-btn {
      animation: patrioticGlow 3s ease-in-out infinite;
    }
    .free-services-btn span {
      animation: patrioticText 3s ease-in-out infinite;
    }
    .free-services-btn .star-icon {
      animation: starPulse 1.5s ease-in-out infinite;
    }
  `;
  
  const handleLockedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLockedDialog(true);
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto my-6 sm:my-8 px-4">
      {/* Military Motivation Marquee - Slower, Left to Right */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes militaryMarquee {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        @keyframes redGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(220, 38, 38, 0.8), 0 0 20px rgba(220, 38, 38, 0.6), 0 0 30px rgba(220, 38, 38, 0.4); }
          50% { text-shadow: 0 0 20px rgba(220, 38, 38, 1), 0 0 40px rgba(220, 38, 38, 0.8), 0 0 60px rgba(220, 38, 38, 0.6); }
        }
        @keyframes whiteGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(200, 200, 200, 0.4); }
          50% { text-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.9), 0 0 60px rgba(255, 255, 255, 0.7); }
        }
        @keyframes blueGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(37, 99, 235, 0.8), 0 0 20px rgba(37, 99, 235, 0.6), 0 0 30px rgba(37, 99, 235, 0.4); }
          50% { text-shadow: 0 0 20px rgba(37, 99, 235, 1), 0 0 40px rgba(37, 99, 235, 0.8), 0 0 60px rgba(37, 99, 235, 0.6); }
        }
        @keyframes camoGlow {
          0%, 100% { 
            text-shadow: 0 0 10px rgba(34, 139, 34, 0.8), 0 0 20px rgba(85, 107, 47, 0.6), 0 0 30px rgba(107, 142, 35, 0.4);
            color: #228b22;
          }
          33% { 
            text-shadow: 0 0 15px rgba(85, 107, 47, 0.9), 0 0 30px rgba(34, 139, 34, 0.7), 0 0 45px rgba(107, 142, 35, 0.5);
            color: #556b2f;
          }
          66% { 
            text-shadow: 0 0 12px rgba(107, 142, 35, 0.85), 0 0 25px rgba(85, 107, 47, 0.65), 0 0 40px rgba(34, 139, 34, 0.45);
            color: #6b8e23;
          }
        }
        @keyframes yellowGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(234, 179, 8, 0.8), 0 0 20px rgba(234, 179, 8, 0.6), 0 0 30px rgba(234, 179, 8, 0.4); }
          50% { text-shadow: 0 0 20px rgba(234, 179, 8, 1), 0 0 40px rgba(234, 179, 8, 0.8), 0 0 60px rgba(234, 179, 8, 0.6); }
        }
        .military-marquee-container {
          display: flex;
          white-space: nowrap;
        }
        .military-marquee-content {
          animation: militaryMarquee 40s linear infinite;
          display: flex;
          align-items: center;
        }
        .glow-red { color: #dc2626; animation: redGlow 2s ease-in-out infinite; }
        .glow-white { color: #ffffff; animation: whiteGlow 2s ease-in-out infinite; animation-delay: 0.5s; }
        .glow-blue { color: #2563eb; animation: blueGlow 2s ease-in-out infinite; animation-delay: 1s; }
        .glow-camo { animation: camoGlow 2s ease-in-out infinite; animation-delay: 1.25s; }
        .glow-yellow { color: #eab308; animation: yellowGlow 2s ease-in-out infinite; animation-delay: 1.5s; }
      `}} />

      {/* Military Motivation Marquee - In the margin space above navy bar */}
      <div className="overflow-hidden py-1 mb-1">
        <div className="military-marquee-container">
          {[0, 1].map((i) => (
            <div key={i} className="military-marquee-content" aria-hidden={i === 1}>
              <span className="glow-red font-display text-xs sm:text-sm font-black uppercase tracking-widest px-4">
                FOR YOUR BROTHERS
              </span>
              <span className="text-brand-gold text-sm mx-3">★</span>
              <span className="glow-white font-display text-xs sm:text-sm font-black uppercase tracking-widest px-4" style={{ WebkitTextStroke: '0.5px #1a365d' }}>
                FOR YOUR SISTERS
              </span>
              <span className="text-brand-gold text-sm mx-3">★</span>
              <span className="glow-blue font-display text-xs sm:text-sm font-black uppercase tracking-widest px-4">
                FOR EACH OTHER
              </span>
              <span className="text-brand-gold text-sm mx-3">★</span>
              <span className="glow-camo font-display text-xs sm:text-sm font-black uppercase tracking-widest px-4">
                YOU FAIL WHEN WE TELL YOU TO FAIL
              </span>
              <span className="text-brand-gold text-sm mx-3">★</span>
              <span className="glow-yellow font-display text-xs sm:text-sm font-black uppercase tracking-widest px-4">
                YOU DON'T HAVE PERMISSION TO FAIL
              </span>
              <span className="text-brand-gold text-sm mx-3">★</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fortune 500 Style Scrolling Marquee Bar */}
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
                  {marqueeText}
                </span>
                <span className="text-brand-gold mx-4">★</span>
                <span className="text-white font-display text-sm sm:text-base md:text-lg lg:text-xl tracking-wider px-8">
                  {marqueeText}
                </span>
                <span className="text-brand-gold mx-4">★</span>
              </div>
              <div className="marquee-content animate-marquee flex items-center" aria-hidden="true">
                <span className="text-white font-display text-sm sm:text-base md:text-lg lg:text-xl tracking-wider px-8">
                  {marqueeText}
                </span>
                <span className="text-brand-gold mx-4">★</span>
                <span className="text-white font-display text-sm sm:text-base md:text-lg lg:text-xl tracking-wider px-8">
                  {marqueeText}
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

      {/* MORE FREE SERVICES Button - Below the bar */}
      <style dangerouslySetInnerHTML={{ __html: freeServicesAnimationStyles }} />
      <div className="flex justify-center mt-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className="free-services-btn h-14 sm:h-16 px-8 sm:px-12 text-lg sm:text-xl font-display text-white border-4 transition-transform hover:scale-110 uppercase tracking-wider rounded-xl"
              data-testid="button-free-services-dropdown"
            >
              <Star className="star-icon w-6 h-6 mr-3 fill-brand-gold text-brand-gold" />
              <span className="font-bold">MORE FREE SERVICES</span>
              <Star className="star-icon w-6 h-6 ml-3 fill-brand-gold text-brand-gold" />
              <ChevronDown className="ml-3 h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-96 mx-2 bg-white border-2 border-brand-navy/20 shadow-2xl" align="center">
            {/* RANGER - First and links to registration */}
            <DropdownMenuItem asChild className="cursor-pointer py-4 text-base font-bold text-brand-navy hover:bg-brand-gold/20 hover:text-brand-navy">
              <Link href="/ranger-tab-signup">
                <Star className="w-4 h-4 mr-2 fill-brand-gold text-brand-gold" />
                FREE RANGER Document Software
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Other Free Services */}
            <DropdownMenuItem asChild className="cursor-pointer py-4 text-base font-semibold text-brand-navy hover:bg-brand-blue/10 hover:text-brand-blue">
              <Link href="/apply-website">FREE Business Website</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer py-4 text-base font-semibold text-brand-navy hover:bg-brand-red/10 hover:text-brand-red">
              <Link href="/apply-startup-grant">Apply for Startup Grant</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer py-4 text-base font-semibold text-brand-navy hover:bg-brand-blue/10 hover:text-brand-blue">
              <Link href="/private-doctor">VA Too Slow? Private Doctor</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer py-4 text-base font-semibold text-brand-navy hover:bg-brand-gold/20 hover:text-brand-navy">
              <Link href="/insurance">Save on Insurance</Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Locked AI Services - Bottom */}
            <DropdownMenuItem 
              className="cursor-pointer py-4 text-base font-semibold text-gray-500 hover:bg-gray-100 flex items-center justify-between"
              onClick={handleLockedClick}
            >
              <span className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Generative AI
              </span>
              <span className="text-xs text-gray-400">Partner Only</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer py-4 text-base font-semibold text-gray-500 hover:bg-gray-100 flex items-center justify-between"
              onClick={handleLockedClick}
            >
              <span className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                OPERATOR: AI (Censorless - Private)
              </span>
              <span className="text-xs text-gray-400">Partner Only</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Locked Service Dialog */}
      <Dialog open={showLockedDialog} onOpenChange={setShowLockedDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-display text-brand-navy">
              Partner Service
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-4">
              This is either a paid service or given at no cost to our veteran partners - please contact us to learn more!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Link href="/contact">
              <Button className="bg-brand-red hover:bg-brand-red/90 text-white font-display">
                Contact Us
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

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
