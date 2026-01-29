import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Users, MapPin, Mail, Phone, Calendar, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-navy to-brand-navy/95">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-red/20 text-brand-red px-4 py-2 rounded-full mb-4">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Privacy Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how Navigator USA Corp collects, uses, and protects your personal information.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FileText className="w-8 h-8 text-brand-red" />
                  About Navigator USA Corp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Navigator USA Corp ("NavigatorUSA," "we," "us," or "our") is a federally recognized 501(c)(3) nonprofit organization dedicated to serving veteran families. This Privacy Policy describes how we collect, use, and share information when you use our websites, including Operation Fiscal Freedom and related initiatives.
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
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  We collect information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Submit a contact form or request information</li>
                  <li>Apply for services or programs we offer</li>
                  <li>Sign up for newsletters or updates</li>
                  <li>Participate in surveys or provide feedback</li>
                  <li>Communicate with us via email, phone, or other channels</li>
                </ul>
                <div className="bg-white/5 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-white mb-2">Types of Information Collected:</p>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Name and contact information (email, phone, address)</li>
                    <li>• Military service information (branch, status, discharge date)</li>
                    <li>• Information related to VA benefits or disability claims</li>
                    <li>• Business or financial information (for applicable programs)</li>
                    <li>• Any other information you choose to provide</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Shield className="w-8 h-8 text-brand-red" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Respond to your inquiries and requests</li>
                  <li>Provide services and connect you with appropriate resources</li>
                  <li>Process applications for programs and benefits assistance</li>
                  <li>Send you relevant updates and information about our services</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Users className="w-8 h-8 text-brand-red" />
                  How We Share Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-brand-red/10 border border-brand-red/30 rounded-lg p-4 mb-4">
                  <p className="font-semibold text-brand-red mb-2">Important Notice</p>
                  <p className="text-gray-300">
                    NavigatorUSA does <strong className="text-white">NOT sell</strong> your personal information. However, we may <strong className="text-white">share</strong> your information with affiliated or mission-aligned partners to help respond to your request and better serve you.
                  </p>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  We may share your information with:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong className="text-white">Affiliated Partners:</strong> Organizations that help us fulfill our mission to serve veterans, including VA benefits specialists, healthcare providers, and financial service providers</li>
                  <li><strong className="text-white">Mission-Aligned Partners:</strong> Vetted organizations that share our commitment to supporting veteran families</li>
                  <li><strong className="text-white">Service Providers:</strong> Third parties that help us operate our website and deliver services</li>
                  <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights</li>
                </ul>
                <p className="text-gray-300 mt-4">
                  For more information about our partners, please visit our <Link href="/affiliated-partners" className="text-brand-red hover:text-white underline">Affiliated Partners</Link> page.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <MapPin className="w-8 h-8 text-brand-red" />
                  California Notice at Collection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
                </p>
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="font-semibold text-white">Categories of Personal Information Collected:</p>
                    <p className="text-gray-300 text-sm">Identifiers (name, email, phone), professional information, and information you provide in forms.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Purpose of Collection:</p>
                    <p className="text-gray-300 text-sm">To respond to your requests, provide services, and connect you with resources to help you.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Sale or Sharing:</p>
                    <p className="text-gray-300 text-sm">We do NOT sell personal information. We may share information with mission-aligned partners to fulfill your requests.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Retention Period:</p>
                    <p className="text-gray-300 text-sm">We retain personal information as long as necessary to fulfill the purposes for which it was collected.</p>
                  </div>
                </div>
                <p className="text-gray-300 mt-4">
                  California residents may exercise their rights by visiting our <Link href="/do-not-sell" className="text-brand-red hover:text-white underline">Do Not Sell or Share My Personal Information</Link> page.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Shield className="w-8 h-8 text-brand-red" />
                  Your Privacy Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong className="text-white">Right to Know:</strong> Request information about what personal data we collect and how we use it</li>
                  <li><strong className="text-white">Right to Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong className="text-white">Right to Delete:</strong> Request deletion of your personal information</li>
                  <li><strong className="text-white">Right to Correct:</strong> Request correction of inaccurate personal information</li>
                  <li><strong className="text-white">Right to Opt-Out:</strong> Opt out of the sharing of your personal information with partners</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Mail className="w-8 h-8 text-brand-red" />
                  Contact Us About Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  To exercise your privacy rights or if you have questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-brand-red" />
                    <span className="text-gray-300">privacy@navigatorusa.org</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-brand-red" />
                    <span className="text-gray-300">(562) 555-0100</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-brand-red" />
                    <span className="text-gray-300">429 D Shoreline Village Dr, Long Beach, CA 90802</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mt-4">
                  You may also submit a privacy request through our <Link href="/contact" className="text-brand-red hover:text-white underline">Contact Form</Link>.
                </p>
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
