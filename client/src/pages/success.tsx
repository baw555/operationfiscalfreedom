import { Layout } from "@/components/layout";
import { Star } from "lucide-react";

export default function SuccessStories() {
  return (
    <Layout>
      <section className="bg-brand-gold text-brand-black py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-display mb-6">Mission Accomplished</h1>
          <p className="text-xl font-medium max-w-2xl mx-auto">
            Real stories from veterans who took control of their financial future.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: "Sgt. Miller", branch: "USMC", result: "Rating increased from 30% to 90%", quote: "The software made it impossible to miss a step. I finally got what I deserved." },
              { name: "Lt. Sarah J.", branch: "Navy", result: "Started a consulting gig", quote: "I found my first client on the marketplace within 48 hours. Now I'm fully independent." },
              { name: "Cpl. Rodriguez", branch: "Army", result: "Built a recurring income stream", quote: "I referred 5 buddies to the program. They got help, and I built a steady monthly income." },
              { name: "Capt. Thompson", branch: "Air Force", result: "Launched a tech business", quote: "The veteran business network helped me find my first 10 employees. Invaluable." },
            ].map((story, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} className="text-brand-gold fill-brand-gold" />
                  ))}
                </div>
                <p className="text-lg text-gray-700 italic mb-6">"{story.quote}"</p>
                <div className="border-t pt-4">
                  <p className="font-bold text-brand-navy">{story.name}</p>
                  <p className="text-sm text-gray-500">{story.branch} • {story.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
