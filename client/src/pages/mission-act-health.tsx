import { Layout } from "@/components/layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Shield, CheckCircle, AlertTriangle, FileText, Stethoscope, Heart, MapPin, Phone, ArrowRight, Star } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function MissionActHealth() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-navy via-brand-navy to-brand-red/40 text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red/10 to-brand-blue/10 opacity-50" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-brand-red text-white mb-6 sm:mb-8 shadow-lg shadow-brand-red/30">
            <Stethoscope className="w-5 h-5" />
            <span className="font-bold text-sm tracking-wider uppercase">VA MISSION Act Healthcare</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-display mb-4 sm:mb-6 leading-tight">
            Your Right To
            <br />
            <span className="text-brand-red">Private Healthcare</span>
          </h1>
          <p className="text-lg sm:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 sm:mb-10 px-2">
            The VA MISSION Act gives veterans the power to access private doctors when the VA can't meet your needs. 
            Stop waiting. Start healing.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
            <Link href="/private-doctor" className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold h-14 px-8 text-lg shadow-lg shadow-brand-red/30")}>
              Get Private Doctor Now
            </Link>
            <a href="#eligibility" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-2 border-white text-white hover:bg-white hover:text-brand-navy h-14 px-8")}>
              Check Eligibility
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { stat: "20", label: "Days Max Wait for Primary Care" },
              { stat: "28", label: "Days Max Wait for Specialty" },
              { stat: "30", label: "Min Drive Time Standard" },
              { stat: "100%", label: "Same Copays as VA" },
            ].map((item, i) => (
              <div key={i} className="p-4">
                <div className="text-3xl sm:text-5xl font-display text-brand-red mb-2">{item.stat}</div>
                <div className="text-sm sm:text-base text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is MISSION Act */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-display text-brand-navy mb-4">What is the VA MISSION Act?</h2>
              <div className="w-24 h-1 bg-brand-red mx-auto mb-6" />
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6">
                The <strong>VA Maintaining Internal Systems and Strengthening Integrated Outside Networks (MISSION) Act</strong> was signed into law on June 6, 2018. 
                This landmark legislation fundamentally changed how veterans can access healthcare.
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                Previously, veterans often faced months-long waits for VA appointments with limited options. The MISSION Act consolidated previous 
                community care programs (Veterans Choice Program, PC3, and others) into a single, streamlined Community Care Network that makes 
                it easier than ever for veterans to see private doctors when the VA cannot meet their needs.
              </p>
              <div className="bg-brand-navy text-white p-6 sm:p-8 rounded-xl my-8">
                <p className="text-lg sm:text-xl font-bold mb-2">The Bottom Line:</p>
                <p className="text-base sm:text-lg text-gray-200">
                  If the VA can't see you quickly enough or is too far away, you have the legal right to see a private doctor — 
                  and the VA pays for it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Criteria */}
      <section id="eligibility" className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display text-brand-navy mb-4">Are You Eligible?</h2>
            <div className="w-24 h-1 bg-brand-red mx-auto mb-6" />
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              You may qualify for community care if ANY of these criteria apply to you:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { 
                icon: Clock, 
                title: "Wait Time Standards", 
                desc: "VA can't schedule primary care within 20 days or specialty care within 28 days of your preferred date.",
                color: "brand-red"
              },
              { 
                icon: MapPin, 
                title: "Drive Time Standards", 
                desc: "Nearest VA facility is more than 30 minutes away for primary care or 60 minutes for specialty care.",
                color: "brand-blue"
              },
              { 
                icon: Stethoscope, 
                title: "Best Medical Interest", 
                desc: "Your VA provider determines that community care is in your best medical interest.",
                color: "green-500"
              },
              { 
                icon: FileText, 
                title: "Service Unavailable", 
                desc: "The VA doesn't offer the specific healthcare service you need at any nearby facility.",
                color: "brand-gold"
              },
              { 
                icon: Shield, 
                title: "Quality Standards", 
                desc: "VA cannot provide care that meets quality standards for that particular service.",
                color: "brand-navy"
              },
              { 
                icon: CheckCircle, 
                title: "Grandfathered Status", 
                desc: "You were eligible under previous programs like Veterans Choice and maintain eligibility.",
                color: "brand-red"
              },
            ].map((item, i) => (
              <Card key={i} className="border-t-4 border-t-brand-red hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 pb-6 px-6">
                  <div className={`w-14 h-14 bg-${item.color}/10 rounded-full flex items-center justify-center mb-4 text-${item.color}`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Types of Care */}
      <section className="py-12 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display mb-4">Types of Care Available</h2>
            <div className="w-24 h-1 bg-brand-red mx-auto mb-6" />
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              Community care covers a wide range of medical services:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[
              { icon: Heart, label: "Primary Care" },
              { icon: Stethoscope, label: "Specialty Care" },
              { icon: Shield, label: "Mental Health" },
              { icon: CheckCircle, label: "Physical Therapy" },
              { icon: Star, label: "Dental Care" },
              { icon: FileText, label: "Vision Care" },
              { icon: AlertTriangle, label: "Urgent Care" },
              { icon: Phone, label: "Telehealth" },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 p-4 sm:p-6 rounded-xl text-center border border-white/20 hover:bg-white/20 transition-colors">
                <item.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-brand-red" />
                <span className="font-bold text-sm sm:text-base">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display text-brand-navy mb-4">How It Works</h2>
            <div className="w-24 h-1 bg-brand-red mx-auto mb-6" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              {[
                { 
                  step: "1", 
                  title: "Check Your Eligibility", 
                  desc: "Determine if you meet one of the six eligibility criteria for community care based on wait times, distance, or medical need." 
                },
                { 
                  step: "2", 
                  title: "Request a Referral", 
                  desc: "Contact your VA healthcare team or submit a request through us. Your VA provider can authorize community care if criteria are met." 
                },
                { 
                  step: "3", 
                  title: "Choose Your Provider", 
                  desc: "Select from approved community care providers in your area. We can help connect you with verified providers who work with veterans." 
                },
                { 
                  step: "4", 
                  title: "Receive Care", 
                  desc: "Visit your private provider for treatment. You pay the same copays as you would at a VA facility — the VA covers the rest." 
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 sm:gap-6 items-start">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-brand-red flex items-center justify-center shrink-0 shadow-lg">
                    <span className="text-white font-display text-xl sm:text-2xl">{item.step}</span>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 flex-1 shadow-sm">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2">{item.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-brand-navy text-white p-8 sm:p-12 rounded-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-brand-red" />
            <div className="flex justify-center gap-1 mb-6">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-6 h-6 text-brand-gold fill-brand-gold" />
              ))}
            </div>
            <p className="text-lg sm:text-2xl italic mb-6 leading-relaxed">
              "I waited 4 months for a VA specialist appointment. After learning about my rights under the MISSION Act, 
              I saw a private specialist in just 2 weeks. Same quality care, no more suffering while waiting."
            </p>
            <p className="font-bold text-brand-red">— Army Veteran, Texas</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display text-brand-navy mb-4">Common Questions</h2>
            <div className="w-24 h-1 bg-brand-red mx-auto" />
          </div>

          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {[
              { 
                q: "Do I have to pay more for private care?", 
                a: "No! When you receive approved community care, you pay the same copays you would at a VA facility. The VA covers the rest." 
              },
              { 
                q: "Do I need to be enrolled in VA healthcare?", 
                a: "Yes, you must be enrolled in VA healthcare to be eligible for community care under the MISSION Act." 
              },
              { 
                q: "Can I choose any doctor?", 
                a: "You can choose from providers in the VA's Community Care Network who have agreed to accept VA referrals and payment." 
              },
              { 
                q: "What if my VA provider says I'm not eligible?", 
                a: "You can request a review of your eligibility determination. We can help you understand your rights and options." 
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2">{item.q}</h3>
                <p className="text-sm sm:text-base text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-24 bg-brand-red text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-display mb-4 sm:mb-6">Stop Waiting. Start Healing.</h2>
          <p className="text-base sm:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto text-white/90">
            You've served your country. Now let us help you get the healthcare you've earned — without the wait.
          </p>
          <Link href="/private-doctor" className={cn(buttonVariants({ size: "lg" }), "bg-white text-brand-red hover:bg-gray-100 font-bold px-8 sm:px-12 h-14 sm:h-16 text-lg shadow-xl")}>
            Get Private Doctor Information <ArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
