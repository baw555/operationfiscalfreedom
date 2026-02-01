import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Shield, Lock } from "lucide-react";

export default function Login() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: "Welcome back!" });
      if (data.user.role === "admin" || data.user.role === "master") {
        window.location.href = "/master-portal";
      } else if (data.user.role === "affiliate") {
        window.location.href = "/affiliate/dashboard";
      } else {
        window.location.href = "/";
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
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
    <Layout>
      <div className="min-h-[85vh] flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
          
          {/* Accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600/80 via-amber-500/60 to-amber-600/80" />
          
          <div className="flex flex-col justify-center items-center w-full p-12 relative z-10">
            <div className="max-w-md text-center">
              <div className="mb-8">
                <Shield className="w-20 h-20 text-amber-500/80 mx-auto mb-6" strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl font-semibold text-white mb-4 tracking-tight">
                NavigatorUSA
              </h2>
              <div className="w-16 h-0.5 bg-amber-500/60 mx-auto mb-6" />
              <p className="text-slate-400 text-lg leading-relaxed">
                Secure access to veteran resources, affiliate tools, and administrative systems.
              </p>
              <div className="mt-12 pt-8 border-t border-slate-700/50">
                <p className="text-slate-500 text-sm uppercase tracking-widest mb-3">
                  Trusted By Veterans
                </p>
                <a href="/hipaa-compliance" className="text-amber-500/80 text-sm hover:text-amber-400 transition-colors">
                  HIPAA Compliant
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <Shield className="w-12 h-12 text-slate-700 mx-auto mb-4" strokeWidth={1.5} />
              <h1 className="text-2xl font-semibold text-slate-800">NavigatorUSA</h1>
            </div>

            <div className="bg-white p-8 sm:p-10 rounded-lg shadow-sm border border-slate-200">
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-800 mb-2">Welcome Back</h1>
                <p className="text-slate-500">Sign in to access your account</p>
              </div>

              <form onSubmit={handleSubmit} method="post" action="#" className="space-y-5" autoComplete="on">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 text-sm font-medium">
                    Email Address
                  </Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email" 
                    className="h-11 bg-slate-50 border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:ring-slate-500" 
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-email"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-700 text-sm font-medium">
                      Password
                    </Label>
                    <Link href="/forgot-password" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      name="password" 
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password" 
                      className="h-11 bg-slate-50 border-slate-300 text-slate-800 pr-10 focus:border-slate-500 focus:ring-slate-500"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      data-testid="input-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
                  disabled={loginMutation.isPending}
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Sign In
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-center text-sm text-slate-500">
                  Don't have an account?{" "}
                  <Link href="/join" className="text-slate-800 font-medium hover:underline cursor-pointer">
                    Apply Now
                  </Link>
                </p>
              </div>
            </div>

            {/* Security notice */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                256-bit SSL encrypted connection
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
