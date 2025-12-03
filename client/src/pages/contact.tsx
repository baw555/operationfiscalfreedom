import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <Layout>
      <section className="bg-brand-navy text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-display mb-6">Contact Ops Center</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Questions? Issues? We've got your six. Reach out to our support team.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>General Inquiry</option>
                  <option>Software Support</option>
                  <option>Manual Help Request</option>
                  <option>Business Partnership</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px]" />
              </div>
              <Button className="w-full bg-brand-navy text-white font-bold h-12">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
