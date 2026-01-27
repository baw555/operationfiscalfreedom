import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Shield, Users, FileText, FolderOpen, Eye, Download, ChevronRight, Camera, IdCard, FileSignature, ClipboardCheck, Receipt, Link2, Store, CreditCard, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AffiliateFile {
  id: number;
  name: string;
  email: string;
  nda?: {
    fullName: string;
    address: string;
    facePhoto?: string;
    idPhoto?: string;
    signatureData?: string;
    signedAt: string;
  };
  contracts?: Array<{
    id: number;
    contractName: string;
    signedAt: string;
    signatureData?: string;
  }>;
  w9?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    taxClassification: string;
    certificationDate: string;
  };
}

export default function MasterPortal() {
  const [, setLocation] = useLocation();
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateFile | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);

  // Check if user is master admin - with retry logic for session timing
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    retry: 6,
    retryDelay: 1000,
  });

  // Fetch all affiliates with their files
  const { data: affiliateFiles = [], isLoading: filesLoading } = useQuery<AffiliateFile[]>({
    queryKey: ["master-affiliate-files"],
    queryFn: async () => {
      const res = await fetch("/api/master/affiliate-files", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
  });

  // Fetch finops referrals
  const { data: finopsReferrals = [], isLoading: referralsLoading } = useQuery<any[]>({
    queryKey: ["finops-referrals"],
    queryFn: async () => {
      const res = await fetch("/api/admin/finops-referrals", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
  });

  // Fetch disability referrals
  const { data: disabilityReferrals = [], isLoading: disabilityLoading } = useQuery<any[]>({
    queryKey: ["disability-referrals"],
    queryFn: async () => {
      const res = await fetch("/api/admin/disability-referrals", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authData?.user?.role === "admin" || authData?.user?.role === "master",
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Access denied for non-admin/master users
  const isAuthorized = authData?.user?.role === "admin" || authData?.user?.role === "master";
  if (!authData || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="text-2xl text-white font-bold">MASTER PORTAL - ACCESS DENIED</div>
          <div className="text-gray-300">
            This portal is restricted to authorized administrators only.
          </div>
          <Button 
            onClick={() => setLocation("/admin/login")} 
            className="mt-4 bg-brand-red hover:bg-brand-red/90"
          >
            Admin Login
          </Button>
        </div>
      </div>
    );
  }

  const viewAffiliateFolder = (affiliate: AffiliateFile) => {
    setSelectedAffiliate(affiliate);
    setShowDocumentViewer(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800">
      {/* Header */}
      <div className="bg-black/30 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-brand-red" />
            <div>
              <h1 className="text-xl font-bold text-white">Master Portal</h1>
              <p className="text-sm text-gray-400">NavigatorUSA Administration</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Logged in as: {authData.user.email}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation("/admin/dashboard")}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Admin Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="files" className="w-full">
          <TabsList className="bg-black/30 border border-white/10">
            <TabsTrigger value="files" className="data-[state=active]:bg-brand-red data-[state=active]:text-white text-gray-400">
              <FolderOpen className="w-4 h-4 mr-2" />
              Files & Agreements
            </TabsTrigger>
            <TabsTrigger value="affiliates" className="data-[state=active]:bg-brand-red data-[state=active]:text-white text-gray-400">
              <Users className="w-4 h-4 mr-2" />
              All Affiliates
            </TabsTrigger>
            <TabsTrigger value="partner-referrals" className="data-[state=active]:bg-brand-red data-[state=active]:text-white text-gray-400">
              <Link2 className="w-4 h-4 mr-2" />
              Partner Referrals
            </TabsTrigger>
            <TabsTrigger value="disability-referrals" className="data-[state=active]:bg-brand-red data-[state=active]:text-white text-gray-400">
              <FileText className="w-4 h-4 mr-2" />
              Disability Referrals
            </TabsTrigger>
          </TabsList>

          {/* Files & Agreements Tab */}
          <TabsContent value="files" className="mt-6">
            <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-black/20">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-brand-red" />
                  Affiliate Document Folders
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  View complete document packages for each affiliate
                </p>
              </div>

              {filesLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading affiliate files...</p>
                </div>
              ) : affiliateFiles.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  No affiliate documents found.
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {affiliateFiles.map((affiliate) => (
                    <div 
                      key={affiliate.id}
                      className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-navy rounded-lg flex items-center justify-center">
                          <FolderOpen className="w-6 h-6 text-brand-red" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{affiliate.name}</h3>
                          <p className="text-sm text-gray-400">{affiliate.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Document status indicators */}
                        <div className="flex items-center gap-2 mr-4">
                          {affiliate.nda?.facePhoto && (
                            <div className="w-8 h-8 bg-green-600/20 rounded flex items-center justify-center" title="Face Photo">
                              <Camera className="w-4 h-4 text-green-500" />
                            </div>
                          )}
                          {affiliate.nda?.idPhoto && (
                            <div className="w-8 h-8 bg-green-600/20 rounded flex items-center justify-center" title="ID Photo">
                              <IdCard className="w-4 h-4 text-green-500" />
                            </div>
                          )}
                          {affiliate.nda && (
                            <div className="w-8 h-8 bg-green-600/20 rounded flex items-center justify-center" title="NDA Signed">
                              <FileSignature className="w-4 h-4 text-green-500" />
                            </div>
                          )}
                          {affiliate.contracts && affiliate.contracts.length > 0 && (
                            <div className="w-8 h-8 bg-green-600/20 rounded flex items-center justify-center" title={`${affiliate.contracts.length} Contract(s)`}>
                              <ClipboardCheck className="w-4 h-4 text-green-500" />
                            </div>
                          )}
                          {affiliate.w9 && (
                            <div className="w-8 h-8 bg-green-600/20 rounded flex items-center justify-center" title="W9 Submitted">
                              <Receipt className="w-4 h-4 text-green-500" />
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => viewAffiliateFolder(affiliate)}
                          className="bg-brand-red hover:bg-brand-red/90"
                          data-testid={`button-view-folder-${affiliate.id}`}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Folder
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Affiliates Tab */}
          <TabsContent value="affiliates" className="mt-6">
            <div className="bg-black/20 rounded-lg border border-white/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4">All Registered Affiliates</h2>
              <p className="text-gray-400">Coming soon - full affiliate management</p>
            </div>
          </TabsContent>

          {/* Partner Referrals Tab */}
          <TabsContent value="partner-referrals" className="mt-6">
            <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-black/20">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-brand-red" />
                  Partner Referral Tracking
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Track all clicks and signups from affiliate referral links to partner services
                </p>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b border-white/10">
                <div className="bg-brand-gold/20 rounded-lg p-4 text-center">
                  <Store className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {finopsReferrals.filter(r => r.partnerType === 'my_locker').length}
                  </div>
                  <div className="text-xs text-gray-400">MY LOCKER Clicks</div>
                </div>
                <div className="bg-brand-red/20 rounded-lg p-4 text-center">
                  <CreditCard className="w-8 h-8 text-brand-red mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {finopsReferrals.filter(r => r.partnerType === 'merchant_services').length}
                  </div>
                  <div className="text-xs text-gray-400">Merchant Clicks</div>
                </div>
                <div className="bg-brand-blue/20 rounded-lg p-4 text-center">
                  <Gift className="w-8 h-8 text-brand-blue mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {finopsReferrals.filter(r => r.partnerType === 'vgift_cards').length}
                  </div>
                  <div className="text-xs text-gray-400">vGift Card Clicks</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Link2 className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {finopsReferrals.length}
                  </div>
                  <div className="text-xs text-gray-400">Total Referrals</div>
                </div>
              </div>

              {referralsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading referrals...</p>
                </div>
              ) : finopsReferrals.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  No partner referrals tracked yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/30 text-left">
                      <tr>
                        <th className="px-4 py-3 text-gray-400 font-medium text-sm">Date</th>
                        <th className="px-4 py-3 text-gray-400 font-medium text-sm">Partner</th>
                        <th className="px-4 py-3 text-gray-400 font-medium text-sm">Affiliate</th>
                        <th className="px-4 py-3 text-gray-400 font-medium text-sm">Referral Code</th>
                        <th className="px-4 py-3 text-gray-400 font-medium text-sm">Status</th>
                        <th className="px-4 py-3 text-gray-400 font-medium text-sm">IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {finopsReferrals.map((referral: any) => (
                        <tr key={referral.id} className="hover:bg-white/5">
                          <td className="px-4 py-3 text-white text-sm">
                            {new Date(referral.createdAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                              referral.partnerType === 'my_locker' ? 'bg-brand-gold/20 text-brand-gold' :
                              referral.partnerType === 'merchant_services' ? 'bg-brand-red/20 text-brand-red' :
                              'bg-brand-blue/20 text-brand-blue'
                            }`}>
                              {referral.partnerType === 'my_locker' && <Store className="w-3 h-3" />}
                              {referral.partnerType === 'merchant_services' && <CreditCard className="w-3 h-3" />}
                              {referral.partnerType === 'vgift_cards' && <Gift className="w-3 h-3" />}
                              {referral.partnerType.replace(/_/g, ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-white text-sm">
                            {referral.affiliateName || <span className="text-gray-500">Direct</span>}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-sm font-mono">
                            {referral.referralCode || '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              referral.status === 'clicked' ? 'bg-yellow-500/20 text-yellow-400' :
                              referral.status === 'registered' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {referral.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs font-mono">
                            {referral.visitorIp?.substring(0, 15)}...
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Disability Referrals Tab */}
          <TabsContent value="disability-referrals" className="mt-6">
            <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-black/20">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-red" />
                  Disability Claim Referrals
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Track veteran disability claim intake submissions from affiliates
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 border-b border-white/10">
                <div className="bg-green-500/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {disabilityReferrals.filter((r: any) => r.claimType === 'initial').length}
                  </div>
                  <div className="text-xs text-gray-400">Initial Claims</div>
                </div>
                <div className="bg-brand-red/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-brand-red">
                    {disabilityReferrals.filter((r: any) => r.claimType === 'increase').length}
                  </div>
                  <div className="text-xs text-gray-400">Rating Increase</div>
                </div>
                <div className="bg-yellow-500/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {disabilityReferrals.filter((r: any) => r.claimType === 'denial').length}
                  </div>
                  <div className="text-xs text-gray-400">Denial Appeals</div>
                </div>
                <div className="bg-brand-blue/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-brand-blue">
                    {disabilityReferrals.filter((r: any) => r.claimType === 'ssdi').length}
                  </div>
                  <div className="text-xs text-gray-400">SSDI Claims</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {disabilityReferrals.length}
                  </div>
                  <div className="text-xs text-gray-400">Total Referrals</div>
                </div>
              </div>

              {disabilityLoading ? (
                <div className="p-8 text-center text-gray-400">Loading referrals...</div>
              ) : disabilityReferrals.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  No disability referrals tracked yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/20">
                      <tr>
                        <th className="text-left text-gray-400 px-4 py-3 text-sm font-medium">Date</th>
                        <th className="text-left text-gray-400 px-4 py-3 text-sm font-medium">Veteran</th>
                        <th className="text-left text-gray-400 px-4 py-3 text-sm font-medium">Claim Type</th>
                        <th className="text-left text-gray-400 px-4 py-3 text-sm font-medium">Current Rating</th>
                        <th className="text-left text-gray-400 px-4 py-3 text-sm font-medium">Affiliate</th>
                        <th className="text-left text-gray-400 px-4 py-3 text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {disabilityReferrals.map((referral: any) => (
                        <tr key={referral.id} className="hover:bg-white/5">
                          <td className="px-4 py-3 text-white text-sm">
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-white text-sm font-medium">
                              {referral.firstName} {referral.lastName}
                            </div>
                            <div className="text-gray-400 text-xs">{referral.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              referral.claimType === 'initial' ? 'bg-green-500/20 text-green-400' :
                              referral.claimType === 'increase' ? 'bg-brand-red/20 text-brand-red' :
                              referral.claimType === 'denial' ? 'bg-yellow-500/20 text-yellow-400' :
                              referral.claimType === 'ssdi' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-purple-500/20 text-purple-400'
                            }`}>
                              {referral.claimType}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-white text-sm">
                            {referral.currentRating ? `${referral.currentRating}%` : 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            {referral.referralCode ? (
                              <span className="text-brand-red text-sm font-mono">{referral.referralCode}</span>
                            ) : (
                              <span className="text-gray-500 text-sm">Direct</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              referral.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                              referral.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                              referral.status === 'in_progress' ? 'bg-purple-500/20 text-purple-400' :
                              referral.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {referral.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Document Viewer Dialog */}
      <Dialog open={showDocumentViewer} onOpenChange={setShowDocumentViewer}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FolderOpen className="w-6 h-6 text-brand-red" />
              {selectedAffiliate?.name}'s Document Folder
            </DialogTitle>
          </DialogHeader>

          {selectedAffiliate && (
            <div className="space-y-6 mt-4">
              {/* Face Photo Section */}
              {selectedAffiliate.nda?.facePhoto && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                    <Camera className="w-5 h-5 text-brand-red" />
                    Face Photo
                  </h3>
                  <img 
                    src={selectedAffiliate.nda.facePhoto} 
                    alt="Face Photo" 
                    className="max-w-xs rounded-lg border border-white/20"
                    data-testid="img-face-photo"
                  />
                </div>
              )}

              {/* ID Photo Section */}
              {selectedAffiliate.nda?.idPhoto && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                    <IdCard className="w-5 h-5 text-brand-red" />
                    Government ID
                  </h3>
                  <img 
                    src={selectedAffiliate.nda.idPhoto} 
                    alt="ID Photo" 
                    className="max-w-md rounded-lg border border-white/20"
                    data-testid="img-id-photo"
                  />
                </div>
              )}

              {/* NDA Section */}
              {selectedAffiliate.nda && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                    <FileSignature className="w-5 h-5 text-brand-red" />
                    NDA / Confidentiality Agreement
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Full Name:</span>
                      <p className="text-white">{selectedAffiliate.nda.fullName}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Address:</span>
                      <p className="text-white">{selectedAffiliate.nda.address}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Signed On:</span>
                      <p className="text-white">{new Date(selectedAffiliate.nda.signedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedAffiliate.nda.signatureData && (
                    <div className="mt-4">
                      <span className="text-gray-400 text-sm">Signature:</span>
                      <img 
                        src={selectedAffiliate.nda.signatureData} 
                        alt="NDA Signature" 
                        className="bg-white rounded mt-2 max-w-xs"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Contracts Section */}
              {selectedAffiliate.contracts && selectedAffiliate.contracts.length > 0 && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                    <ClipboardCheck className="w-5 h-5 text-brand-red" />
                    Signed Contracts ({selectedAffiliate.contracts.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedAffiliate.contracts.map((contract) => (
                      <div key={contract.id} className="bg-black/20 rounded p-3 border border-white/5">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white">{contract.contractName}</span>
                          <span className="text-sm text-gray-400">
                            Signed: {new Date(contract.signedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* W9 Section */}
              {selectedAffiliate.w9 && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                    <Receipt className="w-5 h-5 text-brand-red" />
                    W-9 Tax Form
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Name:</span>
                      <p className="text-white">{selectedAffiliate.w9.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Tax Classification:</span>
                      <p className="text-white capitalize">{selectedAffiliate.w9.taxClassification.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400">Address:</span>
                      <p className="text-white">
                        {selectedAffiliate.w9.address}, {selectedAffiliate.w9.city}, {selectedAffiliate.w9.state} {selectedAffiliate.w9.zip}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Certified On:</span>
                      <p className="text-white">{new Date(selectedAffiliate.w9.certificationDate).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* No documents message */}
              {!selectedAffiliate.nda && (!selectedAffiliate.contracts || selectedAffiliate.contracts.length === 0) && !selectedAffiliate.w9 && (
                <div className="text-center text-gray-400 py-8">
                  No documents found for this affiliate.
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
