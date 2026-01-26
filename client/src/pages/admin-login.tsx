import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/master-portal");
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <p className="text-white">Redirecting...</p>
    </div>
  );
}
