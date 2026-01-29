import { Layout } from "@/components/layout";
import { TrendingUp, Shield, CheckCircle, FileText, Clock, ArrowRight, DollarSign, Users, AlertTriangle, Star, Award } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function DisabilityIncrease() {
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
            <div className="inline-flex items-center gap-2 bg-brand-gold/20 px-4 py-2 rounded-full mb-6">
              <TrendingUp className="w-5 h-5 text-brand-gold" />
              <span className="text-brand-gold font-bold uppercase tracking-wider text-sm">Rating Increase</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              DON'T SETTLE FOR ANYTHING LESS THAN YOUR FULL BENEFITS
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              According to the VA, only 6.25 million of 18.25 million eligible Veterans are receiving benefits. 
              You may be entitled to a higher rating and increased compensation.
            </p>
            <Link href="/disability-rating/intake?type=increase">
              <Button className="bg-brand-gold hover:bg-brand-gold/90 text-white text-lg px-8 py-6 h-auto">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Facts About VA Claims */}
        <div className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-4">
              FACTS ABOUT VA CLAIMS
            </h2>
            <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
              There are several reasons why you and other Veterans aren't receiving what you're entitled to
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-brand-gold mb-2">138K+</div>
                <h3 className="font-display text-lg text-white mb-2">BACKLOGGED CLAIMS</h3>
                <p className="text-gray-400 text-sm">The VA claims inventory is backlogged, recently surpassing 644k claims.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-brand-gold mb-2">5+</div>
                <h3 className="font-display text-lg text-white mb-2">MONTHS WAIT</h3>
                <p className="text-gray-400 text-sm">Over 252k claims take over 5 months to reach an initial decision.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-brand-gold mb-2">494K+</div>
                <h3 className="font-display text-lg text-white mb-2">INCORRECT RATINGS</h3>
                <p className="text-gray-400 text-sm">Approximately 494k Veterans received incorrect ratings in 2025.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-brand-gold mb-2">3+</div>
                <h3 className="font-display text-lg text-white mb-2">YEARS TO APPEAL</h3>
                <p className="text-gray-400 text-sm">Just over half of appeals are completed within 3 years.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Let Us Guide You Section */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">
              LET US GUIDE YOU
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-4">VA DISABILITY BENEFITS MADE EASY</h3>
                <p className="text-gray-300">
                  Allow our knowledgeable case managers to guide you in compiling your claim for maximum results.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-4">ACHIEVE BETTER RESULTS</h3>
                <p className="text-gray-300">
                  Our partner companies have a 90% success rate guiding clients to receiving a favorable decision.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-4">FILE YOUR CLAIM CORRECTLY</h3>
                <p className="text-gray-300">
                  Veterans who work with our partners receive, on average, increases of an additional $1,300 per month.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/disability-rating/intake?type=increase">
                <Button className="bg-brand-gold hover:bg-brand-gold/90 text-white text-lg px-8 py-6 h-auto">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-4">
              HOW IT WORKS FOR YOU
            </h2>
            <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
              Get started with your free account. Our partners will review your documents and discuss your claim options. 
              <span className="text-brand-gold font-bold"> You only pay if you receive a favorable decision.</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4 text-white font-display text-xl">1</div>
                  <h3 className="font-display text-lg text-white mb-2">CREATE AN ACCOUNT</h3>
                  <p className="text-gray-400 text-sm">Submit your information and you'll be assigned to an intake specialist.</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-brand-gold" />
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4 text-white font-display text-xl">2</div>
                  <h3 className="font-display text-lg text-white mb-2">BUILD YOUR CLAIM</h3>
                  <p className="text-gray-400 text-sm">Case managers will review your documents and discuss your claim options.</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-brand-gold" />
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4 text-white font-display text-xl">3</div>
                  <h3 className="font-display text-lg text-white mb-2">MEDICAL EVALUATION</h3>
                  <p className="text-gray-400 text-sm">You'll be evaluated by an independent network provider for your conditions.</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-brand-gold" />
                </div>
              </div>
              
              <div>
                <div className="bg-gradient-to-br from-brand-gold to-yellow-600 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-display text-xl">4</div>
                  <h3 className="font-display text-lg text-white mb-2">VA DECISION</h3>
                  <p className="text-white/90 text-sm">We'll be by your side until the VA issues a rating decision and review it for accuracy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-4">
              WHAT VETERANS ARE SAYING
            </h2>
            <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
              Our process continues to earn high honors. Thousands of satisfied Veterans have improved their ratings with expert guidance.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "The process was amazing and very thorough. I got my 100% notification, and it was the best feeling coming from 60% previously. Totally worth it."
                </p>
                <p className="text-white font-bold">- L. Fletcher</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "I was very impressed with the outstanding customer service provided. After two months, I received my increased rating. It took me 16 years and numerous attempts only to be denied by the VA."
                </p>
                <p className="text-white font-bold">- Renee</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "After years of battling the VA and getting nowhere, I got the desired result I have been looking for! The timeline was beyond fast, and the process was extremely professional."
                </p>
                <p className="text-white font-bold">- Ben, U.S. Army</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-16 px-4 bg-gradient-to-r from-brand-gold/20 to-yellow-600/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
              READY TO EXPLORE YOUR POTENTIAL BENEFITS?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Connect with experienced partners who may be able to help with your claim.
            </p>
            <Link href="/disability-rating/intake?type=increase">
              <Button className="bg-brand-red hover:bg-brand-red/90 text-white text-xl px-12 py-6 h-auto">
                Start Your Rating Increase <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
