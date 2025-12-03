import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";

export default function JoinMission() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display text-brand-navy mb-2">Join The Mission</h1>
            <p className="text-gray-500">Create your free account to get started.</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Branch of Service</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option value="">Select Branch</option>
                <option value="army">Army</option>
                <option value="navy">Navy</option>
                <option value="marines">Marines</option>
                <option value="airforce">Air Force</option>
                <option value="coastguard">Coast Guard</option>
                <option value="spaceforce">Space Force</option>
              </select>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm font-normal">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>
            </div>

            <Button className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold h-12 mt-6">
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account? <Link href="/login"><a className="text-brand-navy font-bold hover:underline">Login</a></Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}
