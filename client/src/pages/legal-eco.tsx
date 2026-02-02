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
  const [phase, setPhase] = useState<'home' | 'ready' | 'charge' | 'slash' | 'split' | 'done'>('home');

  useEffect(() => {
    const timer0 = setTimeout(() => setPhase('ready'), 800);
    const timer1 = setTimeout(() => setPhase('charge'), 1600);
    const timer2 = setTimeout(() => setPhase('slash'), 2200);
    const timer3 = setTimeout(() => setPhase('split'), 2700);
    const timer4 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 4200);

    return () => {
      clearTimeout(timer0);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      <style>{`
        @keyframes swordEnter {
          0% { 
            transform: translate(150vw, -50%) rotate(45deg) scale(0.3);
            opacity: 0;
            filter: blur(10px);
          }
          60% {
            filter: blur(0px);
          }
          80% { 
            transform: translate(-10%, -50%) rotate(-5deg) scale(1.1);
            opacity: 1;
          }
          100% { 
            transform: translate(0, -50%) rotate(0deg) scale(1);
            opacity: 1;
          }
        }
        @keyframes swordCharge {
          0% { 
            filter: drop-shadow(0 0 30px rgba(255,100,100,0.8)) drop-shadow(0 0 60px rgba(255,50,50,0.6));
          }
          50% { 
            filter: drop-shadow(0 0 60px rgba(255,255,255,1)) drop-shadow(0 0 120px rgba(100,181,246,1)) drop-shadow(0 0 200px rgba(255,50,50,0.8));
            transform: translate(0, -50%) scale(1.05);
          }
          100% { 
            filter: drop-shadow(0 0 100px rgba(255,255,255,1)) drop-shadow(0 0 200px rgba(100,181,246,1));
            transform: translate(0, -50%) scale(1);
          }
        }
        @keyframes swordSlice {
          0% { 
            transform: translate(0, -100%) rotate(0deg);
          }
          10% {
            transform: translate(-3%, -100%) rotate(-20deg);
          }
          100% { 
            transform: translate(0, 200vh) rotate(5deg);
          }
        }
        @keyframes slashLine {
          0% { 
            clip-path: inset(100% 0 0 0);
            opacity: 1;
          }
          100% { 
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }
        @keyframes leftFall {
          0% { 
            transform: perspective(2000px) translateX(0) rotateY(0deg) rotateZ(0deg) translateZ(0);
            opacity: 1;
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.5);
          }
          100% { 
            transform: perspective(2000px) translateX(-80%) rotateY(60deg) rotateZ(-15deg) translateZ(-500px);
            opacity: 0;
            filter: brightness(0.5);
          }
        }
        @keyframes rightFall {
          0% { 
            transform: perspective(2000px) translateX(0) rotateY(0deg) rotateZ(0deg) translateZ(0);
            opacity: 1;
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.5);
          }
          100% { 
            transform: perspective(2000px) translateX(80%) rotateY(-60deg) rotateZ(15deg) translateZ(-500px);
            opacity: 0;
            filter: brightness(0.5);
          }
        }
        @keyframes sparkBurst {
          0% { 
            opacity: 1;
            transform: scale(0) translate(0, 0);
          }
          100% { 
            opacity: 0;
            transform: scale(2) translate(var(--tx), var(--ty));
          }
        }
        @keyframes electricArc {
          0%, 100% { opacity: 0; }
          10%, 30%, 50%, 70%, 90% { opacity: 1; }
          20%, 40%, 60%, 80% { opacity: 0.3; }
        }
        @keyframes flashBang {
          0% { opacity: 0; }
          5% { opacity: 1; }
          15% { opacity: 0.8; }
          25% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes screenShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          5% { transform: translate(-20px, -10px) rotate(-1deg); }
          10% { transform: translate(20px, 10px) rotate(1deg); }
          15% { transform: translate(-15px, 8px) rotate(-0.5deg); }
          20% { transform: translate(15px, -8px) rotate(0.5deg); }
          25% { transform: translate(-12px, 5px) rotate(-0.3deg); }
          30% { transform: translate(12px, -5px) rotate(0.3deg); }
          40% { transform: translate(-8px, 3px); }
          50% { transform: translate(8px, -3px); }
          60% { transform: translate(-5px, 2px); }
          70% { transform: translate(5px, -2px); }
          80% { transform: translate(-2px, 1px); }
          90% { transform: translate(2px, -1px); }
        }
        @keyframes slashGlow {
          0% { opacity: 0; filter: blur(0px); }
          10% { opacity: 1; filter: blur(0px); }
          30% { opacity: 1; filter: blur(5px); }
          100% { opacity: 0; filter: blur(40px); }
        }
        @keyframes bladeGlint {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes energyPulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 0.4; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes shockwave {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
        @keyframes bloodMoon {
          0% { background: radial-gradient(circle at 50% 50%, rgba(255,0,0,0) 0%, transparent 50%); }
          50% { background: radial-gradient(circle at 50% 50%, rgba(255,0,0,0.3) 0%, transparent 70%); }
          100% { background: radial-gradient(circle at 50% 50%, rgba(255,0,0,0) 0%, transparent 50%); }
        }
        @keyframes chargeParticle {
          0% { transform: translate(var(--startX), var(--startY)) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(0, 0) scale(1); opacity: 0; }
        }
      `}</style>

      {(phase === 'home' || phase === 'ready' || phase === 'charge') && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNDQ1NSIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
          
          {phase === 'charge' && (
            <div className="absolute inset-0" style={{ animation: 'bloodMoon 0.6s ease-in-out infinite' }} />
          )}
          
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-6xl sm:text-8xl font-display text-white mb-4 tracking-tight" style={{
                textShadow: phase === 'charge' ? '0 0 30px rgba(255,100,100,0.8), 0 0 60px rgba(255,50,50,0.5)' : 'none'
              }}>
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
          
          {(phase === 'ready' || phase === 'charge') && (
            <>
              <svg 
                className="absolute"
                width="500" 
                height="80" 
                viewBox="0 0 500 80"
                style={{
                  right: phase === 'ready' ? '-500px' : '10%',
                  top: '50%',
                  animation: phase === 'ready' 
                    ? 'swordEnter 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' 
                    : 'swordCharge 0.5s ease-in-out infinite',
                  filter: 'drop-shadow(0 0 40px rgba(255,255,255,1)) drop-shadow(0 0 80px rgba(100,181,246,0.8))',
                }}
              >
                <defs>
                  <linearGradient id="bladeGradientReady" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#909090" />
                    <stop offset="15%" stopColor="#d0d0d0" />
                    <stop offset="30%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#b8e0fc" />
                    <stop offset="70%" stopColor="#ffffff" />
                    <stop offset="85%" stopColor="#d0d0d0" />
                    <stop offset="100%" stopColor="#909090" />
                  </linearGradient>
                  <linearGradient id="bladeEdge" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#64b5f6" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                  <linearGradient id="energyGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,50,50,0.8)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,1)" />
                    <stop offset="100%" stopColor="rgba(100,181,246,0.8)" />
                  </linearGradient>
                  <filter id="bladeGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <path d="M 60 40 L 470 32 L 495 40 L 470 48 L 60 40" fill="url(#bladeGradientReady)" filter="url(#bladeGlow)" />
                <path d="M 70 40 L 460 35 L 475 40 L 460 45 L 70 40" fill="url(#energyGlow)" opacity={phase === 'charge' ? "0.6" : "0"} style={{ animation: phase === 'charge' ? 'bladeGlint 0.2s ease-in-out infinite' : 'none' }} />
                <line x1="80" y1="40" x2="450" y2="40" stroke="url(#bladeEdge)" strokeWidth="2" style={{ animation: 'bladeGlint 0.3s ease-in-out infinite' }} />
                <rect x="45" y="28" width="20" height="24" rx="3" fill="#5D3A1A" />
                <ellipse cx="55" cy="40" rx="6" ry="18" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
                <rect x="0" y="30" width="48" height="20" rx="4" fill="linear-gradient(90deg, #1a1a1a 0%, #3d3d3d 50%, #1a1a1a 100%)" />
                <rect x="0" y="30" width="48" height="20" rx="4" fill="#2d2d2d" />
                <g>
                  {[8, 18, 28, 38].map((x) => (
                    <line key={x} x1={x} y1="30" x2={x} y2="50" stroke="#1a1a1a" strokeWidth="3" />
                  ))}
                </g>
                <ellipse cx="0" cy="40" rx="6" ry="10" fill="#FFD700" />
                <circle cx="0" cy="40" r="4" fill="#FF4444" style={{ animation: phase === 'charge' ? 'energyPulse 0.3s ease-out infinite' : 'none' }} />
              </svg>
              
              {phase === 'charge' && [...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: '4px',
                    height: '4px',
                    right: `${15 + Math.random() * 30}%`,
                    top: `${40 + (Math.random() - 0.5) * 30}%`,
                    '--startX': `${(Math.random() - 0.5) * 200}px`,
                    '--startY': `${(Math.random() - 0.5) * 200}px`,
                    animation: `chargeParticle 0.5s ease-out ${i * 0.03}s infinite`,
                    boxShadow: '0 0 10px 5px rgba(100,181,246,0.8)',
                  } as React.CSSProperties}
                />
              ))}
            </>
          )}
        </div>
      )}

      {(phase === 'slash' || phase === 'split') && (
        <>
          <div 
            className="absolute inset-0"
            style={{ animation: 'screenShake 0.8s ease-out' }}
          />
          
          <div 
            className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black"
            style={{
              clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
              animation: phase === 'split' ? 'leftFall 1.2s ease-in forwards' : 'none',
              transformOrigin: 'top center',
            }}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNDQ1NSIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-6xl sm:text-8xl font-display text-white mb-4 tracking-tight">
                  <span className="text-brand-red">NAVIGATOR</span>
                  <span className="font-light">USA</span>
                </h1>
                <p className="text-xl text-gray-300">Veterans' Family Resources</p>
              </div>
            </div>
          </div>

          <div 
            className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black"
            style={{
              clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
              animation: phase === 'split' ? 'rightFall 1.2s ease-in forwards' : 'none',
              transformOrigin: 'top center',
            }}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNDQ1NSIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-6xl sm:text-8xl font-display text-white mb-4 tracking-tight">
                  <span className="text-brand-red">NAVIGATOR</span>
                  <span className="font-light">USA</span>
                </h1>
                <p className="text-xl text-gray-300">Veterans' Family Resources</p>
              </div>
            </div>
          </div>

          {phase === 'slash' && (
            <>
              {/* Multiple shockwave rings */}
              {[0, 1, 2].map((i) => (
                <div
                  key={`shockwave-${i}`}
                  className="absolute rounded-full border-4 border-white/50"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: '100px',
                    height: '100px',
                    animation: `shockwave 1s ease-out ${i * 0.15}s forwards`,
                  }}
                />
              ))}
              
              {/* Main slash line - triple layered */}
              <div 
                className="absolute left-1/2 top-0 h-full w-4"
                style={{
                  marginLeft: '-8px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,50,50,0.5) 20%, rgba(255,255,255,1) 48%, #ffffff 50%, rgba(255,255,255,1) 52%, rgba(100,181,246,0.5) 80%, transparent 100%)',
                  animation: 'slashLine 0.3s ease-out forwards',
                  boxShadow: '0 0 100px 50px rgba(255,255,255,1), 0 0 200px 100px rgba(100,181,246,0.8), 0 0 300px 150px rgba(255,50,50,0.5)',
                }}
              />
              <div 
                className="absolute left-1/2 top-0 h-full w-16"
                style={{
                  marginLeft: '-32px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,100,100,0.6), rgba(255,255,255,0.9), rgba(100,181,246,0.6), transparent)',
                  animation: 'slashLine 0.35s ease-out forwards',
                }}
              />
              <div 
                className="absolute left-1/2 top-0 h-full w-48"
                style={{
                  marginLeft: '-96px',
                  background: 'linear-gradient(90deg, transparent, rgba(100,181,246,0.3), transparent)',
                  animation: 'slashGlow 1s ease-out forwards',
                }}
              />
              
              {/* Massive vertical katana sword */}
              <svg 
                className="absolute"
                width="120" 
                height="600" 
                viewBox="0 0 120 600"
                style={{
                  left: '50%',
                  top: '-300px',
                  marginLeft: '-60px',
                  animation: 'swordSlice 0.4s cubic-bezier(0.1, 0.1, 0.25, 1) forwards',
                  filter: 'drop-shadow(0 0 50px rgba(255,255,255,1)) drop-shadow(0 0 100px rgba(100,181,246,1)) drop-shadow(0 0 150px rgba(255,50,50,0.8))',
                }}
              >
                <defs>
                  <linearGradient id="bladeGradientV" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#808080" />
                    <stop offset="15%" stopColor="#c0c0c0" />
                    <stop offset="30%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#a8d8ff" />
                    <stop offset="70%" stopColor="#ffffff" />
                    <stop offset="85%" stopColor="#c0c0c0" />
                    <stop offset="100%" stopColor="#808080" />
                  </linearGradient>
                  <linearGradient id="bladeShine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="40%" stopColor="rgba(255,255,255,0.9)" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="rgba(255,255,255,0.9)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <linearGradient id="bladeEnergy" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,100,100,0.8)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,1)" />
                    <stop offset="100%" stopColor="rgba(100,181,246,0.8)" />
                  </linearGradient>
                  <linearGradient id="handleGradientV" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0a0a0a" />
                    <stop offset="50%" stopColor="#2d2d2d" />
                    <stop offset="100%" stopColor="#0a0a0a" />
                  </linearGradient>
                  <filter id="swordGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                {/* Main blade */}
                <path d="M 50 0 L 70 0 L 75 420 L 60 450 L 45 420 L 50 0" fill="url(#bladeGradientV)" filter="url(#swordGlow)" />
                {/* Energy core */}
                <path d="M 55 10 L 65 10 L 68 400 L 60 420 L 52 400 L 55 10" fill="url(#bladeEnergy)" opacity="0.5" />
                {/* Center shine line */}
                <rect x="58" y="0" width="4" height="400" fill="url(#bladeShine)" opacity="0.9" />
                {/* Edge highlights */}
                <rect x="52" y="0" width="1" height="400" fill="rgba(255,100,100,0.6)" />
                <rect x="67" y="0" width="1" height="400" fill="rgba(100,181,246,0.6)" />
                {/* Tsuba (guard) */}
                <rect x="35" y="450" width="50" height="18" rx="3" fill="#5D3A1A" />
                <ellipse cx="60" cy="468" rx="30" ry="10" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
                <ellipse cx="60" cy="468" rx="20" ry="6" fill="#B8860B" />
                {/* Handle */}
                <rect x="45" y="478" width="30" height="100" rx="6" fill="url(#handleGradientV)" />
                {[490, 510, 530, 550, 570].map((y) => (
                  <line key={y} x1="45" y1={y} x2="75" y2={y} stroke="#0a0a0a" strokeWidth="4" />
                ))}
                {/* Pommel */}
                <ellipse cx="60" cy="580" rx="15" ry="8" fill="#FFD700" />
                <circle cx="60" cy="580" r="6" fill="#FF4444" />
              </svg>
              
              {/* Multiple flash bangs */}
              <div 
                className="absolute inset-0 bg-white"
                style={{
                  animation: 'flashBang 0.5s ease-out forwards',
                  pointerEvents: 'none',
                }}
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(100,181,246,0.5) 0%, transparent 50%)',
                  animation: 'flashBang 0.8s ease-out 0.1s forwards',
                  pointerEvents: 'none',
                }}
              />
              
              {/* MASSIVE spark explosion - 60 particles */}
              {[...Array(60)].map((_, i) => {
                const colors = ['#ffffff', '#64b5f6', '#ff6666', '#ffff00', '#00ff88'];
                const color = colors[i % colors.length];
                const size = 4 + Math.random() * 12;
                return (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: '50%',
                      top: `${2 + i * 1.6}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      background: color,
                      '--tx': `${(Math.random() - 0.5) * 600}px`,
                      '--ty': `${(Math.random() - 0.5) * 300}px`,
                      animation: `sparkBurst 1.2s ease-out ${i * 0.015}s forwards`,
                      boxShadow: `0 0 ${15 + Math.random() * 30}px ${8 + Math.random() * 15}px ${color}`,
                    } as React.CSSProperties}
                  />
                );
              })}
              
              {/* Electric arcs along the slash */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`arc-${i}`}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: `${10 + i * 10}%`,
                    width: '4px',
                    height: '60px',
                    marginLeft: `${(Math.random() - 0.5) * 40}px`,
                    background: 'linear-gradient(180deg, transparent, #64b5f6, #ffffff, #64b5f6, transparent)',
                    transform: `rotate(${(Math.random() - 0.5) * 30}deg)`,
                    animation: `electricArc 0.3s ease-out ${i * 0.05}s`,
                    boxShadow: '0 0 20px 10px rgba(100,181,246,0.8)',
                  }}
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
