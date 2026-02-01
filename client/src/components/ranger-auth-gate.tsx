import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { FileSignature } from "lucide-react";

interface RangerAuthGateProps {
  children: React.ReactNode;
}

export function RangerAuthGate({ children }: RangerAuthGateProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                <FileSignature className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">RANGER</h1>
                <p className="text-blue-300 text-sm font-medium">Enterprise E-Signature</p>
              </div>
            </div>
            
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Military-Grade<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Document Security
              </span>
            </h2>
            
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Sign, send, and manage contracts with enterprise-level security. 
              Built for professionals who demand excellence.
            </p>
            
            <div className="mt-12 flex items-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Auth */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <FileSignature className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">RANGER</h1>
                <p className="text-gray-500 text-xs">Enterprise E-Signature</p>
              </div>
            </div>
            
            <div className="text-center lg:text-left mb-10">
              <h3 className="text-2xl font-bold text-white mb-2">Welcome back</h3>
              <p className="text-gray-500">Sign in to access your documents</p>
            </div>
            
            <a href="/login" className="block">
              <Button 
                size="lg" 
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-base shadow-xl shadow-blue-500/20 border-0"
              >
                Continue with Account
              </Button>
            </a>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                New user? <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Create an account</a>
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-800">
              <p className="text-gray-600 text-xs text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
