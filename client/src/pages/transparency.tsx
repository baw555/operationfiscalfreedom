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
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
