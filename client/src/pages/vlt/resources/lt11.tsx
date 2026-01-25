import Container from "@/components/Container";

export default function LT11() {
  return (
    <Container>
      <h1 className="text-3xl font-bold mt-12">LT11 Notice</h1>
      <p className="mt-4 max-w-3xl">
        LT11 is a Final Notice of Intent to Levy. It provides appeal rights but
        has strict deadlines.
      </p>

      <h2 className="text-xl font-semibold mt-8">Why It Matters</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>Levy action may follow</li>
        <li>Appeal rights are time-limited</li>
      </ul>

      <a href="/veteran-led-tax/intake" className="btn mt-8">Urgent Intake</a>
    </Container>
  );
}
