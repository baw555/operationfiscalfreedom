import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, Users, FileText, ClipboardCheck, AlertTriangle,
  CheckCircle, X, Clock, Calendar, Eye, Lock, FileWarning,
  Plus, Search, Filter, Download, RefreshCw, AlertCircle,
  Building2, GraduationCap, Activity, Bookmark, Info, ExternalLink
} from "lucide-react";

const hipaaControls = [
  { id: 1, name: "Password Hashing (bcrypt)", category: "Technical", status: "compliant", description: "All passwords encrypted with bcrypt algorithm", regulation: "45 CFR §164.312(a)(1)", evidence: "Verified in auth.ts - uses bcrypt for password hashing" },
  { id: 2, name: "HTTPS/TLS Encryption", category: "Transmission", status: "compliant", description: "Platform provides TLS encryption for all traffic", regulation: "45 CFR §164.312(e)(1)", evidence: "Replit platform enforces HTTPS" },
  { id: 3, name: "Role-Based Access Control", category: "Technical", status: "compliant", description: "Granular RBAC with minimum-necessary permissions", regulation: "45 CFR §164.312(a)(1)", evidence: "requirePermission middleware with role-based permissions in routes.ts" },
  { id: 4, name: "Input Validation (Zod)", category: "Technical", status: "compliant", description: "All API inputs validated with Zod schemas", regulation: "45 CFR §164.312(c)(1)", evidence: "All route handlers use Zod validation" },
  { id: 5, name: "Session Authentication", category: "Technical", status: "compliant", description: "PostgreSQL session storage with secure cookies", regulation: "45 CFR §164.312(d)", evidence: "Session configured with httpOnly, secure, sameSite flags" },
  { id: 6, name: "HIPAA Audit Trail", category: "Audit", status: "compliant", description: "System-wide audit logging for PHI access", regulation: "45 CFR §164.312(b)", evidence: "hipaaAuditLog table captures all access events" },
  { id: 7, name: "Database Encryption (PostgreSQL)", category: "Technical", status: "compliant", description: "Neon PostgreSQL provides encryption at rest", regulation: "45 CFR §164.312(a)(2)(iv)", evidence: "Neon platform default encryption" },
  { id: 8, name: "Unique User Identification", category: "Technical", status: "compliant", description: "Each user has unique database ID", regulation: "45 CFR §164.312(a)(2)(i)", evidence: "Users table with unique ID and email" },
  { id: 9, name: "Session Timeout (15 min)", category: "Technical", status: "compliant", description: "Auto-logoff after 15 minutes of inactivity", regulation: "45 CFR §164.312(a)(2)(iii)", evidence: "SESSION_TIMEOUT_MINUTES = 15 with rolling expiry in routes.ts" },
  { id: 10, name: "Multi-Factor Authentication", category: "Technical", status: "compliant", description: "TOTP-based MFA with QR code enrollment and backup codes", regulation: "45 CFR §164.312(d)", evidence: "Full MFA implementation with /api/mfa/* endpoints using otplib" },
  { id: 11, name: "System-Wide Audit Logging", category: "Audit", status: "compliant", description: "Comprehensive PHI access logging", regulation: "45 CFR §164.312(b)", evidence: "hipaaAuditLog table with PHI access flags" },
  { id: 12, name: "HSTS Headers", category: "Transmission", status: "compliant", description: "Strict Transport Security with 1-year max-age and preload", regulation: "45 CFR §164.312(e)(2)", evidence: "Helmet.js HSTS middleware configured in routes.ts" },
  { id: 13, name: "Privacy Policy Notice", category: "Administrative", status: "compliant", description: "Public privacy policy page implemented", regulation: "45 CFR §164.520", evidence: "/privacy-policy page exists" },
  { id: 14, name: "Breach Notification Procedures", category: "Administrative", status: "compliant", description: "Breach procedures documented with 60-day workflow", regulation: "45 CFR §164.404", evidence: "/breach-procedures page exists" },
  { id: 15, name: "Business Associate Agreements", category: "Administrative", status: "compliant", description: "BAA tracking system with vendor management", regulation: "45 CFR §164.504(e)", evidence: "businessAssociateAgreements table with full CRUD in HIPAA admin" },
  { id: 16, name: "Risk Assessment Documentation", category: "Administrative", status: "compliant", description: "Risk assessment system active", regulation: "45 CFR §164.308(a)(1)(ii)(A)", evidence: "HIPAA controls matrix with evidence-based scoring" },
  { id: 17, name: "Workforce Training Records", category: "Administrative", status: "compliant", description: "Training tracking system implemented", regulation: "45 CFR §164.308(a)(5)", evidence: "hipaaTrainingRecords table and admin UI" },
  { id: 18, name: "Emergency Access Procedures", category: "Technical", status: "compliant", description: "Emergency access SOP documented with authorization workflow", regulation: "45 CFR §164.312(a)(2)(ii)", evidence: "/emergency-access page with detailed procedures" }
];

