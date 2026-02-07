import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAutoLogout } from "@/hooks/use-auto-logout";
import { 
  Shield, Users, FileText, FolderOpen, Eye, EyeOff, Download, ChevronRight, Camera, IdCard, 
  FileSignature, ClipboardCheck, Receipt, Link2, Store, CreditCard, Gift, LogIn,
  LayoutDashboard, ClipboardList, HelpCircle, DollarSign, Stethoscope, Globe, 
  Mail, Briefcase, TrendingUp, Building, Target, Heart, Truck, UserCheck, AlertCircle,
  Clock, CheckCircle, XCircle, Sofa, RefreshCw, FileDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DataTable = ({ title, icon, data, columns, hideHeader }: { title: string; icon: React.ReactNode; data: any[]; columns: string[]; hideHeader?: boolean }) => (
  <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden" data-testid={`datatable-${title.toLowerCase().replace(/\s+/g, '-') || 'table'}`}>
    {!hideHeader && (
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-bold text-white flex items-center gap-2" data-testid={`datatable-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {icon}
          {title}
        </h2>
      </div>
    )}
    {data.length === 0 ? (
      <div className="p-8 text-center text-gray-400" data-testid="datatable-empty">No records found.</div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full" data-testid="datatable-content">
          <thead className="bg-black/30">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider" data-testid={`header-${col}`}>
                  {col.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10" data-testid="datatable-body">
            {data.slice(0, 50).map((item: any, idx: number) => (
              <tr key={item.id || idx} className="hover:bg-white/5" data-testid={`row-${item.id || idx}`}>
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3 text-sm text-gray-300" data-testid={`cell-${col}-${item.id || idx}`}>
                    {col === 'status' ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item[col] === 'pending' || item[col] === 'new' ? 'bg-yellow-500/20 text-yellow-400' :
                        item[col] === 'approved' || item[col] === 'completed' || item[col] === 'converted' ? 'bg-green-500/20 text-green-400' :
                        item[col] === 'rejected' || item[col] === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`} data-testid={`status-badge-${item.id || idx}`}>
                        {item[col] || 'pending'}
                      </span>
                    ) : col === 'createdAt' ? (
                      new Date(item[col]).toLocaleDateString()
                    ) : col === 'amount' ? (
                      `$${(item[col] || 0).toLocaleString()}`
                    ) : (
                      item[col] || '-'
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 50 && (
          <div className="p-3 text-center text-sm text-gray-400 border-t border-white/10" data-testid="datatable-pagination">
            Showing 50 of {data.length} records
          </div>
        )}
      </div>
    )}
  </div>
);

interface AffiliateFile {
  id: number;
  name: string;
  email: string;
  nda?: {
    id: number;
    fullName: string;
    address: string;
    facePhoto?: string;
    idPhoto?: string;
    signatureData?: string;
    signedAt: string;
  };
  contracts?: Array<{
    id: number;
    contractName: string;
    signedAt: string;
    signatureData?: string;
  }>;
  w9?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    taxClassification: string;
    certificationDate: string;
  };
}

export default function MasterPortal() {
  const [, setLocation] = useLocation();
  useAutoLogout("/master-portal");
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateFile | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [loginEmail, setLoginEmail] = useState(() => localStorage.getItem("master_remembered_email") || "");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem("master_remembered_email"));
  const [pdfSecurityKey, setPdfSecurityKey] = useState("");
  const [pdfDownloadError, setPdfDownloadError] = useState("");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const queryClient = useQueryClient();

  const downloadNdaPdf = async (ndaId: number, affiliateName: string) => {
    if (!pdfSecurityKey) {
      setPdfDownloadError("Please enter the security key");
      return;
    }
    
    setIsDownloadingPdf(true);
    setPdfDownloadError("");
    
    try {
      const res = await fetch(`/api/master/affiliate-nda-pdf/${ndaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ securityKey: pdfSecurityKey })
      });
      
      if (!res.ok) {
        const data = await res.json();
        setPdfDownloadError(data.message || "Failed to download PDF");
        return;
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `NDA-${affiliateName.replace(/[^a-zA-Z0-9]/g, '_')}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setPdfDownloadError("Network error - please try again");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Check if user is master admin - with retry logic for session timing
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    retry: 6,
    retryDelay: 1000,
    staleTime: 60_000,
  });

  // Fetch all affiliates with their files
  const { data: affiliateFiles = [], isLoading: filesLoading, error: filesError } = useQuery<AffiliateFile[]>({
    queryKey: ["master-affiliate-files"],
    queryFn: async () => {
      const res = await fetch("/api/master/affiliate-files", { credentials: "include" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `HTTP ${res.status}`);
      }
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch finops referrals
  const { data: finopsReferrals = [], isLoading: referralsLoading } = useQuery<any[]>({
    queryKey: ["finops-referrals"],
    queryFn: async () => {
      const res = await fetch("/api/admin/finops-referrals", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch disability referrals
  const { data: disabilityReferrals = [], isLoading: disabilityLoading } = useQuery<any[]>({
    queryKey: ["disability-referrals"],
    queryFn: async () => {
      const res = await fetch("/api/admin/disability-referrals", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch vet professional intakes
  const { data: vetProfessionalIntakes = [], isLoading: vetProfessionalsLoading } = useQuery<any[]>({
    queryKey: ["vet-professional-intakes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/vet-professional-intakes", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch healthcare intakes
  const { data: healthcareIntakes = [], isLoading: healthcareLoading } = useQuery<any[]>({
    queryKey: ["healthcare-intakes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/healthcare-intakes", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch Schedule A signatures
  const { data: scheduleASignatures = [], isLoading: scheduleALoading } = useQuery<any[]>({
    queryKey: ["schedule-a-signatures"],
    queryFn: async () => {
      const res = await fetch("/api/admin/schedule-a-signatures", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch CSU signed agreements (individual contracts)
  const { data: csuSignedAgreements = [], isLoading: csuSignedLoading } = useQuery<any[]>({
    queryKey: ["csu-signed-agreements"],
    queryFn: async () => {
      const res = await fetch("/api/csu/signed-agreements", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch affiliate applications
  const { data: affiliateApplications = [] } = useQuery<any[]>({
    queryKey: ["affiliate-applications"],
    queryFn: async () => {
      const res = await fetch("/api/admin/affiliate-applications", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch help requests
  const { data: helpRequests = [] } = useQuery<any[]>({
    queryKey: ["help-requests"],
    queryFn: async () => {
      const res = await fetch("/api/admin/help-requests", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch startup grants
  const { data: startupGrants = [] } = useQuery<any[]>({
    queryKey: ["startup-grants"],
    queryFn: async () => {
      const res = await fetch("/api/admin/startup-grants", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch furniture assistance
  const { data: furnitureAssistance = [] } = useQuery<any[]>({
    queryKey: ["furniture-assistance"],
    queryFn: async () => {
      const res = await fetch("/api/admin/furniture-assistance", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch private doctor requests
  const { data: privateDoctorRequests = [] } = useQuery<any[]>({
    queryKey: ["private-doctor-requests"],
    queryFn: async () => {
      const res = await fetch("/api/admin/private-doctor-requests", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch website applications
  const { data: websiteApplications = [] } = useQuery<any[]>({
    queryKey: ["website-applications"],
    queryFn: async () => {
      const res = await fetch("/api/admin/website-applications", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch general contact
  const { data: generalContact = [] } = useQuery<any[]>({
    queryKey: ["general-contact"],
    queryFn: async () => {
      const res = await fetch("/api/admin/general-contact", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch veteran intakes
  const { data: veteranIntakes = [] } = useQuery<any[]>({
    queryKey: ["veteran-intakes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/veteran-intakes", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch business intakes
  const { data: businessIntakes = [] } = useQuery<any[]>({
    queryKey: ["business-intakes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/business-intakes", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch insurance intakes
  const { data: insuranceIntakes = [] } = useQuery<any[]>({
    queryKey: ["insurance-intakes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/insurance-intakes", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch medical sales intakes
  const { data: medicalSalesIntakes = [] } = useQuery<any[]>({
    queryKey: ["medical-sales-intakes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/medical-sales-intakes", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch business dev intakes
  const { data: businessDevIntakes = [] } = useQuery<any[]>({
    queryKey: ["business-dev-intakes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/business-dev-intakes", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch business leads
  const { data: businessLeads = [] } = useQuery<any[]>({
    queryKey: ["business-leads"],
    queryFn: async () => {
      const res = await fetch("/api/admin/business-leads", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch sales data
  const { data: salesData = [] } = useQuery<any[]>({
    queryKey: ["sales-data"],
    queryFn: async () => {
      const res = await fetch("/api/master/sales", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
    staleTime: 5 * 60 * 1000,
  });

  // Safety: normalize arrays to prevent "Cannot read properties of undefined" errors
  const affiliateFilesSafe: AffiliateFile[] = Array.isArray(affiliateFiles) ? affiliateFiles : [];
  const scheduleASignaturesSafe = Array.isArray(scheduleASignatures) ? scheduleASignatures : [];
  const ndaFiles = affiliateFilesSafe.filter((af) => Boolean(af.nda));

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setLoginError(data.message || "Login failed");
        setIsLoggingIn(false);
        return;
      }
      
      if (data.user.role !== "admin" && data.user.role !== "master") {
        setLoginError("Access denied. Admin credentials required.");
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        setIsLoggingIn(false);
        return;
      }
      
      // Save or clear remembered email
      if (rememberMe) {
        localStorage.setItem("master_remembered_email", loginEmail);
      } else {
        localStorage.removeItem("master_remembered_email");
      }
      
      await queryClient.refetchQueries({ queryKey: ["/api/auth/me"] });
    } catch {
      setLoginError("Connection error. Please try again.");
      setIsLoggingIn(false);
    }
  };

  // Access denied for non-admin/master users
  const isAuthorized = authData?.user?.role === "admin" || authData?.user?.role === "master";
  if (!authData || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center gap-4 text-center mb-8">
            <div className="w-20 h-20 bg-brand-red rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="text-2xl text-white font-bold">MASTER PORTAL</div>
            <div className="text-gray-300">
              Enter your credentials to access the administration panel.
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@navigatorusa.org"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-400"
                required
                data-testid="input-login-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-400 pr-10"
                  required
                  data-testid="input-login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-white/50 data-[state=checked]:bg-brand-red"
                data-testid="checkbox-remember"
              />
              <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer text-white/80">
                Remember my email
              </Label>
            </div>
            
            {loginError && (
              <div className="text-red-400 text-sm text-center bg-red-500/20 p-2 rounded">
                {loginError}
              </div>
            )}
            
            <Button 
              type="submit"
              className="w-full bg-brand-red hover:bg-brand-red/90"
              disabled={isLoggingIn}
              data-testid="button-login-submit"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login to Master Portal
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const viewAffiliateFolder = (affiliate: AffiliateFile) => {
    setSelectedAffiliate(affiliate);
    setShowDocumentViewer(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800">
      {/* Header */}
      <div className="bg-black/30 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-brand-red" />
            <div>
              <h1 className="text-xl font-bold text-white">Master Portal</h1>
              <p className="text-sm text-gray-400">NavigatorUSA Administration</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Logged in as: {authData.user.email}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                fetch("/api/auth/logout", { method: "POST", credentials: "include" })
                  .then(() => window.location.href = "/master-portal");
              }}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="bg-black/30 border border-white/10 inline-flex min-w-max">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-brand-red data-[state=active]:text-white text-gray-400">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="applications" className="data-[state=active]:bg-brand-red data-[state=active]:text-white text-gray-400">
                <ClipboardList className="w-4 h-4 mr-2" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="intakes" className="data-[state=active]:bg-brand-red data-[state=active]:text-white text-gray-400">
                <UserCheck className="w-4 h-4 mr-2" />
                Intakes
              </TabsTrigger>
              <TabsTrigger value="leads" className="data-[state=active]:bg-brand-red data-[state=active]:text-white text-gray-400">
                <HelpCircle className="w-4 h-4 mr-2" />
                Leads & Requests
              </TabsTrigger>
              <TabsTrigger value="sales" className="data-[state=active]:bg-brand-red data-[state=active]:text-white text-gray-400">
                <TrendingUp className="w-4 h-4 mr-2" />
                Sales & Referrals
              </TabsTrigger>
              <TabsTrigger value="commission" className="data-[state=active]:bg-brand-red data-[state=active]:text-white text-gray-400">
                <DollarSign className="w-4 h-4 mr-2" />
                Commission Breakdown
              </TabsTrigger>
              <TabsTrigger value="ranger" className="data-[state=active]:bg-brand-red data-[state=active]:text-white text-gray-400">
                <FileSignature className="w-4 h-4 mr-2" />
                RANGER E-Sign
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-brand-red data-[state=active]:text-white text-gray-400">
                <FolderOpen className="w-4 h-4 mr-2" />
                Documents
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6">
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="bg-brand-red/20 border border-brand-red/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardList className="w-5 h-5 text-brand-red" />
                    <span className="text-xs text-gray-400">Applications</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{affiliateApplications.length}</div>
                  <div className="text-xs text-gray-400">{affiliateApplications.filter((a: any) => a.status === 'pending').length} pending</div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-xs text-gray-400">Help Requests</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{helpRequests.length}</div>
                  <div className="text-xs text-gray-400">{helpRequests.filter((h: any) => h.status === 'pending').length} pending</div>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-xs text-gray-400">Startup Grants</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{startupGrants.length}</div>
                  <div className="text-xs text-gray-400">{startupGrants.filter((s: any) => s.status === 'pending').length} pending</div>
                </div>
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="w-5 h-5 text-purple-400" />
                    <span className="text-xs text-gray-400">Veteran Intakes</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{veteranIntakes.length}</div>
                  <div className="text-xs text-gray-400">{veteranIntakes.filter((v: any) => v.status === 'pending').length} pending</div>
                </div>
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-yellow-400" />
                    <span className="text-xs text-gray-400">Business Leads</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{businessLeads.length}</div>
                  <div className="text-xs text-gray-400">{businessLeads.filter((b: any) => b.status === 'new').length} new</div>
                </div>
                <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs text-gray-400">Total Sales</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{salesData.length}</div>
                  <div className="text-xs text-gray-400">${salesData.reduce((sum: number, s: any) => sum + (s.amount || 0), 0).toLocaleString()}</div>
                </div>
              </div>

              {/* Alerts Section */}
              <div className="bg-black/20 rounded-lg border border-white/10 p-4">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Pending Actions
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {affiliateApplications.filter((a: any) => a.status === 'pending').length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <div>
                        <div className="text-white font-medium">{affiliateApplications.filter((a: any) => a.status === 'pending').length} Affiliate Apps</div>
                        <div className="text-xs text-gray-400">Awaiting review</div>
                      </div>
                    </div>
                  )}
                  {helpRequests.filter((h: any) => h.status === 'pending').length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <div>
                        <div className="text-white font-medium">{helpRequests.filter((h: any) => h.status === 'pending').length} Help Requests</div>
                        <div className="text-xs text-gray-400">Need attention</div>
                      </div>
                    </div>
                  )}
                  {privateDoctorRequests.filter((p: any) => p.status === 'pending').length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-3">
                      <Stethoscope className="w-5 h-5 text-red-400" />
                      <div>
                        <div className="text-white font-medium">{privateDoctorRequests.filter((p: any) => p.status === 'pending').length} Doctor Requests</div>
                        <div className="text-xs text-gray-400">Urgent - medical</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-black/20 rounded-lg border border-white/10 p-4">
                  <h4 className="text-sm font-bold text-gray-400 mb-3">APPLICATIONS</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-300">Affiliate Apps</span><span className="text-white font-bold">{affiliateApplications.length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-300">Startup Grants</span><span className="text-white font-bold">{startupGrants.length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-300">Website Grants</span><span className="text-white font-bold">{websiteApplications.length}</span></div>
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg border border-white/10 p-4">
                  <h4 className="text-sm font-bold text-gray-400 mb-3">INTAKES</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-300">Veteran</span><span className="text-white font-bold">{veteranIntakes.length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-300">Business</span><span className="text-white font-bold">{businessIntakes.length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-300">Insurance</span><span className="text-white font-bold">{insuranceIntakes.length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-300">Medical Sales</span><span className="text-white font-bold">{medicalSalesIntakes.length}</span></div>
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg border border-white/10 p-4">
                  <h4 className="text-sm font-bold text-gray-400 mb-3">LEADS & REQUESTS</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-300">Help Requests</span><span className="text-white font-bold">{helpRequests.length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-300">Private Doctor</span><span className="text-white font-bold">{privateDoctorRequests.length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-300">Furniture</span><span className="text-white font-bold">{furnitureAssistance.length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-300">General Contact</span><span className="text-white font-bold">{generalContact.length}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="mt-6">
            <Tabs defaultValue="affiliate-apps" className="w-full">
              <TabsList className="bg-black/20 border border-white/10 mb-4">
                <TabsTrigger value="affiliate-apps" className="data-[state=active]:bg-brand-navy text-gray-400">Affiliate Apps ({affiliateApplications.length})</TabsTrigger>
                <TabsTrigger value="startup-grants" className="data-[state=active]:bg-brand-navy text-gray-400">Startup Grants ({startupGrants.length})</TabsTrigger>
                <TabsTrigger value="website-apps" className="data-[state=active]:bg-brand-navy text-gray-400">Website Grants ({websiteApplications.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="affiliate-apps">
                <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden" data-testid="datatable-affiliate-applications">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-brand-red" />
                      Affiliate Applications
                    </h2>
                    <div className="flex items-center gap-2">
                      <Input
                        type="password"
                        placeholder="Security key for PDFs"
                        value={pdfSecurityKey}
                        onChange={(e) => setPdfSecurityKey(e.target.value)}
                        className="w-48 bg-black/30 border-white/20 text-white text-sm"
                        data-testid="input-apps-pdf-security-key"
                      />
                    </div>
                  </div>
                  {affiliateApplications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No affiliate applications found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-black/30">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">NDA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {affiliateApplications.slice(0, 50).map((app: any) => {
                            const matchingNda = affiliateFiles.find((af: AffiliateFile) => af.email?.toLowerCase() === app.email?.toLowerCase());
                            return (
                              <tr key={app.id} className="hover:bg-white/5">
                                <td className="px-4 py-3 text-sm text-gray-300">{app.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-300">{app.email}</td>
                                <td className="px-4 py-3 text-sm text-gray-300">{app.phone || '-'}</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    app.status === 'pending' || app.status === 'new' ? 'bg-yellow-500/20 text-yellow-400' :
                                    app.status === 'approved' || app.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                    app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                    'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    {app.status || 'new'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-300">{new Date(app.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-sm">
                                  {matchingNda?.nda ? (
                                    <Button
                                      size="sm"
                                      onClick={() => downloadNdaPdf(matchingNda.nda!.id, matchingNda.nda!.fullName)}
                                      disabled={isDownloadingPdf || !pdfSecurityKey}
                                      className="bg-brand-red hover:bg-red-700 text-white text-xs px-2 py-1 h-7"
                                      data-testid={`btn-download-nda-${app.id}`}
                                    >
                                      <FileDown className="w-3 h-3 mr-1" />
                                      PDF
                                    </Button>
                                  ) : (
                                    <span className="text-gray-500 text-xs">No NDA</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {affiliateApplications.length > 50 && (
                        <div className="p-3 text-center text-sm text-gray-400 border-t border-white/10">
                          Showing 50 of {affiliateApplications.length} records
                        </div>
                      )}
                    </div>
                  )}
                  {pdfDownloadError && (
                    <div className="p-3 text-center text-red-400 text-sm border-t border-white/10">{pdfDownloadError}</div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="startup-grants">
                <DataTable title="Startup Grant Applications" icon={<DollarSign className="w-5 h-5 text-green-400" />} data={startupGrants} columns={["businessName", "firstName", "lastName", "email", "status", "createdAt"]} />
              </TabsContent>
              <TabsContent value="website-apps">
                <DataTable title="Website Grant Applications" icon={<Globe className="w-5 h-5 text-blue-400" />} data={websiteApplications} columns={["businessName", "firstName", "lastName", "email", "status", "createdAt"]} />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Intakes Tab */}
          <TabsContent value="intakes" className="mt-6">
            <Tabs defaultValue="veteran" className="w-full">
              <TabsList className="bg-black/20 border border-white/10 mb-4 flex-wrap">
                <TabsTrigger value="veteran" className="data-[state=active]:bg-brand-navy text-gray-400">Veteran ({veteranIntakes.length})</TabsTrigger>
                <TabsTrigger value="business" className="data-[state=active]:bg-brand-navy text-gray-400">Business ({businessIntakes.length})</TabsTrigger>
                <TabsTrigger value="insurance" className="data-[state=active]:bg-brand-navy text-gray-400">Insurance ({insuranceIntakes.length})</TabsTrigger>
                <TabsTrigger value="medical-sales" className="data-[state=active]:bg-brand-navy text-gray-400">Medical Sales ({medicalSalesIntakes.length})</TabsTrigger>
                <TabsTrigger value="business-dev" className="data-[state=active]:bg-brand-navy text-gray-400">Business Dev ({businessDevIntakes.length})</TabsTrigger>
                <TabsTrigger value="healthcare-tab" className="data-[state=active]:bg-brand-navy text-gray-400">Healthcare ({healthcareIntakes.length})</TabsTrigger>
                <TabsTrigger value="vet-prof" className="data-[state=active]:bg-brand-navy text-gray-400">Vet Professionals ({vetProfessionalIntakes.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="veteran">
                <DataTable title="Veteran Intakes" icon={<Shield className="w-5 h-5 text-brand-red" />} data={veteranIntakes} columns={["firstName", "lastName", "email", "phone", "intakeType", "status", "createdAt"]} />
              </TabsContent>
              <TabsContent value="business">
                <DataTable title="Business Intakes" icon={<Briefcase className="w-5 h-5 text-yellow-400" />} data={businessIntakes} columns={["businessName", "contactName", "email", "phone", "serviceType", "status", "createdAt"]} />
              </TabsContent>
              <TabsContent value="insurance">
                <DataTable title="Insurance Intakes" icon={<Shield className="w-5 h-5 text-blue-400" />} data={insuranceIntakes} columns={["businessName", "contactName", "email", "phone", "status", "createdAt"]} />
              </TabsContent>
              <TabsContent value="medical-sales">
                <DataTable title="Medical Sales Intakes" icon={<Stethoscope className="w-5 h-5 text-green-400" />} data={medicalSalesIntakes} columns={["firstName", "lastName", "email", "phone", "role", "status", "createdAt"]} />
              </TabsContent>
              <TabsContent value="business-dev">
                <DataTable title="Business Development Intakes" icon={<Target className="w-5 h-5 text-purple-400" />} data={businessDevIntakes} columns={["businessName", "contactName", "email", "phone", "serviceType", "status", "createdAt"]} />
              </TabsContent>
              <TabsContent value="healthcare-tab">
                <DataTable title="Healthcare Intakes" icon={<Heart className="w-5 h-5 text-red-400" />} data={healthcareIntakes} columns={["firstName", "lastName", "email", "phone", "treatmentType", "status", "createdAt"]} />
              </TabsContent>
              <TabsContent value="vet-prof">
                <DataTable title="Vet Professional Intakes" icon={<UserCheck className="w-5 h-5 text-cyan-400" />} data={vetProfessionalIntakes} columns={["firstName", "lastName", "email", "phone", "profession", "status", "createdAt"]} />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Leads & Requests Tab */}
          <TabsContent value="leads" className="mt-6">
            <Tabs defaultValue="help-requests" className="w-full">
              <TabsList className="bg-black/20 border border-white/10 mb-4 flex-wrap">
                <TabsTrigger value="help-requests" className="data-[state=active]:bg-brand-navy text-gray-400">Help Requests ({helpRequests.length})</TabsTrigger>
                <TabsTrigger value="private-doctor" className="data-[state=active]:bg-brand-navy text-gray-400">Private Doctor ({privateDoctorRequests.length})</TabsTrigger>
                <TabsTrigger value="furniture" className="data-[state=active]:bg-brand-navy text-gray-400">Furniture ({furnitureAssistance.length})</TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-brand-navy text-gray-400">General Contact ({generalContact.length})</TabsTrigger>
                <TabsTrigger value="business-leads-tab" className="data-[state=active]:bg-brand-navy text-gray-400">Business Leads ({businessLeads.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="help-requests">
                <DataTable title="VA Help Requests" icon={<HelpCircle className="w-5 h-5 text-blue-400" />} data={helpRequests} columns={["name", "email", "phone", "helpType", "otherHelpType", "description", "referralCode", "status", "createdAt"]} />
              </TabsContent>
              <TabsContent value="private-doctor">
                <DataTable title="Private Doctor Requests" icon={<Stethoscope className="w-5 h-5 text-red-400" />} data={privateDoctorRequests} columns={["firstName", "lastName", "email", "phone", "zip", "branch", "careType", "situation", "status", "createdAt"]} />
              </TabsContent>
              <TabsContent value="furniture">
                <DataTable title="Furniture Assistance" icon={<Sofa className="w-5 h-5 text-yellow-400" />} data={furnitureAssistance} columns={["firstName", "lastName", "email", "phone", "branch", "serviceStatus", "homeStatus", "expectedCloseDate", "homeLocation", "additionalInfo", "status", "createdAt"]} />
              </TabsContent>
              <TabsContent value="contact">
                <DataTable title="General Contact" icon={<Mail className="w-5 h-5 text-gray-400" />} data={generalContact} columns={["name", "email", "phone", "subject", "message", "status", "createdAt"]} />
              </TabsContent>
              <TabsContent value="business-leads-tab">
                <DataTable title="Business Leads" icon={<Building className="w-5 h-5 text-green-400" />} data={businessLeads} columns={["businessName", "contactName", "position", "email", "phone", "leadType", "comment", "referralCode", "status", "createdAt"]} />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Sales & Referrals Tab */}
          <TabsContent value="sales" className="mt-6">
            <Tabs defaultValue="partner-refs" className="w-full">
              <TabsList className="bg-black/20 border border-white/10 mb-4">
                <TabsTrigger value="partner-refs" className="data-[state=active]:bg-brand-navy text-gray-400">Partner Referrals ({finopsReferrals.length})</TabsTrigger>
                <TabsTrigger value="disability-refs" className="data-[state=active]:bg-brand-navy text-gray-400">Disability Referrals ({disabilityReferrals.length})</TabsTrigger>
                <TabsTrigger value="sales-data" className="data-[state=active]:bg-brand-navy text-gray-400">Sales ({salesData.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="partner-refs">
                <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Link2 className="w-5 h-5 text-brand-red" />
                      Partner Referral Tracking
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b border-white/10">
                    <div className="bg-brand-gold/20 rounded-lg p-4 text-center">
                      <Store className="w-6 h-6 text-brand-gold mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{finopsReferrals.filter((r: any) => r.partnerType === 'my_locker').length}</div>
                      <div className="text-xs text-gray-400">MY LOCKER</div>
                    </div>
                    <div className="bg-brand-red/20 rounded-lg p-4 text-center">
                      <CreditCard className="w-6 h-6 text-brand-red mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{finopsReferrals.filter((r: any) => r.partnerType === 'merchant_services').length}</div>
                      <div className="text-xs text-gray-400">Merchant</div>
                    </div>
                    <div className="bg-brand-blue/20 rounded-lg p-4 text-center">
                      <Gift className="w-6 h-6 text-brand-blue mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{finopsReferrals.filter((r: any) => r.partnerType === 'vgift_cards').length}</div>
                      <div className="text-xs text-gray-400">vGift Cards</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <Link2 className="w-6 h-6 text-white mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{finopsReferrals.length}</div>
                      <div className="text-xs text-gray-400">Total</div>
                    </div>
                  </div>
                  <DataTable title="" icon={null} data={finopsReferrals} columns={["referralCode", "partnerType", "status", "createdAt"]} hideHeader />
                </div>
              </TabsContent>
              <TabsContent value="disability-refs">
                <DataTable title="Disability Referrals" icon={<Shield className="w-5 h-5 text-brand-red" />} data={disabilityReferrals} columns={["firstName", "lastName", "email", "phone", "ratingType", "status", "createdAt"]} />
              </TabsContent>
              <TabsContent value="sales-data">
                <DataTable title="Sales Transactions" icon={<TrendingUp className="w-5 h-5 text-green-400" />} data={salesData} columns={["affiliateId", "opportunityId", "amount", "status", "createdAt"]} />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Commission Breakdown Tab */}
          <TabsContent value="commission" className="mt-6">
            <div className="space-y-6">
              <div className="bg-black/20 rounded-lg border border-white/10 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                  <DollarSign className="w-6 h-6 text-amber-400" />
                  Commission Structure Breakdown
                </h2>
                <p className="text-gray-400 mb-6">
                  All percentages are of <strong className="text-amber-400">GROSS COMMISSION</strong> (not gross revenue). 
                  Commission rates vary by product/service type.
                </p>
                
                <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-amber-400 mb-2">Fixed Allocations</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">House (Navigator USA)</span>
                      <span className="font-bold text-white">22.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Recruiter Bounty</span>
                      <span className="font-bold text-white">2.5%</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-brand-navy/50">
                      <tr className="border-b border-white/20">
                        <th className="py-3 px-4 text-left text-white font-bold">Position</th>
                        <th className="py-3 px-4 text-center text-white font-bold">Uplines</th>
                        <th className="py-3 px-4 text-center text-white font-bold">Producer Gets</th>
                        <th className="py-3 px-4 text-center text-white font-bold">Uplines Get (1% each)</th>
                        <th className="py-3 px-4 text-center text-white font-bold">Recruiter</th>
                        <th className="py-3 px-4 text-center text-white font-bold">House</th>
                        <th className="py-3 px-4 text-center text-white font-bold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { uplines: 0, rank: "E7 - SFC", desc: "Solo (no uplines)" },
                        { uplines: 1, rank: "E6 - SSG", desc: "1 upline above" },
                        { uplines: 2, rank: "E5 - SGT", desc: "2 uplines above" },
                        { uplines: 3, rank: "E4 - SPC", desc: "3 uplines above" },
                        { uplines: 4, rank: "E3 - PFC", desc: "4 uplines above" },
                        { uplines: 5, rank: "E2 - PV2", desc: "5 uplines above" },
                        { uplines: 6, rank: "E1 - PVT", desc: "6 uplines above" },
                      ].map(({ uplines, rank, desc }) => {
                        const producerPct = 69 + (6 - uplines);
                        const uplinePct = uplines * 1;
                        return (
                          <tr key={uplines} className="border-b border-white/10 hover:bg-white/5">
                            <td className="py-3 px-4">
                              <span className="text-white font-medium">{rank}</span>
                              <span className="text-gray-400 text-xs block">{desc}</span>
                            </td>
                            <td className="py-3 px-4 text-center text-gray-300">{uplines}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-green-400 font-bold">{producerPct}%</span>
                              {uplines < 6 && <span className="text-gray-500 text-xs block">(69% + {6-uplines}% compression)</span>}
                            </td>
                            <td className="py-3 px-4 text-center text-blue-400">{uplinePct}%</td>
                            <td className="py-3 px-4 text-center text-amber-400">2.5%</td>
                            <td className="py-3 px-4 text-center text-gray-300">22.5%</td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-white font-bold">{producerPct + uplinePct + 2.5 + 22.5}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 bg-brand-navy/30 rounded-lg p-4">
                  <h3 className="font-bold text-white mb-2">Key Points</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• <strong className="text-amber-400">Compression:</strong> Empty upline slots go to the Producer (not House)</li>
                    <li>• <strong className="text-amber-400">69% Base:</strong> Every producer starts with 69% minimum</li>
                    <li>• <strong className="text-amber-400">+1% per empty slot:</strong> Solo producers get 75% (69% + 6%)</li>
                    <li>• <strong className="text-amber-400">House fixed:</strong> 22.5% always goes to Navigator USA</li>
                    <li>• <strong className="text-amber-400">Recruiter:</strong> 2.5% to whoever brought in the rep</li>
                  </ul>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/admin/send-commission-spreadsheet", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify({ email: "bradweitma@gmail.com" })
                        });
                        if (res.ok) {
                          alert("Commission spreadsheet sent to bradweitma@gmail.com");
                        } else {
                          alert("Failed to send email");
                        }
                      } catch (e) {
                        alert("Failed to send email");
                      }
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                    data-testid="button-send-commission-email"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Spreadsheet to Brad
                  </Button>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <h3 className="font-bold text-white mb-3">Example Calculation</h3>
                  <div className="bg-black/30 rounded-lg p-4 text-sm">
                    <p className="text-gray-300 mb-2">
                      <strong>Scenario:</strong> $100,000 logistics deal × 18% commission rate = <span className="text-amber-400">$18,000 commission pool</span>
                    </p>
                    <p className="text-gray-300 mb-2">Producer has 3 uplines above them:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                        <div className="text-green-400 font-bold">$12,960</div>
                        <div className="text-xs text-gray-400">Producer (72%)</div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                        <div className="text-blue-400 font-bold">$540</div>
                        <div className="text-xs text-gray-400">Uplines (3 × 1%)</div>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2">
                        <div className="text-amber-400 font-bold">$450</div>
                        <div className="text-xs text-gray-400">Recruiter (2.5%)</div>
                      </div>
                      <div className="bg-gray-500/10 border border-gray-500/30 rounded p-2">
                        <div className="text-gray-300 font-bold">$4,050</div>
                        <div className="text-xs text-gray-400">House (22.5%)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    All Products/Services - Commission Breakdown ($100,000 Deal)
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Shows total commission pool and payout distribution for each product/service based on a $100,000 deal with 3 uplines
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-brand-navy/50">
                        <tr className="border-b border-white/20">
                          <th className="py-3 px-3 text-left text-white font-bold">Product/Service</th>
                          <th className="py-3 px-3 text-center text-white font-bold">Gross Rate</th>
                          <th className="py-3 px-3 text-center text-white font-bold">Commission Pool</th>
                          <th className="py-3 px-3 text-center text-green-400 font-bold">Producer (72%)</th>
                          <th className="py-3 px-3 text-center text-blue-400 font-bold">Uplines (3%)</th>
                          <th className="py-3 px-3 text-center text-amber-400 font-bold">Recruiter (2.5%)</th>
                          <th className="py-3 px-3 text-center text-gray-400 font-bold">House (22.5%)</th>
                          <th className="py-3 px-3 text-center text-white font-bold">Total to Reps</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Private Reinsurance eR3", rate: 70 },
                          { name: "Private Reinsurance eR2", rate: 70 },
                          { name: "FICA Tips Tax Credit", rate: 70 },
                          { name: "Tax Recovery", rate: 70 },
                          { name: "Tax Resolution Services", rate: 55 },
                          { name: "ICC Logistics", rate: 18 },
                        ].map((product) => {
                          const dealAmount = 100000;
                          const pool = dealAmount * (product.rate / 100);
                          const producerPay = pool * 0.72;
                          const uplinesPay = pool * 0.03;
                          const recruiterPay = pool * 0.025;
                          const housePay = pool * 0.225;
                          const totalToReps = producerPay + uplinesPay + recruiterPay;
                          return (
                            <tr key={product.name} className="border-b border-white/10 hover:bg-white/5">
                              <td className="py-3 px-3 text-white font-medium">{product.name}</td>
                              <td className="py-3 px-3 text-center text-amber-400 font-bold">{product.rate}%</td>
                              <td className="py-3 px-3 text-center text-white font-bold">${pool.toLocaleString()}</td>
                              <td className="py-3 px-3 text-center text-green-400">${producerPay.toLocaleString()}</td>
                              <td className="py-3 px-3 text-center text-blue-400">${uplinesPay.toLocaleString()}</td>
                              <td className="py-3 px-3 text-center text-amber-400">${recruiterPay.toLocaleString()}</td>
                              <td className="py-3 px-3 text-center text-gray-400">${housePay.toLocaleString()}</td>
                              <td className="py-3 px-3 text-center">
                                <span className="text-green-400 font-bold">${totalToReps.toLocaleString()}</span>
                                <span className="text-gray-500 text-xs block">({((totalToReps / pool) * 100).toFixed(1)}% of pool)</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-black/30">
                        <tr className="border-t-2 border-white/20">
                          <td colSpan={7} className="py-3 px-3 text-right text-gray-300 font-medium">
                            Total to Sales Reps (Producer + Uplines + Recruiter):
                          </td>
                          <td className="py-3 px-3 text-center text-green-400 font-bold text-lg">
                            77.5%
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={7} className="py-2 px-3 text-right text-gray-400">
                            House Retention:
                          </td>
                          <td className="py-2 px-3 text-center text-gray-400 font-bold">
                            22.5%
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="text-green-400 font-bold text-2xl">77.5%</div>
                      <div className="text-sm text-gray-400">Goes to Sales Reps</div>
                      <div className="text-xs text-gray-500 mt-1">Producer + Uplines + Recruiter</div>
                    </div>
                    <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4">
                      <div className="text-gray-300 font-bold text-2xl">22.5%</div>
                      <div className="text-sm text-gray-400">Goes to House</div>
                      <div className="text-xs text-gray-500 mt-1">Navigator USA Operations</div>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                      <div className="text-amber-400 font-bold text-2xl">100%</div>
                      <div className="text-sm text-gray-400">Total Allocation</div>
                      <div className="text-xs text-gray-500 mt-1">Every dollar accounted for</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* RANGER E-Sign Tab */}
          <TabsContent value="ranger" className="mt-6">
            <div className="space-y-6">
              <div className="bg-black/20 rounded-lg border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <FileSignature className="w-6 h-6 text-cyan-400" />
                      RANGER E-Signature Platform
                    </h2>
                    <p className="text-gray-400 mt-1">
                      Military-grade document security • HIPAA Compliant • 256-bit Encryption
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Secure Connection
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <a href="/document-signature" className="block">
                    <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30 rounded-lg p-4 hover:border-blue-400/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <FileSignature className="w-5 h-5 text-blue-400" />
                        <span className="font-bold text-blue-300">Send Contracts</span>
                      </div>
                      <p className="text-sm text-blue-200/70">
                        Create and send contracts for electronic signature with tokenized secure links.
                      </p>
                      <Button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Open RANGER Dashboard
                      </Button>
                    </div>
                  </a>

                  <a href="/document-signature" className="block">
                    <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-lg p-4 hover:border-green-400/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-bold text-green-300">Track Status</span>
                      </div>
                      <p className="text-sm text-green-200/70">
                        Monitor pending contracts and view signed agreements with full audit trails.
                      </p>
                      <Button variant="outline" className="mt-3 w-full border-green-500/50 text-green-400 hover:bg-green-900/30">
                        View All Contracts
                      </Button>
                    </div>
                  </a>

                  <a href="/document-signature" className="block">
                    <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 border border-amber-500/30 rounded-lg p-4 hover:border-amber-400/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <FileDown className="w-5 h-5 text-amber-400" />
                        <span className="font-bold text-amber-300">Download PDFs</span>
                      </div>
                      <p className="text-sm text-amber-200/70">
                        Generate and download signed agreements as secure PDF documents.
                      </p>
                      <Button variant="outline" className="mt-3 w-full border-amber-500/50 text-amber-400 hover:bg-amber-900/30">
                        Manage Documents
                      </Button>
                    </div>
                  </a>
                </div>

                <div className="bg-brand-navy/30 border border-white/10 rounded-lg p-4">
                  <h3 className="font-bold text-white mb-3">RANGER Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        AI Contract Analysis
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        HIPAA Compliant Storage
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Email Notifications
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Tokenized Sign Links
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Signature Canvas
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        PDF Generation
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gradient-to-r from-brand-red/20 to-transparent border border-brand-red/30 rounded-lg">
                  <p className="text-sm text-gray-300">
                    <strong className="text-brand-red">FREE for Veterans:</strong> RANGER e-signature platform is provided at no cost for veteran families as part of the NavigatorUSA mission.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="files" className="mt-6">
            <Tabs defaultValue="signed-ndas" className="w-full">
              <TabsList className="bg-black/20 border border-white/10 mb-4">
                <TabsTrigger value="signed-ndas" className="data-[state=active]:bg-brand-navy text-gray-400">Signed NDAs ({ndaFiles.length})</TabsTrigger>
                <TabsTrigger value="schedule-a-sub" className="data-[state=active]:bg-brand-navy text-gray-400">Schedule A ({scheduleASignaturesSafe.length})</TabsTrigger>
                <TabsTrigger value="csu-contracts" className="data-[state=active]:bg-brand-navy text-gray-400" data-testid="tab-csu-contracts">Contracts ({csuSignedAgreements.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="signed-ndas">
                <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10 bg-black/20 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileSignature className="w-5 h-5 text-brand-red" />
                        Signed NDAs
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        All affiliate NDA agreements with PDF download
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input
                        type="password"
                        placeholder="Security key for PDFs"
                        value={pdfSecurityKey}
                        onChange={(e) => setPdfSecurityKey(e.target.value)}
                        className="w-48 bg-black/30 border-white/20 text-white text-sm"
                        data-testid="input-nda-security-key"
                      />
                      <Button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["master-affiliate-files"] })}
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                        data-testid="button-refresh-ndas"
                      >
                        <RefreshCw className={`w-4 h-4 ${filesLoading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  {pdfDownloadError && (
                    <div className="p-3 bg-red-500/20 border-b border-red-500/30 text-red-400 text-sm text-center">
                      {pdfDownloadError}
                    </div>
                  )}

                  {filesLoading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-gray-400 mt-4">Loading signed NDAs...</p>
                    </div>
                  ) : filesError ? (
                    <div className="p-8 text-center text-red-400">
                      <p className="font-bold">Error loading signed NDAs</p>
                      <p className="text-sm mt-2">{(filesError as Error).message}</p>
                    </div>
                  ) : ndaFiles.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      No signed NDAs found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-black/30">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Address</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Signed</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Download</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {ndaFiles.map((affiliate: AffiliateFile) => (
                            <tr key={affiliate.id} className="hover:bg-white/5">
                              <td className="px-4 py-3 text-sm text-white font-medium">{affiliate.nda?.fullName || affiliate.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-300">{affiliate.email}</td>
                              <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">{affiliate.nda?.address || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-400">
                                {affiliate.nda?.signedAt ? new Date(affiliate.nda.signedAt).toLocaleDateString() : '-'}
                              </td>
                              <td className="px-4 py-3">
                                <Button
                                  size="sm"
                                  onClick={() => downloadNdaPdf(affiliate.nda!.id, affiliate.nda!.fullName)}
                                  disabled={isDownloadingPdf || !pdfSecurityKey}
                                  className="bg-brand-red hover:bg-red-700 text-white"
                                  data-testid={`btn-download-nda-${affiliate.id}`}
                                >
                                  <FileDown className="w-4 h-4 mr-1" />
                                  PDF
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="schedule-a-sub">
                <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10 bg-black/20">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-brand-red" />
                      Schedule A Signatures
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Track affiliate acknowledgments of the commission structure
                    </p>
                  </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b border-white/10" data-testid="schedule-a-stats">
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-400" data-testid="stat-schedule-a-total">{scheduleASignaturesSafe.length}</div>
                  <div className="text-sm text-gray-400">Total Signatures</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-400" data-testid="stat-schedule-a-30days">
                    {scheduleASignaturesSafe.filter((s: any) => {
                      const signedDate = new Date(s.signedAt);
                      const thirtyDaysAgo = new Date();
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                      return signedDate >= thirtyDaysAgo;
                    }).length}
                  </div>
                  <div className="text-sm text-gray-400">Last 30 Days</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-400" data-testid="stat-schedule-a-7days">
                    {scheduleASignaturesSafe.filter((s: any) => {
                      const signedDate = new Date(s.signedAt);
                      const sevenDaysAgo = new Date();
                      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                      return signedDate >= sevenDaysAgo;
                    }).length}
                  </div>
                  <div className="text-sm text-gray-400">Last 7 Days</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400" data-testid="stat-schedule-a-version">1.0</div>
                  <div className="text-sm text-gray-400">Current Version</div>
                </div>
              </div>

              {scheduleALoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading signatures...</p>
                </div>
              ) : scheduleASignaturesSafe.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  No Schedule A signatures yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-black/30 text-gray-400">
                      <tr>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Signed At</th>
                        <th className="text-left p-3">IP Address</th>
                        <th className="text-left p-3">Version</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10" data-testid="schedule-a-table-body">
                      {scheduleASignaturesSafe.map((sig: any) => (
                        <tr key={sig.id} className="hover:bg-white/5" data-testid={`row-schedule-a-${sig.id}`}>
                          <td className="p-3 text-white font-medium" data-testid={`text-schedule-a-name-${sig.id}`}>{sig.affiliateName}</td>
                          <td className="p-3 text-gray-400" data-testid={`text-schedule-a-email-${sig.id}`}>{sig.affiliateEmail}</td>
                          <td className="p-3 text-gray-400">
                            {new Date(sig.signedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="p-3 text-gray-500 font-mono text-xs">{sig.ipAddress || 'N/A'}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                              v{sig.version}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
                </div>
              </TabsContent>

              {/* CSU Contracts Tab */}
              <TabsContent value="csu-contracts">
                <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10 bg-black/20">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-400" />
                      Signed Contracts
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      All individually signed CSU/RANGER contracts
                    </p>
                  </div>

                  {csuSignedLoading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-gray-400 mt-4">Loading contracts...</p>
                    </div>
                  ) : csuSignedAgreements.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      No signed contracts found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full" data-testid="csu-contracts-table">
                        <thead className="bg-black/30">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Contract</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Signer Name</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Signed At</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10" data-testid="csu-contracts-table-body">
                          {csuSignedAgreements.map((agreement: any) => (
                            <tr key={agreement.id} className="hover:bg-white/5" data-testid={`row-csu-contract-${agreement.id}`}>
                              <td className="px-4 py-3 text-sm text-white font-medium">{agreement.templateName || `Contract #${agreement.templateId}`}</td>
                              <td className="px-4 py-3 text-sm text-white">{agreement.signerName}</td>
                              <td className="px-4 py-3 text-sm text-gray-400">{agreement.signerEmail}</td>
                              <td className="px-4 py-3 text-sm text-gray-400">
                                {new Date(agreement.signedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="px-4 py-3">
                                <Button
                                  size="sm"
                                  onClick={() => window.open(`/api/csu/signed-agreements/${agreement.id}/pdf`, '_blank')}
                                  className="bg-purple-600 hover:bg-purple-700 text-white"
                                  data-testid={`btn-download-contract-${agreement.id}`}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  PDF
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Document Viewer Dialog */}
      <Dialog open={showDocumentViewer} onOpenChange={setShowDocumentViewer}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FolderOpen className="w-6 h-6 text-brand-red" />
              {selectedAffiliate?.name}'s Document Folder
            </DialogTitle>
          </DialogHeader>

          {selectedAffiliate && (
            <div className="space-y-6 mt-4">
              {/* Face Photo Section */}
              {selectedAffiliate.nda?.facePhoto && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                    <Camera className="w-5 h-5 text-brand-red" />
                    Face Photo
                  </h3>
                  <img 
                    src={selectedAffiliate.nda.facePhoto} 
                    alt="Face Photo" 
                    className="max-w-xs rounded-lg border border-white/20"
                    data-testid="img-face-photo"
                  />
                </div>
              )}

              {/* ID Photo Section */}
              {selectedAffiliate.nda?.idPhoto && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                    <IdCard className="w-5 h-5 text-brand-red" />
                    Government ID
                  </h3>
                  <img 
                    src={selectedAffiliate.nda.idPhoto} 
                    alt="ID Photo" 
                    className="max-w-md rounded-lg border border-white/20"
                    data-testid="img-id-photo"
                  />
                </div>
              )}

              {/* NDA Section */}
              {selectedAffiliate.nda && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                    <FileSignature className="w-5 h-5 text-brand-red" />
                    NDA / Confidentiality Agreement
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Full Name:</span>
                      <p className="text-white">{selectedAffiliate.nda.fullName}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Address:</span>
                      <p className="text-white">{selectedAffiliate.nda.address}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Signed On:</span>
                      <p className="text-white">{new Date(selectedAffiliate.nda.signedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedAffiliate.nda.signatureData && (
                    <div className="mt-4">
                      <span className="text-gray-400 text-sm">Signature:</span>
                      <img 
                        src={selectedAffiliate.nda.signatureData} 
                        alt="NDA Signature" 
                        className="bg-white rounded mt-2 max-w-xs"
                      />
                    </div>
                  )}
                  
                  {/* PDF Download Section */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <Input
                        type="password"
                        placeholder="Enter security key"
                        value={pdfSecurityKey}
                        onChange={(e) => setPdfSecurityKey(e.target.value)}
                        className="flex-1 max-w-xs bg-black/30 border-white/20 text-white"
                        data-testid="input-pdf-security-key"
                      />
                      <Button
                        onClick={() => downloadNdaPdf(selectedAffiliate.nda!.id, selectedAffiliate.nda!.fullName)}
                        disabled={isDownloadingPdf || !pdfSecurityKey}
                        className="bg-brand-gold hover:bg-brand-gold/90 text-black"
                        data-testid="button-download-nda-pdf"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isDownloadingPdf ? "Generating..." : "Download PDF"}
                      </Button>
                    </div>
                    {pdfDownloadError && (
                      <p className="text-red-400 text-sm mt-2" data-testid="text-pdf-error">{pdfDownloadError}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Contracts Section */}
              {selectedAffiliate.contracts && selectedAffiliate.contracts.length > 0 && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                    <ClipboardCheck className="w-5 h-5 text-brand-red" />
                    Signed Contracts ({selectedAffiliate.contracts.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedAffiliate.contracts.map((contract) => (
                      <div key={contract.id} className="bg-black/20 rounded p-3 border border-white/5">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white">{contract.contractName}</span>
                          <span className="text-sm text-gray-400">
                            Signed: {new Date(contract.signedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* W9 Section */}
              {selectedAffiliate.w9 && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                    <Receipt className="w-5 h-5 text-brand-red" />
                    W-9 Tax Form
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Name:</span>
                      <p className="text-white">{selectedAffiliate.w9.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Tax Classification:</span>
                      <p className="text-white capitalize">{selectedAffiliate.w9.taxClassification.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400">Address:</span>
                      <p className="text-white">
                        {selectedAffiliate.w9.address}, {selectedAffiliate.w9.city}, {selectedAffiliate.w9.state} {selectedAffiliate.w9.zip}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Certified On:</span>
                      <p className="text-white">{new Date(selectedAffiliate.w9.certificationDate).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* No documents message */}
              {!selectedAffiliate.nda && (!selectedAffiliate.contracts || selectedAffiliate.contracts.length === 0) && !selectedAffiliate.w9 && (
                <div className="text-center text-gray-400 py-8">
                  No documents found for this affiliate.
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
