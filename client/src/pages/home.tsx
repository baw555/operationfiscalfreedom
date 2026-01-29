import { Layout } from "@/components/layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ArrowRight, Shield, DollarSign, Users, BarChart, Award, Briefcase, Star, Heart, Stethoscope, Sparkles, ChevronDown, Pause, Play } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useMemo } from "react";
import logoStacked from "@assets/NavStar-Stacked_(1)_1767702808393.png";
import { HeroMontage } from "@/components/hero-montage";
import { RangerTabSVG } from "@/components/ranger-tab-svg";

export default function Home() {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [animationPaused, setAnimationPaused] = useState(false);
  const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const [animationImages, setAnimationImages] = useState<{
    heroBg?: string;
    somethingImg?: string;
    someoneImg?: string;
    answerCallImg?: string;
  }>({});

  useEffect(() => {
    Promise.all([
      import("@assets/generated_images/hero_background_veterans.png"),
      import("@assets/Screenshot_2026-01-06_6.59.01_AM_1767701107020.png"),
      import("@assets/Screenshot_2026-01-06_6.57.21_AM_1767701107023.png"),
      import("@assets/Screenshot_2026-01-06_6.55.18_AM_1767701107025.png"),
    ]).then(([heroBg, somethingImg, someoneImg, answerCallImg]) => {
      setAnimationImages({
        heroBg: heroBg.default,
        somethingImg: somethingImg.default,
        someoneImg: someoneImg.default,
        answerCallImg: answerCallImg.default,
      });
    });
  }, []);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
  };

  const runAnimation = () => {
    clearAllTimeouts();
    setAnimationPhase(0);
    setShowContent(false);
    
    const sequence = [
      { phase: 1, delay: 1000 },
      { phase: 2, delay: 5000 },
      { phase: 3, delay: 9000 },
      { phase: 4, delay: 13000 },
      { phase: 5, delay: 17000 },
      { phase: 6, delay: 19000 },
      { phase: 7, delay: 25000 },
    ];

    sequence.forEach(({ phase, delay }) => {
      const timeout = setTimeout(() => {
        setAnimationPhase(phase);
        if (phase === 7) {
          setTimeout(() => setShowContent(true), 500);
        }
      }, delay);
      timeoutsRef.current.push(timeout);
    });
  };

  const toggleAnimation = () => {
    if (animationPaused) {
      runAnimation();
      loopIntervalRef.current = setInterval(() => {
        runAnimation();
      }, 57000);
    } else {
      clearAllTimeouts();
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
      }
      setAnimationPhase(7);
      setShowContent(true);
    }
    setAnimationPaused(!animationPaused);
  };

  useEffect(() => {
    runAnimation();
    loopIntervalRef.current = setInterval(() => {
      runAnimation();
    }, 57000);

    return () => {
      clearAllTimeouts();
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
      }
    };
  }, []);

  return (
    <Layout>
      {/* Animated Hero Intro */}
      {animationPhase < 7 && (
        <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-black">
          {/* Phase 0: Initial black */}
          <div className={cn(
            "absolute inset-0 bg-black transition-opacity duration-1000",
            animationPhase === 0 ? "opacity-100" : "opacity-0"
          )} />

          {/* Phase 1: We can feel it */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-1500",
            animationPhase === 1 ? "opacity-100" : "opacity-0"
          )}>
            <div className="text-center px-4">
              <h1 className={cn(
                "text-5xl sm:text-7xl md:text-9xl text-white tracking-widest transition-all duration-1000 uppercase",
                animationPhase === 1 ? "opacity-100 scale-100" : "opacity-0 scale-90"
              )} style={{ fontFamily: 'var(--font-stencil)', textShadow: '0 0 40px rgba(226, 28, 61, 0.6), 0 4px 20px rgba(0,0,0,0.8)' }}>
                We can feel it
              </h1>
              <h2 className={cn(
                "text-4xl sm:text-6xl md:text-8xl text-brand-red tracking-widest mt-6 transition-all duration-1000 delay-[1500ms] uppercase",
                animationPhase === 1 ? "opacity-100 scale-100" : "opacity-0 scale-90"
              )} style={{ fontFamily: 'var(--font-stencil)', textShadow: '0 0 30px rgba(226, 28, 61, 0.8), 0 4px 15px rgba(0,0,0,0.6)' }}>
                It's coming.
              </h2>
            </div>
          </div>

          {/* Phase 2: Something - Economic Chart */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-1500",
            animationPhase === 2 ? "opacity-100" : "opacity-0"
          )}>
            <div className="absolute inset-0">
              {animationImages.answerCallImg && (
                <img 
                  src={animationImages.answerCallImg}
                  alt="Economic challenges"
                  loading="eager" 
                  className={cn(
                    "w-full h-full object-contain sm:object-cover transition-all duration-1000",
                    animationPhase === 2 ? "opacity-60 scale-105" : "opacity-0 scale-100"
                  )}
                />
              )}
              <div className="absolute inset-0 bg-black/50" />
            </div>
            <h1 className={cn(
              "relative z-10 text-5xl sm:text-7xl md:text-9xl text-white tracking-widest transition-all duration-1000 uppercase",
              animationPhase === 2 ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )} style={{ fontFamily: 'var(--font-stencil)', textShadow: '0 0 40px rgba(226, 28, 61, 0.6), 0 4px 20px rgba(0,0,0,0.8)' }}>
              Something...
            </h1>
          </div>

          {/* Phase 3: Someone - Soldiers Marching Video */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-1500",
            animationPhase === 3 ? "opacity-100" : "opacity-0"
          )}>
            <div className="absolute inset-0">
              <video 
                src="/videos/soldiers-action.mp4"
                autoPlay
                loop
                muted
                playsInline
                className={cn(
                  "w-full h-full object-cover transition-all duration-1000",
                  animationPhase === 3 ? "opacity-60 scale-105" : "opacity-0 scale-100"
                )}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
            <h1 className={cn(
              "relative z-10 text-5xl sm:text-7xl md:text-9xl text-white tracking-widest transition-all duration-1000 uppercase",
              animationPhase === 3 ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )} style={{ fontFamily: 'var(--font-stencil)', textShadow: '0 0 40px rgba(226, 28, 61, 0.6), 0 4px 20px rgba(0,0,0,0.8)' }}>
              Someone...
            </h1>
          </div>

          {/* Phase 4: Will you be ready - Soldier Sitting Video */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-1500",
            animationPhase === 4 ? "opacity-100" : "opacity-0"
          )}>
            <div className="absolute inset-0">
              <video 
                src="/videos/soldier-sitting.mp4"
                autoPlay
                loop
                muted
                playsInline
                className={cn(
                  "w-full h-full object-cover transition-all duration-1000",
                  animationPhase === 4 ? "opacity-60 scale-105" : "opacity-0 scale-100"
                )}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
            <h1 className={cn(
              "relative z-10 text-3xl sm:text-5xl md:text-7xl text-white tracking-widest text-center px-4 transition-all duration-1000 uppercase",
              animationPhase === 4 ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )} style={{ fontFamily: 'var(--font-stencil)', textShadow: '0 0 40px rgba(226, 28, 61, 0.6), 0 4px 20px rgba(0,0,0,0.8)' }}>
              Will You Be Ready<br />To Answer The Call?
            </h1>
          </div>

          {/* Phase 5: Fade to black */}
          <div className={cn(
            "absolute inset-0 bg-black transition-opacity duration-1500",
            animationPhase === 5 ? "opacity-100" : "opacity-0"
          )} />

          {/* Phase 6: This time it isn't for God and Country */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center bg-black transition-all duration-[2000ms] ease-in-out",
            animationPhase === 6 ? "opacity-100" : "opacity-0"
          )}>
            <div className="text-center px-4 max-w-4xl">
              <h1 className={cn(
                "text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-red tracking-widest leading-tight transition-all duration-[1500ms] ease-out uppercase",
                animationPhase === 6 ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )} style={{ fontFamily: 'var(--font-stencil)', textShadow: '0 0 30px rgba(226, 28, 61, 0.8), 0 4px 15px rgba(0,0,0,0.6)' }}>
                This time it isn't for "God and Country."
              </h1>
              <h2 className={cn(
                "text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-widest mt-4 transition-all duration-[1500ms] delay-700 ease-out uppercase",
                animationPhase === 6 ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )} style={{ fontFamily: 'var(--font-stencil)', textShadow: '0 0 40px rgba(255, 255, 255, 0.4), 0 4px 20px rgba(0,0,0,0.8)' }}>
                It's for you, your family
              </h2>
              <h3 className={cn(
                "text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-blue tracking-widest mt-4 transition-all duration-[1500ms] delay-[1400ms] ease-out uppercase",
                animationPhase === 6 ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )} style={{ fontFamily: 'var(--font-stencil)', textShadow: '0 0 30px rgba(37, 99, 235, 0.6), 0 4px 15px rgba(0,0,0,0.6)' }}>
                and each other.
              </h3>
            </div>
          </div>

          {/* Skip Animation Button - Positioned at bottom of animation section */}
          <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex justify-center z-[100] px-4">
            <Button 
              onClick={toggleAnimation}
              variant="outline"
              className="border-2 border-white/60 text-white hover:bg-white/20 text-sm sm:text-base px-6 py-3 backdrop-blur-sm bg-black/40 shadow-lg"
            >
              <Pause className="w-4 h-4 mr-2" />
              Skip to Main
            </Button>
          </div>
        </section>
      )}

      {/* Main Hero Section - After Animation */}
      {animationPhase >= 7 && (
        <section className={cn(
          "relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-navy transition-opacity duration-1000",
          showContent ? "opacity-100" : "opacity-0"
        )}>
          <HeroMontage />

          <div className="container relative z-10 px-3 sm:px-4 py-10 sm:py-20 text-center max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display text-white mb-1 sm:mb-2 leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              GEAR UP
              <br />
              <span className="text-brand-red text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">in 2026 and Beyond</span>
            </h1>

            {/* Ranger Tab Banner */}
            <div className="w-full max-w-4xl mx-auto my-6 sm:my-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
              <div className="relative bg-gradient-to-r from-brand-navy/80 via-brand-blue/60 to-brand-navy/80 backdrop-blur-sm border border-brand-gold/30 rounded-xl px-4 sm:px-8 py-4 sm:py-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent animate-pulse"></div>
                <p className="text-center text-lg sm:text-2xl md:text-3xl relative z-10 text-white font-display">
                  Get your Ranger Tab and ask how you can get no-cost contract mgmt & signature for your business
                </p>
                <div className="text-center mt-3">
                  <a
                    href="/ranger-tab-signup"
                    data-testid="link-ranger-tab-signup"
                  >
                    <RangerTabSVG size="lg" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              <div className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-brand-red text-white shadow-lg shadow-brand-red/30">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                <span className="font-display text-xl sm:text-2xl md:text-3xl tracking-wider">NAVIGATOR USA ELITE</span>
                <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              </div>
              <p className="text-white/90 font-display text-sm sm:text-lg md:text-xl tracking-widest mt-2 uppercase shimmer-text">Navy SEAL Operated</p>
            </div>
            
            {/* Four Pillars */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-brand-red flex items-center justify-center mb-2 shadow-lg shadow-brand-red/30">
                  <DollarSign className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
                </div>
                <span className="text-brand-red font-display text-lg sm:text-2xl md:text-3xl">Financial</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white flex items-center justify-center mb-2 shadow-lg shadow-white/30">
                  <Shield className="w-7 h-7 sm:w-9 sm:h-9 text-brand-navy" />
                </div>
                <span className="text-white font-display text-lg sm:text-2xl md:text-3xl">Mental</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-brand-blue flex items-center justify-center mb-2 shadow-lg shadow-brand-blue/30">
                  <Heart className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
                </div>
                <span className="text-brand-blue font-display text-lg sm:text-2xl md:text-3xl">Physical</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-brand-gold flex items-center justify-center mb-2 shadow-lg shadow-brand-gold/30">
                  <Sparkles className="w-7 h-7 sm:w-9 sm:h-9 text-brand-navy" />
                </div>
                <span className="text-brand-gold font-display text-lg sm:text-2xl md:text-3xl">Faith</span>
              </div>
            </div>

            {/* Animation Toggle Button */}
            <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-350">
              <Button 
                onClick={toggleAnimation}
                variant="outline"
                className="border-2 border-white/40 text-white hover:bg-white/10 text-sm px-4 py-2"
              >
                {animationPaused ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Play Animation
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Animation
                  </>
                )}
              </Button>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 w-full max-w-xl mx-auto px-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full h-14 sm:h-16 text-lg sm:text-xl font-display bg-brand-red hover:bg-brand-red/90 text-white shadow-lg shadow-brand-red/30 border-2 border-white/20">
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
                </DropdownMenuContent>
              </DropdownMenu>
              <p className="text-gray-300 text-xs sm:text-sm mt-4 text-center">
                Click above to access all free member services
              </p>
            </div>
          </div>
        </section>
      )}

      {/* What We Do - PATRIOTIC */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-brand-navy mb-3 sm:mb-4">Mission Objectives</h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-brand-red via-white to-brand-navy mx-auto mb-4 sm:mb-6" />
            <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              We provide a comprehensive ecosystem designed to lift veteran families up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            <Card className="bg-brand-red border-none hover:shadow-2xl transition-all shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6 text-center">
                <div className="w-14 h-14 sm:w-18 sm:h-18 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Shield size={28} className="sm:w-9 sm:h-9 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-white mb-2 sm:mb-3">VA Claims Support</h3>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed">Understand the system, appeal denied claims, and may help you understand your potential benefits.</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-2 border-brand-navy/20 hover:shadow-2xl transition-all shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6 text-center">
                <div className="w-14 h-14 sm:w-18 sm:h-18 bg-brand-navy/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Briefcase size={28} className="sm:w-9 sm:h-9 text-brand-navy" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-2 sm:mb-3">Fin-Ops Opportunities</h3>
                <p className="text-sm sm:text-base text-brand-navy/70 leading-relaxed">Access flexible, remote or local Financial Operations opportunities tailored for veteran skillsets.</p>
              </CardContent>
            </Card>
            <Card className="bg-brand-navy border-none hover:shadow-2xl transition-all shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6 text-center">
                <div className="w-14 h-14 sm:w-18 sm:h-18 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <DollarSign size={28} className="sm:w-9 sm:h-9 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-white mb-2 sm:mb-3">Income Streams</h3>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed">Build multiple revenue streams through referrals and veteran-owned business connections.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why We Exist - INTENSE */}
      <section className="py-12 sm:py-20 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-brand-red/20 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-blue/20 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl mb-4 sm:mb-6">Why NavigatorUSA Exists</h2>
              <div className="w-16 h-1 bg-brand-red mb-6" />
              <div className="space-y-4 sm:space-y-6">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-brand-red flex items-center justify-center shrink-0 shadow-lg">
                    <Users className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 text-white">No Veteran Family Left Behind</h4>
                    <p className="text-sm sm:text-base text-gray-300">Because no veteran family should ever battle alone. The system is complex, but we make it navigable.</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-brand-blue flex items-center justify-center shrink-0 shadow-lg">
                    <BarChart className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 text-white">Financial Freedom</h4>
                    <p className="text-sm sm:text-base text-gray-300">We help you build pathways.</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-brand-blue flex items-center justify-center shrink-0 shadow-lg">
                    <Award className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 text-white">Continued Service</h4>
                    <p className="text-sm sm:text-base text-gray-300">Your service built this country — now it's our turn to serve you and your family.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-6 sm:p-8 rounded-xl border-2 border-brand-red/30 backdrop-blur-sm shadow-2xl">
              <div className="text-center space-y-4 sm:space-y-6">
                <h3 className="text-2xl sm:text-3xl font-display text-white">Join The Ranks</h3>
                <Link href="/join" className={cn(buttonVariants(), "w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold h-12 sm:h-14 text-lg cursor-pointer shadow-lg shadow-brand-red/30")}>
                    Get Started Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fin-Ops Callout - INTENSE */}
      <section className="py-12 sm:py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border-2 border-brand-navy/10">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 sm:p-12 flex flex-col justify-center order-2 md:order-1">
                <div className="inline-block px-3 py-1.5 rounded bg-brand-red text-white font-bold text-xs uppercase tracking-wider mb-3 sm:mb-4 w-fit">
                  Immediate Income
                </div>
                <h2 className="text-2xl sm:text-4xl font-display text-brand-navy mb-4 sm:mb-6">Fin-Ops For Veterans</h2>
                <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8">
                  Earn real money today. Flexible, remote, or local opportunities for every skill level. 
                  From sales and marketing to construction and logistics.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <li className="flex items-center gap-2 text-brand-navy font-medium text-sm sm:text-base">
                    <Check className="text-brand-red h-5 w-5 sm:h-6 sm:w-6" /> Flexible Schedule
                  </li>
                  <li className="flex items-center gap-2 text-brand-navy font-medium text-sm sm:text-base">
                    <Check className="text-brand-red h-5 w-5 sm:h-6 sm:w-6" /> Remote Options
                  </li>
                  <li className="flex items-center gap-2 text-brand-navy font-medium text-sm sm:text-base">
                    <Check className="text-brand-red h-5 w-5 sm:h-6 sm:w-6" /> Veteran-Preferred Hiring
                  </li>
                </ul>
                <Link href="/fin-ops" className={cn(buttonVariants(), "bg-brand-navy hover:bg-brand-navy/90 text-white self-start px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base cursor-pointer font-bold shadow-lg")}>
                    Start Earning <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="bg-brand-navy relative h-48 sm:h-64 md:h-auto order-1 md:order-2">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/40 via-brand-navy to-brand-blue/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Briefcase className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 opacity-80" />
                    <p className="font-display text-2xl sm:text-3xl">Work Your Way</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - INTENSE */}
      <section className="py-12 sm:py-24 bg-brand-red text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red via-brand-red to-brand-navy/30" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-display mb-4 sm:mb-6 drop-shadow-lg">Ready To Take Command?</h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-10 max-w-2xl mx-auto text-white/95 px-2">
            Find Fin-Ops opportunities and start building your family's future today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Link href="/income" className={cn(buttonVariants({ size: "lg" }), "bg-white text-brand-red hover:bg-gray-100 font-bold px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-lg cursor-pointer w-full sm:w-auto shadow-lg")}>
                Start Building Income
            </Link>
            <Link href="/get-help" className={cn(buttonVariants({ size: "lg" }), "bg-brand-navy hover:bg-brand-navy/90 text-white font-bold px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-lg cursor-pointer w-full sm:w-auto shadow-lg border-2 border-white/20")}>
                Get VA Claims Help
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
