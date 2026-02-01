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
                          <div className="flex gap-2">
                            <Input
                              type="email"
                              placeholder="Enter email address..."
                              className="bg-slate-700 border-slate-600 text-white flex-1"
                              data-testid="share-email-input"
                            />
                            <Button className="bg-amber-500 hover:bg-amber-600 text-black" data-testid="share-invite-btn">
                              <Users className="w-4 h-4 mr-2" />
                              Invite
                            </Button>
                          </div>
                        </div>

                        <div className="text-center py-8">
                          <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                          <p className="text-slate-400">No one else has access to this case</p>
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
