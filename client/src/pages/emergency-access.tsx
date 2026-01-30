import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  FileText, 
  CheckCircle, 
  Users, 
  Phone, 
  Mail, 
  Calendar,
  AlertCircle,
  Scale,
  ClipboardList,
  Key,
  Lock,
  UserCheck,
  MessageSquare,
  FileCheck,
  Search,
  Timer,
  Flag,
  Building,
  Bookmark,
  ArrowRight
} from "lucide-react";

const authorizationLevels = [
  {
    level: "Level 1 - Privacy Officer",
    color: "bg-blue-600",
    textColor: "text-blue-400",
    borderColor: "border-blue-500",
    authority: "Primary authorization authority for emergency PHI access",
    canAuthorize: [
      "Single patient record access for treatment purposes",
      "Limited scope access for up to 4 hours",
      "Access to clinical systems during system outages",
      "Break-glass access for treating physicians"
    ],
    limitations: [
      "Cannot authorize bulk data exports",
      "Cannot authorize access exceeding 24 hours",
      "Must document within 1 hour of authorization"
    ]
  },
  {
    level: "Level 2 - Security Officer",
    color: "bg-orange-500",
    textColor: "text-orange-400",
    borderColor: "border-orange-500",
    authority: "Technical authorization for system-level emergency access",
    canAuthorize: [
      "Emergency administrative access to PHI systems",
      "Temporary credential issuance for emergency responders",
      "System bypass during technical failures",
      "Extended access periods up to 48 hours"
    ],
    limitations: [
      "Requires Privacy Officer notification within 30 minutes",
      "Cannot authorize access for non-treatment purposes",
      "Must activate incident response logging"
    ]
  },
  {
    level: "Level 3 - Executive Leadership",
    color: "bg-red-600",
    textColor: "text-red-400",
    borderColor: "border-red-500",
    authority: "Highest authority for organization-wide emergency access",
    canAuthorize: [
      "Mass casualty event access protocols",
      "Public health emergency data sharing",
      "Extended emergency operations beyond 48 hours",
      "Third-party emergency responder access"
    ],
    limitations: [
      "Requires both Privacy and Security Officer notification",
      "Must convene Emergency Response Committee within 4 hours",
      "Mandatory HHS notification for public health emergencies"
    ]
  }
];

const procedureSteps = [
  {
    step: 1,
    title: "Identify Emergency Situation",
    icon: AlertTriangle,
    color: "brand-red",
    description: "Recognize and confirm the emergency requiring PHI access",
    actions: [
      "Confirm imminent threat to patient health or safety",
      "Verify standard access methods are unavailable or inadequate",
      "Document the nature of the emergency",
      "Identify specific PHI required to address the emergency",
      "Assess time-sensitivity of the situation"
    ],
    timeframe: "Immediate"
  },
  {
    step: 2,
    title: "Contact Privacy/Security Officer",
    icon: Phone,
    color: "brand-gold",
    description: "Reach appropriate authorization personnel",
    actions: [
      "Call 24/7 Emergency Hotline: (562) 555-0199",
      "If unavailable, contact backup officer on call",
      "Provide your name, role, and callback number",
      "Briefly describe the emergency situation",
      "State the specific access required"
    ],
    timeframe: "Within 5 minutes"
  },
  {
    step: 3,
    title: "Document Justification",
    icon: FileText,
    color: "brand-red",
    description: "Create written record of emergency access need",
    actions: [
      "Complete Emergency Access Request Form (Form EA-100)",
      "Document patient identification (if applicable)",
      "Describe the emergency circumstances in detail",
      "Specify what PHI is needed and why",
      "Record the names of all persons involved"
    ],
    timeframe: "Within 10 minutes"
  },
  {
    step: 4,
    title: "Obtain Verbal Authorization",
    icon: MessageSquare,
    color: "brand-gold",
    description: "Receive approval from authorized personnel",
    actions: [
      "Receive verbal authorization from Privacy/Security Officer",
      "Record authorization code provided",
      "Note the name and title of authorizing official",
      "Confirm scope and duration of authorized access",
      "Acknowledge understanding of access limitations"
    ],
    timeframe: "Within 15 minutes"
  },
  {
    step: 5,
    title: "Access System with Emergency Credentials",
    icon: Key,
    color: "brand-red",
    description: "Use break-glass access to obtain required PHI",
    actions: [
      "Receive emergency access credentials from Security Officer",
      "Log into system using emergency access protocol",
      "Access only the specific PHI authorized",
      "Do not copy or export data unless specifically authorized",
      "Note all records accessed for documentation"
    ],
    timeframe: "As authorized"
  },
  {
    step: 6,
    title: "Complete Emergency Access Log",
    icon: ClipboardList,
    color: "brand-gold",
    description: "Document all access activities in detail",
    actions: [
      "Complete Emergency Access Log (Form EA-200)",
      "Record exact time of access start and end",
      "List all PHI records accessed by identifier",
      "Document all personnel who viewed the information",
      "Submit log to Privacy Officer within 24 hours"
    ],
    timeframe: "Within 24 hours"
  },
  {
    step: 7,
    title: "Post-Incident Review",
    icon: CheckCircle,
    color: "brand-red",
    description: "Participate in formal review of emergency access",
    actions: [
      "Attend post-incident review meeting",
      "Provide detailed account of emergency circumstances",
      "Submit any additional documentation requested",
      "Cooperate with compliance audit if required",
      "Complete any required follow-up training"
    ],
    timeframe: "Within 7 days"
  }
];

