import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import logoImage from "@/assets/images/veteran-warrior.png";

export default function AffiliateLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("navusa_remembered_email");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.user.role === "affiliate") {
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem("navusa_remembered_email", formData.email);
        } else {
          localStorage.removeItem("navusa_remembered_email");
        }
        toast({ title: "Welcome back, Operator!" });
        setLocation("/affiliate/dashboard");
      } else {
        toast({
          title: "Access Denied",
          description: "This portal is for authorized operators only.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Authentication Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter email and password.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Military/Security themed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1f35] to-[#0a1628]">
        {/* Radar sweep effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-green-500/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-green-500/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-green-500/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-green-500/20 rounded-full"></div>
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(30, 64, 100, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(30, 64, 100, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        {/* Corner tactical elements */}
        <div className="absolute top-4 left-4 text-green-500/40 font-mono text-xs">
          <div>SYS:ONLINE</div>
          <div>SEC:LEVEL-5</div>
        </div>
        <div className="absolute top-4 right-4 text-green-500/40 font-mono text-xs text-right">
          <div>LAT: 31.77° N</div>
          <div>LON: 35.21° E</div>
        </div>
        <div className="absolute bottom-4 left-4 text-green-500/40 font-mono text-xs">
          <div>NAVUSA-CMD</div>
          <div>v2.1.0</div>
        </div>
        <div className="absolute bottom-4 right-4 text-green-500/40 font-mono text-xs text-right">
          <div>ENCRYPTED</div>
          <div>256-BIT AES</div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          {/* Veteran Portrait */}
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
              <img 
                src={logoImage} 
                alt="Veteran Warrior" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-4xl font-display text-white mb-2 tracking-wider">COMMAND HQ</h1>
          <p className="text-green-400/80 font-mono text-sm tracking-widest">SECURE ACCESS TERMINAL</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-500/60 text-xs font-mono">SYSTEM ACTIVE</span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#0d1f35]/95 to-[#0a1628]/95 p-8 rounded-xl border border-green-500/20 shadow-2xl backdrop-blur-sm">
          {/* Top security bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-green-500/20">
            <span className="text-green-400/60 text-xs font-mono">OPERATOR LOGIN</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-400/80 font-mono text-sm">OPERATOR ID</Label>
              <Input 
                id="email" 
                name="email"
                type="email"
                autoComplete="email"
                placeholder="operator@navusa.mil"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#0a1628] border-green-500/30 text-green-400 placeholder:text-green-600/40 font-mono focus:border-green-500 focus:ring-green-500/20"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-400/80 font-mono text-sm">ACCESS CODE</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-[#0a1628] border-green-500/30 text-green-400 placeholder:text-green-600/40 font-mono pr-10 focus:border-green-500 focus:ring-green-500/20"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500/50 hover:text-green-400"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
                className="border-green-500/50 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                data-testid="checkbox-remember-me"
              />
              <Label htmlFor="rememberMe" className="text-green-400/80 font-mono text-sm cursor-pointer">
                REMEMBER CREDENTIALS
              </Label>
            </div>

            <Button 
              type="submit"
              className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold h-12 font-mono tracking-wider"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              <Lock className="mr-2 h-4 w-4" />
              {loginMutation.isPending ? "AUTHENTICATING..." : "INITIATE ACCESS"}
            </Button>
          </form>

          {/* Bottom security info */}
          <div className="mt-6 pt-4 border-t border-green-500/20 text-center">
            <p className="text-green-500/40 text-xs font-mono">
              CONNECTION SECURED | TLS 1.3
            </p>
          </div>
        </div>

        <p className="text-center text-green-500/40 text-xs mt-6 font-mono tracking-wider">
          AUTHORIZED PERSONNEL ONLY | CLEARANCE REQUIRED
        </p>
      </div>
    </div>
  );
}
