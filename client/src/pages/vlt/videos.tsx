import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Play, ArrowRight } from "lucide-react";

const videos = [
  { title: "Understanding IRS Notices", duration: "5:32", category: "Resolution" },
  { title: "Tax Planning Basics", duration: "8:15", category: "Planning" },
  { title: "S-Corp vs LLC", duration: "12:45", category: "Business" },
  { title: "Quarterly Tax Payments", duration: "6:20", category: "Compliance" },
  { title: "Audit Preparation Tips", duration: "10:30", category: "Resolution" },
  { title: "Year-End Tax Strategies", duration: "15:00", category: "Planning" }
];

export default function Videos() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Video Library
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Educational videos to help you understand tax topics.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.title} className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                  <div className="bg-slate-800 h-40 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {video.category}
                    </span>
                    <h3 className="font-bold text-brand-navy mt-2 mb-1">{video.title}</h3>
                    <p className="text-sm text-gray-500">{video.duration}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Need More Help?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Our team is ready to answer your specific questions.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Start Your Intake
          </Link>
        </div>
      </section>
    </Layout>
  );
}
