import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Users, MapPin, Mail, Phone, Calendar, Lock, Eye, Edit, FileCheck, AlertCircle, Scale, Building, Heart } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-navy to-brand-navy/95">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-red/20 text-brand-red px-4 py-2 rounded-full mb-4">
              <Shield className="w-5 h-5" />
              <span className="font-medium">HIPAA Privacy Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
              Notice of Privacy Practices
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              This notice describes how medical information about you may be used and disclosed and how you can get access to this information. Please review it carefully.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <Calendar className="w-4 h-4 text-brand-gold" />
              <span className="text-gray-300 text-sm">Effective Date: January 30, 2026</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="bg-brand-red/10 border-brand-red/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Heart className="w-8 h-8 text-brand-red" />
                  Our Commitment to Your Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Navigator USA Corp ("NavigatorUSA," "we," "us," or "our") is committed to protecting the privacy of your protected health information (PHI) in accordance with the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and its implementing regulations at 45 CFR Parts 160 and 164.
                </p>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="font-semibold text-white mb-2">This Notice of Privacy Practices is provided pursuant to 45 CFR §164.520</p>
                  <p className="text-gray-300 text-sm">
                    We are required by law to maintain the privacy of your protected health information, provide you with this notice of our legal duties and privacy practices, and follow the terms of the notice currently in effect.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Building className="w-8 h-8 text-brand-red" />
                  About Navigator USA Corp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Navigator USA Corp is a federally recognized 501(c)(3) nonprofit organization dedicated to serving veteran families. Through our Mission Act Health initiative and related healthcare services, we may receive, create, or maintain protected health information about you.
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
                  How We Collect Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  We collect protected health information (PHI) and other personal information through various means:
                </p>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="font-semibold text-white mb-2">Direct Collection</p>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Health intake forms and questionnaires you complete</li>
                      <li>• Information provided during healthcare consultations</li>
                      <li>• VA disability rating documentation you submit</li>
                      <li>• Medical records you authorize us to obtain</li>
                      <li>• Communications via phone, email, or secure messaging</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="font-semibold text-white mb-2">From Healthcare Providers</p>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Medical records from treating physicians (with your authorization)</li>
                      <li>• VA healthcare records (with appropriate consent)</li>
                      <li>• Diagnostic test results and treatment summaries</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="font-semibold text-white mb-2">Types of PHI We May Collect</p>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Demographic information (name, address, date of birth, SSN)</li>
                      <li>• Medical history and current health conditions</li>
                      <li>• Disability ratings and service-connected conditions</li>
                      <li>• Treatment records and medication information</li>
                      <li>• Health insurance and benefits information</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Users className="w-8 h-8 text-brand-red" />
                  How We Use and Disclose Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  We may use and disclose your PHI for the following purposes without your written authorization:
                </p>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-brand-red pl-4">
                    <p className="font-semibold text-white">Treatment</p>
                    <p className="text-gray-300 text-sm">To coordinate your healthcare with affiliated providers, specialists, and the VA healthcare system.</p>
                  </div>
                  
                  <div className="border-l-4 border-brand-red pl-4">
                    <p className="font-semibold text-white">Payment</p>
                    <p className="text-gray-300 text-sm">To obtain payment for services, submit claims to health plans, and verify insurance eligibility.</p>
                  </div>
                  
                  <div className="border-l-4 border-brand-red pl-4">
                    <p className="font-semibold text-white">Healthcare Operations</p>
                    <p className="text-gray-300 text-sm">For quality improvement, training, accreditation, and administrative functions necessary to run our organization.</p>
                  </div>
                  
                  <div className="border-l-4 border-brand-gold pl-4">
                    <p className="font-semibold text-white">As Required by Law</p>
                    <p className="text-gray-300 text-sm">When required by federal, state, or local law, including reporting to public health authorities.</p>
                  </div>
                  
                  <div className="border-l-4 border-brand-gold pl-4">
                    <p className="font-semibold text-white">Health and Safety</p>
                    <p className="text-gray-300 text-sm">To prevent serious and imminent threat to health or safety, or for certain law enforcement purposes.</p>
                  </div>
                </div>

                <div className="bg-brand-red/10 border border-brand-red/30 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-brand-red mb-2">Authorization Required</p>
                  <p className="text-gray-300 text-sm">
                    Most uses and disclosures of your PHI for purposes other than treatment, payment, healthcare operations, or as otherwise permitted by law require your written authorization. You may revoke any authorization at any time in writing.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Lock className="w-8 h-8 text-brand-red" />
                  How We Protect Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  We implement comprehensive administrative, physical, and technical safeguards to protect your PHI as required by the HIPAA Security Rule (45 CFR Part 164, Subpart C):
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Encryption</p>
                    </div>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• AES-256 encryption for data at rest</li>
                      <li>• TLS 1.3 encryption for data in transit</li>
                      <li>• End-to-end encryption for sensitive communications</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Access Controls</p>
                    </div>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Role-based access control (RBAC)</li>
                      <li>• Multi-factor authentication (MFA)</li>
                      <li>• Unique user identification</li>
                      <li>• Automatic session timeout</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Audit Controls</p>
                    </div>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Comprehensive audit logging</li>
                      <li>• Regular access reviews</li>
                      <li>• Intrusion detection systems</li>
                      <li>• Security incident monitoring</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Physical Safeguards</p>
                    </div>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Secure facility access controls</li>
                      <li>• Workstation security policies</li>
                      <li>• Device and media controls</li>
                      <li>• Proper disposal procedures</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-white mb-2">Workforce Training</p>
                  <p className="text-gray-300 text-sm">
                    All workforce members receive HIPAA privacy and security training upon hiring and annually thereafter. We maintain strict policies regarding the handling of PHI and enforce sanctions for violations.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Scale className="w-8 h-8 text-brand-red" />
                  Your Rights Under HIPAA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Under HIPAA (45 CFR §164.524-§164.528), you have the following rights regarding your protected health information:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-5 h-5 text-brand-red" />
                      <p className="font-semibold text-white">Right to Access (45 CFR §164.524)</p>
                    </div>
                    <p className="text-gray-300 text-sm">
                      You have the right to inspect and obtain a copy of your PHI maintained in a designated record set. We will respond to your request within 30 days. We may charge a reasonable, cost-based fee for copies.
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Edit className="w-5 h-5 text-brand-red" />
                      <p className="font-semibold text-white">Right to Amendment (45 CFR §164.526)</p>
                    </div>
                    <p className="text-gray-300 text-sm">
                      You have the right to request an amendment to your PHI if you believe it is incorrect or incomplete. We will respond to your request within 60 days. We may deny the request in certain circumstances but will provide you with a written explanation.
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCheck className="w-5 h-5 text-brand-red" />
                      <p className="font-semibold text-white">Right to an Accounting of Disclosures (45 CFR §164.528)</p>
                    </div>
                    <p className="text-gray-300 text-sm">
                      You have the right to receive an accounting of disclosures of your PHI made by us for the six years prior to your request, except for disclosures made for treatment, payment, healthcare operations, and certain other purposes. The first accounting in any 12-month period is free; we may charge for additional requests.
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-5 h-5 text-brand-red" />
                      <p className="font-semibold text-white">Right to Request Restrictions</p>
                    </div>
                    <p className="text-gray-300 text-sm">
                      You may request restrictions on certain uses and disclosures of your PHI. We are not required to agree to your request, except for restrictions on disclosures to health plans when you have paid out of pocket in full for a service.
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-brand-red" />
                      <p className="font-semibold text-white">Right to Confidential Communications</p>
                    </div>
                    <p className="text-gray-300 text-sm">
                      You may request to receive communications about your PHI by alternative means or at alternative locations. We will accommodate reasonable requests.
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-brand-red" />
                      <p className="font-semibold text-white">Right to a Paper Copy of This Notice</p>
                    </div>
                    <p className="text-gray-300 text-sm">
                      You have the right to obtain a paper copy of this Notice of Privacy Practices upon request, even if you have agreed to receive this notice electronically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-red/10 border-brand-red/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <AlertCircle className="w-8 h-8 text-brand-red" />
                  How to File a Complaint
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  If you believe your privacy rights have been violated, you have the right to file a complaint. You will not be retaliated against for filing a complaint.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="font-semibold text-white mb-2">File a Complaint with Navigator USA Corp</p>
                    <p className="text-gray-300 text-sm mb-2">
                      Contact our Privacy Officer to file a complaint directly with us:
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-brand-red" />
                        <span className="text-gray-300">privacy@navigatorusa.org</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-brand-red" />
                        <span className="text-gray-300">(562) 555-0100</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-red" />
                        <span className="text-gray-300">429 D Shoreline Village Dr, Long Beach, CA 90802</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="font-semibold text-white mb-2">File a Complaint with the U.S. Department of Health and Human Services</p>
                    <p className="text-gray-300 text-sm mb-2">
                      You may also file a complaint with the Secretary of Health and Human Services:
                    </p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-300">Office for Civil Rights</p>
                      <p className="text-gray-300">U.S. Department of Health and Human Services</p>
                      <p className="text-gray-300">200 Independence Avenue, S.W.</p>
                      <p className="text-gray-300">Washington, D.C. 20201</p>
                      <p className="text-gray-300 mt-2">
                        Toll-free: 1-877-696-6775<br />
                        Website: <a href="https://www.hhs.gov/ocr/privacy/hipaa/complaints/" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:text-white underline">www.hhs.gov/ocr/privacy/hipaa/complaints/</a>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Shield className="w-8 h-8 text-brand-red" />
                  Privacy Officer Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Our Privacy Officer is responsible for overseeing compliance with this Notice and HIPAA regulations. For questions about this Notice, to exercise your rights, or to file a complaint, please contact:
                </p>
                
                <div className="bg-white/5 rounded-lg p-6">
                  <p className="font-semibold text-white text-lg mb-4">Privacy Officer</p>
                  <p className="text-white font-medium mb-4">Navigator USA Corp</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-brand-red" />
                      <span className="text-gray-300">429 D Shoreline Village Dr, Long Beach, CA 90802</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-brand-red" />
                      <span className="text-gray-300">privacy@navigatorusa.org</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-brand-red" />
                      <span className="text-gray-300">(562) 555-0100</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mt-4">
                  You may also submit a privacy request through our <Link href="/contact" className="text-brand-red hover:text-white underline">Contact Form</Link>.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FileText className="w-8 h-8 text-brand-red" />
                  Changes to This Notice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to change the terms of this Notice and make the new provisions effective for all PHI we maintain. If we make a material change to this Notice, we will post the revised Notice on our website and make copies available upon request.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  The current version of this Notice will always be available on our website at <Link href="/privacy-policy" className="text-brand-red hover:text-white underline">navigatorusa.org/privacy-policy</Link>.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Users className="w-8 h-8 text-brand-red" />
                  California Privacy Rights (CCPA/CPRA)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA). Note that PHI covered by HIPAA is generally exempt from CCPA/CPRA, but other personal information may be subject to these laws.
                </p>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="font-semibold text-white mb-2">Additional California Rights:</p>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Right to know what personal information is collected</li>
                    <li>• Right to delete personal information</li>
                    <li>• Right to opt-out of sale/sharing of personal information</li>
                    <li>• Right to non-discrimination</li>
                  </ul>
                </div>
                <p className="text-gray-300 mt-4">
                  California residents may exercise their rights by visiting our <Link href="/do-not-sell" className="text-brand-red hover:text-white underline">Do Not Sell or Share My Personal Information</Link> page.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 text-center space-y-4">
            <div className="inline-flex items-center gap-3 bg-white/5 rounded-full px-6 py-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 text-sm">
                Last Updated: January 30, 2026
              </span>
            </div>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              This Notice of Privacy Practices is provided in accordance with 45 CFR §164.520 of the HIPAA Privacy Rule.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
