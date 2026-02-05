import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Clock, Shield, Ban, FileText } from "lucide-react";
import { Link } from "wouter";

interface EscalatedRepair {
  id: number;
  description: string;
  issueType: string;
  status: string;
  patch: string | null;
  createdAt: string;
}

interface QueueStats {
  escalated: number;
  failed: number;
  pending: number;
  canDeploy: boolean;
}

export default function AdminRepairQueuePage() {
  const queryClient = useQueryClient();
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const { data: escalatedRepairs, isLoading } = useQuery<EscalatedRepair[]>({
    queryKey: ["/api/repair/escalated"],
    refetchInterval: 10000
  });

  const { data: stats } = useQuery<QueueStats>({
    queryKey: ["/api/repair/queue-stats"]
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/repair/approve?id=${id}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/repair/escalated"] });
      queryClient.invalidateQueries({ queryKey: ["/api/repair/queue-stats"] });
      setActionMessage("Repair approved successfully");
      setTimeout(() => setActionMessage(null), 3000);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/repair/reject?id=${id}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to reject");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/repair/escalated"] });
      queryClient.invalidateQueries({ queryKey: ["/api/repair/queue-stats"] });
      setActionMessage("Repair rejected");
      setTimeout(() => setActionMessage(null), 3000);
    }
  });

  const getIssueTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      AUTH_ERROR: "bg-pink-100 text-pink-800",
      DATABASE_ERROR: "bg-indigo-100 text-indigo-800",
      PAYMENTS: "bg-purple-100 text-purple-800",
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
              <Shield className="h-6 w-6" />
              Escalated Repairs Queue
            </h1>
            <p className="text-gray-600">Review and approve repairs requiring admin authorization</p>
          </div>
        </div>

        {actionMessage && (
          <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg flex items-center gap-2" data-testid="action-message">
            <CheckCircle className="h-4 w-4" />
            {actionMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Escalated</p>
                  <p className="text-2xl font-bold text-yellow-600" data-testid="stat-escalated">{stats?.escalated || 0}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Failed</p>
                  <p className="text-2xl font-bold text-red-600" data-testid="stat-failed">{stats?.failed || 0}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-blue-600" data-testid="stat-pending">{stats?.pending || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className={stats?.canDeploy ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Deploy Status</p>
                  <p className={`text-lg font-bold ${stats?.canDeploy ? "text-green-600" : "text-red-600"}`} data-testid="stat-deploy">
                    {stats?.canDeploy ? "Ready" : "Blocked"}
                  </p>
                </div>
                {stats?.canDeploy ? (
                  <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
                ) : (
                  <Ban className="h-8 w-8 text-red-500 opacity-50" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Escalated Repairs
            </CardTitle>
            <CardDescription>
              These repairs require admin approval before fixes can be applied
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-500 text-center py-8">Loading...</p>
            ) : escalatedRepairs && escalatedRepairs.length > 0 ? (
              <div className="space-y-4" data-testid="escalated-list">
                {escalatedRepairs.map((repair) => (
                  <div key={repair.id} className="border p-4 rounded-lg" data-testid={`repair-${repair.id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          {getIssueTypeBadge(repair.issueType)}
                          <span className="text-xs text-gray-500">
                            {new Date(repair.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{repair.description}</p>
                        {repair.patch && (
                          <details className="mt-2">
                            <summary className="text-xs text-blue-600 cursor-pointer">View Proposed Fix</summary>
                            <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                              {repair.patch}
                            </pre>
                          </details>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => approveMutation.mutate(repair.id)}
                          disabled={approveMutation.isPending}
                          data-testid={`button-approve-${repair.id}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectMutation.mutate(repair.id)}
                          disabled={rejectMutation.isPending}
                          data-testid={`button-reject-${repair.id}`}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12" data-testid="no-escalated">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4 opacity-50" />
                <p className="text-gray-500">No escalated repairs pending</p>
                <p className="text-xs text-gray-400 mt-1">All repairs are either auto-fixed or resolved</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Pipeline Gate Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="font-semibold text-yellow-800">ESCALATED</div>
                <p className="text-xs text-gray-600 mt-1">Requires admin approval. Blocks deployment.</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="font-semibold text-red-800">FAILED</div>
                <p className="text-xs text-gray-600 mt-1">Patch failed tests. Blocks deployment.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-800">APPROVED / NO_PATCH</div>
                <p className="text-xs text-gray-600 mt-1">Resolved. Allows deployment.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
