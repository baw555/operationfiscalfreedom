import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, FileText, BarChart2 } from "lucide-react";
import softwareMockup from "@assets/generated_images/software_dashboard_mockup.png";

export default function VARatingSoftware() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white pt-20 pb-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/20 border border-brand-green/40 text-brand-green mb-6">
            <span className="font-ui font-bold text-xs uppercase tracking-wider">Free for all Veterans</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display mb-6">Your Free VA Rating Navigation System</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Stop guessing. Start winning. Our software simplifies the entire VA claims process, giving you the roadmap you need.
          </p>
          <Button size="lg" className="bg-brand-green hover:bg-brand-green/90 text-white h-14 px-8 text-lg shadow-xl shadow-brand-green/20">
            <Download className="mr-2 h-5 w-5" /> Download Free Software
          </Button>
        </div>
      </section>

      <section className="-mt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="bg-black rounded-xl shadow-2xl border-4 border-gray-800 overflow-hidden max-w-5xl mx-auto">
             <img 
              src={softwareMockup} 
              alt="Software Dashboard" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display text-brand-navy mb-4">This Software Simplifies Everything</h2>
            <p className="text-gray-600">Everything you need to build a winning claim.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: "Rating Explanations", desc: "Clear, plain-english breakdowns of what ratings mean and how they are calculated." },
              { icon: CheckCircle, title: "Evidence Checklists", desc: "Know exactly what documents and medical evidence you need before you file." },
              { icon: BarChart2, title: "Success Roadmaps", desc: "Step-by-step guidance for filing or appealing to maximize your rating." },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-center hover:border-brand-green/30 transition-colors">
                <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 text-brand-navy border border-gray-100">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-khaki/30 py-20 text-center">
         <div className="container mx-auto px-4">
           <h2 className="text-4xl font-display text-brand-navy mb-6">Don't File Blind. Get The Intel.</h2>
           <Button size="lg" className="bg-brand-navy hover:bg-brand-navy/90 text-white h-14 px-10">
             Access The Tool Now
           </Button>
         </div>
      </section>
    </Layout>
  );
}
