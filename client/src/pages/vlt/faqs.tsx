import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
        data-testid={`faq-toggle-${question.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span className="font-medium text-brand-navy">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12">Frequently Asked Questions</h1>
        <p className="mt-4 max-w-3xl">
          Common questions about our services and process.
        </p>

        <div className="mt-8 max-w-3xl">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-12 mb-12">
          <h2 className="text-xl font-semibold">Still Have Questions?</h2>
          <p className="mt-2 text-gray-600 mb-4">
            We're here to help. Start your intake and we'll answer all your questions.
          </p>
          <Link href="/veteran-led-tax/intake">
            <span className="inline-block px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
              Contact Us
            </span>
          </Link>
        </div>
      </Container>
      <Footer />
    </>
  );
}
