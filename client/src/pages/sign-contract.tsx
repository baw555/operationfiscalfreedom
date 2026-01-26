import { Layout } from "@/components/layout";
import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FileSignature, CheckCircle, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

type ContractTemplate = {
  id: number;
  name: string;
  version: string;
  content: string;
  companyName: string;
  requiredFor: string;
};

export default function SignContract() {
  const [, setLocation] = useLocation();
  const [affiliateId, setAffiliateId] = useState<string>("");
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [signed, setSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const { data: pendingContracts = [], refetch } = useQuery<ContractTemplate[]>({
    queryKey: ["/api/contracts/pending", affiliateId],
    queryFn: async () => {
      if (!affiliateId) return [];
      const res = await fetch(`/api/contracts/pending/${affiliateId}`);
      return res.json();
    },
    enabled: isLoggedIn && !!affiliateId,
  });

  const signMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/contracts/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractTemplateId: selectedContract?.id,
          affiliateId: parseInt(affiliateId),
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
      setSigned(true);
      refetch();
    },
  });

  const handleLogin = () => {
    if (affiliateId) {
      setIsLoggedIn(true);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureData || !agreedToTerms) {
      alert("Please sign and agree to the terms");
      return;
    }
    signMutation.mutate();
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <FileSignature className="w-8 h-8 text-brand-red" />
              <h1 className="text-2xl font-bold text-brand-navy">Contract Signing Portal</h1>
            </div>
            <p className="text-gray-600 mb-6">Enter your affiliate ID to view and sign required agreements.</p>
            <input
              type="text"
              placeholder="Your Affiliate ID"
              value={affiliateId}
              onChange={(e) => setAffiliateId(e.target.value)}
              className="w-full border rounded p-3 mb-4"
              data-testid="input-affiliate-id"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-brand-navy text-white py-3 rounded font-bold hover:bg-brand-navy/90"
              data-testid="button-login-contracts"
            >
              View My Contracts
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (signed) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-brand-navy mb-4">Agreement Signed Successfully!</h2>
            <p className="text-gray-600 mb-6">Your signed agreement has been recorded and stored on file.</p>
            {pendingContracts.length > 0 ? (
              <button
                onClick={() => { setSigned(false); setSelectedContract(null); clearSignature(); }}
                className="bg-brand-red text-white px-6 py-3 rounded font-bold hover:bg-brand-red/90"
              >
                Sign Next Contract ({pendingContracts.length} remaining)
              </button>
            ) : (
              <button
                onClick={() => setLocation("/submaster-portal")}
                className="bg-brand-navy text-white px-6 py-3 rounded font-bold hover:bg-brand-navy/90"
              >
                Go to Portal
              </button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  if (pendingContracts.length === 0 && !selectedContract) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-brand-navy mb-4">All Contracts Signed!</h2>
            <p className="text-gray-600 mb-6">You have signed all required agreements.</p>
            <button
              onClick={() => setLocation("/submaster-portal")}
              className="bg-brand-navy text-white px-6 py-3 rounded font-bold hover:bg-brand-navy/90"
            >
              Go to Portal
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!selectedContract && pendingContracts.length > 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-8 h-8 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-brand-navy">Pending Agreements</h1>
                <p className="text-gray-600">You have {pendingContracts.length} agreement(s) to sign before accessing your portal.</p>
              </div>
            </div>
            <div className="space-y-4">
              {pendingContracts.map((contract) => (
                <div key={contract.id} className="bg-white p-4 border rounded-lg shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-brand-navy">{contract.name}</h3>
                    <p className="text-sm text-gray-600">{contract.companyName} - Version {contract.version}</p>
                  </div>
                  <button
                    onClick={() => setSelectedContract(contract)}
                    className="bg-brand-red text-white px-4 py-2 rounded font-bold hover:bg-brand-red/90"
                    data-testid={`button-sign-contract-${contract.id}`}
                  >
                    Sign Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <FileSignature className="w-8 h-8 text-brand-red" />
            <div>
              <h1 className="text-2xl font-bold text-brand-navy">{selectedContract?.name}</h1>
              <p className="text-gray-600">{selectedContract?.companyName} - Version {selectedContract?.version}</p>
            </div>
          </div>

          <div className="bg-white border rounded-lg shadow-sm mb-6 max-h-96 overflow-y-auto p-6">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedContract?.content || "" }}
            />
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 border rounded-lg shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-brand-navy border-b pb-2">Representative Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={affiliateName}
                  onChange={(e) => setAffiliateName(e.target.value)}
                  required
                  className="w-full border rounded p-2"
                  data-testid="input-affiliate-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  value={affiliateEmail}
                  onChange={(e) => setAffiliateEmail(e.target.value)}
                  required
                  className="w-full border rounded p-2"
                  data-testid="input-affiliate-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Physical Address *</label>
              <input
                type="text"
                value={physicalAddress}
                onChange={(e) => setPhysicalAddress(e.target.value)}
                required
                className="w-full border rounded p-2"
                data-testid="input-physical-address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Business Activities</label>
              <textarea
                value={businessActivities}
                onChange={(e) => setBusinessActivities(e.target.value)}
                rows={2}
                className="w-full border rounded p-2"
                placeholder="Describe your business activities..."
                data-testid="input-business-activities"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Who Recruited You?</label>
              <input
                type="text"
                value={recruitedBy}
                onChange={(e) => setRecruitedBy(e.target.value)}
                className="w-full border rounded p-2"
                data-testid="input-recruited-by"
              />
            </div>

            <h3 className="font-bold text-lg text-brand-navy border-b pb-2 pt-4">ACH Payment Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name on Account</label>
                <input
                  type="text"
                  value={achName}
                  onChange={(e) => setAchName(e.target.value)}
                  className="w-full border rounded p-2"
                  data-testid="input-ach-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bank Name</label>
                <input
                  type="text"
                  value={achBank}
                  onChange={(e) => setAchBank(e.target.value)}
                  className="w-full border rounded p-2"
                  data-testid="input-ach-bank"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Number</label>
                <input
                  type="password"
                  value={achAccount}
                  onChange={(e) => setAchAccount(e.target.value)}
                  className="w-full border rounded p-2"
                  data-testid="input-ach-account"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Routing Number</label>
                <input
                  type="text"
                  value={achRouting}
                  onChange={(e) => setAchRouting(e.target.value)}
                  className="w-full border rounded p-2"
                  data-testid="input-ach-routing"
                />
              </div>
            </div>

            <h3 className="font-bold text-lg text-brand-navy border-b pb-2 pt-4">Electronic Signature</h3>
            
            <p className="text-sm text-gray-600">Sign in the box below using your mouse or touch device:</p>
            
            <div className="border rounded p-2 bg-gray-50">
              <canvas
                ref={canvasRef}
                width={600}
                height={150}
                className="border bg-white rounded cursor-crosshair w-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              <button
                type="button"
                onClick={clearSignature}
                className="text-sm text-brand-red mt-2"
              >
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
                I have read and agree to the terms of this Independent Representative Non-Disclosure, Non-Circumvention and Referral Agreement. I understand that by signing electronically, I am binding myself to this agreement.
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
                {signMutation.isPending ? "Signing..." : "Sign Agreement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
