import { Layout } from "@/components/layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Heart, Shield, Users, DollarSign, Stethoscope, Star } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function MissionActHealth() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-navy via-brand-navy to-brand-red/30 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-brand-red text-white mb-6 sm:mb-8 shadow-lg">
            <Stethoscope className="w-5 h-5" />
            <span className="font-bold text-sm tracking-wider uppercase">Mission Act Health</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-display mb-6 leading-tight">
            The Best Care Possible<span className="text-brand-red">®</span>
          </h1>
          <p className="text-lg sm:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 px-2">
            For American Veterans and their families through coordinated healthcare, 
            mental wellness, and community support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
            <Link href="/private-doctor" className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold h-14 px-8 text-lg shadow-lg")}>
              Get Started
            </Link>
            <Link href="/contact" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-2 border-white text-white hover:bg-white hover:text-brand-navy h-14 px-8")}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-display text-brand-navy mb-6">Our Mission</h2>
            <div className="w-24 h-1 bg-brand-red mx-auto mb-8" />
            <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed">
              To provide <strong className="text-brand-red">The Best Care Possible®</strong> for American Veterans and 
              their families, and reduce suicides by ushering in a new era of care.
            </p>
          </div>
        </div>
      </section>

      {/* NAVIGATOR USA */}
      <section className="py-16 sm:py-24 bg-brand-navy text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl sm:text-5xl font-display mb-6">NAVIGATOR USA</h2>
                <div className="w-24 h-1 bg-brand-red mb-8" />
                <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-6">
                  NAVIGATOR USA is our <strong className="text-white">501(c)(3) nonprofit</strong> digital platform 
                  providing lifetime, no-cost access to Veteran benefits, advocacy, and coordinated care.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-brand-red">
                    <Shield className="w-5 h-5" />
                    <span className="font-bold">Lifetime Access</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-gold">
                    <Star className="w-5 h-5" />
                    <span className="font-bold">No Cost</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <Users className="w-5 h-5" />
                    <span className="font-bold">Veteran Advocacy</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 p-8 rounded-2xl border border-white/20">
                <div className="text-center">
                  <div className="w-20 h-20 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-display mb-2">501(c)(3) Nonprofit</h3>
                  <p className="text-gray-300">Dedicated to serving those who served us</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benevolence Fund */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-5xl font-display text-brand-navy mb-6">Benevolence Fund</h2>
              <div className="w-24 h-1 bg-brand-red mx-auto mb-8" />
            </div>
            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6">
                    The Benevolence Fund covers medical and mental health expenses not fully paid by 
                    insurance or government programs.
                  </p>
                  <div className="bg-brand-red/10 p-6 rounded-xl border-l-4 border-brand-red">
                    <p className="text-xl font-bold text-brand-navy">
                      100% of donations directly serve Veterans and their families.
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-12 h-12 text-brand-navy" />
                  </div>
                  <h3 className="text-2xl font-display text-brand-navy mb-2">Direct Support</h3>
                  <p className="text-gray-600">Every dollar makes a difference</p>
                  <Link href="/contact" className={cn(buttonVariants(), "bg-brand-red hover:bg-brand-red/90 text-white font-bold mt-6")}>
                    Support the Fund
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-brand-red text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-display mb-6">Join Our Mission</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 text-white/90">
            Together, we can provide The Best Care Possible® for every Veteran and their family.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/join" className={cn(buttonVariants({ size: "lg" }), "bg-white text-brand-red hover:bg-gray-100 font-bold h-14 px-8 shadow-lg")}>
              Get Involved
            </Link>
            <Link href="/contact" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-2 border-white text-white hover:bg-white hover:text-brand-red h-14 px-8")}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
