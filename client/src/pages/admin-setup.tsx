import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Shield, UserPlus, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminSetup() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    setupKey: "",
  });

  const setupMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string; setupKey: string }) => {
      const response = await fetch("/api/auth/init-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Setup failed");
      }
      return response.json();
    },
    onSuccess: () => {
      setSuccess(true);
      toast({ title: "Admin account created successfully!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.setupKey) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    setupMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      setupKey: formData.setupKey,
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <CheckCircle className="h-20 w-20 text-brand-red mx-auto mb-6" />
          <h1 className="text-3xl font-display text-white mb-4" data-testid="text-success-title">Admin Account Created!</h1>
          <p className="text-gray-400 mb-8" data-testid="text-success-message">
            Your admin account has been set up successfully. You can now log in to the Admin Command Center.
          </p>
          <Button 
            onClick={() => setLocation("/admin/login")}
            className="bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8 py-6 text-lg"
            data-testid="button-go-to-login"
          >
            Go to Admin Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-brand-red mx-auto mb-4" />
          <h1 className="text-3xl font-display text-white mb-2" data-testid="text-page-title">Admin Setup</h1>
          <p className="text-gray-400" data-testid="text-page-description">Create your first admin account for NavigatorUSA</p>
        </div>

        <div className="bg-brand-navy p-8 rounded-xl border border-brand-red/30 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Admin Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-brand-black/50 border-gray-600 text-white placeholder:text-gray-500"
                data-testid="input-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-brand-black/50 border-gray-600 text-white placeholder:text-gray-500"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input 
                id="password" 
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-brand-black/50 border-gray-600 text-white placeholder:text-gray-500"
                data-testid="input-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="bg-brand-black/50 border-gray-600 text-white placeholder:text-gray-500"
                data-testid="input-confirm-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="setupKey" className="text-white">Setup Key</Label>
              <Input 
                id="setupKey" 
                type="password"
                placeholder="Enter setup key"
                value={formData.setupKey}
                onChange={(e) => setFormData({ ...formData, setupKey: e.target.value })}
                className="bg-brand-black/50 border-gray-600 text-white placeholder:text-gray-500"
                data-testid="input-setup-key"
              />
              <p className="text-xs text-gray-500">Contact system administrator for the setup key</p>
            </div>
            <Button 
              type="submit"
              className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold h-12"
              disabled={setupMutation.isPending}
              data-testid="button-create-admin"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {setupMutation.isPending ? "Creating Account..." : "Create Admin Account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6" data-testid="text-footer-note">
          This page is for initial system setup only.
        </p>
      </div>
    </div>
  );
}
