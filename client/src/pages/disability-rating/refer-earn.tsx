import { Layout } from "@/components/layout";
import { Gift, DollarSign, Users, Share2, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function DisabilityReferEarn() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800">
        {/* Hero Section */}
        <div className="relative py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full mb-6">
              <Gift className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-bold uppercase tracking-wider text-sm">Refer & Earn</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              REFER & EARN PROGRAM
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Help fellow veterans get the benefits they deserve while earning referral rewards.
            </p>
          </div>
        </div>

        {/* Earnings Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <DollarSign className="w-10 h-10 text-white" />
              <h2 className="font-display text-3xl md:text-4xl text-white">EARN REWARDS</h2>
            </div>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Refer veterans to our trusted partner network and earn referral bonuses for each successful claim.
            </p>
          </div>
        </div>

        {/* Content Boxes Section */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Box 1 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">HOW IT WORKS</h3>
                <p className="text-gray-300">
                  [Your content here - Explain the referral process]
                </p>
              </div>

              {/* Box 2 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">EARNING POTENTIAL</h3>
                <p className="text-gray-300">
                  [Your content here - Describe referral earnings]
                </p>
              </div>

              {/* Box 3 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">WHO CAN REFER</h3>
                <p className="text-gray-300">
                  [Your content here - Who can participate in the program]
                </p>
              </div>

              {/* Box 4 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">REQUIREMENTS</h3>
                <p className="text-gray-300">
                  [Your content here - What's required to participate]
                </p>
              </div>

              {/* Box 5 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">BONUS STRUCTURE</h3>
                <p className="text-gray-300">
                  [Your content here - Breakdown of referral bonuses]
                </p>
              </div>

              {/* Box 6 - CTA */}
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">JOIN NOW</h3>
                <p className="text-white/90 mb-4">
                  Start referring veterans today and earn rewards for helping others.
                </p>
                <Link href="/affiliate">
                  <Button className="w-full bg-white text-green-600 hover:bg-gray-100 font-bold">
                    Become a Referral Partner
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
