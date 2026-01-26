import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { FileText, Calculator, DollarSign, Users, Building2, ChevronDown, ChevronUp } from "lucide-react";

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

/**
 * Schedule A - Aggregate Commission Distribution
 * Shows all service contracts with their gross rates and calculates
 * the distribution based on the rep's position in the chain.
 */
export default function ScheduleA() {
  const [uplineCount, setUplineCount] = useState<number>(0);
  const [expandedContract, setExpandedContract] = useState<number | null>(null);

  const maxUplines = 6;
  const producerBase = 0.69;
  const uplineEach = 0.01;
  const housePct = 0.225;
  const recruiterPct = 0.025;

  const { data: templates = [] } = useQuery<ContractTemplate[]>({
    queryKey: ["/api/contracts/templates"],
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
      eachUpline: pool * uplineEach,
      totalUplines: pool * uplineEach * uplineCount,
      house: pool * housePct,
      recruiter: pool * recruiterPct,
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
                {producerBase * 100}% base {emptyUplines > 0 && `+ ${emptyUplines}% compression`}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-brand-navy mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Distribution Formula
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white rounded p-3 text-center">
              <div className="text-xs text-gray-500">You (Producer)</div>
              <div className="text-xl font-bold text-green-600">{pct(producerPct)}</div>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <div className="text-xs text-gray-500">Each Upline ({uplineCount})</div>
              <div className="text-xl font-bold text-blue-600">1.00%</div>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <div className="text-xs text-gray-500">House</div>
              <div className="text-xl font-bold text-brand-navy">22.50%</div>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <div className="text-xs text-gray-500">Recruiter</div>
              <div className="text-xl font-bold text-yellow-600">2.50%</div>
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
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="py-2 text-left">Recipient</th>
                              <th className="py-2 text-right">Rate</th>
                              <th className="py-2 text-right">Of Deal</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b bg-green-50">
                              <td className="py-2 font-medium">You (Producer)</td>
                              <td className="py-2 text-right">{pct(producerPct)} of {contract.grossCommissionPct}%</td>
                              <td className="py-2 text-right font-bold text-green-600">{pct(dist.producer)}</td>
                            </tr>
                            {Array.from({ length: uplineCount }, (_, i) => (
                              <tr key={i} className="border-b">
                                <td className="py-2">Upline {i + 1}</td>
                                <td className="py-2 text-right">1.00% of {contract.grossCommissionPct}%</td>
                                <td className="py-2 text-right">{pct(dist.eachUpline)}</td>
                              </tr>
                            ))}
                            <tr className="border-b bg-yellow-50">
                              <td className="py-2">Recruiter</td>
                              <td className="py-2 text-right">2.50% of {contract.grossCommissionPct}%</td>
                              <td className="py-2 text-right">{pct(dist.recruiter)}</td>
                            </tr>
                            <tr className="border-b bg-blue-50">
                              <td className="py-2">House</td>
                              <td className="py-2 text-right">22.50% of {contract.grossCommissionPct}%</td>
                              <td className="py-2 text-right">{pct(dist.house)}</td>
                            </tr>
                            <tr className="font-bold bg-gray-100">
                              <td className="py-2">Total</td>
                              <td className="py-2 text-right">100% of {contract.grossCommissionPct}%</td>
                              <td className="py-2 text-right">{contract.grossCommissionPct}%</td>
                            </tr>
                          </tbody>
                        </table>

                        <div className="mt-4 p-3 bg-green-100 rounded text-sm">
                          <strong>Example:</strong> On a $100,000 deal, you would receive {pct(dist.producer)} = <strong>${(100000 * dist.producer).toLocaleString()}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6 text-sm text-gray-600">
          <h3 className="font-bold text-brand-navy mb-2">Schedule A Terms</h3>
          <ul className="space-y-2">
            <li><strong>Producer:</strong> The representative who closes the sale receives 69% base + compression from empty upline slots.</li>
            <li><strong>Uplines:</strong> Each level above the producer receives 1% of the commission pool.</li>
            <li><strong>Compression:</strong> Empty upline levels (up to 6) compress to the producer, not the house.</li>
            <li><strong>House:</strong> Fixed 22.5% of all commissions.</li>
            <li><strong>Recruiter Bounty:</strong> Separate 2.5% to the person who recruited the producing representative.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
