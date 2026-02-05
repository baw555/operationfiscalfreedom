import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, Clock, ArrowLeft, Wrench, FileText, Zap } from "lucide-react";
import { Link } from "wouter";

interface RepairResult {
  status: "PATCH_PROPOSED" | "FAILED" | "ESCALATED" | "NO_PATCH";
  issueType: string;
  message: string;
  diagnostics?: Record<string, any>;
  patch?: { file: string; fix: string; description: string; proposedAt?: string } | null;
  error?: string;
}

interface RepairLog {
  id: number;
  description: string;
  issue_type: string;
  status: string;
  patch: string | null;
  created_at: string;
}

interface ClassifyResult {
  issueType: string;
  autoFixable: boolean;
  diagnostics: Record<string, any>;
  message: string;
}

export default function SelfRepairPage() {
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const { data: logs, isLoading: logsLoading } = useQuery<RepairLog[]>({
    queryKey: ["/api/repair/logs"],
    refetchInterval: 10000
  });

  const classifyMutation = useMutation<ClassifyResult>({
    mutationFn: async () => {
      const res = await fetch("/api/repair/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description })
      });
      if (!res.ok) throw new Error("Failed to classify");
      return res.json();
    }
  });

  const repairMutation = useMutation<RepairResult>({
    mutationFn: async () => {
      const res = await fetch("/api/repair/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description })
      });
      if (!res.ok) throw new Error("Failed to submit repair");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/repair/logs"] });
      setDescription("");
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PATCH_PROPOSED": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "FAILED": return <XCircle className="h-4 w-4 text-red-500" />;
      case "ESCALATED": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      PATCH_PROPOSED: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      ESCALATED: "bg-yellow-100 text-yellow-800",
      NO_PATCH: "bg-gray-100 text-gray-800"
    };
    return <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>{status.replace("_", " ")}</Badge>;
  };

  const getIssueTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      RUNTIME_ERROR: "bg-purple-100 text-purple-800",
      UI_BROKEN: "bg-blue-100 text-blue-800",
      FORM_ERROR: "bg-orange-100 text-orange-800",
      API_FAIL: "bg-red-100 text-red-800",
      AUTH_ERROR: "bg-pink-100 text-pink-800",
      DATABASE_ERROR: "bg-indigo-100 text-indigo-800",
      UNKNOWN: "bg-gray-100 text-gray-800"
    };
    return <Badge className={colors[type] || "bg-gray-100 text-gray-800"}>{type}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/master-portal">
            <Button variant="outline" size="sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Master Portal
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1A365D] flex items-center gap-2" data-testid="text-page-title">
              <Wrench className="h-6 w-6" />
              Self-Repair Bot
            </h1>
            <p className="text-gray-600">Automated issue classification and repair system</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Submit Issue
              </CardTitle>
              <CardDescription>
                Describe the issue you're experiencing. The bot will classify it and attempt an automated fix.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe the issue... (e.g., 'Button click not working on the form page', 'API returns 500 error on /api/users')"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                data-testid="input-issue-description"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={() => classifyMutation.mutate()}
                  disabled={!description.trim() || classifyMutation.isPending}
                  variant="outline"
                  data-testid="button-classify"
                >
                  {classifyMutation.isPending ? "Classifying..." : "Classify Only"}
                </Button>
                <Button
                  onClick={() => repairMutation.mutate()}
                  disabled={!description.trim() || repairMutation.isPending}
                  className="bg-[#E21C3D] hover:bg-[#c4162f]"
                  data-testid="button-submit-repair"
                >
                  {repairMutation.isPending ? "Processing..." : "Submit for Repair"}
                </Button>
              </div>

              {classifyMutation.data && (
                <div className="p-4 bg-blue-50 rounded-lg space-y-2" data-testid="classify-result">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Classification:</span>
                    {getIssueTypeBadge(classifyMutation.data.issueType)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Auto-fixable:</span>
                    {classifyMutation.data.autoFixable ? (
                      <Badge className="bg-green-100 text-green-800">Yes</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">No - Manual Review</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{classifyMutation.data.message}</p>
                </div>
              )}

              {repairMutation.data && (
                <div className={`p-4 rounded-lg space-y-2 ${
                  repairMutation.data.status === "PATCH_PROPOSED" ? "bg-green-50" :
                  repairMutation.data.status === "ESCALATED" ? "bg-yellow-50" : "bg-red-50"
                }`} data-testid="repair-result">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(repairMutation.data.status)}
                    <span className="font-medium">{repairMutation.data.status.replace("_", " ")}</span>
                  </div>
                  <p className="text-sm">{repairMutation.data.message}</p>
                  {repairMutation.data.patch && (
                    <div className="text-xs bg-white p-2 rounded">
                      <p><strong>File:</strong> {repairMutation.data.patch.file}</p>
                      <p><strong>Fix:</strong> {repairMutation.data.patch.fix}</p>
                      <p><strong>Description:</strong> {repairMutation.data.patch.description}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Repair Logs
              </CardTitle>
              <CardDescription>
                Recent repair attempts and their outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <p className="text-gray-500">Loading logs...</p>
              ) : logs && logs.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto" data-testid="repair-logs">
                  {logs.map((log) => (
                    <div key={log.id} className="p-3 bg-gray-50 rounded-lg text-sm" data-testid={`log-${log.id}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          {getStatusBadge(log.status)}
                          {getIssueTypeBadge(log.issue_type)}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 line-clamp-2">{log.description}</p>
                      {log.patch && (
                        <details className="mt-2">
                          <summary className="text-xs text-blue-600 cursor-pointer">View Patch</summary>
                          <pre className="mt-1 text-xs bg-white p-2 rounded overflow-x-auto">
                            {log.patch}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8" data-testid="text-no-logs">No repair logs yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-bold text-blue-800">1. Intake</div>
                <p className="text-xs text-gray-600">You describe the issue</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-bold text-purple-800">2. Classify</div>
                <p className="text-xs text-gray-600">Bot identifies issue type</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="font-bold text-orange-800">3. Eligibility</div>
                <p className="text-xs text-gray-600">Check if auto-fixable</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-bold text-green-800">4. Diagnose</div>
                <p className="text-xs text-gray-600">Run diagnostics</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="font-bold text-yellow-800">5. Patch</div>
                <p className="text-xs text-gray-600">Generate & test fix</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="font-bold text-red-800">6. Apply</div>
                <p className="text-xs text-gray-600">Apply or rollback</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
