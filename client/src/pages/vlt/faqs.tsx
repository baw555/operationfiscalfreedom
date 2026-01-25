import Container from "@/components/Container";

export default function FAQs() {
  return (
    <Container>
      <h1 className="text-3xl font-bold mt-12">Frequently Asked Questions</h1>

      <h2 className="mt-8 font-semibold">Do you provide tax or legal advice?</h2>
      <p>No. We provide education and intake coordination only.</p>

      <h2 className="mt-6 font-semibold">Does intake create a client relationship?</h2>
      <p>No. Engagement only occurs with licensed professionals.</p>

      <h2 className="mt-6 font-semibold">Can you guarantee results?</h2>
      <p>No. Outcomes depend on facts and law.</p>
    </Container>
  );
}
