import { Layout } from "@/components/layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Users, DollarSign, TrendingUp, Building2, Shield, ChevronDown, ChevronRight, FileText, Download, Calculator } from "lucide-react";

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
  const [tab, setTab] = useState<"overview" | "affiliates" | "sales" | "veterans" | "businesses" | "opportunities" | "files" | "compplan">("overview");
  const [calcGrossRevenue, setCalcGrossRevenue] = useState<number>(10000);
  const [calcRecruiter, setCalcRecruiter] = useState<boolean>(true);
  const [calcL2Active, setCalcL2Active] = useState<boolean>(true);
  const [calcL3Active, setCalcL3Active] = useState<boolean>(true);
  const [calcL4Active, setCalcL4Active] = useState<boolean>(true);
  const [calcL5Active, setCalcL5Active] = useState<boolean>(true);
  const [expandedAffiliate, setExpandedAffiliate] = useState<number | null>(null);
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
                          <tr key={sa.id} className="border-t hover:bg-gray-50">
                            <td className="p-3">{sa.id}</td>
                            <td className="p-3 font-medium">{sa.affiliateName}</td>
                            <td className="p-3">{sa.affiliateEmail}</td>
                            <td className="p-3">{template?.name || `Contract #${sa.contractTemplateId}`}</td>
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
                        <tr key={ct.id} className="border-t hover:bg-gray-50">
                          <td className="p-3 font-medium">{ct.name}</td>
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
                <h2 className="text-xl font-bold text-brand-navy">6-Level Compensation Structure</h2>
              </div>

              <div className="prose max-w-none text-gray-700 mb-6">
                <p className="mb-4">
                  The Company allocates <strong className="text-brand-red">75%</strong> of Gross Revenue across six levels, 
                  plus a separate <strong className="text-brand-red">2.5%</strong> recruiter bounty.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <ul className="space-y-1 text-sm">
                    <li><strong>Level 1 (Top Producer):</strong> 67% of Gross</li>
                    <li><strong>Level 2 (Closest Upline):</strong> 3.5% (conditional)</li>
                    <li><strong>Level 3:</strong> 2.0% (conditional)</li>
                    <li><strong>Level 4:</strong> 1.2% (conditional)</li>
                    <li><strong>Level 5:</strong> 0.8% (conditional)</li>
                    <li><strong>Level 6 (Company):</strong> 0.5% + compression</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="font-bold text-brand-navy mb-4">Commission Calculator</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Gross Revenue ($)</label>
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
                <label className="flex items-center gap-2 p-3 border rounded cursor-pointer">
                  <input type="checkbox" checked={calcRecruiter} onChange={() => setCalcRecruiter(!calcRecruiter)} />
                  <span className="text-sm">Recruiter (2.5%)</span>
                </label>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <label className="flex items-center gap-2 p-2 border rounded text-sm cursor-pointer">
                  <input type="checkbox" checked={calcL2Active} onChange={() => setCalcL2Active(!calcL2Active)} />
                  L2 (3.5%)
                </label>
                <label className="flex items-center gap-2 p-2 border rounded text-sm cursor-pointer">
                  <input type="checkbox" checked={calcL3Active} onChange={() => setCalcL3Active(!calcL3Active)} />
                  L3 (2.0%)
                </label>
                <label className="flex items-center gap-2 p-2 border rounded text-sm cursor-pointer">
                  <input type="checkbox" checked={calcL4Active} onChange={() => setCalcL4Active(!calcL4Active)} />
                  L4 (1.2%)
                </label>
                <label className="flex items-center gap-2 p-2 border rounded text-sm cursor-pointer">
                  <input type="checkbox" checked={calcL5Active} onChange={() => setCalcL5Active(!calcL5Active)} />
                  L5 (0.8%)
                </label>
              </div>

              {(() => {
                const gross = Math.max(0, calcGrossRevenue);
                const pct = { recruiter: 0.025, l1: 0.67, l2: 0.035, l3: 0.020, l4: 0.012, l5: 0.008, l6: 0.005 };
                const recruiterPay = calcRecruiter ? gross * pct.recruiter : 0;
                const l1Pay = gross * pct.l1;
                const l2Base = gross * pct.l2;
                const l3Base = gross * pct.l3;
                const l4Base = gross * pct.l4;
                const l5Base = gross * pct.l5;
                const l6Base = gross * pct.l6;
                const l2Pay = calcL2Active ? l2Base : 0;
                const l3Pay = calcL3Active ? l3Base : 0;
                const l4Pay = calcL4Active ? l4Base : 0;
                const l5Pay = calcL5Active ? l5Base : 0;
                const compressedToL6 = (calcL2Active ? 0 : l2Base) + (calcL3Active ? 0 : l3Base) + (calcL4Active ? 0 : l4Base) + (calcL5Active ? 0 : l5Base);
                const l6Pay = l6Base + compressedToL6;
                const totalPaid = recruiterPay + l1Pay + l2Pay + l3Pay + l4Pay + l5Pay + l6Pay;
                const money = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-brand-navy text-white rounded p-3">
                        <div className="text-xs opacity-80">Gross Revenue</div>
                        <div className="text-lg font-bold">{money(gross)}</div>
                      </div>
                      <div className="bg-brand-red text-white rounded p-3">
                        <div className="text-xs opacity-80">Top Rep (67%)</div>
                        <div className="text-lg font-bold">{money(l1Pay)}</div>
                      </div>
                      <div className="bg-green-600 text-white rounded p-3">
                        <div className="text-xs opacity-80">Total Paid</div>
                        <div className="text-lg font-bold">{money(totalPaid)}</div>
                      </div>
                      <div className="bg-blue-600 text-white rounded p-3">
                        <div className="text-xs opacity-80">Company (L6)</div>
                        <div className="text-lg font-bold">{money(l6Pay)}</div>
                      </div>
                    </div>

                    <table className="w-full border rounded text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="p-2 text-left">Level</th>
                          <th className="p-2 text-left">Rate</th>
                          <th className="p-2 text-left">Payout</th>
                          <th className="p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b bg-yellow-50">
                          <td className="p-2">Recruiter Bounty</td>
                          <td className="p-2">2.5%</td>
                          <td className="p-2 font-medium">{money(recruiterPay)}</td>
                          <td className="p-2"><span className={`px-2 py-1 rounded text-xs ${calcRecruiter ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{calcRecruiter ? 'Active' : 'None'}</span></td>
                        </tr>
                        <tr className="border-b bg-red-50 font-semibold">
                          <td className="p-2">L1 - Top Producer</td>
                          <td className="p-2">67%</td>
                          <td className="p-2">{money(l1Pay)}</td>
                          <td className="p-2"><span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">Always Paid</span></td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">L2 - Closest Upline</td>
                          <td className="p-2">3.5%</td>
                          <td className="p-2">{money(l2Pay)}</td>
                          <td className="p-2"><span className={`px-2 py-1 rounded text-xs ${calcL2Active ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{calcL2Active ? 'Active' : '→ L6'}</span></td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">L3</td>
                          <td className="p-2">2.0%</td>
                          <td className="p-2">{money(l3Pay)}</td>
                          <td className="p-2"><span className={`px-2 py-1 rounded text-xs ${calcL3Active ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{calcL3Active ? 'Active' : '→ L6'}</span></td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">L4</td>
                          <td className="p-2">1.2%</td>
                          <td className="p-2">{money(l4Pay)}</td>
                          <td className="p-2"><span className={`px-2 py-1 rounded text-xs ${calcL4Active ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{calcL4Active ? 'Active' : '→ L6'}</span></td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">L5</td>
                          <td className="p-2">0.8%</td>
                          <td className="p-2">{money(l5Pay)}</td>
                          <td className="p-2"><span className={`px-2 py-1 rounded text-xs ${calcL5Active ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{calcL5Active ? 'Active' : '→ L6'}</span></td>
                        </tr>
                        <tr className="bg-blue-50 font-bold">
                          <td className="p-2">L6 - Company</td>
                          <td className="p-2">0.5% + comp</td>
                          <td className="p-2">{money(l6Pay)}</td>
                          <td className="p-2"><span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">Base + Compression</span></td>
                        </tr>
                      </tbody>
                    </table>

                    {compressedToL6 > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded p-3 text-sm">
                        <strong>Compression:</strong> {money(compressedToL6)} from inactive levels reverted to Company (L6)
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
