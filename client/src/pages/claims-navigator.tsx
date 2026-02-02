import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { VeteranAuthGate } from "@/components/veteran-auth-gate";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Shield,
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Upload,
  Plus,
  ChevronRight,
  ChevronLeft,
  Target,
  Calendar,
  Users,
  FolderOpen,
  MessageSquare,
  FileUp,
  Loader2,
  Award,
  Briefcase,
  ArrowRight,
  Check,
  X,
  Eye,
  Download,
  Share2,
  Trash2,
  BarChart3,
  Lightbulb,
  TrendingUp,
  Star,
  ClipboardList,
  CheckSquare,
  Zap,
  User,
} from "lucide-react";

type WizardStep = "track" | "type" | "evidence" | "review" | "dashboard";
type Track = "va" | "ssdi";
type VAClaimType = "new" | "increase" | "appeal";
type SSDIClaimType = "apply" | "reconsideration" | "alj";
type EvidenceLevel = "none" | "some" | "a_lot";

interface ClaimCase {
  id: number;
  title: string;
  caseType: Track;
  claimType: string;
  status: string;
  createdAt: string;
}

interface ClaimTask {
  id: number;
  title: string;
  description: string | null;
  status: "todo" | "doing" | "done";
  dueDate: string | null;
  sortOrder: number;
}

interface CaseDeadline {
  id: number;
  title: string;
  description: string | null;
  dueDate: string;
  status: "open" | "at_risk" | "late" | "done";
}

interface CaseNote {
  id: number;
  authorEmail: string;
  authorType: string;
  content: string;
  createdAt: string;
}

interface CaseShare {
  id: number;
  caseId: number;
  email: string;
  role: "view" | "comment" | "upload";
  createdAt: string;
}

interface ClaimFile {
  id: number;
  filename: string;
  originalName: string;
  category: string | null;
  createdAt: string;
}

const VA_CLAIM_TYPES = [
  { id: "new", label: "New Claim", description: "Filing a new disability claim with the VA", icon: Plus },
  { id: "increase", label: "Rating Increase", description: "Your condition has worsened since last rating", icon: Target },
  { id: "appeal", label: "Appeal/Review", description: "Appealing a denied claim or decision", icon: Shield },
];

const SSDI_CLAIM_TYPES = [
  { id: "apply", label: "Initial Application", description: "Applying for SSDI benefits for the first time", icon: FileText },
  { id: "reconsideration", label: "Reconsideration", description: "Requesting reconsideration of a denial", icon: Target },
  { id: "alj", label: "ALJ Hearing Prep", description: "Preparing for Administrative Law Judge hearing", icon: Briefcase },
];

const EVIDENCE_LEVELS = [
  { id: "none", label: "Starting Fresh", description: "I haven't gathered any evidence yet", icon: Circle },
  { id: "some", label: "Some Evidence", description: "I have some medical records or statements", icon: Clock },
  { id: "a_lot", label: "Well Documented", description: "I have extensive records and statements", icon: CheckCircle2 },
];

