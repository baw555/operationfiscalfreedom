import { useState } from "react";
import { Layout } from "@/components/layout";
import { 
  Shield, Heart, Briefcase, TrendingUp, Users, Building2, 
  FileText, Clock, DollarSign, CheckCircle, ChevronRight,
  Stethoscope, UserCheck, Home, GraduationCap, Target, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type ServiceCategory = "planning" | "disability" | "business" | "future" | "group" | "individual";

interface Service {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  benefits: string[];
  idealFor: string[];
  icon: React.ReactNode;
}

const PLANNING_SOLUTIONS: Service[] = [
  {
    id: "long-term-care",
    name: "Long Term Care Planning",
    shortDesc: "Protect your assets and ensure quality care for the future",
    fullDesc: "Long-term care insurance provides income replacement and asset protection when you need extended care due to illness, disability, or aging. With nursing home costs averaging $120K+/year and only 3% of Americans 50+ having coverage, planning now is essential.",
    features: [
      "Traditional standalone LTC policies with tax-deductible premiums",
      "Hybrid Life + LTC policies with fixed premiums and death benefits",
      "Chronic illness riders for existing life insurance",
      "Cash indemnity options - no receipts needed",
      "2-5% compound inflation protection",
      "90-day retroactive benefits"
    ],
    benefits: [
      "Protect savings and assets from catastrophic care costs",
      "Choose your preferred care settings (home, facility, assisted living)",
      "Maintain family financial independence",
      "Tax-advantaged premium deductions up to $6,020/year (age 71+)",
      "Peace of mind for you and your family"
    ],
    idealFor: [
      "Adults ages 50-65 planning for retirement",
      "Those with net worth $500K-$5M",
      "Anyone wanting to protect family inheritance",
      "Veterans planning for long-term healthcare needs"
    ],
    icon: <Heart className="w-8 h-8" />
  },
  {
    id: "malpractice",
    name: "Malpractice Insurance",
    shortDesc: "Professional liability protection for healthcare providers",
    fullDesc: "Medical malpractice insurance protects healthcare professionals from claims of negligence, errors, or omissions in patient care. Coverage includes legal defense costs, settlements, and judgments.",
    features: [
      "Occurrence-based vs. claims-made policy options",
      "Tail coverage for retired practitioners",
      "Defense costs outside policy limits",
      "Consent-to-settle clauses",
      "Coverage for telemedicine and virtual care",
      "Multi-state licensing protection"
    ],
    benefits: [
      "Financial protection from lawsuit costs",
      "Access to experienced medical defense attorneys",
      "Protection of personal assets",
      "License defense coverage",
      "Peace of mind to practice confidently"
    ],
    idealFor: [
      "Physicians and surgeons",
      "Nurses and nurse practitioners",
      "Allied health professionals",
      "Healthcare facilities and clinics"
    ],
    icon: <Stethoscope className="w-8 h-8" />
  },
  {
    id: "risk-mitigation",
    name: "Risk Mitigation",
    shortDesc: "Comprehensive strategies to identify and minimize business risks",
    fullDesc: "Risk mitigation planning identifies potential threats to your business or personal finances and implements strategies to reduce exposure. This includes liability protection, asset protection, and contingency planning.",
    features: [
      "Comprehensive risk assessment and audit",
      "Liability gap analysis",
      "Asset protection structuring",
      "Business continuity planning",
      "Insurance portfolio optimization",
      "Regulatory compliance review"
    ],
    benefits: [
      "Reduce exposure to lawsuits and claims",
      "Protect business and personal assets",
      "Lower insurance premiums through risk reduction",
      "Ensure business continuity during disruptions",
      "Comply with industry regulations"
    ],
    idealFor: [
      "Business owners and entrepreneurs",
      "High-net-worth individuals",
      "Healthcare practice owners",
      "Real estate investors"
    ],
    icon: <Shield className="w-8 h-8" />
  }
];

const DISABILITY_SOLUTIONS: Service[] = [
  {
    id: "physician-disability",
    name: "Physician Disability Insurance",
    shortDesc: "True own-occupation coverage protecting your medical specialty",
    fullDesc: "Specialty-specific disability insurance for physicians provides income protection if you become unable to practice your medical specialty. True own-occupation coverage pays full benefits even if you work in another occupation.",
    features: [
      "True own-occupation definition (gold standard)",
      "Non-cancelable and guaranteed renewable to age 65-70",
      "Benefits up to $15,000/month",
      "Student loan protection rider ($150K-$250K lump sum)",
      "Residual/partial disability coverage",
      "Future purchase option without medical underwriting",
      "Cost of living adjustment (COLA) rider",
      "Catastrophic disability rider",
      "Recovery benefit for returning to practice"
    ],
    benefits: [
      "Protect income tied to your specific specialty",
      "Locked-in premiums that can't increase",
      "Coverage continues even if you work in another field",
      "Student loan debt protection",
      "Tax-free benefits if you pay premiums personally"
    ],
    idealFor: [
      "Surgeons (orthopedic, neurosurgery, cardiothoracic)",
      "Physicians with high student loan debt",
      "Medical residents and fellows",
      "Specialists with high-income potential"
    ],
    icon: <Stethoscope className="w-8 h-8" />
  },
  {
    id: "group-disability",
    name: "Group Disability Insurance",
    shortDesc: "Employee income protection with employer-sponsored coverage",
    fullDesc: "Group disability insurance provides income replacement for employees unable to work due to illness or injury. Policies typically replace up to 60% of pre-disability income and offer both short-term and long-term options.",
    features: [
      "Short-term disability (STD): 3-12 months coverage",
      "Long-term disability (LTD): Benefits to age 65",
      "60% income replacement (up to $10,000/month cap)",
      "Guaranteed issue - no medical underwriting",
      "Work incentive and rehabilitation programs",
      "Reasonable accommodation benefits",
      "Premium waiver while receiving benefits",
      "Critical illness coverage bundling"
    ],
    benefits: [
      "Lower premiums than individual policies",
      "No medical exam required for employees",
      "Employer can share or cover full premium cost",
      "Comprehensive STD + LTD protection",
      "Mental health coverage included"
    ],
    idealFor: [
      "Employers of any size",
      "Companies looking to attract/retain talent",
      "Businesses in high-risk industries",
      "Organizations wanting comprehensive benefits packages"
    ],
    icon: <Users className="w-8 h-8" />
  }
];

const BUSINESS_SOLUTIONS: Service[] = [
  {
    id: "custom-benefits",
    name: "Custom Benefits Packages",
    shortDesc: "Tailored employee benefits that attract and retain top talent",
    fullDesc: "Custom employee benefits packages combine health insurance, retirement plans, wellness programs, and voluntary benefits tailored to your workforce demographics and budget. 70% of workers are willing to change jobs for better perks.",
    features: [
      "Health, dental, and vision insurance bundles",
      "401(k) and retirement plan options",
      "Flexible spending accounts (FSA/HSA)",
      "Telehealth and mental health services",
      "Student loan assistance programs",
      "Financial wellness counseling",
      "Flexible work arrangements",
      "Professional development stipends"
    ],
    benefits: [
      "Compete with larger companies for talent",
      "Reduce turnover costs (benefits account for 30% of total compensation)",
      "Increase employee productivity and morale",
      "Tax advantages for employer contributions",
      "Strengthen your employer brand"
    ],
    idealFor: [
      "Small to mid-size businesses",
      "Startups scaling their workforce",
      "Companies in competitive hiring markets",
      "Businesses wanting to improve retention"
    ],
    icon: <Users className="w-8 h-8" />
  },
  {
    id: "key-person",
    name: "Key Person Insurance",
    shortDesc: "Protect your business from the loss of critical team members",
    fullDesc: "Key person insurance compensates your business for financial losses when a critical employee, executive, or owner dies or becomes disabled. Coverage helps recruit replacements, cover lost revenue, and maintain business continuity.",
    features: [
      "Life and/or disability coverage options",
      "Term (10-30 years) or permanent policy structures",
      "Coverage typically 5-10x annual salary",
      "Cash value accumulation with permanent policies",
      "Can serve as loan collateral for SBA financing",
      "Buy-sell agreement funding"
    ],
    benefits: [
      "Financial cushion during transition periods",
      "Fund recruitment and training of replacements",
      "Pay off business debts if needed",
      "Maintain investor and lender confidence",
      "Tax-free death benefit to the business"
    ],
    idealFor: [
      "Businesses with irreplaceable employees",
      "Companies with key salespeople or executives",
      "Partnerships and closely-held businesses",
      "Businesses with outstanding loans"
    ],
    icon: <UserCheck className="w-8 h-8" />
  },
  {
    id: "business-overhead",
    name: "Business Overhead Expense",
    shortDesc: "Keep your business running while you recover from disability",
    fullDesc: "Business Overhead Expense (BOE) insurance reimburses fixed business expenses if the owner becomes disabled and cannot work. This keeps the business doors open during recovery, covering rent, employee salaries, utilities, and more.",
    features: [
      "Monthly benefits from $1,000-$25,000",
      "12-24 month benefit periods",
      "30-90 day elimination periods",
      "Covers rent, utilities, employee salaries (not owner's)",
      "Equipment leases and insurance premiums",
      "Accounting and legal fees",
      "Substitute salary rider available",
      "Tax-deductible premiums"
    ],
    benefits: [
      "Maintain business operations during disability",
      "Protect employee jobs and client relationships",
      "Preserve business value and reputation",
      "Avoid forced sale of business assets",
      "Return to a functional business after recovery"
    ],
    idealFor: [
      "Solo practitioners and small business owners",
      "Physicians, dentists, and attorneys",
      "Consultants and professional service providers",
      "Any owner whose personal involvement drives revenue"
    ],
    icon: <Building2 className="w-8 h-8" />
  },
  {
    id: "employee-education",
    name: "Employee Education Programs",
    shortDesc: "Financial literacy and benefits education for your workforce",
    fullDesc: "Employee education programs help your team understand and maximize their benefits while building financial literacy. Educated employees make better decisions about retirement, healthcare, and insurance options.",
    features: [
      "Benefits enrollment education sessions",
      "Retirement planning workshops",
      "Financial wellness seminars",
      "One-on-one employee consultations",
      "Digital learning resources",
      "Ongoing education throughout the year"
    ],
    benefits: [
      "Higher benefits participation rates",
      "Reduced HR burden for benefits questions",
      "Improved employee financial wellness",
      "Better retirement preparedness",
      "Enhanced appreciation of total compensation"
    ],
    idealFor: [
      "Companies implementing new benefits",
      "Organizations with low benefits enrollment",
      "Employers with diverse workforces",
      "Businesses wanting to maximize benefits ROI"
    ],
    icon: <GraduationCap className="w-8 h-8" />
  }
];

const FUTURE_SOLUTIONS: Service[] = [
  {
    id: "life-insurance-review",
    name: "Life Insurance Review",
    shortDesc: "Annual policy audit to optimize coverage and performance",
    fullDesc: "A comprehensive life insurance review examines your existing policies for coverage gaps, performance issues, and optimization opportunities. Over 65% of policy audits reveal improvement opportunities - outdated beneficiaries, underfunding, or better alternatives.",
    features: [
      "Complete policy inventory and analysis",
      "Beneficiary designation verification",
      "Cash value and performance review",
      "Insurance company financial health check",
      "Premium optimization analysis",
      "Tax-free 1035 exchange evaluation",
      "Coverage gap identification",
      "Fiduciary compliance review"
    ],
    benefits: [
      "Ensure policies perform as intended",
      "Avoid policy lapses from underfunding",
      "Update beneficiaries after life changes",
      "Potentially reduce premiums or increase coverage",
      "Align coverage with current goals"
    ],
    idealFor: [
      "Anyone with policies over 5 years old",
      "Those who've had major life events",
      "Trustees managing insurance in trusts",
      "High-net-worth individuals with complex needs"
    ],
    icon: <FileText className="w-8 h-8" />
  },
  {
    id: "retirement-planning",
    name: "Retirement Planning",
    shortDesc: "401(k), IRA, and pension strategies for financial independence",
    fullDesc: "Retirement planning for small business owners includes 401(k) setup, profit-sharing, defined benefit plans, and IRA strategies. 2025 offers enhanced tax credits covering 100% of startup costs and increased contribution limits.",
    features: [
      "Solo 401(k) for self-employed ($23,500 + employer contributions)",
      "Safe Harbor 401(k) to skip nondiscrimination testing",
      "SIMPLE 401(k) for businesses under 100 employees",
      "Roth 401(k) for tax-free retirement income",
      "Profit-sharing up to 25% of compensation",
      "Defined benefit plans for high-income owners",
      "SECURE 2.0 tax credits (up to $5,000/year for 3 years)",
      "Age 60-63 enhanced catch-up contributions ($11,250)"
    ],
    benefits: [
      "Tax deductions on employer contributions",
      "Attract and retain quality employees",
      "Maximize personal retirement savings",
      "Tax credits offset 100% of plan startup costs",
      "Build wealth with tax-deferred growth"
    ],
    idealFor: [
      "Small business owners",
      "Self-employed professionals",
      "High-income earners wanting maximum contributions",
      "Employers looking to offer competitive benefits"
    ],
    icon: <TrendingUp className="w-8 h-8" />
  },
  {
    id: "estate-planning",
    name: "Estate Planning",
    shortDesc: "Protect and transfer wealth to future generations",
    fullDesc: "Estate planning ensures your assets transfer to heirs efficiently while minimizing taxes. With the 2025 federal estate tax exemption at $13.99 million, strategic planning can protect your legacy and provide for your family.",
    features: [
      "Revocable and irrevocable trust structures",
      "Life insurance trusts (ILIT) to exclude proceeds from estate",
      "Grantor retained trusts (GRAT/GRUT)",
      "Family limited partnerships for discounted transfers",
      "Annual gifting strategies ($19,000/recipient in 2025)",
      "Powers of attorney and healthcare directives",
      "Charitable giving strategies",
      "Generation-skipping trust planning"
    ],
    benefits: [
      "Minimize or eliminate estate taxes",
      "Avoid probate delays and costs",
      "Protect assets from creditors and lawsuits",
      "Ensure wishes are followed if incapacitated",
      "Provide for family members with special needs"
    ],
    idealFor: [
      "High-net-worth individuals and families",
      "Business owners planning transitions",
      "Those with complex family situations",
      "Anyone wanting to protect their legacy"
    ],
    icon: <Home className="w-8 h-8" />
  },
  {
    id: "succession-planning",
    name: "Succession Planning",
    shortDesc: "Ensure smooth business transition to the next generation",
    fullDesc: "Succession planning prepares your business for ownership transfer to family, key employees, or outside buyers. Only 30% of businesses have formal plans - without one, unexpected events can destroy years of value-building.",
    features: [
      "Business valuation and KPI assessment",
      "Successor identification and development",
      "Buy-sell agreement drafting and funding",
      "Tax-efficient transfer strategies",
      "Life insurance for estate equalization",
      "Management transition planning",
      "ESOP and management buyout structures",
      "Family governance frameworks"
    ],
    benefits: [
      "Maximize business value at transition",
      "Minimize tax impact of ownership transfer",
      "Ensure business continuity",
      "Protect family relationships",
      "Maintain investor and lender confidence"
    ],
    idealFor: [
      "Business owners planning retirement in 5-15 years",
      "Family businesses with multiple heirs",
      "Partnerships and closely-held corporations",
      "Business owners wanting to preserve their legacy"
    ],
    icon: <Target className="w-8 h-8" />
  }
];

const GROUP_INSURANCE: Service[] = [
  {
    id: "group-disability-insurance",
    name: "Group Disability Insurance",
    shortDesc: "Employer-sponsored income protection for your entire team",
    fullDesc: "Group disability insurance provides comprehensive income replacement for employees, combining short-term and long-term coverage. Lower group rates and guaranteed issue make this an affordable benefit that attracts top talent.",
    features: [
      "Combined STD + LTD packages",
      "60% income replacement up to $10,000/month",
      "No individual medical underwriting",
      "Portability options for departing employees",
      "Work incentive programs",
      "Mental health and rehabilitation support"
    ],
    benefits: [
      "Competitive advantage in hiring",
      "Lower per-employee costs than individual policies",
      "Simple enrollment process",
      "Comprehensive employee protection",
      "Tax-advantaged premium structures"
    ],
    idealFor: [
      "Employers seeking competitive benefits",
      "Companies with physical labor demands",
      "Organizations prioritizing employee wellness",
      "Businesses of all sizes"
    ],
    icon: <Users className="w-8 h-8" />
  },
  {
    id: "employee-benefits",
    name: "Employee Benefits Packages",
    shortDesc: "Comprehensive benefits solutions for workforce attraction and retention",
    fullDesc: "Modern employee benefits packages go beyond traditional health insurance to include wellness programs, financial education, flexible work options, and voluntary benefits. 82% of employees say benefits influence their job acceptance decisions.",
    features: [
      "Medical, dental, and vision insurance",
      "Life and AD&D coverage",
      "Short and long-term disability",
      "401(k) with employer matching",
      "Health savings accounts (HSA)",
      "Employee assistance programs (EAP)",
      "Voluntary benefits (legal, identity theft, pet insurance)"
    ],
    benefits: [
      "Reduce turnover and replacement costs",
      "Boost productivity and engagement",
      "Tax savings for employers",
      "Strengthen company culture",
      "Compete for top talent"
    ],
    idealFor: [
      "Growing businesses",
      "Companies facing high turnover",
      "Employers in competitive markets",
      "Organizations valuing employee wellness"
    ],
    icon: <Briefcase className="w-8 h-8" />
  }
];

const INDIVIDUAL_INSURANCE: Service[] = [
  {
    id: "life-insurance-review-individual",
    name: "Life Insurance Review",
    shortDesc: "Comprehensive audit of existing policies and coverage needs",
    fullDesc: "An annual life insurance policy review ensures your coverage aligns with current needs, beneficiaries are updated, and policies are performing as expected. Over 65% of reviews identify opportunities to improve coverage or reduce costs.",
    features: [
      "Full policy inventory analysis",
      "Performance and projection review",
      "Beneficiary verification",
      "Carrier financial health assessment",
      "Premium optimization",
      "1035 exchange evaluation"
    ],
    benefits: [
      "Catch underfunded policies before they lapse",
      "Update coverage after major life events",
      "Optimize premiums and death benefits",
      "Ensure policy aligns with current estate plan",
      "Peace of mind knowing coverage is adequate"
    ],
    idealFor: [
      "Policy owners who haven't reviewed in 3+ years",
      "Those with life changes (marriage, divorce, children)",
      "High-net-worth individuals",
      "Trust owners with life insurance assets"
    ],
    icon: <FileText className="w-8 h-8" />
  },
  {
    id: "professional-disability",
    name: "Professional Disability Insurance",
    shortDesc: "Specialty-specific income protection for professionals",
    fullDesc: "Professional disability insurance protects high-earning specialists with true own-occupation coverage. Unlike group coverage, individual policies are portable, non-cancelable, and offer higher benefit limits tailored to your specific profession.",
    features: [
      "True own-occupation definition",
      "Non-cancelable premiums locked to age 65-70",
      "Monthly benefits up to $15,000+",
      "Residual/partial disability coverage",
      "Future increase options",
      "Student loan protection riders",
      "Cost of living adjustments"
    ],
    benefits: [
      "Protect income specific to your profession",
      "Portable coverage you own personally",
      "Tax-free benefits",
      "Customizable to your specific needs",
      "Supplement inadequate group coverage"
    ],
    idealFor: [
      "Physicians and surgeons",
      "Dentists and orthodontists",
      "Attorneys and CPAs",
      "High-earning professionals with specialized skills"
    ],
    icon: <Stethoscope className="w-8 h-8" />
  },
  {
    id: "long-term-care-individual",
    name: "Long Term Care Planning",
    shortDesc: "Protect your assets from extended care costs",
    fullDesc: "Long-term care insurance provides financial protection against nursing home, assisted living, and home care costs. With 56% of those over 65 needing long-term care and costs exceeding $120K/year, planning is essential.",
    features: [
      "Traditional LTC and hybrid life/LTC options",
      "Home care, facility, and assisted living coverage",
      "Inflation protection (2-5% compound)",
      "Cash indemnity payment options",
      "Tax-deductible premiums (up to $6,020 for 71+)",
      "Couples' discounts"
    ],
    benefits: [
      "Protect retirement savings from care costs",
      "Choose your preferred care settings",
      "Maintain family financial independence",
      "Tax advantages on premiums and benefits",
      "Hybrid policies provide death benefit if unused"
    ],
    idealFor: [
      "Adults ages 50-65",
      "Those with $500K-$5M net worth",
      "Individuals wanting to protect inheritance",
      "Anyone planning for retirement healthcare"
    ],
    icon: <Heart className="w-8 h-8" />
  }
];

const categoryInfo: Record<ServiceCategory, { title: string; description: string; services: Service[] }> = {
  planning: {
    title: "Planning Solutions",
    description: "Comprehensive risk management and protection strategies for your health and assets",
    services: PLANNING_SOLUTIONS
  },
  disability: {
    title: "Disability Solutions",
    description: "Income protection for medical professionals and employees",
    services: DISABILITY_SOLUTIONS
  },
  business: {
    title: "Business Solutions",
    description: "Protect your business, key people, and employees with comprehensive coverage",
    services: BUSINESS_SOLUTIONS
  },
  future: {
    title: "Future Solutions",
    description: "Plan for retirement, estate transfer, and long-term financial security",
    services: FUTURE_SOLUTIONS
  },
  group: {
    title: "Group Insurance Solutions",
    description: "Employer-sponsored coverage that attracts and retains top talent",
    services: GROUP_INSURANCE
  },
  individual: {
    title: "Individual Insurance Solutions",
    description: "Personal protection tailored to your profession and lifestyle",
    services: INDIVIDUAL_INSURANCE
  }
};

export default function PlanningSolutions() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("planning");
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const categories: { id: ServiceCategory; label: string; icon: React.ReactNode }[] = [
    { id: "planning", label: "Planning Solutions", icon: <Shield className="w-5 h-5" /> },
    { id: "disability", label: "Disability Solutions", icon: <Heart className="w-5 h-5" /> },
    { id: "business", label: "Business Solutions", icon: <Briefcase className="w-5 h-5" /> },
    { id: "future", label: "Future Solutions", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "group", label: "Group Insurance", icon: <Users className="w-5 h-5" /> },
    { id: "individual", label: "Individual Insurance", icon: <UserCheck className="w-5 h-5" /> }
  ];

  const currentCategory = categoryInfo[activeCategory];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Navigator Elite Services
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" data-testid="text-page-title">
              Financial Planning & Insurance Solutions
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive protection for veterans, professionals, and business owners. 
              Expert guidance on disability, life insurance, retirement, and business continuity.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setExpandedService(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-amber-500 text-slate-900"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
                data-testid={`button-category-${cat.id}`}
              >
                {cat.icon}
                <span className="hidden md:inline">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-black/20 rounded-xl border border-white/10 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{currentCategory.title}</h2>
            <p className="text-gray-400">{currentCategory.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {currentCategory.services.map((service) => (
              <div
                key={service.id}
                className="bg-black/30 rounded-xl border border-white/10 overflow-hidden hover:border-amber-500/30 transition-colors"
                data-testid={`card-service-${service.id}`}
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{service.name}</h3>
                        <p className="text-gray-400">{service.shortDesc}</p>
                      </div>
                    </div>
                    <ChevronRight 
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        expandedService === service.id ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>

                {expandedService === service.id && (
                  <div className="px-6 pb-6 border-t border-white/10 pt-6">
                    <p className="text-gray-300 mb-6">{service.fullDesc}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Key Features
                        </h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Benefits
                        </h4>
                        <ul className="space-y-2">
                          {service.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Ideal For
                        </h4>
                        <ul className="space-y-2">
                          {service.idealFor.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href="/help">
                        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
                          Request Consultation
                        </Button>
                      </Link>
                      <Link href="/schedule-a">
                        <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                          View Commission Structure
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/30 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Ready to Protect Your Future?</h3>
                <p className="text-gray-300">
                  Connect with a NavigatorUSA specialist for personalized guidance on the right solutions for you.
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/help">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6">
                    Get Started
                  </Button>
                </Link>
                <Link href="/become-affiliate">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Become an Affiliate
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
