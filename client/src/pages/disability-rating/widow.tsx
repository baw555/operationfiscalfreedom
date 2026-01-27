import { Layout } from "@/components/layout";
import { Heart, Shield, FileText, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function DisabilityWidow() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800">
        {/* Hero Section */}
        <div className="relative py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full mb-6">
              <Heart className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-bold uppercase tracking-wider text-sm">Survivor Benefits</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              WIDOW(ER) BENEFITS
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Dependency and Indemnity Compensation (DIC) and other survivor benefits for 
              spouses and dependents of deceased veterans.
            </p>
          </div>
        </div>

        {/* Content Boxes Section */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Box 1 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">DIC BENEFITS</h3>
                <p className="text-gray-300">
                  [Your content here - Explain DIC benefits for survivors]
                </p>
              </div>

              {/* Box 2 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">WHO QUALIFIES</h3>
                <p className="text-gray-300">
                  [Your content here - Eligibility for survivor benefits]
                </p>
              </div>

              {/* Box 3 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">BENEFIT AMOUNTS</h3>
                <p className="text-gray-300">
                  [Your content here - Current DIC rates and additional benefits]
                </p>
              </div>

              {/* Box 4 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">HOW TO APPLY</h3>
                <p className="text-gray-300">
                  [Your content here - Application process for survivors]
                </p>
              </div>

              {/* Box 5 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">TIMELINE</h3>
                <p className="text-gray-300">
                  [Your content here - Expected processing time]
                </p>
              </div>

              {/* Box 6 - CTA */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">GET HELP</h3>
                <p className="text-white/90 mb-4">
                  Let us help you navigate survivor benefits with compassion and expertise.
                </p>
                <Link href="/get-help">
                  <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold">
                    Apply for Benefits
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