const documentationRequirements = [
  {
    item: "Emergency Access Request Form (EA-100)",
    description: "Initial request documenting emergency circumstances and access needed",
    retention: "6 years minimum",
    required: true
  },
  {
    item: "Emergency Access Log (EA-200)",
    description: "Detailed record of all PHI accessed during emergency",
    retention: "6 years minimum",
    required: true
  },
  {
    item: "Verbal Authorization Record",
    description: "Documentation of verbal approval including authorization code",
    retention: "6 years minimum",
    required: true
  },
  {
    item: "System Access Audit Trail",
    description: "Automated log of all system access during emergency period",
    retention: "6 years minimum",
    required: true
  },
  {
    item: "Post-Incident Review Report",
    description: "Summary of review findings and any corrective actions",
    retention: "6 years minimum",
    required: true
  },
  {
    item: "Patient Notification Record",
    description: "Documentation of any required patient notifications",
    retention: "6 years minimum",
    required: false
  }
];

const emergencyContacts = [
  {
    role: "Privacy Officer",
    name: "HIPAA Compliance Team",
    phone: "(562) 555-0100",
    email: "privacy@navigatorusa.org",
    availability: "24/7 Emergency Line",
    primary: true
  },
  {
    role: "Security Officer",
    name: "Information Security Team",
    phone: "(562) 555-0101",
    email: "security@navigatorusa.org",
    availability: "24/7 Emergency Line",
    primary: true
  },
  {
    role: "24/7 Emergency Hotline",
    name: "Emergency Access Dispatch",
    phone: "(562) 555-0199",
    email: "emergency@navigatorusa.org",
    availability: "24/7 - Priority Response",
    primary: true
  },
  {
    role: "Executive Leadership",
    name: "Chief Executive Officer",
    phone: "(562) 555-0103",
    email: "ceo@navigatorusa.org",
    availability: "Critical Emergencies Only",
    primary: false
  }
];

