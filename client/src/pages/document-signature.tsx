import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { useVeteranVerification } from "@/components/veteran-verification-popup";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  FileText,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Eye,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Users,
  Mail,
  Phone,
  Calendar,
  Activity,
  BarChart3,
  TrendingUp,
  FileSignature,
  Inbox,
  Settings,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  Copy,
  Trash2,
  Edit,
  Upload,
  PenTool,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  User,
  Building,
  Globe,
} from "lucide-react";

interface ContractTemplate {
  id: number;
  name: string;
  description: string | null;
  content: string;
  isActive: boolean;
}

interface ContractSend {
  id: number;
  templateId: number;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string | null;
  signToken: string;
  tokenExpiresAt: string;
  status: string;
  sentAt: string;
}

interface SignedAgreement {
  id: number;
  contractSendId: number;
  templateId: number;
  signerName: string;
  signerEmail: string;
  signerPhone: string | null;
  address: string | null;
  signedAt: string;
}

export default function DocumentSignature() {
  const { showPopup, isVerified, checkVerification, VeteranPopup } = useVeteranVerification();
  
  useEffect(() => {
    checkVerification();
  }, []);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [sendStep, setSendStep] = useState(1);
  
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<ContractTemplate | null>(null);
  const [showBatchSendDialog, setShowBatchSendDialog] = useState(false);
  const [batchRecipients, setBatchRecipients] = useState<Array<{name: string; email: string; phone: string}>>([]);
  const [batchCsvInput, setBatchCsvInput] = useState("");
  const [autofillText, setAutofillText] = useState("");

  const { data: templates = [], isLoading: templatesLoading } = useQuery<ContractTemplate[]>({
    queryKey: ["/api/csu/templates"],
    queryFn: async () => {
      const res = await fetch("/api/csu/templates");
      if (!res.ok) throw new Error("Failed to fetch templates");
      return res.json();
    },
  });

  const { data: pendingContracts = [], isLoading: pendingLoading } = useQuery<ContractSend[]>({
    queryKey: ["/api/csu/pending"],
    queryFn: async () => {
      const res = await fetch("/api/csu/pending");
      if (!res.ok) throw new Error("Failed to fetch pending");
      return res.json();
    },
  });

  const { data: signedContracts = [], isLoading: signedLoading } = useQuery<SignedAgreement[]>({
    queryKey: ["/api/csu/signed"],
    queryFn: async () => {
      const res = await fetch("/api/csu/signed");
      if (!res.ok) throw new Error("Failed to fetch signed");
      return res.json();
    },
  });

  const sendContractMutation = useMutation({
    mutationFn: async (data: { templateId: number; recipientName: string; recipientEmail: string; recipientPhone: string }) => {
      const res = await apiRequest("POST", "/api/csu/send", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/csu/pending"] });
      toast({ title: "Contract Sent", description: "The document has been sent for signature." });
      setShowSendDialog(false);
      resetSendForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send contract.", variant: "destructive" });
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; content: string }) => {
      const res = await apiRequest("POST", "/api/csu/templates", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/csu/templates"] });
      toast({ title: "Template Created", description: "New document template has been created." });
      setShowTemplateDialog(false);
      resetTemplateForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create template.", variant: "destructive" });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async (data: { id: number; name: string; description: string; content: string; isActive?: boolean }) => {
      const res = await apiRequest("PUT", `/api/csu/templates/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/csu/templates"] });
      toast({ title: "Template Updated", description: "Template has been saved." });
      setShowTemplateDialog(false);
      setEditingTemplate(null);
      resetTemplateForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update template.", variant: "destructive" });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/csu/templates/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/csu/templates"] });
      toast({ title: "Template Deleted", description: "Template has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete template.", variant: "destructive" });
    },
  });

  const fixTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/csu/fix-template/${id}`, {});
      return res.json();
    },
    onSuccess: (data) => {
      if (data.fixedContent) {
        setTemplateContent(data.fixedContent);
        toast({ title: "AI Template Fixer", description: "Template has been improved! Review the changes below." });
      }
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to fix template with AI.", variant: "destructive" });
    },
  });

  const batchSendMutation = useMutation({
    mutationFn: async (data: { templateId: number; recipients: Array<{name: string; email: string; phone?: string}> }) => {
      const res = await apiRequest("POST", "/api/csu/send-contract-batch", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/csu/pending"] });
      toast({ 
        title: "Batch Send Complete", 
        description: `Successfully sent to ${data.successCount || 0} recipient(s).` 
      });
      setShowBatchSendDialog(false);
      setBatchRecipients([]);
      setBatchCsvInput("");
      setSelectedTemplate(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send batch.", variant: "destructive" });
    },
  });

  const autofillMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await apiRequest("POST", "/api/csu/ai-autofill", { text });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.name) setRecipientName(data.name);
      if (data.email) setRecipientEmail(data.email);
      if (data.phone) setRecipientPhone(data.phone);
      setAutofillText("");
      toast({ 
        title: "Contact Extracted!", 
        description: `Found: ${data.name || "No name"} - ${data.email || "No email"}` 
      });
    },
    onError: () => {
      toast({ title: "Extraction Failed", description: "Could not extract contact info. Try adding more details.", variant: "destructive" });
    },
  });

  const resetSendForm = () => {
    setRecipientName("");
    setRecipientEmail("");
    setRecipientPhone("");
    setSelectedTemplate(null);
    setSendStep(1);
  };

  const resetTemplateForm = () => {
    setTemplateName("");
    setTemplateDescription("");
    setTemplateContent("");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "signed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "pending": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "expired": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "sent": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "signed": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "expired": return <XCircle className="w-4 h-4" />;
      case "sent": return <Send className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredPending = pendingContracts.filter(contract => {
    const matchesSearch = contract.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || contract.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: pendingContracts.length + signedContracts.length,
    pending: pendingContracts.filter(c => c.status === "pending").length,
    signed: signedContracts.length,
    expired: pendingContracts.filter(c => c.status === "expired").length,
    signRate: signedContracts.length > 0 ? Math.round((signedContracts.length / (pendingContracts.length + signedContracts.length)) * 100) : 0,
  };

  return (
    <Layout>
      <VeteranPopup />
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            <div className="lg:w-64 shrink-0">
              <div className="sticky top-24">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <FileSignature className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">RANGER: Document Signature</h1>
                      <p className="text-xs text-gray-400">Enterprise Signatures</p>
                    </div>
                  </div>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
                    { id: "ai-studio", icon: Sparkles, label: "AI Studio", isAI: true },
                    { id: "envelopes", icon: Inbox, label: "Envelopes" },
                    { id: "templates", icon: FileText, label: "Templates" },
                    { id: "analytics", icon: TrendingUp, label: "Analytics" },
                    { id: "activity", icon: Activity, label: "Activity" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === item.id
                          ? (item as any).isAI 
                            ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white border border-purple-500/50 shadow-lg shadow-purple-500/20"
                            : "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border border-blue-500/30"
                          : (item as any).isAI
                            ? "text-purple-300 hover:text-white hover:bg-purple-500/10 border border-purple-500/20"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                      data-testid={`nav-${item.id}`}
                    >
                      <item.icon className={`w-5 h-5 ${(item as any).isAI ? "text-purple-400" : ""}`} />
                      <span className="font-medium">{item.label}</span>
                      {(item as any).isAI && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 font-semibold">NEW</span>
                      )}
                    </button>
                  ))}
                </nav>

                <Separator className="my-6 bg-gray-800" />

                <div className="space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25"
                    onClick={() => setShowSendDialog(true)}
                    data-testid="button-new-envelope"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Envelope
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => setShowBatchSendDialog(true)}
                    data-testid="button-batch-send"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Batch Send
                  </Button>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-medium text-gray-300">Security Status</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>All Systems Secure</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                      <p className="text-gray-400">Overview of your document signing activity</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm overflow-hidden" data-testid="stat-total-envelopes">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Total Envelopes</p>
                            <p className="text-3xl font-bold text-white mt-1" data-testid="text-total-count">{stats.total}</p>
                            <p className="text-xs mt-2 text-emerald-400">+12% from last month</p>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm overflow-hidden" data-testid="stat-pending">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Awaiting Signature</p>
                            <p className="text-3xl font-bold text-white mt-1" data-testid="text-pending-count">{stats.pending}</p>
                            <p className="text-xs mt-2 text-red-400">-3% from last month</p>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-amber-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm overflow-hidden" data-testid="stat-completed">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Completed</p>
                            <p className="text-3xl font-bold text-white mt-1" data-testid="text-signed-count">{stats.signed}</p>
                            <p className="text-xs mt-2 text-emerald-400">+24% from last month</p>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-emerald-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm overflow-hidden" data-testid="stat-completion-rate">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Completion Rate</p>
                            <p className="text-3xl font-bold text-white mt-1" data-testid="text-rate">{stats.signRate}%</p>
                            <p className="text-xs mt-2 text-emerald-400">+5% from last month</p>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-cyan-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Inbox className="w-5 h-5 text-blue-400" />
                          Recent Envelopes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {pendingLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                          </div>
                        ) : pendingContracts.length === 0 ? (
                          <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No envelopes yet</p>
                            <Button
                              variant="link"
                              className="text-blue-400 mt-2"
                              onClick={() => setShowSendDialog(true)}
                            >
                              Send your first document
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {pendingContracts.slice(0, 5).map((contract) => (
                              <div
                                key={contract.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 border border-gray-700/50 hover:border-blue-500/30 transition-all cursor-pointer"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-semibold">
                                    {contract.recipientName.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-medium text-white">{contract.recipientName}</p>
                                    <p className="text-sm text-gray-400">{contract.recipientEmail}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <Badge className={`${getStatusColor(contract.status)} border`}>
                                    {getStatusIcon(contract.status)}
                                    <span className="ml-1 capitalize">{contract.status}</span>
                                  </Badge>
                                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Activity className="w-5 h-5 text-cyan-400" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {signedContracts.slice(0, 4).map((agreement, index) => (
                            <div key={agreement.id} className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2" />
                              <div>
                                <p className="text-sm text-white">
                                  <span className="font-medium">{agreement.signerName}</span> signed a document
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(agreement.signedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          {signedContracts.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 border-blue-500/30 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                            <Zap className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">Upgrade to Enterprise</h3>
                            <p className="text-gray-300">Unlock advanced features, bulk sending, and API access</p>
                          </div>
                        </div>
                        <Button className="bg-white text-gray-900 hover:bg-gray-100">
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "envelopes" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Envelopes</h2>
                      <p className="text-gray-400">Manage all your document envelopes</p>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                      onClick={() => setShowSendDialog(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Envelope
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                        data-testid="input-search-envelopes"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-white">
                        <Filter className="w-4 h-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="signed">Signed</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Tabs defaultValue="pending" className="space-y-4">
                    <TabsList className="bg-gray-800/50 border border-gray-700">
                      <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-awaiting">
                        Awaiting ({stats.pending})
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white" data-testid="tab-completed">
                        Completed ({stats.signed})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending">
                      <Card className="bg-gray-800/50 border-gray-700/50">
                        <CardContent className="p-0">
                          {filteredPending.length === 0 ? (
                            <div className="text-center py-12">
                              <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                              <p className="text-gray-400">No pending documents</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-700/50">
                              {filteredPending.map((contract) => (
                                <div
                                  key={contract.id}
                                  className="flex items-center justify-between p-4 hover:bg-gray-700/30 transition-colors"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
                                      {contract.recipientName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-medium text-white">{contract.recipientName}</p>
                                      <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Mail className="w-3 h-3" />
                                        <span>{contract.recipientEmail}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                    <div className="text-right">
                                      <p className="text-sm text-gray-400">Sent</p>
                                      <p className="text-white">{new Date(contract.sentAt).toLocaleDateString()}</p>
                                    </div>
                                    <Badge className={`${getStatusColor(contract.status)} border`}>
                                      {getStatusIcon(contract.status)}
                                      <span className="ml-1 capitalize">{contract.status}</span>
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                        <Copy className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="completed">
                      <Card className="bg-gray-800/50 border-gray-700/50">
                        <CardContent className="p-0">
                          {signedContracts.length === 0 ? (
                            <div className="text-center py-12">
                              <CheckCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                              <p className="text-gray-400">No completed documents yet</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-700/50">
                              {signedContracts.map((agreement) => (
                                <div
                                  key={agreement.id}
                                  className="flex items-center justify-between p-4 hover:bg-gray-700/30 transition-colors"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                      {agreement.signerName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-medium text-white">{agreement.signerName}</p>
                                      <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Mail className="w-3 h-3" />
                                        <span>{agreement.signerEmail}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                    <div className="text-right">
                                      <p className="text-sm text-gray-400">Signed</p>
                                      <p className="text-white">{new Date(agreement.signedAt).toLocaleDateString()}</p>
                                    </div>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Completed
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {activeTab === "templates" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Templates</h2>
                      <p className="text-gray-400">Create and manage your document templates</p>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                      onClick={() => setShowTemplateDialog(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Template
                    </Button>
                  </div>

                  {templatesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                    </div>
                  ) : templates.length === 0 ? (
                    <Card className="bg-gray-800/50 border-gray-700/50">
                      <CardContent className="p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Templates Yet</h3>
                        <p className="text-gray-400 mb-6">Create your first template to start sending documents</p>
                        <Button
                          className="bg-gradient-to-r from-blue-600 to-cyan-500"
                          onClick={() => setShowTemplateDialog(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Template
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {templates.map((template) => (
                        <Card
                          key={template.id}
                          className="bg-gray-800/50 border-gray-700/50 hover:border-blue-500/30 transition-all cursor-pointer group"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center border border-blue-500/20">
                                <FileText className="w-6 h-6 text-blue-400" />
                              </div>
                              <Badge className={template.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}>
                                {template.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                              {template.description || "No description"}
                            </p>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTemplate(template);
                                  setShowSendDialog(true);
                                }}
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Use
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-400 hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTemplate(template);
                                  setTemplateName(template.name);
                                  setTemplateDescription(template.description || "");
                                  setTemplateContent(template.content);
                                  setShowTemplateDialog(true);
                                }}
                                data-testid={`button-edit-template-${template.id}`}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-400 hover:text-red-400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm("Are you sure you want to delete this template?")) {
                                    deleteTemplateMutation.mutate(template.id);
                                  }
                                }}
                                data-testid={`button-delete-template-${template.id}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "ai-studio" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-pulse">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        AI Studio
                      </h2>
                      <p className="text-gray-400">Powered by GPT-4o - Intelligent document automation</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer group" data-testid="card-ai-template-fixer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                            <Zap className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">AI Template Fixer</h3>
                            <p className="text-sm text-gray-400 mb-4">
                              Automatically improve contract language, fix legal issues, and optimize templates for higher completion rates.
                            </p>
                            <Button
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25"
                              onClick={() => {
                                if (templates.length > 0) {
                                  setEditingTemplate(templates[0]);
                                  setTemplateName(templates[0].name);
                                  setTemplateDescription(templates[0].description || "");
                                  setTemplateContent(templates[0].content);
                                  setShowTemplateDialog(true);
                                } else {
                                  toast({ title: "No Templates", description: "Create a template first to use AI fixer" });
                                }
                              }}
                              data-testid="button-ai-fixer-launch"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              Fix My Templates
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-500/30 hover:border-blue-400/50 transition-all cursor-pointer group" data-testid="card-ai-autofill">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <User className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">AI Autofill</h3>
                            <p className="text-sm text-gray-400 mb-4">
                              Paste any text, email, or business card - AI extracts recipient name, email, phone, and company instantly.
                            </p>
                            <Button
                              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25"
                              onClick={() => setShowSendDialog(true)}
                              data-testid="button-ai-autofill-launch"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              Smart Send
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-500/30 hover:border-emerald-400/50 transition-all cursor-pointer group" data-testid="card-ai-generator">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                            <FileText className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">AI Template Generator</h3>
                            <p className="text-sm text-gray-400 mb-4">
                              Describe what you need in plain English - AI creates professional contract templates in seconds.
                            </p>
                            <Button
                              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                              onClick={() => setShowTemplateDialog(true)}
                              data-testid="button-ai-generator-launch"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              Generate Template
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gray-800/50 border-gray-700/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        AI-Powered Features
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        All AI features are powered by GPT-4o for enterprise-grade intelligence
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700/50">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="font-medium text-white">Smart Contract Analysis</span>
                          </div>
                          <p className="text-sm text-gray-400">AI reviews templates for legal clarity, missing clauses, and compliance issues</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700/50">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="font-medium text-white">Recipient Auto-Detection</span>
                          </div>
                          <p className="text-sm text-gray-400">Paste any text and AI extracts contact information automatically</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700/50">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="font-medium text-white">Template Generation</span>
                          </div>
                          <p className="text-sm text-gray-400">Describe your contract needs in plain English - AI writes the template</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700/50">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="font-medium text-white">Completion Optimization</span>
                          </div>
                          <p className="text-sm text-gray-400">AI suggests improvements to increase signature completion rates</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Analytics</h2>
                      <p className="text-gray-400">Track signature performance and engagement metrics</p>
                    </div>
                    <Select defaultValue="30days">
                      <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-white" data-testid="select-analytics-timerange">
                        <SelectValue placeholder="Time range" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="7days">Last 7 days</SelectItem>
                        <SelectItem value="30days">Last 30 days</SelectItem>
                        <SelectItem value="90days">Last 90 days</SelectItem>
                        <SelectItem value="year">This year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gray-800/50 border-gray-700/50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Documents Sent</p>
                            <p className="text-3xl font-bold text-white mt-1">{pendingContracts.length + signedContracts.length}</p>
                            <div className="flex items-center gap-1 mt-2">
                              <TrendingUp className="w-3 h-3 text-emerald-400" />
                              <span className="text-xs text-emerald-400">+18%</span>
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Send className="w-6 h-6 text-blue-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700/50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Avg. Time to Sign</p>
                            <p className="text-3xl font-bold text-white mt-1">2.4h</p>
                            <div className="flex items-center gap-1 mt-2">
                              <TrendingUp className="w-3 h-3 text-emerald-400" />
                              <span className="text-xs text-emerald-400">-32%</span>
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-purple-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700/50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-400">View Rate</p>
                            <p className="text-3xl font-bold text-white mt-1">94%</p>
                            <div className="flex items-center gap-1 mt-2">
                              <TrendingUp className="w-3 h-3 text-emerald-400" />
                              <span className="text-xs text-emerald-400">+5%</span>
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                            <Eye className="w-6 h-6 text-cyan-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700/50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Completion Rate</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.signRate}%</p>
                            <div className="flex items-center gap-1 mt-2">
                              <TrendingUp className="w-3 h-3 text-emerald-400" />
                              <span className="text-xs text-emerald-400">+8%</span>
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-emerald-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gray-800/50 border-gray-700/50">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-blue-400" />
                          Template Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {templates.slice(0, 5).map((template, index) => {
                            const completionRate = Math.round(50 + Math.random() * 50);
                            return (
                              <div key={template.id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-white">{template.name}</span>
                                  <span className="text-gray-400">{completionRate}%</span>
                                </div>
                                <Progress value={completionRate} className="h-2 bg-gray-700" />
                              </div>
                            );
                          })}
                          {templates.length === 0 && (
                            <p className="text-center text-gray-500 py-4">No templates yet</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700/50">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Activity className="w-5 h-5 text-cyan-400" />
                          Signature Funnel
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-blue-500" />
                              <span className="text-white">Sent</span>
                            </div>
                            <span className="text-gray-400">{pendingContracts.length + signedContracts.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-purple-500" />
                              <span className="text-white">Viewed</span>
                            </div>
                            <span className="text-gray-400">{Math.round((pendingContracts.length + signedContracts.length) * 0.94)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-amber-500" />
                              <span className="text-white">Pending Signature</span>
                            </div>
                            <span className="text-gray-400">{pendingContracts.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-emerald-500" />
                              <span className="text-white">Completed</span>
                            </div>
                            <span className="text-gray-400">{signedContracts.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-red-500" />
                              <span className="text-white">Expired</span>
                            </div>
                            <span className="text-gray-400">{stats.expired}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 border-purple-500/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">AI Insights</h3>
                            <p className="text-gray-300">Get AI-powered recommendations to improve your signature completion rates</p>
                          </div>
                        </div>
                        <Button className="bg-white text-gray-900 hover:bg-gray-100">
                          Generate Insights
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Activity Log</h2>
                    <p className="text-gray-400">Complete audit trail of all document activities</p>
                  </div>

                  <Card className="bg-gray-800/50 border-gray-700/50">
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {signedContracts.map((agreement, index) => (
                          <div key={agreement.id} className="flex gap-4">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                              {index < signedContracts.length - 1 && (
                                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gray-700" />
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-white">
                                    Document signed by {agreement.signerName}
                                  </p>
                                  <p className="text-sm text-gray-400">{agreement.signerEmail}</p>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {new Date(agreement.signedAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {pendingContracts.map((contract, index) => (
                          <div key={contract.id} className="flex gap-4">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                <Send className="w-5 h-5 text-white" />
                              </div>
                              {index < pendingContracts.length - 1 && (
                                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gray-700" />
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-white">
                                    Document sent to {contract.recipientName}
                                  </p>
                                  <p className="text-sm text-gray-400">{contract.recipientEmail}</p>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {new Date(contract.sentAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {signedContracts.length === 0 && pendingContracts.length === 0 && (
                          <div className="text-center py-8">
                            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No activity yet</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-400" />
              Send New Envelope
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Send a document for signature in a few simple steps
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center gap-4 py-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                    sendStep >= step
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${sendStep > step ? "bg-blue-500" : "bg-gray-700"}`} />
                )}
              </div>
            ))}
          </div>

          {sendStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Select Template</h3>
              <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto">
                {templates.filter(t => t.isActive).map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedTemplate?.id === template.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className={`w-5 h-5 ${selectedTemplate?.id === template.id ? "text-blue-400" : "text-gray-400"}`} />
                      <div>
                        <p className="font-medium text-white">{template.name}</p>
                        <p className="text-sm text-gray-400">{template.description || "No description"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {templates.filter(t => t.isActive).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>No active templates available</p>
                  <Button variant="link" className="text-blue-400" onClick={() => {
                    setShowSendDialog(false);
                    setShowTemplateDialog(true);
                  }}>
                    Create a template first
                  </Button>
                </div>
              )}
            </div>
          )}

          {sendStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Add Recipient</h3>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="font-medium text-white">AI Autofill</span>
                  <Badge className="bg-purple-500/30 text-purple-300 text-xs">NEW</Badge>
                </div>
                <Textarea
                  placeholder="Paste any text, email, or business card info here...

Example: 
John Doe
Senior VP at ABC Company
john.doe@abccompany.com
(555) 123-4567"
                  className="bg-gray-800/50 border-gray-700 text-white min-h-[80px] text-sm mb-3"
                  value={autofillText}
                  onChange={(e) => setAutofillText(e.target.value)}
                  data-testid="input-ai-autofill"
                />
                <Button
                  type="button"
                  onClick={() => autofillMutation.mutate(autofillText)}
                  disabled={!autofillText.trim() || autofillMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                  data-testid="button-ai-extract"
                >
                  {autofillMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Extract Contact Info
                </Button>
              </div>

              <div className="relative flex items-center my-4">
                <div className="flex-1 h-px bg-gray-700"></div>
                <span className="px-3 text-sm text-gray-500">or enter manually</span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="John Doe"
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                      data-testid="input-recipient-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                      data-testid="input-recipient-email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                      data-testid="input-recipient-phone"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {sendStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Review & Send</h3>
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Template</span>
                  <span className="text-white font-medium">{selectedTemplate?.name}</span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Recipient</span>
                  <span className="text-white">{recipientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white">{recipientEmail}</span>
                </div>
                {recipientPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Phone</span>
                    <span className="text-white">{recipientPhone}</span>
                  </div>
                )}
              </div>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Ready to send!</p>
                    <p className="text-sm text-gray-400">
                      The recipient will receive an email with a secure link to sign the document.
                      Links expire after 7 days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div>
              {sendStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setSendStep(sendStep - 1)}
                  className="border-gray-600 text-gray-300"
                >
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setShowSendDialog(false); resetSendForm(); }} className="border-gray-600 text-gray-300">
                Cancel
              </Button>
              {sendStep < 3 ? (
                <Button
                  onClick={() => setSendStep(sendStep + 1)}
                  disabled={
                    (sendStep === 1 && !selectedTemplate) ||
                    (sendStep === 2 && (!recipientName || !recipientEmail))
                  }
                  className="bg-gradient-to-r from-blue-600 to-cyan-500"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (selectedTemplate) {
                      sendContractMutation.mutate({
                        templateId: selectedTemplate.id,
                        recipientName,
                        recipientEmail,
                        recipientPhone,
                      });
                    }
                  }}
                  disabled={sendContractMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500"
                >
                  {sendContractMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Envelope
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTemplateDialog} onOpenChange={(open) => {
        setShowTemplateDialog(open);
        if (!open) {
          setEditingTemplate(null);
          resetTemplateForm();
        }
      }}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              {editingTemplate ? "Edit Template" : "Create Template"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingTemplate ? "Update your document template" : "Create a reusable document template for your signatures"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Template Name *</Label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Service Agreement"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Brief description of this template"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Template Content (HTML) *</Label>
                {editingTemplate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fixTemplateMutation.mutate(editingTemplate.id)}
                    disabled={fixTemplateMutation.isPending}
                    className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                    data-testid="button-ai-fix-template"
                  >
                    {fixTemplateMutation.isPending ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1" />
                    )}
                    AI Fix Template
                  </Button>
                )}
              </div>
              <Textarea
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                placeholder="Enter your contract HTML content with placeholders like [NAME], [EMAIL], [DATE], [SIGNATURE]..."
                className="bg-gray-800 border-gray-700 text-white min-h-[200px] font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Use placeholders: [NAME], [EMAIL], [DATE], [SIGNATURE], [INITIALS], [ADDRESS], [COMPANY], [TITLE]
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowTemplateDialog(false); setEditingTemplate(null); resetTemplateForm(); }} className="border-gray-600 text-gray-300">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingTemplate) {
                  updateTemplateMutation.mutate({
                    id: editingTemplate.id,
                    name: templateName,
                    description: templateDescription,
                    content: templateContent,
                  });
                } else {
                  createTemplateMutation.mutate({
                    name: templateName,
                    description: templateDescription,
                    content: templateContent,
                  });
                }
              }}
              disabled={!templateName || !templateContent || createTemplateMutation.isPending || updateTemplateMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-cyan-500"
            >
              {(createTemplateMutation.isPending || updateTemplateMutation.isPending) ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : editingTemplate ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {editingTemplate ? "Save Changes" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBatchSendDialog} onOpenChange={setShowBatchSendDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Batch Send
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Send documents to multiple recipients at once
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Select Template *</Label>
              <Select 
                value={selectedTemplate?.id?.toString() || ""} 
                onValueChange={(val) => setSelectedTemplate(templates.find(t => t.id === parseInt(val)) || null)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-batch-template">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {templates.filter(t => t.isActive).map((template) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Recipients (CSV format: name, email, phone)</Label>
              <Textarea
                value={batchCsvInput}
                onChange={(e) => setBatchCsvInput(e.target.value)}
                placeholder="John Doe, john@example.com, 555-123-4567
Jane Smith, jane@example.com, 555-987-6543
Bob Wilson, bob@example.com"
                className="bg-gray-800 border-gray-700 text-white min-h-[150px] font-mono text-sm"
                data-testid="input-batch-csv"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  One recipient per line. Phone is optional.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300"
                  onClick={() => {
                    const lines = batchCsvInput.trim().split("\n").filter(l => l.trim());
                    const parsed = lines.map(line => {
                      const parts = line.split(",").map(p => p.trim());
                      return {
                        name: parts[0] || "",
                        email: parts[1] || "",
                        phone: parts[2] || "",
                      };
                    }).filter(r => r.name && r.email);
                    setBatchRecipients(parsed);
                    if (parsed.length > 0) {
                      toast({ title: "Parsed Recipients", description: `Found ${parsed.length} valid recipient(s)` });
                    }
                  }}
                  data-testid="button-parse-csv"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Parse
                </Button>
              </div>
            </div>

            {batchRecipients.length > 0 && (
              <div className="space-y-2">
                <Label>Recipients to Send ({batchRecipients.length})</Label>
                <ScrollArea className="h-[200px] rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                  <div className="space-y-2">
                    {batchRecipients.map((recipient, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                            {recipient.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{recipient.name}</p>
                            <p className="text-xs text-gray-400">{recipient.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-red-400"
                          onClick={() => setBatchRecipients(prev => prev.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => { 
                setShowBatchSendDialog(false); 
                setBatchRecipients([]); 
                setBatchCsvInput(""); 
                setSelectedTemplate(null);
              }} 
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedTemplate && batchRecipients.length > 0) {
                  batchSendMutation.mutate({
                    templateId: selectedTemplate.id,
                    recipients: batchRecipients,
                  });
                }
              }}
              disabled={!selectedTemplate || batchRecipients.length === 0 || batchSendMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-cyan-500"
              data-testid="button-batch-send-submit"
            >
              {batchSendMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send to {batchRecipients.length} Recipient{batchRecipients.length !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
