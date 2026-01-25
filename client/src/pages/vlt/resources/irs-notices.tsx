import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { AlertTriangle, FileText, ArrowRight, CheckCircle } from "lucide-react";

const noticeTypes = [
  { code: "CP2000", description: "Proposed changes to your return based on third-party info" },
  { code: "CP504", description: "Intent to levy - balance due notice" },
  { code: "CP14", description: "Balance due on your account" },
  { code: "LT11", description: "Final notice of intent to levy" },
  { code: "CP501-CP504", description: "Balance due reminder series" },
  { code: "Letter 1058", description: "Final notice before levy action" }
];

export default function IRSNotices() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions Resources
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              IRS Notices Explained
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Understanding what the IRS is telling you and what to do next.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-12">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-amber-800 mb-2">Don't Ignore IRS Notices</h3>
                  <p className="text-amber-700">
                    Every IRS notice requires a response within a specific timeframe. 
                    Ignoring notices can lead to increased penalties, interest, and collection actions.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-display text-brand-navy mb-6">Common IRS Notices</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {noticeTypes.map((notice) => (
                <Card key={notice.code}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-brand-navy flex-shrink-0 mt-1" />
                      <div>
                        <span className="font-bold text-brand-navy">{notice.code}</span>
                        <p className="text-sm text-gray-600">{notice.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-display text-brand-navy mb-6">What To Do When You Receive a Notice</h2>
              <div className="space-y-4">
                {[
                  "Read the notice carefully and note the response deadline",
                  "Compare the notice information with your records",
                  "Don't panic—many notices are routine and easily resolved",
                  "Respond promptly, even if you need to request more time",
                  "Keep copies of all correspondence",
                  "Consider professional help for complex issues"
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Need Help With an IRS Notice?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            We'll review your notice, explain your options, and help you respond appropriately.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Get Notice Help <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
