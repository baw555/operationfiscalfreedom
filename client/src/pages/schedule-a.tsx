import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { FileText, DollarSign, Users, Building2, ChevronDown, ChevronUp, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface ContractTemplate {
  id: number;
  name: string;
  serviceName: string | null;
  grossCommissionPct: number | null;
  contractType: string;
  isActive: string;
}

interface SignedAgreement {
  id: number;
  contractTemplateId: number;
  affiliateName: string;
  signedAt: string;
}

interface ScheduleASignature {
  id: number;
  affiliateName: string;
  affiliateEmail: string;
  signedAt: string;
  acknowledgedUplineCount: number;
}

interface SignatureStatus {
  signed: boolean;
  signature: ScheduleASignature | null;
}

interface AuthData {
  user: { id: number; email: string; name: string; role: string } | null;
}

/**
 * Schedule A - Aggregate Commission Distribution
 * Shows all service contracts with their gross rates and calculates
 * the distribution based on the rep's position in the chain.
 */
export default function ScheduleA() {
  const [uplineCount, setUplineCount] = useState<number>(0);
  const [expandedContract, setExpandedContract] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const maxUplines = 6;
  const producerBase = 0.69;
  const uplineEach = 0.01;

  const { data: templates = [] } = useQuery<ContractTemplate[]>({
    queryKey: ["/api/contracts/templates"],
  });

  const { data: authData } = useQuery<AuthData>({
    queryKey: ["/api/auth/me"],
  });

  const { data: signatureStatus } = useQuery<SignatureStatus>({
    queryKey: ["/api/schedule-a/status"],
    enabled: !!authData?.user,
  });

  const signMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/schedule-a/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ uplineCount }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to sign");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Schedule A Acknowledged", description: "Your agreement has been recorded." });
      queryClient.invalidateQueries({ queryKey: ["/api/schedule-a/status"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const serviceContracts = useMemo(() => 
    templates.filter(t => t.contractType === "service" && t.grossCommissionPct),
    [templates]
  );

  const emptyUplines = maxUplines - uplineCount;
  const compression = emptyUplines * uplineEach;
  const producerPct = producerBase + compression;

  const calculateDistribution = (grossPct: number) => {
    const pool = grossPct / 100;
    return {
      producer: pool * producerPct,
    };
  };

  const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

  return (
    <Layout>
      <div className="bg-gradient-to-b from-brand-navy to-brand-navy/90 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <FileText className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold font-bebas tracking-wide">Schedule A</h1>
              <p className="text-white/80">Aggregate Commission Distribution</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-brand-navy mb-4">Your Position</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Uplines Above You
              </label>
              <select
                value={uplineCount}
                onChange={(e) => setUplineCount(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-3 text-lg"
                data-testid="select-schedule-uplines"
              >
                {[
                  { uplines: 0, rank: "E7", title: "SFC", desc: "Solo - Maximum earnings" },
                  { uplines: 1, rank: "E6", title: "SSG", desc: "1 upline" },
                  { uplines: 2, rank: "E5", title: "SGT", desc: "2 uplines" },
                  { uplines: 3, rank: "E4", title: "SPC", desc: "3 uplines" },
                  { uplines: 4, rank: "E3", title: "PFC", desc: "4 uplines" },
                  { uplines: 5, rank: "E2", title: "PV2", desc: "5 uplines" },
                  { uplines: 6, rank: "E1", title: "PVT", desc: "6 uplines" },
                ].map(({ uplines, rank, title, desc }) => (
                  <option key={uplines} value={uplines}>
                    {rank} - {title} ({desc})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Your Commission Rate</div>
              <div className="text-3xl font-bold text-green-700">{pct(producerPct)}</div>
              <div className="text-sm text-gray-500">
                Based on your position in the network
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-brand-navy text-white p-4">
            <h2 className="text-xl font-bold">Service Contracts</h2>
            <p className="text-sm text-white/70">Your commission distribution per contract</p>
          </div>

          {serviceContracts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No service contracts available yet.</p>
              <p className="text-sm mt-2">Service contracts will appear here once created.</p>
            </div>
          ) : (
            <div className="divide-y">
              {serviceContracts.map((contract) => {
                const dist = calculateDistribution(contract.grossCommissionPct || 0);
                const isExpanded = expandedContract === contract.id;
                
                return (
                  <div key={contract.id} className="p-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedContract(isExpanded ? null : contract.id)}
                    >
                      <div>
                        <h3 className="font-bold text-brand-navy">{contract.serviceName || contract.name}</h3>
                        <p className="text-sm text-gray-500">Gross Rate: {contract.grossCommissionPct}%</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">You Receive</div>
                          <div className="text-xl font-bold text-green-600">{pct(dist.producer)}</div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-green-100 rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600">$50,000 Deal</div>
                            <div className="text-2xl font-bold text-green-700">${(50000 * dist.producer).toLocaleString()}</div>
                          </div>
                          <div className="bg-green-100 rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600">$100,000 Deal</div>
                            <div className="text-2xl font-bold text-green-700">${(100000 * dist.producer).toLocaleString()}</div>
                          </div>
                          <div className="bg-green-100 rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600">$250,000 Deal</div>
                            <div className="text-2xl font-bold text-green-700">${(250000 * dist.producer).toLocaleString()}</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                          You earn <span className="font-bold text-green-700">{pct(dist.producer)}</span> on every deal you close
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* vGift Cards Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-8">
          <div className="bg-purple-700 text-white p-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              vGift Cards Compensation
            </h2>
            <p className="text-sm text-white/70">Volume-based gift card referral income</p>
          </div>

          <div className="p-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>How it works:</strong> The average American buys 5 gift cards per year. For every $100 gift card sold, you earn approximately <span className="text-purple-700 font-bold">$5.00 (~5%)</span>. 
                This makes each customer worth approximately <span className="text-purple-700 font-bold">$25/year</span>. This is a volume play, perfect for VSOs with large email lists and social media presence.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                <strong>Agreement Terms:</strong> Broker receives 70% of MAH's revenue on each referred account.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-brand-navy text-white">
                    <th className="py-3 px-4 text-left">Customer Base</th>
                    <th className="py-3 px-4 text-right">Customers</th>
                    <th className="py-3 px-4 text-right">Per Customer/Year</th>
                    <th className="py-3 px-4 text-right">Annual Income</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-gray-50">
                    <td className="py-3 px-4 font-medium">Starter Network</td>
                    <td className="py-3 px-4 text-right">500</td>
                    <td className="py-3 px-4 text-right">$25.00</td>
                    <td className="py-3 px-4 text-right font-bold text-purple-700">$12,500</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Growing Network</td>
                    <td className="py-3 px-4 text-right">750</td>
                    <td className="py-3 px-4 text-right">$25.00</td>
                    <td className="py-3 px-4 text-right font-bold text-purple-700">$18,750</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="py-3 px-4 font-medium">Established Network</td>
                    <td className="py-3 px-4 text-right">1,500</td>
                    <td className="py-3 px-4 text-right">$25.00</td>
                    <td className="py-3 px-4 text-right font-bold text-purple-700">$37,500</td>
                  </tr>
                  <tr className="bg-purple-100">
                    <td className="py-3 px-4 font-bold">Large Scale Operation</td>
                    <td className="py-3 px-4 text-right font-bold">5,000</td>
                    <td className="py-3 px-4 text-right">$25.00</td>
                    <td className="py-3 px-4 text-right font-bold text-purple-700 text-lg">$125,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4 text-center">
                <div className="text-xs opacity-80">500 Customers</div>
                <div className="text-xl font-bold">$12,500/yr</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg p-4 text-center">
                <div className="text-xs opacity-80">750 Customers</div>
                <div className="text-xl font-bold">$18,750/yr</div>
              </div>
              <div className="bg-gradient-to-br from-purple-700 to-purple-800 text-white rounded-lg p-4 text-center">
                <div className="text-xs opacity-80">1,500 Customers</div>
                <div className="text-xl font-bold">$37,500/yr</div>
              </div>
              <div className="bg-gradient-to-br from-brand-red to-red-700 text-white rounded-lg p-4 text-center">
                <div className="text-xs opacity-80">5,000 Customers</div>
                <div className="text-xl font-bold">$125,000/yr</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
              <strong className="text-yellow-800">Profit Goes to Veterans:</strong> <span className="text-gray-700">All profit generated from gift card sales goes directly to meet the needs of our Veterans through NavigatorUSA programs.</span>
            </div>
          </div>
        </div>

        {/* My Locker Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-8">
          <div className="bg-blue-700 text-white p-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6" />
              My Locker Compensation
            </h2>
            <p className="text-sm text-white/70">Custom print-on-demand apparel and corporate branding</p>
          </div>

          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>My LOCKER</strong> is a custom print-on-demand apparel and corporate branding store. As a broker, you earn <span className="text-blue-700 font-bold">20% of the gross profit</span> generated from all sales you refer to the platform.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-brand-navy text-white">
                    <th className="py-3 px-4 text-left">Metric</th>
                    <th className="py-3 px-4 text-right">Small Orders</th>
                    <th className="py-3 px-4 text-right">Medium Orders</th>
                    <th className="py-3 px-4 text-right">Large Orders</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-gray-50">
                    <td className="py-3 px-4 font-medium">Monthly Sales Volume</td>
                    <td className="py-3 px-4 text-right">$5,000</td>
                    <td className="py-3 px-4 text-right">$15,000</td>
                    <td className="py-3 px-4 text-right">$50,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Avg. Gross Profit Margin (~40%)</td>
                    <td className="py-3 px-4 text-right">$2,000</td>
                    <td className="py-3 px-4 text-right">$6,000</td>
                    <td className="py-3 px-4 text-right">$20,000</td>
                  </tr>
                  <tr className="border-b bg-blue-50">
                    <td className="py-3 px-4 font-medium">Your Rate (20% of Gross Profit)</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-700">20%</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-700">20%</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-700">20%</td>
                  </tr>
                  <tr className="border-b bg-blue-100">
                    <td className="py-3 px-4 font-bold">Your Monthly Earnings</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-700">$400</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-700">$1,200</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-700">$4,000</td>
                  </tr>
                  <tr className="bg-brand-navy text-white">
                    <td className="py-3 px-4 font-bold">Annual Income</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-400">$4,800</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-400">$14,400</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-400">$48,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 text-center">
                <div className="text-sm opacity-80">Small Orders</div>
                <div className="text-2xl font-bold">$4,800/yr</div>
                <div className="text-xs opacity-70">$400/month</div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-4 text-center">
                <div className="text-sm opacity-80">Medium Orders</div>
                <div className="text-2xl font-bold">$14,400/yr</div>
                <div className="text-xs opacity-70">$1,200/month</div>
              </div>
              <div className="bg-gradient-to-br from-blue-700 to-blue-800 text-white rounded-lg p-4 text-center">
                <div className="text-sm opacity-80">Large Orders</div>
                <div className="text-2xl font-bold">$48,000/yr</div>
                <div className="text-xs opacity-70">$4,000/month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Merchant Processing Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-8">
          <div className="bg-green-700 text-white p-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Merchant Processing Compensation
            </h2>
            <p className="text-sm text-white/70">Revenue share from credit card processing volume</p>
          </div>

          <div className="p-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>How it works:</strong> Merchant Processing compensation is generated from the profit on credit card processing (approximately 3% of business transaction volume). 
                As an agent, you receive <span className="text-green-700 font-bold">20%</span> of the NET Transaction Revenue.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-brand-navy text-white">
                    <th className="py-3 px-4 text-left">Metric</th>
                    <th className="py-3 px-4 text-right">Small Business</th>
                    <th className="py-3 px-4 text-right">Medium Business</th>
                    <th className="py-3 px-4 text-right">Large Business</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-gray-50">
                    <td className="py-3 px-4 font-medium">Monthly Card Charges</td>
                    <td className="py-3 px-4 text-right">$25,000</td>
                    <td className="py-3 px-4 text-right">$50,000</td>
                    <td className="py-3 px-4 text-right">$100,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Avg. Total NET Transaction Revenue</td>
                    <td className="py-3 px-4 text-right">$720.00</td>
                    <td className="py-3 px-4 text-right">$965.00</td>
                    <td className="py-3 px-4 text-right">$1,945.00</td>
                  </tr>
                  <tr className="border-b bg-green-50">
                    <td className="py-3 px-4 font-medium">Agent Compensation Rate</td>
                    <td className="py-3 px-4 text-right font-bold text-green-700">20%</td>
                    <td className="py-3 px-4 text-right font-bold text-green-700">20%</td>
                    <td className="py-3 px-4 text-right font-bold text-green-700">20%</td>
                  </tr>
                  <tr className="border-b bg-green-100">
                    <td className="py-3 px-4 font-bold">Your Monthly Earnings</td>
                    <td className="py-3 px-4 text-right font-bold text-green-700">$144.00</td>
                    <td className="py-3 px-4 text-right font-bold text-green-700">$193.00</td>
                    <td className="py-3 px-4 text-right font-bold text-green-700">$389.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Annual Income per Account</td>
                    <td className="py-3 px-4 text-right">$1,728.00</td>
                    <td className="py-3 px-4 text-right">$2,316.00</td>
                    <td className="py-3 px-4 text-right">$4,668.00</td>
                  </tr>
                  <tr className="bg-brand-navy text-white">
                    <td className="py-3 px-4 font-bold">Annual Income with 25 Accounts</td>
                    <td className="py-3 px-4 text-right font-bold text-green-400">$43,200.00</td>
                    <td className="py-3 px-4 text-right font-bold text-green-400">$57,900.00</td>
                    <td className="py-3 px-4 text-right font-bold text-green-400">$116,700.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg p-4 text-center">
                <div className="text-sm opacity-80">25 Small Businesses</div>
                <div className="text-2xl font-bold">$43,200/yr</div>
                <div className="text-xs opacity-70">$3,600/month</div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-4 text-center">
                <div className="text-sm opacity-80">25 Medium Businesses</div>
                <div className="text-2xl font-bold">$57,900/yr</div>
                <div className="text-xs opacity-70">$4,825/month</div>
              </div>
              <div className="bg-gradient-to-br from-brand-red to-red-700 text-white rounded-lg p-4 text-center">
                <div className="text-sm opacity-80">25 Large Businesses</div>
                <div className="text-2xl font-bold">$116,700/yr</div>
                <div className="text-xs opacity-70">$9,725/month</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
              <strong className="text-yellow-800">Note:</strong> <span className="text-gray-700">Merchant Processing income is <strong>residual</strong> - you continue earning as long as the business processes transactions. Build a portfolio of accounts for long-term passive income.</span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6 text-sm text-gray-600">
          <h3 className="font-bold text-brand-navy mb-2">Your Compensation Summary</h3>
          <ul className="space-y-2">
            <li><strong>Service Contracts:</strong> Your rate increases based on your position in the network - up to 75% on every deal you close.</li>
            <li><strong>Merchant Processing:</strong> Earn 20% of NET Transaction Revenue. Residual income as long as the merchant remains active.</li>
            <li><strong>vGift Cards:</strong> Earn ~$5 per $100 gift card sold (~5%). Average customer worth $25/year.</li>
            <li><strong>My Locker:</strong> Earn 20% of gross profit on all print-on-demand apparel and corporate branding sales you refer.</li>
          </ul>
        </div>

        {/* Signature Section */}
        <div className="mt-8 border-2 border-brand-navy rounded-lg overflow-hidden">
          <div className="bg-brand-navy text-white p-4 flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <h3 className="font-bold text-lg">Schedule A Acknowledgment</h3>
          </div>
          
          <div className="p-6 bg-white">
            {signatureStatus?.signed ? (
              <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg" data-testid="schedule-a-signed-status">
                <CheckCircle className="w-10 h-10 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-green-800" data-testid="text-schedule-a-signed">Schedule A Acknowledged</p>
                  <p className="text-sm text-green-700">
                    Signed by {signatureStatus.signature?.affiliateName} on{" "}
                    {signatureStatus.signature?.signedAt 
                      ? new Date(signatureStatus.signature.signedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            ) : authData?.user ? (
              <div className="space-y-4">
                <p className="text-gray-700">
                  By clicking "I Agree" below, I acknowledge that I have read and understand the commission 
                  structure outlined in this Schedule A. I understand that my earnings are based on my position 
                  in the network and the services I help provide to clients.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="text-sm text-gray-600">
                    Signing as: <strong>{authData.user.name}</strong> ({authData.user.email})
                  </div>
                  <Button
                    onClick={() => signMutation.mutate()}
                    disabled={signMutation.isPending}
                    className="bg-brand-navy hover:bg-brand-navy/90 text-white font-bold px-8"
                    data-testid="button-schedule-a-sign"
                  >
                    {signMutation.isPending ? "Processing..." : "I Agree - Sign Schedule A"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4" data-testid="schedule-a-login-prompt">
                <p className="text-gray-600 mb-4">
                  Please log in to acknowledge Schedule A.
                </p>
                <Link href="/login">
                  <Button className="bg-brand-navy hover:bg-brand-navy/90" data-testid="button-schedule-a-login">
                    Login to Sign
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
