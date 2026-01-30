import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  Search, 
  FileText, 
  Bell, 
  CheckCircle, 
  Users, 
  Phone, 
  Mail, 
  Building, 
  Calendar,
  AlertCircle,
  Scale,
  ClipboardList,
  Target,
  Timer,
  Flag,
  ArrowRight,
  ExternalLink
} from "lucide-react";

const timelineSteps = [
  {
    step: 1,
    title: "Discovery and Identification",
    deadline: "Within 24 Hours",
    icon: Search,
    color: "brand-red",
    description: "Initial detection and confirmation of potential breach",
    actions: [
      "Identify the nature and scope of the incident",
      "Confirm whether PHI was involved",
      "Document initial findings immediately",
      "Notify Privacy Officer and Incident Response Team",
      "Preserve all evidence and system logs",
      "Begin incident documentation in breach log"
    ]
  },
  {
    step: 2,
    title: "Containment and Assessment",
    deadline: "Within 48 Hours",
    icon: Shield,
    color: "brand-gold",
    description: "Stop the breach and assess the damage",
    actions: [
      "Implement immediate containment measures",
      "Isolate affected systems if necessary",
      "Assess what PHI was accessed or disclosed",
      "Identify number of individuals affected",
      "Determine the type of PHI involved (SSN, medical records, etc.)",
      "Document all containment actions taken"
    ]
  },
  {
    step: 3,
    title: "Risk Assessment",
    deadline: "Within 72 Hours",
    icon: Target,
    color: "brand-red",
    description: "Evaluate breach severity using NIST guidelines",
    actions: [
      "Conduct formal risk assessment per 45 CFR §164.402",
      "Apply NIST SP 800-61 incident handling framework",
      "Evaluate likelihood of PHI compromise",
      "Assess potential harm to affected individuals",
      "Determine if breach exception applies (encryption, etc.)",
      "Document risk assessment findings and conclusions"
    ]
  },
  {
    step: 4,
    title: "Notification Requirements",
    deadline: "Within 60 Days",
    icon: Bell,
    color: "brand-gold",
    description: "Notify affected individuals and regulatory bodies",
    actions: [
      "Prepare individual notification letters",
      "Include all required elements per §164.404(c)",
      "Notify HHS if breach affects 500+ individuals",
      "Notify State Attorney General as required",
      "For 500+ individuals: notify prominent media outlets",
      "Send notifications via first-class mail or email"
    ]
  },
  {
    step: 5,
    title: "Documentation and Reporting",
    deadline: "Ongoing",
    icon: ClipboardList,
    color: "brand-red",
    description: "Maintain complete breach documentation",
    actions: [
      "Complete comprehensive breach investigation report",
      "Document all notification activities",
      "Maintain records for minimum 6 years",
      "Update breach log with final disposition",
      "Submit annual breach report to HHS (if required)",
      "Archive all evidence and communications"
    ]
  },
  {
    step: 6,
    title: "Post-Incident Review",
    deadline: "Within 30 Days Post-Resolution",
    icon: CheckCircle,
    color: "brand-gold",
    description: "Analyze incident and implement improvements",
    actions: [
      "Conduct post-incident analysis meeting",
      "Identify root causes of the breach",
      "Evaluate effectiveness of response procedures",
      "Implement corrective actions and controls",
      "Update policies and procedures as needed",
      "Conduct additional workforce training if required"
    ]
  }
];

const severityLevels = [
  {
    level: "Critical",
    color: "bg-red-600",
    textColor: "text-red-600",
    borderColor: "border-red-600",
    description: "Large-scale breach affecting 500+ individuals with highly sensitive PHI",
    responseTime: "Immediate (within 1 hour)",
    escalation: "CEO, Privacy Officer, Legal Counsel, Board of Directors",
    examples: [
      "Ransomware attack with PHI exfiltration",
      "Mass data exposure on public internet",
      "Theft of backup media with unencrypted PHI"
    ]
  },
  {
    level: "High",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    borderColor: "border-orange-500",
    description: "Breach affecting 100-499 individuals or involving Social Security numbers",
    responseTime: "Within 4 hours",
    escalation: "Privacy Officer, Security Officer, Department Head",
    examples: [
      "Unauthorized access to EHR system",
      "Lost/stolen laptop with PHI",
      "Misdirected email with multiple patient records"
    ]
  },
  {
    level: "Medium",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
    description: "Breach affecting 10-99 individuals with limited PHI exposure",
    responseTime: "Within 8 hours",
    escalation: "Privacy Officer, Supervisor",
    examples: [
      "Improper disposal of paper records",
      "Unauthorized employee access to records",
      "Misdirected fax with patient information"
    ]
  },
  {
    level: "Low",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderColor: "border-blue-500",
    description: "Minor incident affecting fewer than 10 individuals with minimal PHI",
    responseTime: "Within 24 hours",
    escalation: "Privacy Officer",
    examples: [
      "Single misdirected email with limited PHI",
      "Verbal disclosure in semi-public area",
      "Brief unauthorized viewing of records"
    ]
  }
];

