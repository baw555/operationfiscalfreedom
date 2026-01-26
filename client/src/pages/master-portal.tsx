import { Layout } from "@/components/layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Users, DollarSign, TrendingUp, Building2, Shield, ChevronDown, ChevronRight, FileText, Download, Calculator, Send, UserPlus, X } from "lucide-react";

type Affiliate = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  referralCode: string;
  role: string;
  status: string;
  totalLeads: number | null;
  totalSales: number | null;
  totalCommissions: number | null;
  level1Id: number | null;
  level2Id: number | null;
  level3Id: number | null;
  level4Id: number | null;
  level5Id: number | null;
  level6Id: number | null;
  level7Id: number | null;
  createdAt: string;
};

type Sale = {
  id: number;
  opportunityId: number | null;
  affiliateId: number | null;
  clientName: string;
  clientEmail: string | null;
  saleAmount: number;
  status: string;
  createdAt: string;
};

type VeteranIntake = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  programType: string;
  status: string;
  createdAt: string;
};

type BusinessIntake = {
  id: number;
  businessName: string;
  contactName: string;
  email: string;
  serviceType: string;
  status: string;
  createdAt: string;
};

type SignedAgreement = {
  id: number;
  contractTemplateId: number;
  affiliateId: number;
  affiliateName: string;
  affiliateEmail: string;
  signedAt: string;
  status: string;
  physicalAddress: string | null;
  recruitedBy: string | null;
};

