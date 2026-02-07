import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  FileText,
  MessageSquare,
  Upload,
  Eye,
  Clock,
  ChevronRight,
  User,
  FolderOpen,
  Send,
  Loader2,
  Mail,
  LogOut,
  CheckCircle,
} from "lucide-react";

interface SharedCase {
  id: number;
  title: string;
  caseType: string;
  claimType: string;
  status: string;
  role: string;
  shareId: number;
}

interface CaseFile {
  id: number;
  originalName: string;
  evidenceType: string | null;
  condition: string | null;
  strength: number | null;
  createdAt: string;
}

interface CaseNote {
  id: number;
  content: string;
  authorEmail: string;
  authorType: string;
  createdAt: string;
}

interface CaseAccess {
  role: string;
  canView: boolean;
  canComment: boolean;
  canUpload: boolean;
}

interface CaseDetails {
  case: {
    id: number;
    title: string;
    caseType: string;
    claimType: string;
    status: string;
  };
  access: CaseAccess;
  files: CaseFile[];
  timeline: CaseNote[];
}

interface VendorSession {
  email: string;
  expiresAt: string;
  sharedCases: number;
}

const SESSION_KEY = "vendor_session_token";

export default function VendorPortal() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isRequestingLink, setIsRequestingLink] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get session token from localStorage
  const getSessionToken = () => localStorage.getItem(SESSION_KEY);
  const setSessionToken = (token: string) => localStorage.setItem(SESSION_KEY, token);
  const clearSessionToken = () => localStorage.removeItem(SESSION_KEY);

  // Check for magic link token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      verifyMagicLink(token);
    }
  }, []);

  // Verify magic link and create session
  const verifyMagicLink = async (token: string) => {
    try {
      const res = await fetch("/api/vendor/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        const data = await res.json();
        setSessionToken(data.sessionToken);
        toast({ title: "Welcome!", description: `Logged in as ${data.email}` });
        // Clear token from URL
        window.history.replaceState({}, "", "/vendor-portal");
        queryClient.invalidateQueries({ queryKey: ["/api/vendor/auth/session"] });
      } else {
        toast({ title: "Invalid Link", description: "This link is expired or already used", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to verify login link", variant: "destructive" });
    }
  };

  // Check current session
  const { data: session, isLoading: sessionLoading, error: sessionError } = useQuery<VendorSession>({
    queryKey: ["/api/vendor/auth/session"],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) throw new Error("No session");

      const res = await fetch("/api/vendor/auth/session", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        clearSessionToken();
        throw new Error("Invalid session");
      }

      return res.json();
    },
    retry: false,
  });

  // Get vendor's shared cases
  const { data: sharedCases, isLoading: casesLoading } = useQuery<SharedCase[]>({
    queryKey: ["/api/vendor/my-cases"],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) return [];

      const res = await fetch("/api/vendor/my-cases", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!session,
  });

  // Get case details
  const { data: caseDetails, isLoading: detailsLoading } = useQuery<CaseDetails>({
    queryKey: ["/api/vendor/cases", selectedCaseId],
    queryFn: async () => {
      const token = getSessionToken();
      if (!selectedCaseId || !token || !session) return null;

      const res = await fetch(`/api/vendor/cases/${selectedCaseId}?email=${encodeURIComponent(session.email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!selectedCaseId && !!session,
  });

  // Request magic link
  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;

    setIsRequestingLink(true);
    try {
      const res = await fetch("/api/vendor/auth/request-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setLinkSent(true);
        toast({ title: "Check Your Email", description: "If you have access, a login link will be sent." });
      } else {
        toast({ title: "Error", description: "Failed to send login link", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to send login link", variant: "destructive" });
    }
    setIsRequestingLink(false);
  };

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      const token = getSessionToken();
      const res = await fetch(`/api/vendor/cases/${selectedCaseId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vendorEmail: session?.email, content }),
      });
      if (!res.ok) throw new Error("Failed to add note");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Note Added", description: "Your note has been added to the case timeline." });
      setNoteContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/cases", selectedCaseId] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add note", variant: "destructive" });
    },
  });

  // Logout
  const handleLogout = async () => {
    const token = getSessionToken();
    if (token) {
      await fetch("/api/vendor/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    clearSessionToken();
    queryClient.invalidateQueries({ queryKey: ["/api/vendor/auth/session"] });
    setSelectedCaseId(null);
    setLinkSent(false);
    setEmail("");
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "upload":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><Upload className="w-3 h-3 mr-1" /> Can Upload</Badge>;
      case "comment":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><MessageSquare className="w-3 h-3 mr-1" /> Can Comment</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30"><Eye className="w-3 h-3 mr-1" /> View Only</Badge>;
    }
  };

  const getStrengthColor = (strength: number | null) => {
    if (strength === null) return "bg-slate-600";
    if (strength >= 4) return "bg-green-500";
    if (strength >= 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Loading state
  if (sessionLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                <span className="text-white font-display text-lg">Loading Vendor Portal...</span>
              </div>
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Login screen (no session)
  if (!session) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full mb-4">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">VENDOR PORTAL</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  Secure Access
                </h1>
                <p className="text-slate-400">
                  Enter your email to receive a secure login link
                </p>
              </div>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  {linkSent ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Check Your Email</h3>
                      <p className="text-slate-400 mb-4">
                        If you have access to any shared cases, a login link has been sent to <strong className="text-white">{email}</strong>
                      </p>
                      <p className="text-slate-500 text-sm mb-6">
                        The link expires in 15 minutes
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => { setLinkSent(false); setEmail(""); }}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        data-testid="try-different-email-btn"
                      >
                        Try a Different Email
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleRequestLink} className="space-y-4">
                      <div>
                        <Label htmlFor="email" className="text-white">Your Email Address</Label>
                        <div className="relative mt-2">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="vendor@example.com"
                            className="bg-slate-700 border-slate-600 text-white pl-10"
                            data-testid="vendor-email-input"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!email.includes("@") || isRequestingLink}
                        data-testid="request-link-btn"
                      >
                        {isRequestingLink ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                        ) : (
                          <>Send Login Link <ChevronRight className="w-4 h-4 ml-2" /></>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              <p className="text-center text-slate-500 text-sm mt-6">
                Secure, passwordless login via email
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Case details view
  if (selectedCaseId && caseDetails) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setSelectedCaseId(null)}
                className="flex items-center gap-3 px-5 py-3 bg-slate-800/50 hover:bg-slate-700/50 border-slate-600 text-white font-semibold text-base mb-6"
                data-testid="back-to-cases-btn"
              >
                ← Back to Cases
              </Button>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">{caseDetails.case.title}</h1>
                  <p className="text-slate-400">
                    {caseDetails.case.caseType.toUpperCase()} - {caseDetails.case.claimType || "Claim"}
                  </p>
                </div>
                {getRoleBadge(caseDetails.access.role)}
              </div>

              <Tabs defaultValue="files" className="space-y-4">
                <TabsList className="bg-slate-800 border-slate-700">
                  <TabsTrigger value="files" className="data-[state=active]:bg-slate-700" data-testid="tab-files">
                    <FolderOpen className="w-4 h-4 mr-2" /> Evidence
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="data-[state=active]:bg-slate-700" data-testid="tab-timeline">
                    <Clock className="w-4 h-4 mr-2" /> Timeline
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="files" className="space-y-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        Case Evidence
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {caseDetails.files.length} document{caseDetails.files.length !== 1 ? "s" : ""} in this case
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {caseDetails.files.length > 0 ? (
                        <div className="space-y-2">
                          {caseDetails.files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                              data-testid={`file-item-${file.id}`}
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-slate-400" />
                                <div>
                                  <p className="text-white font-medium">{file.originalName}</p>
                                  <div className="flex gap-2 mt-1">
                                    {file.evidenceType && (
                                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                        {file.evidenceType}
                                      </Badge>
                                    )}
                                    {file.condition && (
                                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                        {file.condition}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {file.strength !== null && (
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-400 text-sm">Strength:</span>
                                  <div className={`w-8 h-8 rounded-full ${getStrengthColor(file.strength)} flex items-center justify-center text-white font-bold text-sm`}>
                                    {file.strength}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-8">No documents uploaded yet</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        Case Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {caseDetails.access.canComment && (
                        <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
                          <Label className="text-white mb-2 block">Add a Note</Label>
                          <Textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Write your note here..."
                            className="bg-slate-700 border-slate-600 text-white mb-3"
                            data-testid="note-input"
                          />
                          <Button
                            onClick={() => addNoteMutation.mutate(noteContent)}
                            disabled={!noteContent.trim() || addNoteMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700"
                            data-testid="add-note-btn"
                          >
                            {addNoteMutation.isPending ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4 mr-2" />
                            )}
                            Add Note
                          </Button>
                        </div>
                      )}

                      {caseDetails.timeline.length > 0 ? (
                        <div className="space-y-4">
                          {caseDetails.timeline.map((note) => (
                            <div
                              key={note.id}
                              className="p-4 bg-slate-700/30 rounded-lg border-l-4 border-blue-500"
                              data-testid={`note-item-${note.id}`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="text-white font-medium">{note.authorEmail}</span>
                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                  {note.authorType}
                                </Badge>
                                <span className="text-slate-500 text-sm ml-auto">
                                  {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-slate-300">{note.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-8">No notes yet</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Cases list view
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header with user info */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">VENDOR PORTAL</span>
                </div>
                <h1 className="text-3xl font-bold text-white">Your Shared Cases</h1>
                <p className="text-slate-400">Logged in as {session.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                data-testid="logout-btn"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Cases list */}
            {casesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              </div>
            ) : sharedCases && sharedCases.length > 0 ? (
              <div className="grid gap-4">
                {sharedCases.map((caseItem) => (
                  <Card
                    key={caseItem.id}
                    className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                    onClick={() => setSelectedCaseId(caseItem.id)}
                    data-testid={`case-card-${caseItem.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{caseItem.title}</h3>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-slate-700 text-slate-300">
                              {caseItem.caseType.toUpperCase()}
                            </Badge>
                            {caseItem.claimType && (
                              <span className="text-slate-400">{caseItem.claimType}</span>
                            )}
                            <Badge className={`${
                              caseItem.status === "active" ? "bg-green-500/20 text-green-400" :
                              caseItem.status === "submitted" ? "bg-blue-500/20 text-blue-400" :
                              "bg-slate-500/20 text-slate-400"
                            }`}>
                              {caseItem.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getRoleBadge(caseItem.role)}
                          <ChevronRight className="w-5 h-5 text-slate-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="py-12 text-center">
                  <FolderOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Shared Cases</h3>
                  <p className="text-slate-400">
                    You don't have any cases shared with you yet
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
