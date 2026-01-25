import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Intake() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy">Secure Intake</h1>
        <p className="mt-4 max-w-2xl text-gray-700">
          Submitting intake does not create a client relationship.
          Information is reviewed for routing to licensed professionals.
        </p>
      </Container>
      <Footer />
    </>
  );
}
