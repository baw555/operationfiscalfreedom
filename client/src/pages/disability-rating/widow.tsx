import { Layout } from "@/components/layout";
import { Heart, Shield, FileText, CheckCircle, Clock, ArrowRight, DollarSign, AlertTriangle, Stethoscope, GraduationCap, Home } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function DisabilityWidow() {
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
              None of our attorneys or consulting companies charge upfront, if at all. 
              You only benefit - there's no cost to you.
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full mb-6">
              <Heart className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-bold uppercase tracking-wider text-sm">Survivor Benefits</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              WIDOW(ER) VA BENEFITS
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              A widow or widower may be eligible for U.S. Department of Veterans Affairs (VA) survivor benefits 
              if certain conditions are met. Let us help you navigate these important benefits.
            </p>
          </div>
        </div>

        {/* DIC Benefits Section */}
        <div className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl text-white text-center mb-8">
              1. DEPENDENCY AND INDEMNITY COMPENSATION (DIC)
            </h2>
            <p className="text-gray-300 text-center text-lg mb-8">
              This is the most important VA benefit for surviving spouses - a monthly, tax-free payment.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Eligibility Box */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">BASIC ELIGIBILITY</h3>
                <p className="text-gray-300 mb-3">The widow may qualify if:</p>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li>The veteran died from a service-connected condition, OR</li>
                  <li>The veteran was rated 100% disabled (or TDIU) for:
                    <ul className="ml-6 mt-2 space-y-1 list-disc list-inside">
                      <li>10 years before death, or</li>
                      <li>5 years from discharge to death, or</li>
                      <li>1 year if the veteran was a former POW</li>
                    </ul>
                  </li>
                </ul>
              </div>

              {/* Marriage Requirements Box */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">MARRIAGE REQUIREMENTS</h3>
                <p className="text-gray-300 mb-3">Married to the veteran:</p>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li>Before or during service, or</li>
                  <li>At least 1 year before death, or</li>
                  <li>Had a child together</li>
                </ul>
                <p className="text-gray-300 mt-4 font-semibold">
                  The widow has not remarried before age 57
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  (Remarriage after 57 may still allow DIC)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Survivors Pension Section */}
        <div className="py-12 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl text-white text-center mb-8">
              2. SURVIVORS PENSION (VA DEATH PENSION)
            </h2>
            <p className="text-gray-300 text-center text-lg mb-8">
              An income-based benefit providing monthly payments for low-income surviving spouses of wartime veterans.
            </p>
            
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl text-white mb-3">ELIGIBILITY</h3>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Veteran served at least 90 days of active duty with one day during a wartime period</li>
                <li>Widow has limited income and assets</li>
                <li>Widow has not remarried</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Benefits Grid */}
        <div className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl text-white text-center mb-8">
              ADDITIONAL SURVIVOR BENEFITS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CHAMPVA */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">3. VA HEALTH CARE (CHAMPVA)</h3>
                <p className="text-gray-300 mb-3">Health insurance for surviving spouses of veterans who:</p>
                <ul className="text-gray-300 space-y-1 list-disc list-inside text-sm">
                  <li>Died from a service-connected condition, or</li>
                  <li>Was permanently and totally disabled due to service</li>
                </ul>
                <p className="text-gray-300 mt-3 font-semibold">CHAMPVA covers:</p>
                <ul className="text-gray-400 space-y-1 list-disc list-inside text-sm">
                  <li>Doctor visits & prescriptions</li>
                  <li>Hospital care</li>
                  <li>Mental health services</li>
                </ul>
              </div>

              {/* Burial Benefits */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">4. BURIAL & FUNERAL BENEFITS</h3>
                <p className="text-gray-300 mb-3">VA may provide:</p>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li>Burial allowance</li>
                  <li>Grave marker or headstone</li>
                  <li>Burial in a national cemetery</li>
                </ul>
              </div>

              {/* Education & Other */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">5. EDUCATION & OTHER</h3>
                <p className="text-gray-300 mb-3">The widow may qualify for:</p>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li>Survivors' and Dependents' Educational Assistance (DEA / Chapter 35)</li>
                  <li>VA home loan guaranty</li>
                  <li>State-level veterans benefits (vary by state)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* How to Apply Section */}
        <div className="py-12 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl text-white text-center mb-8">
              HOW TO APPLY
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Application Methods */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">APPLICATION METHODS</h3>
                <ul className="text-gray-300 space-y-3">
                  <li><span className="font-semibold text-white">Online:</span> VA.gov</li>
                  <li><span className="font-semibold text-white">Mail:</span> VA Form 21P-534EZ</li>
                  <li><span className="font-semibold text-white">In person:</span> Local VA regional office</li>
                  <li><span className="font-semibold text-white">With help:</span>
                    <ul className="ml-4 mt-2 space-y-1 text-gray-400 list-disc list-inside">
                      <li>Veterans Service Organizations (VFW, American Legion, DAV)</li>
                      <li>Accredited VA claims agents or attorneys</li>
                    </ul>
                  </li>
                </ul>
              </div>

              {/* Documents Needed */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">DOCUMENTS USUALLY NEEDED</h3>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li>Veteran's DD-214</li>
                  <li>Marriage certificate</li>
                  <li>Veteran's death certificate</li>
                  <li>Medical records (if death was service-related)</li>
                  <li>Financial information (for pension)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Common Denial Reasons */}
        <div className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl text-white text-center mb-4">
              COMMON REASONS CLAIMS ARE DENIED
            </h2>
            <p className="text-gray-300 text-center text-lg mb-8">
              VA survivor claims are often denied for technical or evidence-related reasons, 
              not because the widow truly isn't eligible.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Denial Reason 1 */}
              <div className="bg-red-500/10 backdrop-blur border border-red-500/30 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">DEATH NOT PROVEN SERVICE-CONNECTED</h3>
                <p className="text-gray-300 mb-3">Most common denial reason. VA may say:</p>
                <ul className="text-gray-400 space-y-1 list-disc list-inside text-sm mb-4">
                  <li>The veteran's death was not caused by a service-connected condition</li>
                  <li>The condition causing death was never service-connected</li>
                  <li>No medical "nexus" linking service → condition → death</li>
                </ul>
                <p className="text-green-400 font-semibold">Common Fix:</p>
                <ul className="text-gray-300 space-y-1 list-disc list-inside text-sm">
                  <li>Medical opinion linking cause of death to service</li>
                  <li>Evidence of presumptive conditions (Agent Orange, burn pits, Gulf War, etc.)</li>
                  <li>Prior VA rating decisions or medical records</li>
                </ul>
              </div>

              {/* Denial Reason 2 */}
              <div className="bg-red-500/10 backdrop-blur border border-red-500/30 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">100% DISABILITY TIME REQUIREMENT</h3>
                <p className="text-gray-300 mb-3">VA denies DIC if:</p>
                <ul className="text-gray-400 space-y-1 list-disc list-inside text-sm mb-4">
                  <li>Veteran was not rated 100% disabled long enough</li>
                  <li>VA does not count TDIU unless it was permanent</li>
                </ul>
                <p className="text-green-400 font-semibold">Common Fix:</p>
                <ul className="text-gray-300 space-y-1 list-disc list-inside text-sm">
                  <li>Prove the veteran should have been rated 100% earlier</li>
                  <li>File a Clear and Unmistakable Error (CUE) claim if VA made a rating mistake</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 px-4 bg-gradient-to-r from-purple-900/50 to-purple-800/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
              LET US HELP YOU NAVIGATE SURVIVOR BENEFITS
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              We can help determine which benefits you may qualify for, walk you through the VA forms, 
              explain common denial reasons, and help if a claim was previously denied.
            </p>
            <Link href="/get-help">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 text-lg">
                <ArrowRight className="w-5 h-5 mr-2" />
                Get Help With Your Claim
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
