import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, Shield, Building, FileText, Calendar, DollarSign, 
  ExternalLink, Heart, Users, Target, Award, Scale, BookOpen,
  Globe, Phone, Mail, MapPin, Clock, Landmark, Star
} from "lucide-react";
import { Link } from "wouter";

export default function IrsVerification() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-navy via-brand-navy/95 to-brand-navy">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full mb-4">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">IRS Verified 501(c)(3)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
              Tax-Exempt Status Verification
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Navigator USA Corp is a federally recognized 501(c)(3) public charity. 
              Our tax-exempt status has been verified by the Internal Revenue Service, 
              and all donations are tax-deductible to the fullest extent permitted by law.
            </p>
          </div>

          {/* Verification Status Card */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-gradient-to-br from-green-900/40 to-brand-navy border-green-500/40">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-display text-white mb-2">Federal Tax-Exempt Status</h2>
                    <p className="text-gray-400">Internal Revenue Service Determination</p>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/40 text-2xl px-6 py-2 mb-2">
                      <CheckCircle className="w-6 h-6 mr-2" />
                      VERIFIED
                    </Badge>
                    <p className="text-gray-400 text-sm">501(c)(3) Public Charity</p>
                  </div>
                </div>
                <div className="mt-8 grid md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white/5 rounded-lg p-4">
                    <Calendar className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">July 26, 2023</p>
                    <p className="text-gray-400 text-sm">Determination Date</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">July 15, 2022</p>
                    <p className="text-gray-400 text-sm">Effective Date</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">170(b)(1)(A)(vi)</p>
                    <p className="text-gray-400 text-sm">Public Charity Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-lg font-display text-white">Tax-Deductible</div>
                <div className="text-gray-400 text-sm">Donations</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-display text-white">Form 990</div>
                <div className="text-gray-400 text-sm">Filed Annually</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-lg font-display text-white">150,000+</div>
                <div className="text-gray-400 text-sm">Veteran Families</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Globe className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <div className="text-lg font-display text-white">Nationwide</div>
                <div className="text-gray-400 text-sm">Service Area</div>
              </CardContent>
            </Card>
          </div>

          {/* Organization Details */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                  <Shield className="w-6 h-6 text-brand-red" />
                  IRS Determination Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Organization Name</span>
                    <span className="font-semibold text-white">Navigator USA Corp</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">IRS Subsection</span>
                    <span className="font-semibold text-white">501(c)(3)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Foundation Classification</span>
                    <span className="font-semibold text-white">Public Charity</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Ruling Date</span>
                    <span className="font-semibold text-white">July 2023</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Deductibility Status</span>
                    <span className="font-semibold text-green-400">Contributions Deductible</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Form 990 Required</span>
                    <span className="font-semibold text-green-400">Yes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Accounting Period</span>
                    <span className="font-semibold text-white">December (Calendar Year)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                  <Building className="w-6 h-6 text-brand-red" />
                  Organization Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Legal Name</span>
                    <span className="font-semibold text-white">Navigator USA Corp</span>
                  </div>
                  <div className="flex items-start justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Address</span>
                    <span className="font-semibold text-white text-right text-sm">
                      429 D Shoreline Village Dr<br/>Long Beach, CA 90802
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">State of Incorporation</span>
                    <span className="font-semibold text-white">California</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Organization Type</span>
                    <span className="font-semibold text-white">Corporation</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">NTEE Code</span>
                    <span className="font-semibold text-white">W30 - Military/Veterans</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Asset Amount</span>
                    <span className="font-semibold text-white">See Form 990</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What 501(c)(3) Means */}
          <div className="max-w-5xl mx-auto mb-12">
            <Card className="bg-gradient-to-br from-blue-900/30 to-brand-navy border-blue-500/30">
              <CardHeader className="border-b border-blue-500/20 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-white">
                  <BookOpen className="w-8 h-8 text-blue-400" />
                  What Does 501(c)(3) Status Mean?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-white">Tax-Deductible Donations</p>
                        <p className="text-gray-400 text-sm">
                          Contributions to Navigator USA Corp are deductible for federal income tax purposes 
                          under IRC Section 170.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-white">Public Charity Classification</p>
                        <p className="text-gray-400 text-sm">
                          As a 170(b)(1)(A)(vi) organization, we receive broad public support and are not 
                          a private foundation.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-white">Federal Tax Exemption</p>
                        <p className="text-gray-400 text-sm">
                          Navigator USA Corp is exempt from federal income tax on revenue related to our 
                          charitable mission.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-white">Annual Reporting Requirements</p>
                        <p className="text-gray-400 text-sm">
                          We file Form 990 annually with the IRS, providing full transparency on our 
                          finances and operations.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-white">State Tax Benefits</p>
                        <p className="text-gray-400 text-sm">
                          Our federal 501(c)(3) status typically qualifies us for state and local tax 
                          exemptions as well.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-white">Grant Eligibility</p>
                        <p className="text-gray-400 text-sm">
                          501(c)(3) status allows us to apply for grants from foundations, corporations, 
                          and government agencies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Our Mission & Programs */}
          <div className="max-w-5xl mx-auto mb-12">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-white">
                  <Target className="w-8 h-8 text-brand-red" />
                  Charitable Purpose & Programs
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-300 mb-6">
                  Navigator USA Corp is dedicated to empowering veteran families through comprehensive support 
                  services. Our charitable activities qualify under IRC Section 501(c)(3) as educational and 
                  charitable purposes.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <Heart className="w-10 h-10 text-brand-red mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Veteran Support Services</h3>
                    <p className="text-gray-400 text-sm">
                      Financial assistance, VA claim support, holistic wellness programs, and healthcare navigation.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <DollarSign className="w-10 h-10 text-green-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Economic Empowerment</h3>
                    <p className="text-gray-400 text-sm">
                      Business launch support, startup grants, job placement services, and financial education.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <Users className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Family Assistance</h3>
                    <p className="text-gray-400 text-sm">
                      New home furnishing assistance, spouse support programs, and family wellness resources.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verify Our Status */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-gradient-to-br from-green-900/40 to-brand-navy border-green-500/40">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-display text-white mb-4">Independently Verify Our Status</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  You can verify Navigator USA Corp's tax-exempt status using the official IRS Tax Exempt 
                  Organization Search tool. Search for "Navigator USA Corp" to view our determination letter 
                  and organization details.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://apps.irs.gov/app/eos/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    IRS Tax Exempt Organization Search
                  </a>
                  <a 
                    href="https://www.guidestar.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    GuideStar/Candid Profile
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tax Deduction Information */}
          <div className="max-w-5xl mx-auto mb-12">
            <Card className="bg-gradient-to-br from-amber-900/30 to-brand-navy border-amber-500/30">
              <CardHeader className="border-b border-amber-500/20 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-white">
                  <Scale className="w-8 h-8 text-amber-400" />
                  Tax Deduction Information for Donors
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white text-lg">What Can Be Deducted?</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Cash donations (checks, credit cards, wire transfers)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Stock and securities (may avoid capital gains tax)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Property and in-kind donations (at fair market value)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Qualified charitable distributions from IRAs (for those 70½+)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Vehicle donations (special rules apply)
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white text-lg">Deduction Limits (2024)</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        Cash: Up to 60% of adjusted gross income (AGI)
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        Appreciated property: Up to 30% of AGI
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        Excess contributions can be carried forward 5 years
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        Must itemize deductions on Schedule A
                      </li>
                    </ul>
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mt-4">
                      <p className="text-amber-400 text-xs">
                        <strong>Note:</strong> Consult with a qualified tax professional for advice specific to your situation.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact & Documentation */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-brand-red/20 border-brand-red/40">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <FileText className="w-16 h-16 text-brand-red flex-shrink-0" />
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-display text-white mb-2">Need Documentation?</h3>
                    <p className="text-gray-300 mb-4">
                      We're happy to provide copies of our IRS Determination Letter, Form 990, or 
                      donation receipts for your tax records.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href="/contact">
                        <span className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red/90 text-white px-5 py-2 rounded-full font-semibold transition-colors cursor-pointer">
                          <Mail className="w-4 h-4" />
                          Request Documents
                        </span>
                      </Link>
                      <a 
                        href="tel:+1-800-NAVUSA" 
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full font-semibold transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Call Us
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Pages */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-display text-white text-center mb-6">Related Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/transparency">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Transparency</p>
                    <p className="text-gray-500 text-sm">Full Disclosure</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/hipaa-compliance">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-white font-medium">HIPAA Compliance</p>
                    <p className="text-gray-500 text-sm">Security Report</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/about">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <Heart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-white font-medium">About Us</p>
                    <p className="text-gray-500 text-sm">Our Mission</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-white/5 rounded-full px-6 py-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 text-sm">
                IRS Determination Letter dated July 26, 2023 | Effective July 15, 2022
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