export default function HipaaAdmin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [baaDialogOpen, setBaaDialogOpen] = useState(false);
  const [trainingDialogOpen, setTrainingDialogOpen] = useState(false);
  const [auditFilters, setAuditFilters] = useState({ user: "", resourceType: "", phiOnly: false });
  const [editingBaa, setEditingBaa] = useState<any>(null);

  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!userLoading && (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "master"))) {
      setLocation("/admin/login");
    }
  }, [currentUser, userLoading, setLocation]);

  const { data: baaData = [], refetch: refetchBaa } = useQuery({
    queryKey: ["hipaa-baa"],
    queryFn: async () => {
      const res = await fetch("/api/hipaa/baa", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
  });

  const { data: trainingData = [], refetch: refetchTraining } = useQuery({
    queryKey: ["hipaa-training"],
    queryFn: async () => {
      const res = await fetch("/api/hipaa/training", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
  });

  const { data: expiredTraining = [] } = useQuery({
    queryKey: ["hipaa-training-expired"],
    queryFn: async () => {
      const res = await fetch("/api/hipaa/training/expired", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
  });

  const { data: auditLogs = [], refetch: refetchAuditLogs } = useQuery({
    queryKey: ["hipaa-audit-logs", auditFilters.phiOnly],
    queryFn: async () => {
      const endpoint = auditFilters.phiOnly ? "/api/hipaa/audit-logs/phi" : "/api/hipaa/audit-logs";
      const res = await fetch(endpoint, { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
  });

  const { data: usersData = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
  });

  const createBaaMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/hipaa/baa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create BAA");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "BAA Created", description: "Business Associate Agreement record created successfully." });
      setBaaDialogOpen(false);
      refetchBaa();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create BAA record.", variant: "destructive" });
    }
  });

  const updateBaaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/hipaa/baa/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to update BAA");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "BAA Updated", description: "Business Associate Agreement record updated successfully." });
      setBaaDialogOpen(false);
      setEditingBaa(null);
      refetchBaa();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update BAA record.", variant: "destructive" });
    }
  });

  const createTrainingMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/hipaa/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create training record");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Training Record Created", description: "Training record added successfully." });
      setTrainingDialogOpen(false);
      refetchTraining();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create training record.", variant: "destructive" });
    }
  });

  const complianceScore = useMemo(() => {
    const compliant = hipaaControls.filter(c => c.status === "compliant").length;
    const partial = hipaaControls.filter(c => c.status === "partial").length;
    return Math.round(((compliant + partial * 0.5) / hipaaControls.length) * 100);
  }, []);

  const executedBaaCount = useMemo(() => {
    return baaData.filter((b: any) => b.baaStatus === "executed").length;
  }, [baaData]);

  const trainingComplianceRate = useMemo(() => {
    if (usersData.length === 0) return 100;
    const usersWithValidTraining = new Set(
      trainingData
        .filter((t: any) => !t.expiresAt || new Date(t.expiresAt) > new Date())
        .map((t: any) => t.userId)
    );
    return Math.round((usersWithValidTraining.size / usersData.length) * 100);
  }, [trainingData, usersData]);

  const lastAuditLog = useMemo(() => {
    if (auditLogs.length === 0) return null;
    return auditLogs[0];
  }, [auditLogs]);

  const daysSinceLastAudit = useMemo(() => {
    if (!lastAuditLog) return "N/A";
    const lastDate = new Date(lastAuditLog.timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [lastAuditLog]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not_started":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Not Started</Badge>;
      case "requested":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Requested</Badge>;
      case "in_review":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">In Review</Badge>;
      case "executed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Executed</Badge>;
      case "expired":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Expired</Badge>;
      case "not_applicable":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">N/A</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">{status}</Badge>;
    }
  };

  const getControlStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "partial":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "missing":
        return <X className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log: any) => {
      if (auditFilters.user && !log.userName?.toLowerCase().includes(auditFilters.user.toLowerCase())) {
        return false;
      }
      if (auditFilters.resourceType && log.resourceType !== auditFilters.resourceType) {
        return false;
      }
      return true;
    });
  }, [auditLogs, auditFilters]);

  const [baaForm, setBaaForm] = useState({
    vendorName: "",
    vendorType: "",
    vendorContact: "",
    vendorEmail: "",
    baaStatus: "not_started",
    description: "",
    phiShared: "",
    securityMeasures: "",
    notes: ""
  });

  const [trainingForm, setTrainingForm] = useState({
    userId: "",
    trainingType: "initial",
    trainingName: "",
    completedAt: new Date().toISOString().split("T")[0],
    expiresAt: "",
    score: "",
    passed: true,
    notes: ""
  });

  useEffect(() => {
    if (editingBaa) {
      setBaaForm({
        vendorName: editingBaa.vendorName || "",
        vendorType: editingBaa.vendorType || "",
        vendorContact: editingBaa.vendorContact || "",
        vendorEmail: editingBaa.vendorEmail || "",
        baaStatus: editingBaa.baaStatus || "not_started",
        description: editingBaa.description || "",
        phiShared: editingBaa.phiShared || "",
        securityMeasures: editingBaa.securityMeasures || "",
        notes: editingBaa.notes || ""
      });
    } else {
      setBaaForm({
        vendorName: "",
        vendorType: "",
        vendorContact: "",
        vendorEmail: "",
        baaStatus: "not_started",
        description: "",
        phiShared: "",
        securityMeasures: "",
        notes: ""
      });
    }
  }, [editingBaa]);

  const handleBaaSubmit = () => {
    if (editingBaa) {
      updateBaaMutation.mutate({ id: editingBaa.id, data: baaForm });
    } else {
      createBaaMutation.mutate(baaForm);
    }
  };

  const handleTrainingSubmit = () => {
    createTrainingMutation.mutate({
      ...trainingForm,
      userId: parseInt(trainingForm.userId),
      score: trainingForm.score ? parseInt(trainingForm.score) : null,
      completedAt: new Date(trainingForm.completedAt).toISOString(),
      expiresAt: trainingForm.expiresAt ? new Date(trainingForm.expiresAt).toISOString() : null
    });
  };

  if (userLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#1a365d]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-display text-xl">Loading HIPAA Command Center...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#1a365d] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="relative container mx-auto px-4 py-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-[#FFB800]/20 to-[#FFB800]/5 rounded-2xl border border-[#FFB800]/30 shadow-lg shadow-[#FFB800]/10">
                <Shield className="w-16 h-16 text-[#FFB800]" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight" data-testid="hipaa-title">
              <span className="bg-gradient-to-r from-[#FFB800] via-yellow-300 to-[#FFB800] bg-clip-text text-transparent drop-shadow-lg">
                HIPAA COMPLIANCE
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-display mt-2 text-white/90 tracking-widest">
              COMMAND CENTER
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Centralized management for Protected Health Information (PHI) security, Business Associate Agreements, workforce training, and audit compliance.
            </p>

            <div className="mt-8 inline-flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-[#FFB800]/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#FFB800]" data-testid="compliance-score">{complianceScore}%</div>
                <div className="text-sm text-gray-400">Compliance Score</div>
              </div>
              <div className="w-32">
                <Progress value={complianceScore} className="h-3 bg-gray-800" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <Card className="bg-gradient-to-br from-green-600/20 to-green-900/40 border-green-500/30" data-testid="stat-controls">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">Controls Implemented</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {hipaaControls.filter(c => c.status === "compliant").length}/{hipaaControls.length}
                    </p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <ClipboardCheck className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/40 border-blue-500/30" data-testid="stat-baa">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">BAAs Executed</p>
                    <p className="text-3xl font-bold text-white mt-1">{executedBaaCount}</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Building2 className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/40 border-purple-500/30" data-testid="stat-training">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">Training Compliance</p>
                    <p className="text-3xl font-bold text-white mt-1">{trainingComplianceRate}%</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <GraduationCap className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-600/20 to-amber-900/40 border-amber-500/30" data-testid="stat-audit">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">Days Since Last Audit</p>
                    <p className="text-3xl font-bold text-white mt-1">{daysSinceLastAudit}</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Activity className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 bg-black/40 border border-white/10 rounded-xl p-1 mb-8" data-testid="hipaa-tabs">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFB800] data-[state=active]:to-amber-600 rounded-lg font-display"
                data-testid="tab-overview"
              >
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Controls
              </TabsTrigger>
              <TabsTrigger
                value="baa"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFB800] data-[state=active]:to-amber-600 rounded-lg font-display"
                data-testid="tab-baa"
              >
                <Building2 className="w-4 h-4 mr-2" />
                BAAs
              </TabsTrigger>
              <TabsTrigger
                value="training"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFB800] data-[state=active]:to-amber-600 rounded-lg font-display"
                data-testid="tab-training"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Training
              </TabsTrigger>
              <TabsTrigger
                value="audit"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFB800] data-[state=active]:to-amber-600 rounded-lg font-display"
                data-testid="tab-audit"
              >
                <FileText className="w-4 h-4 mr-2" />
                Audit Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-[#FFB800] flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5" />
                    HIPAA Controls Matrix
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    18 essential HIPAA security controls with implementation status and CFR references
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-3">
                      {hipaaControls.map((control) => (
                        <motion.div
                          key={control.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: control.id * 0.03 }}
                          className={`p-4 rounded-lg border ${
                            control.status === "compliant"
                              ? "bg-green-500/10 border-green-500/30"
                              : control.status === "partial"
                              ? "bg-amber-500/10 border-amber-500/30"
                              : "bg-red-500/10 border-red-500/30"
                          }`}
                          data-testid={`control-${control.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              {getControlStatusIcon(control.status)}
                              <div>
                                <h4 className="font-semibold text-white">{control.name}</h4>
                                <p className="text-sm text-gray-400 mt-1">{control.description}</p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <Badge className="bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/30 text-xs">
                                    {control.category}
                                  </Badge>
                                  <span className="text-xs text-blue-400 font-mono">{control.regulation}</span>
                                </div>
                                {control.evidence && (
                                  <p className="text-xs text-gray-500 mt-2 italic">
                                    Evidence: {control.evidence}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Badge
                              className={
                                control.status === "compliant"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : control.status === "partial"
                                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                              }
                            >
                              {control.status === "compliant" ? "Compliant" : control.status === "partial" ? "Partial" : "Missing"}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="baa" className="mt-0">
              <Card className="bg-black/40 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#FFB800] flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Business Associate Agreements
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Track BAA status with all vendors handling PHI
                    </CardDescription>
                  </div>
                  <Dialog open={baaDialogOpen} onOpenChange={(open) => { setBaaDialogOpen(open); if (!open) setEditingBaa(null); }}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#FFB800] text-black hover:bg-[#FFB800]/90" data-testid="add-baa-btn">
                        <Plus className="w-4 h-4 mr-2" />
                        Add BAA Record
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0f1f3a] border-white/10 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-[#FFB800]">{editingBaa ? "Edit" : "Add"} Business Associate Agreement</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Record details about a vendor's BAA status
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="vendorName">Vendor Name</Label>
                          <Input
                            id="vendorName"
                            value={baaForm.vendorName}
                            onChange={(e) => setBaaForm({ ...baaForm, vendorName: e.target.value })}
                            className="bg-black/40 border-white/20"
                            data-testid="input-vendor-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vendorType">Vendor Type</Label>
                          <Select value={baaForm.vendorType} onValueChange={(v) => setBaaForm({ ...baaForm, vendorType: v })}>
                            <SelectTrigger className="bg-black/40 border-white/20" data-testid="select-vendor-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hosting">Hosting</SelectItem>
                              <SelectItem value="email">Email Service</SelectItem>
                              <SelectItem value="ai">AI/ML Service</SelectItem>
                              <SelectItem value="database">Database</SelectItem>
                              <SelectItem value="analytics">Analytics</SelectItem>
                              <SelectItem value="payment">Payment</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vendorContact">Contact Name</Label>
                          <Input
                            id="vendorContact"
                            value={baaForm.vendorContact}
                            onChange={(e) => setBaaForm({ ...baaForm, vendorContact: e.target.value })}
                            className="bg-black/40 border-white/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vendorEmail">Contact Email</Label>
                          <Input
                            id="vendorEmail"
                            type="email"
                            value={baaForm.vendorEmail}
                            onChange={(e) => setBaaForm({ ...baaForm, vendorEmail: e.target.value })}
                            className="bg-black/40 border-white/20"
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="baaStatus">BAA Status</Label>
                          <Select value={baaForm.baaStatus} onValueChange={(v) => setBaaForm({ ...baaForm, baaStatus: v })}>
                            <SelectTrigger className="bg-black/40 border-white/20" data-testid="select-baa-status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not_started">Not Started</SelectItem>
                              <SelectItem value="requested">Requested</SelectItem>
                              <SelectItem value="in_review">In Review</SelectItem>
                              <SelectItem value="executed">Executed</SelectItem>
                              <SelectItem value="expired">Expired</SelectItem>
                              <SelectItem value="not_applicable">Not Applicable</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={baaForm.description}
                            onChange={(e) => setBaaForm({ ...baaForm, description: e.target.value })}
                            className="bg-black/40 border-white/20"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="phiShared">PHI Shared</Label>
                          <Textarea
                            id="phiShared"
                            value={baaForm.phiShared}
                            onChange={(e) => setBaaForm({ ...baaForm, phiShared: e.target.value })}
                            className="bg-black/40 border-white/20"
                            placeholder="Describe what PHI is shared with this vendor"
                            rows={2}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => { setBaaDialogOpen(false); setEditingBaa(null); }}>
                          Cancel
                        </Button>
                        <Button
                          className="bg-[#FFB800] text-black hover:bg-[#FFB800]/90"
                          onClick={handleBaaSubmit}
                          data-testid="submit-baa-btn"
                        >
                          {editingBaa ? "Update" : "Create"} BAA Record
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-gray-400">Vendor Name</TableHead>
                        <TableHead className="text-gray-400">Type</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400">PHI Shared</TableHead>
                        <TableHead className="text-gray-400">Executed Date</TableHead>
                        <TableHead className="text-gray-400">Expiration</TableHead>
                        <TableHead className="text-gray-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {baaData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                            No BAA records found. Add your first vendor BAA record above.
                          </TableCell>
                        </TableRow>
                      ) : (
                        baaData.map((baa: any) => (
                          <TableRow key={baa.id} className="border-white/10" data-testid={`baa-row-${baa.id}`}>
                            <TableCell className="font-medium text-white">{baa.vendorName}</TableCell>
                            <TableCell className="text-gray-300 capitalize">{baa.vendorType?.replace("_", " ")}</TableCell>
                            <TableCell>{getStatusBadge(baa.baaStatus)}</TableCell>
                            <TableCell className="text-gray-300 max-w-[200px] truncate">{baa.phiShared || "—"}</TableCell>
                            <TableCell className="text-gray-300">
                              {baa.executedDate ? new Date(baa.executedDate).toLocaleDateString() : "—"}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {baa.expirationDate ? new Date(baa.expirationDate).toLocaleDateString() : "—"}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setEditingBaa(baa); setBaaDialogOpen(true); }}
                                className="text-[#FFB800] hover:text-[#FFB800]/80"
                                data-testid={`edit-baa-${baa.id}`}
                              >
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="training" className="mt-0">
              <div className="space-y-4">
                {expiredTraining.length > 0 && (
                  <Card className="bg-red-500/10 border-red-500/30">
                    <CardContent className="p-4 flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-red-400" />
                      <div>
                        <p className="font-semibold text-red-400">Expired Training Alert</p>
                        <p className="text-sm text-gray-300">
                          {expiredTraining.length} training record(s) have expired and require recertification.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-black/40 border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-[#FFB800] flex items-center gap-2">
                        <GraduationCap className="w-5 h-5" />
                        Training Records
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Track HIPAA security awareness training completion
                      </CardDescription>
                    </div>
                    <Dialog open={trainingDialogOpen} onOpenChange={setTrainingDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#FFB800] text-black hover:bg-[#FFB800]/90" data-testid="add-training-btn">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Training Record
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0f1f3a] border-white/10 text-white max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-[#FFB800]">Add Training Record</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Record a user's HIPAA training completion
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="userId">User</Label>
                            <Select value={trainingForm.userId} onValueChange={(v) => setTrainingForm({ ...trainingForm, userId: v })}>
                              <SelectTrigger className="bg-black/40 border-white/20" data-testid="select-training-user">
                                <SelectValue placeholder="Select user" />
                              </SelectTrigger>
                              <SelectContent>
                                {usersData.map((user: any) => (
                                  <SelectItem key={user.id} value={user.id.toString()}>
                                    {user.name} ({user.email})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="trainingType">Training Type</Label>
                            <Select value={trainingForm.trainingType} onValueChange={(v) => setTrainingForm({ ...trainingForm, trainingType: v })}>
                              <SelectTrigger className="bg-black/40 border-white/20">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="initial">Initial Training</SelectItem>
                                <SelectItem value="annual">Annual Recertification</SelectItem>
                                <SelectItem value="security_reminder">Security Reminder</SelectItem>
                                <SelectItem value="policy_update">Policy Update</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="trainingName">Training Name</Label>
                            <Input
                              id="trainingName"
                              value={trainingForm.trainingName}
                              onChange={(e) => setTrainingForm({ ...trainingForm, trainingName: e.target.value })}
                              className="bg-black/40 border-white/20"
                              placeholder="e.g., HIPAA Privacy & Security Fundamentals"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="completedAt">Completed Date</Label>
                              <Input
                                id="completedAt"
                                type="date"
                                value={trainingForm.completedAt}
                                onChange={(e) => setTrainingForm({ ...trainingForm, completedAt: e.target.value })}
                                className="bg-black/40 border-white/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="expiresAt">Expires At</Label>
                              <Input
                                id="expiresAt"
                                type="date"
                                value={trainingForm.expiresAt}
                                onChange={(e) => setTrainingForm({ ...trainingForm, expiresAt: e.target.value })}
                                className="bg-black/40 border-white/20"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="score">Score (%)</Label>
                              <Input
                                id="score"
                                type="number"
                                min="0"
                                max="100"
                                value={trainingForm.score}
                                onChange={(e) => setTrainingForm({ ...trainingForm, score: e.target.value })}
                                className="bg-black/40 border-white/20"
                              />
                            </div>
                            <div className="space-y-2 flex items-center gap-3 pt-8">
                              <Switch
                                checked={trainingForm.passed}
                                onCheckedChange={(v) => setTrainingForm({ ...trainingForm, passed: v })}
                              />
                              <Label>Passed</Label>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setTrainingDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            className="bg-[#FFB800] text-black hover:bg-[#FFB800]/90"
                            onClick={handleTrainingSubmit}
                            data-testid="submit-training-btn"
                          >
                            Add Training Record
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10">
                          <TableHead className="text-gray-400">User</TableHead>
                          <TableHead className="text-gray-400">Type</TableHead>
                          <TableHead className="text-gray-400">Training Name</TableHead>
                          <TableHead className="text-gray-400">Completed</TableHead>
                          <TableHead className="text-gray-400">Expires</TableHead>
                          <TableHead className="text-gray-400">Score</TableHead>
                          <TableHead className="text-gray-400">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trainingData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                              No training records found. Add your first training record above.
                            </TableCell>
                          </TableRow>
                        ) : (
                          trainingData.map((training: any) => {
                            const isExpired = training.expiresAt && new Date(training.expiresAt) < new Date();
                            const user = usersData.find((u: any) => u.id === training.userId);
                            return (
                              <TableRow
                                key={training.id}
                                className={`border-white/10 ${isExpired ? "bg-red-500/5" : ""}`}
                                data-testid={`training-row-${training.id}`}
                              >
                                <TableCell className="font-medium text-white">
                                  {user?.name || `User #${training.userId}`}
                                </TableCell>
                                <TableCell className="text-gray-300 capitalize">
                                  {training.trainingType?.replace("_", " ")}
                                </TableCell>
                                <TableCell className="text-gray-300">{training.trainingName}</TableCell>
                                <TableCell className="text-gray-300">
                                  {new Date(training.completedAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  {training.expiresAt ? new Date(training.expiresAt).toLocaleDateString() : "—"}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  {training.score ? `${training.score}%` : "—"}
                                </TableCell>
                                <TableCell>
                                  {isExpired ? (
                                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Expired</Badge>
                                  ) : training.passed ? (
                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Valid</Badge>
                                  ) : (
                                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Failed</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="mt-0">
              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-[#FFB800] flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    HIPAA Audit Logs
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    System-wide audit trail for PHI access and security events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-black/20 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Filter by user..."
                        value={auditFilters.user}
                        onChange={(e) => setAuditFilters({ ...auditFilters, user: e.target.value })}
                        className="w-48 bg-black/40 border-white/20"
                        data-testid="filter-user"
                      />
                    </div>
                    <Select
                      value={auditFilters.resourceType}
                      onValueChange={(v) => setAuditFilters({ ...auditFilters, resourceType: v === "all" ? "" : v })}
                    >
                      <SelectTrigger className="w-48 bg-black/40 border-white/20" data-testid="filter-resource-type">
                        <SelectValue placeholder="Resource type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Resource Types</SelectItem>
                        <SelectItem value="veteran_intake">Veteran Intake</SelectItem>
                        <SelectItem value="help_request">Help Request</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="session">Session</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={auditFilters.phiOnly}
                        onCheckedChange={(v) => setAuditFilters({ ...auditFilters, phiOnly: v })}
                        data-testid="filter-phi-only"
                      />
                      <Label className="text-sm text-gray-300">PHI Access Only</Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetchAuditLogs()}
                      className="ml-auto"
                      data-testid="refresh-logs-btn"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>

                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10">
                          <TableHead className="text-gray-400">Timestamp</TableHead>
                          <TableHead className="text-gray-400">User</TableHead>
                          <TableHead className="text-gray-400">Action</TableHead>
                          <TableHead className="text-gray-400">Resource</TableHead>
                          <TableHead className="text-gray-400">Resource ID</TableHead>
                          <TableHead className="text-gray-400">IP Address</TableHead>
                          <TableHead className="text-gray-400 text-center">PHI</TableHead>
                          <TableHead className="text-gray-400 text-center">Success</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAuditLogs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                              No audit logs found matching the current filters.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAuditLogs.map((log: any) => (
                            <TableRow
                              key={log.id}
                              className={`border-white/10 ${log.phiAccessed ? "bg-[#FFB800]/5" : ""}`}
                              data-testid={`audit-row-${log.id}`}
                            >
                              <TableCell className="text-gray-300 text-sm font-mono">
                                {new Date(log.timestamp).toLocaleString()}
                              </TableCell>
                              <TableCell className="text-white">
                                {log.userName || "System"}
                                {log.userRole && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {log.userRole}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    log.action === "CREATE"
                                      ? "bg-green-500/20 text-green-400"
                                      : log.action === "READ"
                                      ? "bg-blue-500/20 text-blue-400"
                                      : log.action === "UPDATE"
                                      ? "bg-amber-500/20 text-amber-400"
                                      : log.action === "DELETE"
                                      ? "bg-red-500/20 text-red-400"
                                      : "bg-gray-500/20 text-gray-400"
                                  }
                                >
                                  {log.action}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-300">{log.resourceType}</TableCell>
                              <TableCell className="text-gray-400 font-mono text-sm">
                                {log.resourceId || "—"}
                              </TableCell>
                              <TableCell className="text-gray-400 font-mono text-sm">
                                {log.ipAddress || "—"}
                              </TableCell>
                              <TableCell className="text-center">
                                {log.phiAccessed ? (
                                  <Eye className="w-4 h-4 text-[#FFB800] mx-auto" />
                                ) : (
                                  <span className="text-gray-600">—</span>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {log.success ? (
                                  <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                                ) : (
                                  <X className="w-4 h-4 text-red-400 mx-auto" />
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
