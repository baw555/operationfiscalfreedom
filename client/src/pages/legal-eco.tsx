import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Scale, FileText, Shield, Briefcase, Users, Phone, ArrowRight, ExternalLink, Zap, Globe, Award, CheckCircle2, Building2, Gavel, Star, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import legalNetworkHero from "@/assets/legal-network-hero.png";

const practiceAreas = [
  { name: "Personal Injury", icon: Shield },
  { name: "Motor Vehicle Accidents", icon: Briefcase },
  { name: "Medical Malpractice", icon: FileText },
  { name: "Workers Compensation", icon: Users },
  { name: "Mass Tort Litigation", icon: Gavel },
  { name: "Estate Planning", icon: Building2 },
  { name: "Tax Law", icon: Scale },
  { name: "Immigration Law", icon: Globe },
  { name: "Family Law", icon: Users },
  { name: "Criminal Defense", icon: Shield },
  { name: "Employment Law", icon: Briefcase },
  { name: "Real Estate", icon: Building2 },
];

const stats = [
  { value: "300+", label: "Elite Law Firms", icon: Building2 },
  { value: "50", label: "States Covered", icon: Globe },
  { value: "100+", label: "Practice Areas", icon: Gavel },
  { value: "24/7", label: "Availability", icon: Zap },
];

function KatanaIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'home' | 'slash' | 'split' | 'done'>('home');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('slash'), 1500);
    const timer2 = setTimeout(() => setPhase('split'), 2200);
    const timer3 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      <style>{`
        @keyframes katanaSwing {
          0% { 
            transform: translate(-50%, -120%) rotate(-60deg);
            opacity: 0;
          }
          10% { opacity: 1; }
          100% { 
            transform: translate(-50%, 120vh) rotate(-60deg);
            opacity: 1;
          }
        }
        @keyframes slashLine {
          0% { 
            height: 0;
            opacity: 1;
          }
          100% { 
            height: 200vh;
            opacity: 1;
          }
        }
        @keyframes leftFall {
          0% { 
            transform: translateX(0) rotate(0deg) translateZ(0);
            opacity: 1;
          }
          100% { 
            transform: translateX(-120%) rotate(-20deg) translateZ(-100px);
            opacity: 0;
          }
        }
        @keyframes rightFall {
          0% { 
            transform: translateX(0) rotate(0deg) translateZ(0);
            opacity: 1;
          }
          100% { 
            transform: translateX(120%) rotate(20deg) translateZ(-100px);
            opacity: 0;
          }
        }
        @keyframes sparkBurst {
          0% { 
            opacity: 1;
            transform: scale(0) translate(0, 0);
          }
          100% { 
            opacity: 0;
            transform: scale(1) translate(var(--tx), var(--ty));
          }
        }
        @keyframes flashBang {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }
      `}</style>

      {phase === 'home' && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-slate-800 to-brand-navy">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNDQ1NSIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-5xl sm:text-7xl font-display text-white mb-4 tracking-tight">
                <span className="text-brand-red">NAVIGATOR</span>
                <span className="font-light">USA</span>
              </h1>
              <p className="text-xl text-gray-300">Veterans' Family Resources</p>
              <div className="mt-8 flex justify-center gap-4">
                <div className="w-32 h-12 bg-brand-red/20 rounded-lg animate-pulse" />
                <div className="w-32 h-12 bg-blue-500/20 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {(phase === 'slash' || phase === 'split') && (
        <>
          <div 
            className="absolute inset-0 bg-gradient-to-br from-brand-navy via-slate-800 to-brand-navy"
            style={{
              clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
              animation: phase === 'split' ? 'leftFall 1s ease-in forwards' : 'none',
              transformOrigin: 'top center',
            }}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNDQ1NSIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-5xl sm:text-7xl font-display text-white mb-4 tracking-tight">
                  <span className="text-brand-red">NAVIGATOR</span>
                  <span className="font-light">USA</span>
                </h1>
                <p className="text-xl text-gray-300">Veterans' Family Resources</p>
              </div>
            </div>
          </div>

          <div 
            className="absolute inset-0 bg-gradient-to-br from-brand-navy via-slate-800 to-brand-navy"
            style={{
              clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
              animation: phase === 'split' ? 'rightFall 1s ease-in forwards' : 'none',
              transformOrigin: 'top center',
            }}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNDQ1NSIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-5xl sm:text-7xl font-display text-white mb-4 tracking-tight">
                  <span className="text-brand-red">NAVIGATOR</span>
                  <span className="font-light">USA</span>
                </h1>
                <p className="text-xl text-gray-300">Veterans' Family Resources</p>
              </div>
            </div>
          </div>

          {phase === 'slash' && (
            <>
              <div 
                className="absolute left-1/2 top-0 w-2"
                style={{
                  marginLeft: '-1px',
                  animation: 'slashLine 0.5s ease-out forwards',
                  background: 'linear-gradient(180deg, transparent 0%, #fff 10%, #64b5f6 50%, #fff 90%, transparent 100%)',
                  boxShadow: '0 0 40px 15px rgba(255,255,255,0.9), 0 0 80px 30px rgba(100,181,246,0.6)',
                }}
              />
              <svg 
                className="absolute"
                width="300" 
                height="80" 
                viewBox="0 0 300 80"
                style={{
                  left: '50%',
                  top: '0',
                  marginLeft: '-150px',
                  animation: 'katanaSwing 0.6s ease-out forwards',
                  filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.9)) drop-shadow(0 0 40px rgba(100,181,246,0.8))',
                }}
              >
                <defs>
                  <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1a1a2e" />
                    <stop offset="20%" stopColor="#e0e0e0" />
                    <stop offset="40%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#64b5f6" />
                    <stop offset="60%" stopColor="#ffffff" />
                    <stop offset="80%" stopColor="#e0e0e0" />
                    <stop offset="100%" stopColor="#c0c0c0" />
                  </linearGradient>
                  <linearGradient id="handleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2d2d2d" />
                    <stop offset="50%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#2d2d2d" />
                  </linearGradient>
                </defs>
                <rect x="70" y="35" width="230" height="10" rx="1" fill="url(#bladeGradient)" />
                <polygon points="300,35 300,45 310,40" fill="url(#bladeGradient)" />
                <rect x="60" y="30" width="15" height="20" rx="2" fill="#8B4513" />
                <rect x="55" y="32" width="8" height="16" rx="1" fill="#654321" />
                <ellipse cx="68" cy="40" rx="3" ry="10" fill="#FFD700" />
                <rect x="5" y="33" width="55" height="14" rx="3" fill="url(#handleGradient)" />
                <line x1="15" y1="33" x2="15" y2="47" stroke="#444" strokeWidth="1" />
                <line x1="25" y1="33" x2="25" y2="47" stroke="#444" strokeWidth="1" />
                <line x1="35" y1="33" x2="35" y2="47" stroke="#444" strokeWidth="1" />
                <line x1="45" y1="33" x2="45" y2="47" stroke="#444" strokeWidth="1" />
                <rect x="70" y="38" width="200" height="2" fill="rgba(255,255,255,0.6)" />
              </svg>
              <div 
                className="absolute inset-0 bg-white"
                style={{
                  animation: 'flashBang 0.3s ease-out forwards',
                  pointerEvents: 'none',
                }}
              />
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-white rounded-full"
                  style={{
                    left: '50%',
                    top: `${20 + i * 4}%`,
                    '--tx': `${(Math.random() - 0.5) * 200}px`,
                    '--ty': `${(Math.random() - 0.5) * 100}px`,
                    animation: `sparkBurst 0.8s ease-out ${i * 0.03}s forwards`,
                    boxShadow: '0 0 15px 8px rgba(255,255,255,0.9), 0 0 30px 15px rgba(100,181,246,0.6)',
                  } as React.CSSProperties}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function LegalEco() {
  const [isHovered, setIsHovered] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    if (introComplete) {
      setTimeout(() => setShowContent(true), 100);
    }
  }, [introComplete]);

  return (
    <Layout>
      {!introComplete && <KatanaIntro onComplete={() => setIntroComplete(true)} />}
      
      <div className={`min-h-screen bg-black relative overflow-hidden transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <style>{`
          @keyframes swordShine {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes glisten {
            0%, 100% { filter: brightness(1) drop-shadow(0 0 5px rgba(100, 200, 255, 0.3)); }
            50% { filter: brightness(1.3) drop-shadow(0 0 20px rgba(100, 200, 255, 0.8)); }
          }
          @keyframes sparkleText {
            0%, 100% { text-shadow: 0 0 5px rgba(255,255,255,0.5), 0 0 10px rgba(100,200,255,0.3); }
            25% { text-shadow: 0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(100,200,255,0.6), 0 0 45px rgba(100,200,255,0.4); }
            50% { text-shadow: 0 0 5px rgba(255,255,255,0.5), 0 0 10px rgba(100,200,255,0.3); }
            75% { text-shadow: 0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(100,200,255,0.7), 0 0 60px rgba(100,200,255,0.5); }
          }
          .sword-text {
            background: linear-gradient(
              90deg,
              #ffffff 0%,
              #64b5f6 15%,
              #ffffff 30%,
              #90caf9 45%,
              #ffffff 50%,
              #64b5f6 55%,
              #ffffff 70%,
              #90caf9 85%,
              #ffffff 100%
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: swordShine 3s linear infinite, glisten 2s ease-in-out infinite;
          }
        `}</style>

        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(59, 130, 246, 0.03) 50px, rgba(59, 130, 246, 0.03) 51px),
                             repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(59, 130, 246, 0.03) 50px, rgba(59, 130, 246, 0.03) 51px)`
          }} />
        </div>

        <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium tracking-wider uppercase">Powered by 33CC</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display mb-4 tracking-tight">
              <span className="sword-text">LEGAL ECO</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white font-display mb-4" style={{ animation: 'sparkleText 4s ease-in-out infinite' }}>
              Cut Through The Non-Sense & Get The Best of the Best!
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-6" />
            <p className="text-xl text-blue-200/80 max-w-3xl mx-auto leading-relaxed">
              Access the nation's most elite network of <span className="text-white font-semibold">300+ top-tier law firms</span> across every practice area. 
              There is no attorney we cannot introduce you to.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                <div className="relative bg-slate-900/80 border border-blue-500/30 rounded-xl p-6 text-center hover:border-blue-400/60 transition-all backdrop-blur-sm">
                  <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-blue-300/80 text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <div 
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur-lg transition-all duration-500 ${isHovered ? 'opacity-60' : 'opacity-30'}`} />
              <a 
                href="https://www.the33consultantscorp.com/lawyers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block relative"
              >
                <div className="relative bg-slate-900/90 border border-blue-500/50 rounded-2xl overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-blue-500/50 rounded-full px-4 py-2">
                    <span className="text-blue-400 text-sm font-medium">Portal to the Future</span>
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 px-4 py-1">
                      <Network className="w-3 h-3 mr-2" />
                      33CC NETWORK
                    </Badge>
                  </div>
                  <img 
                    src={legalNetworkHero}
                    alt="The 33 Consultants Corp Legal Network" 
                    className={`w-full h-auto object-cover transition-all duration-500 ${isHovered ? 'scale-105 brightness-110' : 'scale-100'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-2xl sm:text-3xl font-display text-white mb-2">The 33 Consultants Corp</h3>
                    <p className="text-blue-200/80">The Nation's Leading Injury, Veteran Services, Probate, Tax, Insurance and Specialty Attorneys</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="bg-slate-900/80 border-blue-500/30 backdrop-blur-sm hover:border-blue-400/50 transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl">Elite Network Access</CardTitle>
                </div>
                <CardDescription className="text-blue-200/70 text-base">
                  Unparalleled connections to America's finest legal minds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Our exclusive partnership with <span className="text-blue-400 font-semibold">The 33 Consultants Corporation (33CC)</span> provides NavigatorUSA members with direct access to a curated network of over 300 of the nation's most prestigious law firms.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Whether you need representation for personal injury, veterans' benefits, tax resolution, estate planning, or any specialty practice — <span className="text-white font-semibold">there is no attorney we cannot introduce you to.</span>
                </p>
                <div className="pt-4 border-t border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Nationally ranked Super Lawyers</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400 mt-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Free no-obligation case reviews</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400 mt-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Pay nothing unless you win</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-blue-500/30 backdrop-blur-sm hover:border-blue-400/50 transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl">Powered by 33CC</CardTitle>
                </div>
                <CardDescription className="text-blue-200/70 text-base">
                  Industry-leading infrastructure and expertise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  The 33 Consultants Corporation is the backbone powering NavigatorUSA's legal ecosystem. Their cutting-edge platform connects veterans and families with verified, elite legal professionals across all 50 states.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  33CC's proprietary network includes attorneys specializing in motor vehicle accidents, mass tort litigation, medical malpractice, workers' compensation, and dozens of other practice areas — all vetted for excellence.
                </p>
                <div className="pt-4 border-t border-blue-500/20">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Star className="w-5 h-5 fill-amber-400" />
                    <span>Millions recovered for clients</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400 mt-2">
                    <Star className="w-5 h-5 fill-amber-400" />
                    <span>24/7 case support available</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400 mt-2">
                    <Star className="w-5 h-5 fill-amber-400" />
                    <span>Experience fighting insurance companies</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-display text-white text-center mb-8">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Practice Areas</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {practiceAreas.map((area, index) => (
                <div 
                  key={index}
                  className="group bg-slate-900/60 border border-blue-500/20 rounded-lg p-4 text-center hover:border-blue-400/50 hover:bg-slate-800/60 transition-all cursor-pointer"
                >
                  <area.icon className="w-6 h-6 text-blue-400 mx-auto mb-2 group-hover:text-blue-300 transition-colors" />
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{area.name}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-blue-300/60 text-sm mt-4">+ 90 more practice areas available</p>
          </div>

          <div className="text-center">
            <div className="inline-block relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-50" />
              <a 
                href="https://www.the33consultantscorp.com/lawyers" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-lg px-8 py-6 rounded-xl border-0 shadow-2xl">
                  <Phone className="w-5 h-5 mr-2" />
                  Get Your Free Case Review
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>
            <p className="text-blue-300/60 text-sm mt-4">Available 24/7 • No obligation • You pay nothing unless you win</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>
    </Layout>
  );
}
