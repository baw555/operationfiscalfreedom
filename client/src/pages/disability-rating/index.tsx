import { Layout } from "@/components/layout";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  FileText, Shield, CheckCircle, Users, DollarSign, Clock, ArrowRight, Award, Scale, Star, 
  TrendingUp, Gavel, Building2, AlertTriangle, Phone, Globe, MapPin, Zap, Heart, 
  AlertCircle, XCircle, FileCheck, Target
} from "lucide-react";

const SERVICES = [
  { id: "initial", label: "Initial VA Rating", description: "File your first VA disability claim", color: "red", intakeType: "initial" },
  { id: "increase", label: "Rating Increase", description: "Increase your current VA rating", color: "green", intakeType: "increase" },
  { id: "denial", label: "Denial Appeals", description: "Appeal a denied claim", color: "orange", intakeType: "denial" },
  { id: "ssdi", label: "SSDI Benefits", description: "Social Security Disability Insurance", color: "blue", intakeType: "ssdi" },
  { id: "widow", label: "Widow/Survivor Benefits", description: "DIC and survivor benefits", color: "purple", intakeType: "widow" },
];

function InitialContent() {
  return (
    <>
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <DollarSign className="w-8 h-8 text-white" />
            <h2 className="font-display text-2xl md:text-3xl text-white">100% FREE - NO COST TO YOU</h2>
          </div>
          <p className="text-white/90 text-lg max-w-3xl mx-auto">
            Our attorney partners help you file your initial VA disability claim completely FREE. 
            You pay nothing - ever.
          </p>
        </div>
      </div>

      <div className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-red/20 px-4 py-2 rounded-full mb-6">
            <FileText className="w-5 h-5 text-brand-red" />
            <span className="text-brand-red font-bold uppercase tracking-wider text-sm">Initial VA Rating</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            FILE YOUR INITIAL CLAIM WITH TOP ATTORNEYS - FOR FREE
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            We've partnered with the nation's leading VA disability attorneys and advocacy groups 
            who will help you file your initial claim at absolutely no cost.
          </p>
          <Link href="/disability-rating/intake?type=initial">
            <Button className="bg-brand-red hover:bg-brand-red/90 text-white text-lg px-8 py-6 h-auto">
              Get Free Attorney Help <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="py-16 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-4">
            WHY SPECIALIZED ATTORNEYS MATTER
          </h2>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Veterans who work with specialized VA disability attorneys see significantly better outcomes.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-display text-brand-red mb-2">36%</div>
              <h3 className="font-display text-lg text-white mb-2">CLAIMS DENIED</h3>
              <p className="text-gray-400 text-sm">Over one-third of VA disability claims were denied in 2024.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-display text-green-400 mb-2">96%</div>
              <h3 className="font-display text-lg text-white mb-2">ATTORNEY SUCCESS</h3>
              <p className="text-gray-400 text-sm">Top VA disability law firms report success rates as high as 96%.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-display text-brand-red mb-2">20%</div>
              <h3 className="font-display text-lg text-white mb-2">HIGHER APPROVAL</h3>
              <p className="text-gray-400 text-sm">Veterans with attorney representation show 15-20% higher approval rates.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-display text-green-400 mb-2">2.5M+</div>
              <h3 className="font-display text-lg text-white mb-2">CLAIMS PROCESSED</h3>
              <p className="text-gray-400 text-sm">Record-breaking claims processed in 2024.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function IncreaseContent() {
  return (
    <>
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-white" />
            <h2 className="font-display text-2xl md:text-3xl text-white">MAXIMIZE YOUR RATING</h2>
          </div>
          <p className="text-white/90 text-lg max-w-3xl mx-auto">
            Our attorney partners specialize in increasing VA disability ratings. 
            Pay only if they win your case.
          </p>
        </div>
      </div>

      <div className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full mb-6">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-bold uppercase tracking-wider text-sm">Rating Increase</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            INCREASE YOUR VA DISABILITY RATING
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Conditions worsen over time. If your disabilities have gotten worse since your last rating, 
            you may be entitled to a higher compensation level.
          </p>
          <Link href="/disability-rating/intake?type=increase">
            <Button className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6 h-auto">
              Get Rating Increase Help <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="py-16 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">
            SIGNS YOU NEED A RATING INCREASE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl text-white mb-4">SYMPTOMS WORSENED</h3>
              <p className="text-gray-300">Your condition has gotten worse since your last C&P exam or rating decision.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl text-white mb-4">NEW DIAGNOSIS</h3>
              <p className="text-gray-300">You've been diagnosed with new conditions related to your service.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl text-white mb-4">UNDERRATED</h3>
              <p className="text-gray-300">You believe your current rating doesn't reflect the severity of your disabilities.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DenialContent() {
  return (
    <>
      <div className="bg-gradient-to-r from-orange-600 to-red-600 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Gavel className="w-8 h-8 text-white" />
            <h2 className="font-display text-2xl md:text-3xl text-white">DON'T GIVE UP - APPEAL</h2>
          </div>
          <p className="text-white/90 text-lg max-w-3xl mx-auto">
            A denial is not the end. Our attorney partners have a 96% success rate on appeals.
          </p>
        </div>
      </div>

      <div className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full mb-6">
            <XCircle className="w-5 h-5 text-orange-400" />
            <span className="text-orange-400 font-bold uppercase tracking-wider text-sm">Denial Appeals</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            APPEAL YOUR VA CLAIM DENIAL
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Over 36% of VA claims are denied. But with the right legal representation, 
            most denials can be successfully appealed.
          </p>
          <Link href="/disability-rating/intake?type=denial">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6 h-auto">
              Start Your Appeal <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="py-16 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">
            COMMON REASONS FOR DENIAL
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
              <h3 className="font-display text-xl text-white mb-4 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-400" /> Insufficient Evidence
              </h3>
              <p className="text-gray-300">The VA couldn't find enough medical evidence connecting your condition to service.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
              <h3 className="font-display text-xl text-white mb-4 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-400" /> Missing Nexus Letter
              </h3>
              <p className="text-gray-300">No medical opinion linking your current condition to your military service.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
              <h3 className="font-display text-xl text-white mb-4 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-400" /> C&P Exam Issues
              </h3>
              <p className="text-gray-300">The C&P examiner didn't fully understand your condition or made errors.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
              <h3 className="font-display text-xl text-white mb-4 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-400" /> Incomplete Application
              </h3>
              <p className="text-gray-300">Missing documentation, service records, or buddy statements.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SSDIContent() {
  return (
    <>
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <DollarSign className="w-8 h-8 text-white" />
            <h2 className="font-display text-2xl md:text-3xl text-white">NO UPFRONT FEES - EVER</h2>
          </div>
          <p className="text-white/90 text-lg max-w-3xl mx-auto">
            SSDI attorneys work on contingency - you only pay if they win. 
            Fees capped at $7,200 by law.
          </p>
        </div>
      </div>

      <div className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full mb-6">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-bold uppercase tracking-wider text-sm">Social Security</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            SSDI FOR VETERANS
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            You can receive <strong className="text-white">BOTH VA disability AND SSDI</strong> at the same time. 
            They're separate programs - one doesn't affect the other.
          </p>
          <p className="text-lg text-brand-gold mb-8">
            Veterans with 100% P&T rating get EXPEDITED SSDI processing!
          </p>
          <Link href="/disability-rating/intake?type=ssdi">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-6 h-auto">
              Get Free SSDI Consultation <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="py-16 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-4">
            WHAT VETERANS NEED TO KNOW
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-display text-green-400 mb-2">BOTH</div>
              <h3 className="font-display text-lg text-white mb-2">VA + SSDI</h3>
              <p className="text-gray-400 text-sm">You can receive both benefits simultaneously.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-display text-brand-gold mb-2">70%</div>
              <h3 className="font-display text-lg text-white mb-2">DENIED</h3>
              <p className="text-gray-400 text-sm">First-time SSDI applicants are denied - attorneys help.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-display text-blue-400 mb-2">$7,200</div>
              <h3 className="font-display text-lg text-white mb-2">MAX FEE</h3>
              <p className="text-gray-400 text-sm">Attorney fees are capped by law at 25% or $7,200 max.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-display text-red-400 mb-2">FAST</div>
              <h3 className="font-display text-lg text-white mb-2">100% P&T</h3>
              <p className="text-gray-400 text-sm">Veterans rated 100% P&T get expedited processing.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function WidowContent() {
  return (
    <>
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-white" />
            <h2 className="font-display text-2xl md:text-3xl text-white">HONORING THEIR SACRIFICE</h2>
          </div>
          <p className="text-white/90 text-lg max-w-3xl mx-auto">
            DIC benefits help surviving spouses and dependents of veterans who died 
            from service-connected conditions.
          </p>
        </div>
      </div>

      <div className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full mb-6">
            <Heart className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-bold uppercase tracking-wider text-sm">Survivor Benefits</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            DEPENDENCY AND INDEMNITY COMPENSATION
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            If your spouse was a veteran who passed away from a service-connected condition, 
            you may be entitled to monthly DIC benefits.
          </p>
          <Link href="/disability-rating/intake?type=widow">
            <Button className="bg-purple-500 hover:bg-purple-600 text-white text-lg px-8 py-6 h-auto">
              Apply for DIC Benefits <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="py-16 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">
            WHO IS ELIGIBLE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl text-white mb-4">SURVIVING SPOUSES</h3>
              <p className="text-gray-300">Spouses of veterans who died from service-connected conditions or while on active duty.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl text-white mb-4">DEPENDENT CHILDREN</h3>
              <p className="text-gray-300">Unmarried children under 18, or 23 if in school, may be eligible for benefits.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl text-white mb-4">100% P&T SURVIVORS</h3>
              <p className="text-gray-300">If the veteran was rated 100% P&T for 10+ years before death, DIC may be available.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DisabilityBenefitsHub() {
  const [location, navigate] = useLocation();
  const [selectedService, setSelectedService] = useState("initial");

  useEffect(() => {
    const path = location.split("/").pop();
    const service = SERVICES.find(s => s.id === path);
    if (service) {
      setSelectedService(service.id);
    }
  }, [location]);

  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    navigate(`/disability-rating/${serviceId}`);
  };

  const renderContent = () => {
    switch (selectedService) {
      case "initial":
        return <InitialContent />;
      case "increase":
        return <IncreaseContent />;
      case "denial":
        return <DenialContent />;
      case "ssdi":
        return <SSDIContent />;
      case "widow":
        return <WidowContent />;
      default:
        return <InitialContent />;
    }
  };

  const currentService = SERVICES.find(s => s.id === selectedService) || SERVICES[0];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800">
        {/* Hero Section */}
        <div className="py-12 px-4 text-center border-b border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-10 h-10 text-brand-red" />
              <h1 className="font-display text-3xl md:text-4xl text-white">DISABILITY BENEFITS</h1>
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Select a service below to learn more and get started with your claim.
            </p>
          </div>
        </div>

        {/* Service Tabs - Desktop */}
        <div className="hidden md:block bg-slate-800/50 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center gap-1">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceChange(service.id)}
                  data-testid={`tab-${service.id}`}
                  className={`px-6 py-4 font-semibold text-sm transition-all border-b-2 ${
                    selectedService === service.id
                      ? 'text-white border-brand-red bg-white/5'
                      : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  {service.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Service Selector - Mobile */}
        <div className="md:hidden bg-slate-800/50 border-b border-white/10 py-4 px-4">
          <Select value={selectedService} onValueChange={handleServiceChange}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white w-full" data-testid="select-disability-service">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent className="z-[100] bg-white border shadow-lg">
              {SERVICES.map((service) => (
                <SelectItem key={service.id} value={service.id} data-testid={`option-${service.id}`}>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{service.label}</span>
                    <span className="text-xs text-gray-500">{service.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {renderContent()}

        <div className="py-16 px-4 bg-brand-red">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
              READY TO GET STARTED?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Our attorney partners are standing by to help you explore benefits you may be eligible for. 
              No upfront fees - ever.
            </p>
            <Link href={`/disability-rating/intake?type=${currentService.intakeType}`}>
              <Button className="bg-white text-brand-red hover:bg-gray-100 text-lg px-8 py-6 h-auto">
                Start Your {currentService.label} Claim <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
