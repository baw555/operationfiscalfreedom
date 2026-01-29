import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import DOMPurify from "dompurify";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAutoLogout } from "@/hooks/use-auto-logout";
import { Send, FileText, CheckCircle, Clock, Download, Copy, ExternalLink, User, Phone, Mail, Pen, RotateCcw, Building, LogIn, LogOut, BarChart3, Eye, EyeOff, Users, Globe, MapPin, Plus, Trash2, Edit, FileEdit, GripVertical, Save, Upload, Loader2, Sparkles, X, AlertCircle, LayoutDashboard } from "lucide-react";

// Maurice's account info
const MAURICE_INFO = {
  name: "Maurice Verrelli",
  title: "President & CEO",
  email: "maurice@payzium.com",
  phone1: "888-801-8872",
  phone2: "514-967-6880",
  website: "payzium.com",
  portalLink: "www.operationfiscalfreedom.com/Payzium"
};

interface CsuContractTemplate {
  id: number;
  name: string;
  description: string | null;
  content: string;
  isActive: boolean;
}

interface CsuContractSend {
  id: number;
  templateId: number;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string | null;
  signToken: string;
  tokenExpiresAt: string;
  status: string;
  sentAt: string;
}

interface CsuSignedAgreement {
  id: number;
  contractSendId: number;
  templateId: number;
  signerName: string;
  signerEmail: string;
  signerPhone: string | null;
  address: string | null;
  signedAt: string;
}

