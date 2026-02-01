import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TCPAConsent } from "@/components/tcpa-consent";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, CheckCircle, Users, Building2, Briefcase, DollarSign, Heart, Car, Home, FileText,
  ChevronRight, TrendingUp, Star
} from "lucide-react";
import { useScrollToTopOnChange } from "@/hooks/use-scroll-to-top";
import { Link } from "wouter";

type ServiceCategory = "planning" | "disability" | "business" | "future";

interface Service {
  id: string;
  name: string;
  shortDesc: string;
  features: string[];
  benefits: string[];
}

const PLANNING_SOLUTIONS: Service[] = [
  {
    id: "long-term-care",
    name: "Long Term Care Planning",
    shortDesc: "Protect your assets and ensure quality care for the future with nursing home costs averaging $120K+/year",
    features: [
      "Traditional standalone LTC with tax-deductible premiums",
      "Hybrid Life + LTC policies with fixed premiums",
      "Cash indemnity options - no receipts needed",
      "2-5% compound inflation protection",
      "90-day retroactive benefits"
    ],
    benefits: [
      "Protect savings from catastrophic care costs",
      "Choose your preferred care settings",
      "Tax-advantaged premium deductions up to $6,020/year",
      "Peace of mind for you and your family"
    ]
  },
  {
    id: "malpractice",
    name: "Malpractice Insurance",
    shortDesc: "Professional liability protection for healthcare providers with comprehensive coverage options",
    features: [
      "Occurrence-based vs. claims-made policies",
      "Tail coverage for retired practitioners",
      "Defense costs outside policy limits",
      "Telemedicine and virtual care coverage",
      "Multi-state licensing protection"
    ],
    benefits: [
      "Financial protection from lawsuit costs",
      "Access to experienced medical defense attorneys",
      "Protection of personal assets",
      "License defense coverage"
    ]
  },
  {
    id: "risk-mitigation",
    name: "Risk Mitigation",
    shortDesc: "Comprehensive strategies to identify and minimize business and personal financial risks",
    features: [
      "Comprehensive risk assessment and audit",
      "Liability gap analysis",
      "Asset protection structuring",
      "Business continuity planning",
      "Insurance portfolio optimization"
    ],
    benefits: [
      "Reduce exposure to lawsuits",
      "Protect business and personal assets",
      "Lower insurance premiums",
      "Ensure business continuity"
    ]
  }
];

const DISABILITY_SOLUTIONS: Service[] = [
  {
    id: "physician-disability",
    name: "Physician Disability Insurance",
    shortDesc: "True own-occupation coverage protecting your medical specialty with benefits up to $15,000/month",
    features: [
      "True own-occupation definition (gold standard)",
      "Non-cancelable and guaranteed renewable to age 65-70",
      "Student loan protection rider ($150K-$250K lump sum)",
      "Residual/partial disability coverage",
      "Cost of living adjustment (COLA) rider",
      "Recovery benefit for returning to practice"
    ],
    benefits: [
      "Protect income tied to your specific specialty",
      "Locked-in premiums that can't increase",
      "Coverage continues even if you work in another field",
      "Tax-free benefits when you pay premiums personally"
    ]
  },
  {
    id: "group-disability",
    name: "Group Disability Insurance",
    shortDesc: "Employee income protection with 60% replacement up to $10,000/month at group rates",
    features: [
      "Short-term (3-12 months) and long-term (to age 65) coverage",
      "60% income replacement with monthly caps",
      "Guaranteed issue - no medical underwriting",
      "Work incentive and rehabilitation programs",
      "Mental health coverage included",
      "Critical illness coverage bundling"
    ],
    benefits: [
      "Lower premiums than individual policies",
      "No medical exam required for employees",
      "Comprehensive STD + LTD protection",
      "Attract and retain top talent"
    ]
  }
];

