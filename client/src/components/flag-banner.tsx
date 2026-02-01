import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
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
          className="flag-banner relative overflow-hidden rounded-xl shadow-2xl"
          style={{ filter: "url(#flag-wave-filter)" }}
        >
          {/* Multi-layer gradient background for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-red via-brand-navy to-brand-blue" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent flag-shimmer" />
          
          {/* Fabric fold highlights */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-white/40 via-transparent to-white/20" />
            <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-white/20 via-transparent to-white/40" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-10">
            {/* Main Headline */}
            <Link href="/ranger-tab-signup">
              <h2 
                className="text-center text-2xl sm:text-3xl md:text-4xl font-display text-white mb-4 cursor-pointer hover:text-brand-gold transition-colors tracking-wide"
                data-testid="link-ranger-banner"
              >
                <span className="text-brand-gold">All Veterans</span> Get{" "}
                <span className="text-white font-bold">FREE</span>{" "}
                <span className="bg-gradient-to-r from-brand-gold via-yellow-300 to-brand-gold bg-clip-text text-transparent animate-pulse">
                  RANGER
                </span>
                <br className="sm:hidden" />
                <span className="text-white/90 text-xl sm:text-2xl md:text-3xl block sm:inline mt-1 sm:mt-0">
                  : Document Signing Software
                </span>
              </h2>
            </Link>

            {/* Divider */}
            <div className="w-32 sm:w-48 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mb-5" />

            {/* Subtitle */}
            <p className="text-center text-lg sm:text-xl text-white/90 font-display mb-6 tracking-wide">
              There is more! Check back frequently for{" "}
              <span className="text-brand-gold">new free veteran services</span>
            </p>

            {/* Integrated Dropdown */}
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-display bg-brand-gold hover:bg-brand-gold/90 text-brand-navy shadow-lg shadow-black/30 border-2 border-white/30 transition-all hover:scale-105"
                    data-testid="button-free-services-dropdown"
                  >
                    Free Member Services
                    <ChevronDown className="ml-2 h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-80 mx-2 bg-white border-2 border-brand-navy/20 shadow-2xl" align="center">
                  <DropdownMenuItem asChild className="cursor-pointer py-3 text-base font-semibold text-brand-navy hover:bg-brand-red/10 hover:text-brand-red">
                    <Link href="/apply-website">Get Free Business Website</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer py-3 text-base font-semibold text-brand-navy hover:bg-brand-blue/10 hover:text-brand-blue">
                    <Link href="/apply-startup-grant">Apply for Startup Grant</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer py-3 text-base font-semibold text-brand-navy hover:bg-brand-red/10 hover:text-brand-red">
                    <Link href="/private-doctor">VA Too Slow? Private Doctor</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer py-3 text-base font-semibold text-brand-navy hover:bg-brand-blue/10 hover:text-brand-blue">
                    <Link href="/new-home-furniture">New Home Furniture Assistance</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer py-3 text-base font-semibold text-brand-navy hover:bg-brand-gold/20 hover:text-brand-navy border-t border-gray-200">
                    <Link href="/ranger-tab-signup">Apply for RANGER Software</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Corner stars for patriotic flair */}
          <div className="absolute top-3 left-3 text-brand-gold text-xl sm:text-2xl opacity-60">★</div>
          <div className="absolute top-3 right-3 text-brand-gold text-xl sm:text-2xl opacity-60">★</div>
          <div className="absolute bottom-3 left-3 text-brand-gold text-xl sm:text-2xl opacity-60">★</div>
          <div className="absolute bottom-3 right-3 text-brand-gold text-xl sm:text-2xl opacity-60">★</div>
        </div>

        {/* Flag pole shadow effect */}
        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-600 via-gray-400 to-gray-600 rounded-full shadow-lg" />
        <div className="absolute -left-3 top-0 w-3 h-3 bg-brand-gold rounded-full shadow-md" />
        <div className="absolute -left-3 bottom-0 w-3 h-3 bg-brand-gold rounded-full shadow-md" />
      </div>
    </div>
  );
}
