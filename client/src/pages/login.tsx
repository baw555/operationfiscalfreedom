import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";

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
      // Redirect based on role
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
      <div className="min-h-[80vh] flex items-center justify-center bg-brand-black py-10 sm:py-20 px-4">
        <div className="w-full max-w-md bg-brand-navy p-4 sm:p-8 rounded-xl shadow-2xl border border-white/10">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-display text-white mb-2">Welcome Back</h1>
            <p className="text-sm sm:text-base text-gray-400">Access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} method="post" action="#" className="space-y-4 sm:space-y-6" autoComplete="on">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                className="bg-brand-black/50 border-white/10 text-white placeholder:text-gray-600" 
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300 text-sm">Password</Label>
                <a href="#" className="text-xs text-white hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password" 
                  className="bg-brand-black/50 border-white/10 text-white pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold h-11 sm:h-12"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
              Don't have an account? <Link href="/join" className="text-white font-bold hover:underline cursor-pointer">Join Mission</Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}
