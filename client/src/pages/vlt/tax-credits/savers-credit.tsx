import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function SaversCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Saver's Credit (Retirement Savings Contributions Credit)</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Saver's Credit rewards low-to-moderate income workers for saving for retirement.
          This credit can reduce your tax bill on top of the tax benefits you already receive
          from retirement plan contributions.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Amount</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Maximum contribution base:</strong> $2,000 ($4,000 if married filing jointly)</li>
          <li><strong>Credit rate:</strong> 10%, 20%, or 50% depending on income</li>
          <li><strong>Maximum credit:</strong> Up to $1,000 ($2,000 if married filing jointly)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Income Limits (2025)</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Credit Rate</th>
                <th className="px-4 py-2 text-left">Single</th>
                <th className="px-4 py-2 text-left">Head of Household</th>
                <th className="px-4 py-2 text-left">Married Filing Jointly</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">50%</td>
                <td className="px-4 py-2">Up to $23,750</td>
                <td className="px-4 py-2">Up to $35,625</td>
                <td className="px-4 py-2">Up to $47,500</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">20%</td>
                <td className="px-4 py-2">$23,751 - $25,850</td>
                <td className="px-4 py-2">$35,626 - $38,775</td>
                <td className="px-4 py-2">$47,501 - $51,700</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">10%</td>
                <td className="px-4 py-2">$25,851 - $39,500</td>
                <td className="px-4 py-2">$38,776 - $59,250</td>
                <td className="px-4 py-2">$51,701 - $79,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Qualifying Contributions</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li>Traditional and Roth IRA contributions</li>
          <li>401(k), 403(b), and 457 plan contributions</li>
          <li>SIMPLE IRA and SEP IRA contributions</li>
          <li>ABLE account contributions (as of 2018)</li>
        </ul>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Check Your Eligibility
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
