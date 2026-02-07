import { Suspense, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "wouter";
import { Shield, ArrowLeft } from "lucide-react";
import { ErrorBoundary } from "@/components/error-boundary";
import { NdaFormProvider } from "./affiliate-nda-context";
import { NdaPageSkeleton, NdaSectionError } from "./affiliate-nda-components";
import {
  NdaStatusPanel,
  LegalTextPanel,
  SignaturePanel,
  UploadPanel,
  FormFieldsPanel,
} from "./affiliate-nda-panels";

function useSessionHeartbeat() {
  useEffect(() => {
    const HEARTBEAT_INTERVAL = 5 * 60 * 1000;

    const sendHeartbeat = async () => {
      try {
        const res = await fetch("/api/session/heartbeat", {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          console.warn("[Session] Heartbeat failed - session may have expired");
        }
      } catch (err) {
        console.warn("[Session] Heartbeat error:", err);
      }
    };

    sendHeartbeat();
    const intervalId = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    const handleFocus = () => sendHeartbeat();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);
}

function SectionSkeleton({ height = "h-32" }: { height?: string }) {
  return (
    <div className={`${height} bg-gray-100 rounded-lg animate-pulse`} />
  );
}

function NdaShell() {
  useSessionHeartbeat();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-navy to-brand-navy/90 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all mb-6 group"
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-base font-semibold">Back</span>
        </button>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-brand-navy p-6 text-center">
            <Shield className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Affiliate Confidentiality Agreement</h1>
            <p className="text-white/80">Navigator USA Corp - Veterans' Family Resources</p>
          </div>

          <NdaFormProvider>
            <div className="p-8 space-y-6">
              <ErrorBoundary fallback={<NdaSectionError section="Status check" />}>
                <Suspense fallback={<SectionSkeleton height="h-20" />}>
                  <NdaStatusPanel />
                </Suspense>
              </ErrorBoundary>

              <ErrorBoundary fallback={<NdaSectionError section="Legal agreement" />}>
                <Suspense fallback={<SectionSkeleton height="h-96" />}>
                  <LegalTextPanel />
                </Suspense>
              </ErrorBoundary>

              <ErrorBoundary fallback={<NdaSectionError section="Form fields" />}>
                <Suspense fallback={<SectionSkeleton height="h-48" />}>
                  <FormFieldsPanel />
                </Suspense>
              </ErrorBoundary>

              <ErrorBoundary fallback={<NdaSectionError section="Face photo capture" />}>
                <Suspense fallback={<SectionSkeleton height="h-40" />}>
                  <SignaturePanel />
                </Suspense>
              </ErrorBoundary>

              <ErrorBoundary fallback={<NdaSectionError section="ID upload" />}>
                <Suspense fallback={<SectionSkeleton height="h-40" />}>
                  <UploadPanel />
                </Suspense>
              </ErrorBoundary>
            </div>
          </NdaFormProvider>

          <div className="px-8 pb-8 text-center text-sm text-gray-500">
            <p>
              Navigator USA Corp | 501(c)(3) Public Charity<br />
              429 D Shoreline Village Dr, Long Beach, CA 90802<br />
              Effective Date: July 15, 2022
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AffiliateNda() {
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
    retry: 2,
    retryDelay: 500,
    staleTime: 30000,
  });

  if (authLoading) {
    return <NdaPageSkeleton />;
  }

  if (!authData) {
    return <Redirect to="/affiliate/login" />;
  }

  if (authData.user?.role !== "affiliate") {
    return <Redirect to="/login" />;
  }

  return <NdaShell />;
}
