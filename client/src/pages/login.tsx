import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";

export default function Login() {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-brand-black py-20">
        <div className="w-full max-w-md bg-brand-navy p-8 rounded-xl shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Access your dashboard.</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input id="email" type="email" className="bg-brand-black/50 border-white/10 text-white placeholder:text-gray-600" placeholder="john@example.com" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <a href="#" className="text-xs text-brand-khaki hover:underline">Forgot password?</a>
              </div>
              <Input id="password" type="password" className="bg-brand-black/50 border-white/10 text-white" />
            </div>

            <Button className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold h-12">
              Login
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account? <Link href="/join" className="text-brand-khaki font-bold hover:underline cursor-pointer">Join Mission</Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}
