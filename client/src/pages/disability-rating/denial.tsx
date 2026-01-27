import { Layout } from "@/components/layout";
import { XCircle, Shield, FileText, Scale, Clock, ArrowRight, DollarSign, AlertTriangle, CheckCircle, Gavel, Star, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const animatedBannerStyles = `
  @keyframes slideInFromLeft {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slide-left {
    animation: slideInFromLeft 1.2s ease-out forwards;
  }
  .animate-slide-left-delayed {
    animation: slideInFromLeft 1.2s ease-out forwards;
    animation-delay: 0.6s;
    opacity: 0;
  }
`;

export default function DisabilityDenial() {
  return (
    <Layout>
      <style>{animatedBannerStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800">
        {/* Partners Banner - Animated */}
        <div className="bg-brand-navy py-4 px-4 border-b-2 border-brand-gold overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-xl md:text-2xl text-brand-gold mb-2 animate-slide-left">
              PARTNERS INCLUDE THE LARGEST LAW FIRMS IN THE USA
            </h2>
            <p className="font-display text-2xl md:text-3xl text-white animate-slide-left-delayed">
              YOU FOUGHT FOR US. <span className="text-brand-red">THEY FIGHT FOR YOU!</span>
            </p>
          </div>
        </div>

        {/* No Upfront Fee Banner - Top of Page */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 py-6 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <DollarSign className="w-8 h-8 text-white" />
              <h2 className="font-display text-2xl md:text-3xl text-white">NO UPFRONT FEES - EVER</h2>
            </div>
            <p className="text-white/90 text-lg max-w-3xl mx-auto">
              Our attorney partners work on contingency - you only pay if they win your appeal. 
              No upfront costs, no risk to you.
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full mb-6">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-bold uppercase tracking-wider text-sm">Claim Denial</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              DENIED? DON'T GIVE UP - FIGHT BACK
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Over one-third of VA disability claims were denied in 2024. But denied doesn't mean defeated. 
              Our attorney partners specialize in turning denials into approvals with up to 96% success rates.
            </p>
            <Link href="/disability-rating/intake?type=denial">
              <Button className="bg-red-500 hover:bg-red-600 text-white text-lg px-8 py-6 h-auto">
                Get Free Appeal Consultation <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Denial Statistics */}
        <div className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-4">
              THE REALITY OF VA CLAIM DENIALS
            </h2>
            <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
              You're not alone. These numbers show why having an experienced VA attorney on your side is critical.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-red-400 mb-2">36%</div>
                <h3 className="font-display text-lg text-white mb-2">CLAIMS DENIED</h3>
                <p className="text-gray-400 text-sm">More than one-third of VA disability claims were denied in 2024.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-brand-gold mb-2">1 Year</div>
                <h3 className="font-display text-lg text-white mb-2">APPEAL DEADLINE</h3>
                <p className="text-gray-400 text-sm">You have just 1 year from your denial date to file an appeal - don't wait.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-green-400 mb-2">96%</div>
                <h3 className="font-display text-lg text-white mb-2">ATTORNEY SUCCESS</h3>
                <p className="text-gray-400 text-sm">Top VA disability law firms report success rates up to 96%.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-display text-brand-gold mb-2">$0</div>
                <h3 className="font-display text-lg text-white mb-2">UPFRONT COST</h3>
                <p className="text-gray-400 text-sm">Contingency fees mean you pay nothing unless they win your appeal.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Three Appeal Paths */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-4">
              YOUR THREE APPEAL OPTIONS
            </h2>
            <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
              The VA offers three paths to appeal your denial. Our attorney partners will determine 
              which option gives you the best chance of success.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl text-white text-center mb-4">HIGHER-LEVEL REVIEW</h3>
                <div className="text-center mb-4">
                  <span className="text-green-400 font-bold text-2xl">~50%</span>
                  <span className="text-gray-400 text-sm block">Success Rate</span>
                </div>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Senior reviewer examines your case
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Average 141 days processing time
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Same evidence, fresh perspective
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl text-white text-center mb-4">SUPPLEMENTAL CLAIM</h3>
                <div className="text-center mb-4">
                  <span className="text-green-400 font-bold text-2xl">~50%</span>
                  <span className="text-gray-400 text-sm block">Success Rate</span>
                </div>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Submit new/relevant evidence
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Average 93 days processing time
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Add medical opinions, records
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Gavel className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl text-white text-center mb-4">BOARD OF VETERANS APPEALS</h3>
                <div className="text-center mb-4">
                  <span className="text-green-400 font-bold text-2xl">38%</span>
                  <span className="text-gray-400 text-sm block">Average Success Rate</span>
                </div>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Veterans Law Judge reviews case
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Option for live hearing
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    Best for complex cases
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* What Top Attorneys Do */}
        <div className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">
              WHAT OUR ATTORNEY PARTNERS DO FOR YOU
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg text-white mb-3">REVIEW DENIAL LETTERS</h3>
                <p className="text-gray-300 text-sm">
                  Carefully analyze your denial to identify VA errors, missing evidence, and the strongest grounds for appeal.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg text-white mb-3">GATHER CRITICAL EVIDENCE</h3>
                <p className="text-gray-300 text-sm">
                  Obtain medical records, service records, buddy statements, and expert medical opinions to strengthen your case.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg text-white mb-3">FILE LEGAL APPEALS</h3>
                <p className="text-gray-300 text-sm">
                  Prepare and submit professionally crafted appeals with proper legal arguments and supporting documentation.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg text-white mb-3">REPRESENT AT HEARINGS</h3>
                <p className="text-gray-300 text-sm">
                  Attend Board hearings in-person or via video conference to advocate directly for your benefits.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg text-white mb-3">PURSUE TDIU & SMC</h3>
                <p className="text-gray-300 text-sm">
                  Fight for Total Disability Individual Unemployability and Special Monthly Compensation when applicable.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg text-white mb-3">COURT OF APPEALS</h3>
                <p className="text-gray-300 text-sm">
                  If needed, escalate your case to the U.S. Court of Appeals for Veterans Claims for final review.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Common Denial Reasons */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">
              COMMON REASONS FOR DENIAL - AND HOW TO WIN
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-display text-lg text-white mb-2">No Service Connection</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      VA claims your condition isn't connected to military service.
                    </p>
                    <p className="text-green-400 text-sm">
                      <strong>Solution:</strong> Our attorneys obtain medical nexus letters and service records proving the connection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-display text-lg text-white mb-2">Insufficient Medical Evidence</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      VA says there's not enough evidence of your current disability.
                    </p>
                    <p className="text-green-400 text-sm">
                      <strong>Solution:</strong> We gather comprehensive medical records and arrange independent medical evaluations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-display text-lg text-white mb-2">C&P Exam Issues</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      The VA exam was inadequate, rushed, or examiner made errors.
                    </p>
                    <p className="text-green-400 text-sm">
                      <strong>Solution:</strong> Attorneys challenge flawed exams and request new evaluations with qualified examiners.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-display text-lg text-white mb-2">Rating Too Low</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      You were approved but with an inaccurate, lower rating than deserved.
                    </p>
                    <p className="text-green-400 text-sm">
                      <strong>Solution:</strong> We document how your symptoms meet the criteria for a higher rating.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-16 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">
              VETERANS WHO WON THEIR APPEALS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "It took me 16 years and numerous attempts only to be denied by the VA. Finally, after speaking with a coworker who referred me to this organization, I saw results."
                </p>
                <p className="text-white font-bold">- Renee, U.S. Army</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "After years of battling the VA and getting nowhere, I got the desired result. The timeline was beyond fast, and the process was extremely professional."
                </p>
                <p className="text-white font-bold">- Ben, U.S. Army</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "I was nearly a homeless Veteran, and thanks to getting help, I have a roof over my head and can provide for myself. I went 30 years without benefits."
                </p>
                <p className="text-white font-bold">- Todd W., U.S. Marine Corps</p>
              </div>
            </div>
          </div>
        </div>

        {/* Urgency - 1 Year Deadline */}
        <div className="py-12 px-4 bg-red-600/20 border-y border-red-500/30">
          <div className="max-w-4xl mx-auto text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl text-white mb-4">
              DON'T MISS YOUR 1-YEAR APPEAL DEADLINE
            </h2>
            <p className="text-gray-300 mb-6">
              You have exactly one year from your denial date to file an appeal. 
              Missing this deadline could mean losing your right to benefits forever.
            </p>
            <Link href="/disability-rating/intake?type=denial">
              <Button className="bg-red-500 hover:bg-red-600 text-white text-lg px-8 py-4">
                Start Your Free Appeal Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
              READY TO FIGHT YOUR DENIAL?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Get connected with top VA disability attorneys who specialize in turning denials into approvals. 
              Free consultation, no upfront fees, and you only pay if they win.
            </p>
            <Link href="/disability-rating/intake?type=denial">
              <Button className="bg-brand-red hover:bg-brand-red/90 text-white text-xl px-12 py-6 h-auto">
                Get Free Appeal Consultation <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <p className="text-gray-400 text-sm mt-6">
              Contingency fees typically 20-33% of back pay only if successful. No win, no fee.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