interface User {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

// Payzium-specific login form component - Thor/Mjölnir Lightning Theme
function PayziumLoginForm({ onSuccess }: { onSuccess: () => Promise<void> | void }) {
  const { toast } = useToast();
  const [email, setEmail] = useState(() => localStorage.getItem("payzium_remembered_email") || "");
  const [password, setPassword] = useState(() => localStorage.getItem("payzium_remembered_password") || "");
  const [rememberClan, setRememberClan] = useState(() => !!localStorage.getItem("payzium_remembered_email"));
  const [rememberHonor, setRememberHonor] = useState(() => !!localStorage.getItem("payzium_remembered_password"));
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Track when user is actively engaged with form
  const hasContent = email.length > 0 || password.length > 0;
  
  // Post-login cinematic sequence state
  const [cinematicPhase, setCinematicPhase] = useState<'idle' | 'black' | 'scanning' | 'scanningOut' | 'welcome' | 'welcomeOut' | 'videoTransition' | 'done'>('idle');
  const cinematicTimeouts = useRef<NodeJS.Timeout[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isWorthy = email.trim().length > 0 && password.length > 0;
  
  // Cleanup cinematic timeouts
  useEffect(() => {
    return () => {
      cinematicTimeouts.current?.forEach(clearTimeout);
    };
  }, []);
  
  // Run cinematic sequence
  const startCinematicSequence = () => {
    setCinematicPhase('black');
    
    // Timing: black 2s -> scanning 2s -> fade 0.5s -> welcome 2s -> fade 0.5s -> videoTransition -> done
    const t1 = setTimeout(() => setCinematicPhase('scanning'), 2000);      // Show "Scanning" at 2s
    const t2 = setTimeout(() => setCinematicPhase('scanningOut'), 4000);   // Fade out at 4s
    const t3 = setTimeout(() => setCinematicPhase('welcome'), 4500);       // Show "Welcome" at 4.5s
    const t4 = setTimeout(() => setCinematicPhase('welcomeOut'), 6500);    // Fade out at 6.5s
    const t5 = setTimeout(() => setCinematicPhase('videoTransition'), 7000); // Start video at 7s
    
    cinematicTimeouts.current = [t1, t2, t3, t4, t5];
  };
  
  // Handle video end - transition to done
  const handleTransitionVideoEnd = useCallback(() => {
    setCinematicPhase('done');
    onSuccess();
  }, [onSuccess]);
  
  // Fallback timeout for video transition (5 seconds max) and handle video errors
  useEffect(() => {
    if (cinematicPhase === 'videoTransition') {
      // Shorter fallback - 5 seconds is enough
      const fallbackTimeout = setTimeout(() => {
        handleTransitionVideoEnd();
      }, 5000);
      
      // Also try to play video manually
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // If video can't play, immediately transition
          handleTransitionVideoEnd();
        });
      }
      
      return () => clearTimeout(fallbackTimeout);
    }
  }, [cinematicPhase, handleTransitionVideoEnd]);
  
  const skipCinematic = () => {
    cinematicTimeouts.current?.forEach(clearTimeout);
    setCinematicPhase('done');
    onSuccess();
  };

  // Track page view for unauthenticated visitors
  useEffect(() => {
    const trackVisit = async () => {
      let sessionId = sessionStorage.getItem("payzium_session_id");
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem("payzium_session_id", sessionId);
      }
      try {
        await fetch("/api/portal/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            portal: "payzium",
            eventType: "page_view",
            pagePath: window.location.pathname,
            sessionId,
          }),
        });
      } catch (error) {
        console.error("Error tracking visit:", error);
      }
    };
    trackVisit();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, portal: "payzium" }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
        return;
      }
      
      // Handle Remember My Clan (email)
      if (rememberClan) {
        localStorage.setItem("payzium_remembered_email", email);
      } else {
        localStorage.removeItem("payzium_remembered_email");
      }
      
      // Handle Remember My Honor (password)
      if (rememberHonor) {
        localStorage.setItem("payzium_remembered_password", password);
      } else {
        localStorage.removeItem("payzium_remembered_password");
      }
      
      // Start cinematic sequence instead of immediate login
      startCinematicSequence();
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a]">
      {/* Full-screen video background - brighter to show Payzium branding */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ 
          filter: 'brightness(0.85) contrast(1.1) saturate(1.2)',
          objectPosition: 'center center'
        }}
      >
        <source src="/payzium-bg.mp4" type="video/mp4" />
      </video>
      
      {/* Lighter overlay to keep video visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 z-[1]" />
      
      {/* POST-LOGIN CINEMATIC SEQUENCE */}
      {cinematicPhase !== 'idle' && cinematicPhase !== 'done' && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center" data-testid="cinematic-overlay">
          {/* Skip Animation Button */}
          <button
            onClick={skipCinematic}
            className="absolute top-6 right-6 px-4 py-2 text-amber-400/70 hover:text-amber-300 text-sm font-medium tracking-wider uppercase border border-amber-500/30 hover:border-amber-400/50 rounded-lg transition-all duration-300 hover:bg-amber-500/10 z-10"
            data-testid="button-skip-animation"
          >
            Skip Animation →
          </button>
          
          {/* SCANNING Text */}
          <div 
            className={`absolute transition-all ${
              cinematicPhase === 'scanning' ? 'opacity-100 scale-100' : 
              cinematicPhase === 'scanningOut' ? 'opacity-0 scale-95' : 'opacity-0 scale-110'
            }`}
            style={{ transitionDuration: '500ms' }}
          >
            <h1 
              className="text-6xl sm:text-8xl font-black tracking-[0.3em] text-white relative"
              style={{
                textShadow: cinematicPhase === 'scanning' ? '0 0 10px #fff, 0 0 20px #ffd700, 0 0 40px #ffd700, 0 0 80px #ff8c00' : 'none',
                animation: cinematicPhase === 'scanning' ? 'scanFlicker 0.15s infinite' : 'none'
              }}
            >
              <span className="relative">
                SCANNING
                {/* Electric overlay effect */}
                <span 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent bg-clip-text"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: cinematicPhase === 'scanning' ? 'electricGlide 0.8s linear infinite' : 'none',
                    mixBlendMode: 'overlay'
                  }}
                />
              </span>
            </h1>
            {/* Scanning line effect */}
            {cinematicPhase === 'scanning' && (
              <div 
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" 
                style={{ 
                  top: '50%', 
                  boxShadow: '0 0 20px #ffd700, 0 0 40px #ff8c00',
                  animation: 'scanLine 1.5s ease-in-out infinite'
                }} 
              />
            )}
          </div>
          
          {/* WELCOME BACK Text with Letter-by-Letter Shine */}
          <div 
            className={`absolute transition-all ${
              cinematicPhase === 'welcome' ? 'opacity-100 scale-100' : 
              cinematicPhase === 'welcomeOut' ? 'opacity-0 scale-95' : 'opacity-0 scale-110'
            }`}
            style={{ transitionDuration: '500ms' }}
          >
            <div className="text-center relative">
              {/* Welcome Back - static golden glow */}
              <h2 
                className="text-3xl sm:text-5xl font-bold tracking-[0.1em] text-amber-400 mb-4"
                style={{ textShadow: '0 0 15px #ffd700, 0 0 30px #ff8c00' }}
              >
                Welcome Back
              </h2>
              
              {/* Mr. Verrelli - Letter by letter shine animation */}
              <h1 className="text-5xl sm:text-7xl font-black tracking-[0.12em] text-white mb-6 relative">
                {cinematicPhase === 'welcome' && "Mr. Verrelli".split('').map((letter, i) => (
                  <span 
                    key={i}
                    className="inline-block letter-shine"
                    style={{
                      animationDelay: `${i * 0.12}s`,
                      opacity: 0,
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </h1>
              
              {/* President & CEO - Letter by letter with sparkle on O */}
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-[0.15em] text-purple-300 relative">
                {cinematicPhase === 'welcome' && "President & CEO".split('').map((letter, i) => {
                  const isLastO = letter === 'O' && i === 14;
                  return (
                    <span 
                      key={i}
                      className={`inline-block ${isLastO ? 'letter-shine-sparkle' : 'letter-shine'}`}
                      style={{
                        animationDelay: `${1.4 + i * 0.08}s`,
                        opacity: 0,
                        position: 'relative',
                      }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                      {/* Elaborate sparkle burst on the O */}
                      {isLastO && (
                        <>
                          {[...Array(16)].map((_, s) => (
                            <span
                              key={s}
                              className="sparkle-particle"
                              style={{
                                '--angle': `${s * 22.5}deg`,
                                '--delay': `${2.6 + s * 0.03}s`,
                                '--distance': `${40 + Math.random() * 30}px`,
                              } as React.CSSProperties}
                            />
                          ))}
                          {/* Inner ring sparkles */}
                          {[...Array(8)].map((_, s) => (
                            <span
                              key={`inner-${s}`}
                              className="sparkle-particle-inner"
                              style={{
                                '--angle': `${s * 45 + 22.5}deg`,
                                '--delay': `${2.65 + s * 0.04}s`,
                                '--distance': `${20 + Math.random() * 15}px`,
                              } as React.CSSProperties}
                            />
                          ))}
                        </>
                      )}
                    </span>
                  );
                })}
              </h3>
              
              {/* Ambient floating particles */}
              {cinematicPhase === 'welcome' && [...Array(20)].map((_, i) => (
                <span 
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full ambient-particle"
                  style={{
                    left: `${5 + Math.random() * 90}%`,
                    top: `${5 + Math.random() * 90}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 1.5}s`,
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Video Transition Phase */}
          {cinematicPhase === 'videoTransition' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                onEnded={handleTransitionVideoEnd}
                onError={handleTransitionVideoEnd}
                className="w-full h-full object-cover"
                style={{ 
                  filter: 'brightness(1.1) contrast(1.1)',
                }}
              >
                <source src="/payzium-transition.mp4" type="video/mp4" />
              </video>
            </div>
          )}
          
          {/* Cinematic animation keyframes */}
          <style>{`
            @keyframes scanFlicker {
              0%, 100% { opacity: 1; }
              5% { opacity: 0.8; }
              10% { opacity: 1; }
              15% { opacity: 0.9; }
              30% { opacity: 1; }
              32% { opacity: 0.7; }
              35% { opacity: 1; }
              50% { opacity: 0.95; }
              70% { opacity: 1; }
              72% { opacity: 0.85; }
              75% { opacity: 1; }
            }
            @keyframes electricGlide {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            @keyframes scanLine {
              0% { transform: translateY(-100px); opacity: 0; }
              20% { opacity: 1; }
              80% { opacity: 1; }
              100% { transform: translateY(100px); opacity: 0; }
            }
            @keyframes welcomePulse {
              0% { transform: scale(0.9); opacity: 0; filter: blur(10px); }
              20% { transform: scale(1.02); opacity: 1; filter: blur(0); }
              40% { transform: scale(1); }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes sparkBurst {
              0% { transform: scale(0) translate(0, 0); opacity: 1; }
              50% { transform: scale(2) translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px); opacity: 0.8; }
              100% { transform: scale(0) translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px); opacity: 0; }
            }
            
            /* Letter-by-letter shine animation */
            @keyframes letterShine {
              0% { 
                opacity: 0; 
                transform: translateY(20px) scale(0.8);
                text-shadow: none;
                color: #333;
              }
              30% { 
                opacity: 1; 
                transform: translateY(0) scale(1.1);
                text-shadow: 0 0 20px #fff, 0 0 40px #ffd700, 0 0 60px #ffd700, 0 0 80px #ff8c00;
                color: #fff;
              }
              50% {
                transform: scale(1.05);
                text-shadow: 0 0 30px #fff, 0 0 60px #ffd700, 0 0 90px #ffd700, 0 0 120px #ff8c00;
              }
              100% { 
                opacity: 1; 
                transform: translateY(0) scale(1);
                text-shadow: 0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,215,0,0.3);
                color: #fff;
              }
            }
            
            .letter-shine {
              animation: letterShine 0.6s ease-out forwards;
            }
            
            /* Special sparkle animation for the O */
            @keyframes letterShineSparkle {
              0% { 
                opacity: 0; 
                transform: translateY(20px) scale(0.8);
                text-shadow: none;
                color: #333;
              }
              30% { 
                opacity: 1; 
                transform: translateY(0) scale(1.2);
                text-shadow: 0 0 30px #fff, 0 0 60px #ffd700, 0 0 90px #9333ea, 0 0 120px #ff8c00;
                color: #ffd700;
              }
              50% {
                transform: scale(1.4);
                text-shadow: 0 0 50px #fff, 0 0 100px #ffd700, 0 0 150px #9333ea, 0 0 200px #ff00ff;
                color: #fff;
              }
              70% {
                transform: scale(1.1);
                text-shadow: 0 0 40px #fff, 0 0 80px #ffd700;
              }
              100% { 
                opacity: 1; 
                transform: translateY(0) scale(1);
                text-shadow: 0 0 15px #ffd700, 0 0 30px #9333ea;
                color: #ffd700;
              }
            }
            
            .letter-shine-sparkle {
              animation: letterShineSparkle 0.8s ease-out forwards;
            }
            
            /* Sparkle particles that burst from the O */
            .sparkle-particle {
              position: absolute;
              width: 4px;
              height: 4px;
              background: radial-gradient(circle, #fff 0%, #ffd700 50%, transparent 100%);
              border-radius: 50%;
              top: 50%;
              left: 50%;
              opacity: 0;
              animation: sparkleExplode 0.8s ease-out forwards;
              animation-delay: var(--delay);
              box-shadow: 0 0 6px #ffd700, 0 0 12px #ff8c00, 0 0 18px #9333ea;
            }
            
            .sparkle-particle-inner {
              position: absolute;
              width: 3px;
              height: 3px;
              background: radial-gradient(circle, #fff 0%, #9333ea 50%, transparent 100%);
              border-radius: 50%;
              top: 50%;
              left: 50%;
              opacity: 0;
              animation: sparkleExplodeInner 0.6s ease-out forwards;
              animation-delay: var(--delay);
              box-shadow: 0 0 4px #9333ea, 0 0 8px #ff00ff;
            }
            
            @keyframes sparkleExplode {
              0% {
                opacity: 0;
                transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0);
              }
              20% {
                opacity: 1;
              }
              100% {
                opacity: 0;
                transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance));
              }
            }
            
            @keyframes sparkleExplodeInner {
              0% {
                opacity: 0;
                transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0);
              }
              30% {
                opacity: 1;
              }
              100% {
                opacity: 0;
                transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance));
              }
            }
            
            /* Ambient floating particles */
            .ambient-particle {
              animation: ambientFloat 2s ease-in-out infinite;
              box-shadow: 0 0 6px #ffd700, 0 0 12px #ff8c00;
            }
            
            @keyframes ambientFloat {
              0%, 100% { 
                opacity: 0; 
                transform: translateY(0) scale(0.5); 
              }
              50% { 
                opacity: 0.8; 
                transform: translateY(-20px) scale(1.2); 
              }
            }
          `}</style>
        </div>
      )}
      
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 z-[2]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      {/* Main content - positioned higher to show Payzium in background */}
      <div className="relative z-[10] min-h-screen flex items-start justify-center px-4 pt-16 sm:pt-24 overflow-visible">
        <div className="w-full max-w-lg overflow-visible">
          
          {/* Login Card */}
          <div className="relative animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            {/* Subtle border glow */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-amber-400/40 via-orange-500/30 to-amber-600/40 rounded-2xl blur-sm" />
            
            <div 
              className={`relative backdrop-blur-xl border border-amber-400/20 rounded-2xl p-8 shadow-2xl transition-all duration-500 ${
                isTyping || hasContent 
                  ? 'bg-[#0d0905]/85' 
                  : 'bg-[#0d0905]/30'
              }`} 
              style={{ boxShadow: '0 0 40px rgba(255,140,0,0.15)' }}
            >
              {/* Corner lightning indicators */}
              <div className="absolute top-2 left-2 w-3 h-3">
                <div className="absolute inset-0 bg-amber-400 rounded-full animate-pulse" style={{ boxShadow: '0 0 12px #ffd700' }} />
              </div>
              <div className="absolute top-2 right-2 w-3 h-3">
                <div className="absolute inset-0 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s', boxShadow: '0 0 12px #ffd700' }} />
              </div>
              <div className="absolute bottom-2 left-2 w-3 h-3">
                <div className="absolute inset-0 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s', boxShadow: '0 0 12px #ff8c00' }} />
              </div>
              <div className="absolute bottom-2 right-2 w-3 h-3">
                <div className="absolute inset-0 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.9s', boxShadow: '0 0 12px #ff8c00' }} />
              </div>
              
              {/* Top electric bar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-electricScan" style={{ boxShadow: '0 0 15px #ffd700' }} />

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2 group">
                  <Label htmlFor="email" className="text-amber-200/90 text-sm font-bold tracking-[0.2em] uppercase">
                    Identity
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/60 transition-all group-focus-within:text-amber-400 group-focus-within:scale-110" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                      placeholder="Enter your email"
                      required
                      data-testid="input-payzium-email"
                      className="relative pl-12 h-14 bg-black/50 border-amber-500/30 text-amber-100 placeholder:text-amber-700/50 focus:border-amber-400/70 focus:ring-amber-400/40 focus:bg-black/70 transition-all duration-300 rounded-xl text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label htmlFor="password" className="text-amber-200/90 text-sm font-bold tracking-[0.2em] uppercase">
                    Power Key
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
                    <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/60 transition-all group-focus-within:text-amber-400 group-focus-within:scale-110 z-10" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                      placeholder="Enter your password"
                      required
                      data-testid="input-payzium-password"
                      className="relative pl-12 pr-12 h-14 bg-black/50 border-amber-500/30 text-amber-100 placeholder:text-amber-700/50 focus:border-amber-400/70 focus:ring-amber-400/40 focus:bg-black/70 transition-all duration-300 rounded-xl text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500/60 hover:text-amber-400 transition-colors z-10"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="remember-clan"
                      checked={rememberClan}
                      onCheckedChange={(checked) => setRememberClan(checked === true)}
                      data-testid="checkbox-payzium-remember-clan"
                      className="border-amber-500/50 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-400"
                    />
                    <Label htmlFor="remember-clan" className="text-sm text-amber-300/70 cursor-pointer">
                      Remember My Clan
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="remember-honor"
                      checked={rememberHonor}
                      onCheckedChange={(checked) => setRememberHonor(checked === true)}
                      data-testid="checkbox-payzium-remember-honor"
                      className="border-amber-500/50 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-400"
                    />
                    <Label htmlFor="remember-honor" className="text-sm text-amber-300/70 cursor-pointer">
                      Remember My Honor
                    </Label>
                  </div>
                </div>

                {/* MJÖLNIR POWER BUTTON with Electricity Animation */}
                <div className="relative">
                  {/* Electric arcs around button */}
                  <div className="absolute -inset-2 pointer-events-none">
                    {/* Left arc */}
                    <svg className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-16" viewBox="0 0 20 40" style={{ animation: 'buttonArcLeft 2s ease-in-out infinite' }}>
                      <path d="M18 0 L12 10 L16 12 L8 22 L14 24 L4 40" stroke="#ffd700" strokeWidth="1.5" fill="none" style={{ filter: 'drop-shadow(0 0 4px #ffd700)' }} />
                    </svg>
                    {/* Right arc */}
                    <svg className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-16" viewBox="0 0 20 40" style={{ animation: 'buttonArcRight 2.3s ease-in-out infinite 0.5s' }}>
                      <path d="M2 0 L8 10 L4 12 L12 22 L6 24 L16 40" stroke="#ffd700" strokeWidth="1.5" fill="none" style={{ filter: 'drop-shadow(0 0 4px #ffd700)' }} />
                    </svg>
                    {/* Top sparks */}
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={`spark-top-${i}`}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                        style={{
                          left: `${15 + i * 18}%`,
                          top: '-4px',
                          boxShadow: '0 0 6px #ffd700',
                          animation: `buttonSpark ${0.8 + Math.random() * 0.4}s ease-out infinite`,
                          animationDelay: `${i * 0.2}s`
                        }}
                      />
                    ))}
                    {/* Bottom sparks */}
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={`spark-bottom-${i}`}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                        style={{
                          left: `${15 + i * 18}%`,
                          bottom: '-4px',
                          boxShadow: '0 0 6px #ffd700',
                          animation: `buttonSpark ${0.8 + Math.random() * 0.4}s ease-out infinite`,
                          animationDelay: `${0.1 + i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    data-testid="button-payzium-login"
                    className={`w-full h-18 py-5 text-white font-black text-xl rounded-xl transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] relative overflow-hidden group border-2 ${
                      isWorthy 
                        ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-400 border-yellow-300/60 hover:border-yellow-200/80 shadow-[0_0_40px_rgba(255,215,0,0.5)]'
                        : 'bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 hover:from-amber-600 hover:via-orange-500 hover:to-amber-600 border-amber-400/40 hover:border-amber-300/60 shadow-[0_0_30px_rgba(255,140,0,0.3)]'
                    }`}
                  >
                    {/* Electric pulse overlay */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent"
                      style={{ 
                        backgroundSize: '200% 100%',
                        animation: 'electricPulse 1.5s ease-in-out infinite'
                      }}
                    />
                    
                    {/* Thunder shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-yellow-300/30 to-yellow-300/0 translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700 delay-100" />
                    
                    {/* Crackling border effect */}
                    <div 
                      className="absolute inset-0 rounded-xl border-2 border-yellow-300/50"
                      style={{ animation: 'borderCrackle 0.3s ease-in-out infinite' }}
                    />
                    
                    {/* Power surge on worthy */}
                    {isWorthy && (
                      <div className="absolute inset-0 animate-worthyPulse">
                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-300/30 to-transparent" />
                      </div>
                    )}
                    
                    <span className="relative z-10 flex items-center justify-center gap-3 drop-shadow-lg">
                      {isLoading ? (
                        <>
                          <div className="w-7 h-7 border-3 border-white/40 border-t-white rounded-full animate-spin" />
                          <span className="animate-pulse tracking-wider">CHANNELING POWER...</span>
                        </>
                      ) : (
                        <>
                          <span className={`tracking-[0.15em] transition-all duration-500 ${isWorthy ? 'text-black' : 'text-white'}`}>
                            {isWorthy ? 'Mjölnir is yours' : 'Are you worthy?'}
                          </span>
                          <LogIn className={`w-7 h-7 transition-all group-hover:translate-x-2 group-hover:scale-125 ${isWorthy ? 'text-black' : 'text-white'}`} />
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              </form>

              {/* Forgot password link */}
              <div className="mt-4 text-center">
                <a 
                  href="/forgot-password?portal=payzium" 
                  className="text-amber-400/80 hover:text-amber-300 text-sm transition-colors"
                >
                  Forgot your Power Key?
                </a>
              </div>

              {/* Power status */}
              <div className="mt-6 pt-6 border-t border-amber-500/20">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: '0 0 10px #4ade80' }} />
                    <span className="text-green-400/90 text-xs tracking-wider font-medium">ONLINE</span>
                  </div>
                  <div className="w-px h-4 bg-amber-500/30" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" style={{ boxShadow: '0 0 10px #fbbf24' }} />
                    <span className="text-amber-400/90 text-xs tracking-wider font-medium">POWER: UNLIMITED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Epic Footer */}
          <div className="mt-10 text-center animate-fadeIn" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-24 h-px bg-gradient-to-r from-transparent to-amber-500/60" />
              <div className="w-4 h-4 rotate-45 border-2 border-amber-500/60 animate-pulse" style={{ boxShadow: '0 0 10px rgba(255,215,0,0.3)' }} />
              <div className="w-24 h-px bg-gradient-to-l from-transparent to-amber-500/60" />
            </div>
            <p className="text-amber-500/50 text-xs tracking-[0.4em] uppercase font-medium">
              Unlimited Power Awaits
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations - THOR'S LIGHTNING */}
      <style>{`
        @keyframes stormCloud1 {
          0%, 100% { transform: translateX(-10%) scale(1.05); opacity: 0.4; }
          50% { transform: translateX(10%) scale(1); opacity: 0.6; }
        }
        @keyframes stormCloud2 {
          0%, 100% { transform: translateX(15%) scale(1); opacity: 0.3; }
          50% { transform: translateX(-15%) scale(1.1); opacity: 0.5; }
        }
        @keyframes lightningBolt1 {
          0%, 89%, 100% { opacity: 0; }
          90% { opacity: 1; }
          91% { opacity: 0; }
          92% { opacity: 0.8; }
          93% { opacity: 0; }
        }
        @keyframes lightningBolt2 {
          0%, 84%, 100% { opacity: 0; }
          85% { opacity: 1; }
          86% { opacity: 0; }
          87% { opacity: 0.6; }
          88% { opacity: 0; }
        }
        @keyframes lightningBolt3 {
          0%, 79%, 100% { opacity: 0; }
          80% { opacity: 0.8; }
          81% { opacity: 0; }
          82% { opacity: 1; }
          83% { opacity: 0; }
        }
        @keyframes lightningBranch {
          0%, 95%, 100% { opacity: 0; }
          96% { opacity: 1; }
          97% { opacity: 0; }
          98% { opacity: 0.7; }
          99% { opacity: 0; }
        }
        @keyframes sparkFloat {
          0%, 100% { opacity: 0.3; transform: translateY(0) scale(1); }
          50% { opacity: 1; transform: translateY(-20px) scale(1.5); }
        }
        @keyframes arcPulse {
          0%, 100% { opacity: 0.1; transform: scaleX(0.8); }
          50% { opacity: 0.6; transform: scaleX(1.2); }
        }
        @keyframes extendedBoltFlicker {
          0%, 100% { opacity: 0.7; }
          10% { opacity: 0.5; }
          20% { opacity: 0.8; }
          30% { opacity: 0.4; }
          40% { opacity: 0.9; }
          50% { opacity: 0.6; }
          60% { opacity: 1; }
          70% { opacity: 0.5; }
          80% { opacity: 0.8; }
          90% { opacity: 0.6; }
        }
        @keyframes pillarPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-60px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(60px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes breatheGold {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.7; transform: translateX(-50%) scale(1.1); }
        }
        @keyframes breatheGold2 {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.15); }
        }
        @keyframes breatheGold3 {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.2); }
        }
        @keyframes haloGold {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes coronaPulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        @keyframes logoThunder {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes reflectionPulse {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) scaleX(0.8); }
          50% { opacity: 0.7; transform: translateX(-50%) scaleX(1.2); }
        }
        @keyframes fieldRing1 {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
        @keyframes fieldRing2 {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.03); }
        }
        @keyframes energySurge {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.02); }
        }
        @keyframes borderGoldGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.9; }
        }
        @keyframes electricScan {
          0% { transform: translateX(-50%) scaleX(0.3); opacity: 0.4; }
          50% { transform: translateX(-50%) scaleX(1); opacity: 1; }
          100% { transform: translateX(-50%) scaleX(0.3); opacity: 0.4; }
        }
        @keyframes worthyPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes buttonArcLeft {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) translateY(-50%) scaleY(0.9); }
          25% { opacity: 1; transform: translateX(-50%) translateY(-50%) scaleY(1.1); }
          50% { opacity: 0.5; transform: translateX(-50%) translateY(-50%) scaleY(1); }
          75% { opacity: 0.8; transform: translateX(-50%) translateY(-50%) scaleY(0.95); }
        }
        @keyframes buttonArcRight {
          0%, 100% { opacity: 0.4; transform: translateX(50%) translateY(-50%) scaleY(1); }
          30% { opacity: 1; transform: translateX(50%) translateY(-50%) scaleY(1.15); }
          60% { opacity: 0.6; transform: translateX(50%) translateY(-50%) scaleY(0.9); }
        }
        @keyframes buttonSpark {
          0% { opacity: 0; transform: scale(0); }
          30% { opacity: 1; transform: scale(1.5); }
          60% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.5); }
        }
        @keyframes electricPulse {
          0% { background-position: -200% 0; opacity: 0; }
          50% { opacity: 0.6; }
          100% { background-position: 200% 0; opacity: 0; }
        }
        @keyframes borderCrackle {
          0%, 100% { opacity: 0.5; }
          20% { opacity: 0.8; }
          40% { opacity: 0.3; }
          60% { opacity: 0.9; }
          80% { opacity: 0.4; }
        }
        .animate-fadeInDown { animation: fadeInDown 1.2s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 1.2s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        .animate-stormCloud1 { animation: stormCloud1 12s ease-in-out infinite; }
        .animate-stormCloud2 { animation: stormCloud2 15s ease-in-out infinite; }
        .animate-lightningBolt1 { animation: lightningBolt1 8s ease-out infinite; }
        .animate-lightningBolt2 { animation: lightningBolt2 7s ease-out infinite; animation-delay: 2s; }
        .animate-lightningBolt3 { animation: lightningBolt3 9s ease-out infinite; animation-delay: 4s; }
        .animate-breatheGold { animation: breatheGold 8s ease-in-out infinite; }
        .animate-breatheGold2 { animation: breatheGold2 10s ease-in-out infinite; }
        .animate-breatheGold3 { animation: breatheGold3 12s ease-in-out infinite; }
        .animate-haloGold { animation: haloGold 4s ease-in-out infinite; }
        .animate-coronaPulse { animation: coronaPulse 3s ease-in-out infinite; }
        .animate-logoThunder { animation: logoThunder 5s ease-in-out infinite; }
        .animate-reflectionPulse { animation: reflectionPulse 4s ease-in-out infinite; }
        .animate-fieldRing1 { animation: fieldRing1 3s ease-in-out infinite; }
        .animate-fieldRing2 { animation: fieldRing2 4s ease-in-out infinite; }
        .animate-energySurge { animation: energySurge 2.5s ease-in-out infinite; }
        .animate-borderGoldGlow { animation: borderGoldGlow 2s ease-in-out infinite; }
        .animate-electricScan { animation: electricScan 3s ease-in-out infinite; }
        .animate-worthyPulse { animation: worthyPulse 1.5s ease-in-out infinite; }
        .animate-pillarPulse { animation: pillarPulse 2s ease-in-out infinite; }
        .bg-gradient-radial { background: radial-gradient(circle, var(--tw-gradient-stops)); }
      `}</style>
      
      {/* 501(c)(3) Verification Link - Fixed at bottom */}
      <div className="absolute bottom-4 left-0 right-0 z-10 text-center">
        <a 
          href="/transparency" 
          className="inline-flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 transition-colors"
        >
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-white text-sm font-medium">IRS Verified 501(c)(3) Non-Profit</span>
        </a>
      </div>
    </div>
  );
}

interface PortalStats {
  totalVisits: number;
  uniqueIps: number;
  contractsSent: number;
  contractsSigned: number;
  todayVisits: number;
}

interface PortalActivity {
  id: number;
  portal: string;
  eventType: string;
  ipAddress: string | null;
  userAgent: string | null;
  pagePath: string | null;
  referrer: string | null;
  sessionId: string | null;
  metadata: string | null;
  createdAt: string;
}

interface IpGeoData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  zip: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  organization: string;
  asn: string;
}

// EnvelopesPanel - DocuSign-like multi-recipient signing with order
function EnvelopesPanel({ templates }: { templates: CsuContractTemplate[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [envelopeName, setEnvelopeName] = useState("");
  const [routingType, setRoutingType] = useState<"sequential" | "parallel" | "mixed">("sequential");
  const [recipients, setRecipients] = useState<Array<{ name: string; email: string; phone: string; routingOrder: number; role: string }>>([
    { name: "", email: "", phone: "", routingOrder: 1, role: "signer" }
  ]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderDaysAfterSend, setReminderDaysAfterSend] = useState(3);
  const [reminderFrequencyDays, setReminderFrequencyDays] = useState(3);
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEnvelope, setSelectedEnvelope] = useState<any>(null);
  const [showSigningOrderModal, setShowSigningOrderModal] = useState(false);
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  const [showAuditTrailModal, setShowAuditTrailModal] = useState(false);

  // Fetch envelopes
  const { data: envelopes = [], refetch: refetchEnvelopes } = useQuery({
    queryKey: ["/api/csu/envelopes"],
    queryFn: async () => {
      const res = await fetch("/api/csu/envelopes", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const addRecipient = () => {
    const maxOrder = Math.max(...recipients.map(r => r.routingOrder), 0);
    setRecipients([...recipients, { 
      name: "", 
      email: "", 
      phone: "", 
      routingOrder: routingType === "parallel" ? 1 : maxOrder + 1, 
      role: "signer" 
    }]);
  };

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
    }
  };

  const updateRecipient = (index: number, field: string, value: any) => {
    const updated = [...recipients];
    updated[index] = { ...updated[index], [field]: value };
    setRecipients(updated);
  };

  const createEnvelope = async () => {
    if (!selectedTemplate || !envelopeName.trim() || recipients.some(r => !r.name.trim() || !r.email.trim())) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch("/api/csu/envelopes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          templateId: selectedTemplate,
          name: envelopeName,
          routingType,
          recipients,
          reminderEnabled,
          reminderDaysAfterSend,
          reminderFrequencyDays,
          expiresInDays,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: "Envelope Created!", description: `${recipients.length} recipient(s) added` });
        setShowCreateModal(false);
        resetForm();
        refetchEnvelopes();
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to create envelope", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const sendEnvelope = async (envelopeId: number) => {
    try {
      const res = await fetch(`/api/csu/envelopes/${envelopeId}/send`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Envelope Sent!", description: data.message });
        refetchEnvelopes();
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to send envelope", variant: "destructive" });
    }
  };

  const voidEnvelope = async (envelopeId: number) => {
    if (!confirm("Are you sure you want to void this envelope? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/csu/envelopes/${envelopeId}/void`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason: "Voided by admin" }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Envelope Voided" });
        refetchEnvelopes();
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to void envelope", variant: "destructive" });
    }
  };

  const viewSigningOrder = async (envelopeId: number) => {
    try {
      const res = await fetch(`/api/csu/envelopes/${envelopeId}/signing-order`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSelectedEnvelope(data);
        setShowSigningOrderModal(true);
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to load signing order", variant: "destructive" });
    }
  };

  const viewAuditTrail = async (envelopeId: number) => {
    try {
      const res = await fetch(`/api/csu/envelopes/${envelopeId}/audit-trail`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAuditTrail(data);
        setShowAuditTrailModal(true);
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to load audit trail", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setSelectedTemplate(null);
    setEnvelopeName("");
    setRoutingType("sequential");
    setRecipients([{ name: "", email: "", phone: "", routingOrder: 1, role: "signer" }]);
    setReminderEnabled(false);
    setReminderDaysAfterSend(3);
    setReminderFrequencyDays(3);
    setExpiresInDays(30);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700",
      sent: "bg-blue-100 text-blue-700",
      in_progress: "bg-amber-100 text-amber-700",
      completed: "bg-green-100 text-green-700",
      voided: "bg-red-100 text-red-700",
      expired: "bg-red-100 text-red-700",
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Create Envelope Button */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            Create multi-recipient envelopes with signing order control
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-amber-600 hover:bg-amber-700" data-testid="button-create-envelope">
          <Plus className="w-4 h-4 mr-2" /> Create Envelope
        </Button>
      </div>

      {/* Envelopes List */}
      {envelopes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No envelopes yet. Create your first envelope to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {envelopes.map((envelope: any) => (
            <div key={envelope.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`envelope-row-${envelope.id}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{envelope.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    {getStatusBadge(envelope.status)}
                    <span className="text-sm text-gray-500">
                      {envelope.routingType === "sequential" ? "Sequential" : envelope.routingType === "parallel" ? "Parallel" : "Mixed"} signing
                    </span>
                    <span className="text-sm text-gray-400">
                      Created {new Date(envelope.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => viewSigningOrder(envelope.id)} data-testid={`button-view-order-${envelope.id}`}>
                    <Eye className="w-4 h-4 mr-1" /> View Order
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => viewAuditTrail(envelope.id)} data-testid={`button-audit-trail-${envelope.id}`}>
                    <FileText className="w-4 h-4 mr-1" /> Audit Trail
                  </Button>
                  {envelope.status === "draft" && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => sendEnvelope(envelope.id)} data-testid={`button-send-envelope-${envelope.id}`}>
                      <Send className="w-4 h-4 mr-1" /> Send
                    </Button>
                  )}
                  {envelope.status !== "completed" && envelope.status !== "voided" && (
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => voidEnvelope(envelope.id)} data-testid={`button-void-envelope-${envelope.id}`}>
                      <X className="w-4 h-4 mr-1" /> Void
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Envelope Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Envelope</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Envelope Name</Label>
                <Input 
                  value={envelopeName} 
                  onChange={(e) => setEnvelopeName(e.target.value)}
                  placeholder="e.g., Q1 Sales Agreement"
                  data-testid="input-envelope-name"
                />
              </div>
              <div>
                <Label>Template</Label>
                <Select value={selectedTemplate?.toString() || ""} onValueChange={(v) => setSelectedTemplate(parseInt(v))}>
                  <SelectTrigger data-testid="select-envelope-template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.filter(t => t.isActive).map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Routing Type */}
            <div>
              <Label>Signing Order Type</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <Button
                  variant={routingType === "sequential" ? "default" : "outline"}
                  onClick={() => setRoutingType("sequential")}
                  className={routingType === "sequential" ? "bg-amber-600" : ""}
                  data-testid="button-routing-sequential"
                >
                  Sequential
                </Button>
                <Button
                  variant={routingType === "parallel" ? "default" : "outline"}
                  onClick={() => setRoutingType("parallel")}
                  className={routingType === "parallel" ? "bg-amber-600" : ""}
                  data-testid="button-routing-parallel"
                >
                  Parallel
                </Button>
                <Button
                  variant={routingType === "mixed" ? "default" : "outline"}
                  onClick={() => setRoutingType("mixed")}
                  className={routingType === "mixed" ? "bg-amber-600" : ""}
                  data-testid="button-routing-mixed"
                >
                  Mixed
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {routingType === "sequential" && "Recipients sign one after another in order"}
                {routingType === "parallel" && "All recipients sign at the same time"}
                {routingType === "mixed" && "Mix of sequential and parallel (use same order number for parallel)"}
              </p>
            </div>

            {/* Recipients */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Recipients</Label>
                <Button variant="outline" size="sm" onClick={addRecipient} data-testid="button-add-recipient">
                  <Plus className="w-4 h-4 mr-1" /> Add Recipient
                </Button>
              </div>
              <div className="space-y-3">
                {recipients.map((recipient, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg" data-testid={`recipient-row-${index}`}>
                    {routingType !== "parallel" && (
                      <div className="w-16">
                        <Label className="text-xs">Order</Label>
                        <Input
                          type="number"
                          min="1"
                          value={recipient.routingOrder}
                          onChange={(e) => updateRecipient(index, "routingOrder", parseInt(e.target.value) || 1)}
                          className="text-center"
                          data-testid={`input-recipient-order-${index}`}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Label className="text-xs">Name</Label>
                      <Input
                        value={recipient.name}
                        onChange={(e) => updateRecipient(index, "name", e.target.value)}
                        placeholder="Full name"
                        data-testid={`input-recipient-name-${index}`}
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">Email</Label>
                      <Input
                        type="email"
                        value={recipient.email}
                        onChange={(e) => updateRecipient(index, "email", e.target.value)}
                        placeholder="email@example.com"
                        data-testid={`input-recipient-email-${index}`}
                      />
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Role</Label>
                      <Select value={recipient.role} onValueChange={(v) => updateRecipient(index, "role", v)}>
                        <SelectTrigger data-testid={`select-recipient-role-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="signer">Signer</SelectItem>
                          <SelectItem value="approver">Approver</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {recipients.length > 1 && (
                      <Button variant="ghost" size="sm" className="mt-5 text-red-500 hover:text-red-700" onClick={() => removeRecipient(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reminders & Expiration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={reminderEnabled} 
                    onCheckedChange={(checked) => setReminderEnabled(!!checked)}
                    data-testid="checkbox-reminder-enabled"
                  />
                  <Label>Enable Automatic Reminders</Label>
                </div>
                {reminderEnabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">First reminder (days)</Label>
                      <Input type="number" min="1" value={reminderDaysAfterSend} onChange={(e) => setReminderDaysAfterSend(parseInt(e.target.value) || 3)} />
                    </div>
                    <div>
                      <Label className="text-xs">Repeat every (days)</Label>
                      <Input type="number" min="1" value={reminderFrequencyDays} onChange={(e) => setReminderFrequencyDays(parseInt(e.target.value) || 3)} />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <Label>Envelope Expires In (days)</Label>
                <Input 
                  type="number" 
                  min="1" 
                  value={expiresInDays} 
                  onChange={(e) => setExpiresInDays(parseInt(e.target.value) || 30)}
                  className="mt-2"
                  data-testid="input-expires-in-days"
                />
                <p className="text-xs text-gray-500 mt-1">Recipients have {expiresInDays} days to sign</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={createEnvelope} disabled={isCreating} className="bg-amber-600 hover:bg-amber-700" data-testid="button-submit-envelope">
                {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Create Envelope
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signing Order Modal */}
      <Dialog open={showSigningOrderModal} onOpenChange={setShowSigningOrderModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Signing Order Diagram</DialogTitle>
          </DialogHeader>
          {selectedEnvelope && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Routing Type:</span>
                <span className="capitalize">{selectedEnvelope.routingType}</span>
                <span className="text-gray-400">|</span>
                <span>{selectedEnvelope.totalRecipients} recipients in {selectedEnvelope.totalSteps} step(s)</span>
              </div>
              <div className="space-y-3">
                {selectedEnvelope.diagram.map((step: any, idx: number) => (
                  <div key={step.order} className="relative">
                    {idx > 0 && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="w-0.5 h-3 bg-amber-400"></div>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-amber-400"></div>
                      </div>
                    )}
                    <div className={`p-3 rounded-lg border-2 ${step.parallel ? 'border-blue-300 bg-blue-50' : 'border-amber-300 bg-amber-50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">
                          {step.order}
                        </span>
                        <span className="text-sm font-medium">
                          {step.parallel ? `Parallel Signing (${step.recipients.length})` : 'Sequential'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {step.recipients.map((r: any) => (
                          <div key={r.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span>{r.name}</span>
                              <span className="text-gray-400 text-xs">({r.email})</span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              r.status === 'signed' ? 'bg-green-100 text-green-700' :
                              r.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                              r.status === 'viewed' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {r.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Audit Trail Modal */}
      <Dialog open={showAuditTrailModal} onOpenChange={setShowAuditTrailModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" /> Certificate of Completion - Audit Trail
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {auditTrail.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No activity recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {auditTrail.map((event: any) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border" data-testid={`audit-event-${event.id}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                      event.eventType.includes('signed') ? 'bg-green-500' :
                      event.eventType.includes('sent') ? 'bg-blue-500' :
                      event.eventType.includes('viewed') ? 'bg-purple-500' :
                      event.eventType.includes('voided') || event.eventType.includes('declined') ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}>
                      {event.eventType.includes('signed') ? <CheckCircle className="w-4 h-4" /> :
                       event.eventType.includes('sent') ? <Send className="w-4 h-4" /> :
                       event.eventType.includes('viewed') ? <Eye className="w-4 h-4" /> :
                       <FileText className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{event.eventDescription || event.eventType.replace(/_/g, ' ')}</span>
                        <span className="text-xs text-gray-500">{new Date(event.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="capitalize">{event.actorType}</span>
                        {event.actorEmail && <span className="ml-1">({event.actorEmail})</span>}
                      </div>
                      {event.ipAddress && (
                        <div className="text-xs text-gray-400 mt-1">
                          IP: {event.ipAddress}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t pt-4 mt-4">
              <p className="text-xs text-gray-500 text-center">
                This audit trail serves as a legal record of all actions taken on this envelope.
                All timestamps are recorded in UTC.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type AnalyticsView = "activity" | "unique_visitors" | "contracts_sent" | "contracts_signed" | "today_visits" | "page_views";

function AnalyticsPanel() {
  const [selectedIp, setSelectedIp] = useState<string | null>(null);
  const [showIpModal, setShowIpModal] = useState(false);
  const [activeView, setActiveView] = useState<AnalyticsView>("activity");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const { data: stats } = useQuery<PortalStats>({
    queryKey: ["/api/portal/stats/payzium"],
    refetchInterval: 30000,
  });

  const { data: activity = [] } = useQuery<PortalActivity[]>({
    queryKey: ["/api/portal/activity/payzium"],
    refetchInterval: 30000,
  });

  const { data: contractSends = [] } = useQuery<CsuContractSend[]>({
    queryKey: ["/api/csu/contract-sends"],
  });

  const { data: signedAgreements = [] } = useQuery<CsuSignedAgreement[]>({
    queryKey: ["/api/csu/signed-agreements"],
  });

  const { data: ipGeoData, isLoading: ipLoading, error: ipError } = useQuery<IpGeoData>({
    queryKey: ["/api/portal/ip-lookup", selectedIp],
    queryFn: async () => {
      if (!selectedIp) return null;
      const res = await fetch(`/api/portal/ip-lookup/${selectedIp}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to lookup IP");
      return res.json();
    },
    enabled: !!selectedIp && showIpModal,
  });

  const handleIpClick = (ip: string) => {
    setSelectedIp(ip);
    setShowIpModal(true);
  };

  const handleDownloadPdf = async (agreementId: number, signerName: string) => {
    try {
      setDownloadingId(agreementId);
      const response = await fetch(`/api/csu/signed-agreements/${agreementId}/pdf`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to download PDF");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Contract_${signerName.replace(/\s+/g, "_")}_${agreementId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  const getUniqueVisitors = () => {
    const uniqueIps = new Set(activity.filter(a => a.ipAddress).map(a => a.ipAddress));
    return Array.from(uniqueIps);
  };

  const getTodayActivity = () => {
    const today = new Date().toDateString();
    return activity.filter(a => new Date(a.createdAt).toDateString() === today);
  };

  const getPageViews = () => {
    return activity.filter(a => a.eventType === "page_view" && a.pagePath);
  };

  const getPageViewCount = () => {
    return getPageViews().length;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${activeView === "activity" ? "ring-2 ring-purple-500" : ""}`}
          onClick={() => setActiveView("activity")}
          data-testid="card-total-visits"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-gray-600">Total Visits</span>
            </div>
            <p className="text-2xl font-bold text-amber-900" data-testid="stat-total-visits">
              {stats?.totalVisits ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${activeView === "unique_visitors" ? "ring-2 ring-purple-500" : ""}`}
          onClick={() => setActiveView("unique_visitors")}
          data-testid="card-unique-visitors"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-gray-600">Unique Visitors</span>
            </div>
            <p className="text-2xl font-bold text-amber-900" data-testid="stat-unique-visitors">
              {stats?.uniqueIps ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${activeView === "contracts_sent" ? "ring-2 ring-purple-500" : ""}`}
          onClick={() => setActiveView("contracts_sent")}
          data-testid="card-contracts-sent"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Send className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-gray-600">Contracts Sent</span>
            </div>
            <p className="text-2xl font-bold text-amber-900" data-testid="stat-contracts-sent">
              {stats?.contractsSent ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${activeView === "contracts_signed" ? "ring-2 ring-purple-500" : ""}`}
          onClick={() => setActiveView("contracts_signed")}
          data-testid="card-contracts-signed"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-gray-600">Contracts Signed</span>
            </div>
            <p className="text-2xl font-bold text-amber-900" data-testid="stat-contracts-signed">
              {stats?.contractsSigned ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${activeView === "today_visits" ? "ring-2 ring-purple-500" : ""}`}
          onClick={() => setActiveView("today_visits")}
          data-testid="card-today-visits"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-gray-600">Today's Visits</span>
            </div>
            <p className="text-2xl font-bold text-amber-900" data-testid="stat-today-visits">
              {stats?.todayVisits ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${activeView === "page_views" ? "ring-2 ring-purple-500" : ""}`}
          onClick={() => setActiveView("page_views")}
          data-testid="card-page-views"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-gray-600">Page Views</span>
            </div>
            <p className="text-2xl font-bold text-amber-900" data-testid="stat-page-views">
              {getPageViewCount()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity View */}
      {(activeView === "activity" || activeView === "today_visits") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> 
              {activeView === "today_visits" ? "Today's Activity" : "All Recent Activity"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(activeView === "today_visits" ? getTodayActivity() : activity).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No activity recorded yet</p>
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Time</th>
                      <th className="text-left py-2 px-3">Event</th>
                      <th className="text-left py-2 px-3">IP Address</th>
                      <th className="text-left py-2 px-3">Path</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeView === "today_visits" ? getTodayActivity() : activity).map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50" data-testid={`activity-row-${item.id}`}>
                        <td className="py-2 px-3 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                        <td className="py-2 px-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.eventType === "page_view" ? "bg-blue-100 text-blue-700" :
                            item.eventType === "contract_sent" ? "bg-yellow-100 text-yellow-700" :
                            item.eventType === "contract_signed" ? "bg-green-100 text-green-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {item.eventType.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono text-xs">
                          {item.ipAddress ? (
                            <button
                              onClick={() => handleIpClick(item.ipAddress!)}
                              className="text-purple-600 hover:text-purple-800 hover:underline cursor-pointer"
                              data-testid={`ip-link-${item.id}`}
                            >
                              {item.ipAddress}
                            </button>
                          ) : "-"}
                        </td>
                        <td className="py-2 px-3">{item.pagePath || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Unique Visitors View */}
      {activeView === "unique_visitors" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" /> Unique Visitors ({getUniqueVisitors().length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getUniqueVisitors().length === 0 ? (
              <p className="text-gray-500 text-center py-8">No visitors recorded yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getUniqueVisitors().map((ip, index) => (
                  <button
                    key={ip}
                    onClick={() => handleIpClick(ip!)}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-purple-50 hover:ring-2 hover:ring-purple-200 transition-all text-left"
                    data-testid={`unique-visitor-${index}`}
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-mono text-sm text-purple-700">{ip}</p>
                      <p className="text-xs text-gray-500">Click for location details</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contracts Sent View */}
      {activeView === "contracts_sent" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" /> Contracts Sent ({contractSends.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contractSends.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No contracts sent yet</p>
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Recipient</th>
                      <th className="text-left py-2 px-3">Email</th>
                      <th className="text-left py-2 px-3">Phone</th>
                      <th className="text-left py-2 px-3">Status</th>
                      <th className="text-left py-2 px-3">Sent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractSends.map((contract) => (
                      <tr key={contract.id} className="border-b hover:bg-gray-50" data-testid={`contract-sent-${contract.id}`}>
                        <td className="py-2 px-3 font-medium">{contract.recipientName}</td>
                        <td className="py-2 px-3">{contract.recipientEmail}</td>
                        <td className="py-2 px-3">{contract.recipientPhone || "-"}</td>
                        <td className="py-2 px-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            contract.status === "signed" ? "bg-green-100 text-green-700" :
                            contract.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {contract.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          {new Date(contract.sentAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contracts Signed View */}
      {activeView === "contracts_signed" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Signed Contracts ({signedAgreements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {signedAgreements.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No contracts signed yet</p>
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Signer</th>
                      <th className="text-left py-2 px-3">Email</th>
                      <th className="text-left py-2 px-3">Phone</th>
                      <th className="text-left py-2 px-3">Signed Date</th>
                      <th className="text-left py-2 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signedAgreements.map((agreement) => (
                      <tr key={agreement.id} className="border-b hover:bg-gray-50" data-testid={`contract-signed-${agreement.id}`}>
                        <td className="py-2 px-3 font-medium">{agreement.signerName}</td>
                        <td className="py-2 px-3">{agreement.signerEmail}</td>
                        <td className="py-2 px-3">{agreement.signerPhone || "-"}</td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          {new Date(agreement.signedAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadPdf(agreement.id, agreement.signerName)}
                            disabled={downloadingId === agreement.id}
                            className="flex items-center gap-1"
                            data-testid={`download-pdf-${agreement.id}`}
                          >
                            {downloadingId === agreement.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            Download PDF
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Page Views Log */}
      {activeView === "page_views" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" /> Page View History ({getPageViews().length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getPageViews().length === 0 ? (
              <p className="text-gray-500 text-center py-8">No page views recorded yet</p>
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Time</th>
                      <th className="text-left py-2 px-3">Page</th>
                      <th className="text-left py-2 px-3">Visitor IP</th>
                      <th className="text-left py-2 px-3">Session</th>
                      <th className="text-left py-2 px-3">Referrer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPageViews().map((view) => (
                      <tr key={view.id} className="border-b hover:bg-gray-50" data-testid={`page-view-${view.id}`}>
                        <td className="py-2 px-3 whitespace-nowrap text-xs">
                          {new Date(view.createdAt).toLocaleString()}
                        </td>
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                            <FileText className="w-3 h-3" />
                            {view.pagePath || "/"}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          {view.ipAddress ? (
                            <button
                              onClick={() => handleIpClick(view.ipAddress!)}
                              className="text-blue-600 hover:underline cursor-pointer font-mono text-xs"
                              data-testid={`ip-link-${view.id}`}
                            >
                              {view.ipAddress}
                            </button>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-mono text-xs text-gray-500">
                            {view.sessionId ? view.sessionId.substring(0, 8) + "..." : "-"}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-xs text-gray-600 max-w-[200px] truncate" title={view.referrer || ""}>
                          {view.referrer || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={showIpModal} onOpenChange={setShowIpModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              IP Address Details
            </DialogTitle>
          </DialogHeader>
          {ipLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : ipError ? (
            <div className="text-center py-8 text-red-500">
              Failed to load IP details. This IP may be private or invalid.
            </div>
          ) : ipGeoData ? (
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">IP Address</p>
                <p className="text-lg font-mono font-bold text-purple-900">{ipGeoData.ip}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{ipGeoData.city}, {ipGeoData.region}</p>
                  <p className="text-sm text-gray-500">{ipGeoData.country} ({ipGeoData.countryCode})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Postal Code</p>
                  <p className="font-medium">{ipGeoData.zip || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Coordinates</p>
                  <p className="font-medium text-sm">{ipGeoData.latitude}, {ipGeoData.longitude}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timezone</p>
                  <p className="font-medium">{ipGeoData.timezone}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">Internet Service Provider</p>
                <p className="font-medium">{ipGeoData.isp}</p>
                {ipGeoData.organization && ipGeoData.organization !== ipGeoData.isp && (
                  <p className="text-sm text-gray-500">{ipGeoData.organization}</p>
                )}
                {ipGeoData.asn && (
                  <p className="text-xs text-gray-400 mt-1">{ipGeoData.asn}</p>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CsuPortal() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  useAutoLogout("/Payzium");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [formData, setFormData] = useState({
    templateId: "",
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
  });
  const [recipients, setRecipients] = useState<Array<{name: string; email: string; phone: string}>>([
    { name: "", email: "", phone: "" }
  ]);
  const [batchMode, setBatchMode] = useState(false);
  const [batchSending, setBatchSending] = useState(false);
  const [batchResults, setBatchResults] = useState<{totalSent: number; totalFailed: number; results: Array<{recipient: string; success: boolean; error?: string}>} | null>(null);
  const [lastSigningUrl, setLastSigningUrl] = useState<string | null>(null);
  const [showSelfSign, setShowSelfSign] = useState(false);
  const [selfSignData, setSelfSignData] = useState({
    initials: "",
    effectiveDate: new Date().toISOString().split("T")[0],
    agreedToTerms: false,
    // Additional fields for FICA contract
    clientCompany: "",
    clientAddress: "",
    primaryTitle: "",
    secondaryOwner: "",
  });
  const [currentTemplate, setCurrentTemplate] = useState<CsuContractTemplate | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [selfSignInitialsApplied, setSelfSignInitialsApplied] = useState(false);
  const [signedSuccessfully, setSignedSuccessfully] = useState(false);
  const [lastSignedAgreementId, setLastSignedAgreementId] = useState<number | null>(null);
  
  // Local state to track verified admin login (bypasses 304 cache issue)
  const [verifiedAdmin, setVerifiedAdmin] = useState(false);
  
  // Template builder state
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CsuContractTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: "",
    content: "",
    isActive: true,
    fields: [] as Array<{
      fieldKey: string;
      label: string;
      placeholder: string;
      fieldType: string;
      required: boolean;
      order: number;
    }>,
  });

  // Document upload state for AI contract analysis
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<{
    isUploading: boolean;
    fileName: string | null;
    analysis: null | {
      summary: string;
      extractedText: string;
      detectedFields: Array<{
        name: string;
        placeholder: string;
        type: string;
        required: boolean;
        description: string;
      }>;
      generatedTemplate: string;
    };
    error: string | null;
  }>({
    isUploading: false,
    fileName: null,
    analysis: null,
    error: null,
  });

  // Handle document upload for AI analysis
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadState({ isUploading: true, fileName: file.name, analysis: null, error: null });

    try {
      const formData = new FormData();
      formData.append("document", file);

      const response = await fetch("/api/csu/analyze-document", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to analyze document");
      }

      const data = await response.json();
      setUploadState({
        isUploading: false,
        fileName: file.name,
        analysis: {
          summary: data.summary,
          extractedText: data.extractedText,
          detectedFields: data.detectedFields,
          generatedTemplate: data.generatedTemplate,
        },
        error: null,
      });

      toast({
        title: "Document Analyzed",
        description: `Found ${data.detectedFields?.length || 0} form fields`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      setUploadState({ isUploading: false, fileName: file.name, analysis: null, error: message });
      toast({
        title: "Analysis Failed",
        description: message,
        variant: "destructive",
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Create template from analyzed document
  const createTemplateFromAnalysis = async () => {
    if (!uploadState.analysis) return;

    const newTemplate = {
      name: uploadState.fileName?.replace(/\.(pdf|doc|docx)$/i, "") || "New Template",
      description: uploadState.analysis.summary,
      content: uploadState.analysis.generatedTemplate,
      isActive: true,
      fields: uploadState.analysis.detectedFields.map((field, index) => {
        const typeMap: Record<string, string> = {
          'name': 'text',
          'signer name': 'text',
          'email': 'email',
          'phone': 'phone',
          'date': 'date',
          'effective date': 'date',
          'signature': 'text',
          'initials': 'text',
          'company': 'text',
          'company name': 'text',
          'address': 'textarea',
          'title': 'text',
        };
        const normalizedType = field.type.toLowerCase();
        const mappedType = typeMap[normalizedType] || 'text';
        return {
          fieldKey: field.placeholder.replace(/[\[\]]/g, "").toLowerCase(),
          label: field.name,
          placeholder: field.placeholder,
          fieldType: mappedType,
          required: field.required,
          order: index,
        };
      }),
    };

    try {
      const response = await fetch("/api/csu/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTemplate),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to create template");
      }

      toast({
        title: "Template Created",
        description: "Your contract template has been saved",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/csu/templates"] });
      setUploadState({ isUploading: false, fileName: null, analysis: null, error: null });
      setActiveTab("templates");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  // Helper function to create styled value display
  const styledValue = (value: string, placeholder: string, isFilled: boolean) => {
    const style = isFilled 
      ? "color: #166534; font-weight: 700; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 2px 8px; border-radius: 4px;"
      : "color: #6b21a8; font-weight: 700; background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); padding: 2px 8px; border-radius: 4px; border: 1px dashed #9333ea;";
    return `<span style="${style}">${isFilled ? value : placeholder}</span>`;
  };

  // Helper to replace placeholders in contract content for self-sign display
  const processedSelfSignContent = useMemo(() => {
    if (!currentTemplate?.content) return "";
    
    let content = currentTemplate.content;
    
    // Format date for display
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    };
    
    // Build values map with Maurice's pre-filled info + form data
    const values: Record<string, { value: string; placeholder: string }> = {
      currentDate: { value: formatDate(selfSignData.effectiveDate), placeholder: "[DATE]" },
      effectiveDate: { value: formatDate(selfSignData.effectiveDate), placeholder: "[DATE]" },
      primaryOwner: { value: MAURICE_INFO.name, placeholder: "[NAME]" },
      clientEmail: { value: MAURICE_INFO.email, placeholder: "[EMAIL]" },
      initials: { value: selfSignData.initials, placeholder: "[INITIALS]" },
      clientCompany: { value: selfSignData.clientCompany, placeholder: "[COMPANY]" },
      clientAddress: { value: selfSignData.clientAddress, placeholder: "[ADDRESS]" },
      primaryTitle: { value: selfSignData.primaryTitle, placeholder: "[TITLE]" },
      secondaryOwner: { value: selfSignData.secondaryOwner || "N/A", placeholder: "N/A" },
    };
    
    // Replace editable-field spans with styled read-only values
    // These are the header input areas - replace them with display values
    Object.entries(values).forEach(([field, { value, placeholder }]) => {
      const editableRegex = new RegExp(`<span class="editable-field" data-field="${field}"[^>]*>[^<]*</span>`, "gi");
      const isFilled = !!value && value !== "N/A" && !value.startsWith("[");
      content = content.replace(editableRegex, styledValue(value || placeholder, placeholder, isFilled));
    });
    
    // Replace auto-fill spans with styled values (these are in the contract body)
    Object.entries(values).forEach(([field, { value, placeholder }]) => {
      const autoFillRegex = new RegExp(`<span class="auto-fill"[^>]*data-field="${field}"[^>]*>[^<]*</span>`, "gi");
      const isFilled = !!value && value !== "N/A" && !value.startsWith("[");
      content = content.replace(autoFillRegex, styledValue(value || placeholder, placeholder, isFilled));
    });
    
    // Replace any remaining bracket placeholders
    content = content.replace(/\[SIGNER NAME[^\]]*\]/gi, styledValue(MAURICE_INFO.name, "[NAME]", true));
    content = content.replace(/\[AFFILIATE NAME[^\]]*\]/gi, styledValue(MAURICE_INFO.name, "[NAME]", true));
    content = content.replace(/\[AFFILIATE[^\]]*\]/gi, styledValue(MAURICE_INFO.name, "[NAME]", true));
    content = content.replace(/\[SIGNER EMAIL[^\]]*\]/gi, styledValue(MAURICE_INFO.email, "[EMAIL]", true));
    content = content.replace(/\[EMAIL[^\]]*\]/gi, styledValue(MAURICE_INFO.email, "[EMAIL]", true));
    content = content.replace(/\[EFFECTIVE DATE[^\]]*\]/gi, styledValue(formatDate(selfSignData.effectiveDate), "[DATE]", !!selfSignData.effectiveDate));
    content = content.replace(/\[DATE\]/gi, styledValue(formatDate(selfSignData.effectiveDate), "[DATE]", !!selfSignData.effectiveDate));
    content = content.replace(/\[COMPANY NAME[^\]]*\]/gi, styledValue(selfSignData.clientCompany, "[COMPANY]", !!selfSignData.clientCompany));
    content = content.replace(/\[COMPANY ADDRESS[^\]]*\]/gi, styledValue(selfSignData.clientAddress, "[ADDRESS]", !!selfSignData.clientAddress));
    content = content.replace(/\[COMPANY\]/gi, styledValue(selfSignData.clientCompany, "[COMPANY]", !!selfSignData.clientCompany));
    content = content.replace(/\[ADDRESS\]/gi, styledValue(selfSignData.clientAddress, "[ADDRESS]", !!selfSignData.clientAddress));
    content = content.replace(/\[TITLE[^\]]*\]/gi, styledValue(selfSignData.primaryTitle, "[TITLE]", !!selfSignData.primaryTitle));
    content = content.replace(/\[PRIMARY OWNER\]/gi, styledValue(MAURICE_INFO.name, "[NAME]", true));
    content = content.replace(/\[SECONDARY OWNER\]/gi, styledValue(selfSignData.secondaryOwner || "N/A", "N/A", true));
    content = content.replace(/\[OPTIONAL[^\]]*\]/gi, styledValue(selfSignData.secondaryOwner || "N/A", "N/A", true));
    
    const initialsVal = selfSignData.initials;
    content = content.replace(/\[INITIALS[^\]]*\]/gi, styledValue(initialsVal, "[INITIALS]", !!initialsVal));
    content = content.replace(/\[INITIALS\]/gi, styledValue(initialsVal, "[INITIALS]", !!initialsVal));
    
    // Replace signature placeholders
    content = content.replace(/\[SIGNATURE[^\]]*\]/gi, 
      '<span style="color: #22c55e; font-weight: 700; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 2px 8px; border-radius: 4px;">[Sign Below]</span>'
    );
    
    return content;
  }, [currentTemplate, selfSignData]);

  // Generate or retrieve session ID for tracking
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem("payzium_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem("payzium_session_id", sessionId);
    }
    return sessionId;
  };

  // Track portal activity
  const trackActivity = async (eventType: string, metadata?: object) => {
    try {
      await fetch("/api/portal/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portal: "payzium",
          eventType,
          pagePath: window.location.pathname,
          sessionId: getSessionId(),
          metadata: metadata ? JSON.stringify(metadata) : undefined,
        }),
      });
    } catch (error) {
      console.error("Error tracking activity:", error);
    }
  };

  // Track page view on mount
  useEffect(() => {
    trackActivity("page_view");
  }, []);

  // Check if user is authenticated
  const { data: authData, isLoading: authLoading } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) return { user: null };
      return res.json();
    },
    retry: false,
  });
  const user = authData?.user;

  const { data: templates = [] } = useQuery<CsuContractTemplate[]>({
    queryKey: ["/api/csu/templates"],
    enabled: !!user,
  });

  const { data: contractSends = [] } = useQuery<CsuContractSend[]>({
    queryKey: ["/api/csu/contract-sends"],
    enabled: !!user,
  });

  const { data: signedAgreements = [] } = useQuery<CsuSignedAgreement[]>({
    queryKey: ["/api/csu/signed-agreements"],
    enabled: !!user,
  });

  // Initialize canvas for signature
  useEffect(() => {
    if (showSelfSign && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#6b21a8";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [showSelfSign]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/Payzium";
    },
  });

  const sendContractMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/csu/send-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          templateId: parseInt(data.templateId),
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send contract");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.emailSent) {
        toast({
          title: "Contract Sent Successfully",
          description: `Email sent to ${formData.recipientEmail}. Contract is ready for signature.`,
        });
      } else {
        toast({
          title: "Contract Created - Email Failed",
          description: data.emailError || "Could not send email. Please share the signing link manually.",
          variant: "destructive",
        });
      }
      setLastSigningUrl(data.signingUrl);
      trackActivity("contract_sent", { recipientEmail: formData.recipientEmail, emailSent: data.emailSent });
      setFormData({ templateId: "", recipientName: "", recipientEmail: "", recipientPhone: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/csu/contract-sends"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const selfSignMutation = useMutation({
    mutationFn: async (signatureData: string) => {
      // First create the contract send for Maurice
      const sendRes = await fetch("/api/csu/send-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: parseInt(formData.templateId),
          recipientName: MAURICE_INFO.name,
          recipientEmail: MAURICE_INFO.email,
          recipientPhone: MAURICE_INFO.phone1,
        }),
      });
      if (!sendRes.ok) {
        const error = await sendRes.json();
        throw new Error(error.message || "Failed to create contract");
      }
      const sendData = await sendRes.json();
      
      // Track contract sent event for self-sign flow
      await trackActivity("contract_sent", { recipientEmail: MAURICE_INFO.email, selfSigned: true });
      
      // Extract token from signing URL
      const token = sendData.signingUrl.split("token=")[1];
      
      // Now sign it immediately
      const signRes = await fetch(`/api/csu/sign/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signerName: MAURICE_INFO.name,
          signerEmail: MAURICE_INFO.email,
          signerPhone: MAURICE_INFO.phone1,
          address: MAURICE_INFO.website, // Signer website/address for non-FICA
          clientAddress: selfSignData.clientAddress, // FICA contract company address
          initials: selfSignData.initials,
          effectiveDate: selfSignData.effectiveDate,
          signatureData,
          agreedToTerms: true,
          // Additional fields for FICA contract
          clientCompany: selfSignData.clientCompany,
          primaryTitle: selfSignData.primaryTitle,
          secondaryOwner: selfSignData.secondaryOwner,
        }),
      });
      
      if (!signRes.ok) {
        const error = await signRes.json();
        throw new Error(error.message || "Failed to sign contract");
      }
      
      return signRes.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Contract Signed!",
        description: "Your agreement has been signed successfully.",
      });
      trackActivity("contract_signed", { signerEmail: MAURICE_INFO.email, selfSigned: true });
      setSignedSuccessfully(true);
      setLastSignedAgreementId(data.agreementId);
      queryClient.invalidateQueries({ queryKey: ["/api/csu/signed-agreements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/csu/contract-sends"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.templateId || !formData.recipientName || !formData.recipientEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in template, name, and email.",
        variant: "destructive",
      });
      return;
    }
    sendContractMutation.mutate(formData);
  };

  const addRecipient = () => {
    setRecipients([...recipients, { name: "", email: "", phone: "" }]);
  };

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
    }
  };

  const updateRecipient = (index: number, field: "name" | "email" | "phone", value: string) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  const handleBatchSend = async () => {
    if (!formData.templateId) {
      toast({
        title: "Select Template",
        description: "Please select a contract template first.",
        variant: "destructive",
      });
      return;
    }

    const validRecipients = recipients.filter(r => r.name && r.email);
    if (validRecipients.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please add at least one recipient with name and email.",
        variant: "destructive",
      });
      return;
    }

    setBatchSending(true);
    setBatchResults(null);

    try {
      const response = await fetch("/api/csu/send-contract-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          templateId: parseInt(formData.templateId),
          recipients: validRecipients,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send contracts");
      }

      setBatchResults(data);
      queryClient.invalidateQueries({ queryKey: ["/api/csu/contract-sends"] });

      toast({
        title: "Batch Send Complete",
        description: data.message,
      });

      if (data.totalSent === validRecipients.length) {
        setRecipients([{ name: "", email: "", phone: "" }]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to batch send contracts",
        variant: "destructive",
      });
    } finally {
      setBatchSending(false);
    }
  };

  const handleSignItMyself = () => {
    if (!formData.templateId) {
      toast({
        title: "Select Template",
        description: "Please select a contract template first.",
        variant: "destructive",
      });
      return;
    }
    const template = templates.find(t => t.id === parseInt(formData.templateId));
    setCurrentTemplate(template || null);
    setShowSelfSign(true);
    setSignedSuccessfully(false);
    setLastSignedAgreementId(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Link copied to clipboard." });
  };

  const getSigningUrl = (token: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/csu-sign?token=${token}`;
  };

  // Signature drawing functions
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSelfSignSubmit = () => {
    if (!selfSignData.initials) {
      toast({ title: "Initials Required", description: "Please enter your initials.", variant: "destructive" });
      return;
    }
    if (!selfSignData.effectiveDate) {
      toast({ title: "Effective Date Required", description: "Please select an effective date.", variant: "destructive" });
      return;
    }
    if (!selfSignInitialsApplied) {
      toast({ title: "Apply Initials Required", description: "Please click 'Apply Initials' to apply your initials to all sections.", variant: "destructive" });
      return;
    }
    // Validate FICA-specific fields (template ID 7)
    const isFicaContract = currentTemplate?.id === 7;
    if (isFicaContract) {
      if (!selfSignData.clientCompany) {
        toast({ title: "Company Name Required", description: "Please enter your company name.", variant: "destructive" });
        return;
      }
      if (!selfSignData.clientAddress) {
        toast({ title: "Company Address Required", description: "Please enter your company address.", variant: "destructive" });
        return;
      }
      if (!selfSignData.primaryTitle) {
        toast({ title: "Title Required", description: "Please enter your title.", variant: "destructive" });
        return;
      }
    }
    if (!hasSignature) {
      toast({ title: "Signature Required", description: "Please sign in the signature box.", variant: "destructive" });
      return;
    }
    if (!selfSignData.agreedToTerms) {
      toast({ title: "Agreement Required", description: "Please agree to the terms.", variant: "destructive" });
      return;
    }
    const signatureData = canvasRef.current?.toDataURL("image/png") || "";
    selfSignMutation.mutate(signatureData);
  };

  // Self-signing modal/view
  if (showSelfSign && currentTemplate) {
    if (signedSuccessfully) {
      return (
        <Layout>
          <section className="bg-gradient-to-br from-amber-950 via-amber-900 to-orange-950 text-white py-12">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-5xl font-display mb-4">Payzium</h1>
              <p className="text-lg text-amber-200">Contract Signed Successfully!</p>
            </div>
          </section>
          <section className="py-8 bg-stone-100 min-h-screen">
            <div className="container mx-auto px-4 max-w-xl">
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-700 mb-4">Agreement Signed!</h2>
                  <p className="text-gray-600 mb-6">Your {currentTemplate.name} has been signed and recorded.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {lastSignedAgreementId && (
                      <Button
                        onClick={() => window.open(`/api/csu/signed-agreements/${lastSignedAgreementId}/pdf`, "_blank")}
                        className="bg-amber-600 hover:bg-amber-700"
                        data-testid="button-download-signed-pdf"
                      >
                        <Download className="w-4 h-4 mr-2" /> Download PDF
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowSelfSign(false);
                        setCurrentTemplate(null);
                        setHasSignature(false);
                        setSelfSignInitialsApplied(false);
                        setSelfSignData({ initials: "", effectiveDate: new Date().toISOString().split("T")[0], agreedToTerms: false, clientCompany: "", clientAddress: "", primaryTitle: "", secondaryOwner: "" });
                      }}
                      data-testid="button-back-to-portal"
                    >
                      Back to Portal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </Layout>
      );
    }

    return (
      <Layout>
        <section className="bg-gradient-to-br from-amber-950 via-amber-900 to-orange-950 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl sm:text-4xl font-display mb-2">Payzium</h1>
            <p className="text-amber-200">{currentTemplate.name}</p>
          </div>
        </section>

        <section className="py-8 bg-stone-100 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - Contract & Signing */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" /> Contract Agreement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="bg-gray-50 p-6 rounded-lg border max-h-96 overflow-y-auto text-sm prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(processedSelfSignContent) }}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pen className="w-5 h-5" /> Sign as {MAURICE_INFO.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input value={MAURICE_INFO.name} readOnly className="bg-gray-100 text-brand-navy" data-testid="input-self-sign-name" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input value={MAURICE_INFO.email} readOnly className="bg-gray-100 text-brand-navy" data-testid="input-self-sign-email" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="initials">Initials *</Label>
                          <Input
                            id="initials"
                            value={selfSignData.initials}
                            onChange={(e) => {
                              setSelfSignData({ ...selfSignData, initials: e.target.value.toUpperCase() });
                              setSelfSignInitialsApplied(false);
                            }}
                            placeholder="MV"
                            maxLength={5}
                            className="text-brand-navy uppercase"
                            data-testid="input-self-sign-initials"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="effectiveDate">Effective Date *</Label>
                          <Input
                            id="effectiveDate"
                            type="date"
                            value={selfSignData.effectiveDate}
                            onChange={(e) => setSelfSignData({ ...selfSignData, effectiveDate: e.target.value })}
                            className="text-brand-navy"
                            data-testid="input-self-sign-effective-date"
                          />
                        </div>
                      </div>

                      {/* Apply Initials Button */}
                      <div className="flex items-center justify-between gap-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div>
                          <p className="font-semibold text-purple-800">Apply Initials to Contract</p>
                          <p className="text-xs text-gray-500">
                            {selfSignInitialsApplied 
                              ? `Your initials "${selfSignData.initials}" have been applied to all sections.` 
                              : "Click to apply your initials to all required sections."}
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={() => setSelfSignInitialsApplied(true)}
                          disabled={selfSignData.initials.length < 2}
                          className={`h-10 px-4 ${selfSignInitialsApplied ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}`}
                          data-testid="button-self-sign-apply-initials"
                        >
                          {selfSignInitialsApplied ? "Initials Applied ✓" : "Apply Initials"}
                        </Button>
                      </div>

                      {/* Additional fields for FICA Tips Tax Credit Agreement */}
                      {/* FICA Tips Tax Credit Agreement is template ID 7 */}
                      {currentTemplate?.id === 7 && (
                        <>
                          <div className="border-t pt-4 mt-2">
                            <p className="text-sm text-purple-700 font-medium mb-3">Business Information for FICA Tax Credit</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="clientCompany">Company Name *</Label>
                              <Input
                                id="clientCompany"
                                value={selfSignData.clientCompany}
                                onChange={(e) => setSelfSignData({ ...selfSignData, clientCompany: e.target.value })}
                                placeholder="Enter company name"
                                className="text-brand-navy"
                                data-testid="input-self-sign-company"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="primaryTitle">Your Title *</Label>
                              <Input
                                id="primaryTitle"
                                value={selfSignData.primaryTitle}
                                onChange={(e) => setSelfSignData({ ...selfSignData, primaryTitle: e.target.value })}
                                placeholder="e.g., Owner, CEO, President"
                                className="text-brand-navy"
                                data-testid="input-self-sign-title"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="clientAddress">Company Address *</Label>
                            <Input
                              id="clientAddress"
                              value={selfSignData.clientAddress}
                              onChange={(e) => setSelfSignData({ ...selfSignData, clientAddress: e.target.value })}
                              placeholder="Enter full company address"
                              className="text-brand-navy"
                              data-testid="input-self-sign-address"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="secondaryOwner">Secondary Owner (optional)</Label>
                            <Input
                              id="secondaryOwner"
                              value={selfSignData.secondaryOwner}
                              onChange={(e) => setSelfSignData({ ...selfSignData, secondaryOwner: e.target.value })}
                              placeholder="Leave blank if N/A"
                              className="text-brand-navy"
                              data-testid="input-self-sign-secondary-owner"
                            />
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Signature *</Label>
                          <Button variant="ghost" size="sm" onClick={clearSignature} data-testid="button-clear-signature">
                            <RotateCcw className="w-4 h-4 mr-1" /> Clear
                          </Button>
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white">
                          <canvas
                            ref={canvasRef}
                            width={600}
                            height={200}
                            className="w-full cursor-crosshair touch-none"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                          />
                        </div>
                        <p className="text-sm text-gray-500">Sign above using your mouse or finger</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={selfSignData.agreedToTerms}
                          onCheckedChange={(checked) => setSelfSignData({ ...selfSignData, agreedToTerms: checked as boolean })}
                          data-testid="checkbox-self-sign-terms"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700">
                          I have read and agree to the terms and conditions of this agreement
                        </label>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          onClick={handleSelfSignSubmit}
                          className="flex-1 bg-amber-600 hover:bg-amber-700"
                          disabled={selfSignMutation.isPending}
                          data-testid="button-self-sign-submit"
                        >
                          {selfSignMutation.isPending ? "Signing..." : "Sign & Complete"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowSelfSign(false);
                            setCurrentTemplate(null);
                            setHasSignature(false);
                            setSelfSignInitialsApplied(false);
                            setSelfSignData({ initials: "", effectiveDate: new Date().toISOString().split("T")[0], agreedToTerms: false, clientCompany: "", clientAddress: "", primaryTitle: "", secondaryOwner: "" });
                          }}
                          data-testid="button-self-sign-cancel"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar - Account Info */}
              <div className="space-y-6" data-testid="account-info-panel">
                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                      <Building className="w-5 h-5" /> Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-amber-900" data-testid="text-account-name">{MAURICE_INFO.name}</p>
                        <p className="text-sm text-amber-700" data-testid="text-account-title">{MAURICE_INFO.title}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4 text-amber-600" />
                        <span data-testid="text-account-email">{MAURICE_INFO.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-amber-600" />
                        <span data-testid="text-account-phone1">{MAURICE_INFO.phone1}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-amber-600" />
                        <span data-testid="text-account-phone2">{MAURICE_INFO.phone2}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-amber-200">
                      <p className="text-xs text-amber-700 font-medium">Portal Link:</p>
                      <p className="text-xs text-amber-600 break-all" data-testid="text-account-portal-link">{MAURICE_INFO.portalLink}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-amber-300 text-amber-800 hover:bg-amber-100"
                      onClick={() => logoutMutation.mutate()}
                      data-testid="button-logout-sidebar"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Show login prompt if not authenticated
  if (authLoading) {
    return (
      <Layout>
        <section className="bg-gradient-to-br from-amber-950 via-amber-900 to-orange-950 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl sm:text-5xl font-display mb-4">Payzium</h1>
            <p className="text-lg text-amber-200">Loading...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!verifiedAdmin && (!user || user.role !== "admin")) {
    return (
      <Layout>
        <PayziumLoginForm onSuccess={async () => { 
          // Invalidate cache first
          await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
          // Fetch fresh data directly (bypasses 304 cache issue)
          try {
            const response = await fetch("/api/auth/me", { credentials: "include" });
            if (response.ok) {
              const data = await response.json();
              if (data.user && data.user.role === "admin") {
                // Set local verified state to force portal render
                setVerifiedAdmin(true);
                // Also update query cache for consistency (use correct shape)
                queryClient.setQueryData(["/api/auth/me"], data);
              }
            }
          } catch (e) {
            console.error("Auth verification failed:", e);
          }
        }} />
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-gradient-to-br from-amber-950 via-amber-900 to-orange-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <img src="/payzium-lightning-logo.png" alt="Payzium" className="h-16 w-auto" />
            <div>
              <h1 className="text-3xl sm:text-5xl font-display mb-1">Payzium</h1>
              <p className="text-lg text-amber-200">Contract Management Portal</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 min-h-screen relative overflow-hidden">
        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
          style={{ minHeight: '100%' }}
        >
          <source src="/payzium-bg.mp4" type="video/mp4" />
        </video>
        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-stone-100/40 z-[1]"></div>
        
        <div className="container mx-auto px-4 relative z-[2]">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-7 mb-8">
                  <TabsTrigger value="dashboard" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white" data-testid="tab-dashboard">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </TabsTrigger>
                  <TabsTrigger value="send" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white" data-testid="tab-send">
                    <Send className="w-4 h-4 mr-2" /> Send
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white" data-testid="tab-pending">
                    <Clock className="w-4 h-4 mr-2" /> Pending ({contractSends.filter(s => s.status === "pending").length})
                  </TabsTrigger>
                  <TabsTrigger value="signed" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white" data-testid="tab-signed">
                    <CheckCircle className="w-4 h-4 mr-2" /> Signed ({signedAgreements.length})
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white" data-testid="tab-templates">
                    <FileEdit className="w-4 h-4 mr-2" /> Templates
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white" data-testid="tab-upload">
                    <Sparkles className="w-4 h-4 mr-2" /> AI Upload
                  </TabsTrigger>
                  <TabsTrigger value="envelopes" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white" data-testid="tab-envelopes">
                    <Users className="w-4 h-4 mr-2" /> Envelopes
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white" data-testid="tab-analytics">
                    <BarChart3 className="w-4 h-4 mr-2" /> Stats
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5" /> Contract Dashboard
                      </CardTitle>
                      <p className="text-sm text-gray-600">Overview of all contracts grouped by template</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200" data-testid="stat-total-sent">
                            <p className="text-sm text-purple-600 font-medium">Total Sent</p>
                            <p className="text-2xl font-bold text-purple-800">{contractSends.length}</p>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200" data-testid="stat-pending">
                            <p className="text-sm text-amber-600 font-medium">Pending</p>
                            <p className="text-2xl font-bold text-amber-800">{contractSends.filter(s => s.status === "pending").length}</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200" data-testid="stat-signed">
                            <p className="text-sm text-green-600 font-medium">Signed</p>
                            <p className="text-2xl font-bold text-green-800">{signedAgreements.length}</p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg border border-red-200" data-testid="stat-voided">
                            <p className="text-sm text-red-600 font-medium">Voided</p>
                            <p className="text-2xl font-bold text-red-800">{contractSends.filter(s => s.status === "voided").length}</p>
                          </div>
                        </div>

                        {/* Contracts by Template */}
                        <div>
                          <h3 className="font-semibold text-lg text-purple-800 mb-4">Contracts by Template</h3>
                          <div className="space-y-4">
                            {templates.map((template) => {
                              const templateSends = contractSends.filter(s => s.templateId === template.id);
                              const pendingCount = templateSends.filter(s => s.status === "pending").length;
                              const signedCount = templateSends.filter(s => s.status === "signed").length;
                              const voidedCount = templateSends.filter(s => s.status === "voided").length;
                              const totalCount = templateSends.length;
                              const activeCount = totalCount - voidedCount;
                              const signedPercent = activeCount > 0 ? Math.round((signedCount / activeCount) * 100) : 0;

                              return (
                                <div key={template.id} className="bg-white border rounded-lg p-4" data-testid={`template-row-${template.id}`}>
                                  <div className="flex items-center justify-between mb-3">
                                    <div>
                                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                                      <p className="text-sm text-gray-500">{template.description || "No description"}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-lg font-semibold text-purple-700">{totalCount} sent</p>
                                      <p className="text-sm text-gray-500">{signedPercent}% signed</p>
                                    </div>
                                  </div>
                                  
                                  {/* Progress bar */}
                                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                    <div 
                                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                                      style={{ width: `${signedPercent}%` }}
                                    />
                                  </div>
                                  
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1 text-amber-600">
                                      <Clock className="w-4 h-4" /> {pendingCount} pending
                                    </span>
                                    <span className="flex items-center gap-1 text-green-600">
                                      <CheckCircle className="w-4 h-4" /> {signedCount} signed
                                    </span>
                                    {voidedCount > 0 && (
                                      <span className="flex items-center gap-1 text-red-600">
                                        <X className="w-4 h-4" /> {voidedCount} voided
                                      </span>
                                    )}
                                  </div>

                                  {/* Recipients list */}
                                  {templateSends.length > 0 && (
                                    <div className="mt-4 border-t pt-3">
                                      <p className="text-xs font-medium text-gray-500 mb-2">Recipients:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {templateSends.map((send) => (
                                          <span 
                                            key={send.id}
                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                              send.status === "signed" 
                                                ? "bg-green-100 text-green-700" 
                                                : send.status === "voided"
                                                ? "bg-red-100 text-red-700 line-through"
                                                : "bg-amber-100 text-amber-700"
                                            }`}
                                            data-testid={`recipient-badge-${send.id}`}
                                          >
                                            {send.status === "signed" ? <CheckCircle className="w-3 h-3" /> : send.status === "voided" ? <X className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                            {send.recipientName}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {templates.length === 0 && (
                              <p className="text-center text-gray-500 py-8">No templates yet. Create one in the Templates tab.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="send">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Send className="w-5 h-5" /> Send a New Contract
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="template">Contract Template *</Label>
                          <Select
                            value={formData.templateId}
                            onValueChange={(value) => setFormData({ ...formData, templateId: value })}
                          >
                            <SelectTrigger data-testid="select-template">
                              <SelectValue placeholder="Select a contract template" />
                            </SelectTrigger>
                            <SelectContent>
                              {templates.map((template) => (
                                <SelectItem key={template.id} value={template.id.toString()}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <Button
                            type="button"
                            variant={!batchMode ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBatchMode(false)}
                            className={!batchMode ? "bg-purple-700 hover:bg-purple-800" : ""}
                            data-testid="button-single-send-mode"
                          >
                            Single Send
                          </Button>
                          <Button
                            type="button"
                            variant={batchMode ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBatchMode(true)}
                            className={batchMode ? "bg-amber-600 hover:bg-amber-700" : ""}
                            data-testid="button-batch-send-mode"
                          >
                            <Users className="w-4 h-4 mr-2" /> Batch Send (Multiple)
                          </Button>
                        </div>

                        {!batchMode ? (
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipientName">Recipient Name *</Label>
                              <Input
                                id="recipientName"
                                value={formData.recipientName}
                                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                placeholder="John Doe"
                                className="text-brand-navy"
                                data-testid="input-recipient-name"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="recipientEmail">Recipient Email *</Label>
                              <Input
                                id="recipientEmail"
                                type="email"
                                value={formData.recipientEmail}
                                onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                                placeholder="john@example.com"
                                className="text-brand-navy"
                                data-testid="input-recipient-email"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="recipientPhone">Recipient Phone (Optional)</Label>
                              <Input
                                id="recipientPhone"
                                type="tel"
                                value={formData.recipientPhone}
                                onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                                placeholder="(555) 123-4567"
                                className="text-brand-navy"
                                data-testid="input-recipient-phone"
                              />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                              <Button
                                type="submit"
                                className="flex-1 bg-amber-600 hover:bg-amber-700"
                                disabled={sendContractMutation.isPending}
                                data-testid="button-send-contract"
                              >
                                {sendContractMutation.isPending ? "Sending..." : "Send Contract"}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                className="flex-1 border-amber-600 text-amber-600 hover:bg-amber-50"
                                onClick={handleSignItMyself}
                                data-testid="button-sign-myself"
                              >
                                <Pen className="w-4 h-4 mr-2" /> Sign It Myself
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <div className="space-y-4" data-testid="batch-send-section">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-purple-800">Recipients List</h3>
                              <Button
                                type="button"
                                size="sm"
                                onClick={addRecipient}
                                className="bg-green-600 hover:bg-green-700"
                                data-testid="button-add-recipient"
                              >
                                <Plus className="w-4 h-4 mr-1" /> Add Recipient
                              </Button>
                            </div>

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {recipients.map((recipient, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white space-y-3" data-testid={`recipient-row-${index}`}>
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-sm text-gray-600">Recipient #{index + 1}</span>
                                    {recipients.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeRecipient(index)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        data-testid={`button-remove-recipient-${index}`}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input
                                      placeholder="Name *"
                                      value={recipient.name}
                                      onChange={(e) => updateRecipient(index, "name", e.target.value)}
                                      className="text-brand-navy"
                                      data-testid={`input-batch-name-${index}`}
                                    />
                                    <Input
                                      type="email"
                                      placeholder="Email *"
                                      value={recipient.email}
                                      onChange={(e) => updateRecipient(index, "email", e.target.value)}
                                      className="text-brand-navy"
                                      data-testid={`input-batch-email-${index}`}
                                    />
                                    <Input
                                      type="tel"
                                      placeholder="Phone (optional)"
                                      value={recipient.phone}
                                      onChange={(e) => updateRecipient(index, "phone", e.target.value)}
                                      className="text-brand-navy"
                                      data-testid={`input-batch-phone-${index}`}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="pt-4 border-t">
                              <Button
                                type="button"
                                onClick={handleBatchSend}
                                disabled={batchSending}
                                className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6"
                                data-testid="button-batch-send-all"
                              >
                                {batchSending ? (
                                  <>Sending to {recipients.filter(r => r.name && r.email).length} recipients...</>
                                ) : (
                                  <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Send to All ({recipients.filter(r => r.name && r.email).length} recipients)
                                  </>
                                )}
                              </Button>
                            </div>

                            {batchResults && (
                              <div className={`p-4 rounded-lg border ${batchResults.totalFailed > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`} data-testid="batch-results-summary">
                                <p className="font-medium mb-2" data-testid="text-batch-results-count">
                                  {batchResults.totalFailed === 0 
                                    ? `All ${batchResults.totalSent} contracts sent successfully!`
                                    : `Sent ${batchResults.totalSent} of ${batchResults.totalSent + batchResults.totalFailed} contracts`
                                  }
                                </p>
                                <div className="space-y-1 text-sm">
                                  {batchResults.results.map((result, i) => (
                                    <div key={i} className={`flex items-center gap-2 ${result.success ? 'text-green-700' : 'text-red-600'}`} data-testid={`batch-result-${i}`}>
                                      {result.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                      <span>{result.recipient}</span>
                                      {result.error && <span className="text-xs">({result.error})</span>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {lastSigningUrl && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800 font-medium mb-2">Contract Sent! Signing Link:</p>
                          <div className="flex items-center gap-2">
                            <Input value={lastSigningUrl} readOnly className="text-sm text-brand-navy" />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(lastSigningUrl)}
                              data-testid="button-copy-link"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => window.open(lastSigningUrl, "_blank")}
                              data-testid="button-open-link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pending">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Pending Contracts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {contractSends.filter(s => s.status === "pending").length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No pending contracts</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4">Recipient</th>
                                <th className="text-left py-3 px-4">Email</th>
                                <th className="text-left py-3 px-4">Sent</th>
                                <th className="text-left py-3 px-4">Expires</th>
                                <th className="text-left py-3 px-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {contractSends.filter(s => s.status === "pending").map((send) => {
                                const isExpired = new Date(send.tokenExpiresAt) < new Date();
                                return (
                                <tr key={send.id} className={`border-b hover:bg-gray-50 ${isExpired ? 'bg-red-50' : ''}`} data-testid={`pending-row-${send.id}`}>
                                  <td className="py-3 px-4">{send.recipientName}</td>
                                  <td className="py-3 px-4">{send.recipientEmail}</td>
                                  <td className="py-3 px-4">{new Date(send.sentAt).toLocaleDateString()}</td>
                                  <td className="py-3 px-4">
                                    <span className={isExpired ? 'text-red-600 font-medium' : ''}>
                                      {new Date(send.tokenExpiresAt).toLocaleDateString()}
                                      {isExpired && ' (Expired)'}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(getSigningUrl(send.signToken))}
                                        data-testid={`button-copy-link-${send.id}`}
                                      >
                                        <Copy className="w-4 h-4 mr-1" /> Copy
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                        onClick={async () => {
                                          try {
                                            const res = await fetch(`/api/csu/contract-sends/${send.id}/resend`, {
                                              method: 'POST',
                                              credentials: 'include',
                                            });
                                            const data = await res.json();
                                            if (res.ok) {
                                              toast({ title: "Reminder Sent!", description: `New link sent to ${send.recipientEmail}` });
                                              queryClient.invalidateQueries({ queryKey: ["/api/csu/contract-sends"] });
                                            } else {
                                              toast({ title: "Error", description: data.message, variant: "destructive" });
                                            }
                                          } catch (err) {
                                            toast({ title: "Error", description: "Failed to resend", variant: "destructive" });
                                          }
                                        }}
                                        data-testid={`button-resend-${send.id}`}
                                      >
                                        <RotateCcw className="w-4 h-4 mr-1" /> Resend
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={async () => {
                                          if (!confirm(`Void contract for ${send.recipientName}? This cannot be undone.`)) return;
                                          try {
                                            const res = await fetch(`/api/csu/contract-sends/${send.id}/void`, {
                                              method: 'POST',
                                              credentials: 'include',
                                            });
                                            const data = await res.json();
                                            if (res.ok) {
                                              toast({ title: "Contract Voided", description: `Contract for ${send.recipientName} has been cancelled` });
                                              queryClient.invalidateQueries({ queryKey: ["/api/csu/contract-sends"] });
                                            } else {
                                              toast({ title: "Error", description: data.message, variant: "destructive" });
                                            }
                                          } catch (err) {
                                            toast({ title: "Error", description: "Failed to void contract", variant: "destructive" });
                                          }
                                        }}
                                        data-testid={`button-void-${send.id}`}
                                      >
                                        <X className="w-4 h-4 mr-1" /> Void
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              );})}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="signed">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Signed Agreements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {signedAgreements.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No signed agreements yet</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4">Name</th>
                                <th className="text-left py-3 px-4">Email</th>
                                <th className="text-left py-3 px-4">Phone</th>
                                <th className="text-left py-3 px-4">Signed</th>
                                <th className="text-left py-3 px-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {signedAgreements.map((agreement) => (
                                <tr key={agreement.id} className="border-b hover:bg-gray-50" data-testid={`signed-row-${agreement.id}`}>
                                  <td className="py-3 px-4">{agreement.signerName}</td>
                                  <td className="py-3 px-4">{agreement.signerEmail}</td>
                                  <td className="py-3 px-4">{agreement.signerPhone || "-"}</td>
                                  <td className="py-3 px-4">{new Date(agreement.signedAt).toLocaleDateString()}</td>
                                  <td className="py-3 px-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(`/api/csu/signed-agreements/${agreement.id}/pdf`, "_blank")}
                                      data-testid={`download-agreement-${agreement.id}`}
                                    >
                                      <Download className="w-4 h-4 mr-1" /> Download
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="templates">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                          <FileEdit className="w-5 h-5" /> Contract Templates
                        </CardTitle>
                        <Button
                          onClick={() => {
                            setEditingTemplate(null);
                            setTemplateForm({
                              name: "",
                              description: "",
                              content: "",
                              isActive: true,
                              fields: [],
                            });
                            setShowTemplateBuilder(true);
                          }}
                          className="bg-amber-600 hover:bg-amber-700"
                          data-testid="button-new-template"
                        >
                          <Plus className="w-4 h-4 mr-2" /> New Template
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {templates.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-500">No templates yet</p>
                          <p className="text-sm text-gray-400">Create your first contract template to get started</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {templates.map((template) => (
                            <div
                              key={template.id}
                              className="border rounded-lg p-4 hover:border-amber-300 transition-colors"
                              data-testid={`template-card-${template.id}`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-lg">{template.name}</h3>
                                  <p className="text-sm text-gray-500">{template.description || "No description"}</p>
                                  <div className="flex gap-2 mt-2">
                                    <span className={`px-2 py-1 rounded text-xs ${template.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                                      {template.isActive ? "Active" : "Inactive"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                      setEditingTemplate(template);
                                      // Fetch template with fields
                                      try {
                                        const response = await fetch(`/api/csu/templates/${template.id}`, {
                                          credentials: "include",
                                        });
                                        if (response.ok) {
                                          const templateWithFields = await response.json();
                                          setTemplateForm({
                                            name: templateWithFields.name,
                                            description: templateWithFields.description || "",
                                            content: templateWithFields.content,
                                            isActive: templateWithFields.isActive,
                                            fields: templateWithFields.fields?.map((f: any) => ({
                                              fieldKey: f.fieldKey,
                                              label: f.label,
                                              placeholder: f.placeholder || "",
                                              fieldType: f.fieldType || "text",
                                              required: f.required ?? true,
                                              order: f.order || 0,
                                            })) || [],
                                          });
                                        } else {
                                          setTemplateForm({
                                            name: template.name,
                                            description: template.description || "",
                                            content: template.content,
                                            isActive: template.isActive,
                                            fields: [],
                                          });
                                        }
                                      } catch {
                                        setTemplateForm({
                                          name: template.name,
                                          description: template.description || "",
                                          content: template.content,
                                          isActive: template.isActive,
                                          fields: [],
                                        });
                                      }
                                      setShowTemplateBuilder(true);
                                    }}
                                    data-testid={`button-edit-template-${template.id}`}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="upload">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-600" /> AI Contract Upload
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Upload a PDF or Word document and our AI will automatically detect form fields and create a fillable template.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div 
                        className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors cursor-pointer bg-amber-50/50"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleDocumentUpload}
                          className="hidden"
                          data-testid="input-document-upload"
                        />
                        {uploadState.isUploading ? (
                          <div className="space-y-3">
                            <Loader2 className="w-12 h-12 mx-auto text-amber-600 animate-spin" />
                            <p className="text-amber-700 font-medium">Analyzing {uploadState.fileName}...</p>
                            <p className="text-sm text-gray-500">AI is scanning for form fields</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Upload className="w-12 h-12 mx-auto text-amber-600" />
                            <p className="text-amber-700 font-medium">Click to upload a contract document</p>
                            <p className="text-sm text-gray-500">Supports PDF, DOC, and DOCX files (max 10MB)</p>
                          </div>
                        )}
                      </div>

                      {uploadState.error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                          <p className="font-medium">Error</p>
                          <p className="text-sm">{uploadState.error}</p>
                        </div>
                      )}

                      {uploadState.analysis && (
                        <div className="space-y-6">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                              <CheckCircle className="w-5 h-5" />
                              Analysis Complete
                            </div>
                            <p className="text-sm text-gray-700">{uploadState.analysis.summary}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <FileText className="w-5 h-5 text-amber-600" />
                              Detected Fields ({uploadState.analysis.detectedFields.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {uploadState.analysis.detectedFields.map((field, idx) => (
                                <div key={idx} className="bg-white border rounded-lg p-3 shadow-sm">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-900">{field.name}</span>
                                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">{field.type}</span>
                                  </div>
                                  <p className="text-xs text-gray-500">{field.description}</p>
                                  <code className="text-xs text-purple-600 bg-purple-50 px-1 rounded mt-1 inline-block">{field.placeholder}</code>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Template Preview</h3>
                            <div className="bg-white border rounded-lg p-4 max-h-80 overflow-y-auto text-sm font-mono whitespace-pre-wrap">
                              {uploadState.analysis.generatedTemplate.substring(0, 2000)}
                              {uploadState.analysis.generatedTemplate.length > 2000 && "..."}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              onClick={createTemplateFromAnalysis}
                              className="bg-amber-600 hover:bg-amber-700 text-white"
                              data-testid="button-create-template"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Create Template
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setUploadState({ isUploading: false, fileName: null, analysis: null, error: null })}
                              data-testid="button-clear-analysis"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Upload Another
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="envelopes">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" /> Multi-Recipient Envelopes
                      </CardTitle>
                      <p className="text-sm text-gray-500">Create envelopes with signing order - sequential, parallel, or mixed routing</p>
                    </CardHeader>
                    <CardContent>
                      <EnvelopesPanel templates={templates} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics">
                  <AnalyticsPanel />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar - Account Info */}
            <div className="space-y-6" data-testid="main-account-info-panel">
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-amber-800">
                    <Building className="w-5 h-5" /> Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-amber-900" data-testid="text-main-account-name">{MAURICE_INFO.name}</p>
                      <p className="text-sm text-amber-700" data-testid="text-main-account-title">{MAURICE_INFO.title}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-amber-600" />
                      <span data-testid="text-main-account-email">{MAURICE_INFO.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-amber-600" />
                      <span data-testid="text-main-account-phone1">{MAURICE_INFO.phone1}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-amber-600" />
                      <span data-testid="text-main-account-phone2">{MAURICE_INFO.phone2}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <ExternalLink className="w-4 h-4 text-amber-600" />
                      <a href={`https://${MAURICE_INFO.website}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline" data-testid="link-main-account-website">
                        {MAURICE_INFO.website}
                      </a>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-amber-200">
                    <p className="text-xs text-amber-700 font-medium mb-1">Your Portal Link:</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-amber-600 break-all flex-1" data-testid="text-main-account-portal-link">{MAURICE_INFO.portalLink}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(`https://${MAURICE_INFO.portalLink}`)}
                        data-testid="button-copy-portal-link"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-amber-300 text-amber-800 hover:bg-amber-100"
                    onClick={() => logoutMutation.mutate()}
                    data-testid="button-logout-main"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Template Builder Dialog */}
      <Dialog open={showTemplateBuilder} onOpenChange={setShowTemplateBuilder}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileEdit className="w-5 h-5" />
              {editingTemplate ? "Edit Template" : "Create New Template"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name *</Label>
                <Input
                  id="template-name"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  placeholder="e.g., Affiliate Agreement"
                  data-testid="input-template-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Input
                  id="template-description"
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                  placeholder="Brief description of this template"
                  data-testid="input-template-description"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-content">Template Content (HTML) *</Label>
              <p className="text-xs text-gray-500 mb-2">
                Use placeholders like [NAME], [EMAIL], [DATE], [INITIALS], [SIGNATURE] that will be replaced when signing.
              </p>
              <textarea
                id="template-content"
                value={templateForm.content}
                onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                className="w-full min-h-[300px] p-4 border rounded-md font-mono text-sm"
                placeholder="<div>Your contract content here...</div>"
                data-testid="textarea-template-content"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Custom Form Fields</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTemplateForm({
                      ...templateForm,
                      fields: [
                        ...templateForm.fields,
                        {
                          fieldKey: `field_${Date.now()}`,
                          label: "",
                          placeholder: "",
                          fieldType: "text",
                          required: true,
                          order: templateForm.fields.length,
                        },
                      ],
                    });
                  }}
                  data-testid="button-add-field"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Field
                </Button>
              </div>
              
              {templateForm.fields.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No custom fields. Add fields to collect additional information when signing.
                </p>
              ) : (
                <div className="space-y-3">
                  {templateForm.fields.map((field, index) => (
                    <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg" data-testid={`field-row-${index}`}>
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs">Field Key</Label>
                          <Input
                            value={field.fieldKey}
                            onChange={(e) => {
                              const newFields = [...templateForm.fields];
                              newFields[index].fieldKey = e.target.value;
                              setTemplateForm({ ...templateForm, fields: newFields });
                            }}
                            placeholder="company_name"
                            className="text-sm"
                            data-testid={`input-field-key-${index}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Label</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => {
                              const newFields = [...templateForm.fields];
                              newFields[index].label = e.target.value;
                              setTemplateForm({ ...templateForm, fields: newFields });
                            }}
                            placeholder="Company Name"
                            className="text-sm"
                            data-testid={`input-field-label-${index}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={field.fieldType}
                            onValueChange={(value) => {
                              const newFields = [...templateForm.fields];
                              newFields[index].fieldType = value;
                              setTemplateForm({ ...templateForm, fields: newFields });
                            }}
                          >
                            <SelectTrigger className="text-sm" data-testid={`select-field-type-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="textarea">Text Area</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          const newFields = templateForm.fields.filter((_, i) => i !== index);
                          setTemplateForm({ ...templateForm, fields: newFields });
                        }}
                        data-testid={`button-delete-field-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="template-active"
                checked={templateForm.isActive}
                onCheckedChange={(checked) => setTemplateForm({ ...templateForm, isActive: checked === true })}
              />
              <Label htmlFor="template-active">Template is active (visible in dropdown)</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowTemplateBuilder(false)}
                data-testid="button-cancel-template"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!templateForm.name || !templateForm.content) {
                    toast({
                      title: "Error",
                      description: "Please fill in template name and content",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  try {
                    const url = editingTemplate
                      ? `/api/csu/templates/${editingTemplate.id}`
                      : "/api/csu/templates";
                    const method = editingTemplate ? "PUT" : "POST";
                    
                    const response = await fetch(url, {
                      method,
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({
                        name: templateForm.name,
                        description: templateForm.description || null,
                        content: templateForm.content,
                        isActive: templateForm.isActive,
                        fields: templateForm.fields,
                      }),
                    });
                    
                    if (!response.ok) {
                      const error = await response.json();
                      throw new Error(error.message || "Failed to save template");
                    }
                    
                    toast({
                      title: "Success",
                      description: editingTemplate ? "Template updated successfully" : "Template created successfully",
                    });
                    
                    queryClient.invalidateQueries({ queryKey: ["/api/csu/templates"] });
                    setShowTemplateBuilder(false);
                  } catch (error: any) {
                    toast({
                      title: "Error",
                      description: error.message || "Failed to save template",
                      variant: "destructive",
                    });
                  }
                }}
                className="bg-amber-600 hover:bg-amber-700"
                data-testid="button-save-template"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingTemplate ? "Update Template" : "Create Template"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
