import { Layout } from "@/components/layout";
import { Building2, Shield, FileText, CheckCircle, Clock, ArrowRight, DollarSign, AlertTriangle, Star, Users, Zap, Phone, Globe, MapPin, Award, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function DisabilitySSDI() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800">
        {/* No Upfront Fee Banner - Top of Page */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 py-6 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <DollarSign className="w-8 h-8 text-white" />
              <h2 className="font-display text-2xl md:text-3xl text-white">NO UPFRONT FEES - EVER</h2>
            </div>
            <p className="text-white/90 text-lg max-w-3xl mx-auto">
              Our SSDI attorney partners work on contingency - you only pay if they win. 
              Fees capped at $7,200 by law. No upfront costs, no risk to you.
            </p>
          </div>
        </div>

        {/* Hero Section */}
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

        {/* Key Facts for Veterans */}
        <div className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-4">
              WHAT VETERANS NEED TO KNOW
            </h2>
            <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
              SSDI is a completely separate program from VA disability - you can and should apply for both.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-green-400 mb-2">BOTH</div>
                <h3 className="font-display text-lg text-white mb-2">VA + SSDI</h3>
                <p className="text-gray-400 text-sm">You can receive both benefits simultaneously - they don't reduce each other.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-brand-gold mb-2">70%</div>
                <h3 className="font-display text-lg text-white mb-2">DENIED</h3>
                <p className="text-gray-400 text-sm">First-time SSDI applicants are denied - having an attorney nearly doubles success rates.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-blue-400 mb-2">$7,200</div>
                <h3 className="font-display text-lg text-white mb-2">MAX FEE</h3>
                <p className="text-gray-400 text-sm">Attorney fees are capped by law at 25% of back pay or $7,200 max (2025).</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-red-400 mb-2">FAST</div>
                <h3 className="font-display text-lg text-white mb-2">100% P&T</h3>
                <p className="text-gray-400 text-sm">Veterans rated 100% Permanent & Total get expedited SSDI processing.</p>
              </div>
            </div>
          </div>
        </div>

        {/* VA vs SSDI Comparison */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">
              VA DISABILITY vs. SSDI - KEY DIFFERENCES
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-brand-navy/50 border-2 border-blue-500 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-10 h-10 text-blue-400" />
                  <h3 className="font-display text-2xl text-white">VA DISABILITY</h3>
                </div>
                <ul className="text-gray-300 space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">Service-connected only</strong> - Must be related to military service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">Rated 0-100%</strong> - Graduated scale, partial disability allowed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">Can still work</strong> - Employment doesn't affect benefits</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">Tax-free</strong> - VA disability compensation is not taxed</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-brand-navy/50 border-2 border-purple-500 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-10 h-10 text-purple-400" />
                  <h3 className="font-display text-2xl text-white">SSDI</h3>
                </div>
                <ul className="text-gray-300 space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">Any disabling condition</strong> - Doesn't need to be service-connected</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">Total disability required</strong> - Must be unable to work for 12+ months</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">Work credits needed</strong> - Based on your work history (5 of last 10 years)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-white">Includes Medicare</strong> - After 24 months, you qualify for Medicare</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Expedited Processing */}
        <div className="py-12 px-4 bg-brand-gold/20 border-y border-brand-gold/30">
          <div className="max-w-4xl mx-auto text-center">
            <Zap className="w-12 h-12 text-brand-gold mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl text-white mb-4">
              EXPEDITED PROCESSING FOR VETERANS
            </h2>
            <p className="text-gray-300 mb-6">
              The SSA offers fast-track processing for qualifying veterans:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-left">
                <h3 className="font-display text-xl text-brand-gold mb-3">WOUNDED WARRIORS</h3>
                <p className="text-gray-300 text-sm">
                  Veterans who suffered disabling injuries on active duty <strong className="text-white">on or after October 1, 2001</strong> qualify for expedited processing.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-left">
                <h3 className="font-display text-xl text-brand-gold mb-3">100% P&T RATING</h3>
                <p className="text-gray-300 text-sm">
                  Veterans with a <strong className="text-white">100% Permanent & Total VA disability rating</strong> get priority processing. Submit your VA rating letter with your application.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top SSDI Firms */}
        <div className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-4">
              WE CONNECT YOU WITH TOP SSDI FIRMS
            </h2>
            <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
              Our partner network includes the nation's most successful SSDI law firms with decades of experience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-10 h-10 text-brand-gold" />
                  <div>
                    <h3 className="font-display text-lg text-white">40+ YEARS</h3>
                    <p className="text-gray-400 text-sm">Experience</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Our partners have helped over <strong className="text-white">400,000 people</strong> secure SSDI benefits through dedicated claims specialists.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-10 h-10 text-brand-gold" />
                  <div>
                    <h3 className="font-display text-lg text-white">55,000+</h3>
                    <p className="text-gray-400 text-sm">Cases Won</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Firms with <strong className="text-white">130+ combined years</strong> of Social Security disability experience winning thousands of cases annually.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-10 h-10 text-brand-gold" />
                  <div>
                    <h3 className="font-display text-lg text-white">$100M+</h3>
                    <p className="text-gray-400 text-sm">Benefits Secured</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Top-rated firms that have secured over <strong className="text-white">$100 million</strong> in disability benefits for their clients.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Process */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">
              HOW TO APPLY FOR SSDI
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">ONLINE</h3>
                <p className="text-gray-300 text-sm">
                  Apply at ssa.gov/applyfordisability - save progress and complete at your own pace.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">BY PHONE</h3>
                <p className="text-gray-300 text-sm">
                  Call 1-800-772-1213 to schedule an appointment with an SSA representative.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">IN PERSON</h3>
                <p className="text-gray-300 text-sm">
                  Visit your local Social Security field office with an appointment to avoid wait times.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility Requirements */}
        <div className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">
              SSDI ELIGIBILITY REQUIREMENTS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg text-white mb-3">WORK HISTORY</h3>
                <p className="text-gray-300 text-sm">
                  Must have worked at least <strong className="text-white">5 out of the last 10 years</strong> in jobs covered by Social Security. Need 40 work credits total (20 earned in the last 10 years).
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg text-white mb-3">MEDICAL CRITERIA</h3>
                <p className="text-gray-300 text-sm">
                  Unable to work due to a medical condition expected to last <strong className="text-white">at least 12 months</strong> or result in death. SSA considers ALL conditions together.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg text-white mb-3">INCOME LIMITS</h3>
                <p className="text-gray-300 text-sm">
                  Earnings must be below the Substantial Gainful Activity (SGA) limit - approximately <strong className="text-white">$1,550/month in 2025</strong> for non-blind individuals.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg text-white mb-3">DOCUMENTS NEEDED</h3>
                <p className="text-gray-300 text-sm">
                  Social Security number, medical records, VA rating letter (if applicable), work history, and list of all treating doctors and medications.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">
              VETERANS WHO GOT THEIR SSDI
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "I was already receiving VA disability but didn't know I could also get SSDI. The attorney handled everything and I now receive both - it changed my family's life."
                </p>
                <p className="text-white font-bold">- James T., U.S. Army</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "I applied twice on my own and was denied both times. Got connected with an attorney who won my case at the hearing level. The back pay alone was life-changing."
                </p>
                <p className="text-white font-bold">- Maria S., U.S. Navy</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "My 100% P&T rating helped expedite my SSDI claim. The process was much faster than I expected, and now I have both VA and SSDI coming in each month."
                </p>
                <p className="text-white font-bold">- Robert K., U.S. Marine Corps</p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning - Don't Wait */}
        <div className="py-12 px-4 bg-red-600/20 border-y border-red-500/30">
          <div className="max-w-4xl mx-auto text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl text-white mb-4">
              DON'T WAIT - YOU COULD LOSE ELIGIBILITY
            </h2>
            <p className="text-gray-300 mb-6">
              Work credits expire over time. The longer you wait to apply, the more credits you could lose - 
              potentially making you ineligible for SSDI benefits you've already earned.
            </p>
            <Link href="/disability-rating/intake?type=ssdi">
              <Button className="bg-red-500 hover:bg-red-600 text-white text-lg px-8 py-4">
                Apply Now - Don't Lose Benefits
              </Button>
            </Link>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
              READY TO GET YOUR SSDI BENEFITS?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Get connected with top SSDI attorneys who specialize in helping veterans. 
              Free consultation, no upfront fees, and you only pay if they win.
            </p>
            <Link href="/disability-rating/intake?type=ssdi">
              <Button className="bg-brand-red hover:bg-brand-red/90 text-white text-xl px-12 py-6 h-auto">
                Get Free SSDI Consultation <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <p className="text-gray-400 text-sm mt-6">
              Attorney fees capped at 25% of back pay or $7,200 maximum (2025). No win, no fee.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
