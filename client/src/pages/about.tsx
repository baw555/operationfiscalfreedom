import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function About() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display mb-4 sm:mb-6">About Mission Act Health</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-2">
            Mission Act Health (MAH) was established in 2019 to provide American
            Veterans and their families <strong className="text-white">The Best Care Possible®</strong>.
            Our work addresses the critical gaps in healthcare, mental wellness,
            financial stability, and purpose that too many Veterans face after
            service.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-display text-brand-navy mb-4 sm:mb-6">Our Mission</h2>
            <div className="w-16 h-1 bg-brand-red mb-6" />
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-4xl">
              To provide The Best Care Possible® for American Veterans and their
              families, and reduce suicides by ushering in a new era of coordinated,
              Veteran-centric care.
            </p>
          </div>

          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-display text-brand-navy mb-4 sm:mb-6">Why We Exist</h2>
            <div className="w-16 h-1 bg-brand-red mb-6" />
            <ul className="list-disc pl-6 space-y-3 text-base sm:text-lg text-gray-700 max-w-4xl">
              <li>More than 19 million U.S. Veterans, with over 225,000 transitioning each year</li>
              <li>Over 50% of Veterans do not receive VA services or hold a VA card</li>
              <li>41% are diagnosed with mental health challenges, many without access to care</li>
              <li>Veteran suicide, addiction, and job instability remain national crises</li>
            </ul>
            <p className="mt-6 text-base sm:text-lg text-gray-700 max-w-4xl">
              Mission Act Health was created to replace fragmentation with clarity,
              coordination, and continuous support.
            </p>
          </div>

          <div className="mb-12 sm:mb-16 bg-brand-navy/5 p-6 sm:p-10 rounded-xl">
            <h2 className="text-2xl sm:text-4xl font-display text-brand-navy mb-4 sm:mb-6">NAVIGATOR USA</h2>
            <div className="w-16 h-1 bg-brand-red mb-6" />
            <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-4xl">
              NAVIGATOR USA (NAV-USA) is our nonprofit 501(c)(3) organization and
              digital platform — the national "health tent" through which all
              Veteran services are delivered.
            </p>
            <ul className="list-disc pl-6 space-y-3 text-base sm:text-lg text-gray-700 max-w-4xl">
              <li>AI-driven VA Benefits Coach and disability claims assistance</li>
              <li>Veteran advocates and peer-to-peer support</li>
              <li>Root-cause physical and mental health assessments</li>
              <li>Education on health, wellness, benefits, and life transition</li>
            </ul>
          </div>

          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-display text-brand-navy mb-4 sm:mb-6">Healthcare & Healing</h2>
            <div className="w-16 h-1 bg-brand-red mb-6" />
            <p className="text-base sm:text-lg text-gray-700 mb-4 max-w-4xl">
              Mission Act Health partnered with healthcare leaders to launch the
              first Veteran-centric healthcare plans, covering advanced treatments
              often excluded from traditional insurance and VA care.
            </p>
            <p className="text-base sm:text-lg text-gray-700 max-w-4xl">
              Through Thrive OASIS Advanced Healing Centers, Veterans gain access to
              root-cause medical and mental health therapies addressing PTSD, TBI,
              depression, anxiety, chronic disease, and physical injuries.
            </p>
          </div>

          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-display text-brand-navy mb-4 sm:mb-6">Financial & Vocational Support</h2>
            <div className="w-16 h-1 bg-brand-red mb-6" />
            <p className="text-base sm:text-lg text-gray-700 max-w-4xl">
              We provide financial literacy education, access to planning and debt
              counseling, income-generating opportunities for Veteran families, and
              vocational programs supporting successful transition into civilian
              careers.
            </p>
          </div>

          <div className="mb-12 sm:mb-16 bg-brand-red/5 p-6 sm:p-10 rounded-xl border-l-4 border-brand-red">
            <h2 className="text-2xl sm:text-4xl font-display text-brand-navy mb-4 sm:mb-6">The Benevolence Fund</h2>
            <p className="text-base sm:text-lg text-gray-700 mb-4 max-w-4xl">
              NAVIGATOR USA's Benevolence Fund is a charitable resource established to
              cover physical, mental, and behavioral health expenses not fully paid
              by insurance or government programs.
            </p>
            <p className="text-lg sm:text-xl font-bold text-brand-red max-w-4xl">
              100% of donated funds go directly to serving Veterans and their
              families.
            </p>
          </div>

          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-display text-brand-navy mb-4 sm:mb-6">Our Commitment</h2>
            <div className="w-16 h-1 bg-brand-red mb-6" />
            <p className="text-base sm:text-lg text-gray-700 max-w-4xl">
              Mission Act Health is committed to dignity, accountability, and
              measurable impact. By aligning private enterprise with nonprofit
              purpose, we are building a sustainable ecosystem of care that honors
              service and restores hope.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-display text-white mb-6 sm:mb-8">Join The Mission</h2>
          <Link href="/join" className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-6 sm:px-8 h-12 sm:h-14 cursor-pointer")}>
            Enlist Today
          </Link>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm sm:text-base">Mission Act Health, Inc.</p>
          <p className="text-gray-600 text-sm sm:text-base">Dan Gallo, President · (203) 858-9780 · Dan@Navigator.vet</p>
        </div>
      </section>
    </Layout>
  );
}
