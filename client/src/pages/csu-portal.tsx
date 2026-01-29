import { useState, useRef, useEffect, useCallback } from "react";
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
import { Send, FileText, CheckCircle, Clock, Download, Copy, ExternalLink, User, Phone, Mail, Pen, RotateCcw, Building, LogIn, BarChart3, Eye, EyeOff, Users, Globe, MapPin } from "lucide-react";

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
          
          {/* WELCOME BACK Text */}
          <div 
            className={`absolute transition-all ${
              cinematicPhase === 'welcome' ? 'opacity-100 scale-100' : 
              cinematicPhase === 'welcomeOut' ? 'opacity-0 scale-95' : 'opacity-0 scale-110'
            }`}
            style={{ transitionDuration: '500ms' }}
          >
            <h1 
              className="text-4xl sm:text-6xl font-black tracking-[0.15em] text-white text-center relative"
              style={{
                textShadow: cinematicPhase === 'welcome' ? '0 0 10px #fff, 0 0 20px #ffd700, 0 0 40px #ffd700, 0 0 80px #ff8c00' : 'none',
                animation: cinematicPhase === 'welcome' ? 'welcomePulse 2s ease-in-out' : 'none'
              }}
            >
              <span className="block mb-2 text-amber-400" style={{ textShadow: '0 0 15px #ffd700, 0 0 30px #ff8c00' }}>Welcome Back</span>
              <span className="block text-white">Mr. Verrelli</span>
              {/* Electric sparks around text */}
              {cinematicPhase === 'welcome' && [...Array(12)].map((_, i) => (
                <span 
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                    boxShadow: '0 0 6px #ffd700, 0 0 12px #ff8c00',
                    animation: `sparkBurst ${0.3 + Math.random() * 0.5}s ease-out forwards`,
                    animationDelay: `${Math.random() * 1}s`
                  }}
                />
              ))}
            </h1>
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

function AnalyticsPanel() {
  const [selectedIp, setSelectedIp] = useState<string | null>(null);
  const [showIpModal, setShowIpModal] = useState(false);

  const { data: stats } = useQuery<PortalStats>({
    queryKey: ["/api/portal/stats/payzium"],
    refetchInterval: 30000,
  });

  const { data: activity = [] } = useQuery<PortalActivity[]>({
    queryKey: ["/api/portal/activity/payzium"],
    refetchInterval: 30000,
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
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
        <Card>
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
        <Card>
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
        <Card>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" /> Today's Visits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-amber-600" data-testid="stat-today-visits">
            {stats?.todayVisits ?? 0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
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
                  {activity.map((item) => (
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
  const [activeTab, setActiveTab] = useState("send");
  const [formData, setFormData] = useState({
    templateId: "",
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
  });
  const [lastSigningUrl, setLastSigningUrl] = useState<string | null>(null);
  const [showSelfSign, setShowSelfSign] = useState(false);
  const [selfSignData, setSelfSignData] = useState({
    initials: "",
    effectiveDate: new Date().toISOString().split("T")[0],
    agreedToTerms: false,
  });
  const [currentTemplate, setCurrentTemplate] = useState<CsuContractTemplate | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signedSuccessfully, setSignedSuccessfully] = useState(false);
  const [lastSignedAgreementId, setLastSignedAgreementId] = useState<number | null>(null);
  
  // Local state to track verified admin login (bypasses 304 cache issue)
  const [verifiedAdmin, setVerifiedAdmin] = useState(false);

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

  const { data: allTemplates = [] } = useQuery<CsuContractTemplate[]>({
    queryKey: ["/api/csu/templates"],
    enabled: !!user,
  });
  
  // Filter to only show Payzium-specific templates
  const PAYZIUM_TEMPLATE_NAMES = ["New Client Agreement", "Sign Affiliate Agreement"];
  const templates = allTemplates.filter(t => PAYZIUM_TEMPLATE_NAMES.includes(t.name));

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
      toast({
        title: "Contract Sent",
        description: data.message || "Contract has been sent successfully.",
      });
      setLastSigningUrl(data.signingUrl);
      trackActivity("contract_sent", { recipientEmail: formData.recipientEmail });
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
          address: MAURICE_INFO.website,
          initials: selfSignData.initials,
          effectiveDate: selfSignData.effectiveDate,
          signatureData,
          agreedToTerms: true,
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
                        setSelfSignData({ initials: "", effectiveDate: new Date().toISOString().split("T")[0], agreedToTerms: false });
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
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentTemplate.content) }}
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
                            onChange={(e) => setSelfSignData({ ...selfSignData, initials: e.target.value.toUpperCase() })}
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
    return <PayziumLoginForm onSuccess={async () => { 
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
    }} />;
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

      <section className="py-8 bg-stone-100 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="send" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white" data-testid="tab-send">
                    <Send className="w-4 h-4 mr-2" /> Send Contract
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white" data-testid="tab-pending">
                    <Clock className="w-4 h-4 mr-2" /> Pending ({contractSends.filter(s => s.status === "pending").length})
                  </TabsTrigger>
                  <TabsTrigger value="signed" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white" data-testid="tab-signed">
                    <CheckCircle className="w-4 h-4 mr-2" /> Signed ({signedAgreements.length})
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white" data-testid="tab-analytics">
                    <BarChart3 className="w-4 h-4 mr-2" /> Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="send">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Send className="w-5 h-5" /> Send a New Contract
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
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
                              {contractSends.filter(s => s.status === "pending").map((send) => (
                                <tr key={send.id} className="border-b hover:bg-gray-50" data-testid={`pending-row-${send.id}`}>
                                  <td className="py-3 px-4">{send.recipientName}</td>
                                  <td className="py-3 px-4">{send.recipientEmail}</td>
                                  <td className="py-3 px-4">{new Date(send.sentAt).toLocaleDateString()}</td>
                                  <td className="py-3 px-4">{new Date(send.tokenExpiresAt).toLocaleDateString()}</td>
                                  <td className="py-3 px-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => copyToClipboard(getSigningUrl(send.signToken))}
                                    >
                                      <Copy className="w-4 h-4 mr-1" /> Copy Link
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
