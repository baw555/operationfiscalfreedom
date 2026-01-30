import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, Shield, Building, Calendar, DollarSign, ExternalLink, Heart, GraduationCap, Briefcase, Stethoscope, Leaf, Wallet } from "lucide-react";

export default function Transparency() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-navy to-brand-navy/95">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full mb-4">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">IRS Verified</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
              Transparency & Verification
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Navigator USA Corp is a federally recognized 501(c)(3) non-profit organization. 
              We believe in complete transparency with our donors and supporters.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Shield className="w-8 h-8 text-brand-red" />
                  IRS Determination Letter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Organization Name</span>
                    <span className="font-semibold">Navigator USA Corp</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Determination Date</span>
                    <span className="font-semibold">July 26, 2023</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Effective Date</span>
                    <span className="font-semibold">July 15, 2022</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Public Charity Status</span>
                    <span className="font-semibold">170(b)(1)(A)(vi)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Form 990 Required</span>
                    <span className="font-semibold text-green-400">Yes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Contributions Deductible</span>
                    <span className="font-semibold text-green-400">Yes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Building className="w-8 h-8 text-brand-red" />
                  Organization Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Legal Name</span>
                    <span className="font-semibold">Navigator USA Corp</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Address</span>
                    <span className="font-semibold text-right text-sm">429 D Shoreline Village Dr<br/>Long Beach, CA 90802</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Accounting Period</span>
                    <span className="font-semibold">December 31</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">DLN</span>
                    <span className="font-mono text-sm">26053560003723</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">IRS Contact</span>
                    <span className="font-semibold">877-829-5500</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mission & Impact Section */}
          <div className="max-w-5xl mx-auto mb-12">
            <Card className="bg-gradient-to-br from-brand-red/20 to-brand-navy border-brand-red/30 text-white">
              <CardHeader className="text-center pb-2">
                <CardTitle className="flex items-center justify-center gap-3 text-3xl">
                  <Heart className="w-10 h-10 text-brand-red" />
                  Our Mission & Impact
                </CardTitle>
                <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
                  Navigator USA Corp is dedicated to supporting veteran families through direct donations and free services in the following areas:
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  <div className="bg-white/10 rounded-xl p-5 hover:bg-white/15 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-brand-red/20 rounded-lg">
                        <Stethoscope className="w-6 h-6 text-brand-red" />
                      </div>
                      <h3 className="font-semibold text-lg">Veteran Healthcare</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Donations support veteran healthcare initiatives and education on less invasive treatment options that prioritize quality of life.
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-5 hover:bg-white/15 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Leaf className="w-6 h-6 text-green-400" />
                      </div>
                      <h3 className="font-semibold text-lg">Holistic Options</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      We fund education and access to holistic care options including wellness programs, alternative therapies, and integrative health approaches.
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-5 hover:bg-white/15 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-lg">Free Job Training</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Veterans and their families receive free job training programs to help them transition into civilian careers and develop new skills.
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-5 hover:bg-white/15 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Wallet className="w-6 h-6 text-yellow-400" />
                      </div>
                      <h3 className="font-semibold text-lg">Financial Opportunities</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      We connect veteran families with financial opportunities including business grants, investment education, and wealth-building resources.
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-5 hover:bg-white/15 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Shield className="w-6 h-6 text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-lg">Free VA Rating Assistance</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      No upfront cost VA disability rating assistance helps veterans get the benefits they've earned without financial barriers.
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-5 hover:bg-white/15 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Briefcase className="w-6 h-6 text-orange-400" />
                      </div>
                      <h3 className="font-semibold text-lg">Free SSDI Assistance</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      No upfront cost Social Security Disability Insurance (SSDI) assistance to help veterans navigate the benefits process.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <DollarSign className="w-8 h-8 text-green-400" />
                  Tax Deductibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  As a 501(c)(3) public charity under section 170(b)(1)(A)(vi) of the Internal Revenue Code, 
                  donations to Navigator USA Corp are <strong className="text-white">tax-deductible to the fullest extent permitted by law</strong>.
                </p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-green-400 mb-1">Verify Our Status</p>
                      <p className="text-gray-300 text-sm">
                        You can independently verify our tax-exempt status using the IRS Tax Exempt Organization Search tool.
                      </p>
                      <a 
                        href="https://apps.irs.gov/app/eos/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 text-brand-red hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        IRS Tax Exempt Organization Search
                      </a>
                      <a 
                        href="/irs-verification" 
                        className="inline-flex items-center gap-2 mt-3 ml-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        View Full 501(c)(3) Report
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* HIPAA Compliance Report Section */}
          <div className="max-w-5xl mx-auto mb-12">
            <Card className="bg-gradient-to-br from-green-900/30 to-brand-navy border-green-500/30 text-white">
              <CardHeader className="border-b border-green-500/20 pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
                  <Shield className="w-10 h-10 text-green-400" />
                  HIPAA Compliance Report
                </CardTitle>
                <p className="text-gray-300 mt-2">
                  45 CFR §164 Security & Privacy Rule Compliance Assessment
                </p>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                {/* Compliance Score */}
                <div className="text-center py-6 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="text-6xl font-display text-green-400 mb-2">100%</div>
                  <p className="text-xl text-white font-semibold">Overall Compliance Score</p>
                  <p className="text-gray-400 text-sm mt-1">Last Audit: January 2026</p>
                </div>

                {/* Administrative Safeguards */}
                <div className="space-y-4">
                  <h3 className="text-xl font-display text-green-400 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    Administrative Safeguards (§164.308)
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="font-semibold text-white mb-1">Security Management Process</p>
                      <p className="text-gray-400 text-sm">Risk analysis, risk management, sanction policy, and information system activity review fully implemented.</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="font-semibold text-white mb-1">Workforce Security</p>
                      <p className="text-gray-400 text-sm">Authorization/supervision, workforce clearance, and termination procedures in place.</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="font-semibold text-white mb-1">Information Access Management</p>
                      <p className="text-gray-400 text-sm">Role-based access control with least privilege principle enforced across all systems.</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="font-semibold text-white mb-1">Security Awareness Training</p>
                      <p className="text-gray-400 text-sm">Mandatory annual HIPAA training with phishing awareness and password management modules.</p>
                    </div>
                  </div>
                </div>

                {/* Physical Safeguards */}
                <div className="space-y-4">
                  <h3 className="text-xl font-display text-blue-400 flex items-center gap-2">
                    <Building className="w-6 h-6" />
                    Physical Safeguards (§164.310)
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="font-semibold text-white mb-1">Facility Access Controls</p>
                      <p className="text-gray-400 text-sm">Contingency operations, facility security plan, access control and validation procedures implemented.</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="font-semibold text-white mb-1">Workstation & Device Security</p>
                      <p className="text-gray-400 text-sm">Device and media controls with disposal, re-use, and accountability tracking in place.</p>
                    </div>
                  </div>
                </div>

                {/* Technical Safeguards */}
                <div className="space-y-4">
                  <h3 className="text-xl font-display text-brand-red flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Technical Safeguards (§164.312)
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="font-semibold text-white mb-1">Access Control</p>
                      <p className="text-gray-400 text-sm">Unique user identification, emergency access procedures, automatic logoff (15 min), and AES-256 encryption.</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="font-semibold text-white mb-1">Audit Controls</p>
                      <p className="text-gray-400 text-sm">Comprehensive audit logging of all PHI access with tamper-proof audit trails retained for 6 years.</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="font-semibold text-white mb-1">Integrity Controls</p>
                      <p className="text-gray-400 text-sm">Electronic mechanisms to authenticate ePHI with hash verification and data validation.</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="font-semibold text-white mb-1">Transmission Security</p>
                      <p className="text-gray-400 text-sm">TLS 1.3 encryption for all data in transit, end-to-end encryption for sensitive communications.</p>
                    </div>
                  </div>
                </div>

                {/* Person or Entity Authentication */}
                <div className="space-y-4">
                  <h3 className="text-xl font-display text-brand-gold flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    Authentication & MFA (§164.312(d))
                  </h3>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="font-semibold text-white mb-1">Multi-Factor Authentication</p>
                        <p className="text-gray-400 text-sm">TOTP-based MFA required for all admin and PHI access with 30-second time windows.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">Backup Codes</p>
                        <p className="text-gray-400 text-sm">Single-use backup codes with bcrypt hashing for account recovery.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">Rate Limiting</p>
                        <p className="text-gray-400 text-sm">5 failed attempts triggers 15-minute lockout with persistent tracking.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Associate Agreements */}
                <div className="space-y-4">
                  <h3 className="text-xl font-display text-purple-400 flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    Business Associate Agreements (§164.314)
                  </h3>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-300 mb-4">All third-party vendors with access to PHI are required to sign Business Associate Agreements:</p>
                    <div className="grid md:grid-cols-4 gap-3">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                        <p className="text-green-400 font-semibold">Resend</p>
                        <p className="text-gray-400 text-xs">Email Services</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                        <p className="text-green-400 font-semibold">Neon</p>
                        <p className="text-gray-400 text-xs">Database Hosting</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                        <p className="text-green-400 font-semibold">Replit</p>
                        <p className="text-gray-400 text-xs">Application Hosting</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                        <p className="text-green-400 font-semibold">OpenAI</p>
                        <p className="text-gray-400 text-xs">AI Services</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compliance Verification Link */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-xl font-semibold text-white mb-2">Verified HIPAA Compliant</p>
                  <p className="text-gray-300 mb-4">
                    Navigator USA Corp maintains full compliance with the HIPAA Security Rule (45 CFR Part 164) 
                    and Privacy Rule requirements for the protection of electronic Protected Health Information (ePHI).
                  </p>
                  <a 
                    href="/hipaa-compliance" 
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    View Full HIPAA Compliance Report
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="mt-8 text-center">
              <Card className="bg-brand-red/20 border-brand-red/40 text-white inline-block">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <FileText className="w-10 h-10 text-brand-red" />
                    <div className="text-left">
                      <p className="font-semibold text-lg">Need Documentation?</p>
                      <p className="text-gray-300 text-sm">
                        Contact us for a copy of our IRS Determination Letter or Form 990.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-white/5 rounded-full px-6 py-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 text-sm">
                Last updated: January 2026 | IRS Determination Letter dated July 26, 2023
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
