import { Layout } from "@/components/layout";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileSignature, CheckCircle, AlertCircle, Loader2, Zap, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

type ContractTemplate = {
  id: number;
  name: string;
  version: string;
  content: string;
  companyName: string;
  requiredFor: string;
  serviceName?: string;
  grossCommissionPct?: number;
};

export default function SignContract() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  // Form state - will be autofilled from session
  const [affiliateName, setAffiliateName] = useState("");
  const [affiliateEmail, setAffiliateEmail] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");
  const [businessActivities, setBusinessActivities] = useState("");
  const [recruitedBy, setRecruitedBy] = useState("");
  const [achName, setAchName] = useState("");
  const [achBank, setAchBank] = useState("");
  const [achAccount, setAchAccount] = useState("");
  const [achRouting, setAchRouting] = useState("");
  const [signatureData, setSignatureData] = useState<string>("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractTemplate | null>(null);
  const [signedCount, setSignedCount] = useState(0);
  const [signingAll, setSigningAll] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Check auth and autofill
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return null;
      return res.json();
    },
  });

  // Autofill user info from session
  useEffect(() => {
    if (authData?.user) {
      setAffiliateName(authData.user.name || "");
      setAffiliateEmail(authData.user.email || "");
      setAchName(authData.user.name || "");
    }
  }, [authData]);

  // Fetch all contract templates
  const { data: contractTemplates = [] } = useQuery<ContractTemplate[]>({
    queryKey: ["contract-templates"],
    queryFn: async () => {
      const res = await fetch("/api/contracts/templates");
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch signed agreements for this user
  const { data: signedAgreements = [], refetch: refetchSigned } = useQuery({
    queryKey: ["my-signed-agreements"],
    queryFn: async () => {
      const res = await fetch("/api/contracts/my-signed");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!authData?.user,
  });

  // Calculate pending contracts
  const signedContractIds = signedAgreements.map((s: any) => s.contractTemplateId);
  const pendingContracts = contractTemplates.filter((c) => !signedContractIds.includes(c.id));

  // Sign single contract mutation
  const signMutation = useMutation({
    mutationFn: async (contractId: number) => {
      const res = await fetch("/api/contracts/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractTemplateId: contractId,
          affiliateId: authData?.user?.id,
          affiliateName,
          affiliateEmail,
          signatureData,
          physicalAddress,
          businessActivities,
          recruitedBy,
          achName,
          achBank,
          achAccountNumber: achAccount,
          achRoutingNumber: achRouting,
          agreedToTerms: "true",
        }),
      });
      if (!res.ok) throw new Error("Failed to sign");
      return res.json();
    },
    onSuccess: () => {
      setSignedCount(prev => prev + 1);
      refetchSigned();
      queryClient.invalidateQueries({ queryKey: ["my-signed-agreements"] });
    },
  });

  // Sign all contracts at once
  const signAllContracts = async () => {
    if (!signatureData || !agreedToTerms) {
      alert("Please sign and agree to the terms first");
      return;
    }
    
    setSigningAll(true);
    setSignedCount(0);
    let successCount = 0;
    const failedContracts: string[] = [];
    
    for (const contract of pendingContracts) {
      try {
        await signMutation.mutateAsync(contract.id);
        successCount++;
      } catch (error) {
        console.error("Failed to sign contract:", contract.name);
        failedContracts.push(contract.name);
      }
    }
    
    setSigningAll(false);
    
    if (failedContracts.length > 0) {
      alert(`Failed to sign ${failedContracts.length} contract(s): ${failedContracts.join(", ")}. Please try again.`);
    }
    
    // Only mark as done if all contracts were signed successfully
    if (successCount === pendingContracts.length) {
      setAllDone(true);
    } else {
      // Refetch to update the pending list
      refetchSigned();
    }
  };

  // Drawing functions for signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#1A365D";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureData("");
      }
    }
  };

  const handleSingleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureData || !agreedToTerms || !selectedContract) {
      alert("Please sign and agree to the terms");
      return;
    }
    signMutation.mutate(selectedContract.id, {
      onSuccess: () => {
        if (pendingContracts.length <= 1) {
          setAllDone(true);
        }
        setSelectedContract(null);
      },
    });
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
        </div>
      </Layout>
    );
  }

  // Not logged in - redirect to login
  if (!authData?.user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg border shadow-sm text-center">
            <FileSignature className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-brand-navy mb-4">Contract Signing Portal</h1>
            <p className="text-gray-600 mb-6">Please log in to view and sign your contracts.</p>
            <a
              href="/login"
              className="inline-block w-full bg-brand-navy text-white py-3 rounded font-bold hover:bg-brand-navy/90"
            >
              Log In
            </a>
            <p className="mt-4 text-sm text-gray-500">
              Don't have an account? <a href="/join" className="text-brand-red font-bold">Join now</a>
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // All done!
  if (allDone || (pendingContracts.length === 0 && signedAgreements.length > 0)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto text-center">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-brand-navy mb-4">All Contracts Signed!</h2>
            <p className="text-gray-600 mb-2">
              You have successfully signed {signedAgreements.length} agreement{signedAgreements.length !== 1 ? 's' : ''}.
            </p>
            <p className="text-gray-500 text-sm mb-8">Your account is now fully activated.</p>
            <button
              onClick={() => setLocation("/affiliate/dashboard")}
              className="bg-brand-navy text-white px-8 py-3 rounded font-bold hover:bg-brand-navy/90"
              data-testid="button-go-to-dashboard"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // No contracts to sign
  if (pendingContracts.length === 0 && signedAgreements.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto text-center">
            <FileSignature className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-brand-navy mb-4">No Contracts Available</h2>
            <p className="text-gray-600 mb-6">There are no contracts available for signing at this time.</p>
            <button
              onClick={() => setLocation("/affiliate/dashboard")}
              className="bg-brand-navy text-white px-6 py-3 rounded font-bold hover:bg-brand-navy/90"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Viewing a specific contract to sign
  if (selectedContract) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <FileSignature className="w-8 h-8 text-brand-red" />
              <div>
                <h1 className="text-2xl font-bold text-brand-navy">{selectedContract.name}</h1>
                <p className="text-gray-600">{selectedContract.companyName} - Version {selectedContract.version}</p>
              </div>
            </div>

            <div className="bg-white border rounded-lg shadow-sm mb-6 max-h-96 overflow-y-auto p-6">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedContract.content || "" }}
              />
            </div>

            <form onSubmit={handleSingleSign} className="bg-white p-6 border rounded-lg shadow-sm space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Autofilled from your account:</strong> {affiliateName} ({affiliateEmail})
                </p>
              </div>
              
              <h3 className="font-bold text-lg text-brand-navy border-b pb-2">Electronic Signature</h3>
              
              <p className="text-sm text-gray-600">Sign in the box below:</p>
              
              <div className="border rounded p-2 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={150}
                  className="border bg-white rounded cursor-crosshair w-full touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <button type="button" onClick={clearSignature} className="text-sm text-brand-red mt-2">
                  Clear Signature
                </button>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1"
                  data-testid="checkbox-agree-terms"
                />
                <label htmlFor="agree" className="text-sm">
                  I have read and agree to the terms of this agreement. By signing electronically, I am binding myself to this agreement.
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedContract(null)}
                  className="flex-1 border border-gray-300 py-3 rounded font-bold hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={signMutation.isPending || !signatureData || !agreedToTerms}
                  className="flex-1 bg-brand-red text-white py-3 rounded font-bold hover:bg-brand-red/90 disabled:bg-gray-400"
                  data-testid="button-submit-signature"
                >
                  {signMutation.isPending ? "Signing..." : "Sign This Agreement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  // Main view - show all pending contracts with "Sign All" option
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold text-brand-navy">Pending Agreements</h1>
              <p className="text-gray-600">You have {pendingContracts.length} agreement{pendingContracts.length !== 1 ? 's' : ''} to sign.</p>
            </div>
          </div>

          {/* Autofill info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Signing as:</strong> {affiliateName} ({affiliateEmail})
            </p>
          </div>

          {/* Quick Sign All Section */}
          <div className="bg-gradient-to-r from-brand-red to-brand-red/90 text-white rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Quick Sign All</h2>
                <p className="text-white/80 text-sm">Sign all {pendingContracts.length} contracts at once with a single signature</p>
              </div>
            </div>

            {/* Signature Canvas for Sign All */}
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="text-sm text-white/80 mb-2">Draw your signature:</p>
              <div className="border-2 border-white/30 rounded bg-white">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={120}
                  className="w-full cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
              <button type="button" onClick={clearSignature} className="text-sm text-white/80 mt-2 underline">
                Clear
              </button>
            </div>

            <div className="flex items-start gap-2 mb-4">
              <input
                type="checkbox"
                id="agreeAll"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1"
                data-testid="checkbox-agree-all"
              />
              <label htmlFor="agreeAll" className="text-sm text-white/90">
                I have reviewed all agreements and agree to be bound by their terms
              </label>
            </div>

            {signingAll ? (
              <div className="text-center py-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p>Signing contracts... ({signedCount}/{pendingContracts.length})</p>
              </div>
            ) : (
              <button
                onClick={signAllContracts}
                disabled={!signatureData || !agreedToTerms}
                className="w-full bg-white text-brand-red py-4 rounded-lg font-bold text-lg hover:bg-white/90 disabled:bg-white/50 disabled:text-brand-red/50 flex items-center justify-center gap-2"
                data-testid="button-sign-all"
              >
                <Zap className="w-5 h-5" />
                Sign All {pendingContracts.length} Contracts
              </button>
            )}
          </div>

          {/* Individual contracts list */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-bold text-brand-navy">Or sign individually:</h3>
            </div>
            <div className="divide-y">
              {pendingContracts.map((contract) => (
                <div key={contract.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <h4 className="font-bold text-brand-navy">{contract.name}</h4>
                    <p className="text-sm text-gray-600">
                      {contract.companyName}
                      {contract.serviceName && ` • ${contract.serviceName}`}
                      {contract.grossCommissionPct && ` • ${contract.grossCommissionPct}%`}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedContract(contract)}
                    className="flex items-center gap-1 text-brand-red font-bold hover:underline"
                    data-testid={`button-review-${contract.id}`}
                  >
                    Review <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Already signed */}
          {signedAgreements.length > 0 && (
            <div className="mt-6 bg-green-50 rounded-lg border border-green-200 p-4">
              <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Already Signed ({signedAgreements.length})
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                {signedAgreements.map((agreement: any) => {
                  const template = contractTemplates.find((t) => t.id === agreement.contractTemplateId);
                  return (
                    <li key={agreement.id}>✓ {template?.name || 'Agreement'}</li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
