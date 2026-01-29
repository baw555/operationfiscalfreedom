import { Layout } from "@/components/layout";
import { FileText, Shield, CheckCircle, Users, DollarSign, Clock, ArrowRight, Award, Scale, Star, TrendingUp, Gavel } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function DisabilityInitial() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800">
        {/* No Upfront Fee Banner - Top of Page */}
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

        {/* Hero Section */}
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
              who will help you file your initial claim at absolutely no cost. Pursue the benefits you may be eligible for 
              from day one with expert legal guidance.
            </p>
            <Link href="/disability-rating/intake?type=initial">
              <Button className="bg-brand-red hover:bg-brand-red/90 text-white text-lg px-8 py-6 h-auto">
                Get Free Attorney Help <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Why Use an Attorney Statistics */}
        <div className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-4">
              WHY SPECIALIZED ATTORNEYS MATTER
            </h2>
            <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
              The numbers don't lie. Veterans who work with specialized VA disability attorneys 
              see significantly better outcomes than those who file alone.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-brand-red mb-2">36%</div>
                <h3 className="font-display text-lg text-white mb-2">CLAIMS DENIED</h3>
                <p className="text-gray-400 text-sm">Over one-third of VA disability claims were denied in 2024 - don't be one of them.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-green-400 mb-2">96%</div>
                <h3 className="font-display text-lg text-white mb-2">ATTORNEY SUCCESS</h3>
                <p className="text-gray-400 text-sm">Top VA disability law firms report success rates as high as 96%.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-brand-red mb-2">20%</div>
                <h3 className="font-display text-lg text-white mb-2">HIGHER APPROVAL</h3>
                <p className="text-gray-400 text-sm">Veterans with attorney representation show 15-20% higher approval rates at appeal.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-green-400 mb-2">2.5M+</div>
                <h3 className="font-display text-lg text-white mb-2">CLAIMS PROCESSED</h3>
                <p className="text-gray-400 text-sm">Record-breaking claims processed in 2024 - competition for ratings is fierce.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Free Attorney Services */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">
              WHAT YOU GET - COMPLETELY FREE
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Scale className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-4">TOP LEGAL EXPERTISE</h3>
                <p className="text-gray-300">
                  Our attorney partners are among the nation's leading VA disability specialists with decades of combined experience navigating the VA system.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-4">COMPLETE CLAIM FILING</h3>
                <p className="text-gray-300">
                  From gathering evidence to completing forms to submitting your claim - our partners handle every step of your initial VA disability application.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-4">ZERO COST - EVER</h3>
                <p className="text-gray-300">
                  Unlike increases or appeals, initial claims are filed completely FREE. Our partners don't charge you anything - no hidden fees, no percentage of your benefits.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-4">
              HOW FREE ATTORNEY HELP WORKS
            </h2>
            <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
              Getting expert legal help for your initial claim is simple. Here's the process:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4 text-white font-display text-xl">1</div>
                  <h3 className="font-display text-lg text-white mb-2">SUBMIT YOUR INFO</h3>
                  <p className="text-gray-400 text-sm">Complete our quick intake form with your basic information and service details.</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-brand-red" />
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4 text-white font-display text-xl">2</div>
                  <h3 className="font-display text-lg text-white mb-2">FREE CONSULTATION</h3>
                  <p className="text-gray-400 text-sm">A specialized VA attorney or advocate will contact you to discuss your case at no charge.</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-brand-red" />
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4 text-white font-display text-xl">3</div>
                  <h3 className="font-display text-lg text-white mb-2">CLAIM PREPARATION</h3>
                  <p className="text-gray-400 text-sm">Your attorney gathers evidence, obtains medical records, and builds the strongest possible case.</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-brand-red" />
                </div>
              </div>
              
              <div>
                <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-display text-xl">4</div>
                  <h3 className="font-display text-lg text-white mb-2">CLAIM FILED</h3>
                  <p className="text-white/90 text-sm">Your complete claim is submitted to the VA, professionally prepared for maximum approval chances.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Attorneys vs Going Alone */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">
              ATTORNEY REPRESENTATION VS. GOING ALONE
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8">
                <h3 className="font-display text-2xl text-red-400 mb-6 flex items-center gap-3">
                  <span className="text-3xl">✕</span> Filing Without Help
                </h3>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    36% of claims denied - you're on your own navigating complex VA requirements
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    Risk of missing critical evidence that could increase your rating
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    Confusing forms and terminology with no guidance
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    Years of potential benefits lost to errors or omissions
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    May receive less than you may be entitled to
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8">
                <h3 className="font-display text-2xl text-green-400 mb-6 flex items-center gap-3">
                  <span className="text-3xl">✓</span> With Our Attorney Partners
                </h3>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    Up to 96% success rate with specialized VA disability attorneys
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    Expert evidence gathering to maximize your rating from day one
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    Every form completed correctly by legal professionals
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    Medical nexus letters and supporting documentation prepared
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    100% FREE for initial claims - you pay nothing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Who Qualifies */}
        <div className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">
              WHO QUALIFIES FOR FREE ATTORNEY HELP
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="font-display text-lg text-white mb-2">VETERANS</h3>
                <p className="text-gray-400 text-sm">Any veteran who served on active duty and has not yet filed an initial VA disability claim.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="font-display text-lg text-white mb-2">ALL BRANCHES</h3>
                <p className="text-gray-400 text-sm">Army, Navy, Air Force, Marines, Coast Guard, Space Force, National Guard, and Reserves.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="font-display text-lg text-white mb-2">ANY CONDITION</h3>
                <p className="text-gray-400 text-sm">Physical injuries, mental health conditions, hearing loss, toxic exposure, and more.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="font-display text-lg text-white mb-2">ANY ERA</h3>
                <p className="text-gray-400 text-sm">Vietnam, Gulf War, Iraq, Afghanistan, peacetime service - all eras welcome.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-16 px-4 bg-gradient-to-r from-green-600/20 to-green-700/20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full mb-6">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-bold uppercase tracking-wider text-sm">100% Free Service</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
              GET YOUR INITIAL CLAIM FILED BY TOP ATTORNEYS - FREE
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Don't risk filing alone. Let the nation's leading VA disability attorneys handle your 
              initial claim at absolutely no cost to you.
            </p>
            <Link href="/disability-rating/intake?type=initial">
              <Button className="bg-green-500 hover:bg-green-600 text-white text-xl px-12 py-6 h-auto">
                Start Your Free Claim <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <p className="text-gray-400 text-sm mt-6">
              No credit card. No fees. No obligation. Just free expert help for your initial VA claim.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
