import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  Shield, Users, FileText, Briefcase, Target, Award, 
  ChevronRight, Lock, CheckCircle, AlertCircle, 
  Building2, DollarSign, Heart, Stethoscope, Truck,
  FileSignature, Send, Clock, TrendingUp, BarChart3,
  Anchor, Star, Zap, Globe, Eye, Activity, ShieldCheck,
  Key, Database, Server, FileWarning, AlertTriangle,
  Info, ExternalLink, ScrollText, UserCheck, Network,
  HardDrive, Mail, Bot, X
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const MotionCard = motion(Card);

interface PortalLink {
  name: string;
  route: string;
  icon: React.ReactNode;
  description: string;
  status: "operational" | "warning" | "critical";
  features: string[];
  category: "admin" | "affiliate" | "document" | "service";
}

const portalLinks: PortalLink[] = [
  {
    name: "Master Portal",
    route: "/master-portal",
    icon: <Shield className="w-8 h-8" />,
    description: "Central command for all operations, leads, and team management",
    status: "operational",
    features: ["Lead Management", "Team Oversight", "Sales Tracking", "Document Hub"],
    category: "admin"
  },
  {
    name: "Admin Dashboard",
    route: "/admin/dashboard",
    icon: <Lock className="w-8 h-8" />,
    description: "Full administrative control over applications and requests",
    status: "operational",
    features: ["Application Review", "Affiliate Management", "Request Processing", "System Config"],
    category: "admin"
  },
  {
    name: "Sub-Master Portal",
    route: "/submaster-portal",
    icon: <Users className="w-8 h-8" />,
    description: "Regional leadership portal for team coordination",
    status: "operational",
    features: ["Team Reports", "Regional Metrics", "Escalation Queue"],
    category: "admin"
  },
  {
    name: "Affiliate Dashboard",
    route: "/affiliate-dashboard",
    icon: <Briefcase className="w-8 h-8" />,
    description: "Your personal command center for leads and commissions",
    status: "operational",
    features: ["Lead Tracking", "Commission Calculator", "Security Center", "VSO Air Support"],
    category: "affiliate"
  },
  {
    name: "VLT Affiliate Portal",
    route: "/veteran-led-tax/affiliate",
    icon: <DollarSign className="w-8 h-8" />,
    description: "Tax services affiliate management and referrals",
    status: "operational",
    features: ["Client Referrals", "Tax Lead Tracking", "FinOps Integration"],
    category: "affiliate"
  },
  {
    name: "CSU Contract Platform",
    route: "/csu-portal",
    icon: <FileSignature className="w-8 h-8" />,
    description: "DocuSign-style contract management with AI analysis",
    status: "operational",
    features: ["AI Document Analysis", "Envelope System", "Batch Sending", "Audit Trail", "E-Signatures"],
    category: "document"
  },
  {
    name: "Payzium Portal",
    route: "/Payzium",
    icon: <Star className="w-8 h-8" />,
    description: "FICA tax credit contract signing and management",
    status: "operational",
    features: ["FICA Contracts", "Self-Sign Flow", "Template Management"],
    category: "document"
  },
  {
    name: "VLT Admin",
    route: "/veteran-led-tax/admin",
    icon: <Building2 className="w-8 h-8" />,
    description: "Veteran Led Tax administrative control center",
    status: "operational",
    features: ["Affiliate Oversight", "Intake Management", "Lead Distribution"],
    category: "admin"
  }
];

const serviceLinks = [
  { name: "Disability Benefits", route: "/disability-rating", icon: <Heart className="w-6 h-6" />, color: "from-red-500 to-red-700" },
  { name: "Healthcare", route: "/healthcare", icon: <Stethoscope className="w-6 h-6" />, color: "from-blue-500 to-blue-700" },
  { name: "Business Services", route: "/businesses", icon: <Briefcase className="w-6 h-6" />, color: "from-amber-500 to-amber-700" },
  { name: "Tax Services", route: "/veteran-led-tax", icon: <DollarSign className="w-6 h-6" />, color: "from-green-500 to-green-700" },
  { name: "Shipping & Logistics", route: "/shipping", icon: <Truck className="w-6 h-6" />, color: "from-purple-500 to-purple-700" },
  { name: "Insurance", route: "/insurance", icon: <Shield className="w-6 h-6" />, color: "from-cyan-500 to-cyan-700" },
];

