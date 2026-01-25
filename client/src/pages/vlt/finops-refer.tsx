import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { CreditCard, Palette, Truck, Briefcase, Phone, Code, Wrench, PenTool, DollarSign, Users, TrendingUp } from "lucide-react";

export default function FinOpsRefer() {
  const opportunities = [
    { icon: CreditCard, title: "Merchant Services", desc: "Recurring Income", href: "/veteran-led-tax/services/merchant-services", borderClass: "border-brand-red", bgClass: "bg-brand-red", textClass: "text-brand-red", hoverClass: "hover:bg-brand-red/5" },
    { icon: Palette, title: "Design - MY LOCKER", desc: "Print-On-Demand", href: "/my-locker", borderClass: "border-brand-gold", bgClass: "bg-brand-gold", textClass: "text-brand-gold", hoverClass: "hover:bg-brand-gold/5" },
    { icon: Truck, title: "Shipping", desc: "24% Monthly Commissions", href: "/shipping", borderClass: "border-brand-blue", bgClass: "bg-brand-blue", textClass: "text-brand-blue", hoverClass: "hover:bg-brand-blue/5" },
  ];

  const services = [
    { icon: Briefcase, title: "Tax Preparation", href: "/veteran-led-tax/services/tax-preparation" },
    { icon: DollarSign, title: "Tax Resolution", href: "/veteran-led-tax/services/tax-resolution" },
    { icon: TrendingUp, title: "Tax Planning", href: "/veteran-led-tax/services/tax-planning" },
    { icon: Users, title: "Payroll Services", href: "/veteran-led-tax/services/payroll" },
    { icon: Code, title: "Bookkeeping", href: "/veteran-led-tax/services/bookkeeping" },
    { icon: Phone, title: "Fractional CFO", href: "/veteran-led-tax/services/fractional-cfo" },
    { icon: Wrench, title: "Entity Structuring", href: "/veteran-led-tax/services/entity-structuring" },
    { icon: PenTool, title: "Tax Credits", href: "/veteran-led-tax/services/tax-credits" },
  ];

  return (
    <>
      <Navbar />
      <Container>
        <div className="text-center mt-12">
          <h1 className="text-4xl font-bold text-brand-navy" data-testid="heading-finops-refer">Fin-Ops Refer & Earn</h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Earn commissions by referring clients to Veteran Led Tax Solutions. 
            Whether you're an affiliate partner or have clients who need tax services, we pay you for every referral.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-green-50 rounded-lg text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-brand-navy">Earn Commissions</h3>
            <p className="mt-2 text-gray-600">Get paid for every client you refer that closes</p>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-brand-navy">6-Level Deep Tracking</h3>
            <p className="mt-2 text-gray-600">Build a team and earn on 6 levels of referrals</p>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-brand-navy">Real-Time Portal</h3>
            <p className="mt-2 text-gray-600">Track all your leads and commissions in your affiliate portal</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 text-brand-navy">Fin-Ops Opportunities</h2>
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

        <h2 className="text-2xl font-bold mt-12 text-brand-navy">Tax & Accounting Services to Refer</h2>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((svc, i) => (
            <Link key={i} href={svc.href}>
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-brand-red cursor-pointer transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                  <svc.icon size={20} />
                </div>
                <span className="font-medium text-brand-navy text-sm">{svc.title}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-8 bg-brand-navy rounded-xl text-white text-center">
          <h3 className="text-2xl font-bold">Ready to Start Earning?</h3>
          <p className="mt-2 text-gray-300 max-w-xl mx-auto">
            Submit a referral for a client or become an affiliate partner to get your own referral code and tracking portal.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/veteran-led-tax/intake-refer">
              <span className="inline-block px-8 py-3 bg-brand-gold text-brand-navy font-bold rounded hover:bg-brand-gold/90 cursor-pointer">
                Submit a Client Referral
              </span>
            </Link>
            <Link href="/veteran-led-tax/affiliate">
              <span className="inline-block px-8 py-3 bg-white text-brand-navy font-bold rounded hover:bg-gray-100 cursor-pointer">
                Affiliate Portal Login
              </span>
            </Link>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}