const BUSINESS_SOLUTIONS: Service[] = [
  {
    id: "custom-benefits",
    name: "Custom Benefits Packages",
    shortDesc: "Tailored employee benefits that attract and retain top talent - 70% of workers change jobs for better perks",
    features: [
      "Health, dental, and vision insurance bundles",
      "401(k) and retirement plan options",
      "Flexible spending accounts (FSA/HSA)",
      "Telehealth and mental health services",
      "Student loan assistance programs",
      "Financial wellness counseling"
    ],
    benefits: [
      "Compete with larger companies for talent",
      "Reduce turnover costs",
      "Tax advantages for employer contributions",
      "Strengthen your employer brand"
    ]
  },
  {
    id: "key-person",
    name: "Key Person Insurance",
    shortDesc: "Protect your business from the loss of critical team members with 5-10x salary coverage",
    features: [
      "Life and/or disability coverage options",
      "Term (10-30 years) or permanent policy structures",
      "Can serve as SBA loan collateral",
      "Buy-sell agreement funding",
      "Cash value accumulation with permanent policies"
    ],
    benefits: [
      "Financial cushion during transition periods",
      "Fund recruitment and training of replacements",
      "Pay off business debts if needed",
      "Tax-free death benefit to the business"
    ]
  },
  {
    id: "business-overhead",
    name: "Business Overhead Expense",
    shortDesc: "Keep your business running during owner disability with $1,000-$25,000/month in covered expenses",
    features: [
      "Covers rent, utilities, employee salaries",
      "12-24 month benefit periods",
      "30-90 day elimination periods",
      "Equipment leases and insurance premiums",
      "Tax-deductible premiums",
      "Substitute salary rider available"
    ],
    benefits: [
      "Maintain business operations during disability",
      "Protect employee jobs and client relationships",
      "Preserve business value and reputation",
      "Return to a functional business after recovery"
    ]
  },
  {
    id: "employee-education",
    name: "Employee Education Programs",
    shortDesc: "Financial literacy and benefits education for your workforce to maximize participation",
    features: [
      "Benefits enrollment education sessions",
      "Retirement planning workshops",
      "Financial wellness seminars",
      "One-on-one employee consultations",
      "Digital learning resources"
    ],
    benefits: [
      "Higher benefits participation rates",
      "Reduced HR burden for benefits questions",
      "Improved employee financial wellness",
      "Better retirement preparedness"
    ]
  }
];

const FUTURE_SOLUTIONS: Service[] = [
  {
    id: "life-insurance-review",
    name: "Life Insurance Review",
    shortDesc: "Annual policy audit - over 65% of reviews reveal opportunities for improvement",
    features: [
      "Complete policy inventory and analysis",
      "Beneficiary designation verification",
      "Cash value and performance review",
      "Insurance company financial health check",
      "Tax-free 1035 exchange evaluation"
    ],
    benefits: [
      "Ensure policies perform as intended",
      "Avoid policy lapses from underfunding",
      "Update beneficiaries after life changes",
      "Potentially reduce premiums or increase coverage"
    ]
  },
  {
    id: "retirement-planning",
    name: "Retirement Planning",
    shortDesc: "401(k), IRA, and pension strategies with SECURE 2.0 tax credits covering 100% of startup costs",
    features: [
      "Solo 401(k) for self-employed ($23,500 + employer contributions)",
      "Safe Harbor 401(k) to skip nondiscrimination testing",
      "Profit-sharing up to 25% of compensation",
      "SECURE 2.0 tax credits (up to $5,000/year for 3 years)",
      "Age 60-63 enhanced catch-up contributions ($11,250)"
    ],
    benefits: [
      "Tax deductions on employer contributions",
      "Attract and retain quality employees",
      "Maximize personal retirement savings",
      "Build wealth with tax-deferred growth"
    ]
  },
  {
    id: "estate-planning",
    name: "Estate Planning",
    shortDesc: "Protect and transfer wealth with $13.99M federal estate tax exemption strategies",
    features: [
      "Revocable and irrevocable trust structures",
      "Life insurance trusts (ILIT) to exclude proceeds",
      "Grantor retained trusts (GRAT/GRUT)",
      "Family limited partnerships for discounted transfers",
      "Annual gifting strategies ($19,000/recipient)"
    ],
    benefits: [
      "Minimize or eliminate estate taxes",
      "Avoid probate delays and costs",
      "Protect assets from creditors",
      "Ensure wishes are followed if incapacitated"
    ]
  },
  {
    id: "succession-planning",
    name: "Succession Planning",
    shortDesc: "Ensure smooth business transition - only 30% of businesses have formal plans",
    features: [
      "Business valuation and KPI assessment",
      "Successor identification and development",
      "Buy-sell agreement drafting and funding",
      "Tax-efficient transfer strategies",
      "Life insurance for estate equalization"
    ],
    benefits: [
      "Maximize business value at transition",
      "Minimize tax impact of ownership transfer",
      "Ensure business continuity",
      "Protect family relationships"
    ]
  }
];

