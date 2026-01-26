import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, LogOut, FileText, HelpCircle, X, Home, FileSignature, 
  Calculator, DollarSign, CheckCircle, AlertCircle, Clock, 
  ArrowRight, TrendingUp, Building2
} from "lucide-react";
import { useLocation, Link } from "wouter";
import { format } from "date-fns";

type LeadStatus = "new" | "contacted" | "in_progress" | "closed";
type MainTab = "overview" | "contracts" | "calculator" | "vso" | "leads";

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-purple-100 text-purple-800",
  closed: "bg-green-100 text-green-800",
};

export default function AffiliateDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [mainTab, setMainTab] = useState<MainTab>("overview");
  const [leadSubTab, setLeadSubTab] = useState<"applications" | "requests">("applications");
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // Calculator state
  const [dealAmount, setDealAmount] = useState<number>(100000);
  const [contractRate, setContractRate] = useState<number>(18);
  const [uplineCount, setUplineCount] = useState<number>(0);

  // Check auth
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
  });

  useEffect(() => {
    if (!authLoading && (!authData || authData.user?.role !== "affiliate")) {
      setLocation("/affiliate/login");
    }
  }, [authData, authLoading, setLocation]);

  // Fetch VLT affiliate profile (for upline count)
  const { data: vltProfile } = useQuery({
    queryKey: ["vlt-affiliate-me"],
    queryFn: async () => {
      const res = await fetch("/api/vlt-affiliate/me");
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!authData?.user,
  });

  // Auto-set upline count from VLT profile
  useEffect(() => {
    if (vltProfile?.uplineCount !== undefined) {
      setUplineCount(vltProfile.uplineCount);
    }
  }, [vltProfile]);

  // Fetch contracts
  const { data: contractTemplates = [] } = useQuery({
    queryKey: ["contract-templates"],
    queryFn: async () => {
      const res = await fetch("/api/contracts/templates");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!authData?.user,
  });

  // Fetch signed agreements for this user
  const { data: signedAgreements = [] } = useQuery({
    queryKey: ["my-signed-agreements"],
    queryFn: async () => {
      const res = await fetch("/api/contracts/my-signed");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!authData?.user,
  });

  // Fetch assigned leads
  const { data: applications = [] } = useQuery({
    queryKey: ["affiliate-applications"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/applications");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!authData?.user,
  });

  const { data: helpRequests = [] } = useQuery({
    queryKey: ["affiliate-help-requests"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/help-requests");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!authData?.user,
  });

  // Mutations
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes: string }) => {
      const res = await fetch(`/api/affiliate/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-applications"] });
      toast({ title: "Application updated" });
      setSelectedLead(null);
    },
  });

  const updateHelpRequestMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes: string }) => {
      const res = await fetch(`/api/affiliate/help-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-help-requests"] });
      toast({ title: "Request updated" });
      setSelectedLead(null);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      setLocation("/affiliate/login");
    },
  });

  // Calculator logic
  const maxUplines = 6;
  const producerBase = 0.69;
  const uplineEach = 0.01;
  const housePct = 0.225;
  const recruiterPct = 0.025;

  const calcResults = useMemo(() => {
    const deal = Math.max(0, Number.isFinite(dealAmount) ? dealAmount : 0);
    const rate = Math.max(0, Math.min(100, Number.isFinite(contractRate) ? contractRate : 0)) / 100;
    const pool = deal * rate;
    const uplines = Math.max(0, Math.min(maxUplines, uplineCount));
    const emptyUplines = maxUplines - uplines;
    const compression = emptyUplines * uplineEach;
    const producerPct = producerBase + compression;
    const producerPay = pool * producerPct;
    const uplinePay = pool * uplineEach;
    const totalUplinePay = uplinePay * uplines;
    const housePay = pool * housePct;
    const recruiterPay = pool * recruiterPct;

    return {
      pool,
      producerPct,
      producerPay,
      uplines,
      uplinePay,
      totalUplinePay,
      housePay,
      recruiterPay,
      emptyUplines,
      compression,
    };
  }, [dealAmount, contractRate, uplineCount]);

  const money = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xl text-white font-display">Loading Portal...</div>
        </div>
      </div>
    );
  }

  const totalLeads = applications.length + helpRequests.length;
  const activeLeads = [...applications, ...helpRequests].filter((l) => l.status !== "closed").length;
  const signedContractIds = signedAgreements.map((s: any) => s.contractTemplateId);
  const pendingContracts = contractTemplates.filter((c: any) => !signedContractIds.includes(c.id));
  const signedCount = signedAgreements.length;

  const tabs: { id: MainTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: <Home className="w-4 h-4" /> },
    { id: "contracts", label: "Contracts", icon: <FileSignature className="w-4 h-4" />, badge: pendingContracts.length },
    { id: "calculator", label: "Calculator", icon: <Calculator className="w-4 h-4" /> },
    { id: "vso", label: "VSO Revenue", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "leads", label: "Leads", icon: <Users className="w-4 h-4" />, badge: activeLeads > 0 ? activeLeads : undefined },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Patriotic Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800" />
        
        {/* Subtle American flag-inspired stripes */}
        <div className="absolute inset-0 opacity-[0.03]">
          {[...Array(13)].map((_, i) => (
            <div 
              key={i} 
              className={`h-[7.69%] ${i % 2 === 0 ? 'bg-white' : 'bg-transparent'}`} 
            />
          ))}
        </div>
        
        {/* Stars pattern overlay */}
        <div className="absolute top-0 left-0 w-2/5 h-[54%] opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
        
        {/* Uplifting light rays from top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[60%] opacity-10"
          style={{
            background: 'conic-gradient(from 180deg at 50% 0%, transparent 45%, rgba(255,255,255,0.1) 50%, transparent 55%)'
          }}
        />
        
        {/* Gold accent glow */}
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-yellow-500/5 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-brand-red/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-brand-navy via-brand-navy to-slate-800 text-white shadow-xl border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Users className="h-8 w-8 text-brand-red" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="font-display text-2xl tracking-wide">Affiliate Portal</h1>
              <p className="text-sm text-yellow-500/80 font-medium">NavigatorUSA | Veterans' Family Resources</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300 hidden sm:block">Welcome, {authData?.user?.name}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="border-gray-500 text-gray-300 hover:bg-gray-700"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <div className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMainTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm uppercase tracking-wide transition-all border-b-3 whitespace-nowrap ${
                  mainTab === tab.id 
                    ? "border-brand-red text-brand-navy bg-brand-red/5" 
                    : "border-transparent text-gray-500 hover:text-brand-navy hover:bg-gray-50"
                }`}
                data-testid={`tab-${tab.id}`}
              >
                {tab.icon}
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-brand-red text-white animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-0">
        {/* ===== OVERVIEW TAB ===== */}
        {mainTab === "overview" && (
          <div className="space-y-8">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-brand-navy to-brand-navy/80 text-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Welcome back, {authData?.user?.name?.split(' ')[0]}!</h2>
              <p className="text-white/80">Here's what's happening with your affiliate account today.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-brand-navy">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Contracts Signed</p>
                    <p className="text-2xl font-bold text-brand-navy">{signedCount}</p>
                  </div>
                  <FileSignature className="h-8 w-8 text-brand-navy/20" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-brand-red">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Pending Contracts</p>
                    <p className="text-2xl font-bold text-brand-red">{pendingContracts.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-brand-red/20" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Leads</p>
                    <p className="text-2xl font-bold text-blue-600">{totalLeads}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500/20" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Active Leads</p>
                    <p className="text-2xl font-bold text-green-600">{activeLeads}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500/20" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-brand-navy mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingContracts.length > 0 && (
                  <button
                    onClick={() => setMainTab("contracts")}
                    className="flex items-center gap-3 p-4 rounded-lg border-2 border-brand-red bg-brand-red/5 hover:bg-brand-red/10 transition-colors text-left"
                    data-testid="action-sign-contracts"
                  >
                    <div className="p-2 rounded-full bg-brand-red text-white">
                      <FileSignature className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-navy">Sign Contracts</p>
                      <p className="text-sm text-gray-500">{pendingContracts.length} pending signature{pendingContracts.length !== 1 ? 's' : ''}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-brand-red" />
                  </button>
                )}
                <button
                  onClick={() => setMainTab("calculator")}
                  className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-brand-navy hover:bg-gray-50 transition-colors text-left"
                  data-testid="action-calculator"
                >
                  <div className="p-2 rounded-full bg-brand-navy text-white">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy">Calculate Commissions</p>
                    <p className="text-sm text-gray-500">See your earnings potential</p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
                </button>
                <Link 
                  href="/schedule-a"
                  className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-brand-navy hover:bg-gray-50 transition-colors text-left"
                  data-testid="action-schedule-a"
                >
                  <div className="p-2 rounded-full bg-green-600 text-white">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy">View Schedule A</p>
                    <p className="text-sm text-gray-500">Service rates & commissions</p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            {(applications.length > 0 || helpRequests.length > 0) && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-brand-navy">Recent Leads</h3>
                  <button
                    onClick={() => setMainTab("leads")}
                    className="text-sm text-brand-red hover:underline font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {[...applications, ...helpRequests]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 3)
                    .map((lead: any, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-brand-navy">{lead.name}</p>
                          <p className="text-sm text-gray-500">{lead.email}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[lead.status as LeadStatus]}`}>
                          {lead.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== CONTRACTS TAB ===== */}
        {mainTab === "contracts" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-brand-navy mb-4 flex items-center gap-2">
                <FileSignature className="w-6 h-6" />
                Required Agreements
              </h2>
              <p className="text-gray-600 mb-6">
                Review and sign the required agreements to activate your affiliate account and access all services.
              </p>

              {pendingContracts.length === 0 && signedCount > 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-600 mb-2">All Contracts Signed!</h3>
                  <p className="text-gray-600">You've completed all required agreements. View your signed contracts below.</p>
                </div>
              ) : pendingContracts.length === 0 && signedCount === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No contracts available at this time.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingContracts.map((contract: any) => (
                    <div key={contract.id} className="border rounded-lg p-4 hover:border-brand-navy transition-colors" data-testid={`pending-contract-${contract.id}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-brand-navy">{contract.name}</h4>
                          <p className="text-sm text-gray-500">
                            {contract.companyName} • Version {contract.version}
                          </p>
                          {contract.serviceName && (
                            <p className="text-sm text-gray-600 mt-1">
                              Service: {contract.serviceName} • {contract.grossCommissionPct}% gross
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Pending
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link href="/sign-contract">
                          <Button className="bg-brand-red hover:bg-brand-red/90" data-testid={`sign-contract-${contract.id}`}>
                            <FileSignature className="w-4 h-4 mr-2" />
                            Review & Sign
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Signed Contracts */}
            {signedCount > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Signed Agreements ({signedCount})
                </h3>
                <div className="space-y-3">
                  {signedAgreements.map((agreement: any) => {
                    const template = contractTemplates.find((t: any) => t.id === agreement.contractTemplateId);
                    return (
                      <div key={agreement.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200" data-testid={`signed-agreement-${agreement.id}`}>
                        <div>
                          <p className="font-medium text-green-800">{template?.name || 'Agreement'}</p>
                          <p className="text-sm text-green-600">
                            Signed {format(new Date(agreement.signedAt), "MMM d, yyyy")}
                          </p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== CALCULATOR TAB ===== */}
        {mainTab === "calculator" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-brand-navy mb-2 flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                Commission Calculator
              </h2>
              <p className="text-gray-600 mb-6">
                Calculate your potential earnings based on deal size and your position in the network.
              </p>

              {/* Input Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <Label className="text-sm font-bold text-gray-700">Deal Amount ($)</Label>
                  <input
                    type="number"
                    value={dealAmount}
                    onChange={(e) => setDealAmount(Number(e.target.value))}
                    className="mt-1 w-full px-4 py-3 border rounded-lg text-lg font-bold focus:ring-2 focus:ring-brand-navy"
                    data-testid="input-deal-amount"
                  />
                </div>
                <div>
                  <Label className="text-sm font-bold text-gray-700">Contract Rate (%)</Label>
                  <select
                    value={contractRate}
                    onChange={(e) => setContractRate(Number(e.target.value))}
                    className="mt-1 w-full px-4 py-3 border rounded-lg text-lg font-bold focus:ring-2 focus:ring-brand-navy"
                    data-testid="select-contract-rate"
                  >
                    <option value={70}>70% - Private Reinsurance</option>
                    <option value={55}>55% - Tax Resolution</option>
                    <option value={18}>18% - ICC Logistics</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-bold text-gray-700">
                    Your Uplines
                    {vltProfile?.uplineCount !== undefined && (
                      <span className="ml-2 text-xs font-normal text-green-600">(Your actual: {vltProfile.uplineCount})</span>
                    )}
                  </Label>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={6}
                      value={uplineCount}
                      onChange={(e) => setUplineCount(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      data-testid="slider-uplines"
                    />
                    <span className="text-2xl font-bold text-brand-navy w-8">{uplineCount}</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white rounded-xl p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-white/70 mb-1">Commission Pool</p>
                  <p className="text-3xl font-bold">{money(calcResults.pool)}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <p className="text-xs text-white/70 mb-1">YOU EARN</p>
                    <p className="text-2xl font-bold text-green-400">{money(calcResults.producerPay)}</p>
                    <p className="text-sm text-white/60">{pct(calcResults.producerPct)} of pool</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <p className="text-xs text-white/70 mb-1">UPLINES</p>
                    <p className="text-xl font-bold">{money(calcResults.totalUplinePay)}</p>
                    <p className="text-sm text-white/60">{calcResults.uplines} x 1%</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <p className="text-xs text-white/70 mb-1">HOUSE</p>
                    <p className="text-xl font-bold">{money(calcResults.housePay)}</p>
                    <p className="text-sm text-white/60">22.5% fixed</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <p className="text-xs text-white/70 mb-1">RECRUITER</p>
                    <p className="text-xl font-bold">{money(calcResults.recruiterPay)}</p>
                    <p className="text-sm text-white/60">2.5% bounty</p>
                  </div>
                </div>

                {calcResults.emptyUplines > 0 && (
                  <div className="mt-4 p-3 bg-green-500/20 rounded-lg text-center">
                    <p className="text-sm">
                      <strong>Compression Bonus:</strong> +{pct(calcResults.compression)} from {calcResults.emptyUplines} empty upline{calcResults.emptyUplines !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* How it works */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-brand-navy mb-2">How Compression Works</h4>
                <p className="text-sm text-gray-600">
                  The fewer uplines above you, the more you keep. With 0 uplines, you earn 75% (69% base + 6% compression). 
                  With 6 uplines, you earn 69% base. Empty slots compress to YOU, not the house.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link href="/comp-plan">
                <Button variant="outline" className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white">
                  View Full Compensation Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* ===== VSO REVENUE GENERATION TAB ===== */}
        {mainTab === "vso" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-brand-navy mb-2 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                VSO Revenue Generation Model
              </h2>
              <p className="text-gray-600 mb-6">
                Realistic revenue projections for Veteran Service Organizations promoting to 50,000 veterans.
              </p>

              {/* Conversion Funnel */}
              <div className="bg-gradient-to-r from-brand-navy/10 to-brand-red/10 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-bold text-brand-navy mb-3">Realistic Conversion Funnel</h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-brand-navy">50,000</p>
                    <p className="text-xs text-gray-500">Veterans Reached</p>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="text-center">
                    <p className="text-xs text-brand-red font-bold">3% onboard</p>
                    <p className="text-2xl font-bold text-brand-navy">1,500</p>
                    <p className="text-xs text-gray-500">Affiliates</p>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="text-center">
                    <p className="text-xs text-brand-red font-bold">10% produce</p>
                    <p className="text-2xl font-bold text-green-600">150</p>
                    <p className="text-xs text-gray-500">Active Producers</p>
                    <p className="text-[10px] text-gray-400">(0.3% of total)</p>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="text-center">
                    <p className="text-xs text-brand-red font-bold">6.7 sales each</p>
                    <p className="text-2xl font-bold text-yellow-600">1,000</p>
                    <p className="text-xs text-gray-500">Total Sales</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">
                  Note: Only 0.3% of veterans reached will become active producers (3% onboard × 10% produce = 0.3%)
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-gradient-to-br from-brand-navy to-brand-navy/80 text-white rounded-xl p-5">
                  <p className="text-white/70 text-sm">Target Veterans</p>
                  <p className="text-3xl font-bold">50,000</p>
                </div>
                <div className="bg-gradient-to-br from-brand-red to-brand-red/80 text-white rounded-xl p-5">
                  <p className="text-white/70 text-sm">Onboarding Rate</p>
                  <p className="text-3xl font-bold">3%</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-5">
                  <p className="text-white/70 text-sm">New Affiliates</p>
                  <p className="text-3xl font-bold">1,500</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl p-5">
                  <p className="text-white/70 text-sm">Active Producers</p>
                  <p className="text-3xl font-bold">150</p>
                  <p className="text-xs text-white/60">10% of affiliates</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-5">
                  <p className="text-white/70 text-sm">Total Sales</p>
                  <p className="text-3xl font-bold">1,000</p>
                  <p className="text-xs text-white/60">~6.7 per producer</p>
                </div>
              </div>

              {/* Revenue Projections */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-brand-navy mb-4">Projected Revenue (Annual)</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Commission Pool = Deal Amount × Contract Rate. Weighted average: (70%×335 + 55%×333 + 18%×332) / 1,000 = ~47.7% effective rate
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-brand-navy">
                        <th className="text-left py-3 px-4 font-bold text-brand-navy">Contract Type</th>
                        <th className="text-right py-3 px-4 font-bold text-brand-navy">Rate</th>
                        <th className="text-right py-3 px-4 font-bold text-brand-navy">Est. Sales</th>
                        <th className="text-right py-3 px-4 font-bold text-brand-navy">Avg Deal</th>
                        <th className="text-right py-3 px-4 font-bold text-brand-navy">Total Revenue</th>
                        <th className="text-right py-3 px-4 font-bold text-brand-navy">Commission Pool</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-white transition-colors">
                        <td className="py-3 px-4 font-medium">Private Reinsurance</td>
                        <td className="py-3 px-4 text-right text-brand-red font-bold">70%</td>
                        <td className="py-3 px-4 text-right">335</td>
                        <td className="py-3 px-4 text-right">$250,000</td>
                        <td className="py-3 px-4 text-right font-bold">$83,750,000</td>
                        <td className="py-3 px-4 text-right text-green-600 font-bold">$58,625,000</td>
                      </tr>
                      <tr className="border-b hover:bg-white transition-colors">
                        <td className="py-3 px-4 font-medium">Tax Resolution</td>
                        <td className="py-3 px-4 text-right text-brand-red font-bold">55%</td>
                        <td className="py-3 px-4 text-right">333</td>
                        <td className="py-3 px-4 text-right">$250,000</td>
                        <td className="py-3 px-4 text-right font-bold">$83,250,000</td>
                        <td className="py-3 px-4 text-right text-green-600 font-bold">$45,787,500</td>
                      </tr>
                      <tr className="border-b hover:bg-white transition-colors">
                        <td className="py-3 px-4 font-medium">ICC Logistics</td>
                        <td className="py-3 px-4 text-right text-brand-red font-bold">18%</td>
                        <td className="py-3 px-4 text-right">332</td>
                        <td className="py-3 px-4 text-right">$250,000</td>
                        <td className="py-3 px-4 text-right font-bold">$83,000,000</td>
                        <td className="py-3 px-4 text-right text-green-600 font-bold">$14,940,000</td>
                      </tr>
                      <tr className="bg-brand-navy text-white font-bold">
                        <td className="py-4 px-4">TOTAL</td>
                        <td className="py-4 px-4 text-right">-</td>
                        <td className="py-4 px-4 text-right">1,000</td>
                        <td className="py-4 px-4 text-right">$250,000</td>
                        <td className="py-4 px-4 text-right">$250,000,000</td>
                        <td className="py-4 px-4 text-right text-yellow-400">$119,352,500</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Earnings by Position */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-brand-navy mb-4">Estimated Earnings by Network Position (Active Producers Only)</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Based on $119M commission pool distributed among 150 producers. Actual earnings vary by sales volume and upline position.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-5 border-l-4 border-yellow-500 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-500">MASTER (Level 0)</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">3 producers</span>
                    </div>
                    <p className="text-2xl font-bold text-brand-navy">$90,273</p>
                    <p className="text-xs text-gray-500 mt-1">Avg annual earnings (producer + upline)</p>
                  </div>
                  <div className="bg-white rounded-lg p-5 border-l-4 border-blue-500 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-500">SUBMASTER (Level 1)</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">12 producers</span>
                    </div>
                    <p className="text-2xl font-bold text-brand-navy">$69,513</p>
                    <p className="text-xs text-gray-500 mt-1">Avg annual earnings (producer + upline)</p>
                  </div>
                  <div className="bg-white rounded-lg p-5 border-l-4 border-green-500 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-500">AFFILIATE (Levels 2-6)</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">135 producers</span>
                    </div>
                    <p className="text-2xl font-bold text-brand-navy">$58,524</p>
                    <p className="text-xs text-gray-500 mt-1">Avg annual earnings (producer + upline)</p>
                  </div>
                </div>
              </div>

              {/* Compression Benefits */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-brand-navy mb-4">Compression Benefits Analysis</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Fewer uplines = higher producer rate. Empty upline slots compress TO THE PRODUCER, not the house.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {[
                    { uplines: 0, rate: 75, count: 3, avg: 50933 },
                    { uplines: 1, rate: 74, count: 25, avg: 60179 },
                    { uplines: 2, rate: 73, count: 68, avg: 58738 },
                    { uplines: 3, rate: 72, count: 44, avg: 57997 },
                    { uplines: 4, rate: 71, count: 9, avg: 54340 },
                    { uplines: 5, rate: 70, count: 1, avg: 45503 },
                  ].map((item) => (
                    <div key={item.uplines} className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <p className="text-xs text-gray-500">{item.uplines} Uplines</p>
                      <p className="text-2xl font-bold text-brand-red">{item.rate}%</p>
                      <p className="text-xs text-gray-500">Producer Rate</p>
                      <hr className="my-2" />
                      <p className="text-sm font-bold text-brand-navy">${(item.avg / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-gray-400">{item.count} producers</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribution Summary */}
              <div className="bg-gradient-to-r from-brand-navy to-brand-navy/90 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Commission Pool Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Producer Pool</p>
                    <p className="text-2xl font-bold">69-75%</p>
                    <p className="text-xs text-yellow-400">+ Compression Bonus</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Upline Pool</p>
                    <p className="text-2xl font-bold">0-6%</p>
                    <p className="text-xs text-white/50">1% per level (max 6)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-sm">House</p>
                    <p className="text-2xl font-bold">22.5%</p>
                    <p className="text-xs text-white/50">Fixed percentage</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Recruiter Bounty</p>
                    <p className="text-2xl font-bold">2.5%</p>
                    <p className="text-xs text-white/50">Separate bonus</p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">
                  Ready to bring this revenue model to your Veteran Service Organization?
                </p>
                <Link href="/contact">
                  <Button className="bg-brand-red hover:bg-brand-red/90 text-white px-8 py-3">
                    Contact Us to Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ===== LEADS TAB ===== */}
        {mainTab === "leads" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-brand-navy">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Assigned Leads</p>
                    <p className="text-3xl font-bold text-brand-navy">{totalLeads}</p>
                  </div>
                  <FileText className="h-10 w-10 text-brand-navy/20" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Active Leads</p>
                    <p className="text-3xl font-bold text-green-600">{activeLeads}</p>
                  </div>
                  <HelpCircle className="h-10 w-10 text-green-500/20" />
                </div>
              </div>
            </div>

            {/* Lead Sub-Tabs */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setLeadSubTab("applications")}
                  className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-wide transition-colors ${
                    leadSubTab === "applications" ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  data-testid="subtab-applications"
                >
                  <FileText className="h-4 w-4 inline mr-2" /> 
                  Applications ({applications.length})
                </button>
                <button
                  onClick={() => setLeadSubTab("requests")}
                  className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-wide transition-colors ${
                    leadSubTab === "requests" ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  data-testid="subtab-requests"
                >
                  <HelpCircle className="h-4 w-4 inline mr-2" /> 
                  Help Requests ({helpRequests.length})
                </button>
              </div>

              <div className="p-6">
                {leadSubTab === "applications" && (
                  <div className="space-y-4">
                    {applications.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No applications assigned to you yet</p>
                    ) : (
                      applications.map((app: any) => (
                        <div 
                          key={app.id} 
                          className="bg-gray-50 rounded-lg p-4 border hover:border-brand-navy/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedLead({ ...app, type: "application" })}
                          data-testid={`lead-application-${app.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-brand-navy">{app.name}</h3>
                              <p className="text-sm text-gray-600">{app.companyName}</p>
                              <p className="text-sm text-gray-500">{app.email} | {app.phone}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColors[app.status as LeadStatus]}`}>
                                {app.status}
                              </span>
                              <p className="text-xs text-gray-400 mt-2">
                                {format(new Date(app.createdAt), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {leadSubTab === "requests" && (
                  <div className="space-y-4">
                    {helpRequests.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No help requests assigned to you yet</p>
                    ) : (
                      helpRequests.map((req: any) => (
                        <div 
                          key={req.id} 
                          className="bg-gray-50 rounded-lg p-4 border hover:border-brand-navy/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedLead({ ...req, type: "request" })}
                          data-testid={`lead-request-${req.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-brand-navy">{req.name}</h3>
                              <p className="text-sm text-gray-600 capitalize">{req.helpType.replace(/_/g, " ")}</p>
                              <p className="text-sm text-gray-500">{req.email} | {req.phone}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColors[req.status as LeadStatus]}`}>
                                {req.status}
                              </span>
                              <p className="text-xs text-gray-400 mt-2">
                                {format(new Date(req.createdAt), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-brand-navy">
                {selectedLead.type === "application" ? "Affiliate Application" : "Help Request"}
              </h2>
              <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Name</Label>
                  <p className="font-medium">{selectedLead.name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-medium">{selectedLead.email}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Phone</Label>
                  <p className="font-medium">{selectedLead.phone}</p>
                </div>
                {selectedLead.companyName && (
                  <div>
                    <Label className="text-gray-500">Company</Label>
                    <p className="font-medium">{selectedLead.companyName}</p>
                  </div>
                )}
                {selectedLead.helpType && (
                  <div>
                    <Label className="text-gray-500">Help Type</Label>
                    <p className="font-medium capitalize">{selectedLead.helpType.replace(/_/g, " ")}</p>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-gray-500">Description</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedLead.description}</p>
              </div>
              <div>
                <Label htmlFor="status">Update Status</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {["new", "contacted", "in_progress", "closed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedLead({ ...selectedLead, status })}
                      className={`px-4 py-2 rounded-lg font-bold text-sm capitalize transition-colors ${
                        selectedLead.status === status
                          ? "bg-brand-navy text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      data-testid={`button-status-${status}`}
                    >
                      {status.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={selectedLead.notes || ""}
                  onChange={(e) => setSelectedLead({ ...selectedLead, notes: e.target.value })}
                  placeholder="Add notes about this lead..."
                  className="mt-1"
                  data-testid="input-notes"
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedLead(null)}>Cancel</Button>
              <Button 
                onClick={() => {
                  const { type, id, status, notes } = selectedLead;
                  if (type === "application") {
                    updateApplicationMutation.mutate({ id, status, notes });
                  } else {
                    updateHelpRequestMutation.mutate({ id, status, notes });
                  }
                }}
                className="bg-brand-navy"
                data-testid="button-save-lead"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
