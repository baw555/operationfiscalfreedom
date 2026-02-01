import { Link } from "wouter";
import { ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FlagBanner() {
  const marqueeText = "ALL VETERANS GET FREE JOB TRAINING • FREE DOCUMENT SIGNING SOFTWARE • GENERATE AI • OPERATOR AI THAT DOESN'T CENSOR - WE DON'T STORE - TRACK YOU • SAVE ON INSURANCE • GET WORK • GET PAID FOR REFERRING FELLOW VETERANS AND FAMILY";
  
  return (
    <div className="w-full max-w-6xl mx-auto my-6 sm:my-8 px-4">
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
      <div className="flex justify-center mt-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className="h-14 sm:h-16 px-8 sm:px-12 text-lg sm:text-xl font-display bg-gradient-to-r from-brand-red via-red-600 to-brand-red hover:from-red-700 hover:via-red-600 hover:to-red-700 text-white shadow-2xl shadow-brand-red/40 border-2 border-brand-gold transition-all hover:scale-105 uppercase tracking-wider"
              data-testid="button-free-services-dropdown"
            >
              <Star className="w-5 h-5 mr-2 fill-brand-gold text-brand-gold" />
              MORE FREE SERVICES
              <Star className="w-5 h-5 ml-2 fill-brand-gold text-brand-gold" />
              <ChevronDown className="ml-3 h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-96 mx-2 bg-white border-2 border-brand-navy/20 shadow-2xl" align="center">
            <DropdownMenuItem asChild className="cursor-pointer py-4 text-base font-semibold text-brand-navy hover:bg-brand-red/10 hover:text-brand-red">
              <Link href="/ranger-tab-signup">FREE RANGER Document Software</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer py-4 text-base font-semibold text-brand-navy hover:bg-brand-blue/10 hover:text-brand-blue">
              <Link href="/operator-ai">FREE Operator AI Assistant</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer py-4 text-base font-semibold text-brand-navy hover:bg-brand-red/10 hover:text-brand-red">
              <Link href="/naval-intelligence">FREE Naval Intelligence AI</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer py-4 text-base font-semibold text-brand-navy hover:bg-brand-blue/10 hover:text-brand-blue">
              <Link href="/apply-website">FREE Business Website</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer py-4 text-base font-semibold text-brand-navy hover:bg-brand-red/10 hover:text-brand-red">
              <Link href="/apply-startup-grant">Apply for Startup Grant</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer py-4 text-base font-semibold text-brand-navy hover:bg-brand-blue/10 hover:text-brand-blue">
              <Link href="/private-doctor">VA Too Slow? Private Doctor</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer py-4 text-base font-semibold text-brand-navy hover:bg-brand-gold/20 hover:text-brand-navy border-t border-gray-200">
              <Link href="/insurance">Save on Insurance</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
