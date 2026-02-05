import { useMemo, useState } from "react";
import { Layout } from "@/components/layout";
import { Calculator, DollarSign, Users, Building2, Info, ArrowLeft } from "lucide-react";

/**
 * COMP MODEL (Simplified):
 * - Contract gross commission (e.g., 18% for ICC) = the pool
 * - Producer: 69% of pool + compression from empty uplines
 * - Each upline: 1% of pool each (max 6 uplines)
 * - House: 22.5% of pool (fixed)
 * - Recruiter: 2.5% of pool (separate bounty)
 * - Compression: empty upline slots go to PRODUCER, not house
 */

export default function CompPlan() {
  const [dealAmount, setDealAmount] = useState<number>(100000);
  const [contractRate, setContractRate] = useState<number>(18);
  const [uplineCount, setUplineCount] = useState<number>(0);
  const [hasRecruiter, setHasRecruiter] = useState<boolean>(true);

  const maxUplines = 6;
  const producerBase = 0.69;
  const uplineEach = 0.01;
  const housePct = 0.225;
  const recruiterPct = 0.025;

  const results = useMemo(() => {
    const deal = Math.max(0, Number.isFinite(dealAmount) ? dealAmount : 0);
    const rate = Math.max(0, Math.min(100, Number.isFinite(contractRate) ? contractRate : 0)) / 100;
    const pool = deal * rate;
    const uplines = Math.max(0, Math.min(maxUplines, uplineCount));
    const emptyUplines = maxUplines - uplines;
    const compression = emptyUplines * uplineEach;
    const producerPct = producerBase + compression;
    const producerPay = pool * producerPct;
    const uplinePay = pool * uplineEach;
    const totalUplinePay = uplinePay * uplines;
    const housePay = pool * housePct;
    const recruiterPay = hasRecruiter ? pool * recruiterPct : 0;
    const totalPaid = producerPay + totalUplinePay + housePay + recruiterPay;

    return {
      pool,
      producerPct,
      producerPay,
      uplines,
      uplinePay,
      totalUplinePay,
      housePay,
      recruiterPay,
      totalPaid,
      emptyUplines,
      compression,
    };
  }, [dealAmount, contractRate, uplineCount, hasRecruiter]);

  const money = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  return (
    <Layout>
      <div className="bg-gradient-to-b from-brand-navy to-brand-navy/90 text-white py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all mb-6 group"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-base font-semibold">Back</span>
          </button>
          <div className="flex items-center gap-4 mb-4">
            <Calculator className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold font-bebas tracking-wide">Compensation Plan</h1>
              <p className="text-white/80">NavigatorUSA Commission Structure</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-brand-navy mb-4 flex items-center gap-2">
            <Info className="w-6 h-6" />
            How It Works
          </h2>
          <div className="prose max-w-none text-gray-700">
            <p className="mb-4">
              The <strong>producer</strong> (whoever closes the sale) receives <strong>69% base</strong> of the commission pool, 
              plus <strong>1% for each empty upline level</strong>. This means shorter chains = more money for the person doing the work.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border mb-4">
              <ul className="space-y-1 text-sm">
                <li><strong>Producer Base:</strong> 69% of pool</li>
                <li><strong>Each Upline:</strong> 1% of pool (max 6 uplines)</li>
                <li><strong>House:</strong> 22.5% of pool (fixed)</li>
                <li><strong>Recruiter Bounty:</strong> 2.5% of pool (separate)</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600">
              <strong>Compression:</strong> Empty upline slots compress <em>to the producer</em>, not the house. 
              A solo producer with no uplines keeps 75% (69% + 6%).
            </p>
          </div>
        </div>

        <div className="bg-brand-navy text-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Position Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-2 text-left">Position</th>
                  <th className="py-2 text-center">Uplines</th>
                  <th className="py-2 text-center">Producer Gets</th>
                  <th className="py-2 text-center">Uplines Get</th>
                  <th className="py-2 text-center">House</th>
                  <th className="py-2 text-center">Recruiter</th>
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
                  const empty = maxUplines - uplines;
                  const prod = producerBase + empty * uplineEach;
                  return (
                    <tr key={uplines} className={`border-b border-white/10 ${uplineCount === uplines ? 'bg-brand-red/30' : ''}`}>
                      <td className="py-2">{rank} - {title} {uplines === 0 ? '(Solo)' : `(${uplines} upline${uplines > 1 ? 's' : ''})`}</td>
                      <td className="py-2 text-center">{uplines} × 1%</td>
                      <td className="py-2 text-center font-bold text-green-300">{pct(prod)}</td>
                      <td className="py-2 text-center">{pct(uplines * uplineEach)}</td>
                      <td className="py-2 text-center">{pct(housePct)}</td>
                      <td className="py-2 text-center">{pct(recruiterPct)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-brand-navy mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Commission Calculator
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deal Amount ($)</label>
              <input
                type="number"
                value={dealAmount}
                onChange={(e) => setDealAmount(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-2"
                min={0}
                step={1000}
                data-testid="input-deal-amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Rate (%)</label>
              <input
                type="number"
                value={contractRate}
                onChange={(e) => setContractRate(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-2"
                min={0}
                max={100}
                step={1}
                data-testid="input-contract-rate"
              />
              <p className="text-xs text-gray-500 mt-1">e.g., 18% for ICC Logistics</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Uplines Above You</label>
              <select
                value={uplineCount}
                onChange={(e) => setUplineCount(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-2"
                data-testid="select-upline-count"
              >
                {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} {n === 0 ? '(Solo)' : n === 1 ? 'upline' : 'uplines'}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasRecruiter}
                  onChange={() => setHasRecruiter(!hasRecruiter)}
                  className="w-4 h-4"
                  data-testid="checkbox-recruiter"
                />
                <span className="text-sm">Recruiter (2.5%)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500">Commission Pool</div>
              <div className="text-lg font-bold text-brand-navy">{money(results.pool)}</div>
              <div className="text-xs text-gray-500">{contractRate}% of {money(dealAmount)}</div>
            </div>
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500">You (Producer)</div>
              <div className="text-lg font-bold text-green-700">{money(results.producerPay)}</div>
              <div className="text-xs text-gray-500">{pct(results.producerPct)} of pool</div>
            </div>
            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500">Uplines ({results.uplines})</div>
              <div className="text-lg font-bold text-blue-700">{money(results.totalUplinePay)}</div>
              <div className="text-xs text-gray-500">{results.uplines} × 1% each</div>
            </div>
            <div className="bg-brand-navy/10 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500">House</div>
              <div className="text-lg font-bold text-brand-navy">{money(results.housePay)}</div>
              <div className="text-xs text-gray-500">22.5% fixed</div>
            </div>
          </div>

          {results.emptyUplines > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-green-700 text-sm">
                <DollarSign className="w-4 h-4" />
                <span>
                  <strong>Compression Bonus:</strong> +{pct(results.compression)} ({money(results.pool * results.compression)}) from {results.emptyUplines} empty upline slot{results.emptyUplines > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Recipient</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-green-50">
                  <td className="py-2 font-medium">You (Producer)</td>
                  <td className="py-2 text-right">{pct(results.producerPct)}</td>
                  <td className="py-2 text-right font-bold text-green-700">{money(results.producerPay)}</td>
                </tr>
                {Array.from({ length: results.uplines }, (_, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">Upline {i + 1}</td>
                    <td className="py-2 text-right">1.0%</td>
                    <td className="py-2 text-right">{money(results.uplinePay)}</td>
                  </tr>
                ))}
                {hasRecruiter && (
                  <tr className="border-b bg-yellow-50">
                    <td className="py-2">Recruiter Bounty</td>
                    <td className="py-2 text-right">2.5%</td>
                    <td className="py-2 text-right">{money(results.recruiterPay)}</td>
                  </tr>
                )}
                <tr className="border-b bg-blue-50">
                  <td className="py-2">House</td>
                  <td className="py-2 text-right">22.5%</td>
                  <td className="py-2 text-right">{money(results.housePay)}</td>
                </tr>
                <tr className="font-bold bg-gray-100">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-right">100%</td>
                  <td className="py-2 text-right">{money(results.totalPaid)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="font-bold text-brand-navy mb-3">Example: ICC Logistics (18% rate)</h3>
          <p className="text-sm text-gray-700 mb-4">
            On a $100,000 deal at 18% rate ($18,000 commission pool):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded p-3">
              <div className="font-medium">Solo Producer</div>
              <div className="text-green-600 font-bold">$13,500 (75%)</div>
              <div className="text-xs text-gray-500">69% + 6% compression</div>
            </div>
            <div className="bg-white rounded p-3">
              <div className="font-medium">3 Uplines</div>
              <div className="text-green-600 font-bold">$12,960 (72%)</div>
              <div className="text-xs text-gray-500">69% + 3% compression</div>
            </div>
            <div className="bg-white rounded p-3">
              <div className="font-medium">6 Uplines (max)</div>
              <div className="text-green-600 font-bold">$12,420 (69%)</div>
              <div className="text-xs text-gray-500">69% base only</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
