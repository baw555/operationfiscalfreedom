import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAutoLogout } from "@/hooks/use-auto-logout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Shield, LogOut, Users, FileText, HelpCircle, Plus, Search, 
  Filter, ChevronDown, X, Edit, Trash2, Key, Eye, TrendingUp, 
  Stethoscope, Globe, Mail, Home, DollarSign, Briefcase
} from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";

type MainTabType = "applications" | "requests" | "investors" | "affiliates";
type RequestSubType = "get_help" | "startup_grant" | "furniture" | "private_doctor" | "website" | "general_contact";
type LeadStatus = "new" | "contacted" | "in_progress" | "closed";

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-purple-100 text-purple-800",
  closed: "bg-green-100 text-green-800",
};

const requestSubTabs: { key: RequestSubType; label: string; icon: any }[] = [
  { key: "get_help", label: "Get Help", icon: HelpCircle },
  { key: "startup_grant", label: "Startup Grant", icon: DollarSign },
  { key: "furniture", label: "Furniture", icon: Home },
  { key: "private_doctor", label: "Private Doctor", icon: Stethoscope },
  { key: "website", label: "Website", icon: Globe },
  { key: "general_contact", label: "General Contact", icon: Mail },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  useAutoLogout("/admin/login");
  const [activeTab, setActiveTab] = useState<MainTabType>("applications");
  const [requestSubTab, setRequestSubTab] = useState<RequestSubType>("get_help");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [newAffiliate, setNewAffiliate] = useState({ name: "", email: "", password: "" });

  // Proper authentication check
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    retry: 3,
    retryDelay: 500,
  });

  // Redirect to login if not authenticated or not admin/master
  useEffect(() => {
    if (!authLoading && (!authData?.user || (authData.user.role !== "admin" && authData.user.role !== "master"))) {
      setLocation("/admin/login");
    }
  }, [authData, authLoading, setLocation]);

  // Fetch data - existing
  const { data: applications = [] } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => {
      const res = await fetch("/api/admin/affiliate-applications", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!authData?.user,
  });

  const { data: helpRequests = [] } = useQuery({
    queryKey: ["admin-help-requests"],
    queryFn: async () => {
      const res = await fetch("/api/admin/help-requests", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!authData?.user,
  });

  const { data: affiliates = [] } = useQuery({
    queryKey: ["admin-affiliates"],
    queryFn: async () => {
      const res = await fetch("/api/admin/affiliates", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!authData?.user,
  });

  // Fetch new data types
  const { data: investorSubmissions = [] } = useQuery({
    queryKey: ["admin-investor-submissions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/investor-submissions", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!authData?.user,
  });

  const { data: privateDoctorRequests = [] } = useQuery({
    queryKey: ["admin-private-doctor-requests"],
    queryFn: async () => {
      const res = await fetch("/api/admin/private-doctor-requests", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!authData?.user,
  });

  const { data: websiteApplications = [] } = useQuery({
    queryKey: ["admin-website-applications"],
    queryFn: async () => {
      const res = await fetch("/api/admin/website-applications", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!authData?.user,
  });

  const { data: generalContacts = [] } = useQuery({
    queryKey: ["admin-general-contact"],
    queryFn: async () => {
      const res = await fetch("/api/admin/general-contact", { credentials: "include" });
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
        credentials: "include",
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
        credentials: "include",
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

  const updateInvestorMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const res = await fetch(`/api/admin/investor-submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-investor-submissions"] });
      toast({ title: "Investor submission updated" });
      setSelectedLead(null);
    },
  });

  const updatePrivateDoctorMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const res = await fetch(`/api/admin/private-doctor-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-private-doctor-requests"] });
      toast({ title: "Request updated" });
      setSelectedLead(null);
    },
  });

  const updateWebsiteMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const res = await fetch(`/api/admin/website-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-website-applications"] });
      toast({ title: "Application updated" });
      setSelectedLead(null);
    },
  });

  const updateGeneralContactMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const res = await fetch(`/api/admin/general-contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-general-contact"] });
      toast({ title: "Contact updated" });
      setSelectedLead(null);
    },
  });

  const createAffiliateMutation = useMutation({
    mutationFn: async (data: typeof newAffiliate) => {
      const res = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
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
      const res = await fetch(`/api/admin/affiliates/${id}`, { method: "DELETE", credentials: "include" });
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
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    },
    onSuccess: () => {
      setLocation("/admin/login");
    },
  });

  // Filter leads
  const filterLeads = (leads: any[]) => {
    return leads.filter((lead) => {
      const searchFields = [
        lead.name, lead.firstName, lead.lastName, lead.email, lead.companyName, lead.businessName
      ].filter(Boolean).join(" ").toLowerCase();
      const matchesSearch = searchFields.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  // Get current request data based on sub-tab
  const getCurrentRequestData = () => {
    switch (requestSubTab) {
      case "get_help":
        return { data: helpRequests, type: "help_request" };
      case "startup_grant":
        return { data: helpRequests.filter((r: any) => r.helpType === "startup_grant"), type: "help_request" };
      case "furniture":
        return { data: helpRequests.filter((r: any) => r.helpType === "furniture"), type: "help_request" };
      case "private_doctor":
        return { data: privateDoctorRequests, type: "private_doctor" };
      case "website":
        return { data: websiteApplications, type: "website" };
      case "general_contact":
        return { data: generalContacts, type: "general_contact" };
      default:
        return { data: [], type: "" };
    }
  };

  // Get total counts for stats
  const totalRequests = helpRequests.length + privateDoctorRequests.length + websiteApplications.length + generalContacts.length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't render dashboard if not authorized (will redirect via useEffect)
  if (!authData?.user || (authData.user.role !== "admin" && authData.user.role !== "master")) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-brand-navy text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-brand-red" />
            <div>
              <h1 className="font-display text-xl sm:text-2xl">Admin Command Center</h1>
              <p className="text-sm text-gray-400">NavigatorUSA</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300 hidden sm:inline">Welcome, {authData?.user?.name}</span>
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

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4 border-brand-navy">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Affiliate Apps</p>
                <p className="text-2xl sm:text-3xl font-bold text-brand-navy">{applications.length}</p>
              </div>
              <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-brand-navy/20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4 border-brand-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">All Requests</p>
                <p className="text-2xl sm:text-3xl font-bold text-brand-green">{totalRequests}</p>
              </div>
              <HelpCircle className="h-8 w-8 sm:h-10 sm:w-10 text-brand-green/20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Investor Leads</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">{investorSubmissions.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500/20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4 border-brand-gold">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Affiliates</p>
                <p className="text-2xl sm:text-3xl font-bold text-brand-gold">{affiliates.length}</p>
              </div>
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-brand-gold/20" />
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-wrap border-b">
            <button
              onClick={() => setActiveTab("applications")}
              className={`flex-1 min-w-[120px] py-3 sm:py-4 px-3 sm:px-6 font-bold text-xs sm:text-sm uppercase tracking-wide transition-colors ${
                activeTab === "applications" ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
              data-testid="tab-applications"
            >
              <FileText className="h-4 w-4 inline mr-1 sm:mr-2" /> 
              <span className="hidden sm:inline">Affiliate Apps</span>
              <span className="sm:hidden">Apps</span>
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 min-w-[120px] py-3 sm:py-4 px-3 sm:px-6 font-bold text-xs sm:text-sm uppercase tracking-wide transition-colors ${
                activeTab === "requests" ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
              data-testid="tab-requests"
            >
              <HelpCircle className="h-4 w-4 inline mr-1 sm:mr-2" /> 
              <span className="hidden sm:inline">Help Requests</span>
              <span className="sm:hidden">Requests</span>
            </button>
            <button
              onClick={() => setActiveTab("investors")}
              className={`flex-1 min-w-[120px] py-3 sm:py-4 px-3 sm:px-6 font-bold text-xs sm:text-sm uppercase tracking-wide transition-colors ${
                activeTab === "investors" ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
              data-testid="tab-investors"
            >
              <TrendingUp className="h-4 w-4 inline mr-1 sm:mr-2" /> 
              <span className="hidden sm:inline">Investors</span>
              <span className="sm:hidden">Invest</span>
            </button>
            <button
              onClick={() => setActiveTab("affiliates")}
              className={`flex-1 min-w-[120px] py-3 sm:py-4 px-3 sm:px-6 font-bold text-xs sm:text-sm uppercase tracking-wide transition-colors ${
                activeTab === "affiliates" ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
              data-testid="tab-affiliates"
            >
              <Users className="h-4 w-4 inline mr-1 sm:mr-2" /> 
              <span className="hidden sm:inline">Manage Affiliates</span>
              <span className="sm:hidden">Team</span>
            </button>
          </div>

          {/* Sub-tabs for Requests */}
          {activeTab === "requests" && (
            <div className="bg-gray-100 border-b overflow-x-auto">
              <div className="flex min-w-max">
                {requestSubTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setRequestSubTab(tab.key)}
                    className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 sm:gap-2 ${
                      requestSubTab === tab.key 
                        ? "bg-white text-brand-navy border-b-2 border-brand-navy" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    data-testid={`subtab-${tab.key}`}
                  >
                    <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    {tab.label}
                    <span className="ml-1 px-1.5 py-0.5 bg-gray-200 rounded-full text-xs">
                      {tab.key === "get_help" && helpRequests.length}
                      {tab.key === "startup_grant" && helpRequests.filter((r: any) => r.helpType === "startup_grant").length}
                      {tab.key === "furniture" && helpRequests.filter((r: any) => r.helpType === "furniture").length}
                      {tab.key === "private_doctor" && privateDoctorRequests.length}
                      {tab.key === "website" && websiteApplications.length}
                      {tab.key === "general_contact" && generalContacts.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

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
                className="h-10 rounded-md border border-gray-300 bg-white text-brand-navy px-3 py-2 text-sm min-w-[150px] focus:outline-none focus:ring-2 focus:ring-brand-red"
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
          <div className="p-4 sm:p-6">
            {/* Affiliate Applications Tab */}
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
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-brand-navy truncate">{app.name}</h3>
                          <p className="text-sm text-gray-600 truncate">{app.companyName}</p>
                          <p className="text-sm text-gray-500 truncate">{app.email} | {app.phone}</p>
                        </div>
                        <div className="text-right shrink-0">
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

            {/* Help Requests Tab with Sub-navigation */}
            {activeTab === "requests" && (
              <div className="space-y-4">
                {(() => {
                  const { data, type } = getCurrentRequestData();
                  const filteredData = filterLeads(data);
                  
                  if (filteredData.length === 0) {
                    return <p className="text-center text-gray-500 py-8">No requests found</p>;
                  }

                  return filteredData.map((item: any) => (
                    <div 
                      key={item.id} 
                      className="bg-gray-50 rounded-lg p-4 border hover:border-brand-navy/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedLead({ ...item, type })}
                      data-testid={`lead-${type}-${item.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-brand-navy truncate">
                            {item.name || `${item.firstName} ${item.lastName}`}
                          </h3>
                          {item.helpType && (
                            <p className="text-sm text-gray-600 capitalize">{item.helpType.replace(/_/g, " ")}</p>
                          )}
                          {item.businessName && (
                            <p className="text-sm text-gray-600">{item.businessName}</p>
                          )}
                          {item.careType && (
                            <p className="text-sm text-gray-600 capitalize">{item.careType} Care</p>
                          )}
                          {item.subject && (
                            <p className="text-sm text-gray-600">{item.subject}</p>
                          )}
                          <p className="text-sm text-gray-500 truncate">{item.email} | {item.phone}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColors[item.status as LeadStatus]}`}>
                            {item.status}
                          </span>
                          <p className="text-xs text-gray-400 mt-2">
                            {format(new Date(item.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}

            {/* Investor Submissions Tab */}
            {activeTab === "investors" && (
              <div className="space-y-4">
                {filterLeads(investorSubmissions).length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No investor submissions found</p>
                ) : (
                  filterLeads(investorSubmissions).map((inv: any) => (
                    <div 
                      key={inv.id} 
                      className="bg-gray-50 rounded-lg p-4 border hover:border-brand-navy/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedLead({ ...inv, type: "investor" })}
                      data-testid={`lead-investor-${inv.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-brand-navy truncate">{inv.firstName} {inv.lastName}</h3>
                          {inv.companyName && (
                            <p className="text-sm text-gray-600 truncate">{inv.companyName}</p>
                          )}
                          <p className="text-sm text-purple-600 capitalize">{inv.investmentInterest?.replace(/_/g, " ")}</p>
                          <p className="text-sm text-gray-500 truncate">{inv.email} | {inv.phone}</p>
                          <p className="text-sm font-medium text-green-600">{inv.investmentRange?.replace(/_/g, " ").replace("k", "K")}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColors[inv.status as LeadStatus]}`}>
                            {inv.status}
                          </span>
                          <p className="text-xs text-gray-400 mt-2">
                            {format(new Date(inv.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Manage Affiliates Tab */}
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
            <div className="p-4 sm:p-6 border-b flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-brand-navy">
                {selectedLead.type === "application" && "Affiliate Application"}
                {selectedLead.type === "help_request" && "Help Request"}
                {selectedLead.type === "investor" && "Investor Submission"}
                {selectedLead.type === "private_doctor" && "Private Doctor Request"}
                {selectedLead.type === "website" && "Website Application"}
                {selectedLead.type === "general_contact" && "General Contact"}
              </h2>
              <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Name</Label>
                  <p className="font-medium">{selectedLead.name || `${selectedLead.firstName} ${selectedLead.lastName}`}</p>
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
                {selectedLead.businessName && (
                  <div>
                    <Label className="text-gray-500">Business Name</Label>
                    <p className="font-medium">{selectedLead.businessName}</p>
                  </div>
                )}
                {selectedLead.helpType && (
                  <div>
                    <Label className="text-gray-500">Help Type</Label>
                    <p className="font-medium capitalize">{selectedLead.helpType.replace(/_/g, " ")}</p>
                  </div>
                )}
                {selectedLead.investmentInterest && (
                  <div>
                    <Label className="text-gray-500">Investment Interest</Label>
                    <p className="font-medium capitalize">{selectedLead.investmentInterest.replace(/_/g, " ")}</p>
                  </div>
                )}
                {selectedLead.investmentRange && (
                  <div>
                    <Label className="text-gray-500">Investment Range</Label>
                    <p className="font-medium">{selectedLead.investmentRange.replace(/_/g, " ").replace("k", "K")}</p>
                  </div>
                )}
                {selectedLead.careType && (
                  <div>
                    <Label className="text-gray-500">Care Type</Label>
                    <p className="font-medium capitalize">{selectedLead.careType}</p>
                  </div>
                )}
                {selectedLead.branch && (
                  <div>
                    <Label className="text-gray-500">Branch</Label>
                    <p className="font-medium capitalize">{selectedLead.branch}</p>
                  </div>
                )}
                {selectedLead.zip && (
                  <div>
                    <Label className="text-gray-500">ZIP Code</Label>
                    <p className="font-medium">{selectedLead.zip}</p>
                  </div>
                )}
                {selectedLead.industry && (
                  <div>
                    <Label className="text-gray-500">Industry</Label>
                    <p className="font-medium capitalize">{selectedLead.industry}</p>
                  </div>
                )}
                {selectedLead.subject && (
                  <div>
                    <Label className="text-gray-500">Subject</Label>
                    <p className="font-medium">{selectedLead.subject}</p>
                  </div>
                )}
              </div>
              {(selectedLead.description || selectedLead.message || selectedLead.situation || selectedLead.websiteNeeds) && (
                <div>
                  <Label className="text-gray-500">Details</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                    {selectedLead.description || selectedLead.message || selectedLead.situation || selectedLead.websiteNeeds}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={selectedLead.status}
                    onChange={(e) => setSelectedLead({ ...selectedLead, status: e.target.value })}
                    className="w-full h-10 rounded-md border border-gray-300 bg-white text-brand-navy px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-brand-red"
                    data-testid="select-lead-status"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                {(selectedLead.type === "application" || selectedLead.type === "help_request") && (
                  <div>
                    <Label htmlFor="assignedTo">Assign To</Label>
                    <select
                      id="assignedTo"
                      value={selectedLead.assignedTo || ""}
                      onChange={(e) => setSelectedLead({ ...selectedLead, assignedTo: e.target.value ? parseInt(e.target.value) : null })}
                      className="w-full h-10 rounded-md border border-gray-300 bg-white text-brand-navy px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-brand-red"
                      data-testid="select-assign-to"
                    >
                      <option value="">Unassigned</option>
                      {affiliates.map((aff: any) => (
                        <option key={aff.id} value={aff.id}>{aff.name}</option>
                      ))}
                    </select>
                  </div>
                )}
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
            <div className="p-4 sm:p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedLead(null)}>Cancel</Button>
              <Button 
                onClick={() => {
                  const { type, ...data } = selectedLead;
                  switch (type) {
                    case "application":
                      updateApplicationMutation.mutate(data);
                      break;
                    case "help_request":
                      updateHelpRequestMutation.mutate(data);
                      break;
                    case "investor":
                      updateInvestorMutation.mutate(data);
                      break;
                    case "private_doctor":
                      updatePrivateDoctorMutation.mutate(data);
                      break;
                    case "website":
                      updateWebsiteMutation.mutate(data);
                      break;
                    case "general_contact":
                      updateGeneralContactMutation.mutate(data);
                      break;
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
                  name="affPassword"
                  type="password"
                  autoComplete="new-password"
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
