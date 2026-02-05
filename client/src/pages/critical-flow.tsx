import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  AlertTriangle, CheckCircle, XCircle, Shield, ArrowLeft, 
  FileText, Zap, Lock, AlertCircle, Clock, Download
} from "lucide-react";
import { Link } from "wouter";

interface CriticalIncident {
  id: number;
  incidentId: string;
  flowType: string;
  userHashedId: string;
  failurePoint: string;
  cause: string;
  impact: string;
  proposedFix: string;
  riskLevel: string;
  status: string;
  adminApprovalRequired: boolean;
  emergencyMode: boolean;
  createdAt: string;
  resolvedAt?: string;
}

interface ProcessResult {
  incident: {
    id: string;
    flowType: string;
    cause: string;
    impact: string;
    proposedFix: string;
    riskLevel: string;
    status: string;
    adminApprovalRequired: boolean;
    emergencyMode: boolean;
  };
  autoFixed: boolean;
  emergencyModeActivated: boolean;
  adminApprovalRequired: boolean;
  message?: string;
  emergencyActions?: string[];
}

export default function CriticalFlowPage() {
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [failureCount, setFailureCount] = useState(0);
  const [userRequestedHelp, setUserRequestedHelp] = useState(false);
  const [selectedTab, setSelectedTab] = useState("process");
  const queryClient = useQueryClient();

  const { data: incidents, isLoading: incidentsLoading } = useQuery<CriticalIncident[]>({
    queryKey: ["/api/critical-flow/incidents"],
    refetchInterval: 10000
  });

  const { data: pendingIncidents } = useQuery<CriticalIncident[]>({
    queryKey: ["/api/critical-flow/incidents", "PENDING_APPROVAL"],
    queryFn: async () => {
      const res = await fetch("/api/critical-flow/incidents?status=PENDING_APPROVAL");
      return res.json();
    },
    refetchInterval: 5000
  });

  const processMutation = useMutation<ProcessResult>({
    mutationFn: async () => {
      const res = await fetch("/api/critical-flow/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          description, 
          userId: userId ? parseInt(userId) : undefined,
          failureCount,
          userRequestedHelp
        })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/critical-flow/incidents"] });
      setDescription("");
    }
  });

  const emergencyMutation = useMutation<ProcessResult>({
    mutationFn: async () => {
      const res = await fetch("/api/critical-flow/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          description, 
          userId: userId ? parseInt(userId) : undefined
        })
      });
      if (!res.ok) throw new Error("Failed to activate emergency mode");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/critical-flow/incidents"] });
    }
  });

  const approveMutation = useMutation({
    mutationFn: async ({ incidentId, action }: { incidentId: string; action: "APPROVE" | "REJECT" }) => {
      const res = await fetch(`/api/critical-flow/approve/${incidentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      if (!res.ok) throw new Error("Failed to process approval");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/critical-flow/incidents"] });
    }
  });

  const getRiskBadge = (level: string) => {
    const colors: Record<string, string> = {
      LOW: "bg-green-100 text-green-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HIGH: "bg-orange-100 text-orange-800",
      CRITICAL: "bg-red-100 text-red-800"
    };
    return <Badge className={colors[level] || "bg-gray-100"}>{level}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING_APPROVAL: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      AUTO_FIXED: "bg-blue-100 text-blue-800",
      ESCALATED: "bg-orange-100 text-orange-800",
      EMERGENCY_MODE: "bg-purple-100 text-purple-800"
    };
    return <Badge className={colors[status] || "bg-gray-100"}>{status.replace("_", " ")}</Badge>;
  };

  const getFlowTypeBadge = (type: string) => {
    return type === "AUTH" 
      ? <Badge className="bg-blue-100 text-blue-800">Auth</Badge>
      : <Badge className="bg-purple-100 text-purple-800">Contract</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/master-portal">
            <Button variant="outline" size="lg" className="flex items-center gap-3 px-5 py-3 bg-white hover:bg-gray-100 border-gray-300 text-[#1A365D] font-semibold text-base shadow-sm" data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
              Back to Master Portal
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1A365D] flex items-center gap-2" data-testid="text-page-title">
              <Shield className="h-6 w-6 text-red-600" />
              Tier-0 Critical Flow System
            </h1>
            <p className="text-gray-600">Auth + Contract Signing Diagnostics & Emergency Response</p>
          </div>
          {pendingIncidents && pendingIncidents.length > 0 && (
            <Badge className="bg-red-500 text-white animate-pulse ml-auto">
              {pendingIncidents.length} Pending Approval
            </Badge>
          )}
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="process" data-testid="tab-process">
              <Zap className="h-4 w-4 mr-2" />
              Process Issue
            </TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending">
              <AlertCircle className="h-4 w-4 mr-2" />
              Pending Approval
              {pendingIncidents && pendingIncidents.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs">{pendingIncidents.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="incidents" data-testid="tab-incidents">
              <FileText className="h-4 w-4 mr-2" />
              All Incidents
            </TabsTrigger>
            <TabsTrigger value="emergency" data-testid="tab-emergency">
              <Lock className="h-4 w-4 mr-2" />
              Emergency Mode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="process" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Process Critical Flow Issue</CardTitle>
                <CardDescription>
                  Enter sign-in or contract signing issue details for automated diagnosis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Issue Description</Label>
                  <Textarea
                    placeholder="Describe the issue... (e.g., 'User can't sign in - OAuth redirect failing', 'Contract PDF not loading')"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    data-testid="input-description"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>User ID (optional)</Label>
                    <Input
                      type="number"
                      placeholder="User ID"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      data-testid="input-user-id"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Failure Count</Label>
                    <Input
                      type="number"
                      value={failureCount}
                      onChange={(e) => setFailureCount(parseInt(e.target.value) || 0)}
                      min={0}
                      data-testid="input-failure-count"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      checked={userRequestedHelp}
                      onCheckedChange={setUserRequestedHelp}
                      data-testid="switch-help-requested"
                    />
                    <Label>User Requested Help</Label>
                  </div>
                </div>

                <Button
                  onClick={() => processMutation.mutate()}
                  disabled={!description.trim() || processMutation.isPending}
                  className="bg-[#1A365D] hover:bg-[#2a4a7d]"
                  data-testid="button-process"
                >
                  {processMutation.isPending ? "Processing..." : "Run Diagnostics"}
                </Button>

                {processMutation.error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg" data-testid="error-message">
                    {processMutation.error.message}
                  </div>
                )}

                {processMutation.data && (
                  <div className={`p-4 rounded-lg space-y-3 ${
                    processMutation.data.autoFixed ? "bg-green-50" :
                    processMutation.data.emergencyModeActivated ? "bg-purple-50" : "bg-yellow-50"
                  }`} data-testid="process-result">
                    <div className="flex items-center gap-2">
                      {processMutation.data.autoFixed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : processMutation.data.emergencyModeActivated ? (
                        <Lock className="h-5 w-5 text-purple-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                      <span className="font-semibold">
                        {processMutation.data.autoFixed ? "Auto-Fixed" :
                         processMutation.data.emergencyModeActivated ? "Emergency Mode Activated" :
                         "Requires Admin Approval"}
                      </span>
                      {getStatusBadge(processMutation.data.incident.status)}
                      {getRiskBadge(processMutation.data.incident.riskLevel)}
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <p><strong>Cause:</strong> {processMutation.data.incident.cause}</p>
                      <p><strong>Impact:</strong> {processMutation.data.incident.impact}</p>
                      <p><strong>Proposed Fix:</strong> {processMutation.data.incident.proposedFix}</p>
                    </div>

                    {processMutation.data.emergencyActions && (
                      <div className="bg-white p-3 rounded">
                        <p className="font-medium text-purple-700 mb-2">Emergency Actions Taken:</p>
                        <ul className="text-sm space-y-1">
                          {processMutation.data.emergencyActions.map((action, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  Pending Admin Approval
                </CardTitle>
                <CardDescription>
                  One-click approval for escalated critical issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingIncidents && pendingIncidents.length > 0 ? (
                  <div className="space-y-4">
                    {pendingIncidents.map((incident) => (
                      <div key={incident.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg" data-testid={`pending-${incident.incidentId}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getFlowTypeBadge(incident.flowType)}
                            {getRiskBadge(incident.riskLevel)}
                            {incident.emergencyMode && <Badge className="bg-purple-500 text-white">Emergency</Badge>}
                          </div>
                          <span className="text-xs text-gray-500">{incident.incidentId}</span>
                        </div>
                        
                        <div className="space-y-2 text-sm mb-4">
                          <p><strong>ISSUE:</strong> {incident.flowType === "AUTH" ? "User unable to sign in" : "User unable to sign contract"}</p>
                          <p><strong>CAUSE:</strong> {incident.cause}</p>
                          <p><strong>IMPACT:</strong> {incident.impact}</p>
                          <p><strong>PROPOSED FIX:</strong> {incident.proposedFix}</p>
                          <p><strong>RISK LEVEL:</strong> {incident.riskLevel}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => approveMutation.mutate({ incidentId: incident.incidentId, action: "APPROVE" })}
                            disabled={approveMutation.isPending}
                            data-testid={`approve-${incident.incidentId}`}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve & Apply
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => approveMutation.mutate({ incidentId: incident.incidentId, action: "REJECT" })}
                            disabled={approveMutation.isPending}
                            data-testid={`reject-${incident.incidentId}`}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`/api/critical-flow/report/${incident.incidentId}`, "_blank")}
                            data-testid={`report-${incident.incidentId}`}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Report
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p>No incidents pending approval</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Critical Incidents</CardTitle>
                <CardDescription>Complete incident history with audit trail</CardDescription>
              </CardHeader>
              <CardContent>
                {incidentsLoading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : incidents && incidents.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto" data-testid="incidents-list">
                    {incidents.map((incident) => (
                      <div key={incident.id} className="p-3 bg-gray-50 rounded-lg text-sm" data-testid={`incident-${incident.incidentId}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getFlowTypeBadge(incident.flowType)}
                            {getStatusBadge(incident.status)}
                            {getRiskBadge(incident.riskLevel)}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(incident.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p><strong>Cause:</strong> {incident.cause}</p>
                        <p><strong>Fix:</strong> {incident.proposedFix}</p>
                        <div className="mt-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`/api/critical-flow/report/${incident.incidentId}`, "_blank")}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            View Report
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No incidents recorded</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            <Card className="border-2 border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <Lock className="h-5 w-5" />
                  Emergency Mode Activation
                </CardTitle>
                <CardDescription className="text-red-700">
                  For critical path failures: 2+ failures, or user explicitly can't sign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="p-4 bg-red-50 rounded-lg text-sm">
                  <p className="font-semibold mb-2">Emergency Mode will:</p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <Lock className="h-4 w-4" /> Lock document version
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Freeze legal logic
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Preserve audit chain
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" /> Enable manual signing link
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> Enable admin override (logged)
                    </li>
                  </ul>
                </div>

                <Textarea
                  placeholder="Describe the critical issue requiring emergency mode..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  data-testid="input-emergency-description"
                />

                <Button
                  onClick={() => emergencyMutation.mutate()}
                  disabled={!description.trim() || emergencyMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 w-full"
                  data-testid="button-activate-emergency"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {emergencyMutation.isPending ? "Activating..." : "Activate Emergency Mode"}
                </Button>

                {emergencyMutation.data && (
                  <div className="p-4 bg-purple-50 rounded-lg" data-testid="emergency-result">
                    <p className="font-semibold text-purple-800 mb-2">{emergencyMutation.data.message}</p>
                    {emergencyMutation.data.emergencyActions && (
                      <ul className="space-y-1 text-sm">
                        {emergencyMutation.data.emergencyActions.map((action, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>The Governing Rule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-[#1A365D] mb-4">
              The bot may fix plumbing, not authority.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="font-semibold text-green-800 mb-2">Plumbing (Auto-Fixable)</p>
                <ul className="text-sm space-y-1 text-green-700">
                  <li>UI handlers</li>
                  <li>Delivery / PDF loading</li>
                  <li>State sync</li>
                  <li>Webhooks</li>
                  <li>Config mismatches</li>
                </ul>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="font-semibold text-red-800 mb-2">Authority (Never Auto-Fix)</p>
                <ul className="text-sm space-y-1 text-red-700">
                  <li>Identity binding</li>
                  <li>Consent / Legal text</li>
                  <li>Signature meaning</li>
                  <li>Timestamp authority</li>
                  <li>Provider changes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
