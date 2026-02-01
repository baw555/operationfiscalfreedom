import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, LogOut, FileText, HelpCircle, X, Home, FileSignature, 
  Calculator, DollarSign, CheckCircle, AlertCircle, Clock, 
  ArrowRight, TrendingUp, Building2, Copy, Share2, Send, Plane,
  Shield, Lock, Download, Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation, Link } from "wouter";
import { format } from "date-fns";

type LeadStatus = "new" | "contacted" | "in_progress" | "closed";
type MainTab = "overview" | "contracts" | "calculator" | "leads" | "security" | "ranger";

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
  const [leadSubTab, setLeadSubTab] = useState<"applications" | "requests" | "bizleads" | "disability" | "vetpros">("applications");
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // Calculator state
  const [dealAmount, setDealAmount] = useState<number>(100000);
  const [contractRate, setContractRate] = useState<number>(18);
  const [uplineCount, setUplineCount] = useState<number>(0);

  // VSO Air Support state
  const [showVsoModal, setShowVsoModal] = useState(false);
  const [vsoForm, setVsoForm] = useState({ vsoName: "", vsoEmail: "", comments: "" });
  
  // Lead search/filter state
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("all");

  // Check auth - single attempt since session should be verified before redirect
  // If this fails, the user needs to log in again (session was not properly established)
  const { data: authData, isLoading: authLoading, isSuccess: authSuccess } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
    retry: 2, // Limited retries - login page now verifies session before redirect
    retryDelay: 500,
    staleTime: 30000, // Keep auth data fresh for 30 seconds to prevent unnecessary refetches
  });

  useEffect(() => {
    if (!authLoading && (!authData || authData.user?.role !== "affiliate")) {
      setLocation("/affiliate/login");
    }
  }, [authData, authLoading, setLocation]);

  // Fetch VLT affiliate profile (for upline count) - only after auth confirmed
  const { data: vltProfile } = useQuery({
    queryKey: ["vlt-affiliate-me"],
    queryFn: async () => {
      const res = await fetch("/api/vlt-affiliate/me", { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: authSuccess && !!authData?.user,
  });

  // Auto-set upline count from VLT profile
  useEffect(() => {
    if (vltProfile?.uplineCount !== undefined) {
      setUplineCount(vltProfile.uplineCount);
    }
  }, [vltProfile]);

  // Fetch contracts - only after auth confirmed
  const { data: contractTemplates = [], error: contractsError } = useQuery({
    queryKey: ["contract-templates"],
    queryFn: async () => {
      const res = await fetch("/api/contracts/templates", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch contracts");
      return res.json();
    },
    enabled: authSuccess && !!authData?.user,
  });

  // Fetch signed agreements for this user - only after auth confirmed
  const { data: signedAgreements = [], error: signedError } = useQuery({
    queryKey: ["my-signed-agreements"],
    queryFn: async () => {
      const res = await fetch("/api/contracts/my-signed", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch signed agreements");
      return res.json();
    },
    enabled: authSuccess && !!authData?.user,
  });

  // Fetch assigned leads - only after auth confirmed
  const { data: applications = [] } = useQuery({
    queryKey: ["affiliate-applications"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/applications", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: authSuccess && !!authData?.user,
  });

  const { data: helpRequests = [] } = useQuery({
    queryKey: ["affiliate-help-requests"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/help-requests", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: authSuccess && !!authData?.user,
  });

  const { data: businessLeads = [] } = useQuery({
    queryKey: ["affiliate-business-leads"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/business-leads", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: authSuccess && !!authData?.user,
  });

  const { data: disabilityReferrals = [] } = useQuery({
    queryKey: ["affiliate-disability-referrals"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/disability-referrals", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: authSuccess && !!authData?.user,
  });

  const { data: vetProfessionalIntakes = [] } = useQuery({
    queryKey: ["affiliate-vet-professional-intakes"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/vet-professional-intakes", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: authSuccess && !!authData?.user,
  });

  // Fetch referral info - only after auth confirmed
  const { data: referralInfo } = useQuery({
    queryKey: ["affiliate-referral-info"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/referral-info", { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: authSuccess && !!authData?.user,
  });

  // Check NDA status - only after auth is confirmed successful
  const { data: ndaStatus, isLoading: ndaLoading, error: ndaError } = useQuery({
    queryKey: ["/api/affiliate/nda-status"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/nda-status", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to check NDA status");
      return res.json();
    },
    enabled: authSuccess && !!authData?.user, // Wait for auth to be confirmed successful
    retry: 2,
    staleTime: 30000,
  });

  // Check Schedule A status - only after auth is confirmed successful
  const { data: scheduleAStatus } = useQuery<{ signed: boolean; signature: any | null }>({
    queryKey: ["/api/schedule-a/status"],
    queryFn: async () => {
      const res = await fetch("/api/schedule-a/status", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to check Schedule A status");
      return res.json();
    },
    enabled: authSuccess && !!authData?.user,
    staleTime: 30000,
  });

  // Fetch security tracking data - only after auth confirmed
  const { data: securityData, isLoading: securityLoading, error: securityError } = useQuery<{
    ipTracking: any[];
    totalTrackedIPs: number;
    activeTracking: number;
    totalLeadsConverted: number;
    hasSignedNda: boolean;
  }>({
    queryKey: ["/api/affiliate/security-tracking"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/security-tracking", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch security data");
      return res.json();
    },
    enabled: authSuccess && !!authData?.user,
  });

  // Redirect to NDA page if not signed - use effect to avoid render-time navigation
  useEffect(() => {
    if (!ndaLoading && authData?.user && ndaStatus && !ndaStatus.hasSigned) {
      setLocation("/affiliate/nda");
    }
  }, [ndaLoading, authData, ndaStatus, setLocation]);

  // Mutations
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes: string }) => {
      const res = await fetch(`/api/affiliate/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
        credentials: "include",
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
        credentials: "include",
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
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    },
    onSuccess: () => {
      setLocation("/affiliate/login");
    },
  });

  // VSO Air Support mutation
  const vsoAirSupportMutation = useMutation({
    mutationFn: async (data: { vsoName: string; vsoEmail: string; comments: string }) => {
      const res = await fetch("/api/affiliate/vso-air-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Air Support Requested!", description: "Master will review and send VSO projections." });
      setShowVsoModal(false);
      setVsoForm({ vsoName: "", vsoEmail: "", comments: "" });
    },
    onError: () => {
      toast({ title: "Request Failed", description: "Please try again.", variant: "destructive" });
    },
  });

  const copyReferralLink = () => {
    if (referralInfo?.referralLink) {
      const fullLink = `${window.location.origin}${referralInfo.referralLink}`;
      navigator.clipboard.writeText(fullLink);
      toast({ title: "Link Copied!", description: "Share this link to earn referral credit." });
    }
  };

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

  // Filter leads based on search and status
  const filterLead = (lead: any) => {
    const searchLower = leadSearch.toLowerCase();
    const matchesSearch = !leadSearch || 
      lead.name?.toLowerCase().includes(searchLower) ||
      lead.email?.toLowerCase().includes(searchLower) ||
      lead.companyName?.toLowerCase().includes(searchLower) ||
      lead.businessName?.toLowerCase().includes(searchLower) ||
      lead.contactName?.toLowerCase().includes(searchLower);
    const matchesStatus = leadStatusFilter === "all" || lead.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  };

  const filteredApplications = useMemo(() => applications.filter(filterLead), [applications, leadSearch, leadStatusFilter]);
  const filteredHelpRequests = useMemo(() => helpRequests.filter(filterLead), [helpRequests, leadSearch, leadStatusFilter]);
  const filteredBusinessLeads = useMemo(() => businessLeads.filter(filterLead), [businessLeads, leadSearch, leadStatusFilter]);

  if (authLoading || ndaLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xl text-white font-display">Loading Portal...</div>
        </div>
      </div>
    );
  }

  // Block access until NDA is signed - redirect happens in useEffect
  // Only show lock screen if we've confirmed NDA is not signed (not during loading/error)
  if (ndaStatus && !ndaStatus.hasSigned && !ndaError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="text-xl text-white font-display">Portal Access Locked</div>
          <div className="text-gray-300">You must sign the Confidentiality Agreement to access this portal.</div>
          <div className="text-sm text-gray-400">Redirecting...</div>
        </div>
      </div>
    );
  }

  // Show error state if NDA check failed
  if (ndaError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <div className="text-xl text-white font-display">Connection Error</div>
          <div className="text-gray-300">Unable to verify your account status. Please check your connection and try again.</div>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
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
    { id: "leads", label: "Leads", icon: <Users className="w-4 h-4" />, badge: activeLeads > 0 ? activeLeads : undefined },
    { id: "ranger", label: "RANGER E-Sign", icon: <FileText className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
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
            {/* Security Notice */}
            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 shadow-md">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-400 rounded-full flex-shrink-0">
                  <Shield className="w-6 h-6 text-amber-900" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 text-lg flex items-center gap-2">
                    Safety, Security and Circumvention Protocols Active
                    <Lock className="w-4 h-4" />
                  </h3>
                  <p className="text-amber-800 text-sm mt-1">
                    Our system protects your referral commissions using IP address tracking and 30-day cookies with 
                    first-touch attribution - once someone uses your referral link, you're credited even if they 
                    return later without the link.
                  </p>
                  <p className="text-amber-700 text-xs mt-2 italic">
                    This information is confidential and covered by your NDA. Please keep these details private to protect 
                    all affiliates in our network.
                  </p>
                </div>
              </div>
            </div>

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

            {/* Referral Link Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Your Referral Link
                  </h3>
                  <p className="text-white/80 text-sm">Share this link to earn credit for every veteran you help</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 rounded-lg px-4 py-2 font-mono text-sm">
                    {referralInfo?.referralCode || 'Loading...'}
                  </div>
                  <Button
                    onClick={copyReferralLink}
                    className="bg-white text-green-700 hover:bg-white/90 font-bold"
                    data-testid="button-copy-referral"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>
              {referralInfo && (
                <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{referralInfo.totalReferrals || 0}</p>
                    <p className="text-sm text-white/70">Total Referrals</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{referralInfo.activeReferrals || 0}</p>
                    <p className="text-sm text-white/70">Active Leads</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-brand-navy mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      <p className="text-sm text-gray-500">{pendingContracts.length} pending</p>
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
                <button
                  onClick={() => setMainTab("contracts")}
                  className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-brand-navy hover:bg-gray-50 transition-colors text-left"
                  data-testid="action-contracts"
                >
                  <div className="p-2 rounded-full bg-slate-700 text-white">
                    <FileSignature className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy">View Contracts</p>
                    <p className="text-sm text-gray-500">Agreements & documents</p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
                </button>
                <button
                  onClick={() => setShowVsoModal(true)}
                  className="flex items-center gap-3 p-4 rounded-lg border-2 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors text-left"
                  data-testid="action-vso-air-support"
                >
                  <div className="p-2 rounded-full bg-blue-600 text-white">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy">VSO Projections</p>
                    <p className="text-sm text-gray-500">Request air support</p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto text-blue-500" />
                </button>
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
            {/* Schedule A - Commission Agreement */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <FileText className="w-6 h-6 text-amber-400" />
                  Schedule A - Commission Distribution Agreement
                </h2>
              </div>
              <div className="p-6">
                {scheduleAStatus?.signed ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-green-800">Agreement Signed</p>
                        <p className="text-sm text-green-600">
                          Signed by {scheduleAStatus.signature?.affiliateName} on{" "}
                          {scheduleAStatus.signature?.signedAt 
                            ? format(new Date(scheduleAStatus.signature.signedAt), "MMM d, yyyy")
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href="/schedule-a">
                        <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-green-300 text-green-700 hover:bg-green-50"
                        onClick={() => window.open('/api/schedule-a/download', '_blank')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-bold text-red-800">Action Required</p>
                          <p className="text-sm text-red-600">
                            Please review and sign the Schedule A Commission Distribution Agreement to continue.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href="/schedule-a">
                          <Button variant="outline" size="sm" className="border-slate-300">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        </Link>
                        <Link href="/schedule-a">
                          <Button className="bg-red-600 hover:bg-red-700 text-white font-bold">
                            <FileSignature className="w-4 h-4 mr-2" />
                            Sign Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Other Required Agreements */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <FileSignature className="w-6 h-6 text-amber-400" />
                  Service Agreements
                </h2>
              </div>
              <div className="p-6">
                {pendingContracts.length === 0 && signedCount === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No additional service agreements at this time.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Pending Contracts */}
                    {pendingContracts.map((contract: any) => (
                      <div key={contract.id} className="border-2 border-yellow-200 rounded-lg p-4 bg-yellow-50" data-testid={`pending-contract-${contract.id}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                              <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">{contract.name}</h4>
                              <p className="text-sm text-slate-500">
                                {contract.companyName} • Version {contract.version}
                              </p>
                              {contract.serviceName && (
                                <p className="text-sm text-slate-600 mt-1">
                                  Service: {contract.serviceName}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                              Pending
                            </span>
                            <Link href="/sign-contract">
                              <Button className="bg-brand-red hover:bg-brand-red/90" size="sm" data-testid={`sign-contract-${contract.id}`}>
                                <FileSignature className="w-4 h-4 mr-2" />
                                Sign
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Signed Contracts */}
                    {signedAgreements.map((agreement: any) => {
                      const template = contractTemplates.find((t: any) => t.id === agreement.contractTemplateId);
                      return (
                        <div key={agreement.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200" data-testid={`signed-agreement-${agreement.id}`}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-bold text-green-800">{template?.name || 'Agreement'}</p>
                              <p className="text-sm text-green-600">
                                Signed {format(new Date(agreement.signedAt), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-green-300 text-green-700 hover:bg-green-50"
                            onClick={() => window.open(`/api/contracts/signed/${agreement.id}/download`, '_blank')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
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
                  The higher your rank, the more you keep. At E7 (SFC) with no uplines, you earn 75% (69% base + 6% compression). 
                  At E1 (PVT) with 6 uplines, you earn 69% base. Empty slots compress to YOU, not the house.
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
              <div className="flex border-b flex-wrap">
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
                <button
                  onClick={() => setLeadSubTab("bizleads")}
                  className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-wide transition-colors ${
                    leadSubTab === "bizleads" ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  data-testid="subtab-bizleads"
                >
                  <Building2 className="h-4 w-4 inline mr-2" /> 
                  Biz Leads ({businessLeads.length})
                </button>
                <button
                  onClick={() => setLeadSubTab("disability")}
                  className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-wide transition-colors ${
                    leadSubTab === "disability" ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  data-testid="subtab-disability"
                >
                  <Shield className="h-4 w-4 inline mr-2" /> 
                  Disability ({disabilityReferrals.length})
                </button>
                <button
                  onClick={() => setLeadSubTab("vetpros")}
                  className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-wide transition-colors ${
                    leadSubTab === "vetpros" ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  data-testid="subtab-vetpros"
                >
                  <Users className="h-4 w-4 inline mr-2" /> 
                  Vet Pros ({vetProfessionalIntakes.length})
                </button>
              </div>

              {/* Search and Filter Bar */}
              <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name, email, or company..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="w-full"
                    data-testid="input-lead-search"
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "new", "contacted", "in_progress", "closed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setLeadStatusFilter(status)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold capitalize transition-colors ${
                        leadStatusFilter === status
                          ? "bg-brand-navy text-white"
                          : "bg-white text-gray-600 border hover:bg-gray-100"
                      }`}
                      data-testid={`filter-status-${status}`}
                    >
                      {status === "all" ? "All" : status.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {leadSubTab === "applications" && (
                  <div className="space-y-4">
                    {filteredApplications.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        {applications.length === 0 
                          ? "No applications assigned to you yet" 
                          : "No applications match your search"}
                      </p>
                    ) : (
                      filteredApplications.map((app: any) => (
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
                    {filteredHelpRequests.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        {helpRequests.length === 0 
                          ? "No help requests assigned to you yet" 
                          : "No help requests match your search"}
                      </p>
                    ) : (
                      filteredHelpRequests.map((req: any) => (
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

                {leadSubTab === "bizleads" && (
                  <div className="space-y-4">
                    {filteredBusinessLeads.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        {businessLeads.length === 0 
                          ? "No business leads referred by you yet" 
                          : "No business leads match your search"}
                      </p>
                    ) : (
                      filteredBusinessLeads.map((lead: any) => (
                        <div 
                          key={lead.id} 
                          className="bg-gray-50 rounded-lg p-4 border hover:border-brand-navy/50 transition-colors"
                          data-testid={`lead-business-${lead.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-brand-navy">{lead.businessName}</h3>
                              <p className="text-sm text-gray-600">{lead.contactName} - {lead.position}</p>
                              <p className="text-sm text-gray-500">{lead.email} | {lead.phone}</p>
                              <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                                lead.leadType === "access_talent" ? "bg-blue-100 text-blue-700" :
                                lead.leadType === "utilize_service" ? "bg-green-100 text-green-700" :
                                "bg-purple-100 text-purple-700"
                              }`}>
                                {lead.leadType === "access_talent" ? "Access Talent" :
                                 lead.leadType === "utilize_service" ? "Utilize Service" :
                                 "Promote Network"}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColors[lead.status as LeadStatus]}`}>
                                {lead.status}
                              </span>
                              <p className="text-xs text-gray-400 mt-2">
                                {format(new Date(lead.createdAt), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {leadSubTab === "disability" && (
                  <div className="space-y-4">
                    {disabilityReferrals.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        No disability claim referrals yet. Share your referral link with veterans who need help with their VA disability claims.
                      </p>
                    ) : (
                      disabilityReferrals.map((referral: any) => (
                        <div 
                          key={referral.id} 
                          className="bg-gray-50 rounded-lg p-4 border hover:border-brand-navy/50 transition-colors"
                          data-testid={`lead-disability-${referral.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-brand-navy">{referral.firstName} {referral.lastName}</h3>
                              <p className="text-sm text-gray-600">{referral.email} | {referral.phone}</p>
                              {referral.city && referral.state && (
                                <p className="text-sm text-gray-500">{referral.city}, {referral.state}</p>
                              )}
                              <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                                referral.claimType === "initial" ? "bg-green-100 text-green-700" :
                                referral.claimType === "increase" ? "bg-blue-100 text-blue-700" :
                                referral.claimType === "denial" ? "bg-yellow-100 text-yellow-700" :
                                referral.claimType === "ssdi" ? "bg-purple-100 text-purple-700" :
                                "bg-pink-100 text-pink-700"
                              }`}>
                                {referral.claimType === "initial" ? "Initial Claim" :
                                 referral.claimType === "increase" ? "Rating Increase" :
                                 referral.claimType === "denial" ? "Denial Appeal" :
                                 referral.claimType === "ssdi" ? "SSDI" :
                                 "Widow/Widower"}
                              </span>
                              {referral.currentRating && (
                                <span className="inline-block ml-2 mt-2 px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                                  Current: {referral.currentRating}%
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColors[referral.status as LeadStatus] || "bg-blue-100 text-blue-800"}`}>
                                {referral.status}
                              </span>
                              <p className="text-xs text-gray-400 mt-2">
                                {format(new Date(referral.createdAt), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {leadSubTab === "vetpros" && (
                  <div className="space-y-4">
                    {vetProfessionalIntakes.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        No vet professional referrals yet. Share your referral link with attorneys, insurance agents, CPAs, and medical professionals who serve veterans.
                      </p>
                    ) : (
                      vetProfessionalIntakes.map((professional: any) => (
                        <div 
                          key={professional.id} 
                          className="bg-gray-50 rounded-lg p-4 border hover:border-brand-navy/50 transition-colors"
                          data-testid={`lead-vetpro-${professional.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-brand-navy">{professional.firstName} {professional.lastName}</h3>
                              <p className="text-sm text-gray-600">{professional.email} | {professional.phone}</p>
                              {professional.businessName && (
                                <p className="text-sm text-gray-500">{professional.businessName}</p>
                              )}
                              <span className={`inline-block mt-2 px-2 py-1 rounded text-xs capitalize ${
                                professional.professionType === "attorneys" ? "bg-blue-100 text-blue-700" :
                                professional.professionType === "insurance" ? "bg-green-100 text-green-700" :
                                professional.professionType === "cpa" ? "bg-yellow-100 text-yellow-700" :
                                "bg-purple-100 text-purple-700"
                              }`}>
                                {professional.professionType}
                              </span>
                              {professional.licenseNumber && (
                                <span className="inline-block ml-2 mt-2 px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                                  License: {professional.licenseNumber}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColors[professional.status as LeadStatus] || "bg-blue-100 text-blue-800"}`}>
                                {professional.status}
                              </span>
                              <p className="text-xs text-gray-400 mt-2">
                                {format(new Date(professional.createdAt), "MMM d, yyyy")}
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

        {/* ===== SECURITY TAB ===== */}
        {mainTab === "security" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-brand-navy mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Security Measures
              </h2>
              <p className="text-gray-600 mb-6">
                Track your referral link activity and security status. IP addresses are tracked for 30 days using first-touch attribution.
              </p>

              {securityLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full animate-spin" />
                  <span className="ml-3 text-gray-600">Loading security data...</span>
                </div>
              )}

              {securityError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Failed to load security data</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">Please refresh the page to try again.</p>
                </div>
              )}

              {!securityLoading && !securityError && (
                <>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">IPs Tracked</p>
                  <p className="text-2xl font-bold text-brand-navy">{securityData?.totalTrackedIPs || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Active (30d)</p>
                  <p className="text-2xl font-bold text-green-600">{securityData?.activeTracking || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Leads Converted</p>
                  <p className="text-2xl font-bold text-brand-red">{securityData?.totalLeadsConverted || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">NDCA Status</p>
                  <p className="text-2xl font-bold">
                    {securityData?.hasSignedNda ? (
                      <span className="text-green-600">Signed</span>
                    ) : (
                      <span className="text-red-600">Pending</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="font-bold text-brand-navy">IP Tracking Log</h3>
                  <p className="text-sm text-gray-600">People who clicked your referral links</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">IP Address</th>
                        <th className="p-3 text-left">Referral Code</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Clicked</th>
                        <th className="p-3 text-left">Tracked Date</th>
                        <th className="p-3 text-left">Expires</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!securityData?.ipTracking?.length ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-gray-500">
                            No referral link clicks tracked yet. Share your referral link to start tracking!
                          </td>
                        </tr>
                      ) : (
                        securityData.ipTracking.map((tracking: any) => (
                          <tr key={tracking.id} className="border-t hover:bg-gray-50" data-testid={`row-ip-tracking-${tracking.id}`}>
                            <td className="p-3 font-mono text-sm">{tracking.ipAddress}</td>
                            <td className="p-3 font-mono text-sm">{tracking.referralCode}</td>
                            <td className="p-3">
                              {tracking.isActive ? (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Active</span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">Expired</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                Yes
                              </span>
                            </td>
                            <td className="p-3 text-gray-600">{new Date(tracking.createdAt).toLocaleDateString()}</td>
                            <td className="p-3 text-gray-600">{new Date(tracking.expiresAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              </>
              )}
            </div>
          </div>
        )}

        {/* ===== RANGER E-SIGN TAB ===== */}
        {mainTab === "ranger" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    RANGER E-Signature Platform
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Military-grade document security • HIPAA Compliant • 256-bit Encryption
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Secure Connection
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileSignature className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-blue-900">Send Contracts</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Create and send contracts for electronic signature with tokenized secure links.
                  </p>
                  <Link href="/document-signature">
                    <Button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Send className="w-4 h-4 mr-2" />
                      Open RANGER
                    </Button>
                  </Link>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-900">Track Status</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Monitor pending contracts and view signed agreements with full audit trails.
                  </p>
                  <Link href="/document-signature">
                    <Button variant="outline" className="mt-3 w-full border-green-600 text-green-700 hover:bg-green-50">
                      <Eye className="w-4 h-4 mr-2" />
                      View Dashboard
                    </Button>
                  </Link>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="w-5 h-5 text-amber-600" />
                    <span className="font-bold text-amber-900">Download PDFs</span>
                  </div>
                  <p className="text-sm text-amber-700">
                    Generate and download signed agreements as secure PDF documents.
                  </p>
                  <Link href="/document-signature">
                    <Button variant="outline" className="mt-3 w-full border-amber-600 text-amber-700 hover:bg-amber-50">
                      <FileText className="w-4 h-4 mr-2" />
                      Manage Documents
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <h3 className="font-bold text-brand-navy mb-2">RANGER Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    AI Contract Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    HIPAA Compliant Storage
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Email Notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Tokenized Sign Links
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Signature Canvas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    PDF Generation
                  </li>
                </ul>
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

      {/* VSO Air Support Modal */}
      {showVsoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Plane className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-brand-navy">Request Air Support</h2>
                  <p className="text-sm text-gray-500">Send VSO projections to recruit a VSO</p>
                </div>
              </div>
              <button onClick={() => setShowVsoModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Recruiter Bonus:</strong> If this VSO signs up, you earn a 1% recruiter bonus on all their revenue!
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vsoName">VSO Contact Name *</Label>
                <Input
                  id="vsoName"
                  placeholder="John Smith"
                  value={vsoForm.vsoName}
                  onChange={(e) => setVsoForm({ ...vsoForm, vsoName: e.target.value })}
                  data-testid="input-vso-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vsoEmail">VSO Email Address *</Label>
                <Input
                  id="vsoEmail"
                  type="email"
                  placeholder="vso@organization.org"
                  value={vsoForm.vsoEmail}
                  onChange={(e) => setVsoForm({ ...vsoForm, vsoEmail: e.target.value })}
                  data-testid="input-vso-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vsoComments">Comments (Optional)</Label>
                <Textarea
                  id="vsoComments"
                  placeholder="Any context about this VSO or how you connected..."
                  value={vsoForm.comments}
                  onChange={(e) => setVsoForm({ ...vsoForm, comments: e.target.value })}
                  data-testid="input-vso-comments"
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowVsoModal(false)}>Cancel</Button>
              <Button
                onClick={() => vsoAirSupportMutation.mutate(vsoForm)}
                disabled={!vsoForm.vsoName || !vsoForm.vsoEmail || vsoAirSupportMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-submit-vso"
              >
                <Send className="w-4 h-4 mr-2" />
                {vsoAirSupportMutation.isPending ? "Sending..." : "Request Air Support"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
