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
      {/* SVG Filter Definitions for Multi-Layer Wave Effects */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* Primary wave - slow, large undulation */}
          <filter id="flag-wave-primary" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.002"
              numOctaves="3"
              seed="1"
              result="noise1"
            >
              <animate
                attributeName="baseFrequency"
                dur="12s"
                values="0.008 0.002;0.012 0.004;0.008 0.002"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise1"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
            >
              <animate
                attributeName="scale"
                dur="6s"
                values="12;22;12"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>

          {/* Secondary wave - faster, smaller ripples */}
          <filter id="flag-wave-secondary" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.005"
              numOctaves="2"
              seed="42"
              result="noise2"
            >
              <animate
                attributeName="baseFrequency"
                dur="8s"
                values="0.015 0.005;0.02 0.008;0.015 0.005"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise2"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="B"
            >
              <animate
                attributeName="scale"
                dur="4s"
                values="6;12;6"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>

          {/* Tertiary wave - quick micro-ripples */}
          <filter id="flag-wave-tertiary" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.025 0.01"
              numOctaves="1"
              seed="99"
              result="noise3"
            >
              <animate
                attributeName="baseFrequency"
                dur="5s"
                values="0.025 0.01;0.035 0.015;0.025 0.01"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise3"
              scale="4"
              xChannelSelector="G"
              yChannelSelector="R"
            >
              <animate
                attributeName="scale"
                dur="3s"
                values="3;6;3"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>

      {/* Main Flag Container with 3D perspective */}
      <div className="flag-container-3d relative">
        {/* Layer 1: Background fabric layer (deepest, most transparent) */}
        <div 
          className="flag-layer flag-layer-back absolute inset-0 rounded-xl opacity-40"
          style={{ filter: "url(#flag-wave-primary)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-blue to-brand-red rounded-xl" />
        </div>

        {/* Layer 2: Middle fabric layer */}
        <div 
          className="flag-layer flag-layer-mid absolute inset-0 rounded-xl opacity-60"
          style={{ filter: "url(#flag-wave-secondary)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-red/80 via-white/20 to-brand-navy/80 rounded-xl" />
        </div>

        {/* Layer 3: Main visible flag with content */}
        <div 
          className="flag-layer flag-layer-front relative rounded-xl shadow-2xl overflow-hidden"
          style={{ filter: "url(#flag-wave-tertiary)" }}
        >
          {/* Base gradient - semi-transparent */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-red/85 via-brand-navy/90 to-brand-blue/85 rounded-xl" />
          
          {/* Animated fold highlights - sweep across */}
          <div className="flag-fold-highlight absolute inset-0 opacity-50" />
          <div className="flag-fold-highlight-2 absolute inset-0 opacity-30" />
          
          {/* Crease shadow lines */}
          <div className="flag-crease absolute inset-0 opacity-20">
            <div className="absolute top-0 left-[20%] w-[2px] h-full bg-gradient-to-b from-black/40 via-transparent to-black/30 flag-crease-1" />
            <div className="absolute top-0 left-[45%] w-[1px] h-full bg-gradient-to-b from-transparent via-black/30 to-transparent flag-crease-2" />
            <div className="absolute top-0 left-[70%] w-[2px] h-full bg-gradient-to-b from-black/30 via-transparent to-black/40 flag-crease-3" />
          </div>

          {/* Light catching on fabric folds */}
          <div className="flag-light-catch absolute inset-0">
            <div className="absolute top-0 left-[15%] w-[3px] h-full bg-gradient-to-b from-white/40 via-transparent to-white/20 flag-light-1" />
            <div className="absolute top-0 left-[50%] w-[2px] h-full bg-gradient-to-b from-transparent via-white/30 to-transparent flag-light-2" />
            <div className="absolute top-0 left-[80%] w-[3px] h-full bg-gradient-to-b from-white/20 via-transparent to-white/40 flag-light-3" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-10">
            {/* Main Headline */}
            <Link href="/ranger-tab-signup">
              <h2 
                className="text-center text-2xl sm:text-3xl md:text-4xl font-display text-white mb-4 cursor-pointer hover:text-brand-gold transition-colors tracking-wide drop-shadow-lg"
                data-testid="link-ranger-banner"
              >
                <span className="text-brand-gold drop-shadow-md">All Veterans</span> Get{" "}
                <span className="text-white font-bold">FREE</span>{" "}
                <span className="bg-gradient-to-r from-brand-gold via-yellow-300 to-brand-gold bg-clip-text text-transparent animate-pulse drop-shadow-md">
                  RANGER
                </span>
                <br className="sm:hidden" />
                <span className="text-white/95 text-xl sm:text-2xl md:text-3xl block sm:inline mt-1 sm:mt-0 drop-shadow-md">
                  : Document Signing Software
                </span>
              </h2>
            </Link>

            {/* Divider with animation */}
            <div className="w-32 sm:w-48 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mb-5 flag-divider-pulse" />

            {/* Subtitle */}
            <p className="text-center text-lg sm:text-xl text-white/95 font-display mb-6 tracking-wide drop-shadow-md">
              There is more! Check back frequently for{" "}
              <span className="text-brand-gold">new free veteran services</span>
            </p>

            {/* Integrated Dropdown */}
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-display bg-brand-gold hover:bg-brand-gold/90 text-brand-navy shadow-lg shadow-black/40 border-2 border-white/40 transition-all hover:scale-105"
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

          {/* Corner stars */}
          <div className="absolute top-3 left-3 text-brand-gold text-xl sm:text-2xl opacity-70 drop-shadow-md">★</div>
          <div className="absolute top-3 right-3 text-brand-gold text-xl sm:text-2xl opacity-70 drop-shadow-md">★</div>
          <div className="absolute bottom-3 left-3 text-brand-gold text-xl sm:text-2xl opacity-70 drop-shadow-md">★</div>
          <div className="absolute bottom-3 right-3 text-brand-gold text-xl sm:text-2xl opacity-70 drop-shadow-md">★</div>
        </div>

        {/* Flag pole with rings */}
        <div className="absolute -left-3 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-600 via-amber-500 to-amber-700 rounded-full shadow-lg flag-pole" />
        <div className="absolute -left-4 top-[-4px] w-4 h-4 bg-gradient-to-br from-brand-gold via-yellow-400 to-amber-600 rounded-full shadow-md border border-amber-700" />
        <div className="absolute -left-4 bottom-[-4px] w-4 h-4 bg-gradient-to-br from-brand-gold via-yellow-400 to-amber-600 rounded-full shadow-md border border-amber-700" />
        {/* Pole rings */}
        <div className="absolute -left-3.5 top-[25%] w-3 h-1.5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 rounded-full" />
        <div className="absolute -left-3.5 top-[50%] w-3 h-1.5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 rounded-full" />
        <div className="absolute -left-3.5 top-[75%] w-3 h-1.5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 rounded-full" />
      </div>
    </div>
  );
}