const categoryInfo: Record<ServiceCategory, { title: string; services: Service[]; icon: React.ReactNode }> = {
  planning: { title: "Planning Solutions", services: PLANNING_SOLUTIONS, icon: <Shield className="w-5 h-5" /> },
  disability: { title: "Disability Solutions", services: DISABILITY_SOLUTIONS, icon: <Heart className="w-5 h-5" /> },
  business: { title: "Business Solutions", services: BUSINESS_SOLUTIONS, icon: <Briefcase className="w-5 h-5" /> },
  future: { title: "Future Solutions", services: FUTURE_SOLUTIONS, icon: <TrendingUp className="w-5 h-5" /> }
};

export default function Insurance() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [tcpaConsent, setTcpaConsent] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("planning");
  const [expandedService, setExpandedService] = useState<string | null>(null);
  useScrollToTopOnChange(submitted);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    userType: "",
    intentType: "",
    insuranceTypes: [] as string[],
    businessName: "",
    employeeCount: "",
    currentProvider: "",
    additionalInfo: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem('insurance_referral', ref);
    } else {
      const storedRef = localStorage.getItem('insurance_referral');
      if (storedRef) setReferralCode(storedRef);
    }
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData & { referralCode: string | null }) => {
      const response = await fetch("/api/insurance-intakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          insuranceTypes: data.insuranceTypes.join(","),
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Submission failed");
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({ title: "Request Submitted!", description: "We'll contact you within 24 hours." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.userType || !formData.intentType || formData.insuranceTypes.length === 0) {
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (!tcpaConsent) {
      toast({ title: "Consent Required", description: "Please agree to the terms to continue.", variant: "destructive" });
      return;
    }
    submitMutation.mutate({ ...formData, referralCode });
  };

  const toggleInsuranceType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      insuranceTypes: prev.insuranceTypes.includes(type)
        ? prev.insuranceTypes.filter(t => t !== type)
        : [...prev.insuranceTypes, type]
    }));
  };

  const insuranceOptions = [
    { id: "life", label: "Life Insurance", icon: Heart },
    { id: "disability", label: "Disability Insurance", icon: Shield },
    { id: "health", label: "Health Insurance", icon: FileText },
    { id: "business", label: "Business Insurance", icon: Building2 },
    { id: "auto", label: "Auto Insurance", icon: Car },
    { id: "home", label: "Home Insurance", icon: Home },
  ];

  const currentCategory = categoryInfo[activeCategory];

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-slate-900 to-brand-navy py-20">
          <div className="text-center text-white max-w-lg mx-auto px-4">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h1 className="text-4xl font-display mb-4">Request Received!</h1>
            <p className="text-xl text-gray-300 mb-6">
              Thank you for your interest. Our team will contact you within 24 hours to discuss your options.
            </p>
            <p className="text-sm text-gray-400">
              You may opt out at any time by replying STOP to texts or clicking unsubscribe in emails.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-1 bg-gradient-to-r from-amber-500 via-slate-600 to-amber-500"></div>
      
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-navy text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Navigator Elite Financial Services
          </div>
          <h1 className="text-4xl sm:text-5xl font-display mb-4">
            Comprehensive Insurance & <span className="text-amber-400">Financial Planning</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Fortune 500-level protection strategies for veterans, professionals, and business owners. 
            Provider-direct model delivering 20-40% savings with enhanced coverage.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>A+ Rated Carriers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>34+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>$45K+ Avg. Annual Savings</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-display text-white mb-2">Our Solutions Portfolio</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive financial protection across every stage of life and business
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {(Object.keys(categoryInfo) as ServiceCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setExpandedService(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-amber-500 text-slate-900"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
                data-testid={`button-category-${cat}`}
              >
                {categoryInfo[cat].icon}
                <span>{categoryInfo[cat].title}</span>
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {currentCategory.services.map((service) => (
              <div
                key={service.id}
                className="bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden hover:border-amber-500/30 transition-colors"
                data-testid={`card-service-${service.id}`}
              >
                <div 
                  className="p-5 cursor-pointer flex items-center justify-between"
                  onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                >
                  <div>
                    <h3 className="text-lg font-bold text-white">{service.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{service.shortDesc}</p>
                  </div>
                  <ChevronRight 
                    className={`w-5 h-5 text-amber-400 transition-transform flex-shrink-0 ml-4 ${
                      expandedService === service.id ? "rotate-90" : ""
                    }`}
                  />
                </div>

                {expandedService === service.id && (
                  <div className="px-5 pb-5 border-t border-white/10 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <h4 className="font-bold text-amber-400 mb-3 flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Key Features
                        </h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-amber-400 mt-0.5">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4" />
                          Benefits
                        </h4>
                        <ul className="space-y-2">
                          {service.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-green-400 mt-0.5">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/planning-solutions">
              <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                View All Solutions in Detail
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">$45K+ Savings</h3>
              <p className="text-gray-400 text-sm">Annual savings demonstrated for medical practices through our provider-direct model.</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Tailored Solutions</h3>
              <p className="text-gray-400 text-sm">Custom financial strategies for consumers, business owners, and professionals.</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">A+ Rated Carriers</h3>
              <p className="text-gray-400 text-sm">Direct relationships with Fortune 500 insurers for superior coverage.</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">34+ Years</h3>
              <p className="text-gray-400 text-sm">Decades of experience in insurance and financial planning.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white" id="quote-form">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-2">Get Your Free Quote</h2>
              <p className="text-gray-600">Tell us about your insurance needs and we'll show you how much you can save.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-brand-navy font-semibold mb-3 block">I am a... *</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "consumer", label: "Consumer", icon: Users },
                    { id: "business", label: "Business", icon: Building2 },
                    { id: "insurance_agent", label: "Insurance Agent", icon: Briefcase },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData({ ...formData, userType: id })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.userType === id
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      data-testid={`button-user-type-${id}`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${formData.userType === id ? "text-green-600" : "text-gray-400"}`} />
                      <span className={`text-sm font-medium ${formData.userType === id ? "text-green-600" : "text-gray-600"}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-brand-navy font-semibold mb-3 block">I want to... *</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "buy", label: "Buy Insurance" },
                    { id: "sell", label: "Sell Insurance" },
                    { id: "refer", label: "Refer Others" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData({ ...formData, intentType: id })}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        formData.intentType === id
                          ? "border-brand-navy bg-brand-navy text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                      data-testid={`button-intent-${id}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-brand-navy font-semibold mb-3 block">Insurance Types (select all that apply) *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {insuranceOptions.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleInsuranceType(id)}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                        formData.insuranceTypes.includes(id)
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      data-testid={`button-insurance-${id}`}
                    >
                      <Icon className={`w-5 h-5 ${formData.insuranceTypes.includes(id) ? "text-green-600" : "text-gray-400"}`} />
                      <span className={`text-sm ${formData.insuranceTypes.includes(id) ? "text-green-600 font-medium" : "text-gray-600"}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-700">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-700">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1"
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-700">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              {formData.userType === "business" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName" className="text-gray-700">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="mt-1"
                      data-testid="input-business-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employeeCount" className="text-gray-700">Number of Employees</Label>
                    <Input
                      id="employeeCount"
                      value={formData.employeeCount}
                      onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                      className="mt-1"
                      placeholder="e.g., 10-50"
                      data-testid="input-employee-count"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="currentProvider" className="text-gray-700">Current Insurance Provider (if any)</Label>
                <Input
                  id="currentProvider"
                  value={formData.currentProvider}
                  onChange={(e) => setFormData({ ...formData, currentProvider: e.target.value })}
                  className="mt-1"
                  placeholder="e.g., State Farm, Allstate, etc."
                  data-testid="input-current-provider"
                />
              </div>

              <div>
                <Label htmlFor="additionalInfo" className="text-gray-700">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  className="mt-1"
                  rows={3}
                  placeholder="Tell us about your specific insurance needs or questions..."
                  data-testid="textarea-additional-info"
                />
              </div>

              <TCPAConsent 
                checked={tcpaConsent} 
                onCheckedChange={setTcpaConsent} 
              />

              <Button
                type="submit"
                disabled={submitMutation.isPending || !tcpaConsent}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg"
                data-testid="button-submit-insurance"
              >
                {submitMutation.isPending ? "Submitting..." : "Get My Free Quote"}
              </Button>

              <p className="text-center text-xs text-gray-500">
                By submitting, you agree to be contacted about insurance options. Your information is secure and will never be sold.
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display mb-4 tracking-wide">
              WE ARE DIRECT TO <span className="text-amber-400">70+ CARRIERS</span>, INSURERS & REINSURERS
            </h2>
            <p className="text-2xl sm:text-3xl font-display text-amber-400 mb-6">
              SAVE ON ANY INSURANCE
            </p>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Navigator Insurance connects you directly with America's highest-rated insurance carriers - eliminating middleman costs and passing the savings directly to you.
            </p>
          </div>
          
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-4 min-w-max">
              <div className="w-64 flex-shrink-0 bg-gradient-to-br from-amber-500/20 to-slate-800 rounded-xl p-5 border-2 border-amber-500">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-amber-400">SUN LIFE</h3>
                  <span className="bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded">#1 AUM</span>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-400">Rating:</span> <span className="text-green-400 font-semibold">A+ Superior</span></p>
                  <p><span className="text-gray-400">Assets:</span> <span className="text-white font-bold">$1.54T</span></p>
                  <p><span className="text-gray-400">Est:</span> 1865</p>
                </div>
              </div>
              
              <div className="w-64 flex-shrink-0 bg-gradient-to-br from-slate-700/50 to-slate-800 rounded-xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-amber-400">PRINCIPAL</h3>
                  <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded">#2 AUM</span>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-400">Rating:</span> <span className="text-green-400 font-semibold">A+ Superior</span></p>
                  <p><span className="text-gray-400">Assets:</span> <span className="text-white font-bold">$781B</span></p>
                  <p><span className="text-gray-400">Fortune 500</span></p>
                </div>
              </div>
              
              <div className="w-64 flex-shrink-0 bg-gradient-to-br from-slate-700/50 to-slate-800 rounded-xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-amber-400">SYMETRA</h3>
                  <span className="bg-blue-500/30 text-blue-200 text-xs font-bold px-2 py-1 rounded">LOW COMPLAINTS</span>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-400">Rating:</span> <span className="text-green-400 font-semibold">A Excellent</span></p>
                  <p><span className="text-gray-400">Assets:</span> <span className="text-white font-bold">$68.4B</span></p>
                  <p><span className="text-gray-400">Est:</span> 1957</p>
                </div>
              </div>
              
              <div className="w-64 flex-shrink-0 bg-gradient-to-br from-slate-700/50 to-slate-800 rounded-xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-amber-400">THE HARTFORD</h3>
                  <span className="bg-red-500/30 text-red-200 text-xs font-bold px-2 py-1 rounded">OLDEST US</span>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-400">Rating:</span> <span className="text-green-400 font-semibold">A+ Superior</span></p>
                  <p><span className="text-gray-400">Revenue:</span> <span className="text-white font-bold">$26.5B</span></p>
                  <p><span className="text-gray-400">Est:</span> 1810</p>
                </div>
              </div>
              
              <div className="w-64 flex-shrink-0 bg-gradient-to-br from-slate-700/50 to-slate-800 rounded-xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-amber-400">UNUM GROUP</h3>
                  <span className="bg-purple-500/30 text-purple-200 text-xs font-bold px-2 py-1 rounded">DISABILITY</span>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-400">Rating:</span> <span className="text-green-400 font-semibold">A Excellent</span></p>
                  <p><span className="text-gray-400">Revenue:</span> <span className="text-white font-bold">$12.9B</span></p>
                  <p><span className="text-gray-400">Fortune 500</span></p>
                </div>
              </div>
              
              <div className="w-64 flex-shrink-0 bg-gradient-to-br from-slate-700/50 to-slate-800 rounded-xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-amber-400">THE STANDARD</h3>
                  <span className="bg-green-500/30 text-green-200 text-xs font-bold px-2 py-1 rounded">95+ YR A</span>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-400">Rating:</span> <span className="text-green-400 font-semibold">A Excellent</span></p>
                  <p><span className="text-gray-400">Assets:</span> <span className="text-white font-bold">$25B+</span></p>
                  <p><span className="text-gray-400">Est:</span> 1906</p>
                </div>
              </div>
              
              <div className="w-64 flex-shrink-0 bg-gradient-to-br from-amber-500/10 to-slate-800 rounded-xl p-5 border border-amber-500/30 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-amber-400 mb-2">64+</p>
                  <p className="text-sm text-gray-300 font-medium">MORE CARRIERS</p>
                  <p className="text-xs text-gray-400 mt-1">All A-Rated</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/30 rounded-full px-8 py-4">
              <span className="text-amber-400 font-bold text-lg">NAVIGATOR INSURANCE</span>
              <span className="text-gray-500">|</span>
              <span className="text-white font-medium">PROVIDER-DIRECT MODEL = 20-40% SAVINGS</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
