import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, Shield, Scale, Calendar, Building } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfUse() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-navy to-brand-navy/95">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-red/20 text-brand-red px-4 py-2 rounded-full mb-4">
              <Scale className="w-5 h-5" />
              <span className="font-medium">Terms of Use</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
              Terms of Use
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Please read these terms carefully before using our website and services.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Building className="w-8 h-8 text-brand-red" />
                  Website Operator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  This website is operated by <strong className="text-white">Navigator USA Corp</strong> ("NavigatorUSA," "we," "us," or "our"), a federally recognized 501(c)(3) nonprofit organization.
                </p>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-gray-400">
                    <strong className="text-white">Legal Entity:</strong> Navigator USA Corp<br />
                    <strong className="text-white">Status:</strong> 501(c)(3) Public Charity<br />
                    <strong className="text-white">Address:</strong> 429 D Shoreline Village Dr, Long Beach, CA 90802
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FileText className="w-8 h-8 text-brand-red" />
                  Operation Fiscal Freedom
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">Operation Fiscal Freedom</strong> is an initiative operated by Navigator USA Corp. All services, programs, and resources offered through Operation Fiscal Freedom are provided by or in coordination with NavigatorUSA and its affiliated partners.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  By using Operation Fiscal Freedom services, you agree to these Terms of Use and acknowledge that NavigatorUSA is the operator of this initiative.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-brand-red/10 border-brand-red/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <AlertTriangle className="w-8 h-8 text-brand-red" />
                  Important Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <p className="font-semibold text-brand-red mb-2">NOT A GOVERNMENT ENTITY</p>
                  <p className="text-gray-300">
                    Navigator USA Corp is a private 501(c)(3) nonprofit organization. We are <strong className="text-white">NOT</strong> affiliated with, endorsed by, or a part of the U.S. Department of Veterans Affairs, the Social Security Administration, or any other government agency.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="font-semibold text-brand-red mb-2">NO GUARANTEE OF OUTCOMES</p>
                  <p className="text-gray-300">
                    While we strive to help veterans and their families access benefits and services, we <strong className="text-white">cannot guarantee any specific outcomes</strong>. Approval of VA disability claims, SSDI benefits, or other government benefits is determined solely by the applicable government agencies. Our role is to provide assistance, education, and connection to resources.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Scale className="w-8 h-8 text-brand-red" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  By accessing or using this website, you agree to be bound by these Terms of Use and our <Link href="/privacy-policy" className="text-brand-red hover:text-white underline">Privacy Policy</Link>. If you do not agree to these terms, please do not use our website or services.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FileText className="w-8 h-8 text-brand-red" />
                  Use of Website
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  You agree to use this website only for lawful purposes and in accordance with these Terms. You agree NOT to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Use the website in any way that violates applicable laws or regulations</li>
                  <li>Attempt to gain unauthorized access to any part of the website</li>
                  <li>Use the website to transmit harmful or malicious content</li>
                  <li>Impersonate any person or entity</li>
                  <li>Submit false or misleading information</li>
                  <li>Interfere with the proper functioning of the website</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Shield className="w-8 h-8 text-brand-red" />
                  Information Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  We strive to provide accurate and up-to-date information on our website. However, we make no warranties or representations about the accuracy, completeness, or reliability of any information provided. Information about VA benefits, tax credits, and other programs may change, and you should verify all information with the appropriate government agencies or qualified professionals.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FileText className="w-8 h-8 text-brand-red" />
                  Third-Party Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Our website may contain links to third-party websites or services. NavigatorUSA is not responsible for the content, privacy practices, or availability of third-party sites. Your use of third-party services is at your own risk and subject to their respective terms and policies.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  We may share your information with affiliated or mission-aligned partners as described in our <Link href="/privacy-policy" className="text-brand-red hover:text-white underline">Privacy Policy</Link> and <Link href="/affiliated-partners" className="text-brand-red hover:text-white underline">Affiliated Partners</Link> page.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Scale className="w-8 h-8 text-brand-red" />
                  Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  To the fullest extent permitted by law, Navigator USA Corp shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of this website or services. This includes, but is not limited to, damages arising from:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Denial of benefits claims or applications</li>
                  <li>Delays in processing of claims or applications</li>
                  <li>Errors or omissions in information provided</li>
                  <li>Actions or decisions of government agencies</li>
                  <li>Actions or services of third-party partners</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FileText className="w-8 h-8 text-brand-red" />
                  Changes to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting on this page. Your continued use of the website after any changes constitutes acceptance of the new terms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Scale className="w-8 h-8 text-brand-red" />
                  Governing Law
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  These Terms of Use shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FileText className="w-8 h-8 text-brand-red" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  If you have questions about these Terms of Use, please contact us at:
                </p>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-300">
                    Navigator USA Corp<br />
                    429 D Shoreline Village Dr<br />
                    Long Beach, CA 90802<br />
                    Email: legal@navigatorusa.org
                  </p>
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
