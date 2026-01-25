import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Disclosures() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-2xl font-bold mt-12 text-brand-navy">Disclosures</h1>
        <p className="mt-4 text-gray-700">
          Veteran Led Tax Solutions is not a law firm or accounting firm.
          No legal or tax advice is provided.
        </p>
      </Container>
      <Footer />
    </>
  );
}