export default function EmergencyAccess() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-navy to-brand-navy/95">
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0">
          <div className="transform rotate-[-30deg] text-white text-9xl font-bold tracking-widest">
            INTERNAL USE ONLY
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-gold/20 text-brand-gold px-4 py-2 rounded-full mb-4">
              <Bookmark className="w-5 h-5" />
              <span className="font-medium">Standard Operating Procedure</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4" data-testid="text-page-title">
              Emergency Access Procedures
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Internal reference guide for emergency access to protected health information (PHI) in compliance with HIPAA Security Rule requirements.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Scale className="w-4 h-4 text-brand-gold" />
                <span className="text-gray-300 text-sm">45 CFR §164.312(a)(2)(ii) - Emergency Access Procedure</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Calendar className="w-4 h-4 text-brand-gold" />
                <span className="text-gray-300 text-sm">Version 1.0 | Last Updated: January 30, 2026</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-brand-red/20 px-4 py-2 rounded-lg">
                <Flag className="w-4 h-4 text-brand-red" />
                <span className="text-brand-red text-sm font-semibold">INTERNAL USE ONLY</span>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto space-y-8 print:space-y-4">
            <Card className="bg-brand-red/10 border-brand-red/30 text-white print:border print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <AlertCircle className="w-8 h-8 text-brand-red" />
                  A. Purpose
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  This Standard Operating Procedure establishes the protocols for accessing protected health information (PHI) during emergency situations when normal access controls cannot be used. Emergency access procedures ensure continuity of patient care while maintaining HIPAA compliance.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="font-semibold text-white mb-2">Why Emergency Access is Needed</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• System outages affecting normal authentication</li>
                      <li>• Disaster recovery scenarios requiring immediate access</li>
                      <li>• Life-threatening situations requiring immediate PHI access</li>
                      <li>• Public health emergencies with urgent data needs</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="font-semibold text-white mb-2">Definition of "Emergency" (HIPAA Context)</p>
                    <p className="text-gray-300 text-sm">
                      Under 45 CFR §164.312(a)(2)(ii), an emergency is a situation where immediate access to PHI is necessary to prevent serious harm to a patient or to provide treatment, and normal access procedures cannot be followed due to technical or operational constraints.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white print:border print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Users className="w-8 h-8 text-brand-gold" />
                  B. Scope
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <UserCheck className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Who Can Invoke</p>
                    </div>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Licensed healthcare providers</li>
                      <li>• Authorized clinical staff</li>
                      <li>• System administrators (technical emergencies)</li>
                      <li>• Privacy/Security Officers</li>
                      <li>• Executive leadership</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Building className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Systems Covered</p>
                    </div>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Electronic Health Records (EHR)</li>
                      <li>• Patient Management System</li>
                      <li>• VA Claims Processing System</li>
                      <li>• Healthcare Intake Portals</li>
                      <li>• Document Management System</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Data Accessible</p>
                    </div>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Patient demographics</li>
                      <li>• Medical records and history</li>
                      <li>• Treatment plans and medications</li>
                      <li>• Disability rating information</li>
                      <li>• Emergency contact information</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-brand-red/10 border border-brand-red/30 rounded-lg p-4">
                  <p className="text-brand-red font-semibold mb-2">Important Limitation</p>
                  <p className="text-gray-300 text-sm">
                    Emergency access is limited to the minimum necessary PHI required to address the specific emergency situation. Accessing PHI beyond what is needed for the emergency is a violation of HIPAA and subject to disciplinary action.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white print:border print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Shield className="w-8 h-8 text-brand-red" />
                  C. Authorization Levels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  Emergency access authorization is tiered based on the nature and scope of the emergency. Each level has specific authority and limitations.
                </p>
                
                <div className="space-y-4">
                  {authorizationLevels.map((level, index) => (
                    <div 
                      key={index} 
                      className={`border-l-4 ${level.borderColor} bg-white/5 rounded-r-lg p-4`}
                      data-testid={`auth-level-${index + 1}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`${level.color} px-3 py-1 rounded-full`}>
                          <span className="text-white text-sm font-semibold">{level.level}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{level.authority}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-white font-semibold text-sm mb-2">Can Authorize:</p>
                          <ul className="text-gray-300 text-sm space-y-1">
                            {level.canAuthorize.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm mb-2">Limitations:</p>
                          <ul className="text-gray-300 text-sm space-y-1">
                            {level.limitations.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white print:border print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Timer className="w-8 h-8 text-brand-gold" />
                  D. Emergency Access Procedure (Step-by-Step)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300 leading-relaxed mb-6">
                  Follow these seven steps in sequence when emergency access to PHI is required. Each step includes specific timeframes to ensure rapid yet compliant access.
                </p>

                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-red via-brand-gold to-brand-red hidden md:block" />
                  
                  <div className="space-y-6">
                    {procedureSteps.map((step, index) => (
                      <div key={step.step} className="relative" data-testid={`procedure-step-${step.step}`}>
                        <div className="flex gap-6">
                          <div className="relative z-10 flex-shrink-0">
                            <div className={`w-16 h-16 bg-${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                              <step.icon className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          
                          <div className="flex-grow bg-white/5 rounded-lg p-4">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <span className="text-brand-gold font-semibold">Step {step.step}</span>
                              <h3 className="text-white font-semibold text-lg">{step.title}</h3>
                              <span className="bg-white/10 px-3 py-1 rounded-full text-xs text-gray-300">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {step.timeframe}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{step.description}</p>
                            <ul className="space-y-1">
                              {step.actions.map((action, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                                  <ArrowRight className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white print:border print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FileCheck className="w-8 h-8 text-brand-red" />
                  E. Documentation Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed mb-4">
                  All emergency access events must be thoroughly documented. HIPAA requires retention of these records for a minimum of six (6) years from the date of creation or last effective date.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="documentation-table">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-4 text-brand-gold font-semibold">Document</th>
                        <th className="text-left py-3 px-4 text-brand-gold font-semibold">Description</th>
                        <th className="text-left py-3 px-4 text-brand-gold font-semibold">Retention</th>
                        <th className="text-center py-3 px-4 text-brand-gold font-semibold">Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentationRequirements.map((doc, index) => (
                        <tr key={index} className="border-b border-white/10">
                          <td className="py-3 px-4 text-white font-medium">{doc.item}</td>
                          <td className="py-3 px-4 text-gray-300">{doc.description}</td>
                          <td className="py-3 px-4 text-gray-300">{doc.retention}</td>
                          <td className="py-3 px-4 text-center">
                            {doc.required ? (
                              <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <span className="text-gray-400">If applicable</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-brand-gold mb-2">Audit Trail Requirements</p>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• All system access during emergency must be logged automatically</li>
                    <li>• Logs must include user ID, timestamp, records accessed, and actions taken</li>
                    <li>• Audit logs must be immutable and tamper-evident</li>
                    <li>• Regular review of emergency access logs by Privacy Officer (monthly)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white print:border print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Search className="w-8 h-8 text-brand-gold" />
                  F. Post-Emergency Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed mb-4">
                  Every emergency access event requires a formal post-incident review to ensure compliance and identify opportunities for improvement.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Timeline</p>
                    </div>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="bg-brand-red px-2 py-0.5 rounded text-xs">24 hrs</span>
                        <span>Preliminary report due</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="bg-brand-gold px-2 py-0.5 rounded text-xs">7 days</span>
                        <span>Review meeting held</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="bg-blue-600 px-2 py-0.5 rounded text-xs">14 days</span>
                        <span>Final report completed</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="bg-green-600 px-2 py-0.5 rounded text-xs">30 days</span>
                        <span>Corrective actions implemented</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Review Committee</p>
                    </div>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Privacy Officer (Chair)</li>
                      <li>• Security Officer</li>
                      <li>• Department Manager (if applicable)</li>
                      <li>• Compliance Officer</li>
                      <li>• Legal Counsel (if needed)</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ClipboardList className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Remediation Actions</p>
                    </div>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Policy/procedure updates</li>
                      <li>• Additional staff training</li>
                      <li>• System improvements</li>
                      <li>• Disciplinary action (if warranted)</li>
                      <li>• Breach notification (if required)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-gold/10 border-brand-gold/30 text-white print:border print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Phone className="w-8 h-8 text-brand-gold" />
                  G. Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {emergencyContacts.map((contact, index) => (
                    <div 
                      key={index} 
                      className={`bg-white/5 rounded-lg p-4 ${contact.primary ? 'border-2 border-brand-gold/50' : 'border border-white/10'}`}
                      data-testid={`contact-${index}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Lock className="w-5 h-5 text-brand-gold" />
                          <p className="font-semibold text-white">{contact.role}</p>
                        </div>
                        {contact.primary && (
                          <span className="bg-brand-gold/20 text-brand-gold px-2 py-1 rounded text-xs font-semibold">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{contact.name}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-brand-gold" />
                          <span className="text-white font-mono">{contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-brand-gold" />
                          <span className="text-gray-300">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-brand-gold" />
                          <span className="text-gray-300">{contact.availability}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-brand-red/20 border border-brand-red/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-brand-red" />
                    <p className="font-semibold text-brand-red">Critical Reminder</p>
                  </div>
                  <p className="text-gray-300 text-sm">
                    If you are unable to reach any of the contacts listed above during an emergency, proceed with the minimum necessary access to address the immediate patient care need, and document all actions thoroughly. Contact the Privacy Officer as soon as possible after the emergency is resolved.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-gray-400 text-sm mt-8 print:mt-4">
              <p>Navigator USA Corp | HIPAA Emergency Access Procedures</p>
              <p>Document ID: SOP-EA-001 | Version 1.0 | Effective Date: January 30, 2026</p>
              <p className="text-brand-red font-semibold mt-2">CONFIDENTIAL - INTERNAL USE ONLY</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .bg-brand-navy, .bg-gradient-to-b {
            background: white !important;
          }
          .text-white, .text-gray-300, .text-gray-400 {
            color: #1a1a1a !important;
          }
          .text-brand-gold, .text-brand-red {
            color: #333 !important;
          }
          .bg-white\\/5, .bg-white\\/10, .bg-brand-red\\/10, .bg-brand-gold\\/10 {
            background: #f5f5f5 !important;
          }
          .fixed {
            display: none !important;
          }
        }
      `}</style>
    </Layout>
  );
}