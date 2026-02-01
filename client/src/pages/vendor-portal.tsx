import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "lucide-react";

interface SharedCase {
  id: number;
  title: string;
  caseType: string;
  claimType: string;
  status: string;
  role: string;
  sharedAt: string;
}

interface CaseFile {
  id: number;
  filename: string;
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

export default function VendorPortal() {
  const [vendorEmail, setVendorEmail] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sharedCases, isLoading: casesLoading } = useQuery<SharedCase[]>({
    queryKey: ["/api/vendor/cases", vendorEmail],
    queryFn: async () => {
      if (!vendorEmail) return [];
      const res = await fetch(`/api/vendor/cases?email=${encodeURIComponent(vendorEmail)}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: isEmailSubmitted && !!vendorEmail,
  });

  const { data: caseDetails, isLoading: detailsLoading } = useQuery<CaseDetails>({
    queryKey: ["/api/vendor/cases", selectedCaseId, vendorEmail],
    queryFn: async () => {
      if (!selectedCaseId || !vendorEmail) return null;
      const res = await fetch(`/api/vendor/cases/${selectedCaseId}?email=${encodeURIComponent(vendorEmail)}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!selectedCaseId && !!vendorEmail,
  });

  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/vendor/cases/${selectedCaseId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorEmail, content }),
      });
      if (!res.ok) throw new Error("Failed to add note");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Note Added", description: "Your note has been added to the case timeline." });
      setNoteContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/cases", selectedCaseId, vendorEmail] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add note", variant: "destructive" });
    },
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vendorEmail.includes("@")) {
      setIsEmailSubmitted(true);
    }
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

  if (!isEmailSubmitted) {
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
                  Access Shared Cases
                </h1>
                <p className="text-slate-400">
                  Enter your email to view cases that have been shared with you
                </p>
              </div>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-white">Your Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={vendorEmail}
                        onChange={(e) => setVendorEmail(e.target.value)}
                        placeholder="vendor@example.com"
                        className="bg-slate-700 border-slate-600 text-white mt-2"
                        data-testid="vendor-email-input"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!vendorEmail.includes("@")}
                      data-testid="vendor-access-btn"
                    >
                      Access Shared Cases
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (selectedCaseId && caseDetails) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => setSelectedCaseId(null)}
                className="text-slate-400 hover:text-white mb-4"
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
                                  <p className="text-white font-medium">{file.filename}</p>
                                  <p className="text-sm text-slate-400">
                                    {file.evidenceType?.toUpperCase() || "Untagged"} 
                                    {file.condition && ` • ${file.condition}`}
                                  </p>
                                </div>
                              </div>
                              {file.strength && (
                                <Badge variant="outline" className={
                                  file.strength >= 4 ? "border-green-500 text-green-400" :
                                  file.strength >= 3 ? "border-amber-500 text-amber-400" :
                                  "border-red-500 text-red-400"
                                }>
                                  {file.strength}/5
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FolderOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                          <p className="text-slate-400">No documents uploaded yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-400" />
                        Case Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {caseDetails.access.canComment && (
                        <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
                          <Label htmlFor="note" className="text-white mb-2 block">Add a Note</Label>
                          <Textarea
                            id="note"
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Add your notes or comments..."
                            className="bg-slate-700 border-slate-600 text-white mb-2"
                            rows={3}
                            data-testid="vendor-note-input"
                          />
                          <Button
                            onClick={() => addNoteMutation.mutate(noteContent)}
                            disabled={!noteContent.trim() || addNoteMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700"
                            data-testid="vendor-add-note-btn"
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
                        <div className="space-y-3">
                          {caseDetails.timeline.map((note) => (
                            <div
                              key={note.id}
                              className="bg-slate-700/50 rounded-lg p-4"
                              data-testid={`timeline-note-${note.id}`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-300 text-sm">{note.authorEmail}</span>
                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                  {note.authorType}
                                </Badge>
                                <span className="text-slate-500 text-xs ml-auto">
                                  {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-white">{note.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MessageSquare className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                          <p className="text-slate-400">No notes yet</p>
                        </div>
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">VENDOR PORTAL</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Shared Cases</h1>
                <p className="text-slate-400">{vendorEmail}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEmailSubmitted(false);
                  setVendorEmail("");
                }}
                className="border-slate-600 text-slate-300"
                data-testid="change-email-btn"
              >
                Change Email
              </Button>
            </div>

            {casesLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-slate-500 mx-auto animate-spin" />
                <p className="text-slate-400 mt-4">Loading shared cases...</p>
              </div>
            ) : sharedCases && sharedCases.length > 0 ? (
              <div className="space-y-3">
                {sharedCases.map((caseItem) => (
                  <Card
                    key={caseItem.id}
                    className="bg-slate-800/50 border-slate-700 hover:border-slate-600 cursor-pointer transition-colors"
                    onClick={() => setSelectedCaseId(caseItem.id)}
                    data-testid={`case-card-${caseItem.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{caseItem.title}</h3>
                            <p className="text-sm text-slate-400">
                              {caseItem.caseType.toUpperCase()} - {caseItem.claimType || "Claim"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
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
                <CardContent className="p-12 text-center">
                  <FolderOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No Shared Cases</h3>
                  <p className="text-slate-400">
                    No cases have been shared with {vendorEmail} yet.
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
