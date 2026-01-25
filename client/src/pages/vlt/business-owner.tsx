import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { CreditCard, Palette, Truck, Briefcase, Phone, Code, Wrench, PenTool, DollarSign, Users, TrendingUp, Shield, Clock, Award } from "lucide-react";

export default function BusinessOwner() {
  const opportunities = [
    { icon: CreditCard, title: "Merchant Services", desc: "Save on Processing", href: "/veteran-led-tax/services/merchant-services", borderClass: "border-brand-red", bgClass: "bg-brand-red", textClass: "text-brand-red", hoverClass: "hover:bg-brand-red/5" },
    { icon: Palette, title: "Design - MY LOCKER", desc: "Print-On-Demand", href: "/my-locker", borderClass: "border-brand-gold", bgClass: "bg-brand-gold", textClass: "text-brand-gold", hoverClass: "hover:bg-brand-gold/5" },
    { icon: Truck, title: "Shipping", desc: "Discounted Rates", href: "/shipping", borderClass: "border-brand-blue", bgClass: "bg-brand-blue", textClass: "text-brand-blue", hoverClass: "hover:bg-brand-blue/5" },
  ];

  const services = [
    { icon: Briefcase, title: "Tax Preparation", href: "/veteran-led-tax/services/tax-preparation", desc: "Business & Personal" },
    { icon: DollarSign, title: "Tax Resolution", href: "/veteran-led-tax/services/tax-resolution", desc: "IRS Problem Solving" },
    { icon: TrendingUp, title: "Tax Planning", href: "/veteran-led-tax/services/tax-planning", desc: "Strategic Savings" },
    { icon: Users, title: "Payroll Services", href: "/veteran-led-tax/services/payroll", desc: "Full-Service Payroll" },
    { icon: Code, title: "Bookkeeping", href: "/veteran-led-tax/services/bookkeeping", desc: "Monthly Accounting" },
    { icon: Phone, title: "Fractional CFO", href: "/veteran-led-tax/services/fractional-cfo", desc: "Executive Finance" },
    { icon: Wrench, title: "Entity Structuring", href: "/veteran-led-tax/services/entity-structuring", desc: "LLC, S-Corp, C-Corp" },
    { icon: PenTool, title: "Tax Credits", href: "/veteran-led-tax/services/tax-credits", desc: "R&D, WOTC, FICA & More" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mt-12">
          <h1 className="text-4xl font-bold text-brand-navy" data-testid="heading-business-owner">Veteran Business Owner Services</h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive tax and financial services built for veteran-owned businesses. 
            Led by a highly decorated Air Force veteran commanding officer.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg text-center">
            <div className="w-16 h-16 bg-brand-navy rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-brand-navy">Veteran-Led</h3>
            <p className="mt-2 text-gray-600">We understand the unique challenges veteran business owners face</p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-brand-navy">Maximize Savings</h3>
            <p className="mt-2 text-gray-600">We find every credit and deduction you're entitled to</p>
          </div>
          <div className="p-6 bg-red-50 rounded-lg text-center">
            <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-brand-navy">Fast Response</h3>
            <p className="mt-2 text-gray-600">Get a response within 24-48 hours from our team</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 text-brand-navy">Business Opportunities</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {opportunities.map((opp, i) => (
            <Link key={i} href={opp.href}>
              <div className={`flex items-center gap-4 p-6 border-2 ${opp.borderClass} rounded-lg ${opp.hoverClass} cursor-pointer transition-colors`}>
                <div className={`w-12 h-12 ${opp.bgClass} rounded flex items-center justify-center text-white`}>
                  <opp.icon size={24} />
                </div>
                <div>
                  <h3 className={`font-bold ${opp.textClass}`}>{opp.title}</h3>
                  <p className="text-sm text-gray-500">{opp.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-12 text-brand-navy">Our Services</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((svc, i) => (
            <Link key={i} href={svc.href}>
              <div className="flex items-center gap-4 p-5 border border-gray-200 rounded-lg hover:border-brand-red cursor-pointer transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                  <svc.icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-navy">{svc.title}</h3>
                  <p className="text-sm text-gray-500">{svc.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-8 bg-brand-navy rounded-xl text-white text-center">
          <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
          <p className="mt-2 text-gray-300 max-w-xl mx-auto">
            Tell us about your business and tax needs. Our team will review your situation and reach out within 24-48 hours.
          </p>
          <Link href="/veteran-led-tax/intake-client">
            <span className="inline-block mt-6 px-8 py-3 bg-brand-red text-white font-bold rounded hover:bg-brand-red/90 cursor-pointer">
              Request a Free Consultation
            </span>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <Award className="w-12 h-12 text-brand-gold" />
            <div>
              <h3 className="font-bold text-brand-navy">Veteran-Owned Business Certification Support</h3>
              <p className="text-gray-600">We can help you navigate SDVOSB, VOSB, and other veteran certification programs.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
