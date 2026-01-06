import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";

export default function JoinMission() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 sm:py-20 px-4">
        <div className="w-full max-w-md bg-white p-4 sm:p-8 rounded-xl shadow-xl border border-gray-200">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-display text-brand-navy mb-2">Join The Mission</h1>
            <p className="text-sm sm:text-base text-gray-500">Create your free account to get started.</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch" className="text-sm">Branch of Service</Label>
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

            <div className="space-y-4 pt-2 sm:pt-4">
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="mt-0.5" />
                <Label htmlFor="terms" className="text-xs sm:text-sm font-normal leading-tight">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>
            </div>

            <Button className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold h-11 sm:h-12 mt-4 sm:mt-6">
              Create Account
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
