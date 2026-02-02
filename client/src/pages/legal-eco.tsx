import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Scale, FileText, Shield, Briefcase, Users, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function LegalEco() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <Scale className="w-10 h-10 text-brand-gold" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-white">
                LEGAL ECO
              </h1>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-red via-white to-brand-navy mx-auto mb-6" />
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Legal resources and ecosystem for veteran families
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-2xl">Coming Soon</CardTitle>
                <CardDescription className="text-slate-400">
                  This page is under development. Content will be added shortly.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Scale className="w-12 h-12 text-slate-500" />
                </div>
                <p className="text-slate-400 mb-8">
                  Check back soon for legal resources, partner information, and more.
                </p>
                <Link href="/">
                  <Button className="bg-brand-red hover:bg-brand-red/90">
                    Return to Home <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
