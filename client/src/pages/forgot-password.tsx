import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [location] = useLocation();
  
  const portal = new URLSearchParams(window.location.search).get("portal");

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, portal }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Request failed");
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(email);
  };

  const getBackLink = () => {
    if (portal === "payzium") return "/Payzium";
    if (portal === "admin") return "/admin-login";
    return "/login";
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-b from-brand-navy to-brand-black">
          <div className="w-full max-w-md text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-xl">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Check Your Email</h1>
              <p className="text-gray-300 mb-6">
                If an account exists with <strong className="text-white">{email}</strong>, you will receive a password reset link shortly.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                The link will expire in 1 hour. Check your spam folder if you don't see it.
              </p>
              <Link href={getBackLink()}>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
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
                <Mail className="w-8 h-8 text-brand-red" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
              <p className="text-gray-400">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 text-sm">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="bg-brand-black/50 border-white/10 text-white"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-forgot-email"
                />
              </div>

              {forgotPasswordMutation.isError && (
                <p className="text-red-400 text-sm text-center">
                  {forgotPasswordMutation.error?.message || "Something went wrong. Please try again."}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold h-12"
                disabled={forgotPasswordMutation.isPending}
                data-testid="button-forgot-submit"
              >
                {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center">
                <Link href={getBackLink()} className="text-gray-400 hover:text-white text-sm inline-flex items-center gap-2">
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
