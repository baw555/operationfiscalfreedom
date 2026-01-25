import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Shield, Users, Award, Heart, Star, Flag } from "lucide-react";

export default function OurLegacy() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Our Legacy
            </h1>
            <p className="text-lg sm:text-xl text-brand-gold font-semibold mb-4">
              Under our Commanding Officer, a Highly Decorated Air Force Veteran
            </p>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Built on the principles of service, integrity, and excellence that define military leadership.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display text-brand-navy mb-6">
                  Service Before Self
                </h2>
                <p className="text-gray-600 mb-4">
                  Veteran Led Tax Solutions was founded on the same principles that guide our military: 
                  integrity first, service before self, and excellence in all we do.
                </p>
                <p className="text-gray-600 mb-4">
                  Our team brings military precision and discipline to financial operations, 
                  ensuring every client receives the attention and expertise they deserve.
                </p>
                <p className="text-gray-600">
                  We understand the unique challenges veterans and their families face, 
                  because we've walked that path ourselves.
                </p>
              </div>
              <div className="bg-brand-navy rounded-xl p-8 text-white">
                <Flag className="w-12 h-12 text-brand-gold mb-4" />
                <h3 className="text-xl font-bold mb-4">Our Core Values</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-brand-gold" />
                    <span>Integrity in every transaction</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-brand-gold" />
                    <span>Excellence as the standard</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-brand-gold" />
                    <span>Service to those who served</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-brand-gold" />
                    <span>Mission-focused execution</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Shield, 
                  title: "Military Precision", 
                  desc: "We approach every engagement with the discipline and attention to detail that military service demands." 
                },
                { 
                  icon: Users, 
                  title: "Veteran Owned", 
                  desc: "Leadership by those who have served, bringing unique perspective to financial challenges." 
                },
                { 
                  icon: Heart, 
                  title: "Community Focused", 
                  desc: "Dedicated to serving veterans, military families, and businesses that support them." 
                }
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <item.icon className="w-10 h-10 text-brand-navy mx-auto mb-4" />
                  <h3 className="font-bold text-brand-navy mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Ready to Work Together?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Experience the difference that veteran leadership makes.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </Layout>
  );
}
