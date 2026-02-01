import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Shield, MessageSquare, Video, FileSignature, CheckCircle, Star, Lock, Award, Users, Zap, DollarSign, Brain, Mic, Film, Heart, ChevronRight, BadgeCheck, ShieldCheck, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import operatorAiScreenshot from "@/assets/images/operator-ai-screenshot.png";
import navalIntelligenceScreenshot from "@/assets/images/naval-intelligence-screenshot.png";
import rangerScreenshot from "@/assets/images/ranger-screenshot.png";

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
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-4">
              Enterprise-grade AI tools built exclusively for veterans. Three powerful platforms, completely free.
            </p>
            <p className="text-slate-300 text-base leading-relaxed max-w-3xl mx-auto mb-8 bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              We are constantly adding more software to our stack that is either no strings attached free (like RANGER), no cost for active members or low / at cost. All of our software is for you, not for us! <span className="text-amber-400 font-semibold">We will never sell your information and we do not store your search history!</span>
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/operator-ai">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                  Get Started Free
                </Button>
              </Link>
              <a href="#platforms">
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  Explore Platforms
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Nav Perks Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 mb-6">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-slate-600 text-sm font-medium">Our Mission</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-6">
                  Why We Built Nav Perks
                </h2>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Veterans deserve access to the same powerful tools that Fortune 500 companies use—without the enterprise price tag. Nav Perks was built with one goal: <span className="font-semibold text-slate-800">give veterans the technology advantage they earned.</span>
                </p>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  While other companies charge $200-500/month for AI assistants, document signing platforms, and media tools, we believe those who served our country shouldn't have to choose between paying bills and accessing critical technology.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-3xl font-bold text-amber-500 mb-1">$0</div>
                    <div className="text-sm text-slate-500">Forever Free</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-3xl font-bold text-amber-500 mb-1">3</div>
                    <div className="text-sm text-slate-500">Enterprise Platforms</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-3xl font-bold text-amber-500 mb-1">100%</div>
                    <div className="text-sm text-slate-500">HIPAA Compliant</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-3xl font-bold text-amber-500 mb-1">24/7</div>
                    <div className="text-sm text-slate-500">Always Available</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">Operator AI</div>
                        <div className="text-sm text-slate-500">Private AI Assistant</div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">Video & Music Gen</div>
                        <div className="text-sm text-slate-500">AI Media Creation</div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border-2 border-amber-400">
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <FileSignature className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">RANGER</div>
                        <div className="text-sm text-slate-500">Document Signatures</div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <span className="text-sm text-slate-500">All platforms included • No credit card required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Montage Section */}
      <section id="platforms" className="py-20 bg-slate-50">
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
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={operatorAiScreenshot} 
                  alt="Operator AI Dashboard" 
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-4 right-4 bg-blue-500/90 border border-blue-400/30 rounded-full px-3 py-1">
                  <span className="text-white text-xs font-medium">Choose Your AI Plan</span>
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
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={navalIntelligenceScreenshot} 
                  alt="Video & Music Gen Dashboard" 
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-4 right-4 bg-purple-500/90 border border-purple-400/30 rounded-full px-3 py-1">
                  <span className="text-white text-xs font-medium">AI Generation</span>
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
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={rangerScreenshot} 
                  alt="RANGER E-Signature Dashboard" 
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-4 right-4 bg-green-500/90 border border-green-400/30 rounded-full px-3 py-1">
                  <span className="text-white text-xs font-medium">HIPAA Compliant</span>
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

      {/* Deep Dive: Operator AI */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <img 
                  src={operatorAiScreenshot} 
                  alt="Operator AI Interface" 
                  className="rounded-xl shadow-2xl border border-slate-200"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-6">
                  <Brain className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-600 text-sm font-medium">AI Assistant</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-6">
                  Operator AI: Your Private Intelligence
                </h2>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Unlike ChatGPT and other AI services that track your conversations and use your data for training, Operator AI is built with veteran privacy as the #1 priority.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Lock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">3-Tier Memory Control</h4>
                      <p className="text-slate-500 text-sm">Choose OFF (no memory), SESSION (clears on logout), or PERSISTENT (remembers everything). You're in complete control.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Zero Tracking Policy</h4>
                      <p className="text-slate-500 text-sm">We don't sell your data, we don't train on your conversations, and we don't share with third parties. Period.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Uncensored Responses</h4>
                      <p className="text-slate-500 text-sm">Get real answers without corporate over-filtering. Designed for adults who need straight talk.</p>
                    </div>
                  </div>
                </div>
                <Link href="/operator-ai">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Try Operator AI <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive: Video & Music Gen */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-purple-50 rounded-full px-4 py-2 mb-6">
                  <Film className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-600 text-sm font-medium">Media Pipeline</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-6">
                  Naval Intelligence: AI Media Orchestration
                </h2>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Transform your content with military-grade AI. From documents to podcasts, photos to videos—our media pipeline handles the heavy lifting.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Mic className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Document to Audio</h4>
                      <p className="text-slate-500 text-sm">Upload any document and get a professional AI-narrated audio version. Perfect for learning on the go.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Video className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Video Montage Creation</h4>
                      <p className="text-slate-500 text-sm">Upload images and get a polished video montage with transitions, effects, and soundtrack.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">AI Video Generation</h4>
                      <p className="text-slate-500 text-sm">Describe what you want and let AI generate unique video content from scratch.</p>
                    </div>
                  </div>
                </div>
                <Link href="/naval-intelligence">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Try Media Gen <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div>
                <img 
                  src={navalIntelligenceScreenshot} 
                  alt="Naval Intelligence Interface" 
                  className="rounded-xl shadow-2xl border border-slate-200"
                />
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
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Featured Platform</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                  RANGER: The Leading HIPAA Compliant Document Signature Platform
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-6">
                  Enterprise-grade security meets military precision. RANGER delivers Fortune 500 level document management—<span className="text-amber-400 font-semibold">completely free for veterans.</span>
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1">
                    <BadgeCheck className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">HIPAA Compliant</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-3 py-1">
                    <Lock className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm">256-bit Encryption</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-3 py-1">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm">AI Analysis</span>
                  </div>
                </div>
                <Link href="/document-signature">
                  <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-medium">
                    Get Started with RANGER
                  </Button>
                </Link>
              </div>
              <div>
                <img 
                  src={rangerScreenshot} 
                  alt="RANGER Interface" 
                  className="rounded-xl shadow-2xl border border-amber-500/20"
                />
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">HIPAA Compliant</h3>
                <p className="text-slate-400 text-sm">
                  Full healthcare privacy compliance with audit trails
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
                <p className="text-slate-400 text-sm">
                  AI reviews contracts before you sign
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileSignature className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">E-Signatures</h3>
                <p className="text-slate-400 text-sm">
                  Legally binding with secure PDF generation
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">100% Free</h3>
                <p className="text-slate-400 text-sm">
                  No fees, no premium tiers for veterans
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link href="/hipaa-compliance" className="text-amber-500 hover:text-amber-400 transition-colors text-sm">
                View HIPAA Compliance Details →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
                Why Pay When You've Already Served?
              </h2>
              <p className="text-slate-500 text-lg">
                Compare Nav Perks to leading paid alternatives
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 overflow-hidden">
              <div className="grid grid-cols-4 gap-4 mb-6 pb-4 border-b border-slate-200">
                <div className="font-semibold text-slate-800">Feature</div>
                <div className="text-center font-semibold text-amber-600">Nav Perks</div>
                <div className="text-center font-semibold text-slate-500">ChatGPT Plus</div>
                <div className="text-center font-semibold text-slate-500">DocuSign</div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 items-center py-3">
                  <div className="text-slate-600">Monthly Cost</div>
                  <div className="text-center font-bold text-green-600">$0</div>
                  <div className="text-center text-slate-500">$20/mo</div>
                  <div className="text-center text-slate-500">$25/mo</div>
                </div>
                <div className="grid grid-cols-4 gap-4 items-center py-3 bg-white rounded-lg">
                  <div className="text-slate-600">AI Assistant</div>
                  <div className="text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></div>
                  <div className="text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></div>
                  <div className="text-center text-slate-400">—</div>
                </div>
                <div className="grid grid-cols-4 gap-4 items-center py-3">
                  <div className="text-slate-600">E-Signatures</div>
                  <div className="text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></div>
                  <div className="text-center text-slate-400">—</div>
                  <div className="text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></div>
                </div>
                <div className="grid grid-cols-4 gap-4 items-center py-3 bg-white rounded-lg">
                  <div className="text-slate-600">Video/Audio Gen</div>
                  <div className="text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></div>
                  <div className="text-center text-slate-400">—</div>
                  <div className="text-center text-slate-400">—</div>
                </div>
                <div className="grid grid-cols-4 gap-4 items-center py-3">
                  <div className="text-slate-600">HIPAA Compliant</div>
                  <div className="text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></div>
                  <div className="text-center text-slate-400">—</div>
                  <div className="text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></div>
                </div>
                <div className="grid grid-cols-4 gap-4 items-center py-3 bg-white rounded-lg">
                  <div className="text-slate-600">No Data Tracking</div>
                  <div className="text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></div>
                  <div className="text-center text-slate-400">—</div>
                  <div className="text-center text-slate-400">—</div>
                </div>
                <div className="grid grid-cols-4 gap-4 items-center py-3">
                  <div className="text-slate-600">AI Contract Analysis</div>
                  <div className="text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></div>
                  <div className="text-center text-slate-400">—</div>
                  <div className="text-center text-slate-400">—</div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <p className="text-slate-600 mb-4">
                  <span className="font-semibold text-slate-800">Annual Savings:</span> Up to <span className="text-green-600 font-bold">$540/year</span> compared to paid alternatives
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Enterprise-Grade Security
              </h2>
              <p className="text-slate-400">
                Built with the same standards as Fortune 500 companies
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-white font-medium text-sm">HIPAA Compliant</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-white font-medium text-sm">256-bit SSL</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-white font-medium text-sm">99.9% Uptime</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-white font-medium text-sm">US-Based Servers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2">Is Nav Perks really 100% free?</h3>
                <p className="text-slate-600">
                  Yes. All three platforms (Operator AI, Video & Music Gen, and RANGER) are completely free for verified veterans. No credit card required, no hidden fees, no premium tiers. This is our way of giving back to those who served.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2">How do you verify I'm a veteran?</h3>
                <p className="text-slate-600">
                  We use a simple verification process through Replit authentication. This quick process confirms your veteran status and gives you immediate access to all Nav Perks platforms.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2">Is RANGER really HIPAA compliant?</h3>
                <p className="text-slate-600">
                  Absolutely. RANGER is built with full HIPAA compliance including encrypted data transmission, secure storage, audit trails, and access controls. You can safely handle medical documents, VA paperwork, and sensitive healthcare information.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2">Do you track or sell my data?</h3>
                <p className="text-slate-600">
                  Never. We have a strict zero-tracking policy. Your conversations with Operator AI, your documents in RANGER, and your media in Naval Intelligence are yours alone. We don't sell data, we don't train AI on your content, and we don't share with third parties.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2">What's the catch?</h3>
                <p className="text-slate-600">
                  There is no catch. NavigatorUSA is a veteran-focused organization that believes in supporting those who served. Nav Perks is funded through our other business services, allowing us to offer these enterprise tools at no cost to veterans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto text-lg">
            Join veterans already using Nav Perks. All platforms are completely free—no credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/operator-ai">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Try Operator AI
              </Button>
            </Link>
            <Link href="/naval-intelligence">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Video className="w-4 h-4 mr-2" />
                Try Media Gen
              </Button>
            </Link>
            <Link href="/document-signature">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                <FileSignature className="w-4 h-4 mr-2" />
                Try RANGER
              </Button>
            </Link>
          </div>
          <div className="mt-8">
            <Link href="/hipaa-compliance" className="text-slate-400 hover:text-white transition-colors text-sm">
              View Security & Compliance Details →
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
