import { Layout } from "@/components/layout";
import { FileText, Shield, CheckCircle, Users, DollarSign, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function DisabilityInitial() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800">
        {/* Hero Section */}
        <div className="relative py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-red/20 px-4 py-2 rounded-full mb-6">
              <FileText className="w-5 h-5 text-brand-red" />
              <span className="text-brand-red font-bold uppercase tracking-wider text-sm">Initial VA Rating</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              INITIAL VA DISABILITY CLAIM
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Get the rating you deserve. We don't charge upfront and we work with some of the 
              largest groups in the country that will pay referral fees even though they do not 
              charge for initial VA rating applications.
            </p>
          </div>
        </div>

        {/* No Upfront Fee Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <DollarSign className="w-10 h-10 text-white" />
              <h2 className="font-display text-3xl md:text-4xl text-white">NO UPFRONT FEES</h2>
            </div>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              NavigatorUSA connects you with accredited representatives who don't charge for initial claims. 
              You only benefit - there's no cost to you.
            </p>
          </div>
        </div>

        {/* Content Boxes Section */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Box 1 - What We Do */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">WHAT WE DO</h3>
                <p className="text-gray-300">
                  [Your content here - Describe your initial claim services]
                </p>
              </div>

              {/* Box 2 - How It Works */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">HOW IT WORKS</h3>
                <p className="text-gray-300">
                  [Your content here - Explain the process step by step]
                </p>
              </div>

              {/* Box 3 - Our Partners */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">OUR PARTNERS</h3>
                <p className="text-gray-300">
                  [Your content here - Describe your partner network]
                </p>
              </div>

              {/* Box 4 - Eligibility */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">WHO QUALIFIES</h3>
                <p className="text-gray-300">
                  [Your content here - List eligibility requirements]
                </p>
              </div>

              {/* Box 5 - Documents Needed */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">DOCUMENTS NEEDED</h3>
                <p className="text-gray-300">
                  [Your content here - List required documents]
                </p>
              </div>

              {/* Box 6 - Get Started */}
              <div className="bg-gradient-to-br from-brand-red to-red-700 rounded-xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">GET STARTED</h3>
                <p className="text-white/90 mb-4">
                  Ready to file your initial claim? Let us connect you with our trusted partners.
                </p>
                <Link href="/get-help">
                  <Button className="w-full bg-white text-brand-red hover:bg-gray-100 font-bold">
                    Start Your Claim
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="py-16 px-4 bg-black/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl text-white text-center mb-8">
              WHY CHOOSE NAVIGATORUSA?
            </h2>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
              <p className="text-gray-300 text-lg leading-relaxed">
                [Your content here - Add compelling reasons to work with NavigatorUSA for initial claims]
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
