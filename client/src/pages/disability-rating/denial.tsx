import { Layout } from "@/components/layout";
import { XCircle, Shield, FileText, Scale, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function DisabilityDenial() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800">
        {/* Hero Section */}
        <div className="relative py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full mb-6">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-bold uppercase tracking-wider text-sm">Claim Denial</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              VA CLAIM DENIAL APPEALS
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Denied doesn't mean defeated. Many denied claims are eventually approved through the appeals process.
            </p>
          </div>
        </div>

        {/* Content Boxes Section */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Box 1 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">WHY CLAIMS GET DENIED</h3>
                <p className="text-gray-300">
                  [Your content here - Common reasons for denial]
                </p>
              </div>

              {/* Box 2 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">APPEAL OPTIONS</h3>
                <p className="text-gray-300">
                  [Your content here - Types of appeals available]
                </p>
              </div>

              {/* Box 3 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">NEW EVIDENCE</h3>
                <p className="text-gray-300">
                  [Your content here - How to submit new/stronger evidence]
                </p>
              </div>

              {/* Box 4 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">HOW WE HELP</h3>
                <p className="text-gray-300">
                  [Your content here - Your denial appeal services]
                </p>
              </div>

              {/* Box 5 */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">DEADLINES</h3>
                <p className="text-gray-300">
                  [Your content here - Important appeal deadlines]
                </p>
              </div>

              {/* Box 6 - CTA */}
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">FIGHT YOUR DENIAL</h3>
                <p className="text-white/90 mb-4">
                  Don't give up. Let us help you appeal your denied claim.
                </p>
                <Link href="/get-help">
                  <Button className="w-full bg-white text-red-600 hover:bg-gray-100 font-bold">
                    Start Your Appeal
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
