import { Layout } from "@/components/layout";
import { FileText, BookOpen, HeartPulse, GraduationCap, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Resources() {
  const resources = [
    { icon: FileText, title: "VA Rating Breakdowns", desc: "Detailed guides on how ratings are calculated for specific conditions." },
    { icon: BookOpen, title: "Evidence Checklists", desc: "Step-by-step lists of exactly what you need for your claim." },
    { icon: Home, title: "Home Buying Benefits", desc: "Learn about the $3k-$10k donor benefits available to veterans." },
    { icon: HeartPulse, title: "Healthcare & Mental Health", desc: "Navigating the VA healthcare system and accessing support." },
    { icon: GraduationCap, title: "Entrepreneurship Training", desc: "Courses and guides for starting your own business." },
  ];

  return (
    <Layout>
      <section className="bg-brand-navy text-white py-12 sm:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-5xl font-display mb-4 sm:mb-6">Mission Intel & Resources</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto px-2">
            Knowledge is power. Equip yourself with the guides and tools you need to succeed.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {resources.map((item, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow border-t-4 border-t-brand-red">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 text-brand-navy">
                    <item.icon size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-brand-navy">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
