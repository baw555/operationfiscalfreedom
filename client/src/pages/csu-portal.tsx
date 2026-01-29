import { useState, useRef, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Send, FileText, CheckCircle, Clock, Download, Copy, ExternalLink, User, Phone, Mail, Pen, RotateCcw, Building, LogIn, BarChart3, Eye, Users, Globe } from "lucide-react";

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

// Payzium-specific login form component
function PayziumLoginForm({ onSuccess }: { onSuccess: () => Promise<void> | void }) {
  const { toast } = useToast();
  const [email, setEmail] = useState(() => localStorage.getItem("payzium_remembered_email") || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem("payzium_remembered_email"));
  const [isLoading, setIsLoading] = useState(false);

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
      
      // Save or clear remembered email
      if (rememberMe) {
        localStorage.setItem("payzium_remembered_email", email);
      } else {
        localStorage.removeItem("payzium_remembered_email");
      }
      
      // Wait for auth state to update before showing success
      await onSuccess();
      
      toast({
        title: "Welcome!",
        description: "Logged in successfully",
      });
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

  const [animationPhase, setAnimationPhase] = useState(0);
  const [showLightning, setShowLightning] = useState(false);
  const [lightningPosition, setLightningPosition] = useState({ x: 50, y: 0 });

  // Lightning effect
  useEffect(() => {
    const lightningInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setLightningPosition({ x: Math.random() * 100, y: 0 });
        setShowLightning(true);
        setTimeout(() => setShowLightning(false), 150);
        setTimeout(() => {
          setShowLightning(true);
          setTimeout(() => setShowLightning(false), 100);
        }, 200);
      }
    }, 800);
    return () => clearInterval(lightningInterval);
  }, []);

  // Logo animation phases: 0=heart, 1=brain, 2=logo construction, 3=fire
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationPhase(1), 3000),
      setTimeout(() => setAnimationPhase(2), 6000),
      setTimeout(() => setAnimationPhase(3), 9000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Lightning flash overlay */}
      {showLightning && (
        <div className="absolute inset-0 z-50 pointer-events-none bg-white/20 animate-pulse" />
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Lightning bolts */}
        {showLightning && (
          <svg className="absolute inset-0 w-full h-full z-40 pointer-events-none" style={{ left: `${lightningPosition.x - 50}%` }}>
            <path
              d="M200,0 L180,120 L220,120 L160,280 L200,280 L120,450 L180,300 L140,300 L200,150 L160,150 Z"
              fill="url(#lightningGradient)"
              className="animate-pulse"
              style={{ filter: 'drop-shadow(0 0 20px #a855f7) drop-shadow(0 0 40px #7c3aed)' }}
            />
            <defs>
              <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
        )}
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'gridMove 20s linear infinite'
          }} />
        </div>
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
            style={{
              left: `${(i * 3.33) % 100}%`,
              top: `${(i * 7.77) % 100}%`,
              animation: `float ${5 + (i % 5)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.3) % 5}s`
            }}
          />
        ))}

        {/* Electric arcs during brain phase */}
        {animationPhase === 1 && (
          <>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent origin-left"
                style={{
                  width: `${100 + i * 30}px`,
                  transform: `rotate(${i * 45}deg)`,
                  animation: `electricArc 0.3s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0.6
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Animated Logo Sequence */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              {/* Phase 0: Massive Beating Heart with pulse rings */}
              <div className={`transition-all duration-700 ${animationPhase === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-0 absolute'}`}>
                <div className="w-48 h-48 flex items-center justify-center relative">
                  {/* Pulse rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-32 h-32 rounded-full border-4 border-red-500/50 animate-ping" />
                    <div className="absolute w-40 h-40 rounded-full border-2 border-red-400/30 animate-ping" style={{ animationDelay: '0.3s' }} />
                    <div className="absolute w-48 h-48 rounded-full border border-red-300/20 animate-ping" style={{ animationDelay: '0.6s' }} />
                  </div>
                  {/* Blood vessel veins */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-16 bg-gradient-to-t from-red-600 via-red-500 to-transparent origin-bottom rounded-full"
                      style={{
                        bottom: '50%',
                        left: '50%',
                        transform: `translateX(-50%) rotate(${i * 45}deg)`,
                        animation: 'veinPulse 1s ease-in-out infinite',
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                  {/* Main heart */}
                  <div className="animate-heartbeat relative z-10">
                    <svg viewBox="0 0 24 24" className="w-28 h-28 drop-shadow-[0_0_40px_rgba(239,68,68,1)] drop-shadow-[0_0_80px_rgba(239,68,68,0.6)]">
                      <defs>
                        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="50%" stopColor="#dc2626" />
                          <stop offset="100%" stopColor="#b91c1c" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#heartGrad)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Phase 1: Electrified Brain with massive lightning */}
              <div className={`transition-all duration-700 ${animationPhase === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0 absolute'}`}>
                <div className="w-56 h-56 flex items-center justify-center relative">
                  {/* Electric field rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-40 h-40 rounded-full border-2 border-purple-400/60 animate-spin" style={{ animationDuration: '3s' }} />
                    <div className="absolute w-48 h-48 rounded-full border border-violet-400/40 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
                  </div>
                  {/* Actual brain SVG */}
                  <svg viewBox="0 0 512 512" className="w-32 h-32 relative z-10 animate-brainPulse">
                    <defs>
                      <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                      <filter id="brainGlow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <path fill="url(#brainGrad)" filter="url(#brainGlow)" d="M184 0c-22.5 0-42 12.5-52.1 31C117.2 17.6 97.3 8 76 8 34 8 0 42 0 84c0 27.5 14.6 51.5 36.4 64.9C14.5 163.6 0 186.9 0 214c0 38.5 28.5 70.3 65.5 75.6C51.5 304.3 40 325 40 348c0 41.8 33.9 75.7 75.7 75.7 16 0 30.8-5 43-13.4C171.5 438.5 197.8 460 228 460c19.8 0 37.7-8 50.7-21 13 13 30.9 21 50.7 21 30.2 0 56.5-21.5 69.3-49.7 12.2 8.4 27 13.4 43 13.4 41.8 0 75.7-33.9 75.7-75.7 0-23-10.4-43.7-26.7-57.6 36-5.3 64.5-37.1 64.5-75.6 0-27.1-14.5-50.4-36.4-63.5C491.4 135.5 506 111.5 506 84c0-42-34-76-76-76-21.3 0-41.2 9.6-54.9 26C365 12.5 345.5 0 323 0c-27.2 0-50.7 15.6-62.1 38.4C249.5 15.6 226 0 184 0zm0 40c27.6 0 50 22.4 50 50s-22.4 50-50 50-50-22.4-50-50 22.4-50 50-50zm139 0c27.6 0 50 22.4 50 50s-22.4 50-50 50-50-22.4-50-50 22.4-50 50-50z"/>
                  </svg>
                  {/* Lightning bolts shooting outward */}
                  {[...Array(12)].map((_, i) => (
                    <svg
                      key={i}
                      className="absolute w-24 h-6 origin-left"
                      viewBox="0 0 100 24"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `translateY(-50%) rotate(${i * 30}deg)`,
                        animation: `lightningShoot 0.3s ease-out infinite`,
                        animationDelay: `${i * 0.08}s`
                      }}
                    >
                      <path
                        d="M0,12 L20,6 L15,12 L40,4 L30,12 L60,2 L45,12 L80,0 L55,12 L100,12"
                        stroke="url(#boltGrad)"
                        strokeWidth="2"
                        fill="none"
                        style={{ filter: 'drop-shadow(0 0 4px #a855f7)' }}
                      />
                      <defs>
                        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="30%" stopColor="#c084fc" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </svg>
                  ))}
                  {/* Electric sparks */}
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        animation: `spark 0.5s ease-out infinite`,
                        animationDelay: `${i * 0.1}s`,
                        boxShadow: '0 0 6px #a855f7, 0 0 12px #7c3aed'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Phase 2: Logo Construction - Dramatic assembly */}
              <div className={`transition-all duration-700 ${animationPhase === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0 absolute'}`}>
                <div className="w-64 h-64 flex items-center justify-center relative">
                  {/* Construction sparks */}
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 h-3 bg-gradient-to-t from-purple-500 to-white rounded-full"
                      style={{
                        top: `${10 + Math.random() * 80}%`,
                        left: `${10 + Math.random() * 80}%`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                        animation: `constructSpark 0.8s ease-out infinite`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    />
                  ))}
                  {/* Scanning lines */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-scanLine" />
                  </div>
                  {/* Logo with dramatic entrance */}
                  <img 
                    src="/attached_assets/ChatGPT_Image_Jan_28,_2026,_07_29_38_PM_1769646589950.png" 
                    alt="Payzium" 
                    className="w-52 h-52 object-contain animate-constructLogo relative z-10"
                    style={{ filter: 'brightness(1.3) drop-shadow(0 0 30px rgba(168,85,247,1)) drop-shadow(0 0 60px rgba(139,92,246,0.8))' }}
                  />
                  {/* Flash burst */}
                  <div className="absolute inset-0 bg-white/80 animate-flashBurst rounded-full" />
                </div>
              </div>

              {/* Phase 3: Massive Burning Logo with intense fire */}
              <div className={`transition-all duration-700 ${animationPhase === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-0 absolute'}`}>
                <div className="w-72 h-72 flex items-center justify-center relative">
                  {/* Massive fire backdrop */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Large flames */}
                    {[...Array(25)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-t-full"
                        style={{
                          bottom: '10%',
                          left: `${5 + i * 3.8}%`,
                          width: `${8 + Math.random() * 6}px`,
                          height: `${50 + Math.random() * 80}px`,
                          background: `linear-gradient(to top, #ea580c, #f97316, #fbbf24, #fef08a, transparent)`,
                          animation: `bigFlame ${0.2 + Math.random() * 0.3}s ease-in-out infinite`,
                          animationDelay: `${i * 0.05}s`,
                          filter: 'blur(1px)',
                          opacity: 0.9
                        }}
                      />
                    ))}
                    {/* Inner bright flames */}
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={`inner-${i}`}
                        className="absolute rounded-t-full"
                        style={{
                          bottom: '15%',
                          left: `${20 + i * 4}%`,
                          width: `${4 + Math.random() * 4}px`,
                          height: `${30 + Math.random() * 50}px`,
                          background: `linear-gradient(to top, #fbbf24, #fef08a, #ffffff, transparent)`,
                          animation: `bigFlame ${0.15 + Math.random() * 0.2}s ease-in-out infinite`,
                          animationDelay: `${i * 0.03}s`,
                          opacity: 0.95
                        }}
                      />
                    ))}
                  </div>
                  {/* Heat distortion ring */}
                  <div className="absolute w-60 h-60 rounded-full border-4 border-orange-500/30 animate-heatWave" />
                  {/* Main logo */}
                  <img 
                    src="/attached_assets/ChatGPT_Image_Jan_28,_2026,_07_29_38_PM_1769646589950.png" 
                    alt="Payzium" 
                    className="w-52 h-52 object-contain relative z-10 animate-fireGlow"
                    style={{ filter: 'brightness(1.4) drop-shadow(0 0 30px rgba(251,146,60,1)) drop-shadow(0 0 60px rgba(239,68,68,0.8)) drop-shadow(0 0 100px rgba(234,88,12,0.5))' }}
                  />
                  {/* Ember particles rising */}
                  {[...Array(25)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `${2 + Math.random() * 4}px`,
                        height: `${2 + Math.random() * 4}px`,
                        background: `radial-gradient(circle, #fef08a, #f97316)`,
                        left: `${15 + i * 3}%`,
                        bottom: '25%',
                        animation: `emberRise ${1.5 + Math.random() * 1.5}s ease-out infinite`,
                        animationDelay: `${i * 0.15}s`,
                        boxShadow: '0 0 4px #f97316, 0 0 8px #ea580c'
                      }}
                    />
                  ))}
                  {/* Smoke wisps */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={`smoke-${i}`}
                      className="absolute w-8 h-16 bg-gradient-to-t from-gray-600/40 to-transparent rounded-full blur-sm"
                      style={{
                        bottom: '60%',
                        left: `${25 + i * 7}%`,
                        animation: `smokeRise ${3 + Math.random() * 2}s ease-out infinite`,
                        animationDelay: `${i * 0.4}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-display text-white mb-2 tracking-tight">
              <span className={`bg-clip-text text-transparent transition-all duration-1000 ${
                animationPhase === 3 
                  ? 'bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 animate-fireText' 
                  : 'bg-gradient-to-r from-purple-200 via-white to-purple-200'
              }`}>
                Payzium
              </span>
            </h1>
            <p className="text-purple-300/80 text-lg">Contract Management Portal</p>
          </div>

          {/* Glassmorphism login card */}
          <div className="relative animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {/* Card glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-3xl blur-lg opacity-30 animate-pulse" />
            
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5 text-purple-400" />
                  Welcome Back
                </h2>
                <p className="text-purple-300/60 text-sm mt-1">Sign in to your account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2 group">
                  <Label htmlFor="email" className="text-purple-200 text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/50 transition-colors group-focus-within:text-purple-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      data-testid="input-payzium-email"
                      className="pl-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-purple-300/40 focus:border-purple-500 focus:ring-purple-500/20 focus:bg-white/10 transition-all duration-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label htmlFor="password" className="text-purple-200 text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/50 transition-colors group-focus-within:text-purple-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      data-testid="input-payzium-password"
                      className="pl-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-purple-300/40 focus:border-purple-500 focus:ring-purple-500/20 focus:bg-white/10 transition-all duration-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    data-testid="checkbox-payzium-remember"
                    className="border-purple-400/50 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label htmlFor="remember-me" className="text-sm text-purple-300/80 cursor-pointer">
                    Remember my email
                  </Label>
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading}
                  data-testid="button-payzium-login"
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </form>

              {/* Decorative bottom line */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-center text-purple-300/50 text-xs">
                  Secure portal access for authorized users only
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <p className="text-purple-300/40 text-sm">
              Powered by <span className="text-purple-400">Payzium</span>
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.4; }
          50% { transform: translateY(-20px); opacity: 0.8; }
        }
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          10% { transform: scale(1.15); }
          20% { transform: scale(1); }
          30% { transform: scale(1.15); }
          40% { transform: scale(1); }
        }
        @keyframes electricArc {
          0%, 100% { opacity: 0; transform: scaleX(0); }
          50% { opacity: 0.8; transform: scaleX(1); }
        }
        @keyframes brainZap {
          0% { opacity: 0; transform: scaleX(0) translateX(0); }
          30% { opacity: 1; transform: scaleX(1) translateX(10px); }
          100% { opacity: 0; transform: scaleX(0.5) translateX(30px); }
        }
        @keyframes constructLogo {
          0% { opacity: 0; transform: scale(0) rotate(-180deg); filter: blur(10px); }
          50% { opacity: 0.5; transform: scale(0.8) rotate(-10deg); filter: blur(5px); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0); }
        }
        @keyframes flash {
          0%, 20%, 40%, 60%, 80%, 100% { opacity: 1; }
          10%, 30%, 50%, 70%, 90% { opacity: 0.3; filter: brightness(2); }
        }
        @keyframes fireGlow {
          0%, 100% { filter: brightness(1.2) drop-shadow(0 0 15px rgba(251,146,60,0.8)) drop-shadow(0 0 30px rgba(239,68,68,0.5)); }
          50% { filter: brightness(1.4) drop-shadow(0 0 25px rgba(251,146,60,1)) drop-shadow(0 0 50px rgba(239,68,68,0.8)); }
        }
        @keyframes ember {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-80px) translateX(20px) scale(0); opacity: 0; }
        }
        @keyframes flame {
          0%, 100% { transform: scaleY(1) scaleX(1) translateY(0); opacity: 0.9; }
          25% { transform: scaleY(1.2) scaleX(0.9) translateY(-5px); opacity: 1; }
          50% { transform: scaleY(0.9) scaleX(1.1) translateY(-2px); opacity: 0.8; }
          75% { transform: scaleY(1.1) scaleX(0.95) translateY(-4px); opacity: 0.95; }
        }
        @keyframes fireText {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(251,146,60,0.8)); }
          50% { filter: drop-shadow(0 0 15px rgba(251,146,60,1)) drop-shadow(0 0 30px rgba(239,68,68,0.6)); }
        }
        @keyframes veinPulse {
          0%, 100% { transform: translateX(-50%) rotate(var(--rotation, 0deg)) scaleY(1); opacity: 0.6; }
          50% { transform: translateX(-50%) rotate(var(--rotation, 0deg)) scaleY(1.3); opacity: 1; }
        }
        @keyframes lightningShoot {
          0% { opacity: 0; transform: translateY(-50%) rotate(var(--rotation, 0deg)) scaleX(0); }
          20% { opacity: 1; transform: translateY(-50%) rotate(var(--rotation, 0deg)) scaleX(1); }
          100% { opacity: 0; transform: translateY(-50%) rotate(var(--rotation, 0deg)) scaleX(1.5); }
        }
        @keyframes spark {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(0); }
        }
        @keyframes brainPulse {
          0%, 100% { filter: url(#brainGlow) drop-shadow(0 0 20px rgba(168,85,247,0.8)); transform: scale(1); }
          50% { filter: url(#brainGlow) drop-shadow(0 0 40px rgba(168,85,247,1)); transform: scale(1.05); }
        }
        @keyframes constructSpark {
          0% { opacity: 1; transform: scale(1) rotate(0deg); }
          100% { opacity: 0; transform: scale(0) rotate(180deg) translateY(-20px); }
        }
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes flashBurst {
          0% { opacity: 0.8; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(2); }
        }
        @keyframes bigFlame {
          0%, 100% { transform: scaleY(1) scaleX(1) translateY(0); }
          25% { transform: scaleY(1.15) scaleX(0.85) translateY(-8px); }
          50% { transform: scaleY(0.9) scaleX(1.1) translateY(-3px); }
          75% { transform: scaleY(1.1) scaleX(0.9) translateY(-6px); }
        }
        @keyframes heatWave {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
        @keyframes emberRise {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
          50% { transform: translateY(-60px) translateX(10px) scale(0.8); opacity: 0.8; }
          100% { transform: translateY(-120px) translateX(-5px) scale(0); opacity: 0; }
        }
        @keyframes smokeRise {
          0% { transform: translateY(0) scaleX(1); opacity: 0.4; }
          100% { transform: translateY(-100px) scaleX(2); opacity: 0; }
        }
        .animate-heartbeat {
          animation: heartbeat 1s ease-in-out infinite;
        }
        .animate-brainPulse {
          animation: brainPulse 0.8s ease-in-out infinite;
        }
        .animate-constructLogo {
          animation: constructLogo 2s ease-out forwards;
        }
        .animate-scanLine {
          animation: scanLine 1.5s ease-in-out infinite;
        }
        .animate-flashBurst {
          animation: flashBurst 0.5s ease-out forwards;
        }
        .animate-heatWave {
          animation: heatWave 1s ease-in-out infinite;
        }
        .animate-fireGlow {
          animation: fireGlow 0.4s ease-in-out infinite;
        }
        .animate-fireText {
          animation: fireText 0.6s ease-in-out infinite;
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
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

function AnalyticsPanel() {
  const { data: stats } = useQuery<PortalStats>({
    queryKey: ["/api/portal/stats/payzium"],
    refetchInterval: 30000,
  });

  const { data: activity = [] } = useQuery<PortalActivity[]>({
    queryKey: ["/api/portal/activity/payzium"],
    refetchInterval: 30000,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Total Visits</span>
            </div>
            <p className="text-2xl font-bold text-purple-900" data-testid="stat-total-visits">
              {stats?.totalVisits ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Unique Visitors</span>
            </div>
            <p className="text-2xl font-bold text-purple-900" data-testid="stat-unique-visitors">
              {stats?.uniqueIps ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Send className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Contracts Sent</span>
            </div>
            <p className="text-2xl font-bold text-purple-900" data-testid="stat-contracts-sent">
              {stats?.contractsSent ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Contracts Signed</span>
            </div>
            <p className="text-2xl font-bold text-purple-900" data-testid="stat-contracts-signed">
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
          <p className="text-3xl font-bold text-purple-600" data-testid="stat-today-visits">
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
                      <td className="py-2 px-3 font-mono text-xs">{item.ipAddress || "-"}</td>
                      <td className="py-2 px-3">{item.pagePath || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
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
  const { data: user, isLoading: authLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

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
          <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-12">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-5xl font-display mb-4">Payzium</h1>
              <p className="text-lg text-purple-200">Contract Signed Successfully!</p>
            </div>
          </section>
          <section className="py-8 bg-gray-100 min-h-screen">
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
                        className="bg-purple-600 hover:bg-purple-700"
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
        <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl sm:text-4xl font-display mb-2">Payzium</h1>
            <p className="text-purple-200">{currentTemplate.name}</p>
          </div>
        </section>

        <section className="py-8 bg-gray-100 min-h-screen">
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
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
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
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <Building className="w-5 h-5" /> Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-purple-900" data-testid="text-account-name">{MAURICE_INFO.name}</p>
                        <p className="text-sm text-purple-700" data-testid="text-account-title">{MAURICE_INFO.title}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4 text-purple-600" />
                        <span data-testid="text-account-email">{MAURICE_INFO.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-purple-600" />
                        <span data-testid="text-account-phone1">{MAURICE_INFO.phone1}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-purple-600" />
                        <span data-testid="text-account-phone2">{MAURICE_INFO.phone2}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-purple-200">
                      <p className="text-xs text-purple-700 font-medium">Portal Link:</p>
                      <p className="text-xs text-purple-600 break-all" data-testid="text-account-portal-link">{MAURICE_INFO.portalLink}</p>
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
        <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl sm:text-5xl font-display mb-4">Payzium</h1>
            <p className="text-lg text-purple-200">Loading...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user || user.role !== "admin") {
    return <PayziumLoginForm onSuccess={async () => { await queryClient.refetchQueries({ queryKey: ["/api/auth/me"] }); }} />;
  }

  return (
    <Layout>
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-5xl font-display mb-4">Payzium</h1>
          <p className="text-lg text-purple-200">Contract Management Portal</p>
        </div>
      </section>

      <section className="py-8 bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="send" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white" data-testid="tab-send">
                    <Send className="w-4 h-4 mr-2" /> Send Contract
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white" data-testid="tab-pending">
                    <Clock className="w-4 h-4 mr-2" /> Pending ({contractSends.filter(s => s.status === "pending").length})
                  </TabsTrigger>
                  <TabsTrigger value="signed" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white" data-testid="tab-signed">
                    <CheckCircle className="w-4 h-4 mr-2" /> Signed ({signedAgreements.length})
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white" data-testid="tab-analytics">
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
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                            disabled={sendContractMutation.isPending}
                            data-testid="button-send-contract"
                          >
                            {sendContractMutation.isPending ? "Sending..." : "Send Contract"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-purple-600 text-purple-600 hover:bg-purple-50"
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
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Building className="w-5 h-5" /> Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-purple-900" data-testid="text-main-account-name">{MAURICE_INFO.name}</p>
                      <p className="text-sm text-purple-700" data-testid="text-main-account-title">{MAURICE_INFO.title}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-purple-600" />
                      <span data-testid="text-main-account-email">{MAURICE_INFO.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-purple-600" />
                      <span data-testid="text-main-account-phone1">{MAURICE_INFO.phone1}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-purple-600" />
                      <span data-testid="text-main-account-phone2">{MAURICE_INFO.phone2}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <ExternalLink className="w-4 h-4 text-purple-600" />
                      <a href={`https://${MAURICE_INFO.website}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline" data-testid="link-main-account-website">
                        {MAURICE_INFO.website}
                      </a>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-purple-200">
                    <p className="text-xs text-purple-700 font-medium mb-1">Your Portal Link:</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-purple-600 break-all flex-1" data-testid="text-main-account-portal-link">{MAURICE_INFO.portalLink}</p>
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
