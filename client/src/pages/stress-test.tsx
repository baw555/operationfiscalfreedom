import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity, 
  Download, 
  Play, 
  Trash2, 
  Users, 
  DollarSign, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Settings,
  Shield
} from "lucide-react";
import { Layout } from "@/components/layout";

export default function StressTest() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  
  // Auth check
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return null;
      return res.json();
    },
  });

  // NDA status check
  const { data: ndaStatus, isLoading: ndaLoading } = useQuery({
    queryKey: ["/api/affiliate/nda-status"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/nda-status");
      if (!res.ok) return { hasSigned: false };
      return res.json();
    },
    enabled: !!authData?.user,
  });

  // Redirect to NDA page if not signed
  useEffect(() => {
    if (!ndaLoading && authData?.user && ndaStatus && !ndaStatus.hasSigned) {
      setLocation("/affiliate/nda");
    }
  }, [ndaLoading, authData, ndaStatus, setLocation]);

  // Configuration state - only veteran opt-ins needed, rest is calculated
  // Formula: 1000 opt-ins = 3 affiliates (0.3% rate), each affiliate averages 7 sales
  const [veteranOptIns, setVeteranOptIns] = useState(10000);
  const numAffiliates = Math.max(5, Math.floor(veteranOptIns * 0.003)); // 0.3% become affiliates
  const numSales = numAffiliates * 7; // 7 sales per affiliate average
  const [hierarchyRandomness, setHierarchyRandomness] = useState(50); // 0-100

  const { data: results, isLoading, refetch } = useQuery({
    queryKey: ["/api/stress-test/results"],
    queryFn: async () => {
      const res = await fetch("/api/stress-test/results");
      if (!res.ok) throw new Error("Failed to fetch results");
      return res.json();
    },
  });

  const runTestMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/stress-test/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numSales,
          numAffiliates,
          hierarchyRandomness,
        }),
      });
      if (!res.ok) throw new Error("Failed to run stress test");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Stress Test Complete!",
        description: `Used ${data.stats.affiliatesUsed} affiliates, created ${data.stats.salesCreated} sales, ${data.stats.commissionsCreated} commissions`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stress-test/results"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const clearTestMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/stress-test/clear", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to clear test data");
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Data Cleared", description: data.message });
      queryClient.invalidateQueries({ queryKey: ["/api/stress-test/results"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const exportToCSV = () => {
    if (!results?.affiliates) return;

    const headers = [
      "ID", "Name", "Email", "Role", "Referral Code", "Status", "Comp Active",
      "Direct Sales", "Sales Volume", "Total Commissions", "Pending", "Approved", "Paid",
      "L1 Comm", "L2 Comm", "L3 Comm", "L4 Comm", "L5 Comm", "L6 Comm"
    ];

    const rows = results.affiliates.map((aff: any) => [
      aff.id,
      aff.name,
      aff.email,
      aff.role,
      aff.referralCode,
      aff.status,
      aff.isCompActive,
      aff.totalDirectSales,
      (aff.totalSalesVolume / 100).toFixed(2),
      (aff.totalCommissionsEarned / 100).toFixed(2),
      (aff.pendingCommissions / 100).toFixed(2),
      (aff.approvedCommissions / 100).toFixed(2),
      (aff.paidCommissions / 100).toFixed(2),
      (aff.commissionsByLevel.level1 / 100).toFixed(2),
      (aff.commissionsByLevel.level2 / 100).toFixed(2),
      (aff.commissionsByLevel.level3 / 100).toFixed(2),
      (aff.commissionsByLevel.level4 / 100).toFixed(2),
      (aff.commissionsByLevel.level5 / 100).toFixed(2),
      (aff.commissionsByLevel.level6 / 100).toFixed(2),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any[]) => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stress_test_results_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Exported!", description: "CSV file downloaded successfully" });
  };

  // Loading state
  if (authLoading || ndaLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xl text-white font-display">Loading Stress Test...</div>
        </div>
      </div>
    );
  }

  // Block access until NDA is signed
  if (!ndaStatus?.hasSigned) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="text-xl text-white font-display">Stress Test Access Locked</div>
          <div className="text-gray-300">You must sign the Confidentiality Agreement to access this tool.</div>
          <div className="text-sm text-gray-400">Redirecting to NDA signing page...</div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-brand-navy to-brand-navy/80 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Activity className="w-10 h-10 text-white" />
                  <div>
                    <h1 className="text-2xl font-bold text-white">Stress Test Simulation</h1>
                    <p className="text-white/70">Configurable Commission Structure Testing</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => refetch()}
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    data-testid="button-refresh"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button
                    onClick={exportToCSV}
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    disabled={!results?.affiliates?.length}
                    data-testid="button-export"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    onClick={() => clearTestMutation.mutate()}
                    disabled={clearTestMutation.isPending}
                    variant="destructive"
                    data-testid="button-clear"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Test Data
                  </Button>
                </div>
              </div>
            </div>

            {/* Configuration Panel */}
            <div className="p-6 bg-gray-50 border-b">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-brand-navy" />
                <h2 className="text-lg font-bold text-brand-navy">Simulation Configuration</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <Label htmlFor="veteranOptIns" className="text-sm font-medium text-gray-700 mb-2 block">
                    Veteran Opt-Ins
                  </Label>
                  <Input
                    id="veteranOptIns"
                    type="number"
                    value={veteranOptIns || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setVeteranOptIns(isNaN(val) ? 0 : val);
                    }}
                    onBlur={() => {
                      if (veteranOptIns < 1000) setVeteranOptIns(1000);
                      if (veteranOptIns > 500000) setVeteranOptIns(500000);
                    }}
                    className="w-full"
                    data-testid="input-veteran-optins"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter opt-ins to calculate all metrics</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Affiliates (calculated)
                  </Label>
                  <div className="bg-gray-100 border rounded-md px-3 py-2 text-lg font-bold text-brand-navy">
                    {numAffiliates.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">0.3% of opt-ins become affiliates</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Sales (calculated)
                  </Label>
                  <div className="bg-gray-100 border rounded-md px-3 py-2 text-lg font-bold text-brand-navy">
                    {numSales.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">7 sales per affiliate average</p>
                </div>
                <div>
                  <Label htmlFor="hierarchyRandomness" className="text-sm font-medium text-gray-700 mb-2 block">
                    Hierarchy Randomness: {hierarchyRandomness}%
                  </Label>
                  <Slider
                    id="hierarchyRandomness"
                    min={0}
                    max={100}
                    step={5}
                    value={[hierarchyRandomness]}
                    onValueChange={(value) => setHierarchyRandomness(value[0])}
                    className="w-full"
                    data-testid="slider-randomness"
                  />
                  <p className="text-xs text-gray-500 mt-1">0% = Structured, 100% = Random</p>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => runTestMutation.mutate()}
                    disabled={runTestMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white w-full"
                    data-testid="button-run-test"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {runTestMutation.isPending ? "Running..." : "Run Simulation"}
                  </Button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-brand-navy border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading results...</p>
              </div>
            ) : (
              <>
                {results?.summary && (
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-bold text-brand-navy mb-4">Summary Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-gray-600">Affiliates</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-700">{results.summary.totalAffiliates}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          M: {results.summary.affiliatesByRole?.master || 0} | 
                          SM: {results.summary.affiliatesByRole?.sub_master || 0} | 
                          A: {results.summary.affiliatesByRole?.affiliate || 0}
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-600">Total Sales</span>
                        </div>
                        <p className="text-2xl font-bold text-green-700">{results.summary.totalSales}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          P: {results.summary.salesByStatus?.pending || 0} | 
                          A: {results.summary.salesByStatus?.approved || 0} | 
                          Pd: {results.summary.salesByStatus?.paid || 0}
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-purple-600" />
                          <span className="text-sm text-gray-600">Sales Volume</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-700">
                          {formatCurrency(results.summary.totalSalesVolume || 0)}
                        </p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-orange-600" />
                          <span className="text-sm text-gray-600">Avg Sale</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-700">
                          {formatCurrency(results.summary.averageSaleAmount || 0)}
                        </p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-red-600" />
                          <span className="text-sm text-gray-600">Veteran Opt-Ins Needed</span>
                        </div>
                        <p className="text-2xl font-bold text-red-700">
                          {Math.ceil((results.summary.totalAffiliates || 0) / 0.003).toLocaleString()}
                        </p>
                        <div className="text-xs text-gray-500 mt-1">
                          0.3% rate: 1,000 opt-ins = 3 affiliates
                        </div>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-indigo-600" />
                          <span className="text-sm text-gray-600">Top Performer</span>
                        </div>
                        {results.summary.topPerformers?.[0] && (
                          <div>
                            <p className="text-lg font-bold text-indigo-700">{results.summary.topPerformers[0].name}</p>
                            <p className="text-sm text-gray-600">
                              {formatCurrency(results.summary.topPerformers[0].totalCommissionsEarned)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-lg font-bold text-brand-navy mb-4">Affiliate Commission Spreadsheet</h2>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full text-sm" data-testid="stress-test-table">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="p-3 text-left font-semibold"></th>
                          <th className="p-3 text-left font-semibold">ID</th>
                          <th className="p-3 text-left font-semibold">Name</th>
                          <th className="p-3 text-left font-semibold">Role</th>
                          <th className="p-3 text-left font-semibold">Referral Code</th>
                          <th className="p-3 text-left font-semibold">Status</th>
                          <th className="p-3 text-right font-semibold">Direct Sales</th>
                          <th className="p-3 text-right font-semibold">Sales Volume</th>
                          <th className="p-3 text-right font-semibold">Total Commissions</th>
                          <th className="p-3 text-right font-semibold">Pending</th>
                          <th className="p-3 text-right font-semibold">Approved</th>
                          <th className="p-3 text-right font-semibold">Paid</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!results?.affiliates?.length ? (
                          <tr>
                            <td colSpan={12} className="p-8 text-center text-gray-500">
                              No data yet. Click "Run Simulation" to generate test data.
                            </td>
                          </tr>
                        ) : (
                          results.affiliates.map((aff: any) => (
                            <>
                              <tr 
                                key={aff.id} 
                                className="border-t hover:bg-gray-50 cursor-pointer"
                                onClick={() => toggleRow(aff.id)}
                                data-testid={`row-affiliate-${aff.id}`}
                              >
                                <td className="p-3">
                                  {expandedRows.has(aff.id) ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                  )}
                                </td>
                                <td className="p-3 font-mono text-xs">{aff.id}</td>
                                <td className="p-3 font-medium">{aff.name}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    aff.role === "master" ? "bg-purple-100 text-purple-700" :
                                    aff.role === "sub_master" ? "bg-blue-100 text-blue-700" :
                                    "bg-gray-100 text-gray-700"
                                  }`}>
                                    {aff.role}
                                  </span>
                                </td>
                                <td className="p-3 font-mono text-xs">{aff.referralCode}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    aff.status === "active" ? "bg-green-100 text-green-700" :
                                    "bg-red-100 text-red-700"
                                  }`}>
                                    {aff.status}
                                  </span>
                                </td>
                                <td className="p-3 text-right font-medium">{aff.totalDirectSales}</td>
                                <td className="p-3 text-right font-medium">{formatCurrency(aff.totalSalesVolume)}</td>
                                <td className="p-3 text-right font-bold text-green-600">{formatCurrency(aff.totalCommissionsEarned)}</td>
                                <td className="p-3 text-right text-yellow-600">{formatCurrency(aff.pendingCommissions)}</td>
                                <td className="p-3 text-right text-blue-600">{formatCurrency(aff.approvedCommissions)}</td>
                                <td className="p-3 text-right text-green-600">{formatCurrency(aff.paidCommissions)}</td>
                              </tr>
                              {expandedRows.has(aff.id) && (
                                <tr key={`${aff.id}-details`} className="bg-gray-50 border-t">
                                  <td colSpan={12} className="p-4">
                                    <div className="grid grid-cols-6 gap-4 text-sm">
                                      <div className="bg-white rounded p-3 border">
                                        <p className="text-gray-500 text-xs mb-1">L1 (Producer)</p>
                                        <p className="font-bold text-brand-navy">{formatCurrency(aff.commissionsByLevel?.level1 || 0)}</p>
                                      </div>
                                      <div className="bg-white rounded p-3 border">
                                        <p className="text-gray-500 text-xs mb-1">L2 (Upline 1)</p>
                                        <p className="font-bold text-brand-navy">{formatCurrency(aff.commissionsByLevel?.level2 || 0)}</p>
                                      </div>
                                      <div className="bg-white rounded p-3 border">
                                        <p className="text-gray-500 text-xs mb-1">L3 (Upline 2)</p>
                                        <p className="font-bold text-brand-navy">{formatCurrency(aff.commissionsByLevel?.level3 || 0)}</p>
                                      </div>
                                      <div className="bg-white rounded p-3 border">
                                        <p className="text-gray-500 text-xs mb-1">L4 (Upline 3)</p>
                                        <p className="font-bold text-brand-navy">{formatCurrency(aff.commissionsByLevel?.level4 || 0)}</p>
                                      </div>
                                      <div className="bg-white rounded p-3 border">
                                        <p className="text-gray-500 text-xs mb-1">L5 (Upline 4)</p>
                                        <p className="font-bold text-brand-navy">{formatCurrency(aff.commissionsByLevel?.level5 || 0)}</p>
                                      </div>
                                      <div className="bg-white rounded p-3 border">
                                        <p className="text-gray-500 text-xs mb-1">L6 (Upline 5)</p>
                                        <p className="font-bold text-brand-navy">{formatCurrency(aff.commissionsByLevel?.level6 || 0)}</p>
                                      </div>
                                    </div>
                                    <div className="mt-3 text-xs text-gray-500">
                                      Email: {aff.email} | Comp Active: {aff.isCompActive} | 
                                      Uplines: L1={aff.level1Id || '-'}, L2={aff.level2Id || '-'}, L3={aff.level3Id || '-'}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
