import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Ban, Users, Mail, Phone, MapPin, Calendar, FileText, Heart } from "lucide-react";
import { Link } from "wouter";

export default function DoNotSell() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-navy to-brand-navy/95">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full mb-4">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-medium">Your Privacy Rights</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
              Do Not Sell or Share My Personal Information
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Understanding your rights and how NavigatorUSA handles your personal information.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="bg-green-500/10 border-green-500/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Ban className="w-8 h-8 text-green-400" />
                  We Do NOT Sell Your Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-100 leading-relaxed text-lg">
                  Navigator USA Corp is a 501(c)(3) nonprofit organization. We do <strong className="text-white">NOT sell</strong> your personal information for monetary or other valuable consideration. Period.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  As a nonprofit dedicated to serving veteran families, our mission is service—not profit from your data.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Users className="w-8 h-8 text-brand-red" />
                  How Sharing Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  While we do not <em>sell</em> personal information, we may <em>share</em> your information with affiliated or mission-aligned partners. Here's what that means:
                </p>
                <div className="bg-white/5 rounded-lg p-4 space-y-4">
                  <div>
                    <p className="font-semibold text-white mb-2">What is "Sharing"?</p>
                    <p className="text-gray-300 text-sm">
                      When you submit a request for assistance (such as help with VA disability benefits, healthcare, or financial services), we may share your information with partners who specialize in that area to help fulfill your request.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-2">Who Are Our Partners?</p>
                    <p className="text-gray-300 text-sm">
                      Our partners are mission-aligned organizations that share our commitment to serving veterans. They include VA benefits specialists, healthcare providers, financial advisors, and legal advocates. Learn more on our <Link href="/affiliated-partners" className="text-brand-red hover:text-white underline">Affiliated Partners</Link> page.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-2">Why Do We Share?</p>
                    <p className="text-gray-300 text-sm">
                      We share information solely to help respond to your requests and connect you with the best resources. We do NOT share for commercial purposes or receive payment for sharing your data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Heart className="w-8 h-8 text-brand-red" />
                  Nonprofit Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  As a federally recognized 501(c)(3) nonprofit organization, NavigatorUSA operates differently from commercial businesses:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>We exist to serve veteran families, not to profit from your data</li>
                  <li>Information sharing is done to fulfill our mission, not for commercial gain</li>
                  <li>We partner only with organizations aligned with our values</li>
                  <li>Donations to NavigatorUSA are tax-deductible—we're verified by the IRS</li>
                </ul>
                <p className="text-gray-300 mt-4">
                  For more about our nonprofit status, visit our <Link href="/transparency" className="text-brand-red hover:text-white underline">Transparency</Link> page.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FileText className="w-8 h-8 text-brand-red" />
                  Your Rights Under California Law
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  California residents have specific rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong className="text-white">Right to Know:</strong> You can request information about what personal data we collect and how we use it</li>
                  <li><strong className="text-white">Right to Delete:</strong> You can request that we delete your personal information</li>
                  <li><strong className="text-white">Right to Opt-Out of Sharing:</strong> You can request that we stop sharing your personal information with third parties</li>
                  <li><strong className="text-white">Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-brand-red/10 border-brand-red/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Mail className="w-8 h-8 text-brand-red" />
                  How to Submit a Privacy Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  To exercise your privacy rights or request that we limit sharing of your information, you can contact us through any of the following methods:
                </p>
                <div className="bg-white/5 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-brand-red flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-white">Email</p>
                      <p className="text-gray-300">privacy@navigatorusa.org</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-brand-red flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-white">Phone</p>
                      <p className="text-gray-300">(562) 555-0100</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-brand-red flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-white">Mail</p>
                      <p className="text-gray-300">Navigator USA Corp<br />429 D Shoreline Village Dr<br />Long Beach, CA 90802</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mt-4">
                  You may also submit a request through our <Link href="/contact" className="text-brand-red hover:text-white underline">Contact Form</Link>. Please include "Privacy Request" in your message subject or description.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FileText className="w-8 h-8 text-brand-red" />
                  What to Include in Your Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  When submitting a privacy request, please include:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Your full name</li>
                  <li>Email address used when submitting information to us</li>
                  <li>The type of request (access, deletion, or opt-out of sharing)</li>
                  <li>Any additional details that help us locate your information</li>
                </ul>
                <p className="text-gray-300 mt-4">
                  We will respond to your request within 45 days as required by law. We may contact you to verify your identity before processing your request.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <ShieldCheck className="w-8 h-8 text-brand-red" />
                  Related Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  For more information about our privacy practices, please see:
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <Link href="/privacy-policy" className="inline-flex items-center gap-2 bg-brand-red/20 hover:bg-brand-red/30 text-brand-red px-4 py-2 rounded-lg transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/affiliated-partners" className="inline-flex items-center gap-2 bg-brand-red/20 hover:bg-brand-red/30 text-brand-red px-4 py-2 rounded-lg transition-colors">
                    Affiliated Partners
                  </Link>
                  <Link href="/terms-of-use" className="inline-flex items-center gap-2 bg-brand-red/20 hover:bg-brand-red/30 text-brand-red px-4 py-2 rounded-lg transition-colors">
                    Terms of Use
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
