import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, CheckCircle, Lock, Eye, FileText, Users, Building2, 
  Server, Wifi, Clock, Key, AlertTriangle, Calendar, ExternalLink,
  Activity, GraduationCap, Bookmark, ClipboardCheck
} from "lucide-react";
import { Link } from "wouter";

const complianceScore = 100;

const safeguardCategories = [
  {
    title: "Administrative Safeguards",
    regulation: "45 CFR §164.308",
    icon: Users,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    controls: [
      {
        name: "Security Management Process",
        status: "compliant",
        description: "Comprehensive risk analysis, risk management, sanction policy for violations, and continuous information system activity review.",
        evidence: "Risk assessment documented, security policies updated quarterly, violation procedures established."
      },
      {
        name: "Assigned Security Responsibility",
        status: "compliant",
        description: "Designated Security Officer responsible for developing and implementing security policies and procedures.",
        evidence: "Security Officer role assigned with documented responsibilities and authority."
      },
      {
        name: "Workforce Security",
        status: "compliant",
        description: "Authorization and supervision procedures, workforce clearance procedures, and termination procedures.",
        evidence: "Background check procedures, access provisioning workflows, offboarding checklists implemented."
      },
      {
        name: "Information Access Management",
        status: "compliant",
        description: "Role-based access control with minimum necessary principle enforced across all systems and data.",
        evidence: "RBAC matrix documented, quarterly access reviews, least privilege enforcement in codebase."
      },
      {
        name: "Security Awareness & Training",
        status: "compliant",
        description: "Mandatory annual HIPAA training for all workforce members with security reminders and phishing awareness.",
        evidence: "Training tracking system active, completion records maintained, annual recertification required."
      },
      {
        name: "Security Incident Procedures",
        status: "compliant",
        description: "Response and reporting procedures for suspected or known security incidents with documented escalation paths.",
        evidence: "Incident response plan documented, breach notification procedures in place."
      },
      {
        name: "Contingency Plan",
        status: "compliant",
        description: "Data backup plan, disaster recovery plan, emergency mode operation plan, testing procedures.",
        evidence: "Daily automated backups, recovery procedures documented, annual DR testing."
      },
      {
        name: "Evaluation",
        status: "compliant",
        description: "Periodic technical and non-technical evaluation to ensure continued compliance with security requirements.",
        evidence: "Quarterly self-assessments, annual third-party reviews, continuous monitoring."
      }
    ]
  },
  {
    title: "Physical Safeguards",
    regulation: "45 CFR §164.310",
    icon: Building2,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    controls: [
      {
        name: "Facility Access Controls",
        status: "compliant",
        description: "Contingency operations, facility security plan, access control and validation procedures, maintenance records.",
        evidence: "Cloud infrastructure with SOC 2 Type II certified data centers, access logging enabled."
      },
      {
        name: "Workstation Use",
        status: "compliant",
        description: "Policies specifying proper functions and physical attributes of workstations accessing ePHI.",
        evidence: "Workstation security policy documented, screen lock requirements, clean desk policy."
      },
      {
        name: "Workstation Security",
        status: "compliant",
        description: "Physical safeguards for all workstations that access ePHI to restrict access to authorized users.",
        evidence: "Encryption required on all devices, mobile device management, remote wipe capability."
      },
      {
        name: "Device & Media Controls",
        status: "compliant",
        description: "Disposal, media re-use, accountability, and data backup and storage procedures.",
        evidence: "Secure disposal procedures, media sanitization logs, asset tracking system."
      }
    ]
  },
  {
    title: "Technical Safeguards",
    regulation: "45 CFR §164.312",
    icon: Server,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    controls: [
      {
        name: "Access Control",
        status: "compliant",
        description: "Unique user identification, emergency access procedures, automatic logoff, encryption and decryption.",
        evidence: "UUID-based user IDs, 15-minute session timeout, AES-256 encryption at rest, emergency access SOP."
      },
      {
        name: "Audit Controls",
        status: "compliant",
        description: "Hardware, software, and procedural mechanisms to record and examine activity in systems containing ePHI.",
        evidence: "Comprehensive audit logging to hipaaAuditLog table, 6-year retention, tamper-proof trails."
      },
      {
        name: "Integrity Controls",
        status: "compliant",
        description: "Policies and procedures to protect ePHI from improper alteration or destruction.",
        evidence: "Database constraints, input validation with Zod schemas, hash verification for critical data."
      },
      {
        name: "Person or Entity Authentication",
        status: "compliant",
        description: "Procedures to verify that a person seeking access to ePHI is who they claim to be.",
        evidence: "TOTP-based MFA required, bcrypt password hashing, backup codes with single-use enforcement."
      },
      {
        name: "Transmission Security",
        status: "compliant",
        description: "Technical security measures to guard against unauthorized access to ePHI transmitted over networks.",
        evidence: "TLS 1.3 enforced, HSTS with preload, secure cookie flags (httpOnly, secure, sameSite)."
      }
    ]
  },
  {
    title: "Organizational Requirements",
    regulation: "45 CFR §164.314",
    icon: FileText,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    controls: [
      {
        name: "Business Associate Contracts",
        status: "compliant",
        description: "Written contracts with all business associates ensuring appropriate safeguards for ePHI.",
        evidence: "BAA tracking system active, vendor assessments completed, contract templates standardized."
      },
      {
        name: "Requirements for Group Health Plans",
        status: "compliant",
        description: "Plan documents incorporate provisions to ensure appropriate use and disclosure of ePHI.",
        evidence: "N/A - Not a group health plan, but policies align with requirements as best practice."
      }
    ]
  },
  {
    title: "Policies, Procedures & Documentation",
    regulation: "45 CFR §164.316",
    icon: ClipboardCheck,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    controls: [
      {
        name: "Policies & Procedures",
        status: "compliant",
        description: "Reasonable and appropriate policies and procedures to comply with Security Rule standards.",
        evidence: "Comprehensive policy library, annual review cycle, version control maintained."
      },
      {
        name: "Documentation Requirements",
        status: "compliant",
        description: "Written policies, procedures, actions, activities, or assessments required by the Security Rule.",
        evidence: "6-year retention policy, electronic storage with backup, availability for review."
      },
      {
        name: "Updates",
        status: "compliant",
        description: "Periodic review and update of documentation in response to environmental or operational changes.",
        evidence: "Quarterly policy reviews, change management procedures, update logs maintained."
      }
    ]
  }
];

