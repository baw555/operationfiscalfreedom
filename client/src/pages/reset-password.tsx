import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const portal = params.get("portal");

  const { data: tokenValid, isLoading: validating } = useQuery({
    queryKey: ["validate-reset-token", token],
    queryFn: async () => {
      if (!token) return { valid: false };
      const response = await fetch(`/api/auth/validate-reset-token?token=${token}`);
      return response.json();
    },
    enabled: !!token,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Reset failed");
      }
      return response.json();
    },
    onSuccess: () => {
      setSuccess(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    if (token) {
      resetPasswordMutation.mutate({ token, password });
    }
  };

  const getLoginLink = () => {
    if (portal === "payzium") return "/Payzium";
    if (portal === "admin") return "/admin-login";
    return "/login";
  };

  const passwordsMatch = password === confirmPassword;
  const passwordValid = password.length >= 6;

  if (validating) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-b from-brand-navy to-brand-black">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-brand-red animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Validating reset link...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!token || !tokenValid?.valid) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-b from-brand-navy to-brand-black">
          <div className="w-full max-w-md text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-xl">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Invalid or Expired Link</h1>
              <p className="text-gray-300 mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link href={`/forgot-password${portal ? `?portal=${portal}` : ""}`}>
                <Button className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold">
                  Request New Link
                </Button>
              </Link>
              <div className="mt-4">
                <Link href={getLoginLink()} className="text-gray-400 hover:text-white text-sm inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-b from-brand-navy to-brand-black">
          <div className="w-full max-w-md text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-xl">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Password Reset!</h1>
              <p className="text-gray-300 mb-6">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <Link href={getLoginLink()}>
                <Button className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-b from-brand-navy to-brand-black">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-brand-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-brand-red" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Set New Password</h1>
              <p className="text-gray-400">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 text-sm">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    className="bg-brand-black/50 border-white/10 text-white pr-10"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="input-reset-password"
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
                {password && !passwordValid && (
                  <p className="text-red-400 text-xs">Password must be at least 6 characters</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300 text-sm">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="bg-brand-black/50 border-white/10 text-white pr-10"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    data-testid="input-reset-confirm-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    data-testid="button-toggle-confirm-password"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-red-400 text-xs">Passwords do not match</p>
                )}
              </div>

              {resetPasswordMutation.isError && (
                <p className="text-red-400 text-sm text-center">
                  {resetPasswordMutation.error?.message || "Something went wrong. Please try again."}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold h-12"
                disabled={resetPasswordMutation.isPending || !passwordValid || !passwordsMatch}
                data-testid="button-reset-submit"
              >
                {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
              </Button>

              <div className="text-center">
                <Link href={getLoginLink()} className="text-gray-400 hover:text-white text-sm inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
