import { useMemo, useState } from "react";
import { Layout } from "@/components/layout";
import { Calculator, DollarSign, Users, Building2, Info } from "lucide-react";

/**
 * COMP MODEL:
 * - Gross Revenue = 100%
 * - Rep ecosystem separate: 22.5% house comp pool (outside this page) + 2.5% recruiter bounty
 * - House Allocation Pool = 75% of Gross, broken into 6 levels:
 *    L1 (Top Rep) = 67% of Gross (on their produced business)
 *    Remaining 8% of Gross allocated across Levels 2–6 (5 levels), weighted toward closest rep:
 *      L2 = 3.5%
 *      L3 = 2.0%
 *      L4 = 1.2%
 *      L5 = 0.8%
 *      L6 = 0.5%  (Company base)
 *    Total = 67% + 8% = 75%
 * - Compression: inactive L2–L5 collapse upward into L6 (Company). No sideways redistribution.
 */

export default function CompPlan() {
  const [grossRevenue, setGrossRevenue] = useState<number>(100000);
  const [recruiterExists, setRecruiterExists] = useState<boolean>(true);
  const [l2Active, setL2Active] = useState<boolean>(true);
  const [l3Active, setL3Active] = useState<boolean>(true);
  const [l4Active, setL4Active] = useState<boolean>(true);
  const [l5Active, setL5Active] = useState<boolean>(true);

  const pct = {
    recruiter: 0.025,
    l1: 0.67,
    l2: 0.035,
    l3: 0.020,
    l4: 0.012,
    l5: 0.008,
    l6: 0.005,
  };

  const results = useMemo(() => {
    const gross = Math.max(0, Number.isFinite(grossRevenue) ? grossRevenue : 0);

    const recruiterPay = recruiterExists ? gross * pct.recruiter : 0;
    const housePool = gross * 0.75;
    const l1Pay = gross * pct.l1;

    const l2Base = gross * pct.l2;
    const l3Base = gross * pct.l3;
    const l4Base = gross * pct.l4;
    const l5Base = gross * pct.l5;
    const l6Base = gross * pct.l6;

    const l2Pay = l2Active ? l2Base : 0;
    const l3Pay = l3Active ? l3Base : 0;
    const l4Pay = l4Active ? l4Base : 0;
    const l5Pay = l5Active ? l5Base : 0;

    const compressedToL6 =
      (l2Active ? 0 : l2Base) +
      (l3Active ? 0 : l3Base) +
      (l4Active ? 0 : l4Base) +
      (l5Active ? 0 : l5Base);

    const l6Pay = l6Base + compressedToL6;

    const houseAllocated = l1Pay + l2Pay + l3Pay + l4Pay + l5Pay + l6Pay;
    const totalPaid = recruiterPay + houseAllocated;

    return {
      gross,
      recruiterPay,
      housePool,
      l1Pay,
      l2Pay,
      l3Pay,
      l4Pay,
      l5Pay,
      l6Pay,
      houseAllocated,
      totalPaid,
    };
  }, [grossRevenue, recruiterExists, l2Active, l3Active, l4Active, l5Active]);

  const money = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  const pctDisplay = (n: number, total: number) =>
    total > 0 ? `${((n / total) * 100).toFixed(1)}%` : "0%";

  return (
    <Layout>
      <div className="bg-gradient-to-b from-brand-navy to-brand-navy/90 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Calculator className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold font-bebas tracking-wide">Compensation Plan</h1>
              <p className="text-white/80">NavigatorUSA 6-Level Commission Structure</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-10">
        <section className="bg-white rounded-lg border shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-6 h-6 text-brand-navy" />
            <h2 className="text-xl font-bold text-brand-navy">Compensation Plan Language</h2>
          </div>

          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              <strong>Gross Revenue</strong> means revenue actually received by the Company from a customer transaction, net of refunds,
              chargebacks, taxes collected on behalf of governmental authorities, and payment processing fees.
            </p>

            <p>
              <strong>Recruiter / Sponsor Bounty (Separate).</strong> A separate <strong className="text-brand-red">2.5%</strong> recruiter bounty may be paid to the
              individual who directly introduces a producing representative into the network. This bounty is outside of, and does not reduce,
              the House Allocation Pool.
            </p>

            <p>
              <strong>House Allocation Pool.</strong> The Company retains and conditionally allocates <strong className="text-brand-red">75%</strong> of Gross Revenue
              (the "House Allocation Pool") across six levels as follows, subject to performance eligibility and compression:
            </p>

            <div className="bg-gray-50 rounded-lg p-4 border">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-24 font-bold text-brand-navy">Level 1:</span>
                  <span className="font-bold text-brand-red">67%</span>
                  <span className="text-gray-600">of Gross Revenue (Top Producer - direct business)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-24 font-bold text-brand-navy">Level 2:</span>
                  <span className="font-bold text-brand-red">3.5%</span>
                  <span className="text-gray-600">of Gross Revenue (Closest Upline - conditional)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-24 font-bold text-brand-navy">Level 3:</span>
                  <span className="font-bold text-brand-red">2.0%</span>
                  <span className="text-gray-600">of Gross Revenue (conditional)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-24 font-bold text-brand-navy">Level 4:</span>
                  <span className="font-bold text-brand-red">1.2%</span>
                  <span className="text-gray-600">of Gross Revenue (conditional)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-24 font-bold text-brand-navy">Level 5:</span>
                  <span className="font-bold text-brand-red">0.8%</span>
                  <span className="text-gray-600">of Gross Revenue (conditional)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-24 font-bold text-brand-navy">Level 6:</span>
                  <span className="font-bold text-brand-red">0.5%</span>
                  <span className="text-gray-600">of Gross Revenue (Company + compression)</span>
                </li>
              </ul>
            </div>

            <p>
              <strong>Compression & Reversion.</strong> Levels 2–5 are not automatic. If any Level 2–5 participant is inactive, non-compliant,
              or fails to meet performance thresholds established by the Company, that level's allocation automatically <strong>compresses upward
              and reverts to Level 6 (Company)</strong>. No sideways redistribution occurs.
            </p>

            <p>
              <strong>Non-Vested / Modifiable.</strong> All allocations are non-vested, non-guaranteed, and subject to modification, suspension,
              or termination by the Company prospectively with notice.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-lg border shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-6 h-6 text-brand-navy" />
            <h2 className="text-xl font-bold text-brand-navy">Live Calculator</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Gross Revenue</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={grossRevenue}
                  onChange={(e) => setGrossRevenue(Number(e.target.value))}
                  className="border p-3 pl-10 w-full rounded-lg"
                  min={0}
                  step={1000}
                  data-testid="input-gross-revenue"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={recruiterExists}
                onChange={() => setRecruiterExists(!recruiterExists)}
                className="w-5 h-5"
                data-testid="checkbox-recruiter"
              />
              <div>
                <div className="font-medium">Recruiter Exists</div>
                <div className="text-sm text-gray-500">2.5% bounty (separate)</div>
              </div>
            </label>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-brand-navy mb-3">Level Activity (Compression)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input type="checkbox" checked={l2Active} onChange={() => setL2Active(!l2Active)} className="w-4 h-4" data-testid="checkbox-l2" />
                <span>Level 2 (3.5%)</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input type="checkbox" checked={l3Active} onChange={() => setL3Active(!l3Active)} className="w-4 h-4" data-testid="checkbox-l3" />
                <span>Level 3 (2.0%)</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input type="checkbox" checked={l4Active} onChange={() => setL4Active(!l4Active)} className="w-4 h-4" data-testid="checkbox-l4" />
                <span>Level 4 (1.2%)</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input type="checkbox" checked={l5Active} onChange={() => setL5Active(!l5Active)} className="w-4 h-4" data-testid="checkbox-l5" />
                <span>Level 5 (0.8%)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-brand-navy text-white rounded-lg p-4">
              <div className="text-sm opacity-80">House Allocation Pool (75%)</div>
              <div className="text-2xl font-bold" data-testid="text-house-pool">{money(results.housePool)}</div>
            </div>
            <div className="bg-brand-red text-white rounded-lg p-4">
              <div className="text-sm opacity-80">Top Rep Earnings (67%)</div>
              <div className="text-2xl font-bold" data-testid="text-l1-pay">{money(results.l1Pay)}</div>
            </div>
            <div className="bg-green-600 text-white rounded-lg p-4">
              <div className="text-sm opacity-80">Total Distributed</div>
              <div className="text-2xl font-bold" data-testid="text-total-paid">{money(results.totalPaid)}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg overflow-hidden">
              <thead>
                <tr className="border-b font-semibold bg-gray-50">
                  <td className="p-3">Level / Bucket</td>
                  <td className="p-3">Rate</td>
                  <td className="p-3">Payout</td>
                  <td className="p-3">% of Gross</td>
                  <td className="p-3">Status</td>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-yellow-50">
                  <td className="p-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-yellow-600" />
                    Recruiter Bounty
                  </td>
                  <td className="p-3">2.5%</td>
                  <td className="p-3 font-medium" data-testid="text-recruiter-pay">{money(results.recruiterPay)}</td>
                  <td className="p-3">{pctDisplay(results.recruiterPay, results.gross)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${recruiterExists ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {recruiterExists ? "Active" : "None"}
                    </span>
                  </td>
                </tr>

                <tr className="border-b bg-brand-red/10 font-semibold">
                  <td className="p-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-brand-red" />
                    Level 1 — Top Producer
                  </td>
                  <td className="p-3">67%</td>
                  <td className="p-3" data-testid="text-l1-table">{money(results.l1Pay)}</td>
                  <td className="p-3">{pctDisplay(results.l1Pay, results.gross)}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-700">Always Paid</span>
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3">Level 2 — Closest Upline</td>
                  <td className="p-3">3.5%</td>
                  <td className="p-3" data-testid="text-l2-pay">{money(results.l2Pay)}</td>
                  <td className="p-3">{pctDisplay(results.l2Pay, results.gross)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${l2Active ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {l2Active ? "Active" : "→ L6"}
                    </span>
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3">Level 3</td>
                  <td className="p-3">2.0%</td>
                  <td className="p-3" data-testid="text-l3-pay">{money(results.l3Pay)}</td>
                  <td className="p-3">{pctDisplay(results.l3Pay, results.gross)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${l3Active ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {l3Active ? "Active" : "→ L6"}
                    </span>
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3">Level 4</td>
                  <td className="p-3">1.2%</td>
                  <td className="p-3" data-testid="text-l4-pay">{money(results.l4Pay)}</td>
                  <td className="p-3">{pctDisplay(results.l4Pay, results.gross)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${l4Active ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {l4Active ? "Active" : "→ L6"}
                    </span>
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3">Level 5</td>
                  <td className="p-3">0.8%</td>
                  <td className="p-3" data-testid="text-l5-pay">{money(results.l5Pay)}</td>
                  <td className="p-3">{pctDisplay(results.l5Pay, results.gross)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${l5Active ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {l5Active ? "Active" : "→ L6"}
                    </span>
                  </td>
                </tr>

                <tr className="bg-brand-navy/10 font-bold">
                  <td className="p-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-brand-navy" />
                    Level 6 — Company
                  </td>
                  <td className="p-3">0.5% + comp</td>
                  <td className="p-3" data-testid="text-l6-pay">{money(results.l6Pay)}</td>
                  <td className="p-3">{pctDisplay(results.l6Pay, results.gross)}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-700">Base + Compression</span>
                  </td>
                </tr>

                <tr className="bg-green-50 font-bold">
                  <td className="p-3" colSpan={2}>Total Paid (Recruiter + House Pool)</td>
                  <td className="p-3 text-lg" data-testid="text-total-table">{money(results.totalPaid)}</td>
                  <td className="p-3">{pctDisplay(results.totalPaid, results.gross)}</td>
                  <td className="p-3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <strong>Note:</strong> The remaining 22.5% of gross revenue is retained by the Company for operational costs, marketing, technology, and reserves.
            Total allocation: 75% House Pool + 2.5% Recruiter = 77.5% maximum distribution.
          </div>
        </section>
      </div>
    </Layout>
  );
}
