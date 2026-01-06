import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, LogOut, FileText, HelpCircle, X } from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";

type LeadStatus = "new" | "contacted" | "in_progress" | "closed";

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-purple-100 text-purple-800",
  closed: "bg-green-100 text-green-800",
};

export default function AffiliateDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"applications" | "requests">("applications");
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // Check auth
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
  });

  useEffect(() => {
    if (!authLoading && (!authData || authData.user?.role !== "affiliate")) {
      setLocation("/affiliate/login");
    }
  }, [authData, authLoading, setLocation]);

  // Fetch assigned leads
  const { data: applications = [] } = useQuery({
    queryKey: ["affiliate-applications"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/applications");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!authData?.user,
  });

  const { data: helpRequests = [] } = useQuery({
    queryKey: ["affiliate-help-requests"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/help-requests");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!authData?.user,
  });

  // Mutations
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes: string }) => {
      const res = await fetch(`/api/affiliate/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-applications"] });
      toast({ title: "Application updated" });
      setSelectedLead(null);
    },
  });

  const updateHelpRequestMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes: string }) => {
      const res = await fetch(`/api/affiliate/help-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-help-requests"] });
      toast({ title: "Request updated" });
      setSelectedLead(null);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      setLocation("/affiliate/login");
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const totalLeads = applications.length + helpRequests.length;
  const activeLeads = [...applications, ...helpRequests].filter(
    (l) => l.status !== "closed"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-brand-navy text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-brand-red" />
            <div>
              <h1 className="font-display text-2xl">Affiliate Portal</h1>
              <p className="text-sm text-gray-400">NavigatorUSA</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">Welcome, {authData?.user?.name}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="border-gray-500 text-gray-300 hover:bg-gray-700"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-brand-navy">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Assigned Leads</p>
                <p className="text-3xl font-bold text-brand-navy">{totalLeads}</p>
              </div>
              <FileText className="h-10 w-10 text-brand-navy/20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-brand-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Leads</p>
                <p className="text-3xl font-bold text-brand-green">{activeLeads}</p>
              </div>
              <HelpCircle className="h-10 w-10 text-brand-green/20" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("applications")}
              className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-wide transition-colors ${
                activeTab === "applications" ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
              data-testid="tab-applications"
            >
              <FileText className="h-4 w-4 inline mr-2" /> 
              Affiliate Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-wide transition-colors ${
                activeTab === "requests" ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
              data-testid="tab-requests"
            >
              <HelpCircle className="h-4 w-4 inline mr-2" /> 
              Help Requests ({helpRequests.length})
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "applications" && (
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No applications assigned to you yet</p>
                ) : (
                  applications.map((app: any) => (
                    <div 
                      key={app.id} 
                      className="bg-gray-50 rounded-lg p-4 border hover:border-brand-navy/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedLead({ ...app, type: "application" })}
                      data-testid={`lead-application-${app.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-brand-navy">{app.name}</h3>
                          <p className="text-sm text-gray-600">{app.companyName}</p>
                          <p className="text-sm text-gray-500">{app.email} | {app.phone}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColors[app.status as LeadStatus]}`}>
                            {app.status}
                          </span>
                          <p className="text-xs text-gray-400 mt-2">
                            {format(new Date(app.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "requests" && (
              <div className="space-y-4">
                {helpRequests.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No help requests assigned to you yet</p>
                ) : (
                  helpRequests.map((req: any) => (
                    <div 
                      key={req.id} 
                      className="bg-gray-50 rounded-lg p-4 border hover:border-brand-navy/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedLead({ ...req, type: "request" })}
                      data-testid={`lead-request-${req.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-brand-navy">{req.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{req.helpType.replace(/_/g, " ")}</p>
                          <p className="text-sm text-gray-500">{req.email} | {req.phone}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColors[req.status as LeadStatus]}`}>
                            {req.status}
                          </span>
                          <p className="text-xs text-gray-400 mt-2">
                            {format(new Date(req.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-brand-navy">
                {selectedLead.type === "application" ? "Affiliate Application" : "Help Request"}
              </h2>
              <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Name</Label>
                  <p className="font-medium">{selectedLead.name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-medium">{selectedLead.email}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Phone</Label>
                  <p className="font-medium">{selectedLead.phone}</p>
                </div>
                {selectedLead.companyName && (
                  <div>
                    <Label className="text-gray-500">Company</Label>
                    <p className="font-medium">{selectedLead.companyName}</p>
                  </div>
                )}
                {selectedLead.helpType && (
                  <div>
                    <Label className="text-gray-500">Help Type</Label>
                    <p className="font-medium capitalize">{selectedLead.helpType.replace(/_/g, " ")}</p>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-gray-500">Description</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedLead.description}</p>
              </div>
              <div>
                <Label htmlFor="status">Update Status</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {["new", "contacted", "in_progress", "closed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedLead({ ...selectedLead, status })}
                      className={`px-4 py-2 rounded-lg font-bold text-sm capitalize transition-colors ${
                        selectedLead.status === status
                          ? "bg-brand-navy text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      data-testid={`button-status-${status}`}
                    >
                      {status.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={selectedLead.notes || ""}
                  onChange={(e) => setSelectedLead({ ...selectedLead, notes: e.target.value })}
                  placeholder="Add notes about this lead..."
                  className="mt-1"
                  data-testid="input-notes"
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedLead(null)}>Cancel</Button>
              <Button 
                onClick={() => {
                  const { type, id, status, notes } = selectedLead;
                  if (type === "application") {
                    updateApplicationMutation.mutate({ id, status, notes });
                  } else {
                    updateHelpRequestMutation.mutate({ id, status, notes });
                  }
                }}
                className="bg-brand-navy"
                data-testid="button-save-lead"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
