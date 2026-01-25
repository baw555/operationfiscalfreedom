import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function FICATipCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy" data-testid="heading-fica-tip-credit">FICA Tip Credit (Section 45B)</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The FICA Tip Credit allows employers to claim a tax credit equal to the employer's share of
          Social Security and Medicare taxes (7.65%) paid on employee tips that exceed minimum wage thresholds.
          This credit can save restaurants and service businesses thousands of dollars annually.
        </p>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Eligible Business Types</h2>
        <div className="mt-3 grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">Original Categories</h3>
            <ul className="mt-2 list-disc ml-6 text-gray-700 space-y-1">
              <li>Restaurants</li>
              <li>Bars and taverns</li>
              <li>Hotels and resorts (food service)</li>
              <li>Catering companies</li>
              <li>Food delivery services</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">Expanded Categories (2025+)</h3>
            <ul className="mt-2 list-disc ml-6 text-gray-700 space-y-1">
              <li>Hair salons</li>
              <li>Barbershops</li>
              <li>Spas and wellness centers</li>
              <li>Nail salons</li>
              <li>Other personal care services</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Calculation</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border">Item</th>
                <th className="px-4 py-2 text-left border">2025</th>
                <th className="px-4 py-2 text-left border">2026</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border">Social Security Wage Base</td>
                <td className="px-4 py-2 border">$176,100</td>
                <td className="px-4 py-2 border">$184,500</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">Restaurant Minimum Wage Baseline</td>
                <td className="px-4 py-2 border">$5.15/hour</td>
                <td className="px-4 py-2 border">$5.15/hour</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">Non-Restaurant Baseline</td>
                <td className="px-4 py-2 border">$7.25/hour</td>
                <td className="px-4 py-2 border">$7.25/hour</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">FICA Rate (below wage base)</td>
                <td className="px-4 py-2 border">7.65%</td>
                <td className="px-4 py-2 border">7.65%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">Medicare-only Rate (above wage base)</td>
                <td className="px-4 py-2 border">1.45%</td>
                <td className="px-4 py-2 border">1.45%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">What Tips Qualify</h2>
        <div className="mt-3 grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700">Qualified Tips ✓</h3>
            <ul className="mt-2 list-disc ml-6 text-gray-700 space-y-1">
              <li>Cash tips reported by employees</li>
              <li>Credit card tips</li>
              <li>Tips reported on Form 4070</li>
              <li>Tips where employer FICA was paid</li>
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-700">Non-Qualifying Tips ✗</h3>
            <ul className="mt-2 list-disc ml-6 text-gray-700 space-y-1">
              <li>Service charges or auto-gratuities</li>
              <li>Tips used to reach minimum wage</li>
              <li>Unreported tips</li>
              <li>Tips without FICA paid</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Example Calculation</h2>
        <div className="mt-3 bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700">
            <strong>Scenario:</strong> A restaurant with $50,000 in qualifying annual tips
          </p>
          <ul className="mt-2 list-disc ml-6 text-gray-700 space-y-1">
            <li>Qualifying tips: $50,000</li>
            <li>FICA rate: 7.65%</li>
            <li><strong>Annual credit: $3,825</strong></li>
          </ul>
          <p className="mt-3 text-gray-700 text-sm">
            For a multi-location restaurant group, this can translate to tens of thousands in savings.
          </p>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">How to Claim</h2>
        <ol className="mt-3 list-decimal ml-6 text-gray-700 space-y-2">
          <li><strong>Track tips:</strong> Maintain accurate employee tip reports (Form 4070)</li>
          <li><strong>Pay FICA:</strong> Ensure employer FICA taxes are paid on reported tips</li>
          <li><strong>Complete Form 8846:</strong> Calculate creditable tips and credit amount</li>
          <li><strong>File with tax return:</strong> Attach Form 8846 to your annual business tax return</li>
          <li><strong>Carry forward:</strong> Unused credits can carry back 1 year or forward 20 years</li>
        </ol>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Record Keeping Requirements</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Accurate tip reports from employees (Form 4070)</li>
          <li>Payroll records showing FICA taxes paid on tips</li>
          <li>Monthly worksheets calculating creditable tips</li>
          <li>Documentation distinguishing tips from service charges</li>
          <li>For large establishments: Form 8027 reporting</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Common Mistakes to Avoid</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Counting service charges toward the credit (only true tips count)</li>
          <li>Including tips below the minimum wage threshold</li>
          <li>Failing to report tips properly or not paying FICA on them</li>
          <li>Missing quarterly employment tax filing requirements</li>
          <li>Not maintaining proper tip documentation</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">"No Tax on Tips" Law (2025-2028)</h2>
        <p className="mt-3 text-gray-700">
          In addition to the employer FICA Tip Credit, employees can now deduct up to $25,000 of
          qualified tips from their personal federal income tax. This is separate from the employer
          credit but creates additional value for your workforce.
        </p>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Employee benefit, not an employer credit</li>
          <li>FICA taxes still apply to tips</li>
          <li>Phases out at higher incomes ($150K individual / $300K joint)</li>
          <li>Effective for tax years 2025-2028</li>
        </ul>

        <div className="mt-10 p-6 bg-brand-navy/5 rounded-lg">
          <h3 className="text-xl font-semibold text-brand-navy">Let Us Maximize Your FICA Tip Credit</h3>
          <p className="mt-2 text-gray-700">
            Many eligible businesses don't claim this credit or don't claim the full amount.
            Our tax specialists can review your payroll records and help you capture every dollar.
          </p>
          <Link href="/veteran-led-tax/intake">
            <span className="inline-block mt-4 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer" data-testid="button-claim-fica-credit">
              Get a Free FICA Credit Review
            </span>
          </Link>
        </div>
      </Container>
      <Footer />
    </>
  );
}
