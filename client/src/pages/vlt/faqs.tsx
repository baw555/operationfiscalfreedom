import { Layout } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What services does Veteran Led Tax Solutions offer?",
    answer: "We offer comprehensive tax services including tax preparation, planning, resolution, recovery, payroll, outsourced accounting, fractional CFO services, and entity structuring. We serve individuals, businesses, and veteran-owned enterprises."
  },
  {
    question: "How do I get started?",
    answer: "Start by completing our intake form. We'll review your situation and schedule a consultation to discuss your needs and create an action plan."
  },
  {
    question: "Do you work with clients nationwide?",
    answer: "Yes, we serve clients across all 50 states. Our remote-first approach means you can work with us from anywhere."
  },
  {
    question: "What makes you different from other tax firms?",
    answer: "We're veteran-owned and operated, bringing military precision and discipline to tax services. Our ops-first approach means structured processes, clear documentation, and reliable execution."
  },
  {
    question: "How do I know if I need tax resolution help?",
    answer: "If you've received IRS notices, have unfiled returns, owe back taxes, or are facing collection actions like levies or garnishments, you likely need resolution assistance."
  },
  {
    question: "What is a Fractional CFO?",
    answer: "A Fractional CFO provides executive-level financial leadership on a part-time basis. You get strategic guidance, budgeting, forecasting, and accountability without the cost of a full-time hire."
  },
  {
    question: "Do you offer payment plans?",
    answer: "Yes, we offer flexible payment arrangements for our services. We'll discuss options during your consultation."
  },
  {
    question: "How long does tax preparation take?",
    answer: "Turnaround time depends on complexity. Simple individual returns can be completed in days, while complex business returns may take longer. We'll provide a timeline during intake."
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-brand-navy">{question}</span>
        <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQs() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Veteran Led Tax Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-6 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Common questions about our services and process.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              {faqs.map((faq) => (
                <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display mb-4">Still Have Questions?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            We're here to help. Start your intake and we'll answer all your questions.
          </p>
          <Link 
            href="/veteran-led-tax/intake" 
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8")}
          >
            Contact Us <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