const keyContacts = [
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
    role: "Legal Counsel",
    name: "Healthcare Compliance Attorney",
    phone: "(562) 555-0102",
    email: "legal@navigatorusa.org",
    availability: "Business Hours + On-Call",
    primary: false
  },
  {
    role: "Executive Leadership",
    name: "Chief Executive Officer",
    phone: "(562) 555-0103",
    email: "ceo@navigatorusa.org",
    availability: "Critical Incidents Only",
    primary: false
  }
];

export default function BreachProcedures() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-navy to-brand-navy/95">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-red/20 text-brand-red px-4 py-2 rounded-full mb-4">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">HIPAA Breach Notification Procedures</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4" data-testid="text-page-title">
              Breach Response Protocol
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Internal reference guide for responding to potential breaches of protected health information (PHI) in compliance with 45 CFR §164.404 and HIPAA Breach Notification Rule.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Calendar className="w-4 h-4 text-brand-gold" />
                <span className="text-gray-300 text-sm">Effective Date: January 30, 2026</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-brand-red/20 px-4 py-2 rounded-lg">
                <Flag className="w-4 h-4 text-brand-red" />
                <span className="text-brand-red text-sm font-semibold">INTERNAL USE ONLY</span>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto space-y-8">
            <Card className="bg-brand-red/10 border-brand-red/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Scale className="w-8 h-8 text-brand-red" />
                  Regulatory Authority
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  These procedures are established pursuant to the HIPAA Breach Notification Rule (45 CFR §164.400-414) and applicable state breach notification laws. Navigator USA Corp is committed to protecting the privacy and security of all protected health information (PHI) and responding swiftly and appropriately to any breach incidents.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="font-semibold text-white mb-2">45 CFR §164.404</p>
                    <p className="text-gray-300 text-sm">
                      Notification to Individuals - Requires notification to affected individuals within 60 days of discovery
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="font-semibold text-white mb-2">45 CFR §164.406</p>
                    <p className="text-gray-300 text-sm">
                      Notification to Media - Required for breaches affecting 500+ residents of a State or jurisdiction
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="font-semibold text-white mb-2">45 CFR §164.408</p>
                    <p className="text-gray-300 text-sm">
                      Notification to HHS Secretary - Required for all breaches; timing depends on number affected
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="font-semibold text-white mb-2">NIST SP 800-61 Rev. 2</p>
                    <p className="text-gray-300 text-sm">
                      Computer Security Incident Handling Guide - Framework for incident response procedures
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Timer className="w-8 h-8 text-brand-red" />
                  Breach Response Workflow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300 leading-relaxed mb-6">
                  Follow these six steps in sequence when a potential breach of PHI is discovered. Time is critical - all deadlines are measured from the date of discovery.
                </p>

                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-red via-brand-gold to-brand-red hidden md:block" />
                  
                  <div className="space-y-8">
                    {timelineSteps.map((step, index) => (
                      <div key={step.step} className="relative" data-testid={`step-${step.step}`}>
                        <div className="flex gap-6">
                          <div className="relative z-10 flex-shrink-0">
                            <div className={`w-16 h-16 rounded-full bg-${step.color} flex items-center justify-center shadow-lg`}>
                              <step.icon className="w-8 h-8 text-white" />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-brand-navy font-bold text-xs px-2 py-0.5 rounded-full">
                              Step {step.step}
                            </div>
                          </div>
                          
                          <div className="flex-1 bg-white/5 rounded-xl p-6 border border-white/10">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                                <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                              </div>
                              <div className={`px-4 py-2 rounded-lg bg-${step.color}/20 border border-${step.color}/40`}>
                                <div className="flex items-center gap-2">
                                  <Clock className={`w-4 h-4 text-${step.color}`} />
                                  <span className={`font-bold text-${step.color}`}>{step.deadline}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-3">
                              {step.actions.map((action, actionIndex) => (
                                <div key={actionIndex} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-300 text-sm">{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {index < timelineSteps.length - 1 && (
                          <div className="flex justify-center my-4 md:hidden">
                            <ArrowRight className="w-6 h-6 text-brand-gold rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <AlertCircle className="w-8 h-8 text-brand-red" />
                  Breach Severity Levels and Response Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  Assess the severity of the breach to determine appropriate response level and escalation path.
                </p>

                <div className="space-y-6">
                  {severityLevels.map((severity) => (
                    <div 
                      key={severity.level} 
                      className={`border-l-4 ${severity.borderColor} bg-white/5 rounded-r-lg p-6`}
                      data-testid={`severity-${severity.level.toLowerCase()}`}
                    >
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className={`${severity.color} text-white px-4 py-1 rounded-full font-bold uppercase tracking-wider text-sm`}>
                          {severity.level}
                        </span>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Response Time: <span className="text-white font-medium">{severity.responseTime}</span></span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4">{severity.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-brand-gold mb-2">Escalation Path</p>
                          <p className="text-gray-300 text-sm">{severity.escalation}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-brand-gold mb-2">Example Scenarios</p>
                          <ul className="text-gray-300 text-sm space-y-1">
                            {severity.examples.map((example, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className={`${severity.textColor}`}>•</span>
                                {example}
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

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Users className="w-8 h-8 text-brand-red" />
                  Key Contacts and Escalation Procedures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  Contact the following personnel immediately when a breach is suspected or confirmed. For after-hours emergencies, use the 24/7 emergency lines.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {keyContacts.map((contact) => (
                    <div 
                      key={contact.role} 
                      className={`bg-white/5 rounded-lg p-5 border ${contact.primary ? 'border-brand-red/50' : 'border-white/10'}`}
                      data-testid={`contact-${contact.role.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {contact.primary && (
                        <div className="mb-3">
                          <span className="bg-brand-red/20 text-brand-red text-xs font-bold px-2 py-1 rounded-full uppercase">
                            Primary Contact
                          </span>
                        </div>
                      )}
                      <h4 className="text-lg font-bold text-white mb-1">{contact.role}</h4>
                      <p className="text-gray-400 text-sm mb-3">{contact.name}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-brand-gold" />
                          <span className="text-gray-300">{contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-brand-gold" />
                          <span className="text-gray-300">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-brand-gold" />
                          <span className="text-gray-300 text-sm">{contact.availability}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-brand-red/10 border border-brand-red/30 rounded-lg p-5">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-brand-red" />
                    Emergency Escalation Protocol
                  </h4>
                  <ol className="text-gray-300 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="bg-brand-red text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                      Contact Privacy Officer immediately upon discovery of suspected breach
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-brand-red text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                      If Privacy Officer unavailable within 15 minutes, contact Security Officer
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-brand-red text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                      For Critical severity breaches, simultaneously notify Legal Counsel and CEO
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-brand-red text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                      Document all contact attempts and responses in the breach log
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Building className="w-8 h-8 text-brand-red" />
                  Regulatory Notification Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  The following regulatory bodies must be notified based on breach scope and applicable jurisdiction requirements.
                </p>

                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-brand-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building className="w-6 h-6 text-brand-red" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-2">U.S. Department of Health and Human Services (HHS)</h4>
                        <div className="space-y-3">
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-sm font-semibold text-brand-gold">Breaches affecting 500+ individuals</p>
                            <p className="text-gray-300 text-sm mt-1">
                              Notify HHS Secretary within 60 days of discovery via the HHS Breach Portal. Must include breach description, types of PHI involved, and mitigation steps.
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-sm font-semibold text-brand-gold">Breaches affecting fewer than 500 individuals</p>
                            <p className="text-gray-300 text-sm mt-1">
                              Log the breach and report annually to HHS within 60 days after the end of the calendar year in which the breach was discovered.
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <ExternalLink className="w-4 h-4 text-brand-red" />
                            <a 
                              href="https://ocrportal.hhs.gov/ocr/breach/wizard_breach.jsf" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-brand-red hover:text-white underline text-sm"
                            >
                              HHS Breach Notification Portal
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Scale className="w-6 h-6 text-brand-gold" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-2">State Attorneys General</h4>
                        <p className="text-gray-300 text-sm mb-3">
                          Many states require notification to the State Attorney General for breaches affecting their residents. Requirements vary by state.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-sm font-semibold text-white">California (CCPA)</p>
                            <p className="text-gray-400 text-sm">Notify AG for breaches affecting 500+ CA residents</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-sm font-semibold text-white">Texas</p>
                            <p className="text-gray-400 text-sm">Notify AG within 60 days for breaches affecting 250+ TX residents</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-sm font-semibold text-white">New York (SHIELD Act)</p>
                            <p className="text-gray-400 text-sm">Notify AG immediately for any breach affecting NY residents</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-sm font-semibold text-white">Other States</p>
                            <p className="text-gray-400 text-sm">Consult Legal Counsel for state-specific requirements</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-brand-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bell className="w-6 h-6 text-brand-red" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-2">Media Notification (500+ in a State)</h4>
                        <p className="text-gray-300 text-sm mb-3">
                          Per 45 CFR §164.406, if a breach affects more than 500 residents of a single State or jurisdiction, prominent media outlets serving that State must be notified within 60 days of discovery.
                        </p>
                        <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-lg p-3">
                          <p className="text-gray-300 text-sm">
                            <strong className="text-brand-gold">Important:</strong> Media notification must occur simultaneously with individual notifications and HHS notification. Coordinate with Legal Counsel and Communications team before release.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Clock className="w-8 h-8 text-brand-red" />
                  Timeline Requirements Visual Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  All deadlines are calculated from the date of breach discovery (the first day the breach is known or should reasonably have been known).
                </p>

                <div className="relative overflow-x-auto">
                  <div className="min-w-[600px]">
                    <div className="relative h-24 bg-white/5 rounded-xl">
                      <div className="absolute inset-0 flex">
                        <div className="flex-1 border-r border-white/10 flex flex-col items-center justify-center">
                          <div className="w-4 h-4 bg-brand-red rounded-full mb-2" />
                          <span className="text-white font-bold text-sm">24 hrs</span>
                          <span className="text-gray-400 text-xs">Discovery</span>
                        </div>
                        <div className="flex-1 border-r border-white/10 flex flex-col items-center justify-center">
                          <div className="w-4 h-4 bg-brand-gold rounded-full mb-2" />
                          <span className="text-white font-bold text-sm">48 hrs</span>
                          <span className="text-gray-400 text-xs">Containment</span>
                        </div>
                        <div className="flex-1 border-r border-white/10 flex flex-col items-center justify-center">
                          <div className="w-4 h-4 bg-brand-red rounded-full mb-2" />
                          <span className="text-white font-bold text-sm">72 hrs</span>
                          <span className="text-gray-400 text-xs">Risk Assessment</span>
                        </div>
                        <div className="flex-1 border-r border-white/10 flex flex-col items-center justify-center">
                          <div className="w-4 h-4 bg-brand-gold rounded-full mb-2" />
                          <span className="text-white font-bold text-sm">60 days</span>
                          <span className="text-gray-400 text-xs">Notifications</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full mb-2" />
                          <span className="text-white font-bold text-sm">6 years</span>
                          <span className="text-gray-400 text-xs">Retain Records</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex mt-4">
                      <div className="flex-1 text-center">
                        <div className="bg-brand-red/20 text-brand-red text-xs font-bold px-2 py-1 rounded inline-block">
                          URGENT
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="bg-brand-gold/20 text-brand-gold text-xs font-bold px-2 py-1 rounded inline-block">
                          CRITICAL
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="bg-brand-red/20 text-brand-red text-xs font-bold px-2 py-1 rounded inline-block">
                          REQUIRED
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="bg-brand-gold/20 text-brand-gold text-xs font-bold px-2 py-1 rounded inline-block">
                          LEGAL DEADLINE
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="bg-green-500/20 text-green-500 text-xs font-bold px-2 py-1 rounded inline-block">
                          RETENTION
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-red/10 border border-brand-red/30 rounded-lg p-5 mt-6">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-brand-red" />
                    Critical Reminder
                  </h4>
                  <p className="text-gray-300 text-sm">
                    The 60-day notification deadline is a maximum timeframe. Notifications should be made without unreasonable delay. For breaches involving highly sensitive information or posing significant risk of harm, expedited notification is strongly recommended. Failure to comply with notification requirements may result in civil monetary penalties of up to $1.5 million per violation category.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FileText className="w-8 h-8 text-brand-red" />
                  Required Notification Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Per 45 CFR §164.404(c), individual notification letters must include the following elements:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Breach Description</p>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Brief description of what happened, including dates of the breach and discovery
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Types of PHI Involved</p>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Description of the types of unsecured PHI involved (e.g., names, SSN, medical records)
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Steps to Protect</p>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Steps individuals should take to protect themselves from potential harm
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Our Response</p>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Brief description of what we are doing to investigate, mitigate harm, and prevent future breaches
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-brand-gold" />
                      <p className="font-semibold text-white">Contact Information</p>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Contact procedures for individuals to ask questions, including a toll-free telephone number, email address, website, or postal address
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-red/10 border-brand-red/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Shield className="w-8 h-8 text-brand-red" />
                  Document Version Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Document Version</p>
                    <p className="text-white font-bold text-lg">2.0</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Last Updated</p>
                    <p className="text-white font-bold text-lg">January 30, 2026</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Next Review Date</p>
                    <p className="text-white font-bold text-lg">January 30, 2027</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  This document is reviewed and updated annually or when significant changes occur in HIPAA regulations or organizational procedures. All personnel with breach response responsibilities must review this document annually and acknowledge understanding.
                </p>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>Questions about these procedures? Contact: <a href="mailto:privacy@navigatorusa.org" className="text-brand-red hover:text-white">privacy@navigatorusa.org</a></span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
