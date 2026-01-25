import Container from "@/components/Container";

export default function LT11() {
  return (
    <Container>
      <h1 className="text-3xl font-bold mt-12">LT11 Notice</h1>
      <p className="mt-4 max-w-3xl">
        An LT11 is the Final Notice of Intent to Levy. This is a serious notice
        indicating the IRS intends to seize assets if you don't respond.
      </p>

      <h2 className="text-xl font-semibold mt-8">What To Do</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>Do not ignore this notice</li>
        <li>Request a CDP hearing within 30 days</li>
        <li>Seek professional help immediately</li>
      </ul>

      <a href="/veteran-led-tax/intake" className="btn mt-8">Begin Intake</a>
    </Container>
  );
}