export default function MasterPortal() {
  const [tab, setTab] = useState<"overview" | "affiliates" | "sales" | "veterans" | "businesses" | "opportunities" | "files" | "compplan" | "vso">("overview");
  const [selectedVsoAffiliate, setSelectedVsoAffiliate] = useState<number | null>(null);
  const [calcGrossRevenue, setCalcGrossRevenue] = useState<number>(100000);
  const [calcContractRate, setCalcContractRate] = useState<number>(18);
  const [calcUplineCount, setCalcUplineCount] = useState<number>(0);
  const [calcRecruiter, setCalcRecruiter] = useState<boolean>(true);
  const [expandedAffiliate, setExpandedAffiliate] = useState<number | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<any | null>(null);
  const [viewingAgreement, setViewingAgreement] = useState<SignedAgreement | null>(null);
  const queryClient = useQueryClient();

  const { data: affiliates = [], isLoading: loadingAffiliates } = useQuery<Affiliate[]>({
    queryKey: ["/api/master/affiliates"],
  });

  const { data: sales = [], isLoading: loadingSales } = useQuery<Sale[]>({
    queryKey: ["/api/master/sales"],
  });

  const { data: veteranIntakes = [] } = useQuery<VeteranIntake[]>({
    queryKey: ["/api/admin/veteran-intakes"],
  });

  const { data: businessIntakes = [] } = useQuery<BusinessIntake[]>({
    queryKey: ["/api/admin/business-intakes"],
  });

  const { data: opportunities = [] } = useQuery<any[]>({
    queryKey: ["/api/opportunities"],
  });

  const { data: signedAgreements = [] } = useQuery<SignedAgreement[]>({
    queryKey: ["/api/contracts/signed"],
  });

  const { data: contractTemplates = [] } = useQuery<any[]>({
    queryKey: ["/api/contracts/templates"],
  });

  const promoteMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      const res = await fetch(`/api/master/promote/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/master/affiliates"] });
    },
  });

  const totalSalesAmount = sales.reduce((acc, s) => acc + (s.saleAmount || 0), 0);
  const masterAffiliates = affiliates.filter((a) => a.role === "master");
  const subMasterAffiliates = affiliates.filter((a) => a.role === "sub_master");
  const regularAffiliates = affiliates.filter((a) => a.role === "affiliate");

  const getDownlineCount = (affiliateId: number) => {
    return affiliates.filter(
      (a) =>
        a.level1Id === affiliateId ||
        a.level2Id === affiliateId ||
        a.level3Id === affiliateId ||
        a.level4Id === affiliateId ||
        a.level5Id === affiliateId ||
        a.level6Id === affiliateId ||
        a.level7Id === affiliateId
    ).length;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8" data-testid="master-portal-container">
        <div className="flex items-center gap-4 mb-8">
          <Shield className="w-10 h-10 text-brand-red" />
          <div>
            <h1 className="text-3xl font-bold text-brand-navy" data-testid="text-master-portal-title">Master Portal</h1>
            <p className="text-gray-600">Complete ecosystem management - 7 levels deep</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 border-b">
          {[
            { key: "overview", label: "Overview" },
            { key: "affiliates", label: "Affiliates" },
            { key: "sales", label: "Sales" },
            { key: "veterans", label: "Veteran Intake" },
            { key: "businesses", label: "Business Intake" },
            { key: "opportunities", label: "Opportunities" },
            { key: "files", label: "Files/Agreements" },
            { key: "compplan", label: "Comp Plan" },
            { key: "vso", label: "VSO Revenue" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                tab === t.key ? "border-brand-red text-brand-red" : "border-transparent text-gray-600 hover:text-brand-navy"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{affiliates.length}</p>
                    <p className="text-sm text-gray-600">Total Affiliates</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">${(totalSalesAmount / 100).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Sales</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{veteranIntakes.length}</p>
                    <p className="text-sm text-gray-600">Veteran Intakes</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{businessIntakes.length}</p>
                    <p className="text-sm text-gray-600">Business Intakes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-bold text-brand-red mb-2">Masters ({masterAffiliates.length})</h3>
                <ul className="text-sm space-y-1">
                  {masterAffiliates.slice(0, 5).map((a) => (
                    <li key={a.id}>{a.name} - {a.referralCode}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-blue-700 mb-2">Sub-Masters ({subMasterAffiliates.length})</h3>
                <ul className="text-sm space-y-1">
                  {subMasterAffiliates.slice(0, 5).map((a) => (
                    <li key={a.id}>{a.name} - {getDownlineCount(a.id)} downline</li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-700 mb-2">Affiliates ({regularAffiliates.length})</h3>
                <ul className="text-sm space-y-1">
                  {regularAffiliates.slice(0, 5).map((a) => (
                    <li key={a.id}>{a.name} - {a.totalLeads || 0} leads</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "affiliates" && (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Code</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Downline</th>
                  <th className="p-3 text-left">Leads</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((aff) => (
                  <tr key={aff.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <button
                        onClick={() => setExpandedAffiliate(expandedAffiliate === aff.id ? null : aff.id)}
                        className="flex items-center gap-2"
                      >
                        {expandedAffiliate === aff.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        {aff.name}
                      </button>
                    </td>
                    <td className="p-3">{aff.email}</td>
                    <td className="p-3 font-mono text-xs">{aff.referralCode}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          aff.role === "master"
                            ? "bg-red-100 text-red-700"
                            : aff.role === "sub_master"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {aff.role}
                      </span>
                    </td>
                    <td className="p-3">{getDownlineCount(aff.id)}</td>
                    <td className="p-3">{aff.totalLeads || 0}</td>
                    <td className="p-3">
                      <select
                        value={aff.role}
                        onChange={(e) => promoteMutation.mutate({ id: aff.id, role: e.target.value })}
                        className="border rounded p-1 text-xs"
                      >
                        <option value="affiliate">Affiliate</option>
                        <option value="sub_master">Sub-Master</option>
                        <option value="master">Master</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "sales" && (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Client</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">No sales yet</td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{sale.id}</td>
                      <td className="p-3">{sale.clientName}</td>
                      <td className="p-3">${(sale.saleAmount / 100).toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          sale.status === "approved" ? "bg-green-100 text-green-700" :
                          sale.status === "paid" ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="p-3">{new Date(sale.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "veterans" && (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Program</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {veteranIntakes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">No veteran intakes yet</td>
                  </tr>
                ) : (
                  veteranIntakes.map((vi) => (
                    <tr key={vi.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{vi.id}</td>
                      <td className="p-3">{vi.firstName} {vi.lastName}</td>
                      <td className="p-3">{vi.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-700">
                          {vi.programType}
                        </span>
                      </td>
                      <td className="p-3">{vi.status}</td>
                      <td className="p-3">{new Date(vi.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "businesses" && (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Business</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Service</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {businessIntakes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">No business intakes yet</td>
                  </tr>
                ) : (
                  businessIntakes.map((bi) => (
                    <tr key={bi.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{bi.id}</td>
                      <td className="p-3">{bi.businessName}</td>
                      <td className="p-3">{bi.contactName}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-700">
                          {bi.serviceType}
                        </span>
                      </td>
                      <td className="p-3">{bi.status}</td>
                      <td className="p-3">{new Date(bi.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "opportunities" && (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-bold">Manage Opportunities / Services</h3>
              <p className="text-sm text-gray-600">Add B2B and B2C offerings with commission structures</p>
            </div>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">L1 Comm</th>
                  <th className="p-3 text-left">L2 Comm</th>
                  <th className="p-3 text-left">L3 Comm</th>
                  <th className="p-3 text-left">Active</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">No opportunities configured yet</td>
                  </tr>
                ) : (
                  opportunities.map((opp) => (
                    <tr key={opp.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{opp.name}</td>
                      <td className="p-3">{opp.category}</td>
                      <td className="p-3">{opp.commissionL1}%</td>
                      <td className="p-3">{opp.commissionL2}%</td>
                      <td className="p-3">{opp.commissionL3}%</td>
                      <td className="p-3">{opp.isActive === "true" ? "Yes" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "files" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="p-4 border-b flex items-center gap-3">
                <FileText className="w-6 h-6 text-brand-navy" />
                <div>
                  <h3 className="font-bold">Signed Agreements</h3>
                  <p className="text-sm text-gray-600">All executed contracts on file ({signedAgreements.length} total)</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">ID</th>
                      <th className="p-3 text-left">Representative</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Contract</th>
                      <th className="p-3 text-left">Signed Date</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Recruited By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signedAgreements.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-gray-500">No signed agreements yet</td>
                      </tr>
                    ) : (
                      signedAgreements.map((sa) => {
                        const template = contractTemplates.find(t => t.id === sa.contractTemplateId);
                        return (
                          <tr 
                            key={sa.id} 
                            className="border-t hover:bg-blue-50 cursor-pointer transition-colors"
                            onClick={() => setViewingAgreement(sa)}
                            data-testid={`row-signed-agreement-${sa.id}`}
                          >
                            <td className="p-3">{sa.id}</td>
                            <td className="p-3 font-medium">{sa.affiliateName}</td>
                            <td className="p-3">{sa.affiliateEmail}</td>
                            <td className="p-3 text-blue-600 underline">{template?.name || `Contract #${sa.contractTemplateId}`}</td>
                            <td className="p-3">{new Date(sa.signedAt).toLocaleDateString()}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs ${
                                sa.status === "signed" ? "bg-green-100 text-green-700" :
                                sa.status === "void" ? "bg-red-100 text-red-700" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                {sa.status}
                              </span>
                            </td>
                            <td className="p-3">{sa.recruitedBy || "-"}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-bold">Contract Templates</h3>
                <p className="text-sm text-gray-600">Available agreement templates</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Company</th>
                      <th className="p-3 text-left">Version</th>
                      <th className="p-3 text-left">Required For</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractTemplates.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-gray-500">No contract templates configured</td>
                      </tr>
                    ) : (
                      contractTemplates.map((ct) => (
                        <tr 
                          key={ct.id} 
                          className="border-t hover:bg-blue-50 cursor-pointer transition-colors"
                          onClick={() => setViewingTemplate(ct)}
                          data-testid={`row-contract-template-${ct.id}`}
                        >
                          <td className="p-3 font-medium text-blue-600 underline">{ct.name}</td>
                          <td className="p-3">{ct.companyName}</td>
                          <td className="p-3">{ct.version}</td>
                          <td className="p-3 capitalize">{ct.requiredFor}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              ct.isActive === "true" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                            }`}>
                              {ct.isActive === "true" ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "compplan" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-6 h-6 text-brand-navy" />
                <h2 className="text-xl font-bold text-brand-navy">Commission Structure</h2>
              </div>

              <div className="prose max-w-none text-gray-700 mb-6">
                <p className="mb-4">
                  The <strong>producer</strong> (whoever closes the sale) receives <strong className="text-brand-red">69% base</strong>, 
                  plus <strong className="text-brand-red">1% for each empty upline level</strong>. Compression goes to the producer, not the house.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <ul className="space-y-1 text-sm">
                    <li><strong>Producer Base:</strong> 69% of pool</li>
                    <li><strong>Each Upline:</strong> 1% of pool (max 6 uplines)</li>
                    <li><strong>House:</strong> 22.5% of pool (fixed)</li>
                    <li><strong>Recruiter Bounty:</strong> 2.5% of pool (separate)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-brand-navy text-white rounded-lg p-4">
              <h3 className="font-bold mb-3">Position Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-2 text-left">Position</th>
                      <th className="py-2 text-center">Uplines</th>
                      <th className="py-2 text-center">Producer Gets</th>
                      <th className="py-2 text-center">House</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { uplines: 0, rank: "E7", title: "SFC" },
                      { uplines: 1, rank: "E6", title: "SSG" },
                      { uplines: 2, rank: "E5", title: "SGT" },
                      { uplines: 3, rank: "E4", title: "SPC" },
                      { uplines: 4, rank: "E3", title: "PFC" },
                      { uplines: 5, rank: "E2", title: "PV2" },
                      { uplines: 6, rank: "E1", title: "PVT" },
                    ].map(({ uplines, rank, title }) => {
                      const empty = 6 - uplines;
                      const prod = 0.69 + empty * 0.01;
                      return (
                        <tr key={uplines} className="border-b border-white/10">
                          <td className="py-2">{rank} - {title} {uplines === 0 ? '(Solo)' : `(${uplines} upline${uplines > 1 ? 's' : ''})`}</td>
                          <td className="py-2 text-center">{uplines} × 1%</td>
                          <td className="py-2 text-center font-bold text-green-300">{(prod * 100).toFixed(0)}%</td>
                          <td className="py-2 text-center">22.5%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="font-bold text-brand-navy mb-4">Commission Calculator</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Deal Amount ($)</label>
                  <input
                    type="number"
                    value={calcGrossRevenue}
                    onChange={(e) => setCalcGrossRevenue(Number(e.target.value))}
                    className="w-full border rounded p-2"
                    min={0}
                    step={1000}
                    data-testid="input-calc-gross"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contract Rate (%)</label>
                  <input
                    type="number"
                    value={calcContractRate}
                    onChange={(e) => setCalcContractRate(Number(e.target.value))}
                    className="w-full border rounded p-2"
                    min={0}
                    max={100}
                    data-testid="input-contract-rate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Uplines Above You</label>
                  <select
                    value={calcUplineCount}
                    onChange={(e) => setCalcUplineCount(Number(e.target.value))}
                    className="w-full border rounded p-2"
                    data-testid="select-uplines"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} {n === 0 ? '(Solo)' : ''}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 p-3 border rounded cursor-pointer">
                  <input type="checkbox" checked={calcRecruiter} onChange={() => setCalcRecruiter(!calcRecruiter)} />
                  <span className="text-sm">Recruiter (2.5%)</span>
                </label>
              </div>

              {(() => {
                const deal = Math.max(0, calcGrossRevenue);
                const rate = Math.max(0, Math.min(100, calcContractRate)) / 100;
                const pool = deal * rate;
                const uplines = Math.max(0, Math.min(6, calcUplineCount));
                const emptyUplines = 6 - uplines;
                const compression = emptyUplines * 0.01;
                const producerPct = 0.69 + compression;
                const producerPay = pool * producerPct;
                const uplinePay = pool * 0.01;
                const totalUplinePay = uplinePay * uplines;
                const housePay = pool * 0.225;
                const recruiterPay = calcRecruiter ? pool * 0.025 : 0;
                const totalPaid = producerPay + totalUplinePay + housePay + recruiterPay;
                const money = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-100 rounded p-3 text-center">
                        <div className="text-xs text-gray-500">Commission Pool</div>
                        <div className="text-lg font-bold text-brand-navy">{money(pool)}</div>
                      </div>
                      <div className="bg-green-100 rounded p-3 text-center">
                        <div className="text-xs text-gray-500">You (Producer)</div>
                        <div className="text-lg font-bold text-green-700">{money(producerPay)}</div>
                        <div className="text-xs text-gray-500">{(producerPct * 100).toFixed(0)}%</div>
                      </div>
                      <div className="bg-blue-100 rounded p-3 text-center">
                        <div className="text-xs text-gray-500">Uplines ({uplines})</div>
                        <div className="text-lg font-bold text-blue-700">{money(totalUplinePay)}</div>
                      </div>
                      <div className="bg-brand-navy/10 rounded p-3 text-center">
                        <div className="text-xs text-gray-500">House</div>
                        <div className="text-lg font-bold text-brand-navy">{money(housePay)}</div>
                      </div>
                    </div>

                    {emptyUplines > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                        <strong>Compression Bonus:</strong> +{emptyUplines}% ({money(pool * compression)}) from {emptyUplines} empty upline slot{emptyUplines > 1 ? 's' : ''}
                      </div>
                    )}

                    <table className="w-full border rounded text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="p-2 text-left">Recipient</th>
                          <th className="p-2 text-right">Rate</th>
                          <th className="p-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b bg-green-50">
                          <td className="p-2 font-medium">You (Producer)</td>
                          <td className="p-2 text-right">{(producerPct * 100).toFixed(0)}%</td>
                          <td className="p-2 text-right font-bold text-green-700">{money(producerPay)}</td>
                        </tr>
                        {Array.from({ length: uplines }, (_, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2">Upline {i + 1}</td>
                            <td className="p-2 text-right">1%</td>
                            <td className="p-2 text-right">{money(uplinePay)}</td>
                          </tr>
                        ))}
                        {calcRecruiter && (
                          <tr className="border-b bg-yellow-50">
                            <td className="p-2">Recruiter Bounty</td>
                            <td className="p-2 text-right">2.5%</td>
                            <td className="p-2 text-right">{money(recruiterPay)}</td>
                          </tr>
                        )}
                        <tr className="border-b bg-blue-50">
                          <td className="p-2">House</td>
                          <td className="p-2 text-right">22.5%</td>
                          <td className="p-2 text-right">{money(housePay)}</td>
                        </tr>
                        <tr className="font-bold bg-gray-100">
                          <td className="p-2">Total</td>
                          <td className="p-2 text-right">100%</td>
                          <td className="p-2 text-right">{money(totalPaid)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ===== VSO REVENUE TAB ===== */}
        {tab === "vso" && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                data-testid="button-print-vso"
                onClick={() => {
                  const content = document.getElementById('vso-content');
                  if (content) {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>VSO Revenue Projections - NavigatorUSA</title>
                            <style>
                              body { font-family: Arial, sans-serif; padding: 20px; }
                              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                              th { background-color: #1A365D; color: white; }
                              .header { color: #1A365D; }
                              .highlight { color: #E21C3D; font-weight: bold; }
                            </style>
                          </head>
                          <body>
                            <h1 class="header">VSO Revenue Generation Model</h1>
                            <p>NavigatorUSA - Veterans' Family Resources</p>
                            <hr/>
                            <h2>Conversion Funnel</h2>
                            <p>50,000 Veterans → 3% onboard → 1,500 Affiliates → 10% produce → 150 Active Producers → 1,000 Sales</p>
                            <p><em>Note: Only 0.3% of veterans reached become active producers</em></p>
                            
                            <h2>Revenue Projections (Annual)</h2>
                            <table>
                              <tr><th>Contract Type</th><th>Rate</th><th>Est. Sales</th><th>Total Revenue</th><th>Commission Pool</th></tr>
                              <tr><td>Private Reinsurance</td><td class="highlight">70%</td><td>335</td><td>$83,750,000</td><td>$58,625,000</td></tr>
                              <tr><td>Tax Resolution</td><td class="highlight">55%</td><td>333</td><td>$83,250,000</td><td>$45,787,500</td></tr>
                              <tr><td>ICC Logistics</td><td class="highlight">18%</td><td>332</td><td>$83,000,000</td><td>$14,940,000</td></tr>
                              <tr style="background:#1A365D;color:white;font-weight:bold;"><td>TOTAL</td><td>-</td><td>1,000</td><td>$250,000,000</td><td>$119,352,500</td></tr>
                            </table>
                            
                            <h2>Commission Distribution</h2>
                            <p>Producer: 69-75% | Uplines: 0-6% (1% each) | House: 22.5% | Recruiter: 2.5%</p>
                            
                            <hr/>
                            <p><small>Generated by NavigatorUSA Master Portal - ${new Date().toLocaleDateString()}</small></p>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-navy/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Print Report
              </button>
              
              <div className="flex items-center gap-2">
                <select
                  data-testid="select-vso-affiliate"
                  value={selectedVsoAffiliate || ""}
                  onChange={(e) => setSelectedVsoAffiliate(e.target.value ? Number(e.target.value) : null)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="">Select Affiliate...</option>
                  {affiliates.map((aff) => (
                    <option key={aff.id} value={aff.id}>
                      {aff.name} ({aff.email})
                    </option>
                  ))}
                </select>
                <button
                  data-testid="button-email-vso"
                  onClick={() => {
                    if (selectedVsoAffiliate) {
                      const affiliate = affiliates.find(a => a.id === selectedVsoAffiliate);
                      if (affiliate) {
                        const subject = encodeURIComponent("VSO Revenue Projections - NavigatorUSA");
                        const body = encodeURIComponent(`Hi ${affiliate.name},

Here are the VSO Revenue projections for your review:

CONVERSION FUNNEL:
50,000 Veterans → 3% onboard → 1,500 Affiliates → 10% produce → 150 Active Producers → 1,000 Sales
(Only 0.3% of veterans reached become active producers)

REVENUE PROJECTIONS (ANNUAL):
• Private Reinsurance (70%): 335 sales → $83.75M revenue → $58.6M commission
• Tax Resolution (55%): 333 sales → $83.25M revenue → $45.8M commission
• ICC Logistics (18%): 332 sales → $83M revenue → $14.9M commission
• TOTAL: 1,000 sales → $250M revenue → $119.4M commission pool

COMMISSION DISTRIBUTION:
• Producer: 69-75% (+ compression bonus)
• Uplines: 0-6% (1% per upline rank)
• House: 22.5%
• Recruiter Bounty: 2.5%

Best regards,
NavigatorUSA Team`);
                        window.open(`mailto:${affiliate.email}?subject=${subject}&body=${body}`);
                        alert(`Email draft opened for ${affiliate.name}`);
                      }
                    } else {
                      alert("Please select an affiliate first");
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Email to Affiliate
                </button>
              </div>
            </div>

            <div id="vso-content" className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-brand-navy mb-2 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                VSO Revenue Generation Model
              </h2>
              <p className="text-gray-600 mb-6">
                Realistic revenue projections for Veteran Service Organizations promoting to 50,000 veterans.
              </p>

              {/* Conversion Funnel */}
              <div className="bg-gradient-to-r from-brand-navy/10 to-brand-red/10 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-bold text-brand-navy mb-3">Realistic Conversion Funnel</h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-brand-navy">50,000</p>
                    <p className="text-xs text-gray-500">Veterans Reached</p>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="text-center">
                    <p className="text-xs text-brand-red font-bold">3% onboard</p>
                    <p className="text-2xl font-bold text-brand-navy">1,500</p>
                    <p className="text-xs text-gray-500">Affiliates</p>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="text-center">
                    <p className="text-xs text-brand-red font-bold">10% produce</p>
                    <p className="text-2xl font-bold text-green-600">150</p>
                    <p className="text-xs text-gray-500">Active Producers</p>
                    <p className="text-[10px] text-gray-400">(0.3% of total)</p>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="text-center">
                    <p className="text-xs text-brand-red font-bold">6.7 sales each</p>
                    <p className="text-2xl font-bold text-yellow-600">1,000</p>
                    <p className="text-xs text-gray-500">Total Sales</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">
                  Note: Only 0.3% of veterans reached will become active producers (3% onboard × 10% produce = 0.3%)
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-gradient-to-br from-brand-navy to-brand-navy/80 text-white rounded-xl p-5">
                  <p className="text-white/70 text-sm">Target Veterans</p>
                  <p className="text-3xl font-bold">50,000</p>
                </div>
                <div className="bg-gradient-to-br from-brand-red to-brand-red/80 text-white rounded-xl p-5">
                  <p className="text-white/70 text-sm">Onboarding Rate</p>
                  <p className="text-3xl font-bold">3%</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-5">
                  <p className="text-white/70 text-sm">New Affiliates</p>
                  <p className="text-3xl font-bold">1,500</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl p-5">
                  <p className="text-white/70 text-sm">Active Producers</p>
                  <p className="text-3xl font-bold">150</p>
                  <p className="text-xs text-white/60">10% of affiliates</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-5">
                  <p className="text-white/70 text-sm">Total Sales</p>
                  <p className="text-3xl font-bold">1,000</p>
                  <p className="text-xs text-white/60">~6.7 per producer</p>
                </div>
              </div>

              {/* Revenue Projections */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-brand-navy mb-4">Projected Revenue (Annual)</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Commission Pool = Deal Amount × Contract Rate. Weighted average: (70%×335 + 55%×333 + 18%×332) / 1,000 = ~47.7% effective rate
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-brand-navy">
                        <th className="text-left py-3 px-4 font-bold text-brand-navy">Contract Type</th>
                        <th className="text-right py-3 px-4 font-bold text-brand-navy">Rate</th>
                        <th className="text-right py-3 px-4 font-bold text-brand-navy">Est. Sales</th>
                        <th className="text-right py-3 px-4 font-bold text-brand-navy">Avg Deal</th>
                        <th className="text-right py-3 px-4 font-bold text-brand-navy">Total Revenue</th>
                        <th className="text-right py-3 px-4 font-bold text-brand-navy">Commission Pool</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-white transition-colors">
                        <td className="py-3 px-4 font-medium">Private Reinsurance</td>
                        <td className="py-3 px-4 text-right text-brand-red font-bold">70%</td>
                        <td className="py-3 px-4 text-right">335</td>
                        <td className="py-3 px-4 text-right">$250,000</td>
                        <td className="py-3 px-4 text-right font-bold">$83,750,000</td>
                        <td className="py-3 px-4 text-right text-green-600 font-bold">$58,625,000</td>
                      </tr>
                      <tr className="border-b hover:bg-white transition-colors">
                        <td className="py-3 px-4 font-medium">Tax Resolution</td>
                        <td className="py-3 px-4 text-right text-brand-red font-bold">55%</td>
                        <td className="py-3 px-4 text-right">333</td>
                        <td className="py-3 px-4 text-right">$250,000</td>
                        <td className="py-3 px-4 text-right font-bold">$83,250,000</td>
                        <td className="py-3 px-4 text-right text-green-600 font-bold">$45,787,500</td>
                      </tr>
                      <tr className="border-b hover:bg-white transition-colors">
                        <td className="py-3 px-4 font-medium">ICC Logistics</td>
                        <td className="py-3 px-4 text-right text-brand-red font-bold">18%</td>
                        <td className="py-3 px-4 text-right">332</td>
                        <td className="py-3 px-4 text-right">$250,000</td>
                        <td className="py-3 px-4 text-right font-bold">$83,000,000</td>
                        <td className="py-3 px-4 text-right text-green-600 font-bold">$14,940,000</td>
                      </tr>
                      <tr className="bg-brand-navy text-white font-bold">
                        <td className="py-4 px-4">TOTAL</td>
                        <td className="py-4 px-4 text-right">-</td>
                        <td className="py-4 px-4 text-right">1,000</td>
                        <td className="py-4 px-4 text-right">$250,000</td>
                        <td className="py-4 px-4 text-right">$250,000,000</td>
                        <td className="py-4 px-4 text-right text-yellow-400">$119,352,500</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Earnings by Position */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-brand-navy mb-4">Estimated Earnings by Network Position (Active Producers Only)</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Based on $119M commission pool distributed among 150 producers. Actual earnings vary by sales volume and upline position.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-5 border-l-4 border-yellow-500 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-500">E7 - SFC (Master)</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">3 producers</span>
                    </div>
                    <p className="text-2xl font-bold text-brand-navy">$90,273</p>
                    <p className="text-xs text-gray-500 mt-1">Avg annual earnings (producer + upline)</p>
                  </div>
                  <div className="bg-white rounded-lg p-5 border-l-4 border-blue-500 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-500">E6 - SSG (SubMaster)</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">12 producers</span>
                    </div>
                    <p className="text-2xl font-bold text-brand-navy">$69,513</p>
                    <p className="text-xs text-gray-500 mt-1">Avg annual earnings (producer + upline)</p>
                  </div>
                  <div className="bg-white rounded-lg p-5 border-l-4 border-green-500 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-500">E1-E5 (Affiliates)</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">135 producers</span>
                    </div>
                    <p className="text-2xl font-bold text-brand-navy">$58,524</p>
                    <p className="text-xs text-gray-500 mt-1">Avg annual earnings (producer + upline)</p>
                  </div>
                </div>
              </div>

              {/* Compression Benefits */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-brand-navy mb-4">Compression Benefits Analysis</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Fewer uplines = higher producer rate. Empty upline slots compress TO THE PRODUCER, not the house.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                  {[
                    { rank: "E7", title: "SFC", rate: 75, count: 3, avg: 50933 },
                    { rank: "E6", title: "SSG", rate: 74, count: 25, avg: 60179 },
                    { rank: "E5", title: "SGT", rate: 73, count: 68, avg: 58738 },
                    { rank: "E4", title: "SPC", rate: 72, count: 44, avg: 57997 },
                    { rank: "E3", title: "PFC", rate: 71, count: 9, avg: 54340 },
                    { rank: "E2", title: "PV2", rate: 70, count: 1, avg: 45503 },
                    { rank: "E1", title: "PVT", rate: 69, count: 0, avg: 41400 },
                  ].map((item) => (
                    <div key={item.rank} className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <p className="text-xs text-gray-500">{item.rank} - {item.title}</p>
                      <p className="text-2xl font-bold text-brand-red">{item.rate}%</p>
                      <p className="text-xs text-gray-500">Producer Rate</p>
                      <hr className="my-2" />
                      <p className="text-sm font-bold text-brand-navy">${(item.avg / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-gray-400">{item.count} producers</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribution Summary */}
              <div className="bg-gradient-to-r from-brand-navy to-brand-navy/90 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Commission Pool Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Producer Pool</p>
                    <p className="text-2xl font-bold">69-75%</p>
                    <p className="text-xs text-yellow-400">+ Compression Bonus</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Upline Pool</p>
                    <p className="text-2xl font-bold">0-6%</p>
                    <p className="text-xs text-white/50">1% per upline rank</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-sm">House</p>
                    <p className="text-2xl font-bold">22.5%</p>
                    <p className="text-xs text-white/50">Fixed percentage</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Recruiter Bounty</p>
                    <p className="text-2xl font-bold">2.5%</p>
                    <p className="text-xs text-white/50">Separate bonus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {viewingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setViewingTemplate(null)}>
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b bg-brand-navy text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{viewingTemplate.name}</h2>
                <p className="text-sm text-white/70">{viewingTemplate.companyName} • Version {viewingTemplate.version}</p>
              </div>
              <button
                onClick={() => setViewingTemplate(null)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                data-testid="button-close-template-modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="mb-4 flex gap-4">
                <span className={`px-3 py-1 rounded text-sm ${
                  viewingTemplate.isActive === "true" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {viewingTemplate.isActive === "true" ? "Active" : "Inactive"}
                </span>
                <span className="px-3 py-1 rounded text-sm bg-blue-100 text-blue-700 capitalize">
                  Required for: {viewingTemplate.requiredFor}
                </span>
                {viewingTemplate.grossCommissionPct && (
                  <span className="px-3 py-1 rounded text-sm bg-yellow-100 text-yellow-700">
                    Commission: {viewingTemplate.grossCommissionPct}%
                  </span>
                )}
              </div>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: viewingTemplate.content }}
              />
            </div>
          </div>
        </div>
      )}

      {viewingAgreement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setViewingAgreement(null)}>
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b bg-brand-navy text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Signed Agreement Details</h2>
                <p className="text-sm text-white/70">Agreement #{viewingAgreement.id}</p>
              </div>
              <button
                onClick={() => setViewingAgreement(null)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                data-testid="button-close-agreement-modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Representative</p>
                    <p className="font-medium">{viewingAgreement.affiliateName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{viewingAgreement.affiliateEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contract</p>
                    <p className="font-medium">
                      {contractTemplates.find(t => t.id === viewingAgreement.contractTemplateId)?.name || `Contract #${viewingAgreement.contractTemplateId}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 rounded text-xs ${
                      viewingAgreement.status === "signed" ? "bg-green-100 text-green-700" :
                      viewingAgreement.status === "void" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {viewingAgreement.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Signed Date</p>
                    <p className="font-medium">{new Date(viewingAgreement.signedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Recruited By</p>
                    <p className="font-medium">{viewingAgreement.recruitedBy || "N/A"}</p>
                  </div>
                </div>
                {viewingAgreement.physicalAddress && (
                  <div>
                    <p className="text-sm text-gray-500">Physical Address</p>
                    <p className="font-medium">{viewingAgreement.physicalAddress}</p>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <button
                    onClick={() => {
                      const template = contractTemplates.find(t => t.id === viewingAgreement.contractTemplateId);
                      if (template) {
                        setViewingAgreement(null);
                        setViewingTemplate(template);
                      }
                    }}
                    className="px-4 py-2 bg-brand-navy text-white rounded hover:bg-brand-navy/90 transition-colors"
                    data-testid="button-view-contract-template"
                  >
                    View Contract Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