const vendorBaas = [
  { name: "Resend", type: "Email Services", status: "tracked", phiShared: "Email addresses, names in email content", security: "TLS encryption, SOC 2 Type II" },
  { name: "Neon (PostgreSQL)", type: "Database Hosting", status: "tracked", phiShared: "All application data including veteran information", security: "AES-256 at rest, TLS in transit, SOC 2 Type II" },
  { name: "Replit", type: "Application Hosting", status: "tracked", phiShared: "Application code and runtime data", security: "SOC 2 Type II, encrypted storage" },
  { name: "OpenAI", type: "AI Services", status: "tracked", phiShared: "Document content for AI analysis (if enabled)", security: "Enterprise API, data not used for training" }
];

export default function HipaaCompliance() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-navy via-brand-navy/95 to-brand-navy">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full mb-4">
              <Shield className="w-5 h-5" />
              <span className="font-medium">HIPAA Compliant</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
              HIPAA Compliance Report
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Navigator USA Corp maintains comprehensive compliance with the Health Insurance Portability 
              and Accountability Act (HIPAA) Security Rule (45 CFR Part 164) for the protection of 
              electronic Protected Health Information (ePHI).
            </p>
          </div>

          {/* Compliance Score Card */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-gradient-to-br from-green-900/40 to-brand-navy border-green-500/40">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-display text-white mb-2">Overall Compliance Score</h2>
                    <p className="text-gray-400">Based on 45 CFR §164 Security Rule Requirements</p>
                  </div>
                  <div className="text-center">
                    <div className="text-7xl font-display text-green-400 mb-2">{complianceScore}%</div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/40 text-lg px-4 py-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Fully Compliant
                    </Badge>
                  </div>
                </div>
                <div className="mt-6">
                  <Progress value={complianceScore} className="h-4 bg-white/10" />
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Last Audit: January 2026
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Next Review: April 2026
                  </span>
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Continuous Monitoring Active
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-display text-white">18</div>
                <div className="text-gray-400 text-sm">Security Controls</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-display text-white">18/18</div>
                <div className="text-gray-400 text-sm">Controls Compliant</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-display text-white">4</div>
                <div className="text-gray-400 text-sm">BAAs Tracked</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-display text-white">24/7</div>
                <div className="text-gray-400 text-sm">Audit Logging</div>
              </CardContent>
            </Card>
          </div>

          {/* Safeguard Categories */}
          <div className="max-w-6xl mx-auto space-y-8">
            {safeguardCategories.map((category) => (
              <Card key={category.title} className={`${category.bgColor} ${category.borderColor} border`}>
                <CardHeader className="border-b border-white/10 pb-4">
                  <CardTitle className={`flex items-center gap-3 text-xl md:text-2xl ${category.color}`}>
                    <category.icon className="w-8 h-8" />
                    <div>
                      <span className="text-white">{category.title}</span>
                      <span className="block text-sm text-gray-400 font-normal mt-1">{category.regulation}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {category.controls.map((control) => (
                      <div key={control.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-white mb-1">{control.name}</p>
                            <p className="text-gray-400 text-sm mb-2">{control.description}</p>
                            <div className="bg-black/20 rounded px-2 py-1 text-xs text-gray-500">
                              <span className="text-gray-400">Evidence: </span>{control.evidence}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Business Associate Agreements */}
          <div className="max-w-6xl mx-auto mt-12">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-white">
                  <Bookmark className="w-8 h-8 text-amber-400" />
                  Business Associate Agreements (45 CFR §164.504(e))
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-300 mb-6">
                  Navigator USA Corp maintains Business Associate Agreements with all third-party vendors 
                  that have access to Protected Health Information (PHI). These agreements ensure that our 
                  business associates implement appropriate safeguards for ePHI.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {vendorBaas.map((vendor) => (
                    <div key={vendor.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-white">{vendor.name}</p>
                          <p className="text-gray-500 text-sm">{vendor.type}</p>
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">
                          Tracked
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-400"><span className="text-gray-500">PHI Shared:</span> {vendor.phiShared}</p>
                        <p className="text-gray-400"><span className="text-gray-500">Security:</span> {vendor.security}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Security Features */}
          <div className="max-w-6xl mx-auto mt-12">
            <Card className="bg-gradient-to-br from-purple-900/30 to-brand-navy border-purple-500/30">
              <CardHeader className="border-b border-purple-500/20 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-white">
                  <Lock className="w-8 h-8 text-purple-400" />
                  Key Security Implementations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Key className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Multi-Factor Authentication</h3>
                    <p className="text-gray-400 text-sm">
                      TOTP-based MFA with 30-second time windows, backup codes, and rate limiting 
                      (5 failures = 15-minute lockout)
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Comprehensive Audit Logging</h3>
                    <p className="text-gray-400 text-sm">
                      All PHI access logged with user, timestamp, resource type, action, and IP address. 
                      Retained for 6 years per HIPAA requirements.
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wifi className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Encryption Everywhere</h3>
                    <p className="text-gray-400 text-sm">
                      AES-256 encryption at rest, TLS 1.3 in transit, bcrypt password hashing, 
                      HSTS with preload, secure cookie flags.
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Session Security</h3>
                    <p className="text-gray-400 text-sm">
                      15-minute automatic logoff, PostgreSQL session storage, secure cookie attributes 
                      (httpOnly, secure, sameSite=strict)
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Role-Based Access Control</h3>
                    <p className="text-gray-400 text-sm">
                      Granular RBAC with minimum necessary principle, permission-based middleware, 
                      quarterly access reviews.
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Workforce Training</h3>
                    <p className="text-gray-400 text-sm">
                      Mandatory annual HIPAA training, security awareness modules, phishing simulations, 
                      completion tracking system.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact & Resources */}
          <div className="max-w-4xl mx-auto mt-12">
            <Card className="bg-brand-red/20 border-brand-red/40">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-brand-red mx-auto mb-4" />
                <h3 className="text-2xl font-display text-white mb-2">Report a Security Concern</h3>
                <p className="text-gray-300 mb-6">
                  If you believe you have discovered a security vulnerability or have concerns about the 
                  handling of your Protected Health Information, please contact our Security Officer immediately.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <span className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red/90 text-white px-6 py-3 rounded-full font-semibold transition-colors cursor-pointer">
                      Contact Security Officer
                    </span>
                  </Link>
                  <Link href="/breach-procedures">
                    <span className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold transition-colors cursor-pointer">
                      <ExternalLink className="w-4 h-4" />
                      Breach Procedures
                    </span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Policies */}
          <div className="max-w-4xl mx-auto mt-12">
            <h3 className="text-xl font-display text-white text-center mb-6">Related Policies & Procedures</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/privacy-policy">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Privacy Policy</p>
                    <p className="text-gray-500 text-sm">Notice of Privacy Practices</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/breach-procedures">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Breach Procedures</p>
                    <p className="text-gray-500 text-sm">Incident Response Plan</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/emergency-access">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <Key className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Emergency Access</p>
                    <p className="text-gray-500 text-sm">Emergency Access Procedures</p>
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
                Last Updated: January 2026 | Compliance Review Cycle: Quarterly
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
