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
      <section className="bg-brand-navy text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-display mb-6">Mission Intel & Resources</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Knowledge is power. Equip yourself with the guides and tools you need to succeed.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((item, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow border-t-4 border-t-brand-green">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-brand-navy">
                    <item.icon size={24} />
                  </div>
                  <CardTitle className="text-xl font-bold text-brand-navy">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
