import { Layout } from "@/components/layout";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Users, DollarSign, TrendingUp, Shield, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

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
  createdAt: string;
};

type Sale = {
  id: number;
  clientName: string;
  saleAmount: number;
  status: string;
  createdAt: string;
};

export default function SubMasterPortal() {
  const [, setLocation] = useLocation();
  const [affiliateId, setAffiliateId] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { data: pendingContracts = [] } = useQuery<any[]>({
    queryKey: ["/api/contracts/pending", affiliateId],
    queryFn: async () => {
      if (!affiliateId) return [];
      const res = await fetch(`/api/contracts/pending/${affiliateId}`);
      return res.json();
    },
    enabled: isLoggedIn && !!affiliateId,
  });

  const { data: downline = [], refetch: refetchDownline } = useQuery<Affiliate[]>({
    queryKey: ["/api/submaster/downline", affiliateId],
    queryFn: async () => {
      if (!affiliateId) return [];
      const res = await fetch(`/api/submaster/downline?affiliateId=${affiliateId}`);
      return res.json();
    },
    enabled: isLoggedIn && !!affiliateId,
  });

  const { data: sales = [], refetch: refetchSales } = useQuery<Sale[]>({
    queryKey: ["/api/submaster/sales", affiliateId],
    queryFn: async () => {
      if (!affiliateId) return [];
      const res = await fetch(`/api/submaster/sales?affiliateId=${affiliateId}`);
      return res.json();
    },
    enabled: isLoggedIn && !!affiliateId,
  });

  const handleLogin = () => {
    if (affiliateId) {
      setIsLoggedIn(true);
      refetchDownline();
      refetchSales();
    }
  };

  const totalSalesAmount = sales.reduce((acc, s) => acc + (s.saleAmount || 0), 0);

  if (isLoggedIn && pendingContracts.length > 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Contracts Required</h2>
            <p className="text-gray-600 mb-6">
              You have {pendingContracts.length} agreement(s) that must be signed before accessing your portal.
            </p>
            <button
              onClick={() => setLocation("/sign-contract")}
              className="bg-brand-red text-white px-6 py-3 rounded font-bold hover:bg-brand-red/90"
              data-testid="button-sign-contracts"
            >
              Sign Required Contracts
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-brand-navy">Sub-Master Portal</h1>
            </div>
            <p className="text-gray-600 mb-6">Enter your affiliate ID to view your team's performance.</p>
            <input
              type="text"
              placeholder="Your Affiliate ID"
              value={affiliateId}
              onChange={(e) => setAffiliateId(e.target.value)}
              className="w-full border rounded p-3 mb-4"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-brand-navy text-white py-3 rounded font-bold hover:bg-brand-navy/90"
            >
              View My Team
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8" data-testid="submaster-portal-container">
        <div className="flex items-center gap-4 mb-8">
          <Shield className="w-10 h-10 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-brand-navy" data-testid="text-submaster-portal-title">Sub-Master Portal</h1>
            <p className="text-gray-600">Manage your team and track their performance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{downline.length}</p>
                <p className="text-sm text-gray-600">Team Members</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${(totalSalesAmount / 100).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Team Sales</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{sales.length}</p>
                <p className="text-sm text-gray-600">Total Transactions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-bold text-brand-navy">Your Team ({downline.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Code</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Leads</th>
                  </tr>
                </thead>
                <tbody>
                  {downline.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-gray-500">No team members yet</td>
                    </tr>
                  ) : (
                    downline.map((aff) => (
                      <tr key={aff.id} className="border-t">
                        <td className="p-3">{aff.name}</td>
                        <td className="p-3 font-mono text-xs">{aff.referralCode}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            aff.role === "sub_master" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                          }`}>
                            {aff.role}
                          </span>
                        </td>
                        <td className="p-3">{aff.totalLeads || 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-bold text-brand-navy">Team Sales ({sales.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Client</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-gray-500">No sales yet</td>
                    </tr>
                  ) : (
                    sales.map((sale) => (
                      <tr key={sale.id} className="border-t">
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
