import { Layout } from "@/components/layout";
import { TrendingUp, Shield, CheckCircle, FileText, Clock, ArrowRight, DollarSign } from "lucide-react";
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
              VA RATING INCREASE
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Your condition has worsened? You may be entitled to a higher rating and increased benefits.
            </p>
          </div>
        </div>

        {/* Content Boxes Section */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Box 1 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-brand-gold rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">WHEN TO REQUEST</h3>
                <p className="text-gray-300">
                  [Your content here - When should a veteran request an increase]
                </p>
              </div>

              {/* Box 2 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-brand-gold rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">HOW WE HELP</h3>
                <p className="text-gray-300">
                  [Your content here - Describe your increase claim services]
                </p>
              </div>

              {/* Box 3 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-brand-gold rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">EVIDENCE NEEDED</h3>
                <p className="text-gray-300">
                  [Your content here - What evidence supports an increase]
                </p>
              </div>

              {/* Box 4 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-brand-gold rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">COMMON CONDITIONS</h3>
                <p className="text-gray-300">
                  [Your content here - List conditions that commonly get increases]
                </p>
              </div>

              {/* Box 5 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-brand-gold rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">TIMELINE</h3>
                <p className="text-gray-300">
                  [Your content here - Expected timeline for increase claims]
                </p>
              </div>

              {/* Box 6 - CTA */}
              <div className="bg-gradient-to-br from-brand-gold to-yellow-600 rounded-xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">REQUEST INCREASE</h3>
                <p className="text-white/90 mb-4">
                  Ready to request a rating increase? Get connected with experts today.
                </p>
                <Link href="/get-help">
                  <Button className="w-full bg-white text-brand-gold hover:bg-gray-100 font-bold">
                    Start Your Request
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
