import { Link } from "wouter";
import { ChevronDown, Shield, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FlagBanner() {
  return (
    <div className="w-full max-w-4xl mx-auto my-6 sm:my-8 px-4">
      {/* SVG Filter Definition for Wave Effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="flag-wave-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.003"
              numOctaves="2"
              seed="1"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="8s"
                values="0.01 0.003;0.015 0.005;0.01 0.003"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
            >
              <animate
                attributeName="scale"
                dur="4s"
                values="8;15;8"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>

      {/* Main Flag Container */}
      <div className="flag-banner-container relative">
        {/* Animated Flag Banner */}
        <div 
          className="flag-banner relative overflow-hidden rounded-none shadow-2xl border-4 border-brand-gold"
          style={{ filter: "url(#flag-wave-filter)" }}
        >
          {/* Military camo-inspired gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a1a] via-brand-navy to-[#0d1b2a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent flag-shimmer" />
          
          {/* Military insignia pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,215,0,0.1) 10px, rgba(255,215,0,0.1) 20px)`
          }} />
          
          {/* Top military rank bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-red via-brand-gold to-brand-red" />
          
          {/* Bottom military rank bar */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-red via-brand-gold to-brand-red" />

          {/* Content */}
          <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-12">
            {/* Military shield emblem */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-brand-gold drop-shadow-lg" fill="rgba(234, 179, 8, 0.2)" />
                <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-white" fill="white" />
              </div>
            </div>

            {/* Main Headline with military stencil styling */}
            <Link href="/ranger-tab-signup">
              <h2 
                className="text-center text-2xl sm:text-3xl md:text-4xl font-display text-white mb-3 cursor-pointer hover:text-brand-gold transition-colors tracking-[0.15em] uppercase"
                data-testid="link-ranger-banner"
                style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.5), -1px -1px 0 rgba(0,0,0,0.3)' }}
              >
                <span className="text-brand-gold">★ All Veterans ★</span>
                <br />
                <span className="text-white font-bold">GET FREE</span>{" "}
                <span className="inline-block bg-brand-gold text-brand-navy px-3 py-1 rounded-sm shadow-lg transform -skew-x-3">
                  RANGER
                </span>
              </h2>
            </Link>
            
            <p className="text-center text-lg sm:text-xl text-white/80 font-display tracking-wider mb-4">
              Document Signing Software
            </p>

            {/* Military-style divider with stars */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-transparent to-brand-gold" />
              <Award className="w-6 h-6 text-brand-gold" />
              <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-l from-transparent to-brand-gold" />
            </div>

            {/* Subtitle with military briefing style */}
            <div className="bg-black/40 border-l-4 border-brand-gold px-4 py-3 mb-6 mx-auto max-w-lg">
              <p className="text-center text-base sm:text-lg text-brand-gold font-display tracking-wide uppercase">
                ⚡ Intel Brief ⚡
              </p>
              <p className="text-center text-sm sm:text-base text-white/90 font-display">
                There is more! Check back frequently for{" "}
                <span className="text-brand-gold font-bold">new free veteran services</span>
              </p>
            </div>

            {/* Military-styled Dropdown Button */}
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-lg font-display bg-gradient-to-b from-[#4a5d23] to-[#2d3a14] hover:from-[#5a6d33] hover:to-[#3d4a24] text-white shadow-lg border-2 border-brand-gold/50 transition-all hover:scale-105 uppercase tracking-wider rounded-none"
                    style={{ 
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.4)'
                    }}
                    data-testid="button-free-services-dropdown"
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    Access Free Services
                    <ChevronDown className="ml-2 h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-80 mx-2 bg-[#1a2a1a] border-2 border-brand-gold/50 shadow-2xl rounded-none" align="center">
                  <DropdownMenuItem asChild className="cursor-pointer py-3 text-base font-semibold text-white hover:bg-brand-gold/20 hover:text-brand-gold border-b border-brand-gold/20">
                    <Link href="/apply-website" className="flex items-center gap-2">
                      <span className="text-brand-gold">▸</span> Get Free Business Website
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer py-3 text-base font-semibold text-white hover:bg-brand-gold/20 hover:text-brand-gold border-b border-brand-gold/20">
                    <Link href="/apply-startup-grant" className="flex items-center gap-2">
                      <span className="text-brand-gold">▸</span> Apply for Startup Grant
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer py-3 text-base font-semibold text-white hover:bg-brand-gold/20 hover:text-brand-gold border-b border-brand-gold/20">
                    <Link href="/private-doctor" className="flex items-center gap-2">
                      <span className="text-brand-gold">▸</span> VA Too Slow? Private Doctor
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer py-3 text-base font-semibold text-white hover:bg-brand-gold/20 hover:text-brand-gold border-b border-brand-gold/20">
                    <Link href="/new-home-furniture" className="flex items-center gap-2">
                      <span className="text-brand-gold">▸</span> New Home Furniture Assistance
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer py-3 text-base font-semibold text-brand-gold hover:bg-brand-red/20 hover:text-white">
                    <Link href="/ranger-tab-signup" className="flex items-center gap-2">
                      <span className="text-brand-red">★</span> Apply for RANGER Software
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Corner military rank insignias */}
          <div className="absolute top-4 left-4 flex gap-1">
            <div className="w-2 h-6 bg-brand-gold rounded-sm" />
            <div className="w-2 h-6 bg-brand-gold rounded-sm" />
            <div className="w-2 h-6 bg-brand-gold rounded-sm" />
          </div>
          <div className="absolute top-4 right-4 flex gap-1">
            <div className="w-2 h-6 bg-brand-gold rounded-sm" />
            <div className="w-2 h-6 bg-brand-gold rounded-sm" />
            <div className="w-2 h-6 bg-brand-gold rounded-sm" />
          </div>
          <div className="absolute bottom-4 left-4 text-brand-gold text-2xl font-bold opacity-60">★★★</div>
          <div className="absolute bottom-4 right-4 text-brand-gold text-2xl font-bold opacity-60">★★★</div>
        </div>

        {/* Flag pole with military styling */}
        <div className="absolute -left-3 top-0 bottom-0 w-2 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-500 rounded-full shadow-lg" />
        <div className="absolute -left-4 -top-2 w-5 h-5 bg-brand-gold rounded-full shadow-md border-2 border-yellow-600" />
        <div className="absolute -left-4 -bottom-2 w-5 h-5 bg-brand-gold rounded-full shadow-md border-2 border-yellow-600" />
      </div>
    </div>
  );
}