const documentPlatformStats = {
  csu: { name: "CSU Platform", templates: 12, envelopes: 0, signed: 0 },
  payzium: { name: "Payzium", templates: 2, contracts: 0, signed: 0 },
  scheduleA: { name: "Schedule A", signatures: 0 },
  nda: { name: "Affiliate NDA", signed: 0 }
};

export default function NavigatorElite() {
  const [activeTab, setActiveTab] = useState("overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: envelopeData } = useQuery({
    queryKey: ["elite-envelopes"],
    queryFn: async () => {
      const res = await fetch("/api/csu/envelopes", { credentials: "include" });
      if (!res.ok) return { envelopes: [], totalSent: 0, totalCompleted: 0 };
      const data = await res.json();
      return {
        envelopes: data || [],
        totalSent: (data || []).filter((e: any) => e.status === "sent").length,
        totalCompleted: (data || []).filter((e: any) => e.status === "completed").length
      };
    },
    staleTime: 30000
  });

  const { data: templateData } = useQuery({
    queryKey: ["elite-templates"],
    queryFn: async () => {
      const res = await fetch("/api/csu/templates", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "warning": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "admin": return "from-amber-600/20 to-amber-900/40 border-amber-500/30";
      case "affiliate": return "from-blue-600/20 to-blue-900/40 border-blue-500/30";
      case "document": return "from-purple-600/20 to-purple-900/40 border-purple-500/30";
      case "service": return "from-green-600/20 to-green-900/40 border-green-500/30";
      default: return "from-gray-600/20 to-gray-900/40 border-gray-500/30";
    }
  };

  const [securitySheetOpen, setSecuritySheetOpen] = useState(false);

  const hipaaCompliance = {
    overallScore: 52,
    lastAssessment: "January 30, 2026",
    categories: [
      { name: "Technical Safeguards", score: 55, color: "from-blue-500 to-blue-700" },
      { name: "Administrative Safeguards", score: 35, color: "from-purple-500 to-purple-700" },
      { name: "Physical Safeguards", score: 70, color: "from-green-500 to-green-700" },
      { name: "Audit Controls", score: 50, color: "from-amber-500 to-amber-700" },
      { name: "Transmission Security", score: 65, color: "from-cyan-500 to-cyan-700" }
    ],
    controls: [
      { id: 1, name: "Password Hashing (bcrypt)", category: "Technical", status: "compliant", description: "All passwords encrypted with bcrypt algorithm - verified in codebase", regulation: "45 CFR §164.312(a)(1)" },
      { id: 2, name: "HTTPS/TLS Encryption", category: "Transmission", status: "partial", description: "Platform provides TLS but explicit enforcement not configured in code", regulation: "45 CFR §164.312(e)(1)" },
      { id: 3, name: "Role-Based Access Control", category: "Technical", status: "partial", description: "Basic role checks (admin/affiliate) exist but minimum-necessary access not enforced", regulation: "45 CFR §164.312(a)(1)" },
      { id: 4, name: "Input Validation (Zod)", category: "Technical", status: "compliant", description: "All API inputs validated with Zod schemas - verified in codebase", regulation: "45 CFR §164.312(c)(1)" },
      { id: 5, name: "Session Authentication", category: "Technical", status: "partial", description: "PostgreSQL session storage present, secure cookie flags need verification", regulation: "45 CFR §164.312(d)" },
      { id: 6, name: "CSU Audit Trail", category: "Audit", status: "partial", description: "Audit logging exists for CSU contracts only, not system-wide PHI access", regulation: "45 CFR §164.312(b)" },
      { id: 7, name: "Database Encryption (PostgreSQL)", category: "Technical", status: "partial", description: "Relies on Neon hosting provider - no explicit encryption config in code", regulation: "45 CFR §164.312(a)(2)(iv)" },
      { id: 8, name: "Unique User Identification", category: "Technical", status: "compliant", description: "Each user has unique database ID for activity tracking", regulation: "45 CFR §164.312(a)(2)(i)" },
      { id: 9, name: "Session Timeout", category: "Technical", status: "missing", description: "No auto-logoff configured for inactive sessions", regulation: "45 CFR §164.312(a)(2)(iii)" },
      { id: 10, name: "Multi-Factor Authentication", category: "Technical", status: "missing", description: "MFA not implemented - critical security gap", regulation: "45 CFR §164.312(d)" },
      { id: 11, name: "System-Wide Audit Logging", category: "Audit", status: "missing", description: "No comprehensive PHI access logging outside CSU workflows", regulation: "45 CFR §164.312(b)" },
      { id: 12, name: "HSTS Headers", category: "Transmission", status: "missing", description: "No HSTS headers configured in application code", regulation: "45 CFR §164.312(e)(2)" },
      { id: 13, name: "Privacy Policy Notice", category: "Administrative", status: "missing", description: "No public-facing privacy policy page implemented", regulation: "45 CFR §164.520" },
      { id: 14, name: "Breach Notification Procedures", category: "Administrative", status: "missing", description: "60-day breach notification process not documented", regulation: "45 CFR §164.404" },
      { id: 15, name: "Business Associate Agreements", category: "Administrative", status: "missing", description: "No BAAs executed with Resend, OpenAI, or hosting providers", regulation: "45 CFR §164.504(e)" },
      { id: 16, name: "Risk Assessment Documentation", category: "Administrative", status: "partial", description: "Initial self-assessment complete, formal annual review required", regulation: "45 CFR §164.308(a)(1)(ii)(A)" },
      { id: 17, name: "Workforce Training Records", category: "Administrative", status: "missing", description: "HIPAA training program not documented", regulation: "45 CFR §164.308(a)(5)" },
      { id: 18, name: "Emergency Access Procedures", category: "Technical", status: "partial", description: "Database backup access via hosting, formal procedures needed", regulation: "45 CFR §164.312(a)(2)(ii)" }
    ],
    vendors: [
      { id: "resend", name: "Resend (Email)", type: "Email Service", baaStatus: "not_executed", description: "Transactional email for contract signing links", action: "Request BAA from Resend - REQUIRED for PHI in emails" },
      { id: "openai", name: "OpenAI", type: "AI Integration", baaStatus: "not_executed", description: "Document analysis and AI features", action: "Contact OpenAI for HIPAA BAA - available for Enterprise tier" },
      { id: "neon", name: "Neon (PostgreSQL)", type: "Database", baaStatus: "not_executed", description: "Managed PostgreSQL database hosting", action: "Execute Neon BAA - available on Scale/Enterprise plans" },
      { id: "replit", name: "Replit", type: "Hosting Platform", baaStatus: "not_executed", description: "Application hosting and deployment", action: "Review Replit HIPAA-eligible options - contact sales" }
    ],
    recommendations: [
      { id: "rec-mfa", priority: "critical", title: "Implement Multi-Factor Authentication", description: "Add MFA for all admin and affiliate accounts using TOTP or SMS verification", timeline: "2-3 weeks" },
      { id: "rec-baa", priority: "critical", title: "Execute Vendor BAAs", description: "Obtain and sign Business Associate Agreements with Resend, OpenAI, Neon, and Replit", timeline: "1-2 weeks" },
      { id: "rec-privacy", priority: "high", title: "Create Privacy Policy Page", description: "Publish Notice of Privacy Practices on public-facing pages", timeline: "1 week" },
      { id: "rec-audit", priority: "high", title: "Expand Audit Logging", description: "Implement system-wide audit trail for all PHI access events with 6-year retention", timeline: "2-3 weeks" },
      { id: "rec-breach", priority: "medium", title: "Document Breach Procedures", description: "Create and document 60-day breach notification workflow", timeline: "1 week" },
      { id: "rec-session", priority: "medium", title: "Configure Session Auto-Logoff", description: "Enforce automatic logout after 15-30 minutes of inactivity", timeline: "3-5 days" },
      { id: "rec-training", priority: "low", title: "Staff Training Program", description: "Implement and document annual HIPAA awareness training", timeline: "Ongoing" }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant": return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "partial": return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "missing": return <X className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "partial": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "missing": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "medium": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getBaaStatusColor = (status: string) => {
    switch (status) {
      case "executed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "available": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "required": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "not_executed": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "not_available": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const compliantCount = hipaaCompliance.controls.filter(c => c.status === "compliant").length;
  const partialCount = hipaaCompliance.controls.filter(c => c.status === "partial").length;
  const missingCount = hipaaCompliance.controls.filter(c => c.status === "missing").length;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#1a365d] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        
        <div className="relative container mx-auto px-4 py-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/seal-trident.png" 
                alt="Navy SEAL Trident" 
                className="w-24 h-auto drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-pulse"
              />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
                NAVIGATOR USA
              </span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-display mt-2 text-white/90 tracking-widest">
              ELITE COMMAND CENTER
            </h2>
            <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
              "The Only Easy Day Was Yesterday" — Unified operations hub for the nation's premier veteran support network
            </p>
            
            <div className="flex items-center justify-center gap-8 mt-8" data-testid="elite-stats-row">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400" data-testid="stat-veteran-families">150,000+</div>
                <div className="text-sm text-gray-400">Veteran Families</div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-amber-500/50 to-transparent" />
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400" data-testid="stat-active-portals">{portalLinks.length}</div>
                <div className="text-sm text-gray-400">Active Portals</div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-amber-500/50 to-transparent" />
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400" data-testid="stat-contract-templates">{templateData?.length || 0}</div>
                <div className="text-sm text-gray-400">Contract Templates</div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-amber-500/50 to-transparent" />
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400" data-testid="stat-completed-signatures">{envelopeData?.totalCompleted || 0}</div>
                <div className="text-sm text-gray-400">Completed Signatures</div>
              </div>
            </div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 bg-black/40 border border-white/10 rounded-xl p-1 mb-8" data-testid="elite-tabs-list">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 rounded-lg font-display"
                data-testid="tab-overview"
              >
                <Target className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="portals"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 rounded-lg font-display"
                data-testid="tab-portals"
              >
                <Globe className="w-4 h-4 mr-2" />
                Portals
              </TabsTrigger>
              <TabsTrigger 
                value="documents"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 rounded-lg font-display"
                data-testid="tab-documents"
              >
                <FileSignature className="w-4 h-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 rounded-lg font-display"
                data-testid="tab-analytics"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="overview" className="mt-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
                >
                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Active Envelopes", value: envelopeData?.totalSent || 0, icon: <Send className="w-5 h-5" />, color: "from-blue-500 to-blue-700" },
                      { label: "Pending Signatures", value: envelopeData?.envelopes?.filter((e: any) => e.status === "sent").length || 0, icon: <Clock className="w-5 h-5" />, color: "from-amber-500 to-amber-700" },
                      { label: "Completed Today", value: 0, icon: <CheckCircle className="w-5 h-5" />, color: "from-green-500 to-green-700" },
                      { label: "System Health", value: "100%", icon: <Activity className="w-5 h-5" />, color: "from-purple-500 to-purple-700" }
                    ].map((stat, idx) => (
                      <Card key={idx} className={`bg-gradient-to-br ${stat.color} border-0 shadow-xl`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-white/70">{stat.label}</p>
                              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                            </div>
                            <div className="p-3 bg-white/10 rounded-xl">
                              {stat.icon}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <h3 className="text-xl font-display text-amber-400 mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Quick Access — Mission Critical
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {serviceLinks.map((service, idx) => (
                        <Link key={idx} href={service.route} data-testid={`link-service-${service.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-4 rounded-xl bg-gradient-to-br ${service.color} cursor-pointer shadow-lg hover:shadow-2xl transition-shadow`}
                          >
                            <div className="flex flex-col items-center text-center gap-2">
                              {service.icon}
                              <span className="text-sm font-medium text-white">{service.name}</span>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <h3 className="text-xl font-display text-amber-400 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Command Portals — Immediate Access
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {portalLinks.slice(0, 4).map((portal, idx) => (
                        <Link key={idx} href={portal.route} data-testid={`link-portal-${portal.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          <MotionCard
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            className={`bg-gradient-to-br ${getCategoryColor(portal.category)} border backdrop-blur-sm cursor-pointer h-full`}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <div className="p-2 bg-white/10 rounded-lg text-amber-400">
                                  {portal.icon}
                                </div>
                                <Badge className={`${getStatusColor(portal.status)} border text-xs`}>
                                  {portal.status}
                                </Badge>
                              </div>
                              <CardTitle className="text-lg text-white mt-2">{portal.name}</CardTitle>
                              <CardDescription className="text-gray-400 text-sm">
                                {portal.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex flex-wrap gap-1">
                                {portal.features.slice(0, 2).map((feature, fidx) => (
                                  <span key={fidx} className="text-xs px-2 py-1 bg-white/5 rounded-full text-gray-300">
                                    {feature}
                                  </span>
                                ))}
                                {portal.features.length > 2 && (
                                  <span className="text-xs px-2 py-1 text-amber-400">
                                    +{portal.features.length - 2} more
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </MotionCard>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </TabsContent>

              <TabsContent value="portals" className="mt-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <motion.div variants={itemVariants}>
                    <h3 className="text-xl font-display text-amber-400 mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Administrative Portals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {portalLinks.filter(p => p.category === "admin").map((portal, idx) => (
                        <Link key={idx} href={portal.route}>
                          <MotionCard
                            whileHover={{ scale: 1.02 }}
                            className={`bg-gradient-to-br ${getCategoryColor(portal.category)} border backdrop-blur-sm cursor-pointer`}
                          >
                            <CardHeader>
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
                                  {portal.icon}
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-white flex items-center gap-2">
                                    {portal.name}
                                    <ChevronRight className="w-4 h-4 text-amber-400" />
                                  </CardTitle>
                                  <CardDescription className="text-gray-400">
                                    {portal.description}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-2">
                                {portal.features.map((feature, fidx) => (
                                  <Badge key={fidx} variant="outline" className="bg-white/5 border-white/10 text-gray-300">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </MotionCard>
                        </Link>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <h3 className="text-xl font-display text-blue-400 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Affiliate Portals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {portalLinks.filter(p => p.category === "affiliate").map((portal, idx) => (
                        <Link key={idx} href={portal.route}>
                          <MotionCard
                            whileHover={{ scale: 1.02 }}
                            className={`bg-gradient-to-br ${getCategoryColor(portal.category)} border backdrop-blur-sm cursor-pointer`}
                          >
                            <CardHeader>
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                                  {portal.icon}
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-white flex items-center gap-2">
                                    {portal.name}
                                    <ChevronRight className="w-4 h-4 text-blue-400" />
                                  </CardTitle>
                                  <CardDescription className="text-gray-400">
                                    {portal.description}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-2">
                                {portal.features.map((feature, fidx) => (
                                  <Badge key={fidx} variant="outline" className="bg-white/5 border-white/10 text-gray-300">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </MotionCard>
                        </Link>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <h3 className="text-xl font-display text-purple-400 mb-4 flex items-center gap-2">
                      <FileSignature className="w-5 h-5" />
                      Document Signing Portals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {portalLinks.filter(p => p.category === "document").map((portal, idx) => (
                        <Link key={idx} href={portal.route}>
                          <MotionCard
                            whileHover={{ scale: 1.02 }}
                            className={`bg-gradient-to-br ${getCategoryColor(portal.category)} border backdrop-blur-sm cursor-pointer`}
                          >
                            <CardHeader>
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                                  {portal.icon}
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-white flex items-center gap-2">
                                    {portal.name}
                                    <Badge className={`${getStatusColor(portal.status)} border text-xs ml-2`}>
                                      {portal.status}
                                    </Badge>
                                  </CardTitle>
                                  <CardDescription className="text-gray-400">
                                    {portal.description}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-2">
                                {portal.features.map((feature, fidx) => (
                                  <Badge key={fidx} variant="outline" className="bg-white/5 border-white/10 text-gray-300">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </MotionCard>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </TabsContent>

              <TabsContent value="documents" className="mt-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <motion.div variants={itemVariants}>
                    <h3 className="text-xl font-display text-purple-400 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Unified Document Signing Platform
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="bg-gradient-to-br from-purple-900/40 to-purple-950/60 border-purple-500/30 lg:col-span-2">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <FileSignature className="w-5 h-5 text-purple-400" />
                            CSU Contract Platform
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            Enterprise-grade document signing with AI analysis, envelope system, and comprehensive audit trails
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 bg-white/5 rounded-lg text-center">
                              <div className="text-2xl font-bold text-purple-400">{templateData?.length || 0}</div>
                              <div className="text-xs text-gray-400">Templates</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg text-center">
                              <div className="text-2xl font-bold text-blue-400">{envelopeData?.envelopes?.length || 0}</div>
                              <div className="text-xs text-gray-400">Envelopes</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg text-center">
                              <div className="text-2xl font-bold text-amber-400">{envelopeData?.totalSent || 0}</div>
                              <div className="text-xs text-gray-400">Pending</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg text-center">
                              <div className="text-2xl font-bold text-green-400">{envelopeData?.totalCompleted || 0}</div>
                              <div className="text-xs text-gray-400">Completed</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                              { name: "AI Document Analysis", icon: <Zap className="w-4 h-4" />, status: "active" },
                              { name: "Multi-Recipient Envelopes", icon: <Users className="w-4 h-4" />, status: "active" },
                              { name: "Sequential/Parallel Signing", icon: <Activity className="w-4 h-4" />, status: "active" },
                              { name: "Certificate of Completion", icon: <Award className="w-4 h-4" />, status: "active" },
                              { name: "Automated Reminders", icon: <Clock className="w-4 h-4" />, status: "active" },
                              { name: "Full Audit Trail", icon: <Eye className="w-4 h-4" />, status: "active" }
                            ].map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                                <div className="text-purple-400">{feature.icon}</div>
                                <span className="text-sm text-gray-300">{feature.name}</span>
                                <CheckCircle className="w-3 h-3 text-green-400 ml-auto" />
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-6 flex gap-3">
                            <Link href="/csu-portal" data-testid="link-csu-portal">
                              <Button className="bg-purple-600 hover:bg-purple-700" data-testid="btn-open-csu-portal">
                                Open CSU Portal
                                <ChevronRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-4">
                        <Card className="bg-gradient-to-br from-amber-900/40 to-amber-950/60 border-amber-500/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                              <Star className="w-5 h-5 text-amber-400" />
                              Payzium Portal
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-400 mb-4">FICA tax credit contract signing for VIP partners</p>
                            <Link href="/Payzium" data-testid="link-payzium">
                              <Button variant="outline" className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/20" data-testid="btn-access-payzium">
                                Access Portal
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-900/40 to-blue-950/60 border-blue-500/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                              <FileText className="w-5 h-5 text-blue-400" />
                              Schedule A Signing
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-400 mb-4">Affiliate agreement schedule signing</p>
                            <Link href="/schedule-a" data-testid="link-schedule-a">
                              <Button variant="outline" className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/20" data-testid="btn-sign-schedule-a">
                                Sign Schedule A
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-900/40 to-green-950/60 border-green-500/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                              <Lock className="w-5 h-5 text-green-400" />
                              Affiliate NDA
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-400 mb-4">Non-disclosure agreement for affiliates</p>
                            <Link href="/affiliate-nda" data-testid="link-affiliate-nda">
                              <Button variant="outline" className="w-full border-green-500/50 text-green-400 hover:bg-green-500/20" data-testid="btn-view-nda">
                                View NDA
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <motion.div variants={itemVariants}>
                    <h3 className="text-xl font-display text-amber-400 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Platform Feature Matrix
                    </h3>
                    
                    <Card className="bg-black/40 border-white/10">
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-black/60">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Feature</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase">CSU Platform</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase">Payzium</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase">Schedule A</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase">Affiliate NDA</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {[
                                { feature: "E-Signature Capture", csu: true, payzium: true, scheduleA: true, nda: true },
                                { feature: "Multi-Recipient Support", csu: true, payzium: false, scheduleA: false, nda: false },
                                { feature: "Sequential Signing Order", csu: true, payzium: false, scheduleA: false, nda: false },
                                { feature: "AI Document Analysis", csu: true, payzium: false, scheduleA: false, nda: false },
                                { feature: "Envelope System", csu: true, payzium: false, scheduleA: false, nda: false },
                                { feature: "Automated Reminders", csu: true, payzium: false, scheduleA: false, nda: false },
                                { feature: "Full Audit Trail", csu: true, payzium: true, scheduleA: true, nda: true },
                                { feature: "PDF Generation", csu: true, payzium: true, scheduleA: true, nda: true },
                                { feature: "Email Notifications", csu: true, payzium: true, scheduleA: true, nda: true },
                                { feature: "Template Management", csu: true, payzium: true, scheduleA: false, nda: false },
                                { feature: "Self-Sign Flow", csu: true, payzium: true, scheduleA: true, nda: true },
                                { feature: "Token-Based Access", csu: true, payzium: true, scheduleA: false, nda: false }
                              ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-white/5">
                                  <td className="px-4 py-3 text-sm text-gray-300">{row.feature}</td>
                                  <td className="px-4 py-3 text-center">
                                    {row.csu ? <CheckCircle className="w-5 h-5 text-green-400 mx-auto" /> : <AlertCircle className="w-5 h-5 text-gray-600 mx-auto" />}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {row.payzium ? <CheckCircle className="w-5 h-5 text-green-400 mx-auto" /> : <AlertCircle className="w-5 h-5 text-gray-600 mx-auto" />}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {row.scheduleA ? <CheckCircle className="w-5 h-5 text-green-400 mx-auto" /> : <AlertCircle className="w-5 h-5 text-gray-600 mx-auto" />}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {row.nda ? <CheckCircle className="w-5 h-5 text-green-400 mx-auto" /> : <AlertCircle className="w-5 h-5 text-gray-600 mx-auto" />}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <h3 className="text-xl font-display text-green-400 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      System Health & Crash Point Analysis
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { name: "Zod Input Validation", status: "fixed", description: "Empty recipient arrays and invalid emails blocked", impact: "3-5% failure → 0%" },
                        { name: "State Machine Transitions", status: "fixed", description: "Invalid envelope status changes prevented", impact: "3% failure → 0%" },
                        { name: "Email Retry with Backoff", status: "fixed", description: "Exponential backoff (1s/2s/4s) for Resend failures", impact: "5% failure → <1%" },
                        { name: "PDF Generation Guards", status: "fixed", description: "Null checks for signatures and required fields", impact: "2% failure → 0%" },
                        { name: "Token Expiration Enforcement", status: "fixed", description: "7-day expiry strictly enforced", impact: "Security hardened" },
                        { name: "Video Montage Mobile", status: "fixed", description: "User interaction required before autoplay", impact: "Mobile playback fixed" }
                      ].map((item, idx) => (
                        <Card key={idx} className="bg-gradient-to-br from-green-900/20 to-green-950/40 border-green-500/20">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-medium text-white">{item.name}</span>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                {item.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                            <p className="text-xs text-green-400">{item.impact}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>

          <motion.div 
            className="mt-12 text-center text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Anchor className="w-4 h-4" />
              <span className="font-display tracking-wider">NAVIGATOR USA ELITE</span>
              <Anchor className="w-4 h-4" />
            </div>
            <p>"Ready to Lead, Ready to Follow, Never Quit"</p>
          </motion.div>
        </div>
      </div>

      <Sheet open={securitySheetOpen} onOpenChange={setSecuritySheetOpen}>
        <SheetTrigger asChild>
          <motion.button
            className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-2xl shadow-emerald-500/30 border border-emerald-400/30"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            data-testid="btn-security-hipaa-report"
          >
            <ShieldCheck className="w-6 h-6" />
            <div className="text-left">
              <div className="text-sm font-display tracking-wide">Security & HIPAA</div>
              <div className="text-xs opacity-80">Compliance Report</div>
            </div>
            <div className="ml-2 px-2 py-1 bg-white/20 rounded-lg text-sm font-bold">
              {hipaaCompliance.overallScore}%
            </div>
          </motion.button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-full sm:w-[600px] lg:w-[800px] bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#1a365d] border-r border-emerald-500/30 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <SheetHeader className="text-left">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <SheetTitle className="text-2xl font-display text-white tracking-wide">
                      Security & HIPAA Compliance Report
                    </SheetTitle>
                    <p className="text-sm text-gray-400">Last Assessment: {hipaaCompliance.lastAssessment}</p>
                  </div>
                </div>
              </SheetHeader>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" data-testid="compliance-score-dashboard">
                <Card className="lg:col-span-1 bg-gradient-to-br from-emerald-900/40 to-emerald-950/60 border-emerald-500/30">
                  <CardContent className="p-6 text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-700" />
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" 
                          className="text-emerald-500" 
                          strokeDasharray={`${hipaaCompliance.overallScore * 3.52} 352`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-4xl font-bold text-emerald-400">{hipaaCompliance.overallScore}%</span>
                    </div>
                    <p className="mt-4 text-lg font-display text-white">Overall Compliance</p>
                    <p className="text-sm text-gray-400">HIPAA Security Rule</p>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 bg-gradient-to-br from-slate-900/40 to-slate-950/60 border-slate-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-400" />
                      Safeguard Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {hipaaCompliance.categories.map((cat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">{cat.name}</span>
                          <span className="text-white font-bold">{cat.score}%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.score}%` }}
                            transition={{ delay: 0.3 + idx * 0.1, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-3 gap-4" data-testid="compliance-summary-stats">
                <Card className="bg-gradient-to-br from-green-900/40 to-green-950/60 border-green-500/30">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-400">{compliantCount}</div>
                    <div className="text-xs text-gray-400">Compliant</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-900/40 to-amber-950/60 border-amber-500/30">
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-amber-400">{partialCount}</div>
                    <div className="text-xs text-gray-400">Partial</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-900/40 to-red-950/60 border-red-500/30">
                  <CardContent className="p-4 text-center">
                    <X className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-400">{missingCount}</div>
                    <div className="text-xs text-gray-400">Missing</div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="bg-emerald-500/20" />

              <div data-testid="compliance-control-matrix">
                <h3 className="text-lg font-display text-emerald-400 mb-4 flex items-center gap-2">
                  <ScrollText className="w-5 h-5" />
                  Detailed Control Assessment ({hipaaCompliance.controls.length} Controls)
                </h3>
                <div className="space-y-2">
                  {hipaaCompliance.controls.map((control) => (
                    <Card key={control.id} className="bg-slate-900/40 border-slate-700/30 hover:border-emerald-500/30 transition-colors" data-testid={`card-control-${control.id}`}>
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getStatusIcon(control.status)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-white" data-testid={`text-control-name-${control.id}`}>{control.name}</span>
                              <Badge className={`${getStatusBadge(control.status)} text-xs`} data-testid={`badge-control-status-${control.id}`}>
                                {control.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                                {control.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{control.description}</p>
                            <p className="text-xs text-emerald-400/70 mt-1 font-mono">{control.regulation}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator className="bg-emerald-500/20" />

              <div data-testid="vendor-baa-section">
                <h3 className="text-lg font-display text-purple-400 mb-4 flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Vendor BAA Status (Business Associate Agreements)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hipaaCompliance.vendors.map((vendor) => (
                    <Card key={vendor.id} className="bg-slate-900/40 border-slate-700/30" data-testid={`card-vendor-${vendor.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {vendor.type === "Email Service" && <Mail className="w-5 h-5 text-blue-400" />}
                            {vendor.type === "AI Integration" && <Bot className="w-5 h-5 text-purple-400" />}
                            {vendor.type === "Database" && <Database className="w-5 h-5 text-green-400" />}
                            {vendor.type === "Hosting Platform" && <Server className="w-5 h-5 text-amber-400" />}
                            <span className="font-medium text-white">{vendor.name}</span>
                          </div>
                          <Badge className={`${getBaaStatusColor(vendor.baaStatus)} text-xs`}>
                            {vendor.baaStatus === "not_executed" ? "Not Executed" : vendor.baaStatus === "required" ? "BAA Required" : vendor.baaStatus === "available" ? "BAA Available" : vendor.baaStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{vendor.description}</p>
                        <div className="flex items-center gap-2 text-xs text-emerald-400">
                          <ExternalLink className="w-3 h-3" />
                          <span>{vendor.action}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator className="bg-emerald-500/20" />

              <div data-testid="recommendations-section">
                <h3 className="text-lg font-display text-amber-400 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Prioritized Recommendations
                </h3>
                <div className="space-y-3">
                  {hipaaCompliance.recommendations.map((rec) => (
                    <Card key={rec.id} className="bg-slate-900/40 border-slate-700/30" data-testid={`card-recommendation-${rec.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Badge className={`${getPriorityColor(rec.priority)} text-xs uppercase`}>
                            {rec.priority}
                          </Badge>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{rec.title}</h4>
                            <p className="text-sm text-gray-400 mt-1">{rec.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>Estimated: {rec.timeline}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator className="bg-emerald-500/20" />

              <Card className="bg-gradient-to-br from-slate-900/60 to-slate-950/80 border-amber-500/30" data-testid="compliance-disclaimer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display text-amber-400 mb-2">Important Disclaimer</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        This Security & HIPAA Compliance Report is a <strong className="text-white">self-assessment tool</strong> and does not constitute a certified HIPAA audit or official compliance certification. 
                        Full HIPAA compliance requires organizational policies, workforce training, physical safeguards, and Business Associate Agreements that extend beyond the technical controls assessed here.
                      </p>
                      <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                        Organizations handling Protected Health Information (PHI) should engage qualified HIPAA compliance professionals and conduct formal risk assessments per 45 CFR §164.308(a)(1)(ii)(A).
                      </p>
                      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                        <span>Report Version: 1.0</span>
                        <span>•</span>
                        <span>Generated: {new Date().toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Navigator USA Elite</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="pb-6" />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </Layout>
  );
}
