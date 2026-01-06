import { Layout } from "@/components/layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { CheckCircle, Download, FileText, BarChart2 } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import softwareMockup from "@assets/generated_images/software_dashboard_mockup.png";

export default function VARatingSoftware() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white pt-12 sm:pt-20 pb-20 sm:pb-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red mb-4 sm:mb-6">
            <span className="font-ui font-bold text-xs uppercase tracking-wider">Free for all Veterans</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-display mb-4 sm:mb-6">Your Free VA Rating Navigation System</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-10 px-2">
            Stop guessing. Start winning. Our software simplifies the entire VA claims process, giving you the roadmap you need.
          </p>
          <Button size="lg" className="bg-brand-red hover:bg-brand-red/90 text-white h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-lg shadow-xl shadow-brand-red/20 w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Download Free Software
          </Button>
        </div>
      </section>

      <section className="-mt-12 sm:-mt-20 pb-12 sm:pb-20">
        <div className="container mx-auto px-4">
          <div className="bg-black rounded-lg sm:rounded-xl shadow-2xl border-2 sm:border-4 border-gray-800 overflow-hidden max-w-5xl mx-auto">
             <img 
              src={softwareMockup} 
              alt="Software Dashboard" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-display text-brand-navy mb-3 sm:mb-4">This Software Simplifies Everything</h2>
            <p className="text-sm sm:text-base text-gray-600">Everything you need to build a winning claim.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: FileText, title: "Rating Explanations", desc: "Clear, plain-english breakdowns of what ratings mean and how they are calculated." },
              { icon: CheckCircle, title: "Evidence Checklists", desc: "Know exactly what documents and medical evidence you need before you file." },
              { icon: BarChart2, title: "Success Roadmaps", desc: "Step-by-step guidance for filing or appealing to maximize your rating." },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-100 text-center hover:border-brand-red/30 transition-colors">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 sm:mb-6 text-brand-navy border border-gray-100">
                  <item.icon size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-blue/10 py-12 sm:py-20 text-center">
         <div className="container mx-auto px-4">
           <h2 className="text-2xl sm:text-4xl font-display text-brand-navy mb-4 sm:mb-6">Don't File Blind. Get The Intel.</h2>
           <Link href="/join" className={cn(buttonVariants({ size: "lg" }), "bg-brand-navy hover:bg-brand-navy/90 text-white h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-base cursor-pointer w-full sm:w-auto")}>
             Access The Tool Now
           </Link>
         </div>
      </section>
    </Layout>
  );
}
