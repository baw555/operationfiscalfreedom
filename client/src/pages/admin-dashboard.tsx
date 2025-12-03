import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Shield, LogOut, Users, FileText, HelpCircle, Plus, Search, 
  Filter, ChevronDown, X, Edit, Trash2, Key, Eye 
} from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";

type TabType = "applications" | "requests" | "affiliates";
type LeadStatus = "new" | "contacted" | "in_progress" | "closed";

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-purple-100 text-purple-800",
  closed: "bg-green-100 text-green-800",
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>("applications");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [newAffiliate, setNewAffiliate] = useState({ name: "", email: "", password: "" });

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
    if (!authLoading && (!authData || authData.user?.role !== "admin")) {
      setLocation("/admin/login");
    }
  }, [authData, authLoading, setLocation]);

  // Fetch data
  const { data: applications = [] } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => {
      const res = await fetch("/api/admin/affiliate-applications");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!authData?.user,
  });

  const { data: helpRequests = [] } = useQuery({
    queryKey: ["admin-help-requests"],
    queryFn: async () => {
      const res = await fetch("/api/admin/help-requests");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!authData?.user,
  });

  const { data: affiliates = [] } = useQuery({
    queryKey: ["admin-affiliates"],
    queryFn: async () => {
      const res = await fetch("/api/admin/affiliates");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!authData?.user,
  });

  // Mutations
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const res = await fetch(`/api/admin/affiliate-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      toast({ title: "Application updated" });
      setSelectedLead(null);
    },
  });

  const updateHelpRequestMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const res = await fetch(`/api/admin/help-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-help-requests"] });
      toast({ title: "Request updated" });
      setSelectedLead(null);
    },
  });

  const createAffiliateMutation = useMutation({
    mutationFn: async (data: typeof newAffiliate) => {
      const res = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create affiliate");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      toast({ title: "Affiliate created successfully" });
      setShowAffiliateModal(false);
      setNewAffiliate({ name: "", email: "", password: "" });
    },
    onError: () => {
      toast({ title: "Failed to create affiliate", variant: "destructive" });
    },
  });

  const deleteAffiliateMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/affiliates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      toast({ title: "Affiliate deleted" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      setLocation("/admin/login");
    },
  });

  // Filter leads
  const filterLeads = (leads: any[]) => {
    return leads.filter((lead) => {
      const matchesSearch = 
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-brand-navy text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-brand-green" />
            <div>
              <h1 className="font-display text-2xl">Admin Command Center</h1>
              <p className="text-sm text-gray-400">Operation Fiscal Freedom</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-brand-navy">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Affiliate Applications</p>
                <p className="text-3xl font-bold text-brand-navy">{applications.length}</p>
              </div>
              <FileText className="h-10 w-10 text-brand-navy/20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-brand-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Help Requests</p>
                <p className="text-3xl font-bold text-brand-green">{helpRequests.length}</p>
              </div>
              <HelpCircle className="h-10 w-10 text-brand-green/20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-brand-gold">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Affiliates</p>
                <p className="text-3xl font-bold text-brand-gold">{affiliates.length}</p>
              </div>
              <Users className="h-10 w-10 text-brand-gold/20" />
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
              <FileText className="h-4 w-4 inline mr-2" /> Affiliate Applications
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-wide transition-colors ${
                activeTab === "requests" ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
              data-testid="tab-requests"
            >
              <HelpCircle className="h-4 w-4 inline mr-2" /> Help Requests
            </button>
            <button
              onClick={() => setActiveTab("affiliates")}
              className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-wide transition-colors ${
                activeTab === "affiliates" ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
              data-testid="tab-affiliates"
            >
              <Users className="h-4 w-4 inline mr-2" /> Manage Affiliates
            </button>
          </div>

          {/* Filters */}
          {activeTab !== "affiliates" && (
            <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm min-w-[150px]"
                data-testid="select-status-filter"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {activeTab === "applications" && (
              <div className="space-y-4">
                {filterLeads(applications).length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No applications found</p>
                ) : (
                  filterLeads(applications).map((app: any) => (
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
                {filterLeads(helpRequests).length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No help requests found</p>
                ) : (
                  filterLeads(helpRequests).map((req: any) => (
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

            {activeTab === "affiliates" && (
              <div>
                <div className="flex justify-end mb-4">
                  <Button 
                    onClick={() => setShowAffiliateModal(true)}
                    className="bg-brand-green hover:bg-brand-green/90"
                    data-testid="button-add-affiliate"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Affiliate
                  </Button>
                </div>
                <div className="space-y-4">
                  {affiliates.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No affiliates yet</p>
                  ) : (
                    affiliates.map((affiliate: any) => (
                      <div 
                        key={affiliate.id} 
                        className="bg-gray-50 rounded-lg p-4 border flex items-center justify-between"
                        data-testid={`affiliate-${affiliate.id}`}
                      >
                        <div>
                          <h3 className="font-bold text-brand-navy">{affiliate.name}</h3>
                          <p className="text-sm text-gray-500">{affiliate.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteAffiliateMutation.mutate(affiliate.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            data-testid={`button-delete-affiliate-${affiliate.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={selectedLead.status}
                    onChange={(e) => setSelectedLead({ ...selectedLead, status: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                    data-testid="select-lead-status"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <select
                    id="assignedTo"
                    value={selectedLead.assignedTo || ""}
                    onChange={(e) => setSelectedLead({ ...selectedLead, assignedTo: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                    data-testid="select-assign-to"
                  >
                    <option value="">Unassigned</option>
                    {affiliates.map((aff: any) => (
                      <option key={aff.id} value={aff.id}>{aff.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={selectedLead.notes || ""}
                  onChange={(e) => setSelectedLead({ ...selectedLead, notes: e.target.value })}
                  placeholder="Add internal notes..."
                  className="mt-1"
                  data-testid="input-notes"
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedLead(null)}>Cancel</Button>
              <Button 
                onClick={() => {
                  const { type, ...data } = selectedLead;
                  if (type === "application") {
                    updateApplicationMutation.mutate(data);
                  } else {
                    updateHelpRequestMutation.mutate(data);
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

      {/* Add Affiliate Modal */}
      {showAffiliateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-brand-navy">Add New Affiliate</h2>
              <button onClick={() => setShowAffiliateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="affName">Full Name</Label>
                <Input
                  id="affName"
                  value={newAffiliate.name}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, name: e.target.value })}
                  placeholder="John Smith"
                  data-testid="input-affiliate-name"
                />
              </div>
              <div>
                <Label htmlFor="affEmail">Email</Label>
                <Input
                  id="affEmail"
                  type="email"
                  value={newAffiliate.email}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, email: e.target.value })}
                  placeholder="affiliate@example.com"
                  data-testid="input-affiliate-email"
                />
              </div>
              <div>
                <Label htmlFor="affPassword">Password</Label>
                <Input
                  id="affPassword"
                  type="password"
                  value={newAffiliate.password}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, password: e.target.value })}
                  placeholder="••••••••"
                  data-testid="input-affiliate-password"
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAffiliateModal(false)}>Cancel</Button>
              <Button 
                onClick={() => createAffiliateMutation.mutate(newAffiliate)}
                className="bg-brand-green"
                disabled={createAffiliateMutation.isPending}
                data-testid="button-create-affiliate"
              >
                {createAffiliateMutation.isPending ? "Creating..." : "Create Affiliate"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
