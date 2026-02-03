import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  DollarSign, Users, TrendingUp, Gift, Store, ExternalLink, Shield, FileText, Calculator, 
  Building2, HeartPulse, Briefcase, Receipt, Landmark, PiggyBank, Scale, Stethoscope, 
  CheckCircle, ArrowRight, CreditCard, Play, Flag, Palette, ShoppingBag, Printer, 
  Package, Heart
} from "lucide-react";

const SECTIONS = [
  { id: "overview", label: "Fin-Ops Overview", description: "Commission-based referral programs" },
  { id: "vet-professionals", label: "Vet Professionals", description: "Professional network for veterans" },
  { id: "merchant-services", label: "Merchant Services", description: "Payment processing solutions" },
  { id: "my-locker", label: "MY LOCKER", description: "Free branded merchandise stores" },
  { id: "vgift-cards", label: "vGift Cards", description: "Virtual gift cards for any occasion" },
];

function OverviewContent({ referralCode }: { referralCode: string | null }) {
  const buildLink = (path: string) => {
    return referralCode ? `${path}?ref=${referralCode}` : path;
  };

  return (
    <>
      <div className="bg-brand-red text-white py-4 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-bold text-sm sm:text-base">100% FREE TO JOIN</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-bold text-sm sm:text-base">WE NEVER ASK FOR MONEY UPFRONT</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-bold text-sm sm:text-base">NOT AN MLM - REAL SERVICES</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-navy text-white py-3 px-4">
        <div className="container mx-auto text-center">
          <p className="text-lg sm:text-xl font-bold">
            <span className="font-display tracking-wide">JOIN THE RANKS</span>
            <span className="mx-2 sm:mx-4">-</span>
            <span className="font-normal">Over 100,000 veterans a week are introduced to our ranks</span>
            <span className="mx-2 sm:mx-4">-</span>
            <Link href="/affiliate" className="underline hover:text-white/80 font-bold">JOIN NOW</Link>
          </p>
        </div>
      </div>

      <section className="bg-gradient-to-b from-brand-navy via-brand-navy to-brand-red/20 py-12 sm:py-16 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-5xl font-display mb-4">Financial Operations</h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Earn commissions by referring clients to NavigatorUSA partner services. 
            Every referral is tracked and supports veteran programs.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur border border-white/20">
              <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Earn Commissions</h3>
              <p className="mt-2 text-gray-300">Get paid for every client you refer that closes</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur border border-white/20">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-brand-navy" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">6-Level Deep Tracking</h3>
              <p className="mt-2 text-gray-300">Build a team and earn on 6 levels of referrals</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur border border-white/20">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Real-Time Portal</h3>
              <p className="mt-2 text-gray-300">Track all your leads and commissions in your affiliate portal</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/veteran-led-tax/intake-refer">
              <Button size="lg" className="bg-brand-red hover:bg-brand-red/90 text-white font-bold h-12 sm:h-14 px-6 sm:px-8">
                Submit a Client Referral
              </Button>
            </Link>
            <Link href="/veteran-led-tax/affiliate">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 h-12 sm:h-14 px-6 sm:px-8">
                Affiliate Portal Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display text-brand-navy mb-4">Available Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive financial and business services for veterans and their families. All referrals are tracked for commission payments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            <Link href={buildLink("/insurance")} data-testid="link-insurance">
              <div className="p-6 bg-brand-red rounded-xl hover:bg-brand-red/90 cursor-pointer group transition-all hover:shadow-xl h-full shadow-lg">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-brand-red mb-4 group-hover:scale-110 transition-transform">
                  <Shield size={28} />
                </div>
                <h3 className="font-display text-xl text-white mb-2">Insurance Savings</h3>
                <p className="text-sm text-white/80 mb-3">Save 20-40% on life, disability, health, and business insurance through provider-direct model</p>
                <div className="flex items-center text-white font-bold text-sm">
                  <span>Get Quote</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href={buildLink("/veteran-led-tax/services/tax-preparation")} data-testid="link-tax-prep">
              <div className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-navy cursor-pointer group transition-all hover:shadow-xl h-full shadow-lg">
                <div className="w-14 h-14 bg-brand-navy rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <FileText size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2">Tax Preparation</h3>
                <p className="text-sm text-gray-600 mb-3">Professional tax preparation for individuals and businesses by veteran-led CPAs</p>
                <div className="flex items-center text-brand-navy font-bold text-sm">
                  <span>Learn More</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href={buildLink("/veteran-led-tax/services/tax-planning")} data-testid="link-tax-planning">
              <div className="p-6 bg-brand-navy rounded-xl hover:bg-brand-navy/90 cursor-pointer group transition-all hover:shadow-xl h-full shadow-lg">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-brand-navy mb-4 group-hover:scale-110 transition-transform">
                  <Calculator size={28} />
                </div>
                <h3 className="font-display text-xl text-white mb-2">Tax Planning</h3>
                <p className="text-sm text-white/80 mb-3">Strategic tax planning to minimize liability and maximize savings year-round</p>
                <div className="flex items-center text-white font-bold text-sm">
                  <span>Learn More</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href={buildLink("/veteran-led-tax/services/tax-resolution")} data-testid="link-tax-resolution">
              <div className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-red cursor-pointer group transition-all hover:shadow-xl h-full shadow-lg">
                <div className="w-14 h-14 bg-brand-red rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <Landmark size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2">Tax Resolution</h3>
                <p className="text-sm text-gray-600 mb-3">IRS problem resolution including audits, liens, levies, and payment plans</p>
                <div className="flex items-center text-brand-red font-bold text-sm">
                  <span>Get Help</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href={buildLink("/veteran-led-tax/services/payroll")} data-testid="link-payroll">
              <div className="p-6 bg-brand-navy rounded-xl hover:bg-brand-navy/90 cursor-pointer group transition-all hover:shadow-xl h-full shadow-lg">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-brand-navy mb-4 group-hover:scale-110 transition-transform">
                  <Receipt size={28} />
                </div>
                <h3 className="font-display text-xl text-white mb-2">Payroll Services</h3>
                <p className="text-sm text-white/80 mb-3">Full-service payroll processing, tax filings, and compliance management</p>
                <div className="flex items-center text-white font-bold text-sm">
                  <span>Learn More</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href={buildLink("/veteran-led-tax/services/tax-credits")} data-testid="link-tax-credits">
              <div className="p-6 bg-brand-red rounded-xl hover:bg-brand-red/90 cursor-pointer group transition-all hover:shadow-xl h-full shadow-lg">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-brand-red mb-4 group-hover:scale-110 transition-transform">
                  <PiggyBank size={28} />
                </div>
                <h3 className="font-display text-xl text-white mb-2">Tax Credits & Incentives</h3>
                <p className="text-sm text-white/80 mb-3">R&D credits, WOTC, utility credits, and other business incentives</p>
                <div className="flex items-center text-white font-bold text-sm">
                  <span>Learn More</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href={buildLink("/medical-sales")} data-testid="link-medical-sales">
              <div className="p-6 bg-brand-navy rounded-xl hover:bg-brand-navy/90 cursor-pointer group transition-all hover:shadow-xl h-full shadow-lg">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-brand-navy mb-4 group-hover:scale-110 transition-transform">
                  <HeartPulse size={28} />
                </div>
                <h3 className="font-display text-xl text-white mb-2">Medical Sales</h3>
                <p className="text-sm text-white/80 mb-3">Connect with medical device, equipment, and pharmaceutical sales opportunities</p>
                <div className="flex items-center text-white font-bold text-sm">
                  <span>Submit Inquiry</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href={buildLink("/business-development")} data-testid="link-business-dev">
              <div className="p-6 bg-brand-red rounded-xl hover:bg-brand-red/90 cursor-pointer group transition-all hover:shadow-xl h-full shadow-lg">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-brand-red mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase size={28} />
                </div>
                <h3 className="font-display text-xl text-white mb-2">Business Development</h3>
                <p className="text-sm text-white/80 mb-3">Consulting, partnerships, vendor relations, and lead generation services</p>
                <div className="flex items-center text-white font-bold text-sm">
                  <span>Submit Inquiry</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href={buildLink("/veteran-led-tax/services/outsourced-accounting")} data-testid="link-accounting">
              <div className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-blue cursor-pointer group transition-all hover:shadow-xl h-full shadow-lg">
                <div className="w-14 h-14 bg-brand-blue rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <Building2 size={28} />
                </div>
                <h3 className="font-display text-xl text-brand-navy mb-2">Outsourced Accounting</h3>
                <p className="text-sm text-gray-600 mb-3">Complete bookkeeping, financial reporting, and CFO services</p>
                <div className="flex items-center text-brand-blue font-bold text-sm">
                  <span>Learn More</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-12">
        <div className="container mx-auto px-4">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-brand-red to-brand-red/80 rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8 text-center md:text-left max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl sm:text-2xl font-display mb-1 sm:mb-2">Ready to Start Earning?</h3>
              <p className="text-sm sm:text-base text-white/90">Join NavigatorUSA and start referring clients today.</p>
            </div>
            <Link href="/affiliate">
              <Button className="bg-white text-brand-red font-bold hover:bg-gray-100 px-6 sm:px-8 w-full md:w-auto">
                Become an Affiliate
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

const PROFESSION_TYPES = [
  { id: "attorneys", label: "Attorneys", icon: Scale, description: "Legal professionals serving veterans" },
  { id: "insurance", label: "Insurance", icon: Shield, description: "Insurance agents and brokers" },
  { id: "cpa", label: "CPA", icon: Calculator, description: "Certified Public Accountants" },
  { id: "medical", label: "Medical", icon: Stethoscope, description: "Medical professionals" },
];

function VetProfessionalsContent({ referralCode }: { referralCode: string | null }) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [professionType, setProfessionType] = useState<string>("");

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/vet-professional-intakes", data);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and be in touch soon.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!professionType) {
      toast({
        title: "Select Profession",
        description: "Please select your profession type.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      professionType,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      isVeteran: formData.get("isVeteran") as string,
      branchOfService: formData.get("branchOfService") as string,
      businessName: formData.get("businessName") as string,
      businessType: formData.get("businessType") as string,
      licenseNumber: formData.get("licenseNumber") as string,
      yearsExperience: formData.get("yearsExperience") as string,
      specializations: formData.get("specializations") as string,
      serviceArea: formData.get("serviceArea") as string,
      additionalNotes: formData.get("additionalNotes") as string,
      referralCode: referralCode || null,
    };

    submitMutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 max-w-lg text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 data-testid="text-success-title" className="font-display text-3xl text-white mb-4">APPLICATION SUBMITTED!</h1>
          <p data-testid="text-success-message" className="text-gray-300 mb-6">
            Thank you for joining our Vet Professionals network. We'll review your application and connect you with veteran clients in need of your services.
          </p>
          <Link href="/">
            <Button data-testid="button-return-home" className="bg-brand-red hover:bg-brand-red/90 text-white">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-2 bg-gradient-to-r from-brand-red via-white to-brand-navy"></div>
      
      <div className="bg-gradient-to-br from-brand-red via-brand-navy to-brand-navy">
        <div className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Users className="w-5 h-5 text-white" />
              <span className="text-white font-bold uppercase tracking-wider text-sm">Professional Network</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              VET PROFESSIONALS
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Join our network of veteran-focused professionals. Connect with veterans who need your expertise 
              and grow your practice while serving those who served.
            </p>
          </div>
        </div>

        <div className="py-8 px-4 bg-brand-navy">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-2xl text-white text-center mb-8">SELECT YOUR PROFESSION</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROFESSION_TYPES.map((profession, index) => {
                const IconComponent = profession.icon;
                const colors = ['bg-brand-red', 'bg-white', 'bg-brand-navy border-white', 'bg-brand-red'];
                const textColors = ['text-white', 'text-brand-navy', 'text-white', 'text-white'];
                const descColors = ['text-white/80', 'text-brand-navy/70', 'text-white/80', 'text-white/80'];
                const iconColors = ['text-white', 'text-brand-navy', 'text-white', 'text-white'];
                return (
                  <button
                    key={profession.id}
                    data-testid={`button-profession-${profession.id}`}
                    onClick={() => setProfessionType(profession.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-center ${
                      professionType === profession.id
                        ? `${colors[index % 4]} border-white shadow-lg`
                        : `${colors[index % 4]} border-transparent hover:border-white/40 opacity-80 hover:opacity-100`
                    }`}
                  >
                    <IconComponent className={`w-12 h-12 mx-auto mb-4 ${iconColors[index % 4]}`} />
                    <h3 className={`font-display text-lg mb-2 ${textColors[index % 4]}`}>{profession.label}</h3>
                    <p className={`text-xs ${descColors[index % 4]}`}>{profession.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                <h3 className="font-display text-xl text-white mb-6">YOUR INFORMATION</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-white">First Name *</Label>
                    <Input data-testid="input-firstName" id="firstName" name="firstName" required className="bg-white/10 border-white/20 text-white" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                    <Input data-testid="input-lastName" id="lastName" name="lastName" required className="bg-white/10 border-white/20 text-white" placeholder="Doe" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">Email *</Label>
                    <Input data-testid="input-email" id="email" name="email" type="email" required className="bg-white/10 border-white/20 text-white" placeholder="john@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">Phone *</Label>
                    <Input data-testid="input-phone" id="phone" name="phone" type="tel" required className="bg-white/10 border-white/20 text-white" placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-3 block">Are you a veteran?</Label>
                    <RadioGroup defaultValue="no" name="isVeteran" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem data-testid="radio-veteran-yes" value="yes" id="vet-yes" className="border-white/40" />
                        <Label htmlFor="vet-yes" className="text-gray-300">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem data-testid="radio-veteran-no" value="no" id="vet-no" className="border-white/40" />
                        <Label htmlFor="vet-no" className="text-gray-300">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="branchOfService" className="text-white">Branch of Service (if applicable)</Label>
                    <Input data-testid="input-branchOfService" id="branchOfService" name="branchOfService" className="bg-white/10 border-white/20 text-white" placeholder="e.g., Army, Navy, Air Force" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                <h3 className="font-display text-xl text-white mb-6">PROFESSIONAL INFORMATION</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessName" className="text-white">Business/Practice Name</Label>
                    <Input data-testid="input-businessName" id="businessName" name="businessName" className="bg-white/10 border-white/20 text-white" placeholder="Law Office of John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="businessType" className="text-white">Business Type</Label>
                    <Input data-testid="input-businessType" id="businessType" name="businessType" className="bg-white/10 border-white/20 text-white" placeholder="e.g., Solo Practice, LLC, Partnership" />
                  </div>
                  <div>
                    <Label htmlFor="licenseNumber" className="text-white">License/Bar Number</Label>
                    <Input data-testid="input-licenseNumber" id="licenseNumber" name="licenseNumber" className="bg-white/10 border-white/20 text-white" placeholder="Your professional license number" />
                  </div>
                  <div>
                    <Label htmlFor="yearsExperience" className="text-white">Years of Experience</Label>
                    <Input data-testid="input-yearsExperience" id="yearsExperience" name="yearsExperience" className="bg-white/10 border-white/20 text-white" placeholder="e.g., 10" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="specializations" className="text-white">Specializations</Label>
                    <Input data-testid="input-specializations" id="specializations" name="specializations" className="bg-white/10 border-white/20 text-white" placeholder="e.g., VA Claims, Personal Injury, Tax Law" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="serviceArea" className="text-white">Service Area</Label>
                    <Input data-testid="input-serviceArea" id="serviceArea" name="serviceArea" className="bg-white/10 border-white/20 text-white" placeholder="e.g., Nationwide, Texas, Dallas Metro Area" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                <h3 className="font-display text-xl text-white mb-6">ADDITIONAL INFORMATION</h3>
                <div>
                  <Label htmlFor="additionalNotes" className="text-white">Tell us about your experience serving veterans</Label>
                  <Textarea data-testid="input-additionalNotes" id="additionalNotes" name="additionalNotes" className="bg-white/10 border-white/20 text-white min-h-[120px]" placeholder="Describe your experience working with veterans, any special programs you offer, or why you want to join our network..." />
                </div>
              </div>

              <div className="text-center">
                <Button data-testid="button-submit" type="submit" disabled={submitMutation.isPending} className="bg-brand-red hover:bg-brand-red/90 text-white text-xl px-12 py-6 h-auto">
                  {submitMutation.isPending ? "Submitting..." : "Join Network"}
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="py-16 px-4 bg-brand-navy">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl text-white text-center mb-12">WHY JOIN OUR NETWORK?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-brand-red rounded-xl p-6 text-center">
                <Users className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="font-display text-xl text-white mb-3">VETERAN CLIENTS</h3>
                <p className="text-white/80 text-sm">Connect with veterans and their families who need your professional services.</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <Shield className="w-12 h-12 text-brand-navy mx-auto mb-4" />
                <h3 className="font-display text-xl text-brand-navy mb-3">TRUSTED NETWORK</h3>
                <p className="text-brand-navy/70 text-sm">Be part of a vetted network of professionals dedicated to serving veterans.</p>
              </div>
              <div className="bg-brand-navy border-2 border-white rounded-xl p-6 text-center">
                <Scale className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="font-display text-xl text-white mb-3">GROW YOUR PRACTICE</h3>
                <p className="text-white/80 text-sm">Expand your client base while making a meaningful impact in veterans' lives.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MerchantServicesContent({ referralCode }: { referralCode: string | null }) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handlePartnerClick = async () => {
    setIsRedirecting(true);
    try {
      const response = await fetch('/api/finops/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerType: 'merchant_services', referralCode })
      });
      const data = await response.json();
      if (data.redirectUrl) {
        window.open(data.redirectUrl, '_blank');
      }
    } catch (error) {
      console.error('Error tracking click:', error);
      window.open('https://staging.fluidfintec.com/merchant-signup', '_blank');
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <>
      <section className="bg-brand-navy text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red mb-4 sm:mb-6">
            <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">NavigatorUSA Partner</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6" data-testid="text-page-title">Merchant Processing</h1>
          <p className="text-xl sm:text-2xl text-brand-gold font-bold mb-2">100% of Commissions Support Veterans</p>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-2" data-testid="text-page-description">
            Help American businesses comply with Executive Order 14117 while supporting NavigatorUSA's veteran programs.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <Card className="border-t-4 border-t-brand-red shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-red/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <Flag className="w-7 h-7 sm:w-8 sm:h-8 text-brand-red" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Patriotic Mission</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Executive Order 14117 affects all 36 million U.S. businesses. Our service ensures customer data is protected from foreign adversaries.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-blue shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <Scale className="w-7 h-7 sm:w-8 sm:h-8 text-brand-blue" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Compliance Solution</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Help merchants avoid criminal liability and civil fines. Our platform removes all personal customer data from receipts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-gold shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-brand-gold" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Support Veterans</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  <strong className="text-brand-red">100% of commissions</strong> from merchant signups go directly to NavigatorUSA veteran programs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6 sm:mb-8 text-center">Learn More About This Opportunity</h2>
            
            <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg mb-8">
              <div className="aspect-video rounded-lg overflow-hidden mb-6">
                <iframe
                  src="https://player.vimeo.com/video/1159350744?autoplay=0"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Merchant Services Overview"
                />
              </div>
              <p className="text-center text-gray-600">Learn how this compliance solution helps businesses and veterans</p>
            </div>

            <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg border-l-4 border-brand-red">
              <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6">Why Businesses Need This</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-gray-700">36 million U.S. businesses affected by Executive Order 14117</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-gray-700">Businesses face criminal liability and civil fines for non-compliance</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-gray-700">Our solution matches or beats current processing rates</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-gray-700">Every signup supports veteran programs through NavigatorUSA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-brand-navy text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-display mb-4 sm:mb-6">Register a Business Today</h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8">
            Help American businesses stay compliant while supporting NavigatorUSA's veteran programs.
          </p>
          <Button onClick={handlePartnerClick} disabled={isRedirecting} size="lg" className="bg-brand-red hover:bg-brand-red/90 text-white font-bold px-6 sm:px-10 h-12 sm:h-14" data-testid="link-register-business">
            {isRedirecting ? 'Opening...' : 'Register Your Business'} <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </>
  );
}

function MyLockerContent({ referralCode }: { referralCode: string | null }) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handlePartnerClick = async () => {
    setIsRedirecting(true);
    try {
      const response = await fetch('/api/finops/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerType: 'my_locker', referralCode })
      });
      const data = await response.json();
      if (data.redirectUrl) {
        window.open(data.redirectUrl, '_blank');
      }
    } catch (error) {
      console.error('Error tracking click:', error);
      window.open('https://www.moq1.com/imaginate-pod/navigatorusa', '_blank');
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <>
      <section className="bg-brand-navy text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold mb-4 sm:mb-6">
            <Store className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">NavigatorUSA Partner</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6" data-testid="text-page-title">MY LOCKER</h1>
          <p className="text-xl sm:text-2xl text-brand-gold font-bold mb-2">FREE Online Stores for Businesses</p>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-2" data-testid="text-page-description">
            Get a fully-functional ecommerce store ready in 72 hours. Print-on-demand merchandise for any business - 100% FREE through NavigatorUSA.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-4">NavigatorUSA Partner Benefit</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Through our exclusive partnership, we provide veterans and businesses a turnkey approach to launch their own branded merchandise store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12">
            <Card className="border-t-4 border-t-brand-red shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-red/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-brand-red" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">For Business Owners</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Get your own FREE branded merchandise store! Perfect for businesses, churches, civic organizations, local teams, and associations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-blue shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-brand-blue" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Earn as an Affiliate</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Generate income by helping businesses get their FREE store! Earn commissions on every sale from stores you help create.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto bg-brand-red/5 border-2 border-brand-red p-6 sm:p-10 rounded-xl mb-12">
            <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-4 text-center">See a Sample NavigatorUSA Store</h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6 text-center">
              View our official NavigatorUSA merchandise store to see what your business store could look like!
            </p>
            <div className="flex justify-center">
              <Button onClick={handlePartnerClick} disabled={isRedirecting} size="lg" className="bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8" data-testid="button-view-sample-store">
                {isRedirecting ? 'Opening...' : 'View Sample Store'} <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-brand-navy/5 p-6 sm:p-10 rounded-xl">
            <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-4 text-center">Hundreds of Products Available</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
              {['T-Shirts', 'Hoodies', 'Mugs', 'Hats', 'Tote Bags', 'Stickers'].map((item) => (
                <div key={item} className="p-3 bg-white rounded-lg shadow-sm">
                  <Package className="w-6 h-6 mx-auto mb-2 text-brand-navy" />
                  <span className="text-xs font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">Plus dozens more! All printed, packaged, and shipped in the USA.</p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6 sm:mb-8 text-center">How It Works</h2>
            
            <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg border-l-4 border-brand-red mb-8">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                  <p className="text-sm sm:text-base text-gray-700">Click the button below to start your FREE store application through NavigatorUSA.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                  <p className="text-sm sm:text-base text-gray-700">Provide your logo or design (high-resolution, print-ready PNG with transparent background).</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                  <p className="text-sm sm:text-base text-gray-700">Within 72 hours, your branded store will be live with a unique web link!</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold shrink-0">4</div>
                  <p className="text-sm sm:text-base text-gray-700">Share your store link - we handle printing, fulfillment, and customer service!</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-navy/5 p-6 sm:p-8 rounded-xl">
              <h4 className="font-display text-lg text-brand-navy mb-4 text-center">NavigatorUSA Handles Everything</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {['Store Creation', 'Order Management', 'Printing & Fulfillment', 'Shipping', 'Customer Service', 'USA Made'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-brand-navy text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-display mb-4 sm:mb-6">Get Your FREE Store Today!</h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8">
            Join NavigatorUSA's partner program and get a fully-functional merchandise store at no cost.
          </p>
          <Button onClick={handlePartnerClick} disabled={isRedirecting} size="lg" className="bg-brand-red hover:bg-brand-red/90 text-white font-bold px-6 sm:px-10 h-12 sm:h-14" data-testid="link-get-started">
            {isRedirecting ? 'Opening...' : 'Get Started - FREE'} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </>
  );
}

const POPULAR_BRANDS = [
  'Amazon', 'Target', 'Walmart', 'Starbucks', 'Home Depot', 'Lowes',
  'Best Buy', 'Nike', 'Uber Eats', 'DoorDash', 'Netflix', 'Spotify',
  'Apple', 'Google Play', 'Xbox', 'PlayStation', 'Visa', 'Mastercard',
  'AMC Theatres', 'Applebees', 'Olive Garden'
];

function VGiftCardsContent({ referralCode }: { referralCode: string | null }) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handlePartnerClick = async () => {
    setIsRedirecting(true);
    try {
      const response = await fetch('/api/finops/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerType: 'vgift_cards', referralCode })
      });
      const data = await response.json();
      if (data.redirectUrl) {
        window.open(data.redirectUrl, '_blank');
      }
    } catch (error) {
      console.error('Error tracking click:', error);
      window.open('https://ptogiftcardprogram.com/navigator-usa-virtual-gift-cards/?group=', '_blank');
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <>
      <section className="bg-brand-navy text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold mb-4 sm:mb-6">
            <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">NavigatorUSA Partner</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6" data-testid="text-page-title">NavigatorUSA vGift Cards</h1>
          <p className="text-xl sm:text-2xl text-brand-gold font-bold mb-2">Virtual Gift Cards That Support Veterans</p>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-2" data-testid="text-page-description">
            Purchase a NavigatorUSA vGift Card and let the recipient choose from 100+ major brands.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-4">How vGift Works</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              vGift is a digital gift card that can be redeemed for any of our 100+ partner brands. The perfect gift when you're not sure what someone wants!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12">
            <Card className="border-t-4 border-t-brand-red shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-red/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <CreditCard className="w-7 h-7 sm:w-8 sm:h-8 text-brand-red" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Purchase a vGift</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">
                  Buy a NavigatorUSA vGift Card from $5 to $100. Add a personal message and send it instantly via email.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-blue shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-brand-blue" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Recipient Chooses</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">
                  The recipient clicks a unique link and chooses from 100+ nationally branded gift cards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-brand-gold shadow-lg">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-brand-gold" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-3 sm:mb-4 text-center">Support Veterans</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">
                  Every vGift Card purchased through NavigatorUSA helps support veteran programs and families.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto bg-brand-navy/5 p-6 sm:p-10 rounded-xl">
            <h3 className="text-xl sm:text-2xl font-display text-brand-navy mb-6 text-center">Popular Brands Available</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3">
              {POPULAR_BRANDS.map((brand) => (
                <div key={brand} className="p-2 bg-white rounded-lg shadow-sm text-center">
                  <span className="text-xs font-medium text-gray-700">{brand}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">Plus many more! Over 100 nationally recognized brands to choose from.</p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6 sm:mb-8 text-center">Why Choose NavigatorUSA vGift Cards?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-display text-lg text-brand-navy mb-4">For Gift Givers</h4>
                <div className="space-y-3">
                  <div className="flex gap-2"><CheckCircle className="w-5 h-5 text-brand-red shrink-0" /><span className="text-sm text-gray-700">Never pick the "wrong" gift again</span></div>
                  <div className="flex gap-2"><CheckCircle className="w-5 h-5 text-brand-red shrink-0" /><span className="text-sm text-gray-700">Instant delivery via email</span></div>
                  <div className="flex gap-2"><CheckCircle className="w-5 h-5 text-brand-red shrink-0" /><span className="text-sm text-gray-700">Add personalized messages</span></div>
                  <div className="flex gap-2"><CheckCircle className="w-5 h-5 text-brand-red shrink-0" /><span className="text-sm text-gray-700">Support veteran causes</span></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-display text-lg text-brand-navy mb-4">For Recipients</h4>
                <div className="space-y-3">
                  <div className="flex gap-2"><CheckCircle className="w-5 h-5 text-brand-red shrink-0" /><span className="text-sm text-gray-700">Choose from 100+ brands</span></div>
                  <div className="flex gap-2"><CheckCircle className="w-5 h-5 text-brand-red shrink-0" /><span className="text-sm text-gray-700">No expiration dates</span></div>
                  <div className="flex gap-2"><CheckCircle className="w-5 h-5 text-brand-red shrink-0" /><span className="text-sm text-gray-700">Easy online redemption</span></div>
                  <div className="flex gap-2"><CheckCircle className="w-5 h-5 text-brand-red shrink-0" /><span className="text-sm text-gray-700">Get exactly what you want</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-brand-navy text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-display mb-4 sm:mb-6">Send a vGift Card Today!</h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8">
            The perfect gift for any occasion - birthdays, holidays, thank yous, or just because.
          </p>
          <Button onClick={handlePartnerClick} disabled={isRedirecting} size="lg" className="bg-brand-red hover:bg-brand-red/90 text-white font-bold px-6 sm:px-10 h-12 sm:h-14" data-testid="link-shop-vgift">
            {isRedirecting ? 'Opening...' : 'Shop vGift Cards'} <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </>
  );
}

export default function FinOpsHub() {
  const [location, setLocation] = useLocation();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  const pathSegment = location.replace('/fin-ops', '').replace('/', '') || 'overview';
  const selectedSection = SECTIONS.find(s => s.id === pathSegment) ? pathSegment : 'overview';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem('finops_referral', ref);
    } else {
      const storedRef = localStorage.getItem('finops_referral');
      if (storedRef) setReferralCode(storedRef);
    }
  }, []);

  const handleSectionChange = (sectionId: string) => {
    const path = sectionId === 'overview' ? '/fin-ops' : `/fin-ops/${sectionId}`;
    setLocation(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'overview':
        return <OverviewContent referralCode={referralCode} />;
      case 'vet-professionals':
        return <VetProfessionalsContent referralCode={referralCode} />;
      case 'merchant-services':
        return <MerchantServicesContent referralCode={referralCode} />;
      case 'my-locker':
        return <MyLockerContent referralCode={referralCode} />;
      case 'vgift-cards':
        return <VGiftCardsContent referralCode={referralCode} />;
      default:
        return <OverviewContent referralCode={referralCode} />;
    }
  };

  return (
    <Layout>
      <div className="bg-brand-navy py-4 px-4 border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto">
          <div className="hidden md:flex items-center justify-center gap-2">
            {SECTIONS.map((section) => (
              <Button
                key={section.id}
                data-testid={`tab-${section.id}`}
                variant={selectedSection === section.id ? "default" : "ghost"}
                onClick={() => handleSectionChange(section.id)}
                className={`px-4 py-2 ${
                  selectedSection === section.id
                    ? "bg-brand-red text-white hover:bg-brand-red/90"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {section.label}
              </Button>
            ))}
          </div>

          <div className="md:hidden">
            <Select value={selectedSection} onValueChange={handleSectionChange}>
              <SelectTrigger 
                className="w-full bg-white/10 border-white/20 text-white"
                data-testid="select-finops-section"
              >
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                {SECTIONS.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {renderContent()}
    </Layout>
  );
}
