import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { FileText, DollarSign, Users, Building2, ChevronDown, ChevronUp, CheckCircle, Shield, Award, Target, TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface ContractTemplate {
  id: number;
  name: string;
  serviceName: string | null;
  grossCommissionPct: number | null;
  contractType: string;
  isActive: string;
}

interface SignedAgreement {
  id: number;
  contractTemplateId: number;
  affiliateName: string;
  signedAt: string;
}

interface ScheduleASignature {
  id: number;
  affiliateName: string;
  affiliateEmail: string;
  signedAt: string;
  acknowledgedUplineCount: number;
}

interface SignatureStatus {
  signed: boolean;
  signature: ScheduleASignature | null;
}

interface AuthData {
  user: { id: number; email: string; name: string; role: string } | null;
}

/**
 * Schedule A - Aggregate Commission Distribution
 * Shows all service contracts with their gross rates and calculates
 * the distribution based on the rep's position in the chain.
 */
export default function ScheduleA() {
  const [uplineCount, setUplineCount] = useState<number>(0);
  const [expandedContract, setExpandedContract] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const maxUplines = 6;
  const producerBase = 0.69;
  const uplineEach = 0.01;

  const { data: templates = [] } = useQuery<ContractTemplate[]>({
    queryKey: ["/api/contracts/templates"],
  });

  const { data: authData } = useQuery<AuthData>({
    queryKey: ["/api/auth/me"],
  });

  const { data: signatureStatus } = useQuery<SignatureStatus>({
    queryKey: ["/api/schedule-a/status"],
    enabled: !!authData?.user,
  });

  const signMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/schedule-a/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ uplineCount }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to sign");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Schedule A Acknowledged", description: "Your agreement has been recorded." });
      queryClient.invalidateQueries({ queryKey: ["/api/schedule-a/status"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const serviceContracts = useMemo(() => 
    templates.filter(t => t.contractType === "service" && t.grossCommissionPct),
    [templates]
  );

  const emptyUplines = maxUplines - uplineCount;
  const compression = emptyUplines * uplineEach;
  const producerPct = producerBase + compression;

  const calculateDistribution = (grossPct: number) => {
    const pool = grossPct / 100;
    return {
      producer: pool * producerPct,
    };
  };

  const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

  const rankData = [
    { uplines: 0, rank: "E7", title: "SFC", desc: "Solo - Maximum earnings" },
    { uplines: 1, rank: "E6", title: "SSG", desc: "1 upline" },
    { uplines: 2, rank: "E5", title: "SGT", desc: "2 uplines" },
    { uplines: 3, rank: "E4", title: "SPC", desc: "3 uplines" },
    { uplines: 4, rank: "E3", title: "PFC", desc: "4 uplines" },
    { uplines: 5, rank: "E2", title: "PV2", desc: "5 uplines" },
    { uplines: 6, rank: "E1", title: "PVT", desc: "6 uplines" },
  ];

  return (
    <Layout>
      {/* Hero Section - Fortune 500 Style */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 relative overflow-hidden">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        {/* Gold accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600/80 via-amber-500/60 to-amber-600/80" />
        
        <div className="container mx-auto px-4 relative z-10">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-lg bg-slate-700/50 border border-slate-600 flex items-center justify-center">
              <FileText className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-semibold tracking-tight">Schedule A</h1>
                <span className="px-3 py-1 bg-amber-600/20 border border-amber-600/30 rounded text-amber-400 text-xs font-medium uppercase tracking-wider">
                  Compensation Plan
                </span>
              </div>
              <p className="text-slate-400">Aggregate Commission Distribution Structure</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 py-10 max-w-6xl">
          
          {/* Position Calculator */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="bg-slate-800 px-6 py-4 flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-white">Your Network Position</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Select Your Rank (Based on Upline Count)
                  </label>
                  <div className="space-y-2">
                    {rankData.map(({ uplines, rank, title, desc }) => (
                      <button
                        key={uplines}
                        onClick={() => setUplineCount(uplines)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                          uplineCount === uplines
                            ? 'bg-slate-800 border-slate-700 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                        data-testid={`button-rank-${rank}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`font-mono font-bold text-lg ${uplineCount === uplines ? 'text-amber-400' : 'text-slate-500'}`}>
                            {rank}
                          </span>
                          <div className="text-left">
                            <div className={`font-medium ${uplineCount === uplines ? 'text-white' : 'text-slate-800'}`}>
                              {title}
                            </div>
                            <div className={`text-xs ${uplineCount === uplines ? 'text-slate-400' : 'text-slate-500'}`}>
                              {desc}
                            </div>
                          </div>
                        </div>
                        {uplineCount === uplines && (
                          <CheckCircle className="w-5 h-5 text-amber-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 text-center border border-slate-700">
                    <div className="text-slate-400 text-sm uppercase tracking-wider mb-2">Your Commission Rate</div>
                    <div className="text-5xl font-bold text-amber-400 mb-2">{pct(producerPct)}</div>
                    <div className="text-slate-500 text-sm mb-4">of gross commission on every closed deal</div>
                    <div className="w-16 h-0.5 bg-amber-500/30 mx-auto mb-4" />
                    <div className="text-slate-400 text-xs">
                      {emptyUplines > 0 ? (
                        <>Base 69% + {emptyUplines}% compression bonus</>
                      ) : (
                        <>Base rate with full upline structure</>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Contracts Section */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-amber-500" />
                <div>
                  <h2 className="text-lg font-semibold text-white">Service Contracts</h2>
                  <p className="text-xs text-slate-400">Your commission distribution per contract type</p>
                </div>
              </div>
            </div>

            {serviceContracts.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">No service contracts available yet.</p>
                <p className="text-sm text-slate-400 mt-1">Service contracts will appear here once created.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {serviceContracts.map((contract) => {
                  const dist = calculateDistribution(contract.grossCommissionPct || 0);
                  const isExpanded = expandedContract === contract.id;
                  
                  return (
                    <div key={contract.id} className="hover:bg-slate-50 transition-colors">
                      <div 
                        className="flex items-center justify-between px-6 py-5 cursor-pointer"
                        onClick={() => setExpandedContract(isExpanded ? null : contract.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">{contract.serviceName || contract.name}</h3>
                            <p className="text-sm text-slate-500">Gross Rate: {contract.grossCommissionPct}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-xs text-slate-500 uppercase tracking-wider">You Receive</div>
                            <div className="text-2xl font-bold text-amber-600">{pct(dist.producer)}</div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-6 pb-6">
                          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                            <div className="text-sm text-slate-600 mb-4 text-center uppercase tracking-wider">Projected Earnings</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[50000, 100000, 250000].map((amount) => (
                                <div key={amount} className="bg-white rounded-lg p-4 text-center border border-slate-200">
                                  <div className="text-xs text-slate-500 mb-1">${amount.toLocaleString()} Deal</div>
                                  <div className="text-2xl font-bold text-slate-800">${(amount * dist.producer).toLocaleString()}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Additional Compensation Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* vGift Cards */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-800 px-5 py-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold text-white">vGift Cards</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">Volume-based referral income</p>
              </div>
              <div className="p-5">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-slate-800">~5%</div>
                  <div className="text-sm text-slate-500">Per Gift Card Sold</div>
                </div>
                <div className="space-y-3">
                  {[
                    { customers: 500, income: "$12,500/yr" },
                    { customers: 1500, income: "$37,500/yr" },
                    { customers: 5000, income: "$125,000/yr" },
                  ].map(({ customers, income }) => (
                    <div key={customers} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-600">{customers.toLocaleString()} customers</span>
                      <span className="font-semibold text-slate-800">{income}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-xs text-amber-800">Avg. customer worth $25/year</p>
                </div>
              </div>
            </div>

            {/* My Locker */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-800 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold text-white">My Locker</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">Print-on-demand apparel</p>
              </div>
              <div className="p-5">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-slate-800">20%</div>
                  <div className="text-sm text-slate-500">Of Gross Profit</div>
                </div>
                <div className="space-y-3">
                  {[
                    { volume: "$5,000/mo", income: "$4,800/yr" },
                    { volume: "$15,000/mo", income: "$14,400/yr" },
                    { volume: "$50,000/mo", income: "$48,000/yr" },
                  ].map(({ volume, income }) => (
                    <div key={volume} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-600">{volume}</span>
                      <span className="font-semibold text-slate-800">{income}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600">Corporate branding & custom apparel</p>
                </div>
              </div>
            </div>

            {/* Merchant Processing */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-800 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold text-white">Merchant Processing</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">Residual processing income</p>
              </div>
              <div className="p-5">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-slate-800">20%</div>
                  <div className="text-sm text-slate-500">Of NET Revenue</div>
                </div>
                <div className="space-y-3">
                  {[
                    { accounts: "25 Small", income: "$43,200/yr" },
                    { accounts: "25 Medium", income: "$57,900/yr" },
                    { accounts: "25 Large", income: "$116,700/yr" },
                  ].map(({ accounts, income }) => (
                    <div key={accounts} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-600">{accounts}</span>
                      <span className="font-semibold text-slate-800">{income}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-xs text-amber-800">Residual income - passive earnings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compensation Summary */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-800">Compensation Summary</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Service Contracts</div>
                      <p className="text-sm text-slate-500">Up to 75% on every deal you close, based on network position</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Merchant Processing</div>
                      <p className="text-sm text-slate-500">20% of NET revenue, residual income as long as merchant is active</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">vGift Cards</div>
                      <p className="text-sm text-slate-500">~5% per gift card, average customer worth $25/year</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">My Locker</div>
                      <p className="text-sm text-slate-500">20% of gross profit on all print-on-demand sales</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="bg-white rounded-lg border-2 border-slate-800 shadow-sm overflow-hidden">
            <div className="bg-slate-800 px-6 py-4 flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-white">Schedule A Acknowledgment</h3>
            </div>
            
            <div className="p-6">
              {signatureStatus?.signed ? (
                <div className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-200 rounded-lg" data-testid="schedule-a-signed-status">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800" data-testid="text-schedule-a-signed">Schedule A Acknowledged</p>
                    <p className="text-sm text-slate-500">
                      Signed by {signatureStatus.signature?.affiliateName} on{" "}
                      {signatureStatus.signature?.signedAt 
                        ? new Date(signatureStatus.signature.signedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              ) : authData?.user ? (
                <div className="space-y-6">
                  <p className="text-slate-600 leading-relaxed">
                    By clicking "I Agree" below, I acknowledge that I have read and understand the commission 
                    structure outlined in this Schedule A. I understand that my earnings are based on my position 
                    in the network and the services I help provide to clients.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-sm text-slate-600">
                      Signing as: <strong className="text-slate-800">{authData.user.name}</strong> ({authData.user.email})
                    </div>
                    <Button
                      onClick={() => signMutation.mutate()}
                      disabled={signMutation.isPending}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-8"
                      data-testid="button-schedule-a-sign"
                    >
                      {signMutation.isPending ? "Processing..." : "I Agree - Sign Schedule A"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6" data-testid="schedule-a-login-prompt">
                  <p className="text-slate-600 mb-4">
                    Please log in to acknowledge Schedule A.
                  </p>
                  <Link href="/login">
                    <Button className="bg-slate-800 hover:bg-slate-700" data-testid="button-schedule-a-login">
                      Login to Sign
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