function generateTasks(track: Track, claimType: string, evidenceLevel: EvidenceLevel): Omit<ClaimTask, "id">[] {
  const baseTasks: Omit<ClaimTask, "id">[] = [];
  let sortOrder = 0;

  if (track === "va") {
    baseTasks.push({
      title: "Gather Service Records",
      description: "Request your DD-214 and service treatment records from the National Archives",
      status: "todo",
      dueDate: null,
      sortOrder: sortOrder++,
    });

    if (evidenceLevel === "none" || evidenceLevel === "some") {
      baseTasks.push({
        title: "Request Medical Records",
        description: "Obtain copies of all relevant medical records from VA and private providers",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
    }

    baseTasks.push({
      title: "Document Current Symptoms",
      description: "Create a detailed list of how your condition affects your daily life",
      status: "todo",
      dueDate: null,
      sortOrder: sortOrder++,
    });

    if (claimType === "new") {
      baseTasks.push({
        title: "Establish Service Connection",
        description: "Gather evidence linking your condition to military service",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
      baseTasks.push({
        title: "Obtain Buddy Statements",
        description: "Get written statements from fellow service members who witnessed your condition",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
    }

    if (claimType === "increase") {
      baseTasks.push({
        title: "Document Worsening Symptoms",
        description: "Compare current symptoms to your last rating decision",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
      baseTasks.push({
        title: "Get Updated Medical Opinion",
        description: "Obtain a current medical evaluation documenting severity",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
    }

    if (claimType === "appeal") {
      baseTasks.push({
        title: "Review Denial Letter",
        description: "Carefully read the denial reasons and identify missing evidence",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
      baseTasks.push({
        title: "Choose Appeal Lane",
        description: "Select HLR, Supplemental Claim, or Board Appeal based on your situation",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
      baseTasks.push({
        title: "Gather New Evidence",
        description: "Collect any new evidence that addresses the denial reasons",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
    }

    baseTasks.push({
      title: "Complete VA Form 21-526EZ",
      description: "Fill out the disability compensation claim form",
      status: "todo",
      dueDate: null,
      sortOrder: sortOrder++,
    });

    if (evidenceLevel !== "a_lot") {
      baseTasks.push({
        title: "Consider Nexus Letter",
        description: "A medical professional's opinion linking your condition to service",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
    }
  } else {
    baseTasks.push({
      title: "Gather Work History",
      description: "Document your last 15 years of employment including job duties",
      status: "todo",
      dueDate: null,
      sortOrder: sortOrder++,
    });

    baseTasks.push({
      title: "Collect Medical Records",
      description: "Obtain all medical records documenting your disability",
      status: "todo",
      dueDate: null,
      sortOrder: sortOrder++,
    });

    if (claimType === "apply") {
      baseTasks.push({
        title: "Complete SSA-16 Application",
        description: "Fill out the official SSDI application",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
      baseTasks.push({
        title: "List All Medical Providers",
        description: "Create a complete list of doctors, hospitals, and clinics",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
    }

    if (claimType === "reconsideration") {
      baseTasks.push({
        title: "Review Initial Denial",
        description: "Understand why your application was denied",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
      baseTasks.push({
        title: "Submit New Medical Evidence",
        description: "Provide additional documentation of your disability",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
    }

    if (claimType === "alj") {
      baseTasks.push({
        title: "Prepare Hearing Brief",
        description: "Create a summary document for the Administrative Law Judge",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
      baseTasks.push({
        title: "Gather Witness List",
        description: "Identify people who can testify about your disability",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
      baseTasks.push({
        title: "Practice Testimony",
        description: "Prepare answers to common ALJ questions",
        status: "todo",
        dueDate: null,
        sortOrder: sortOrder++,
      });
    }

    baseTasks.push({
      title: "Document Daily Limitations",
      description: "Create a detailed function report of how disability affects daily activities",
      status: "todo",
      dueDate: null,
      sortOrder: sortOrder++,
    });
  }

  baseTasks.push({
    title: "Review All Documents",
    description: "Double-check all forms and evidence before submission",
    status: "todo",
    dueDate: null,
    sortOrder: sortOrder++,
  });

  return baseTasks;
}

export default function ClaimsNavigator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState<WizardStep>("track");
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedClaimType, setSelectedClaimType] = useState<string | null>(null);
  const [selectedEvidenceLevel, setSelectedEvidenceLevel] = useState<EvidenceLevel | null>(null);
  const [activeCaseId, setActiveCaseId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("tasks");
  const [newNote, setNewNote] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [shareRole, setShareRole] = useState<"view" | "comment" | "upload">("view");


  const { data: myCases, isLoading: casesLoading } = useQuery({
    queryKey: ["/api/claims/cases"],
    queryFn: async () => {
      const res = await fetch("/api/claims/cases", { credentials: "include" });
      if (!res.ok) return [];
      return res.json() as Promise<ClaimCase[]>;
    },
  });

  const { data: activeCase } = useQuery({
    queryKey: ["/api/claims/cases", activeCaseId],
    queryFn: async () => {
      if (!activeCaseId) return null;
      const res = await fetch(`/api/claims/cases/${activeCaseId}`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!activeCaseId,
  });

  const { data: caseTasks } = useQuery({
    queryKey: ["/api/claims/cases", activeCaseId, "tasks"],
    queryFn: async () => {
      if (!activeCaseId) return [];
      const res = await fetch(`/api/claims/cases/${activeCaseId}/tasks`, { credentials: "include" });
      if (!res.ok) return [];
      return res.json() as Promise<ClaimTask[]>;
    },
    enabled: !!activeCaseId,
  });

  const { data: caseDeadlines } = useQuery({
    queryKey: ["/api/claims/cases", activeCaseId, "deadlines"],
    queryFn: async () => {
      if (!activeCaseId) return [];
      const res = await fetch(`/api/claims/cases/${activeCaseId}/deadlines`, { credentials: "include" });
      if (!res.ok) return [];
      return res.json() as Promise<CaseDeadline[]>;
    },
    enabled: !!activeCaseId,
  });

  const { data: caseNotes } = useQuery({
    queryKey: ["/api/claims/cases", activeCaseId, "notes"],
    queryFn: async () => {
      if (!activeCaseId) return [];
      const res = await fetch(`/api/claims/cases/${activeCaseId}/notes`, { credentials: "include" });
      if (!res.ok) return [];
      return res.json() as Promise<CaseNote[]>;
    },
    enabled: !!activeCaseId,
  });

  const { data: caseFiles } = useQuery({
    queryKey: ["/api/claims/cases", activeCaseId, "files"],
    queryFn: async () => {
      if (!activeCaseId) return [];
      const res = await fetch(`/api/claims/cases/${activeCaseId}/files`, { credentials: "include" });
      if (!res.ok) return [];
      return res.json() as Promise<ClaimFile[]>;
    },
    enabled: !!activeCaseId,
  });

  const { data: caseShares } = useQuery({
    queryKey: ["/api/claims/cases", activeCaseId, "shares"],
    queryFn: async () => {
      if (!activeCaseId) return [];
      const res = await fetch(`/api/claims/cases/${activeCaseId}/shares`, { credentials: "include" });
      if (!res.ok) return [];
      return res.json() as Promise<CaseShare[]>;
    },
    enabled: !!activeCaseId,
  });

  const { data: completenessData } = useQuery({
    queryKey: ["/api/claims/cases", activeCaseId, "completeness"],
    queryFn: async () => {
      if (!activeCaseId) return null;
      const res = await fetch(`/api/claims/cases/${activeCaseId}/completeness`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!activeCaseId,
  });

  const { data: strengthData } = useQuery({
    queryKey: ["/api/claims/cases", activeCaseId, "strength"],
    queryFn: async () => {
      if (!activeCaseId) return null;
      const res = await fetch(`/api/claims/cases/${activeCaseId}/strength`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!activeCaseId,
  });

  const { data: laneData } = useQuery({
    queryKey: ["/api/claims/cases", activeCaseId, "lane-recommendation"],
    queryFn: async () => {
      if (!activeCaseId) return null;
      const res = await fetch(`/api/claims/cases/${activeCaseId}/lane-recommendation`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!activeCaseId,
  });

  const { data: heatmapData } = useQuery({
    queryKey: ["/api/claims/cases", activeCaseId, "heatmap"],
    queryFn: async () => {
      if (!activeCaseId) return null;
      const res = await fetch(`/api/claims/cases/${activeCaseId}/heatmap`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!activeCaseId,
  });

  const { data: suggestionsData } = useQuery({
    queryKey: ["/api/claims/cases", activeCaseId, "suggestions"],
    queryFn: async () => {
      if (!activeCaseId) return null;
      const res = await fetch(`/api/claims/cases/${activeCaseId}/suggestions`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!activeCaseId,
  });

  const { data: vendorScorecardsData } = useQuery({
    queryKey: ["/api/claims/cases", activeCaseId, "vendor-scorecards"],
    queryFn: async () => {
      if (!activeCaseId) return null;
      const res = await fetch(`/api/claims/cases/${activeCaseId}/vendor-scorecards`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!activeCaseId,
  });

  const { data: laneConfidenceData } = useQuery({
    queryKey: ["/api/claims/cases", activeCaseId, "lane-confidence"],
    queryFn: async () => {
      if (!activeCaseId) return null;
      const res = await fetch(`/api/claims/cases/${activeCaseId}/lane-confidence`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!activeCaseId,
  });

  const { data: uploadChecklistData } = useQuery({
    queryKey: ["/api/claims/cases", activeCaseId, "upload-checklist"],
    queryFn: async () => {
      if (!activeCaseId) return null;
      const res = await fetch(`/api/claims/cases/${activeCaseId}/upload-checklist`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!activeCaseId,
  });

  const createShareMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const res = await apiRequest("POST", `/api/claims/cases/${activeCaseId}/shares`, { email, role });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Access Granted", description: "Vendor has been invited to view this case." });
      setShareEmail("");
      setShareRole("view");
      queryClient.invalidateQueries({ queryKey: ["/api/claims/cases", activeCaseId, "shares"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to share case", variant: "destructive" });
    },
  });

  const deleteShareMutation = useMutation({
    mutationFn: async (shareId: number) => {
      const res = await apiRequest("DELETE", `/api/claims/shares/${shareId}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Access Removed", description: "Vendor access has been revoked." });
      queryClient.invalidateQueries({ queryKey: ["/api/claims/cases", activeCaseId, "shares"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove access", variant: "destructive" });
    },
  });

  const createCaseMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTrack || !selectedClaimType || !selectedEvidenceLevel) {
        throw new Error("Missing required fields");
      }
      const title = selectedTrack === "va" 
        ? `VA ${selectedClaimType === "new" ? "New Claim" : selectedClaimType === "increase" ? "Rating Increase" : "Appeal"}`
        : `SSDI ${selectedClaimType === "apply" ? "Application" : selectedClaimType === "reconsideration" ? "Reconsideration" : "ALJ Hearing"}`;
      
      const tasks = generateTasks(selectedTrack, selectedClaimType, selectedEvidenceLevel);
      
      const res = await apiRequest("POST", "/api/claims/cases", {
        title,
        caseType: selectedTrack,
        claimType: selectedClaimType,
        tasks,
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Case Created", description: "Your personalized plan is ready!" });
      setActiveCaseId(data.id);
      setStep("dashboard");
      queryClient.invalidateQueries({ queryKey: ["/api/claims/cases"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create case", variant: "destructive" });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/claims/tasks/${taskId}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/claims/cases", activeCaseId, "tasks"] });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", `/api/claims/cases/${activeCaseId}/notes`, { content });
      return res.json();
    },
    onSuccess: () => {
      setNewNote("");
      queryClient.invalidateQueries({ queryKey: ["/api/claims/cases", activeCaseId, "notes"] });
      toast({ title: "Note Added" });
    },
  });

  const completedTasks = caseTasks?.filter(t => t.status === "done").length || 0;
  const totalTasks = caseTasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getStepNumber = () => {
    switch (step) {
      case "track": return 1;
      case "type": return 2;
      case "evidence": return 3;
      case "review": return 4;
      default: return 0;
    }
  };

  if (myCases && myCases.length > 0 && step !== "dashboard" && !activeCaseId) {
    return (
      <Layout>
        <VeteranAuthGate serviceName="Claims Navigator">
          <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full mb-4">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">CLAIMS NAVIGATOR</span>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-4">Your Active Cases</h1>
                  <p className="text-slate-400">Continue working on an existing case or start a new one</p>
                </div>

                <div className="grid gap-4 mb-8">
                  {myCases.map((c) => (
                    <Card 
                      key={c.id} 
                      className="bg-slate-800/50 border-slate-700 hover:border-amber-500/50 cursor-pointer transition-all"
                      onClick={() => { setActiveCaseId(c.id); setStep("dashboard"); }}
                      data-testid={`case-card-${c.id}`}
                    >
                      <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${c.caseType === "va" ? "bg-blue-500/20" : "bg-purple-500/20"}`}>
                            {c.caseType === "va" ? (
                              <Shield className="w-6 h-6 text-blue-400" />
                            ) : (
                              <Briefcase className="w-6 h-6 text-purple-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                            <p className="text-sm text-slate-400">
                              Created {new Date(c.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={c.status === "active" ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"}>
                            {c.status}
                          </Badge>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button 
                  onClick={() => setStep("track")}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-6"
                  data-testid="start-new-case-btn"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Start New Case
                </Button>
              </div>
            </div>
          </div>
        </VeteranAuthGate>
      </Layout>
    );
  }

  if (step === "dashboard" && activeCaseId) {
    return (
      <Layout>
        <VeteranAuthGate serviceName="Claims Navigator">
          <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <Button 
                      variant="ghost" 
                      className="text-slate-400 hover:text-white mb-2"
                      onClick={() => { setActiveCaseId(null); setStep("track"); }}
                      data-testid="back-to-cases-btn"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back to Cases
                    </Button>
                    <h1 className="text-3xl font-bold text-white">{activeCase?.title || "Loading..."}</h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Progress</p>
                      <p className="text-2xl font-bold text-amber-400">{progress}%</p>
                    </div>
                    <div className="w-32">
                      <Progress value={progress} className="h-3 bg-slate-700" />
                    </div>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="bg-slate-800/50 border border-slate-700 p-1">
                    <TabsTrigger value="tasks" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Tasks ({caseTasks?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Documents ({caseFiles?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Timeline
                    </TabsTrigger>
                    <TabsTrigger value="deadlines" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                      <Calendar className="w-4 h-4 mr-2" />
                      Deadlines ({caseDeadlines?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="sharing" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                      <Users className="w-4 h-4 mr-2" />
                      Sharing
                    </TabsTrigger>
                    <TabsTrigger value="analysis" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                      <Target className="w-4 h-4 mr-2" />
                      Analysis
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="tasks" className="space-y-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Target className="w-5 h-5 text-amber-400" />
                          Your Personalized Checklist
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Complete these tasks to build the strongest possible case
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[500px] pr-4">
                          <div className="space-y-3">
                            {caseTasks?.sort((a, b) => a.sortOrder - b.sortOrder).map((task) => (
                              <div
                                key={task.id}
                                className={`p-4 rounded-lg border transition-all ${
                                  task.status === "done"
                                    ? "bg-green-500/10 border-green-500/30"
                                    : task.status === "doing"
                                    ? "bg-amber-500/10 border-amber-500/30"
                                    : "bg-slate-700/50 border-slate-600"
                                }`}
                                data-testid={`task-item-${task.id}`}
                              >
                                <div className="flex items-start gap-4">
                                  <button
                                    onClick={() => {
                                      const nextStatus = task.status === "todo" ? "doing" : task.status === "doing" ? "done" : "todo";
                                      updateTaskMutation.mutate({ taskId: task.id, status: nextStatus });
                                    }}
                                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                      task.status === "done"
                                        ? "bg-green-500 border-green-500"
                                        : task.status === "doing"
                                        ? "bg-amber-500 border-amber-500"
                                        : "border-slate-500 hover:border-amber-400"
                                    }`}
                                    data-testid={`task-toggle-${task.id}`}
                                  >
                                    {task.status === "done" && <Check className="w-4 h-4 text-white" />}
                                    {task.status === "doing" && <Clock className="w-3 h-3 text-white" />}
                                  </button>
                                  <div className="flex-1">
                                    <h4 className={`font-medium ${task.status === "done" ? "text-green-400 line-through" : "text-white"}`}>
                                      {task.title}
                                    </h4>
                                    {task.description && (
                                      <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                                    )}
                                  </div>
                                  <Badge className={
                                    task.status === "done" ? "bg-green-500/20 text-green-400" :
                                    task.status === "doing" ? "bg-amber-500/20 text-amber-400" :
                                    "bg-slate-500/20 text-slate-400"
                                  }>
                                    {task.status === "todo" ? "To Do" : task.status === "doing" ? "In Progress" : "Complete"}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <FolderOpen className="w-5 h-5 text-amber-400" />
                          Document Center
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Upload and organize your evidence and supporting documents
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center mb-6">
                          <FileUp className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                          <p className="text-slate-400 mb-4">Drag and drop files here or click to upload</p>
                          <Button className="bg-amber-500 hover:bg-amber-600 text-black" data-testid="upload-file-btn">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Documents
                          </Button>
                        </div>
                        
                        {caseFiles && caseFiles.length > 0 ? (
                          <div className="space-y-2">
                            {caseFiles.map((file) => (
                              <div key={file.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-amber-400" />
                                  <div>
                                    <p className="text-white font-medium">{file.originalName}</p>
                                    <p className="text-xs text-slate-400">{new Date(file.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-slate-500">No documents uploaded yet</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-amber-400" />
                          Case Timeline
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Track all activity and add notes to your case
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-6">
                          <Label className="text-white mb-2 block">Add a Note</Label>
                          <div className="flex gap-2">
                            <Textarea
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              placeholder="Add a note about your case progress..."
                              className="bg-slate-700 border-slate-600 text-white flex-1"
                              data-testid="note-input"
                            />
                            <Button 
                              onClick={() => newNote && addNoteMutation.mutate(newNote)}
                              disabled={!newNote || addNoteMutation.isPending}
                              className="bg-amber-500 hover:bg-amber-600 text-black"
                              data-testid="add-note-btn"
                            >
                              {addNoteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>

                        <ScrollArea className="h-[400px]">
                          <div className="space-y-4">
                            {caseNotes?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((note) => (
                              <div key={note.id} className="flex gap-4 p-4 bg-slate-700/50 rounded-lg">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${note.authorType === "veteran" ? "bg-blue-500/20" : "bg-purple-500/20"}`}>
                                  {note.authorType === "veteran" ? (
                                    <Award className="w-5 h-5 text-blue-400" />
                                  ) : (
                                    <Users className="w-5 h-5 text-purple-400" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-white font-medium">{note.authorEmail}</span>
                                    <Badge className="bg-slate-600 text-slate-300 text-xs">{note.authorType}</Badge>
                                    <span className="text-xs text-slate-500">
                                      {new Date(note.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-slate-300">{note.content}</p>
                                </div>
                              </div>
                            ))}
                            {(!caseNotes || caseNotes.length === 0) && (
                              <p className="text-center text-slate-500 py-8">No notes yet. Add the first one above!</p>
                            )}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="deadlines" className="space-y-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-amber-400" />
                          Important Deadlines
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Track critical dates for your claim
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {caseDeadlines && caseDeadlines.length > 0 ? (
                          <div className="space-y-3">
                            {caseDeadlines.map((deadline) => (
                              <div key={deadline.id} className={`p-4 rounded-lg border ${
                                deadline.status === "late" ? "bg-red-500/10 border-red-500/30" :
                                deadline.status === "at_risk" ? "bg-amber-500/10 border-amber-500/30" :
                                deadline.status === "done" ? "bg-green-500/10 border-green-500/30" :
                                "bg-slate-700/50 border-slate-600"
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="text-white font-medium">{deadline.title}</h4>
                                    {deadline.description && (
                                      <p className="text-sm text-slate-400">{deadline.description}</p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className={`font-bold ${
                                      deadline.status === "late" ? "text-red-400" :
                                      deadline.status === "at_risk" ? "text-amber-400" :
                                      "text-white"
                                    }`}>
                                      {new Date(deadline.dueDate).toLocaleDateString()}
                                    </p>
                                    <Badge className={
                                      deadline.status === "late" ? "bg-red-500/20 text-red-400" :
                                      deadline.status === "at_risk" ? "bg-amber-500/20 text-amber-400" :
                                      deadline.status === "done" ? "bg-green-500/20 text-green-400" :
                                      "bg-slate-500/20 text-slate-400"
                                    }>
                                      {deadline.status === "at_risk" ? "At Risk" : deadline.status.charAt(0).toUpperCase() + deadline.status.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                            <p className="text-slate-400">No deadlines set yet</p>
                            <Button className="mt-4 bg-amber-500 hover:bg-amber-600 text-black" data-testid="add-deadline-btn">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Deadline
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="sharing" className="space-y-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Share2 className="w-5 h-5 text-amber-400" />
                          Case Sharing
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Share your case with trusted vendors or representatives. You control what they can see.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                          <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                            <div>
                              <h4 className="text-blue-400 font-medium">You Own This Case</h4>
                              <p className="text-sm text-slate-300">
                                Vendors can only view, comment, or upload what you explicitly allow. They cannot delete your data or take control of your case.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <Label className="text-white mb-2 block">Invite Someone</Label>
                          <div className="flex gap-2 flex-wrap">
                            <Input
                              type="email"
                              placeholder="Enter email address..."
                              value={shareEmail}
                              onChange={(e) => setShareEmail(e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white flex-1 min-w-[200px]"
                              data-testid="share-email-input"
                            />
                            <select
                              value={shareRole}
                              onChange={(e) => setShareRole(e.target.value as "view" | "comment" | "upload")}
                              className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                              data-testid="share-role-select"
                            >
                              <option value="view">View Only</option>
                              <option value="comment">View + Comment</option>
                              <option value="upload">View + Upload</option>
                            </select>
                            <Button 
                              onClick={() => {
                                if (shareEmail.trim()) {
                                  createShareMutation.mutate({ email: shareEmail.trim(), role: shareRole });
                                }
                              }}
                              disabled={!shareEmail.trim() || createShareMutation.isPending}
                              className="bg-amber-500 hover:bg-amber-600 text-black" 
                              data-testid="share-invite-btn"
                            >
                              {createShareMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Users className="w-4 h-4 mr-2" />
                              )}
                              Invite
                            </Button>
                          </div>
                        </div>

                        {caseShares && caseShares.length > 0 ? (
                          <div className="space-y-3">
                            <h4 className="text-white font-medium">People with Access</h4>
                            {caseShares.map((share) => (
                              <div 
                                key={share.id} 
                                className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3"
                                data-testid={`share-item-${share.id}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                                    <Users className="w-4 h-4 text-slate-300" />
                                  </div>
                                  <div>
                                    <p className="text-white text-sm">{share.email}</p>
                                    <Badge variant="outline" className={
                                      share.role === "upload" ? "border-green-500 text-green-400" :
                                      share.role === "comment" ? "border-blue-500 text-blue-400" :
                                      "border-slate-500 text-slate-400"
                                    }>
                                      {share.role === "view" && <Eye className="w-3 h-3 mr-1" />}
                                      {share.role === "comment" && <MessageSquare className="w-3 h-3 mr-1" />}
                                      {share.role === "upload" && <Upload className="w-3 h-3 mr-1" />}
                                      {share.role === "view" ? "View Only" : share.role === "comment" ? "Can Comment" : "Can Upload"}
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteShareMutation.mutate(share.id)}
                                  disabled={deleteShareMutation.isPending}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                  data-testid={`share-remove-${share.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                            <p className="text-slate-400">No one else has access to this case</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="analysis" className="space-y-4">
                    {/* Testing Disclaimer Notice */}
                    <div className="bg-amber-900/30 border border-amber-500/40 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-amber-200 font-medium">Analysis Disclaimer</p>
                          <p className="text-amber-100/70 mt-1">
                            This analysis is for informational purposes only and is generated by a testing system. Results may be preliminary, incomplete, or subject to change. Do not rely on this analysis as a substitute for professional legal, medical, or benefits advice. Consult qualified professionals before making decisions.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Document Completeness Card */}
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-amber-400" />
                          Document Completeness
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Required evidence for your {activeCase?.caseType?.toUpperCase()} claim
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {completenessData ? (
                          <>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  completenessData.stats.percentComplete >= 100 ? "bg-green-500/20" :
                                  completenessData.stats.percentComplete >= 50 ? "bg-amber-500/20" :
                                  "bg-red-500/20"
                                }`}>
                                  <span className={`text-xl font-bold ${
                                    completenessData.stats.percentComplete >= 100 ? "text-green-400" :
                                    completenessData.stats.percentComplete >= 50 ? "text-amber-400" :
                                    "text-red-400"
                                  }`}>
                                    {completenessData.stats.percentComplete}%
                                  </span>
                                </div>
                                <div>
                                  <p className="text-white font-medium">
                                    {completenessData.stats.completedRequired} of {completenessData.stats.totalRequired} required documents
                                  </p>
                                  <p className="text-sm text-slate-400">
                                    {completenessData.stats.percentComplete >= 100 
                                      ? "All required evidence present" 
                                      : "Some evidence still needed"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <Progress 
                              value={completenessData.stats.percentComplete} 
                              className="h-2 bg-slate-700 mb-4" 
                            />
                            <div className="space-y-2">
                              {completenessData.results.map((item: any, idx: number) => (
                                <div 
                                  key={idx} 
                                  className={`flex items-center justify-between p-3 rounded-lg ${
                                    item.status === "present" ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"
                                  }`}
                                  data-testid={`completeness-item-${idx}`}
                                >
                                  <div className="flex items-center gap-3">
                                    {item.status === "present" ? (
                                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                                    ) : (
                                      <AlertTriangle className="w-5 h-5 text-red-400" />
                                    )}
                                    <div>
                                      <p className={item.status === "present" ? "text-green-300" : "text-red-300"}>
                                        {item.requirement.label}
                                      </p>
                                      {item.requirement.description && (
                                        <p className="text-xs text-slate-400">{item.requirement.description}</p>
                                      )}
                                    </div>
                                  </div>
                                  <Badge variant="outline" className={
                                    item.status === "present" ? "border-green-500 text-green-400" : "border-red-500 text-red-400"
                                  }>
                                    {item.status === "present" ? `${item.matchingFiles} file${item.matchingFiles > 1 ? "s" : ""}` : "Missing"}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <Loader2 className="w-8 h-8 text-slate-500 mx-auto mb-4 animate-spin" />
                            <p className="text-slate-400">Analyzing your documents...</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Evidence Strength Card */}
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-400" />
                          Evidence Strength
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          How strong is your evidentiary support?
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {strengthData ? (
                          <>
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                  strengthData.overallStrength >= 4 ? "bg-green-500/20" :
                                  strengthData.overallStrength >= 2.5 ? "bg-amber-500/20" :
                                  "bg-red-500/20"
                                }`}>
                                  <span className={`text-2xl font-bold ${
                                    strengthData.overallStrength >= 4 ? "text-green-400" :
                                    strengthData.overallStrength >= 2.5 ? "text-amber-400" :
                                    "text-red-400"
                                  }`}>
                                    {strengthData.overallStrength.toFixed(1)}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-white font-medium text-lg">Overall Strength Score</p>
                                  <p className="text-sm text-slate-400">
                                    Based on {strengthData.scoredFiles} of {strengthData.totalFiles} files
                                  </p>
                                </div>
                              </div>
                              {strengthData.hasNexusLetter && (
                                <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                                  <Check className="w-3 h-3 mr-1" /> Nexus Letter Present
                                </Badge>
                              )}
                            </div>
                            
                            {strengthData.conditionStrengths && strengthData.conditionStrengths.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="text-white font-medium">Strength by Condition</h4>
                                {strengthData.conditionStrengths.map((cs: any, idx: number) => (
                                  <div key={idx} className="bg-slate-700/50 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-white">{cs.condition}</span>
                                      <span className={`font-medium ${
                                        cs.avgStrength >= 4 ? "text-green-400" :
                                        cs.avgStrength >= 2.5 ? "text-amber-400" :
                                        "text-red-400"
                                      }`}>
                                        {cs.avgStrength.toFixed(1)} / 5
                                      </span>
                                    </div>
                                    <Progress value={(cs.avgStrength / 5) * 100} className="h-2 bg-slate-600" />
                                    <p className="text-xs text-slate-400 mt-1">{cs.fileCount} supporting file{cs.fileCount > 1 ? "s" : ""}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(!strengthData.conditionStrengths || strengthData.conditionStrengths.length === 0) && (
                              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <p className="text-blue-300 text-sm">
                                  Tag your documents with conditions to see strength analysis by condition.
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <Loader2 className="w-8 h-8 text-slate-500 mx-auto mb-4 animate-spin" />
                            <p className="text-slate-400">Calculating evidence strength...</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Lane Recommendation Card (VA only) */}
                    {activeCase?.caseType === "va" && (
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-amber-400" />
                            Lane Recommendation
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            Based on your evidence, here's the recommended appeal path
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {laneData?.applicable ? (
                            <div className="space-y-4">
                              <div className={`p-4 rounded-lg border ${
                                laneData.lane === "Supplemental Claim" ? "bg-green-500/10 border-green-500/30" :
                                laneData.lane === "Higher-Level Review" ? "bg-blue-500/10 border-blue-500/30" :
                                "bg-amber-500/10 border-amber-500/30"
                              }`}>
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className={`text-xl font-bold ${
                                    laneData.lane === "Supplemental Claim" ? "text-green-400" :
                                    laneData.lane === "Higher-Level Review" ? "text-blue-400" :
                                    "text-amber-400"
                                  }`}>
                                    {laneData.lane}
                                  </h3>
                                  <Badge variant="outline" className={
                                    laneData.confidence === "high" ? "border-green-500 text-green-400" :
                                    laneData.confidence === "medium" ? "border-amber-500 text-amber-400" :
                                    "border-slate-500 text-slate-400"
                                  }>
                                    {laneData.confidence} confidence
                                  </Badge>
                                </div>
                                <p className="text-slate-300">{laneData.reason}</p>
                              </div>

                              <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="bg-slate-700/50 rounded-lg p-3">
                                  <p className="text-2xl font-bold text-white">{laneData.strengthAvg?.toFixed(1) || "0"}</p>
                                  <p className="text-xs text-slate-400">Avg Strength</p>
                                </div>
                                <div className="bg-slate-700/50 rounded-lg p-3">
                                  <p className="text-2xl font-bold text-white">{laneData.hasNewEvidence ? "Yes" : "No"}</p>
                                  <p className="text-xs text-slate-400">New Evidence</p>
                                </div>
                                <div className="bg-slate-700/50 rounded-lg p-3">
                                  <p className="text-2xl font-bold text-white">{laneData.hasNexusLetter ? "Yes" : "No"}</p>
                                  <p className="text-xs text-slate-400">Nexus Letter</p>
                                </div>
                              </div>

                              <div className="bg-slate-700/30 rounded-lg p-4">
                                <p className="text-xs text-slate-400">
                                  <strong>Disclaimer:</strong> This recommendation is based on your uploaded evidence and is for informational purposes only. 
                                  It is not legal advice. Consult with a qualified Veterans Service Officer (VSO) or attorney before making decisions about your claim.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Target className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                              <p className="text-slate-400">Upload documents to receive a lane recommendation</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Evidence Heatmap Card */}
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-amber-400" />
                          Evidence Strength Heatmap
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Visual overview of evidence strength by condition and type
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {heatmapData?.heatmap && heatmapData.heatmap.length > 0 ? (
                          <div className="space-y-2">
                            {heatmapData.heatmap.map((h: any, idx: number) => (
                              <div
                                key={idx}
                                className={`flex items-center justify-between p-3 rounded-lg ${
                                  h.avgStrength >= 4 ? "bg-green-500/20 border border-green-500/30" :
                                  h.avgStrength >= 3 ? "bg-amber-500/20 border border-amber-500/30" :
                                  "bg-red-500/20 border border-red-500/30"
                                }`}
                                data-testid={`heatmap-cell-${idx}`}
                              >
                                <div>
                                  <span className={`font-medium ${
                                    h.avgStrength >= 4 ? "text-green-400" :
                                    h.avgStrength >= 3 ? "text-amber-400" :
                                    "text-red-400"
                                  }`}>{h.condition}</span>
                                  <span className="text-slate-400 mx-2">–</span>
                                  <span className="text-slate-300 uppercase text-sm">{h.type}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className="text-slate-400 border-slate-600">
                                    {h.count} file{h.count > 1 ? "s" : ""}
                                  </Badge>
                                  <span className={`font-bold ${
                                    h.avgStrength >= 4 ? "text-green-400" :
                                    h.avgStrength >= 3 ? "text-amber-400" :
                                    "text-red-400"
                                  }`}>{h.avgStrength}/5</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <BarChart3 className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                            <p className="text-slate-400">Upload and tag documents to see the heatmap</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Stage 7: Strength Suggestions - Directly below heatmap */}
                    {suggestionsData?.topSuggestions && suggestionsData.topSuggestions.length > 0 && (
                      <Card className="bg-slate-800/50 border-slate-700 border-l-4 border-l-amber-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-amber-400" />
                            What Would Strengthen This Claim?
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            Actionable suggestions based on your evidence analysis
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {suggestionsData.topSuggestions.map((s: any, idx: number) => (
                              <div
                                key={idx}
                                className={`flex items-start gap-3 p-3 rounded-lg ${
                                  s.priority === "high" ? "bg-red-500/10 border border-red-500/30" :
                                  s.priority === "medium" ? "bg-amber-500/10 border border-amber-500/30" :
                                  "bg-slate-700/30 border border-slate-600"
                                }`}
                                data-testid={`suggestion-${idx}`}
                              >
                                <div className={`mt-0.5 ${
                                  s.priority === "high" ? "text-red-400" :
                                  s.priority === "medium" ? "text-amber-400" :
                                  "text-slate-400"
                                }`}>
                                  <Zap className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className={`text-xs ${
                                      s.priority === "high" ? "border-red-500 text-red-400" :
                                      s.priority === "medium" ? "border-amber-500 text-amber-400" :
                                      "border-slate-500 text-slate-400"
                                    }`}>
                                      {s.priority}
                                    </Badge>
                                    <span className="text-slate-500 text-xs uppercase">{s.type} evidence</span>
                                  </div>
                                  <p className="text-slate-300 text-sm">{s.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Stage 9: Enhanced Lane Confidence with Reasoning */}
                    {laneConfidenceData?.recommendation && (
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-400" />
                            VA Lane Recommendation
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            Decision support based on your evidence profile
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                              <div>
                                <p className="text-blue-400 font-bold text-lg">
                                  {laneConfidenceData.recommendation.laneDisplayName}
                                </p>
                                <p className="text-slate-400 text-sm">
                                  {laneConfidenceData.recommendation.laneDescription}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-3xl font-bold text-blue-400">
                                  {laneConfidenceData.recommendation.confidence}%
                                </p>
                                <p className="text-xs text-slate-500">Confidence</p>
                              </div>
                            </div>

                            <div className="bg-slate-700/30 rounded-lg p-4">
                              <p className="text-slate-400 text-sm font-medium mb-2">Why this recommendation:</p>
                              <ul className="space-y-1">
                                {laneConfidenceData.recommendation.reasoning.map((r: string, idx: number) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                                    <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                                    {r}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {laneConfidenceData.recommendation.alternativeLane && (
                              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                <div>
                                  <p className="text-slate-400 text-xs">Alternative option:</p>
                                  <p className="text-slate-300">{laneConfidenceData.recommendation.alternativeLaneDisplayName}</p>
                                </div>
                                <Badge variant="outline" className="border-slate-500 text-slate-400">
                                  {laneConfidenceData.recommendation.alternativeConfidence}% confidence
                                </Badge>
                              </div>
                            )}

                            <div className="grid grid-cols-3 gap-2 pt-2">
                              <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                                <p className="text-lg font-bold text-white">{laneConfidenceData.factors.strengthAvg}</p>
                                <p className="text-xs text-slate-400">Strength</p>
                              </div>
                              <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                                <p className="text-lg font-bold text-white">{laneConfidenceData.factors.completenessPct}%</p>
                                <p className="text-xs text-slate-400">Complete</p>
                              </div>
                              <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                                <p className="text-lg font-bold text-white">{laneConfidenceData.factors.hasNexusLetter ? "Yes" : "No"}</p>
                                <p className="text-xs text-slate-400">Nexus</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Stage 8: Vendor Scorecards */}
                    {vendorScorecardsData?.scorecards && vendorScorecardsData.scorecards.length > 0 && (
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            Vendor Performance
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            Track who's actively helping your case
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {vendorScorecardsData.scorecards.map((v: any, idx: number) => (
                              <div
                                key={idx}
                                className={`p-4 rounded-lg border ${
                                  v.rating === "excellent" ? "bg-green-500/10 border-green-500/30" :
                                  v.rating === "good" ? "bg-blue-500/10 border-blue-500/30" :
                                  v.rating === "fair" ? "bg-amber-500/10 border-amber-500/30" :
                                  "bg-slate-700/30 border-slate-600"
                                }`}
                                data-testid={`vendor-scorecard-${idx}`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span className="text-white font-medium">{v.vendorEmail}</span>
                                  </div>
                                  <Badge className={`${
                                    v.rating === "excellent" ? "bg-green-500" :
                                    v.rating === "good" ? "bg-blue-500" :
                                    v.rating === "fair" ? "bg-amber-500" :
                                    "bg-slate-500"
                                  }`}>
                                    {v.rating.replace("_", " ")}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-center">
                                  <div>
                                    <p className="text-lg font-bold text-white">{v.uploads}</p>
                                    <p className="text-xs text-slate-400">Uploads</p>
                                  </div>
                                  <div>
                                    <p className="text-lg font-bold text-white">{v.notes}</p>
                                    <p className="text-xs text-slate-400">Notes</p>
                                  </div>
                                  <div>
                                    <p className="text-lg font-bold text-white">{v.avgResponseHours || "-"}</p>
                                    <p className="text-xs text-slate-400">Avg Hrs</p>
                                  </div>
                                  <div>
                                    <p className="text-lg font-bold text-white">{v.score}</p>
                                    <p className="text-xs text-slate-400">Score</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Stage 10: VA.gov Upload Checklist */}
                    {uploadChecklistData?.checklist && uploadChecklistData.checklist.items.length > 0 && (
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-amber-400" />
                            VA.gov Upload Checklist
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            Step-by-step guide for submitting to VA.gov
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center">
                                <p className="text-lg font-bold text-red-400">{uploadChecklistData.checklist.summary.required}</p>
                                <p className="text-xs text-slate-400">Required</p>
                              </div>
                              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 text-center">
                                <p className="text-lg font-bold text-amber-400">{uploadChecklistData.checklist.summary.recommended}</p>
                                <p className="text-xs text-slate-400">Recommended</p>
                              </div>
                              <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                                <p className="text-lg font-bold text-slate-400">{uploadChecklistData.checklist.summary.optional}</p>
                                <p className="text-xs text-slate-400">Optional</p>
                              </div>
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {uploadChecklistData.checklist.items.map((item: any) => (
                                <div
                                  key={item.step}
                                  className={`flex items-start gap-3 p-3 rounded-lg ${
                                    item.priority === "required" ? "bg-red-500/5 border border-red-500/20" :
                                    item.priority === "recommended" ? "bg-amber-500/5 border border-amber-500/20" :
                                    "bg-slate-700/20 border border-slate-600"
                                  }`}
                                  data-testid={`checklist-item-${item.step}`}
                                >
                                  <CheckSquare className={`w-5 h-5 mt-0.5 ${
                                    item.priority === "required" ? "text-red-400" :
                                    item.priority === "recommended" ? "text-amber-400" :
                                    "text-slate-500"
                                  }`} />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-slate-500 text-xs">Step {item.step}</span>
                                      <Badge variant="outline" className={`text-xs ${
                                        item.priority === "required" ? "border-red-500 text-red-400" :
                                        item.priority === "recommended" ? "border-amber-500 text-amber-400" :
                                        "border-slate-500 text-slate-400"
                                      }`}>
                                        {item.priority}
                                      </Badge>
                                    </div>
                                    <p className="text-white text-sm truncate">{item.filename}</p>
                                    <p className="text-slate-400 text-xs">{item.note}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <Button
                              variant="outline"
                              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                              onClick={() => {
                                const text = uploadChecklistData.textVersion;
                                const blob = new Blob([text], { type: "text/plain" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = "va-upload-checklist.txt";
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                              data-testid="download-checklist-btn"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Checklist as Text
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Export Package Card */}
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Download className="w-5 h-5 text-amber-400" />
                          Export Submission Package
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Download your organized evidence for submission
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-slate-300">
                            Generate a submission-ready package including:
                          </p>
                          <ul className="list-disc list-inside text-slate-400 space-y-1">
                            <li>Evidence Index (auto-generated)</li>
                            <li>Cover Letter Summary</li>
                            <li>All tagged documents organized by type</li>
                          </ul>
                          <Button
                            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold"
                            onClick={() => {
                              window.open(`/api/claims/cases/${activeCaseId}/export/download`, "_blank");
                            }}
                            data-testid="export-download-btn"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Submission Package
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </VeteranAuthGate>
      </Layout>
    );
  }

  return (
    <Layout>
      <VeteranAuthGate serviceName="Claims Navigator">
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full mb-4">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">CLAIMS NAVIGATOR</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Build Your Personalized Claim Plan
                </h1>
                <p className="text-slate-400 text-lg">
                  Answer a few questions and we'll create a customized checklist for your situation
                </p>
              </div>

              {step !== "dashboard" && (
                <div className="flex items-center justify-center gap-2 mb-8">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        num < getStepNumber() ? "bg-green-500 text-white" :
                        num === getStepNumber() ? "bg-amber-500 text-black" :
                        "bg-slate-700 text-slate-400"
                      }`}>
                        {num < getStepNumber() ? <Check className="w-4 h-4" /> : num}
                      </div>
                      {num < 4 && (
                        <div className={`w-12 h-1 ${num < getStepNumber() ? "bg-green-500" : "bg-slate-700"}`} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {step === "track" && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">What type of benefits are you pursuing?</CardTitle>
                    <CardDescription className="text-slate-400">Select the program that applies to your situation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <button
                      onClick={() => { setSelectedTrack("va"); setStep("type"); }}
                      className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
                        selectedTrack === "va" ? "border-blue-500 bg-blue-500/10" : "border-slate-600 hover:border-blue-400"
                      }`}
                      data-testid="track-va-btn"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Shield className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">VA Disability Benefits</h3>
                          <p className="text-slate-400">For service-connected disabilities through the Department of Veterans Affairs</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => { setSelectedTrack("ssdi"); setStep("type"); }}
                      className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
                        selectedTrack === "ssdi" ? "border-purple-500 bg-purple-500/10" : "border-slate-600 hover:border-purple-400"
                      }`}
                      data-testid="track-ssdi-btn"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Briefcase className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Social Security Disability (SSDI)</h3>
                          <p className="text-slate-400">For disabilities that prevent you from working through Social Security</p>
                        </div>
                      </div>
                    </button>
                  </CardContent>
                </Card>
              )}

              {step === "type" && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">
                      {selectedTrack === "va" ? "What stage is your VA claim?" : "What stage is your SSDI application?"}
                    </CardTitle>
                    <CardDescription className="text-slate-400">This helps us tailor your checklist</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(selectedTrack === "va" ? VA_CLAIM_TYPES : SSDI_CLAIM_TYPES).map((type) => (
                      <button
                        key={type.id}
                        onClick={() => { setSelectedClaimType(type.id); setStep("evidence"); }}
                        className={`w-full p-5 rounded-lg border-2 text-left transition-all ${
                          selectedClaimType === type.id ? "border-amber-500 bg-amber-500/10" : "border-slate-600 hover:border-amber-400"
                        }`}
                        data-testid={`claim-type-${type.id}-btn`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <type.icon className="w-6 h-6 text-amber-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{type.label}</h3>
                            <p className="text-slate-400 text-sm">{type.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                    <Button 
                      variant="ghost" 
                      className="text-slate-400 hover:text-white"
                      onClick={() => { setSelectedClaimType(null); setStep("track"); }}
                      data-testid="back-to-track-btn"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === "evidence" && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">How much evidence do you have gathered?</CardTitle>
                    <CardDescription className="text-slate-400">This helps us prioritize your tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {EVIDENCE_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => { setSelectedEvidenceLevel(level.id as EvidenceLevel); setStep("review"); }}
                        className={`w-full p-5 rounded-lg border-2 text-left transition-all ${
                          selectedEvidenceLevel === level.id ? "border-amber-500 bg-amber-500/10" : "border-slate-600 hover:border-amber-400"
                        }`}
                        data-testid={`evidence-${level.id}-btn`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                            <level.icon className={`w-6 h-6 ${
                              level.id === "a_lot" ? "text-green-400" :
                              level.id === "some" ? "text-amber-400" :
                              "text-slate-400"
                            }`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{level.label}</h3>
                            <p className="text-slate-400 text-sm">{level.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                    <Button 
                      variant="ghost" 
                      className="text-slate-400 hover:text-white"
                      onClick={() => { setSelectedEvidenceLevel(null); setStep("type"); }}
                      data-testid="back-to-type-btn"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === "review" && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                      Ready to Generate Your Plan
                    </CardTitle>
                    <CardDescription className="text-slate-400">Review your selections and create your personalized checklist</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-400">Benefits Type</span>
                        <Badge className={selectedTrack === "va" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}>
                          {selectedTrack === "va" ? "VA Disability" : "SSDI"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-400">Claim Stage</span>
                        <Badge className="bg-amber-500/20 text-amber-400">
                          {selectedTrack === "va" 
                            ? VA_CLAIM_TYPES.find(t => t.id === selectedClaimType)?.label
                            : SSDI_CLAIM_TYPES.find(t => t.id === selectedClaimType)?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-400">Evidence Level</span>
                        <Badge className="bg-slate-500/20 text-slate-300">
                          {EVIDENCE_LEVELS.find(e => e.id === selectedEvidenceLevel)?.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <h4 className="text-green-400 font-medium">Your Plan Will Include</h4>
                          <ul className="text-sm text-slate-300 mt-2 space-y-1">
                            <li>• Personalized task checklist based on your situation</li>
                            <li>• Document organization center</li>
                            <li>• Deadline tracking</li>
                            <li>• Progress monitoring</li>
                            <li>• Optional vendor sharing (you control access)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => setStep("evidence")}
                        data-testid="back-to-evidence-btn"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button 
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold"
                        onClick={() => createCaseMutation.mutate()}
                        disabled={createCaseMutation.isPending}
                        data-testid="create-plan-btn"
                      >
                        {createCaseMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <ArrowRight className="w-4 h-4 mr-2" />
                        )}
                        Create My Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </VeteranAuthGate>
    </Layout>
  );
}
