import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Shield, MessageSquare, Video, FileSignature, CheckCircle, Star, Lock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutNavPerks() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600/80 via-amber-500/60 to-amber-600/80" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Premium AI Suite</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight">
              About Nav Perks
            </h1>
            <div className="w-20 h-0.5 bg-amber-500/60 mx-auto mb-6" />
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Enterprise-grade AI tools built exclusively for veterans. Three powerful platforms, completely free.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Montage Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
              Your Command Center
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Three specialized platforms designed to serve your unique needs
            </p>
          </div>

          {/* Dashboard Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Operator AI Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-blue-400 mx-auto mb-3" strokeWidth={1.5} />
                    <div className="text-white font-medium">AI Chat Interface</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1">
                  <span className="text-blue-400 text-xs font-medium">GPT-4 Powered</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Operator AI</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Your intelligent assistant with 3-tier memory management. Private, secure conversations that never track or censor.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Session or Persistent Memory
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    No Data Tracking
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Uncensored Responses
                  </li>
                </ul>
                <Link href="/operator-ai">
                  <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
                    Launch Operator AI
                  </Button>
                </Link>
              </div>
            </div>

            {/* Video & Music Gen Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-purple-900 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-16 h-16 text-purple-400 mx-auto mb-3" strokeWidth={1.5} />
                    <div className="text-white font-medium">Media Pipeline</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-purple-500/20 border border-purple-400/30 rounded-full px-3 py-1">
                  <span className="text-purple-400 text-xs font-medium">AI Generation</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Video & Music Gen</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Naval Intelligence media orchestration. Transform documents into audio, create video montages, and generate AI content.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Document to Audio
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Video Montage Creation
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    AI Video Generation
                  </li>
                </ul>
                <Link href="/naval-intelligence">
                  <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
                    Launch Media Gen
                  </Button>
                </Link>
              </div>
            </div>

            {/* RANGER Card - Highlighted */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-amber-500 overflow-hidden group hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-amber-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-b-lg">
                  Featured
                </div>
              </div>
              <div className="h-48 bg-gradient-to-br from-amber-900 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <FileSignature className="w-16 h-16 text-amber-400 mx-auto mb-3" strokeWidth={1.5} />
                    <div className="text-white font-medium">E-Signature Platform</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1">
                  <span className="text-green-400 text-xs font-medium">HIPAA Compliant</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">RANGER</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Enterprise document signature platform with Fortune 500 authentication and AI-powered document analysis.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    HIPAA Compliant
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    AI Contract Analysis
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Secure PDF Generation
                  </li>
                </ul>
                <Link href="/document-signature">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium">
                    Launch RANGER
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RANGER Spotlight Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(251, 191, 36, 0.2) 0%, transparent 50%)`
        }} />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <Shield className="w-12 h-12 text-amber-500" strokeWidth={1.5} />
                <span className="text-4xl md:text-5xl font-semibold text-white tracking-tight">RANGER</span>
              </div>
              <h2 className="text-2xl md:text-3xl text-amber-400 font-medium mb-4">
                The Leading HIPAA Compliant Document Signature Platform
              </h2>
              <div className="w-20 h-0.5 bg-amber-500/60 mx-auto mb-6" />
              <p className="text-slate-400 text-lg leading-relaxed">
                Enterprise-grade security meets military precision. RANGER delivers Fortune 500 level document management—completely free for veterans.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">HIPAA Compliant</h3>
                </div>
                <p className="text-slate-400">
                  Full compliance with healthcare privacy regulations. Your documents are protected with bank-level encryption and secure handling protocols.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">AI-Powered Analysis</h3>
                </div>
                <p className="text-slate-400">
                  Advanced AI reviews contracts and documents, highlighting key terms, potential issues, and important clauses before you sign.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <FileSignature className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Secure E-Signatures</h3>
                </div>
                <p className="text-slate-400">
                  Legally binding electronic signatures with full audit trails. Send, sign, and track documents with enterprise-grade security.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Totally Free for Veterans</h3>
                </div>
                <p className="text-slate-400">
                  No hidden fees, no premium tiers. Every veteran gets full access to enterprise features at absolutely no cost.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link href="/document-signature">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-8 py-6 text-lg">
                  Get Started with RANGER
                </Button>
              </Link>
              <p className="text-slate-500 text-sm mt-4">
                <Link href="/hipaa-compliance" className="text-amber-500 hover:text-amber-400 transition-colors">
                  View HIPAA Compliance Details →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-4">
            Ready to Experience Nav Perks?
          </h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">
            Join thousands of veterans already using our premium AI tools. All platforms are completely free.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/operator-ai">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-white">
                Try Operator AI
              </Button>
            </Link>
            <Link href="/naval-intelligence">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-white">
                Try Media Gen
              </Button>
            </Link>
            <Link href="/document-signature">
              <Button className="bg-slate-800 hover:bg-slate-700 text-white">
                Try RANGER
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
