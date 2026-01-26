import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Loader2 } from "lucide-react";

export default function JoinMission() {
  const [, setLocation] = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branchOfService, setBranchOfService] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [success, setSuccess] = useState(false);

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string; branchOfService: string }) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }
      return response.json();
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        setLocation("/affiliate/dashboard");
      }, 2000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    const name = `${firstName} ${lastName}`.trim();
    registerMutation.mutate({ name, email, password, branchOfService });
  };

  if (success) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 sm:py-20 px-4">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-gray-200 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-display text-brand-navy mb-2">Account Created!</h1>
            <p className="text-gray-600 mb-4">Welcome to NavigatorUSA. Taking you to your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 sm:py-20 px-4">
        <div className="w-full max-w-md bg-white p-4 sm:p-8 rounded-xl shadow-xl border border-gray-200">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-display text-brand-navy mb-2">Join The Mission</h1>
            <p className="text-sm sm:text-base text-gray-500">Create your free account to get started.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  data-testid="input-first-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  data-testid="input-last-name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                data-testid="input-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch" className="text-sm">Branch of Service</Label>
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={branchOfService}
                onChange={(e) => setBranchOfService(e.target.value)}
                data-testid="select-branch"
              >
                <option value="">Select Branch</option>
                <option value="army">Army</option>
                <option value="navy">Navy</option>
                <option value="marines">Marines</option>
                <option value="airforce">Air Force</option>
                <option value="coastguard">Coast Guard</option>
                <option value="spaceforce">Space Force</option>
                <option value="civilian">Civilian / Family Member</option>
              </select>
            </div>

            <div className="space-y-4 pt-2 sm:pt-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  className="mt-0.5" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  data-testid="checkbox-terms"
                />
                <Label htmlFor="terms" className="text-xs sm:text-sm font-normal leading-tight">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>
            </div>

            {registerMutation.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm" data-testid="error-message">
                {registerMutation.error.message}
              </div>
            )}

            <Button 
              type="submit"
              className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold h-11 sm:h-12 mt-4 sm:mt-6"
              disabled={registerMutation.isPending}
              data-testid="button-create-account"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
              Already have an account? <Link href="/login" className="text-brand-navy font-bold hover:underline cursor-pointer">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}
