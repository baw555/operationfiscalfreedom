import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Heart, Briefcase, Stethoscope, Building, Calendar, HandshakeIcon } from "lucide-react";
import { Link } from "wouter";

export default function AffiliatedPartners() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-navy to-brand-navy/95">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-red/20 text-brand-red px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5" />
              <span className="font-medium">Partner Disclosure</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
              Affiliated Partners
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Learn about our network of mission-aligned organizations that help us serve veteran families.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="bg-brand-red/10 border-brand-red/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Shield className="w-8 h-8 text-brand-red" />
                  Important Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-100 leading-relaxed text-lg">
                  If you submit information through Operation Fiscal Freedom, NavigatorUSA may share your information with one or more affiliated or mission-aligned partners to help respond to your request.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Heart className="w-8 h-8 text-brand-red" />
                  Why We Share Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Navigator USA Corp is committed to serving veterans and their families to the fullest extent possible. To fulfill this mission, we work with a network of trusted organizations that specialize in various aspects of veteran support.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  When you submit a request for assistance—whether for VA disability benefits, healthcare, financial services, or other programs—we may share your information with partners who are best equipped to help with your specific needs. This allows us to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Connect you with specialized experts in your area of need</li>
                  <li>Ensure you receive comprehensive support across multiple services</li>
                  <li>Provide faster response times by leveraging our partner network</li>
                  <li>Offer more resources than we could provide alone</li>
                </ul>
                <div className="bg-white/5 rounded-lg p-4 mt-4">
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">Note:</strong> We do NOT sell your personal information. Sharing is done solely to help fulfill your request and serve you better. Learn more on our <Link href="/do-not-sell" className="text-brand-red hover:text-white underline">Do Not Sell or Share</Link> page.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <HandshakeIcon className="w-8 h-8 text-brand-red" />
                  Our Partner Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  We work with mission-aligned partners across several categories to provide comprehensive support:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-brand-red/20 rounded-lg">
                        <Shield className="w-6 h-6 text-brand-red" />
                      </div>
                      <h3 className="font-semibold text-lg">VA Benefits Partners</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Organizations specializing in VA disability claims, appeals, and benefits assistance.
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Briefcase className="w-6 h-6 text-green-400" />
                      </div>
                      <h3 className="font-semibold text-lg">Financial Services Partners</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Vetted financial advisors, tax professionals, and business service providers.
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Stethoscope className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-lg">Healthcare Partners</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Medical professionals and healthcare organizations serving veteran families.
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Building className="w-6 h-6 text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-lg">Legal Services Partners</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Attorneys and legal advocates specializing in veteran issues and disability law.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Users className="w-8 h-8 text-brand-red" />
                  Partner List
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Our partner network includes organizations across the following categories. This list is updated periodically as we add new mission-aligned partners:
                </p>
                <div className="bg-white/5 rounded-lg p-6">
                  <p className="text-gray-400 text-center italic">
                    Partner list coming soon. Check back for updates.
                  </p>
                  <p className="text-gray-500 text-center text-sm mt-2">
                    For immediate questions about our partners, please <Link href="/contact" className="text-brand-red hover:text-white underline">contact us</Link>.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Shield className="w-8 h-8 text-brand-red" />
                  Partner Vetting Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  NavigatorUSA maintains high standards for organizations in our partner network. All partners must:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Demonstrate a commitment to serving veteran families</li>
                  <li>Maintain appropriate licenses and certifications for their services</li>
                  <li>Agree to handle shared information responsibly and securely</li>
                  <li>Operate in alignment with NavigatorUSA's mission and values</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Shield className="w-8 h-8 text-brand-red" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  You have the right to understand how your information is shared and to request that we limit sharing in certain circumstances. For more information about your privacy rights, please visit:
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <Link href="/privacy-policy" className="inline-flex items-center gap-2 bg-brand-red/20 hover:bg-brand-red/30 text-brand-red px-4 py-2 rounded-lg transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/do-not-sell" className="inline-flex items-center gap-2 bg-brand-red/20 hover:bg-brand-red/30 text-brand-red px-4 py-2 rounded-lg transition-colors">
                    Do Not Sell or Share
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-white/5 rounded-full px-6 py-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 text-sm">
                Last updated: January 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
