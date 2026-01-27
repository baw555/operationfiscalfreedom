import { Layout } from "@/components/layout";
import { Building2, Shield, FileText, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function DisabilitySSDI() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800">
        {/* Hero Section */}
        <div className="relative py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full mb-6">
              <Building2 className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-bold uppercase tracking-wider text-sm">Social Security</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              SSDI - SOCIAL SECURITY DISABILITY
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Social Security Disability Insurance benefits for veterans unable to work due to disability.
            </p>
          </div>
        </div>

        {/* Content Boxes Section */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Box 1 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">WHAT IS SSDI?</h3>
                <p className="text-gray-300">
                  [Your content here - Explain SSDI benefits]
                </p>
              </div>

              {/* Box 2 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">ELIGIBILITY</h3>
                <p className="text-gray-300">
                  [Your content here - Who qualifies for SSDI]
                </p>
              </div>

              {/* Box 3 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">VA + SSDI</h3>
                <p className="text-gray-300">
                  [Your content here - How VA and SSDI work together]
                </p>
              </div>

              {/* Box 4 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">APPLICATION PROCESS</h3>
                <p className="text-gray-300">
                  [Your content here - How to apply for SSDI]
                </p>
              </div>

              {/* Box 5 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">TIMELINE</h3>
                <p className="text-gray-300">
                  [Your content here - Expected timeline for SSDI]
                </p>
              </div>

              {/* Box 6 - CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">GET STARTED</h3>
                <p className="text-white/90 mb-4">
                  Need help with your SSDI application? We can connect you with experts.
                </p>
                <Link href="/get-help">
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold">
                    Apply for SSDI
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
