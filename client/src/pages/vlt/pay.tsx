import Container from "@/components/Container";

export default function Pay() {
  async function pay() {
    const r = await fetch("/api/checkout", { method: "POST" });
    const j = await r.json();
    window.location.href = j.url;
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold mt-12">Payment</h1>
      <p className="mt-4">Professional Review Fee: $50</p>
      <button onClick={pay} className="btn mt-6">Pay Review Fee</button>
    </Container>
  );
}
