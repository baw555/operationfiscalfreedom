import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function RDTaxCredit() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy" data-testid="heading-rd-tax-credit">R&D Tax Credit (Section 41)</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          The Research and Development Tax Credit is one of the most valuable but underutilized tax incentives 
          available to businesses. Under IRC Section 41, companies that invest in innovation, product development, 
          process improvement, or software development can claim credits worth 6-10% of qualifying expenditures.
        </p>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Who Qualifies?</h2>
        <p className="mt-3 text-gray-700">
          Contrary to popular belief, R&D credits aren't just for laboratories and tech giants. 
          Any business that develops or improves products, processes, software, or formulas may qualify.
        </p>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">Manufacturing</h3>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li>• Product design improvements</li>
              <li>• Process automation</li>
              <li>• Material testing</li>
              <li>• Tooling development</li>
              <li>• Quality improvements</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">Technology</h3>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li>• Software development</li>
              <li>• Cloud architecture</li>
              <li>• AI/ML development</li>
              <li>• Cybersecurity solutions</li>
              <li>• Platform engineering</li>
            </ul>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">Other Industries</h3>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li>• Architecture/Engineering</li>
              <li>• Food & Beverage R&D</li>
              <li>• Agriculture innovation</li>
              <li>• Construction methods</li>
              <li>• Aerospace & Defense</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">The Four-Part Test</h2>
        <p className="mt-3 text-gray-700">
          To qualify, activities must meet all four criteria under IRC Section 41:
        </p>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">1. Permitted Purpose</h3>
            <p className="mt-2 text-sm text-gray-700">
              Activity must relate to developing or improving a product, process, technique, 
              formula, invention, or software (function, performance, reliability, or quality).
            </p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">2. Technological Uncertainty</h3>
            <p className="mt-2 text-sm text-gray-700">
              Must involve uncertainty regarding capability, methodology, or design. 
              The outcome cannot be known at the outset.
            </p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">3. Process of Experimentation</h3>
            <p className="mt-2 text-sm text-gray-700">
              Substantially all activities must involve systematic evaluation of alternatives 
              through modeling, simulation, testing, or trial and error.
            </p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">4. Technological in Nature</h3>
            <p className="mt-2 text-sm text-gray-700">
              Must rely on principles of physical science, biological science, engineering, 
              or computer science to resolve uncertainty.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Qualifying Expenditures (QREs)</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border">Category</th>
                <th className="px-4 py-2 text-left border">What Qualifies</th>
                <th className="px-4 py-2 text-left border">Credit Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border font-medium">Wages</td>
                <td className="px-4 py-2 border">W-2 wages for employees performing or supervising qualified R&D</td>
                <td className="px-4 py-2 border">6-10%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-medium">Supplies</td>
                <td className="px-4 py-2 border">Materials consumed in R&D (prototypes, testing materials)</td>
                <td className="px-4 py-2 border">6-10%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-medium">Contract Research</td>
                <td className="px-4 py-2 border">65% of payments to third parties for qualified R&D services</td>
                <td className="px-4 py-2 border">~4-6.5%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-medium">Cloud Computing</td>
                <td className="px-4 py-2 border">Computing costs for R&D activities (AWS, Azure, GCP)</td>
                <td className="px-4 py-2 border">6-10%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Credit Calculation Methods</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">Regular Credit (RC)</h3>
            <p className="mt-2 text-sm text-gray-700">
              20% of QREs exceeding a base amount calculated from historical R&D spending. 
              Best for established companies with consistent R&D history.
            </p>
            <p className="mt-2 text-sm font-medium text-brand-navy">
              Credit = 20% × (Current QREs - Base Amount)
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-brand-navy">Alternative Simplified Credit (ASC)</h3>
            <p className="mt-2 text-sm text-gray-700">
              14% of QREs exceeding 50% of average QREs from prior 3 years. 
              Simpler calculation, often better for growing companies.
            </p>
            <p className="mt-2 text-sm font-medium text-brand-navy">
              Credit = 14% × (Current QREs - 50% × Avg Prior 3 Years)
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Special Provisions for 2025-2026</h2>
        <div className="mt-4 space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-700">Startup Company Benefits</h3>
            <p className="mt-2 text-gray-700">
              Qualified small businesses (under $5M revenue, less than 5 years old) can apply up to 
              <strong> $500,000</strong> of R&D credits against payroll taxes annually, even without income tax liability.
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-700">Section 174 Amortization Requirement</h3>
            <p className="mt-2 text-gray-700">
              As of 2022, R&D expenses must be capitalized and amortized over 5 years (domestic) or 
              15 years (foreign). The R&D credit still applies but accounting treatment has changed.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-700">State R&D Credits</h3>
            <p className="mt-2 text-gray-700">
              Over 35 states offer additional R&D tax credits. Combined federal and state credits 
              can recover 15-20%+ of qualifying expenditures.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Example Calculation</h2>
        <div className="mt-3 bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700">
            <strong>Scenario:</strong> Software company with $800,000 in qualifying R&D wages and $50,000 in cloud computing costs
          </p>
          <div className="mt-3 space-y-2 text-gray-700">
            <p>Total QREs: $850,000</p>
            <p>Prior 3-year average QREs: $600,000</p>
            <p>Using ASC method:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Base amount: 50% × $600,000 = $300,000</li>
              <li>Excess QREs: $850,000 - $300,000 = $550,000</li>
              <li>Federal credit: 14% × $550,000 = <strong>$77,000</strong></li>
              <li>Potential state credit (varies): ~$20,000-$40,000</li>
            </ul>
            <p className="mt-3 font-semibold text-brand-navy">Total estimated credits: $97,000 - $117,000</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Documentation Requirements</h2>
        <p className="mt-3 text-gray-700">
          The IRS requires contemporaneous documentation. Key records include:
        </p>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Project documentation:</strong> Descriptions of R&D projects, objectives, and uncertainties</li>
          <li><strong>Time tracking:</strong> Records of employee time spent on qualified activities</li>
          <li><strong>Technical notes:</strong> Lab notebooks, design documents, testing results</li>
          <li><strong>Financial records:</strong> Payroll, supply invoices, contractor agreements</li>
          <li><strong>Meeting notes:</strong> Technical reviews, design discussions, problem-solving sessions</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Common Qualifying Activities</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700">Often Qualifies ✓</h3>
            <ul className="mt-2 list-disc ml-6 text-gray-700 space-y-1">
              <li>New product development</li>
              <li>Software feature development</li>
              <li>Process improvements</li>
              <li>Prototype creation and testing</li>
              <li>Automation projects</li>
              <li>Integrating new technologies</li>
              <li>Environmental compliance R&D</li>
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-700">Usually Doesn't Qualify ✗</h3>
            <ul className="mt-2 list-disc ml-6 text-gray-700 space-y-1">
              <li>Market research</li>
              <li>Quality control testing</li>
              <li>Routine data collection</li>
              <li>Style or aesthetic changes</li>
              <li>Adaptation to customer specs</li>
              <li>Funded research (if risk isn't yours)</li>
              <li>Research conducted outside the US</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Claiming Back Credits</h2>
        <p className="mt-3 text-gray-700">
          Haven't claimed R&D credits in prior years? You can amend returns to capture credits from:
        </p>
        <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Open tax years:</strong> Generally 3 years from filing date</li>
          <li><strong>Carryforward:</strong> Unused credits carry forward 20 years</li>
          <li><strong>Carryback:</strong> Limited carryback to 1 prior year</li>
        </ul>

        <div className="mt-10 p-6 bg-brand-navy/5 rounded-lg">
          <h3 className="text-xl font-semibold text-brand-navy">Maximize Your R&D Tax Credits</h3>
          <p className="mt-2 text-gray-700">
            Most businesses leave money on the table by not claiming R&D credits or not documenting 
            all qualifying activities. Our specialists conduct thorough R&D studies to identify every 
            eligible project and maximize your credit.
          </p>
          <Link href="/veteran-led-tax/intake">
            <span className="inline-block mt-4 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer" data-testid="button-claim-rd-credit">
              Get a Free R&D Credit Assessment
            </span>
          </Link>
        </div>
      </Container>
      <Footer />
    </>
  );
}
