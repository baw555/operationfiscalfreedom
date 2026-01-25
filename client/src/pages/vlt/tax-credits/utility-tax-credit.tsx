import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function UtilityTaxCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy" data-testid="heading-utility-tax-credit">Utility & Energy Efficiency Tax Credits</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Inflation Reduction Act of 2022 dramatically expanded tax credits for energy efficiency, 
          renewable energy, and utility cost savings. Both businesses and homeowners can claim substantial 
          credits for qualifying energy improvements through 2032 and beyond.
        </p>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Business Energy Credits (2025-2026)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border">Credit Type</th>
                <th className="px-4 py-2 text-left border">Base Rate</th>
                <th className="px-4 py-2 text-left border">Bonus Rate*</th>
                <th className="px-4 py-2 text-left border">Qualifying Improvements</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border font-medium">Investment Tax Credit (ITC)</td>
                <td className="px-4 py-2 border">6%</td>
                <td className="px-4 py-2 border">30%</td>
                <td className="px-4 py-2 border">Solar, wind, geothermal, battery storage</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-medium">Production Tax Credit (PTC)</td>
                <td className="px-4 py-2 border">0.3¢/kWh</td>
                <td className="px-4 py-2 border">1.5¢/kWh</td>
                <td className="px-4 py-2 border">Renewable electricity production</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-medium">179D Deduction</td>
                <td className="px-4 py-2 border">$0.50/sq ft</td>
                <td className="px-4 py-2 border">$5.00/sq ft</td>
                <td className="px-4 py-2 border">Commercial building energy efficiency</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-medium">45L Credit</td>
                <td className="px-4 py-2 border">$500</td>
                <td className="px-4 py-2 border">$5,000</td>
                <td className="px-4 py-2 border">Energy-efficient new home construction</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          *Bonus rates require prevailing wage and apprenticeship compliance for projects over 1 MW.
        </p>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Section 179D Commercial Building Deduction</h2>
        <p className="mt-3 text-gray-700">
          Building owners and designers can claim significant deductions for energy-efficient improvements:
        </p>
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">Qualifying Systems</h3>
            <ul className="mt-2 list-disc ml-6 text-gray-700 space-y-1">
              <li>HVAC and hot water systems</li>
              <li>Interior lighting systems</li>
              <li>Building envelope improvements</li>
              <li>Building automation controls</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">Maximum Deduction</h3>
            <ul className="mt-2 text-gray-700 space-y-1">
              <li>Up to <strong>$5.00 per sq ft</strong> with bonus</li>
              <li>25% or greater energy savings required</li>
              <li>Partial deductions available</li>
              <li>Architects/engineers can claim for public buildings</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Solar Investment Tax Credit (ITC)</h2>
        <div className="mt-4 space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-700">2024-2032 Credit Schedule</h3>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-3 rounded">
                <p className="text-2xl font-bold text-brand-navy">30%</p>
                <p className="text-sm text-gray-600">2025-2032</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-2xl font-bold text-brand-navy">26%</p>
                <p className="text-sm text-gray-600">2033</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-2xl font-bold text-brand-navy">22%</p>
                <p className="text-sm text-gray-600">2034</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-2xl font-bold text-brand-navy">0%</p>
                <p className="text-sm text-gray-600">2035+</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Battery Storage Credit (New for IRA)</h2>
        <p className="mt-3 text-gray-700">
          Standalone battery storage systems now qualify for the full ITC without needing to be paired with solar:
        </p>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Credit rate:</strong> 30% of installed costs</li>
          <li><strong>Minimum capacity:</strong> 3 kWh for residential, 5 kWh for commercial</li>
          <li><strong>Eligible costs:</strong> Equipment, installation, permitting, balance of system</li>
          <li><strong>Bonus adders:</strong> +10% for domestic content, +10% for low-income community</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Residential Energy Credits (25C & 25D)</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">Energy Efficient Home Improvement (25C)</h3>
            <p className="mt-2 text-sm text-gray-700 font-medium">30% credit, up to $3,200/year</p>
            <ul className="mt-2 list-disc ml-6 text-sm text-gray-700 space-y-1">
              <li>Insulation & air sealing: $1,200 max</li>
              <li>Windows & skylights: $600 max</li>
              <li>Exterior doors: $500 max ($250 each)</li>
              <li>Heat pumps: $2,000 max</li>
              <li>Water heaters (heat pump): $2,000 max</li>
              <li>Electrical panel upgrades: $600 max</li>
              <li>Home energy audits: $150 max</li>
            </ul>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">Residential Clean Energy (25D)</h3>
            <p className="mt-2 text-sm text-gray-700 font-medium">30% credit, no annual cap</p>
            <ul className="mt-2 list-disc ml-6 text-sm text-gray-700 space-y-1">
              <li>Solar PV systems</li>
              <li>Solar water heating</li>
              <li>Battery storage (3+ kWh)</li>
              <li>Small wind turbines</li>
              <li>Geothermal heat pumps</li>
              <li>Fuel cells</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Electric Vehicle Charging Credits</h2>
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-brand-navy">Section 30C Alternative Fuel Infrastructure</h3>
          <div className="mt-3 grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-medium text-gray-700">Residential</p>
              <ul className="mt-2 list-disc ml-6 text-gray-700 space-y-1">
                <li>30% of costs, max $1,000</li>
                <li>EV charger equipment and installation</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-700">Commercial</p>
              <ul className="mt-2 list-disc ml-6 text-gray-700 space-y-1">
                <li>6-30% of costs, max $100,000 per unit</li>
                <li>Must be in low-income or rural area</li>
                <li>Bonus rate requires prevailing wage</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Bonus Credit Adders</h2>
        <p className="mt-3 text-gray-700">
          Projects can earn additional credits by meeting special requirements:
        </p>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">+10% Domestic Content</h3>
            <p className="mt-2 text-sm text-gray-700">
              Steel, iron, and manufactured products meet domestic content requirements 
              (40% domestic content in 2025, increasing to 55% by 2027).
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">+10% Energy Community</h3>
            <p className="mt-2 text-sm text-gray-700">
              Project located in a brownfield site, coal closure community, or 
              area with significant fossil fuel employment.
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">+10-20% Low-Income</h3>
            <p className="mt-2 text-sm text-gray-700">
              Facilities located in low-income communities or serving low-income 
              residential buildings qualify for additional bonus credits.
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">5x Multiplier</h3>
            <p className="mt-2 text-sm text-gray-700">
              Meeting prevailing wage and apprenticeship requirements increases 
              base credit from 6% to 30% (5x multiplier).
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Example Business Calculation</h2>
        <div className="mt-3 bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700">
            <strong>Scenario:</strong> Manufacturing facility installs 500 kW solar + 250 kWh battery storage
          </p>
          <div className="mt-3 space-y-2 text-gray-700">
            <p><strong>Project costs:</strong></p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Solar system: $750,000</li>
              <li>Battery storage: $200,000</li>
              <li>Total project: $950,000</li>
            </ul>
            <p className="mt-3"><strong>Credit calculation:</strong></p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Base ITC (30%): $285,000</li>
              <li>Domestic content bonus (+10%): $95,000</li>
              <li>Energy community bonus (+10%): $95,000</li>
              <li className="font-semibold">Total federal credit: $475,000 (50%)</li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">
              Plus potential state incentives, utility rebates, and accelerated depreciation.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Direct Pay & Transferability</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700">Direct Pay (Elective Payment)</h3>
            <p className="mt-2 text-gray-700">
              Tax-exempt entities (nonprofits, governments, tribes) can receive 
              credits as direct cash payments. Some for-profit entities eligible for first 5 years.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700">Credit Transferability</h3>
            <p className="mt-2 text-gray-700">
              Businesses can sell energy credits to unrelated taxpayers for cash, 
              monetizing credits even without sufficient tax liability.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Documentation Requirements</h2>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Placed in service date:</strong> Equipment must be operational to claim credit</li>
          <li><strong>Manufacturer certifications:</strong> Product eligibility documentation</li>
          <li><strong>Energy modeling:</strong> For 179D, certified energy study required</li>
          <li><strong>Prevailing wage records:</strong> Payroll records for bonus rate qualification</li>
          <li><strong>Domestic content certification:</strong> Manufacturer attestations</li>
          <li><strong>IRS Form 3468:</strong> Investment Credit form for business credits</li>
        </ul>

        <div className="mt-10 p-6 bg-brand-navy/5 rounded-lg">
          <h3 className="text-xl font-semibold text-brand-navy">Maximize Your Energy Tax Savings</h3>
          <p className="mt-2 text-gray-700">
            Energy credits are among the most valuable incentives available today, but navigating 
            the requirements for bonus adders and compliance can be complex. Our specialists help 
            businesses and homeowners capture every available credit.
          </p>
          <Link href="/veteran-led-tax/intake">
            <span className="inline-block mt-4 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer" data-testid="button-claim-utility-credit">
              Get a Free Energy Credit Assessment
            </span>
          </Link>
        </div>
      </Container>
      <Footer />
    </>
  );
}
