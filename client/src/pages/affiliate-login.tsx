import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Users, Lock, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";

export default function AffiliateLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
        toast({ title: "Welcome back!" });
        setLocation("/affiliate/dashboard");
      } else {
        toast({
          title: "Access Denied",
          description: "This portal is for affiliates only.",
          variant: "destructive",
        });
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
        title: "Missing Fields",
        description: "Please enter email and password.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Users className="h-16 w-16 text-brand-khaki mx-auto mb-4" />
          <h1 className="text-3xl font-display text-white mb-2">Affiliate Portal</h1>
          <p className="text-gray-400">Operation Fiscal Freedom Partner Access</p>
        </div>

        <div className="bg-brand-black p-8 rounded-xl border border-brand-khaki/30 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="affiliate@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-brand-navy/50 border-gray-600 text-white placeholder:text-gray-500"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-brand-navy/50 border-gray-600 text-white placeholder:text-gray-500 pr-10"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button 
              type="submit"
              className="w-full bg-brand-khaki hover:bg-brand-khaki/90 text-brand-navy font-bold h-12"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              <Lock className="mr-2 h-4 w-4" />
              {loginMutation.isPending ? "Authenticating..." : "Access Partner Portal"}
            </Button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Authorized affiliate partners only.
        </p>
      </div>
    </div>
  );
}
