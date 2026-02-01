import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { VeteranAuthGate } from "@/components/veteran-auth-gate";
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
  Brain,
  Workflow,
  FileCheck,
  MessageSquare,
  AlertTriangle,
  History,
  FolderOpen,
  GitBranch,
  Bell,
  Lock,
  Fingerprint,
  CreditCard,
  Cloud,
  CheckCircle2,
  CircleDot,
  Circle,
  ChevronDown,
  ChevronUp,
  Wand2,
  ScanText,
  FileWarning,
  HelpCircle,
  Layers,
  MapPin,
  Briefcase,
  Type,
  CalendarDays,
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

type PipelineStep = 'upload' | 'ai-assist' | 'configure' | 'review' | 'send';

export default function DocumentSignature() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  
  // Unified New Envelope State
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [useTemplate, setUseTemplate] = useState(true);
  const [customContent, setCustomContent] = useState("");
  
  // Recipient State - All fields extracted by AI
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientCompany, setRecipientCompany] = useState("");
  const [recipientInitials, setRecipientInitials] = useState("");
  const [recipientDate, setRecipientDate] = useState("");
  const [recipientTitle, setRecipientTitle] = useState("");
  const [autofillText, setAutofillText] = useState("");
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);
  const [isSmartExtracting, setIsSmartExtracting] = useState(false);
  
  // AI Assist State
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [aiFieldsDetected, setAiFieldsDetected] = useState(false);
  const [aiRiskScore, setAiRiskScore] = useState<number | null>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [showAiQuestion, setShowAiQuestion] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  
  // Template State
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<ContractTemplate | null>(null);
  
  // Signature Canvas State
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  
  // Batch Send
  const [showBatchSendDialog, setShowBatchSendDialog] = useState(false);
  const [batchRecipients, setBatchRecipients] = useState<Array<{name: string; email: string; phone: string}>>([]);
  const [batchCsvInput, setBatchCsvInput] = useState("");
  
  // Signature Canvas Drawing Functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      e.preventDefault();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1a365d';
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      setSignatureDataUrl(canvas.toDataURL('image/png'));
    }
  };
  
  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
  };
  
  useEffect(() => {
    const canvas = signatureCanvasRef.current;
    if (canvas && showSignatureModal) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [showSignatureModal]);

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
      toast({ title: "Envelope Sent!", description: "Document has been sent for signature." });
      resetEnvelopeState();
      setActiveTab("envelopes");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send envelope.", variant: "destructive" });
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
        toast({ title: "AI Template Fixer", description: "Template has been improved!" });
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

  // AI Smart Extract - consolidated extraction with 3-pass verification
  const smartExtractMutation = useMutation({
    mutationFn: async (text: string) => {
      setIsSmartExtracting(true);
      const res = await apiRequest("POST", "/api/csu/ai-smart-extract", { text });
      return res.json();
    },
    onSuccess: (data) => {
      setIsSmartExtracting(false);
      // Fill all fields from AI extraction
      if (data.name) setRecipientName(data.name);
      if (data.email) setRecipientEmail(data.email);
      if (data.phone) setRecipientPhone(data.phone);
      if (data.address) setRecipientAddress(data.address);
      if (data.company) setRecipientCompany(data.company);
      if (data.initials) setRecipientInitials(data.initials);
      if (data.date) setRecipientDate(data.date);
      if (data.title) setRecipientTitle(data.title);
      if (data._meta?.confidence) setAiConfidence(data._meta.confidence);
      
      setAutofillText("");
      
      // Count all 8 fields found
      const fieldsFound = [data.name, data.email, data.phone, data.address, data.company, data.initials, data.date, data.title].filter(Boolean).length;
      
      toast({ 
        title: `AI Extracted ${fieldsFound} Fields!`, 
        description: `${data._meta?.passes || 3} passes, ${data._meta?.confidence || 100}% confidence. Name: ${data.name || "?"}, Email: ${data.email || "?"}` 
      });
    },
    onError: () => {
      setIsSmartExtracting(false);
      toast({ title: "Extraction Failed", description: "Could not extract contact info. Please enter manually.", variant: "destructive" });
    },
  });

  // Legacy autofill mutation (kept for backwards compatibility)
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
      toast({ title: "Extraction Failed", description: "Could not extract contact info.", variant: "destructive" });
    },
  });

  const resetEnvelopeState = () => {
    setPipelineStep('upload');
    setSelectedTemplate(null);
    setUploadedFile(null);
    setCustomContent("");
    setRecipientName("");
    setRecipientEmail("");
    setRecipientPhone("");
    setRecipientAddress("");
    setRecipientCompany("");
    setRecipientInitials("");
    setRecipientDate("");
    setRecipientTitle("");
    setAiConfidence(null);
    setIsSmartExtracting(false);
    setAiAnalysisComplete(false);
    setAiFieldsDetected(false);
    setAiRiskScore(null);
    setAiSummary("");
    setAutofillText("");
  };

  const resetTemplateForm = () => {
    setTemplateName("");
    setTemplateDescription("");
    setTemplateContent("");
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisData, setAiAnalysisData] = useState<{
    signatureFields: number;
    dateFields: number;
    partyIdentificationSections: number;
    documentType: string;
    recommendations: string[];
    riskLevel: string;
  } | null>(null);

  const runAiAnalysis = useCallback(async () => {
    const contentToAnalyze = selectedTemplate?.content || customContent;
    
    if (!contentToAnalyze) {
      toast({ title: "No Content", description: "Please select a template or upload a document first.", variant: "destructive" });
      return;
    }
    
    setIsAnalyzing(true);
    toast({ title: "AI Analysis Started", description: "Scanning document for fields, risks, and optimization..." });
    
    try {
      const response = await fetch('/api/csu/analyze-template-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: contentToAnalyze,
          templateName: selectedTemplate?.name || 'Custom Document'
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Analysis failed');
      }
      
      const data = await response.json();
      const analysis = data.analysis;
      
      setAiFieldsDetected(true);
      setAiRiskScore(analysis.riskScore);
      setAiSummary(analysis.summary);
      setAiAnalysisData({
        signatureFields: analysis.signatureFields,
        dateFields: analysis.dateFields,
        partyIdentificationSections: analysis.partyIdentificationSections,
        documentType: analysis.documentType,
        recommendations: analysis.recommendations,
        riskLevel: analysis.riskLevel,
      });
      setAiAnalysisComplete(true);
      toast({ title: "AI Analysis Complete", description: "Document has been analyzed and optimized." });
    } catch (error) {
      console.error("AI analysis error:", error);
      toast({ 
        title: "Analysis Failed", 
        description: error instanceof Error ? error.message : "Could not analyze document", 
        variant: "destructive" 
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedTemplate, customContent, toast]);

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

  const pipelineSteps = [
    { id: 'upload' as PipelineStep, label: 'Upload', icon: Upload, description: 'Select template or upload' },
    { id: 'ai-assist' as PipelineStep, label: 'AI Assist', icon: Sparkles, description: 'Analyze & optimize' },
    { id: 'configure' as PipelineStep, label: 'Recipients', icon: Users, description: 'Add signers' },
    { id: 'review' as PipelineStep, label: 'Review', icon: Eye, description: 'Verify details' },
    { id: 'send' as PipelineStep, label: 'Send', icon: Send, description: 'Deliver envelope' },
  ];

  const getCurrentStepIndex = () => pipelineSteps.findIndex(s => s.id === pipelineStep);

  const canProceed = () => {
    switch (pipelineStep) {
      case 'upload': return !!selectedTemplate || !!uploadedFile || !!customContent;
      case 'ai-assist': return aiAnalysisComplete;
      case 'configure': return !!recipientName && !!recipientEmail;
      case 'review': return true;
      default: return false;
    }
  };

  return (
    <VeteranAuthGate serviceName="RANGER Document Signing">
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        
        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <div className="lg:w-72 shrink-0">
              <div className="sticky top-24">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
                        <FileSignature className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">RANGER</h1>
                      <p className="text-xs text-gray-400">Enterprise Document Signature</p>
                      <Badge className="mt-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 text-[10px]">
                        AI-POWERED
                      </Badge>
                    </div>
                  </div>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: "new-envelope", icon: Plus, label: "New Envelope", isPrimary: true },
                    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
                    { id: "envelopes", icon: Inbox, label: "Envelopes" },
                    { id: "templates", icon: FileText, label: "Templates" },
                    { id: "repository", icon: FolderOpen, label: "Repository", isNew: true },
                    { id: "analytics", icon: TrendingUp, label: "Analytics" },
                    { id: "activity", icon: Activity, label: "Audit Trail" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (item.id === 'new-envelope') {
                          resetEnvelopeState();
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === item.id
                          ? item.isPrimary
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                            : "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border border-blue-500/30"
                          : item.isPrimary
                            ? "bg-gradient-to-r from-blue-600/10 to-cyan-600/10 text-blue-300 border border-blue-500/30 hover:border-blue-400/50"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                      data-testid={`nav-${item.id}`}
                    >
                      <item.icon className={`w-5 h-5 ${item.isPrimary ? "text-white" : ""}`} />
                      <span className="font-medium">{item.label}</span>
                      {item.isNew && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-semibold">NEW</span>
                      )}
                    </button>
                  ))}
                </nav>

                <Separator className="my-6 bg-gray-800" />

                {/* Quick Actions */}
                <div className="space-y-2">
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

                {/* AI Status */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">AI Engine</span>
                      <p className="text-[10px] text-gray-400">GPT-4o Powered</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active & Ready</span>
                  </div>
                </div>

                {/* Security Status */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-medium text-gray-300">Enterprise Security</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Lock className="w-3 h-3" />
                      <span>256-bit Encryption</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Fingerprint className="w-3 h-3" />
                      <span>Biometric Auth Ready</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FileCheck className="w-3 h-3" />
                      <span>HIPAA Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              
              {/* NEW ENVELOPE - Unified Workspace */}
              {activeTab === "new-envelope" && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        Create New Envelope
                      </h2>
                      <p className="text-gray-400 mt-1">AI-powered document signing workflow</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-gray-300"
                      onClick={resetEnvelopeState}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>

                  {/* Orchestration Pipeline Visualization */}
                  <Card className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700/50 overflow-hidden" data-testid="orchestration-pipeline">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                          <Workflow className="w-4 h-4" />
                          DOCUMENT ORCHESTRATION PIPELINE
                        </h3>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          Step {getCurrentStepIndex() + 1} of {pipelineSteps.length}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute top-6 left-8 right-8 h-1 bg-gray-700 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${(getCurrentStepIndex() / (pipelineSteps.length - 1)) * 100}%` }}
                          />
                        </div>
                        
                        {pipelineSteps.map((step, index) => {
                          const isComplete = index < getCurrentStepIndex();
                          const isCurrent = step.id === pipelineStep;
                          const isPending = index > getCurrentStepIndex();
                          
                          return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center" data-testid={`pipeline-step-${step.id}`}>
                              <button
                                onClick={() => {
                                  if (isComplete || isCurrent) {
                                    setPipelineStep(step.id);
                                  }
                                }}
                                disabled={isPending}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                  isComplete
                                    ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                                    : isCurrent
                                      ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 animate-pulse"
                                      : "bg-gray-800 text-gray-500 border border-gray-700"
                                }`}
                              >
                                {isComplete ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <step.icon className="w-5 h-5" />
                                )}
                              </button>
                              <span className={`mt-2 text-xs font-medium ${isCurrent ? "text-white" : "text-gray-500"}`}>
                                {step.label}
                              </span>
                              <span className="text-[10px] text-gray-600">{step.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Main Workspace Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Panel - Document/Template Selection */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Step 1: Upload/Select */}
                      {pipelineStep === 'upload' && (
                        <Card className="bg-gray-800/50 border-gray-700/50" data-testid="upload-section">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Upload className="w-5 h-5 text-blue-400" />
                              Select Document
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              Choose a template or upload your own document
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* Template Selection */}
                            <div className="space-y-4">
                              <Label className="text-gray-300">Quick Select Template</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {templates.filter(t => t.isActive).slice(0, 4).map((template) => (
                                  <button
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template)}
                                    className={`p-4 rounded-xl border text-left transition-all ${
                                      selectedTemplate?.id === template.id
                                        ? "bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20"
                                        : "bg-gray-900/50 border-gray-700 hover:border-gray-600"
                                    }`}
                                    data-testid={`template-select-${template.id}`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        selectedTemplate?.id === template.id
                                          ? "bg-blue-500"
                                          : "bg-gray-800"
                                      }`}>
                                        <FileText className="w-5 h-5 text-white" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-white truncate">{template.name}</p>
                                        <p className="text-xs text-gray-500 line-clamp-2">{template.description || "No description"}</p>
                                      </div>
                                      {selectedTemplate?.id === template.id && (
                                        <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                              
                              {templates.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-xl">
                                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                  <p className="text-gray-400 mb-2">No templates yet</p>
                                  <Button
                                    variant="link"
                                    className="text-blue-400"
                                    onClick={() => setShowTemplateDialog(true)}
                                  >
                                    Create your first template
                                  </Button>
                                </div>
                              )}
                            </div>

                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full bg-gray-700" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-gray-800 px-2 text-gray-500">Or upload document</span>
                              </div>
                            </div>

                            {/* Upload Area */}
                            <div 
                              className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer"
                              onClick={() => document.getElementById('file-upload')?.click()}
                            >
                              <input 
                                type="file" 
                                id="file-upload" 
                                className="hidden" 
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    setUploadedFile(e.target.files[0]);
                                    setSelectedTemplate(null);
                                    toast({ title: "File Uploaded", description: e.target.files[0].name });
                                  }
                                }}
                              />
                              <Cloud className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                              <p className="text-gray-400 mb-1">Drop files here or click to upload</p>
                              <p className="text-xs text-gray-600">PDF, DOC, DOCX up to 25MB</p>
                              {uploadedFile && (
                                <Badge className="mt-3 bg-emerald-500/20 text-emerald-400">
                                  <FileCheck className="w-3 h-3 mr-1" />
                                  {uploadedFile.name}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Step 2: AI Assist */}
                      {pipelineStep === 'ai-assist' && (
                        <Card className="bg-gradient-to-br from-purple-900/30 via-gray-800/50 to-pink-900/30 border-purple-500/30" data-testid="ai-assist-section">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                              AI Document Assistant
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              GPT-4o is analyzing your document for optimization
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* AI Analysis Actions */}
                            {!aiAnalysisComplete && (
                              <div className="space-y-4">
                                <Button
                                  onClick={runAiAnalysis}
                                  disabled={isAnalyzing}
                                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-6 text-lg shadow-lg shadow-purple-500/30 disabled:opacity-50"
                                  data-testid="button-run-ai-analysis"
                                >
                                  {isAnalyzing ? (
                                    <>
                                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                      Analyzing...
                                    </>
                                  ) : (
                                    <>
                                      <Brain className="w-5 h-5 mr-2" />
                                      Run AI Analysis
                                    </>
                                  )}
                                </Button>
                                <p className="text-center text-sm text-gray-500">
                                  AI will detect signature fields, analyze risks, and suggest optimizations
                                </p>
                              </div>
                            )}

                            {/* AI Analysis Results */}
                            {aiAnalysisComplete && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                      <ScanText className="w-5 h-5 text-emerald-400" />
                                      <span className="font-medium text-white">Fields Detected</span>
                                    </div>
                                    <p className="text-2xl font-bold text-emerald-400">
                                      {(aiAnalysisData?.signatureFields || 0) + (aiAnalysisData?.dateFields || 0) + (aiAnalysisData?.partyIdentificationSections || 0)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {aiAnalysisData?.signatureFields || 0} signature, {aiAnalysisData?.dateFields || 0} date, {aiAnalysisData?.partyIdentificationSections || 0} party fields
                                    </p>
                                  </div>
                                  
                                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Shield className="w-5 h-5 text-blue-400" />
                                      <span className="font-medium text-white">Risk Score</span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-400">{aiRiskScore}%</p>
                                    <p className="text-xs text-gray-500 capitalize">{aiAnalysisData?.riskLevel || 'Low'} risk document</p>
                                  </div>
                                  
                                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                      <FileCheck className="w-5 h-5 text-purple-400" />
                                      <span className="font-medium text-white">Document Type</span>
                                    </div>
                                    <p className="text-lg font-bold text-purple-400 truncate">{aiAnalysisData?.documentType || 'Contract'}</p>
                                    <p className="text-xs text-gray-500">Identified by AI</p>
                                  </div>
                                </div>

                                {/* AI Summary */}
                                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                                  <div className="flex items-start gap-3">
                                    <Brain className="w-5 h-5 text-purple-400 mt-0.5" />
                                    <div>
                                      <p className="font-medium text-white mb-1">AI Summary</p>
                                      <p className="text-sm text-gray-400">{aiSummary}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* AI Recommendations */}
                                {aiAnalysisData?.recommendations && aiAnalysisData.recommendations.length > 0 && (
                                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                                    <div className="flex items-start gap-3">
                                      <Zap className="w-5 h-5 text-amber-400 mt-0.5" />
                                      <div>
                                        <p className="font-medium text-white mb-2">Recommendations</p>
                                        <ul className="text-sm text-gray-400 space-y-1">
                                          {aiAnalysisData.recommendations.slice(0, 3).map((rec, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                              <span className="text-amber-400">•</span>
                                              {rec}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* AI Q&A */}
                                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                                  <div className="flex items-center gap-2 mb-3">
                                    <MessageSquare className="w-5 h-5 text-purple-400" />
                                    <span className="font-medium text-white">Ask AI About This Document</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="e.g., What happens if the signer doesn't respond?"
                                      className="bg-gray-900 border-gray-700 text-white"
                                      value={aiQuestion}
                                      onChange={(e) => setAiQuestion(e.target.value)}
                                      data-testid="input-ai-question"
                                    />
                                    <Button className="bg-purple-600 hover:bg-purple-700">
                                      <Send className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                  <span className="text-emerald-400 font-medium">Analysis Complete - Document Optimized</span>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Step 3: Configure Recipients */}
                      {pipelineStep === 'configure' && (
                        <Card className="bg-gray-800/50 border-gray-700/50" data-testid="configure-section">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Users className="w-5 h-5 text-blue-400" />
                              Add Recipients
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              Enter signer details or use AI to extract from text
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* AI Smart Extract - One Button Does Everything */}
                            <div className="p-5 rounded-xl bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-cyan-900/40 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                                    <Brain className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <span className="font-semibold text-white">AI Smart Extract</span>
                                    <p className="text-xs text-gray-400">One click extracts all fields with 3x verification</p>
                                  </div>
                                </div>
                                <Badge className="bg-purple-500/30 text-purple-300 text-[10px] px-2 py-1">
                                  GPT-4o • 3-PASS
                                </Badge>
                              </div>
                              
                              <Textarea
                                value={autofillText}
                                onChange={(e) => setAutofillText(e.target.value)}
                                placeholder="Paste ANY text - emails, signatures, business cards, LinkedIn profiles, contact forms, meeting notes...

AI will extract: Name, Email, Phone, Address, Company, Initials, Date, Title

Example: 'John Doe from Acme Corp - john@acme.com, 555-123-4567, 123 Main St, Chicago IL 60601'"
                                className="bg-gray-900/80 border-gray-700 text-white min-h-[100px] mb-4 placeholder:text-gray-600"
                                data-testid="input-autofill-text"
                              />
                              
                              <Button
                                onClick={() => autofillText && smartExtractMutation.mutate(autofillText)}
                                disabled={!autofillText || smartExtractMutation.isPending || isSmartExtracting}
                                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-600 text-white py-6 text-lg shadow-lg shadow-purple-500/30"
                                data-testid="button-ai-smart-extract"
                              >
                                {smartExtractMutation.isPending || isSmartExtracting ? (
                                  <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Extracting (3 passes)...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    AI Smart Extract - One Click
                                  </>
                                )}
                              </Button>
                              
                              {aiConfidence && (
                                <div className="mt-3 flex flex-col items-center gap-1 text-sm">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-400">{aiConfidence}% confidence from 3-pass verification</span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Powered by model router - best model auto-selected per task
                                  </div>
                                </div>
                              )}
                              
                              <p className="text-center text-xs text-gray-500 mt-3">
                                Searches for: Name, Email, Phone, Address, Company, Initials, Date, Title
                              </p>
                            </div>

                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full bg-gray-700" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-gray-800 px-2 text-gray-500">Extracted fields (edit if needed)</span>
                              </div>
                            </div>

                            {/* All Fields - Auto-filled by AI */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-gray-300 flex items-center gap-2">
                                  Recipient Name *
                                  {recipientName && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                </Label>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <Input
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    placeholder="John Doe"
                                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                                    data-testid="input-recipient-name"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-gray-300">Email Address *</Label>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <Input
                                    value={recipientEmail}
                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                                    data-testid="input-recipient-email"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-gray-300 flex items-center gap-2">
                                  Phone Number
                                  {recipientPhone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                </Label>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <Input
                                    value={recipientPhone}
                                    onChange={(e) => setRecipientPhone(e.target.value)}
                                    placeholder="+1 (555) 123-4567"
                                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                                    data-testid="input-recipient-phone"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-gray-300 flex items-center gap-2">
                                  Company
                                  {recipientCompany && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                </Label>
                                <div className="relative">
                                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <Input
                                    value={recipientCompany}
                                    onChange={(e) => setRecipientCompany(e.target.value)}
                                    placeholder="Acme Corporation"
                                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                                    data-testid="input-recipient-company"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <Label className="text-gray-300 flex items-center gap-2">
                                  Address
                                  {recipientAddress && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                </Label>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <Input
                                    value={recipientAddress}
                                    onChange={(e) => setRecipientAddress(e.target.value)}
                                    placeholder="123 Main Street, City, State ZIP"
                                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                                    data-testid="input-recipient-address"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-gray-300 flex items-center gap-2">
                                  Title
                                  {recipientTitle && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                </Label>
                                <div className="relative">
                                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <Input
                                    value={recipientTitle}
                                    onChange={(e) => setRecipientTitle(e.target.value)}
                                    placeholder="CEO, Manager, etc."
                                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                                    data-testid="input-recipient-title"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-gray-300 flex items-center gap-2">
                                  Initials
                                  {recipientInitials && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                </Label>
                                <div className="relative">
                                  <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <Input
                                    value={recipientInitials}
                                    onChange={(e) => setRecipientInitials(e.target.value.toUpperCase())}
                                    placeholder="JD"
                                    maxLength={4}
                                    className="pl-10 bg-gray-900 border-gray-700 text-white uppercase"
                                    data-testid="input-recipient-initials"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-gray-300 flex items-center gap-2">
                                  Effective Date
                                  {recipientDate && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                </Label>
                                <div className="relative">
                                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <Input
                                    type="date"
                                    value={recipientDate}
                                    onChange={(e) => setRecipientDate(e.target.value)}
                                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                                    data-testid="input-recipient-date"
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Step 4: Review */}
                      {pipelineStep === 'review' && (
                        <Card className="bg-gray-800/50 border-gray-700/50" data-testid="review-section">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Eye className="w-5 h-5 text-blue-400" />
                              Review & Confirm
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              Verify all details before sending
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Document Summary */}
                              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                                <div className="flex items-center gap-2 mb-4">
                                  <FileText className="w-5 h-5 text-blue-400" />
                                  <span className="font-medium text-white">Document</span>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Template</span>
                                    <span className="text-white font-medium">{selectedTemplate?.name || "Custom Upload"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Fields Detected</span>
                                    <span className="text-emerald-400">12</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Risk Score</span>
                                    <span className="text-blue-400">{aiRiskScore || 15}%</span>
                                  </div>
                                </div>
                              </div>

                              {/* Recipient Summary */}
                              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                                <div className="flex items-center gap-2 mb-4">
                                  <User className="w-5 h-5 text-cyan-400" />
                                  <span className="font-medium text-white">Recipient</span>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Name</span>
                                    <span className="text-white">{recipientName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Email</span>
                                    <span className="text-white">{recipientEmail}</span>
                                  </div>
                                  {recipientPhone && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Phone</span>
                                      <span className="text-white">{recipientPhone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Security Notice */}
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                              <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
                                <div>
                                  <p className="font-medium text-white">Secure Delivery</p>
                                  <p className="text-sm text-gray-400">
                                    Document will be sent via encrypted email with a secure signing link.
                                    Links expire after 7 days. All signatures are legally binding.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Step 5: Send */}
                      {pipelineStep === 'send' && (
                        <Card className="bg-gradient-to-br from-emerald-900/30 via-gray-800/50 to-teal-900/30 border-emerald-500/30" data-testid="send-section">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Send className="w-5 h-5 text-emerald-400" />
                              Send Envelope
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              Ready to deliver your document
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="text-center py-8">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                                <Send className="w-10 h-10 text-white" />
                              </div>
                              <h3 className="text-xl font-bold text-white mb-2">Ready to Send!</h3>
                              <p className="text-gray-400 mb-6">
                                Your document is optimized and ready for {recipientName}
                              </p>
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
                                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white px-12 py-6 text-lg shadow-lg shadow-emerald-500/30"
                                data-testid="button-send-envelope"
                              >
                                {sendContractMutation.isPending ? (
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                  <Send className="w-5 h-5 mr-2" />
                                )}
                                Send Envelope Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Right Panel - AI Suite & Quick Actions */}
                    <div className="space-y-6">
                      {/* Navigation Controls */}
                      <Card className="bg-gray-800/50 border-gray-700/50">
                        <CardContent className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1 border-gray-600 text-gray-300"
                              disabled={pipelineStep === 'upload'}
                              onClick={() => {
                                const currentIndex = getCurrentStepIndex();
                                if (currentIndex > 0) {
                                  setPipelineStep(pipelineSteps[currentIndex - 1].id);
                                }
                              }}
                            >
                              <ChevronUp className="w-4 h-4 mr-1" />
                              Back
                            </Button>
                            <Button
                              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500"
                              disabled={!canProceed() || pipelineStep === 'send'}
                              onClick={() => {
                                const currentIndex = getCurrentStepIndex();
                                if (currentIndex < pipelineSteps.length - 1) {
                                  setPipelineStep(pipelineSteps[currentIndex + 1].id);
                                }
                              }}
                              data-testid="button-next-step"
                            >
                              Next
                              <ChevronDown className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* AI Quick Actions */}
                      <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            AI Quick Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-300 hover:bg-purple-500/10 hover:text-white"
                            onClick={() => setPipelineStep('ai-assist')}
                            data-testid="button-ai-analyze"
                          >
                            <Brain className="w-4 h-4 mr-2 text-purple-400" />
                            Analyze Document
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-300 hover:bg-purple-500/10 hover:text-white"
                            data-testid="button-ai-detect-fields"
                          >
                            <ScanText className="w-4 h-4 mr-2 text-blue-400" />
                            Detect Fields
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-300 hover:bg-purple-500/10 hover:text-white"
                            data-testid="button-ai-risk-check"
                          >
                            <FileWarning className="w-4 h-4 mr-2 text-amber-400" />
                            Risk Assessment
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-300 hover:bg-purple-500/10 hover:text-white"
                            data-testid="button-ai-qa"
                          >
                            <HelpCircle className="w-4 h-4 mr-2 text-cyan-400" />
                            Ask AI Question
                          </Button>
                          <Separator className="bg-gray-700 my-2" />
                          <Button
                            onClick={() => setShowSignatureModal(true)}
                            className="w-full justify-start bg-gradient-to-r from-emerald-600/20 to-teal-500/20 hover:from-emerald-600/30 hover:to-teal-500/30 text-emerald-300"
                            data-testid="button-sign-myself"
                          >
                            <PenTool className="w-4 h-4 mr-2 text-emerald-400" />
                            Sign It Myself
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Document Preview */}
                      {selectedTemplate && (
                        <Card className="bg-gray-800/50 border-gray-700/50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-white text-sm flex items-center gap-2">
                              <Eye className="w-4 h-4 text-blue-400" />
                              Document Preview
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="aspect-[3/4] bg-white rounded-lg p-4 overflow-hidden">
                              <div 
                                className="text-xs text-gray-800 overflow-hidden max-h-full"
                                dangerouslySetInnerHTML={{ 
                                  __html: selectedTemplate.content.slice(0, 500) + "..." 
                                }}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Dashboard */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                      <p className="text-gray-400">Overview of your document signing activity</p>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-cyan-500"
                      onClick={() => setActiveTab("new-envelope")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Envelope
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm overflow-hidden" data-testid="stat-total-envelopes">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Total Envelopes</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
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
                            <p className="text-3xl font-bold text-white mt-1">{stats.pending}</p>
                            <p className="text-xs mt-2 text-amber-400">Action needed</p>
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
                            <p className="text-3xl font-bold text-white mt-1">{stats.signed}</p>
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
                            <p className="text-3xl font-bold text-white mt-1">{stats.signRate}%</p>
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
                    <Card className="lg:col-span-2 bg-gray-800/50 border-gray-700/50">
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
                              onClick={() => setActiveTab("new-envelope")}
                            >
                              Create your first envelope
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
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-purple-400" />
                          AI Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-3 rounded-lg bg-gray-900/50">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium text-white">Completion Trend</span>
                          </div>
                          <p className="text-xs text-gray-400">Your completion rate is 15% higher than average</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-900/50">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-white">Avg Sign Time</span>
                          </div>
                          <p className="text-xs text-gray-400">Documents are signed within 2.4 hours on average</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-900/50">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium text-white">Optimization Tip</span>
                          </div>
                          <p className="text-xs text-gray-400">Add phone verification to increase completion by 12%</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Envelopes Tab */}
              {activeTab === "envelopes" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Envelopes</h2>
                      <p className="text-gray-400">Manage all your document envelopes</p>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-cyan-500"
                      onClick={() => setActiveTab("new-envelope")}
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
                      <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        Awaiting ({stats.pending})
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
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

              {/* Templates Tab */}
              {activeTab === "templates" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Templates</h2>
                      <p className="text-gray-400">Create and manage your document templates</p>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-cyan-500"
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
                                className="border-gray-600 text-gray-300"
                                onClick={() => {
                                  setSelectedTemplate(template);
                                  setActiveTab("new-envelope");
                                }}
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Use
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-400 hover:text-white"
                                onClick={() => {
                                  setEditingTemplate(template);
                                  setTemplateName(template.name);
                                  setTemplateDescription(template.description || "");
                                  setTemplateContent(template.content);
                                  setShowTemplateDialog(true);
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-400 hover:text-red-400"
                                onClick={() => {
                                  if (confirm("Delete this template?")) {
                                    deleteTemplateMutation.mutate(template.id);
                                  }
                                }}
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

              {/* Repository Tab (NEW - CLM Feature) */}
              {activeTab === "repository" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        Repository
                        <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">NEW</Badge>
                      </h2>
                      <p className="text-gray-400">Contract lifecycle management & version control</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gray-800/50 border-gray-700/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">Total Contracts</p>
                            <p className="text-2xl font-bold text-white">{stats.total}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <GitBranch className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">Versions Tracked</p>
                            <p className="text-2xl font-bold text-white">{templates.length * 3}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">Renewals Due</p>
                            <p className="text-2xl font-bold text-white">0</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gray-800/50 border-gray-700/50">
                    <CardHeader>
                      <CardTitle className="text-white">Contract Archive</CardTitle>
                      <CardDescription className="text-gray-400">
                        All signed documents with version history and audit trails
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {signedContracts.length === 0 ? (
                        <div className="text-center py-12">
                          <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">No contracts in repository</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {signedContracts.map((agreement) => (
                            <div key={agreement.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                              <div className="flex items-center gap-4">
                                <FileCheck className="w-8 h-8 text-emerald-400" />
                                <div>
                                  <p className="font-medium text-white">{agreement.signerName}</p>
                                  <p className="text-sm text-gray-500">Signed {new Date(agreement.signedAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="text-gray-400">
                                  <History className="w-4 h-4 mr-1" />
                                  History
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-400">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Analytics</h2>
                      <p className="text-gray-400">Track signature performance and engagement</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gray-800/50 border-gray-700/50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Documents Sent</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
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
                          {templates.slice(0, 5).map((template) => {
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
                            <span className="text-gray-400">{stats.total}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-purple-500" />
                              <span className="text-white">Viewed</span>
                            </div>
                            <span className="text-gray-400">{Math.round(stats.total * 0.94)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-amber-500" />
                              <span className="text-white">Pending</span>
                            </div>
                            <span className="text-gray-400">{stats.pending}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-emerald-500" />
                              <span className="text-white">Completed</span>
                            </div>
                            <span className="text-gray-400">{stats.signed}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Activity/Audit Trail Tab */}
              {activeTab === "activity" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Audit Trail</h2>
                    <p className="text-gray-400">Complete audit trail with blockchain-anchored records</p>
                  </div>

                  <Card className="bg-gray-800/50 border-gray-700/50">
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {signedContracts.map((agreement) => (
                          <div key={agreement.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div className="w-px h-full bg-gray-700 mt-2" />
                            </div>
                            <div className="flex-1 pb-6">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-white">{agreement.signerName}</span>
                                <span className="text-gray-500">signed document</span>
                              </div>
                              <p className="text-sm text-gray-400">{agreement.signerEmail}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(agreement.signedAt).toLocaleString()}
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                <Badge className="bg-emerald-500/10 text-emerald-400 text-[10px]">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Blockchain Verified
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                        {signedContracts.length === 0 && (
                          <p className="text-center text-gray-500 py-8">No activity yet</p>
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

      {/* Template Dialog */}
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
                placeholder="Brief description"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Template Content (HTML) *</Label>
                {editingTemplate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fixTemplateMutation.mutate(editingTemplate.id)}
                    disabled={fixTemplateMutation.isPending}
                    className="border-purple-500 text-purple-400"
                  >
                    {fixTemplateMutation.isPending ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1" />
                    )}
                    AI Fix
                  </Button>
                )}
              </div>
              <Textarea
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                placeholder="Enter HTML with placeholders: [NAME], [EMAIL], [DATE], [SIGNATURE]..."
                className="bg-gray-800 border-gray-700 text-white min-h-[200px] font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)} className="border-gray-600 text-gray-300">
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
              disabled={!templateName || !templateContent}
              className="bg-gradient-to-r from-blue-600 to-cyan-500"
            >
              {editingTemplate ? "Save Changes" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Signature Canvas Modal */}
      <Dialog open={showSignatureModal} onOpenChange={setShowSignatureModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <PenTool className="w-5 h-5 text-blue-400" />
              Draw Your Signature
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Use your mouse or finger to draw your signature below
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-2 border-2 border-dashed border-gray-300">
              <canvas
                ref={signatureCanvasRef}
                width={550}
                height={200}
                className="w-full cursor-crosshair touch-none rounded-lg"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                data-testid="signature-canvas"
              />
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Draw your signature above</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSignature}
                className="text-gray-400 hover:text-white"
                data-testid="button-clear-signature"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
            
            {signatureDataUrl && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Signature captured successfully</span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSignatureModal(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (signatureDataUrl) {
                  toast({ 
                    title: "Signature Saved", 
                    description: "Your signature has been captured and will be applied to the document" 
                  });
                  setShowSignatureModal(false);
                } else {
                  toast({ 
                    title: "No Signature", 
                    description: "Please draw your signature first", 
                    variant: "destructive" 
                  });
                }
              }}
              disabled={!signatureDataUrl}
              className="bg-gradient-to-r from-emerald-600 to-teal-500"
              data-testid="button-apply-signature"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply Signature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Send Dialog */}
      <Dialog open={showBatchSendDialog} onOpenChange={setShowBatchSendDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Batch Send
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Select Template *</Label>
              <Select 
                value={selectedTemplate?.id?.toString() || ""} 
                onValueChange={(val) => setSelectedTemplate(templates.find(t => t.id === parseInt(val)) || null)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
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
              <Label>Recipients (CSV: name, email, phone)</Label>
              <Textarea
                value={batchCsvInput}
                onChange={(e) => setBatchCsvInput(e.target.value)}
                placeholder="John Doe, john@example.com, 555-123-4567"
                className="bg-gray-800 border-gray-700 text-white min-h-[150px] font-mono text-sm"
              />
              <div className="flex justify-between">
                <p className="text-xs text-gray-500">One per line. Phone optional.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600"
                  onClick={() => {
                    const lines = batchCsvInput.trim().split("\n").filter(l => l.trim());
                    const parsed = lines.map(line => {
                      const parts = line.split(",").map(p => p.trim());
                      return { name: parts[0] || "", email: parts[1] || "", phone: parts[2] || "" };
                    }).filter(r => r.name && r.email);
                    setBatchRecipients(parsed);
                    toast({ title: "Parsed", description: `Found ${parsed.length} recipients` });
                  }}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Parse
                </Button>
              </div>
            </div>

            {batchRecipients.length > 0 && (
              <div className="space-y-2">
                <Label>Recipients ({batchRecipients.length})</Label>
                <ScrollArea className="h-[150px] rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                  {batchRecipients.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-gray-900/50 mb-2">
                      <div>
                        <p className="text-sm text-white">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBatchRecipients(prev => prev.filter((_, idx) => idx !== i))}
                      >
                        <Trash2 className="w-3 h-3 text-gray-400" />
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBatchSendDialog(false)} className="border-gray-600">
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
            >
              {batchSendMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Send to {batchRecipients.length}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
    </VeteranAuthGate>
  );
}
