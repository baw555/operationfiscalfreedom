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

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#030508]">
      {/* Multi-layer background for depth */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030508] via-[#0a1628] to-[#030508]" />
        
        {/* Radial spotlight from top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[70vh] bg-gradient-to-b from-blue-950/40 via-transparent to-transparent" />
        
        {/* Side vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
      </div>
      
      {/* Animated aurora-like waves at top */}
      <div className="absolute top-0 left-0 right-0 h-96 overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/30 via-blue-900/20 to-transparent animate-aurora1" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-cyan-900/10 to-transparent animate-aurora2" />
      </div>
      
      {/* Matrix-style falling digital rain - enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
            style={{
              left: `${(i * 2)}%`,
              width: i % 3 === 0 ? '2px' : '1px',
              height: `${80 + Math.random() * 150}px`,
              animation: `matrixFall ${6 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 6}s`,
              opacity: 0.2 + Math.random() * 0.3
            }}
          />
        ))}
        
        {/* Scattered pulsing nodes */}
        {[...Array(80)].map((_, i) => (
          <div
            key={`node-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              backgroundColor: i % 3 === 0 ? 'rgba(34, 211, 238, 0.5)' : i % 3 === 1 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(59, 130, 246, 0.4)',
              boxShadow: i % 5 === 0 ? '0 0 10px rgba(34, 211, 238, 0.5)' : 'none',
              animation: `digitPulse ${1.5 + Math.random() * 2.5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Connecting lines between some nodes */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
            style={{
              left: `${10 + Math.random() * 30}%`,
              top: `${10 + i * 8}%`,
              width: `${20 + Math.random() * 40}%`,
              transform: `rotate(${-15 + Math.random() * 30}deg)`,
              animation: `linePulse ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Central light pillar behind logo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[45%] bg-gradient-to-b from-cyan-500/40 via-cyan-500/10 to-transparent" />
      
      {/* Ambient glow orbs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-radial from-cyan-900/30 via-blue-900/10 to-transparent blur-3xl animate-breathe" />
      <div className="absolute bottom-40 left-1/4 w-[300px] h-[300px] bg-gradient-radial from-indigo-900/20 via-transparent to-transparent blur-3xl animate-breathe2" />
      <div className="absolute bottom-60 right-1/4 w-[250px] h-[250px] bg-gradient-radial from-blue-900/15 via-transparent to-transparent blur-3xl animate-breathe3" />
      
      {/* Horizon light band with glow */}
      <div className="absolute top-[38%] left-0 right-0">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-sm" />
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
        <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-sm" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          
          {/* Logo Stage - premium presentation */}
          <div className="text-center mb-12 animate-fadeInDown">
            {/* Logo container with multi-layer effects */}
            <div className="relative inline-block">
              {/* Outer halo ring */}
              <div className="absolute -inset-16 bg-gradient-radial from-cyan-500/15 via-blue-600/5 to-transparent rounded-full blur-3xl animate-haloBreath" />
              
              {/* Inner glow pulse */}
              <div className="absolute -inset-8 bg-gradient-radial from-cyan-400/10 via-transparent to-transparent rounded-full blur-xl animate-innerGlow" />
              
              {/* Logo with layered shadows and glow */}
              <div className="relative">
                {/* Reflection/echo layer */}
                <img 
                  src="/payzium-logo.png" 
                  alt="" 
                  className="absolute top-2 left-0 w-80 h-auto opacity-20 blur-md scale-105"
                  aria-hidden="true"
                />
                
                {/* Main logo */}
                <img 
                  src="/payzium-logo.png" 
                  alt="Payzium" 
                  className="w-80 h-auto relative z-10 animate-logoFloat"
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(34, 211, 238, 0.25)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.15)) drop-shadow(0 0 100px rgba(99, 102, 241, 0.1))',
                  }}
                />
                
                {/* Bottom reflection */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-sm" />
              </div>
            </div>
            
            {/* Tagline with elegant styling */}
            <div className="mt-8 space-y-1">
              <p className="text-cyan-200/80 text-lg tracking-[0.2em] font-light uppercase">
                Contract Management Portal
              </p>
              <div className="flex items-center justify-center gap-3 mt-2">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-cyan-500/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-cyan-500/50" />
              </div>
            </div>
          </div>

          {/* POWER GATEWAY - Epic Login Card */}
          <div className="relative animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            {/* Outer power rings */}
            <div className="absolute -inset-8 rounded-3xl animate-powerRing1">
              <div className="absolute inset-0 rounded-3xl border border-cyan-500/20" />
            </div>
            <div className="absolute -inset-12 rounded-3xl animate-powerRing2">
              <div className="absolute inset-0 rounded-3xl border border-blue-500/10" />
            </div>
            <div className="absolute -inset-16 rounded-3xl animate-powerRing3">
              <div className="absolute inset-0 rounded-3xl border border-indigo-500/5" />
            </div>
            
            {/* Energy pulses radiating outward */}
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/30 to-cyan-500/20 blur-xl animate-energyPulse" />
            
            {/* Card border glow - intense */}
            <div className="absolute -inset-[2px] bg-gradient-to-b from-cyan-400/50 via-blue-500/40 to-indigo-500/50 rounded-2xl blur-sm animate-borderGlow" />
            
            <div className="relative bg-[#080d18]/95 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-8 shadow-2xl shadow-cyan-900/30">
              {/* Corner power indicators */}
              <div className="absolute top-3 left-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />
              <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-3 left-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-3 right-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" style={{ animationDelay: '1.5s' }} />
              
              {/* Top energy bar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanLine" />
              
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/40 mb-4 animate-iconFloat shadow-lg shadow-cyan-500/20">
                  <LogIn className="w-8 h-8 text-cyan-300" />
                </div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-300 tracking-wide">
                  ACCESS THE POWER
                </h2>
                <p className="text-cyan-400/60 text-sm mt-2 tracking-widest uppercase">
                  Unlimited Potential Awaits
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2 group">
                  <Label htmlFor="email" className="text-cyan-200/80 text-sm font-medium tracking-wide">
                    IDENTITY
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50 transition-all group-focus-within:text-cyan-400 group-focus-within:scale-110" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      data-testid="input-payzium-email"
                      className="relative pl-12 h-14 bg-slate-900/70 border-cyan-500/20 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-cyan-400/30 focus:bg-slate-900/90 transition-all duration-300 rounded-xl text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label htmlFor="password" className="text-cyan-200/80 text-sm font-medium tracking-wide">
                    KEY
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
                    <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50 transition-all group-focus-within:text-cyan-400 group-focus-within:scale-110" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      data-testid="input-payzium-password"
                      className="relative pl-12 h-14 bg-slate-900/70 border-cyan-500/20 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-cyan-400/30 focus:bg-slate-900/90 transition-all duration-300 rounded-xl text-lg"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    data-testid="checkbox-payzium-remember"
                    className="border-cyan-500/40 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-400"
                  />
                  <Label htmlFor="remember-me" className="text-sm text-cyan-300/60 cursor-pointer">
                    Remember my identity
                  </Label>
                </div>

                {/* EPIC POWER BUTTON */}
                <Button 
                  type="submit"
                  disabled={isLoading}
                  data-testid="button-payzium-login"
                  className="w-full h-16 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-lg rounded-xl shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-400/60 transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] relative overflow-hidden group border-2 border-cyan-400/30 hover:border-cyan-300/50"
                >
                  {/* Multiple shimmer layers */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-1000 delay-100" />
                  
                  {/* Power surge effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 to-transparent" />
                  </div>
                  
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="animate-pulse">INITIALIZING POWER...</span>
                      </>
                    ) : (
                      <>
                        <span className="tracking-widest">ENTER THE REALM</span>
                        <LogIn className="w-6 h-6 transition-all group-hover:translate-x-2 group-hover:scale-125" />
                      </>
                    )}
                  </span>
                </Button>
              </form>

              {/* Power status indicator */}
              <div className="mt-8 pt-6 border-t border-cyan-500/20">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                    <span className="text-green-400/80 text-xs tracking-wider">SYSTEMS ONLINE</span>
                  </div>
                  <div className="w-px h-4 bg-cyan-500/30" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50" />
                    <span className="text-cyan-400/80 text-xs tracking-wider">POWER: MAXIMUM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Epic Footer */}
          <div className="mt-12 text-center animate-fadeIn" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-20 h-px bg-gradient-to-r from-transparent to-cyan-500/50" />
              <div className="w-3 h-3 rotate-45 border border-cyan-500/50 animate-pulse" />
              <div className="w-20 h-px bg-gradient-to-l from-transparent to-cyan-500/50" />
            </div>
            <p className="text-cyan-500/40 text-xs tracking-[0.3em] uppercase">
              Unlimited Power Awaits
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations - UNLIMITED POWER */}
      <style>{`
        @keyframes matrixFall {
          0% { transform: translateY(-200px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes digitPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(2); box-shadow: 0 0 15px currentColor; }
        }
        @keyframes linePulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.4; }
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
        @keyframes aurora1 {
          0%, 100% { transform: translateX(-20%) skewX(-5deg); opacity: 0.3; }
          50% { transform: translateX(20%) skewX(5deg); opacity: 0.5; }
        }
        @keyframes aurora2 {
          0%, 100% { transform: translateX(20%) skewX(5deg); opacity: 0.2; }
          50% { transform: translateX(-20%) skewX(-5deg); opacity: 0.4; }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.5; transform: translateX(-50%) scale(1.1); }
        }
        @keyframes breathe2 {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.15); }
        }
        @keyframes breathe3 {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }
        @keyframes haloBreath {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes innerGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes powerRing1 {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
        @keyframes powerRing2 {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.03); }
        }
        @keyframes powerRing3 {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.04); }
        }
        @keyframes energyPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
        @keyframes borderGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes scanLine {
          0% { transform: translateX(-50%) scaleX(0.3); opacity: 0.3; }
          50% { transform: translateX(-50%) scaleX(1); opacity: 1; }
          100% { transform: translateX(-50%) scaleX(0.3); opacity: 0.3; }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(1deg); }
          75% { transform: translateY(3px) rotate(-1deg); }
        }
        .animate-fadeInDown { animation: fadeInDown 1.2s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 1.2s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        .animate-aurora1 { animation: aurora1 15s ease-in-out infinite; }
        .animate-aurora2 { animation: aurora2 18s ease-in-out infinite; }
        .animate-breathe { animation: breathe 8s ease-in-out infinite; }
        .animate-breathe2 { animation: breathe2 10s ease-in-out infinite; }
        .animate-breathe3 { animation: breathe3 12s ease-in-out infinite; }
        .animate-haloBreath { animation: haloBreath 4s ease-in-out infinite; }
        .animate-innerGlow { animation: innerGlow 3s ease-in-out infinite; }
        .animate-logoFloat { animation: logoFloat 6s ease-in-out infinite; }
        .animate-powerRing1 { animation: powerRing1 3s ease-in-out infinite; }
        .animate-powerRing2 { animation: powerRing2 4s ease-in-out infinite; }
        .animate-powerRing3 { animation: powerRing3 5s ease-in-out infinite; }
        .animate-energyPulse { animation: energyPulse 2s ease-in-out infinite; }
        .animate-borderGlow { animation: borderGlow 2s ease-in-out infinite; }
        .animate-scanLine { animation: scanLine 3s ease-in-out infinite; }
        .animate-iconFloat { animation: iconFloat 4s ease-in-out infinite; }
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
