import Container from "@/components/Container";

export default function CP14() {
  return (
    <Container>
      <h1 className="text-3xl font-bold mt-12">CP14 Notice</h1>
      <p className="mt-4 max-w-3xl">
        A CP14 notice indicates the IRS believes a balance is due on a tax return.
        It is often the first notice sent after assessment.
      </p>

      <h2 className="text-xl font-semibold mt-8">What To Do</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>Verify the amount</li>
        <li>Check for prior payments</li>
        <li>Note response deadlines</li>
      </ul>

      <a href="/veteran-led-tax/intake" className="btn mt-8">Begin Intake</a>
    </Container>
  );
}
