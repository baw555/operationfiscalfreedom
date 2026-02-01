import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Shield, LogIn } from "lucide-react";

interface VeteranAuthGateProps {
  children: React.ReactNode;
  serviceName: string;
}

export function VeteranAuthGate({ children, serviceName }: VeteranAuthGateProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-navy to-black flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-brand-navy rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-display text-brand-navy mb-4">
            Sign In Required
          </h1>
          
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            To access <span className="font-bold text-brand-navy">{serviceName}</span>, we need you to sign in.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
            <p className="text-blue-900 font-medium text-base">
              This isn't because we sell your information — it's because <span className="font-bold">we are paying for it</span> and we want to make sure you are a veteran.
            </p>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            Your data is protected under HIPAA compliance standards. We never sell or share your personal information.
          </p>
          
          <a href="/login">
            <Button 
              size="lg" 
              className="bg-brand-red hover:bg-brand-red/90 text-white h-14 px-10 text-lg font-bold shadow-lg w-full"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In to Continue
            </Button>
          </a>
          
          <p className="text-xs text-gray-400 mt-4">
            Free for all veterans and their families
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
